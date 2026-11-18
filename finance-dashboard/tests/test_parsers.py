"""Parsers, against small synthetic files written in each test (never real statements)."""
import pytest
from pathlib import Path

from finance.inspect import redact
from finance.parsers import generic_csv, generic_pdf, ofx, parse_file, positions_csv
from finance.util import parse_amount, parse_date, txn_id


def write(tmp_path: Path, name: str, text: str) -> Path:
    p = tmp_path / name
    p.write_text(text)
    return p


def test_parse_amount_variants():
    assert parse_amount("$1,234.56") == 1234.56
    assert parse_amount("(12.00)") == -12.0
    assert parse_amount("12.00-") == -12.0
    assert parse_amount("-$5.00") == -5.0
    assert parse_amount("45.00 CR") == 45.0
    assert parse_amount("") is None
    assert parse_amount("--") is None


def test_parse_date_variants():
    assert parse_date("10/14/2026") == "2026-10-14"
    assert parse_date("2026-10-14") == "2026-10-14"
    assert parse_date("Oct 14, 2026") == "2026-10-14"
    assert parse_date("10/14", year_hint=2026) == "2026-10-14"
    assert parse_date("not a date") is None


def test_generic_csv_with_preamble_and_debit_credit(tmp_path):
    p = write(tmp_path, "a.csv", "Account: ****1234\nDownloaded 2026-11-01\n\nDate,Description,Debit,Credit,Balance\n"
                                 "10/02/2026,COFFEE SHOP,4.50,,995.50\n10/01/2026,PAYROLL,,1000.00,1000.00\nTotal,,4.50,1000.00,\n")
    acct = {"type": "checking"}
    assert generic_csv.detect(p, acct)
    r = generic_csv.parse(p, acct)
    assert [(t.date, t.amount) for t in r.transactions] == [("2026-10-02", -4.5), ("2026-10-01", 1000.0)]
    assert r.balances[0].balance == 995.5  # latest day of the month


def test_card_csv_purchases_positive_gets_flipped(tmp_path):
    p = write(tmp_path, "c.csv", "Date,Description,Amount\n10/01/2026,GROCERY,50.00\n10/03/2026,DINER,20.00\n10/20/2026,AUTOPAY PAYMENT - THANK YOU,-70.00\n")
    r = generic_csv.parse(p, {"type": "credit"})
    assert [t.amount for t in r.transactions] == [-50.0, -20.0, 70.0]
    assert r.warnings
    # ... and a card export that is already purchases-negative is left alone
    p2 = write(tmp_path, "d.csv", "Date,Description,Amount\n10/01/2026,GROCERY,-50.00\n10/20/2026,PAYMENT THANK YOU,50.00\n")
    assert [t.amount for t in generic_csv.parse(p2, {"type": "credit"}).transactions] == [-50.0, 50.0]


def test_column_override(tmp_path):
    p = write(tmp_path, "e.csv", "When,Who,How much\n2026-10-01,SHOP,-3.00\n")
    acct = {"type": "checking", "columns": {"date": "When", "description": "Who", "amount": "How much"}}
    r = parse_file(p, {**acct, "parser": "generic_csv"})
    assert r.transactions[0].amount == -3.0 and r.transactions[0].description == "SHOP"


OFX = """OFXHEADER:100
<OFX><BANKMSGSRSV1><STMTTRNRS><STMTRS><BANKTRANLIST>
<STMTTRN><TRNTYPE>DEBIT<DTPOSTED>20261001120000<TRNAMT>-12.34<FITID>1<NAME>STORE<MEMO>memo</STMTTRN>
<STMTTRN><TRNTYPE>CREDIT<DTPOSTED>20261015<TRNAMT>100.00<FITID>2<NAME>DEPOSIT</STMTTRN>
</BANKTRANLIST><LEDGERBAL><BALAMT>587.66<DTASOF>20261031</LEDGERBAL></STMTRS></STMTTRNRS></BANKMSGSRSV1></OFX>"""


def test_ofx_bank(tmp_path):
    p = write(tmp_path, "s.ofx", OFX)
    r = ofx.parse(p, {"type": "savings"})
    assert [(t.date, t.amount, t.description) for t in r.transactions] == [("2026-10-01", -12.34, "STORE memo"), ("2026-10-15", 100.0, "DEPOSIT")]
    assert r.balances[0].date == "2026-10-31" and r.balances[0].balance == 587.66


INV_OFX = """<OFX><INVSTMTMSGSRSV1><INVSTMTTRNRS><INVSTMTRS><DTASOF>20261031
<INVTRANLIST>
<INCOME><INVTRAN><FITID>1<DTTRADE>20261015</INVTRAN><SECID><UNIQUEID>922908769<UNIQUEIDTYPE>CUSIP</SECID><INCOMETYPE>DIV<TOTAL>25.00</INCOME>
<BUYSTOCK><INVBUY><INVTRAN><FITID>2<DTTRADE>20261016</INVTRAN><SECID><UNIQUEID>922908769</SECID><UNITS>2<UNITPRICE>250<TOTAL>-500.00</INVBUY><BUYTYPE>BUY</BUYSTOCK>
<INVBANKTRAN><STMTTRN><TRNTYPE>CREDIT<DTPOSTED>20261014<TRNAMT>500.00<FITID>3<NAME>TRANSFER IN</STMTTRN></INVBANKTRAN>
</INVTRANLIST>
<INVPOSLIST><POSSTOCK><INVPOS><SECID><UNIQUEID>922908769</SECID><HELDINACCT>CASH<POSTYPE>LONG<UNITS>10<UNITPRICE>260<MKTVAL>2600<DTPRICEASOF>20261031</INVPOS></POSSTOCK></INVPOSLIST>
<INVBAL><AVAILCASH>100</INVBAL>
</INVSTMTRS></INVSTMTTRNRS></INVSTMTMSGSRSV1>
<SECLISTMSGSRSV1><SECLIST><STOCKINFO><SECINFO><SECID><UNIQUEID>922908769</SECID><SECNAME>Vanguard Total Stock<TICKER>VTI</SECINFO></STOCKINFO></SECLIST></SECLISTMSGSRSV1></OFX>"""


def test_ofx_investments(tmp_path):
    r = ofx.parse(write(tmp_path, "i.qfx", INV_OFX), {"type": "brokerage"})
    assert {(h.symbol, h.market_value) for h in r.holdings} == {("VTI", 2600.0), ("CASH", 100.0)}
    assert r.balances[0].balance == 2700.0
    assert sorted((f.type, f.amount) for f in r.flows) == [("buy", -500.0), ("contribution", 500.0), ("dividend", 25.0)]


def test_positions_csv(tmp_path):
    p = write(tmp_path, "positions_2026-10-31.csv",
              "Account Number,Symbol,Description,Quantity,Last Price,Current Value,Cost Basis Total\n"
              "X1,SPAXX**,MONEY MARKET,,,\"$1,000.00\",\nX1,VTI,VANGUARD,10,$250.00,\"$2,500.00\",\"$2,000.00\"\n"
              "X1,VTI,VANGUARD,2,$250.00,$500.00,$450.00\n\nDate downloaded Nov-01-2026\n")
    assert positions_csv.detect(p, {})
    r = positions_csv.parse(p, {})
    hold = {h.symbol: h for h in r.holdings}
    assert hold["CASH"].market_value == 1000 and hold["VTI"].quantity == 12 and hold["VTI"].cost_basis == 2450
    assert r.balances[0].date == "2026-10-31" and r.balances[0].balance == 4000


CARD_PDF_LINES = """EXAMPLE CARD
Statement Period 12/05/2025 - 01/04/2026
Previous Balance $100.00
New Balance $135.50
Payments and Credits
12/20  ONLINE PAYMENT THANK YOU  -$100.00
Purchases
12/28  GROCERY STORE  $85.50
01/02  COFFEE  $50.00
Total Purchases $135.50""".splitlines()


def test_pdf_lines_reconcile_and_cross_year():
    r = generic_pdf.parse_lines(CARD_PDF_LINES, {"type": "credit"})
    assert [(t.date, t.amount) for t in r.transactions] == [("2025-12-20", 100.0), ("2025-12-28", -85.5), ("2026-01-02", -50.0)]
    assert r.reconciled is True
    assert r.balances[0].balance == -135.5


def test_pdf_lines_that_do_not_add_up_are_flagged():
    broken = [l for l in CARD_PDF_LINES if "COFFEE" not in l]  # a row the parser "missed"
    r = generic_pdf.parse_lines(broken, {"type": "credit"})
    assert r.reconciled is False and "does not reconcile" in r.warnings[0]


def test_bank_pdf_sections():
    lines = ["Statement Period October 1, 2026 through October 31, 2026", "Beginning Balance $1,000.00",
             "Deposits and Additions", "10/15 PAYROLL 2,000.00", "Electronic Withdrawals", "10/16 RENT 1,500.00",
             "10/20 UTILITY CO 100.00", "Ending Balance $1,400.00"]
    r = generic_pdf.parse_lines(lines, {"type": "checking"})
    assert [t.amount for t in r.transactions] == [2000.0, -1500.0, -100.0] and r.reconciled


def test_redact_keeps_structure_only():
    out = redact("10/14  SAFEWAY #1234 OAKLAND  $45.67  Balance")
    assert out == "99/99  xxxxxxx #9999 xxxxxxx  $99.99  Balance"


def test_txn_id_distinguishes_same_day_repeats():
    a = txn_id("acct", "2026-10-01", -4.5, "Coffee", 1)
    assert a == txn_id("acct", "2026-10-01", -4.5, "COFFEE ", 1)
    assert a != txn_id("acct", "2026-10-01", -4.5, "Coffee", 2)


def test_wells_fargo_headerless_csv(tmp_path):
    from finance.parsers import wells_fargo_csv
    p = write(tmp_path, "Checking1.csv", '"10/14/2026","-45.67","*","","PURCHASE AUTHORIZED ON 10/12 SAFEWAY #1234"\n'
                                         '"10/15/2026","2500.00","*","","ACME PAYROLL"\n"10/16/2026","-100.00","*","1042","CHECK"\n')
    assert wells_fargo_csv.detect(p, {}) and not generic_csv.detect(p, {})
    r = parse_file(p, {"type": "checking"})
    assert r.parser == "wells_fargo_csv"
    assert [(t.date, t.amount, t.description) for t in r.transactions] == [
        ("2026-10-14", -45.67, "PURCHASE AUTHORIZED ON 10/12 SAFEWAY #1234"), ("2026-10-15", 2500.0, "ACME PAYROLL"), ("2026-10-16", -100.0, "CHECK CHECK #1042")]


def test_amex_csv_layout(tmp_path):
    p = write(tmp_path, "activity.csv",
              "Date,Description,Card Member,Account #,Amount,Extended Details,Appears On Your Statement As,Address,City/State,Zip Code,Country,Reference,Category\n"
              "10/03/2026,TRADER JOE'S,A MEMBER,-91000,52.10,,TRADER JOE'S,,,,US,'1',Merchandise & Supplies-Groceries\n"
              "10/20/2026,AUTOPAY PAYMENT RECEIVED - THANK YOU,A MEMBER,-91000,-52.10,,,,,,,'2',\n")
    r = parse_file(p, {"type": "credit", "flip_sign": True})
    assert [(t.amount, t.category) for t in r.transactions] == [(-52.1, "Merchandise & Supplies-Groceries"), (52.1, None)]


def test_amex_group_subcategory_mapping():
    import yaml
    from finance.categorize import Categorizer
    from finance.config import PKG_ROOT
    c = Categorizer({}, yaml.safe_load(open(PKG_ROOT / "finance" / "default_rules.yaml")))
    assert c.source_lookup("Merchandise & Supplies-Groceries") == "Groceries"
    assert c.source_lookup("Restaurant-Restaurant") == "Dining"
    assert c.source_lookup("Travel-Airline") == "Travel"
    assert c.source_lookup("Merchandise & Supplies-Electronics Stores") == "Shopping"  # falls back to the group


def test_positions_xlsx(tmp_path):
    openpyxl = pytest.importorskip("openpyxl")
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.append(["Holdings as of 10/31/2026"])
    ws.append(["Symbol", "Security Description", "Quantity", "Price", "Market Value"])
    ws.append(["VTI", "VANGUARD TOTAL", 10, 250.0, 2500.0])
    p = tmp_path / "holdings.xlsx"
    wb.save(p)
    r = parse_file(p, {"type": "brokerage"})
    assert r.parser == "positions_csv" and r.holdings[0].market_value == 2500 and r.balances[0].date == "2026-10-31"
