"""Layouts seen in real exports (Wells Fargo with header, Marcus PDF activity table, NetX holdings .xlsx),
recreated with made-up names and numbers, plus funded_by back-filling and transfer safety."""
import csv
from datetime import date

import pytest
import yaml

from finance import db
from finance.build import compute
from finance.categorize import Categorizer
from finance.config import PKG_ROOT, Workspace
from finance.ingest import ingest
from finance.parsers import generic_pdf, parse_file

DEFAULTS = yaml.safe_load(open(PKG_ROOT / "finance" / "default_rules.yaml"))

MARCUS_LIKE = """ONLINE SAVINGS
ACCOUNT STATEMENT
STATEMENT SUMMARY as of 10/31/2026 ACCOUNT DETAILS
Beginning Balance $10,000.00 Statement Period 10/01/2026 to 10/31/2026
Deposits and Other Credits $520.50 Days in Statement Period 31
Interest Paid this Period $20.50 Annual Percentage Yield Earned 3.50%
Withdrawals and Other Debits $2,000.00 Total Interest Paid this Year $150.00
Ending Balance $8,520.50
ACCOUNT ACTIVITY
Date Description Credits Debits Balance
10/01/2026 Beginning Balance $10,000.00
10/06/2026 ACH Withdrawal external transfer to Example Bank $2,000.00 $8,000.00
(Checking) account ****************1234
10/15/2026 ACH Deposit transfer from Example Bank $500.00 $8,500.00
10/31/2026 Interest Paid $20.50 $8,520.50
10/31/2026 Ending Balance $8,520.50""".splitlines()


def test_marcus_like_activity_table_reconciles():
    r = generic_pdf.parse_lines(MARCUS_LIKE, {"type": "savings"})
    assert [(t.date, t.amount) for t in r.transactions] == [("2026-10-06", -2000.0), ("2026-10-15", 500.0), ("2026-10-31", 20.5)]
    assert r.reconciled is True and r.balances[0].date == "2026-10-31" and r.balances[0].balance == 8520.5


def test_running_balance_sign_on_a_card_statement():
    lines = ["Statement Period 10/01/2026 to 10/31/2026", "Previous Balance $100.00", "New Balance $130.00",
             "10/02/2026 PAYMENT $100.00 $0.00", "10/05/2026 STORE $130.00 $130.00"]
    r = generic_pdf.parse_lines(lines, {"type": "credit"})
    assert [t.amount for t in r.transactions] == [100.0, -130.0] and r.reconciled


def test_wells_fargo_with_header_skips_pending(tmp_path):
    p = tmp_path / "Checking.csv"
    p.write_text('"DATE","DESCRIPTION","AMOUNT","CHECK #","STATUS"\n"10/02/2026","COFFEE","-4.50","","Pending"\n'
                 '"10/01/2026","EXAMPLE PAYROLL","1000.00","","Posted"\n')
    r = parse_file(p, {"type": "checking"})
    assert [(t.date, t.amount) for t in r.transactions] == [("2026-10-01", 1000.0)]
    assert "pending" in r.warnings[0]


def netx_like_xlsx(path, as_of="11/14/2026"):
    openpyxl = pytest.importorskip("openpyxl")
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Holdings"
    for row in [[], [None, "Holdings"], [], [None, "Account Number: XXX-0000"], [None, "Total Market Value: $3,100.00"],
                [None, f"Holdings as of : {as_of}"], [],
                [None, "Security ID", "CUSIP", "Account Number", "Account Nickname/Title", "Description", "Asset Classification", "Quantity",
                 "Account Type", "Price", "Price as of Date", "Exchange", "Change Price Amount", "Change Price %", "Market Value",
                 "Market Value Change", "Gain/Loss $", "Gain/Loss %"],
                [None, "VTI", "000000000", "X0", None, "EXAMPLE TOTAL MARKET ETF", "Mutual Funds", 10, "Cash", 250.0, None, "XX", 1, 0.1, 2500.0, 10, 100.0, 0.04],
                [None, "ABCD", "000000001", "X0", None, "EXAMPLE CORP", "Equities", 5, "Cash", 100.0, None, "XX", 1, 0.1, 500.0, 5, -50.0, -0.1],
                [None, "QACDS0000", "QACDS0000", "X0", None, "EXAMPLE SWEEP", "Cash, Money Funds and Bank Deposits", 100.0, "Cash", 1, None, "", 0, 0, 100.0, 0, 0, 0]]:
        ws.append(row)
    wb.save(path)


def test_netx_like_holdings(tmp_path):
    p = tmp_path / "Net_X_Holdings.xlsx"
    netx_like_xlsx(p)
    r = parse_file(p, {"type": "brokerage"})
    h = {x.symbol: x for x in r.holdings}
    assert set(h) == {"VTI", "ABCD", "CASH"} and h["CASH"].market_value == 100
    assert h["VTI"].cost_basis == 2400 and h["ABCD"].cost_basis == 550
    assert r.balances[0].date == "2026-11-14" and r.balances[0].balance == 3100


@pytest.mark.parametrize("desc,amount,cat", [
    ("EXAMPLE LENDER   MTG PYMTS  110326 0000000000", -2000, "Rent/Mortgage"),
    ("EXAMPLE ENERGY ACH DR 000000", -60, "Utilities"),
    ("AMERICAN EXPRESS ACH PMT 000000 M0000", -900, "Transfer"),
    ("PERSHING         BROKERAGE  261112 XXX-000000-0", -2000, "Investments"),
    ("FID BKG SVC LLC  MONEYLINE  260804 X00000000", -1000, "Investments"),
    ("MOBILE DEPOSIT : REF NUMBER :000000000000", 100, "Income:Other"),
])
def test_rules_for_real_descriptions(desc, amount, cat):
    assert Categorizer({}, DEFAULTS).apply(desc, desc, amount, None)[1] == cat


def test_amex_categories():
    c = Categorizer({}, DEFAULTS)
    assert c.source_lookup("Entertainment-Associations") == "Subscriptions"
    assert c.source_lookup("Business Services-Other Services") == "Services"


def write_wf(path, rows):
    with open(path, "w", newline="") as f:
        w = csv.writer(f, quoting=csv.QUOTE_ALL)
        w.writerow(["DATE", "DESCRIPTION", "AMOUNT", "CHECK #", "STATUS"])
        for d, desc, a in rows:
            w.writerow([d, desc, f"{a:.2f}", "", "Posted"])


@pytest.fixture
def household(tmp_path):
    """Checking + savings; a brokerage funded from savings in Aug-Nov with its first holdings file in
    November; an IRA funded once with no statement; business deposits; payments to an untracked card."""
    ws = Workspace(tmp_path / "ws")
    ws.init()
    (ws.config_dir / "accounts.yaml").write_text(yaml.safe_dump({"accounts": {
        "chk": {"name": "Checking", "type": "checking"},
        "sav": {"name": "Savings", "type": "savings"},
        "brk": {"name": "Brokerage", "type": "brokerage", "tax": "taxable", "funded_by": "PERSHING"},
        "ira": {"name": "IRA", "type": "retirement", "tax": "roth", "funded_by": "FID BKG SVC"},
    }}))
    (ws.config_dir / "rules.yaml").write_text(yaml.safe_dump({"rules": [
        {"match": "TRANSFER FROM .*BUSINESS CHECKING", "category": "Income:Business", "when": "in"},
        {"match": "ACTIVE CASH VISA", "category": "Credit Card (untracked)", "when": "out"},
    ]}))
    (ws.config_dir / "balances.yaml").write_text(yaml.safe_dump({"anchors": {"chk": {"2026-11-30": 5000.0}, "sav": {"2026-11-30": 20000.0}}}))
    for k in ("chk", "sav", "brk"):
        (ws.inbox / k).mkdir(parents=True)
    write_wf(ws.inbox / "chk" / "Checking.csv", [
        ("07/01/2026", "EXAMPLE PAYROLL", 4000), ("08/01/2026", "EXAMPLE PAYROLL", 4000), ("09/01/2026", "EXAMPLE PAYROLL", 4000),
        ("10/01/2026", "EXAMPLE PAYROLL", 4000), ("11/01/2026", "EXAMPLE PAYROLL", 4000),
        ("08/05/2026", "ONLINE TRANSFER TO EXAMPLE SAVINGS XXXXXX0001 REF #X", -1000),
        ("09/10/2026", "ONLINE TRANSFER REF #X TO WELLS FARGO ACTIVE CASH VISA CARD XXXX0002", -300),
    ])
    write_wf(ws.inbox / "sav" / "Savings.csv", [
        ("08/05/2026", "ONLINE TRANSFER FROM EXAMPLE EVERYDAY CHECKING XXXXXX0003 REF #X", 1000),
        ("08/04/2026", "FID BKG SVC LLC  MONEYLINE  260804 X0", -5000),
        ("08/20/2026", "PERSHING         BROKERAGE  260819 X0", -3000),
        ("09/24/2026", "PERSHING         BROKERAGE  260923 X0", -3000),
        ("10/19/2026", "PERSHING         BROKERAGE  261016 X0", -1500),
        ("11/20/2026", "PERSHING         BROKERAGE  261119 X0", -2000),
        ("09/10/2026", "ONLINE TRANSFER FROM EXAMPLE LLC BUSINESS CHECKING XXXXXX0004 REF #X", 1000),
        ("09/10/2026", "ONLINE TRANSFER TO EXAMPLE EVERYDAY CHECKING XXXXXX0003 REF #X", -1000),
    ])
    netx_like_xlsx(ws.inbox / "brk" / "Net_X_Holdings.xlsx", as_of="11/14/2026")  # worth 3,100 then
    stats = ingest(ws, log=lambda m: None)
    assert stats.get("errors", 0) == 0
    return ws, compute(ws, as_of="2026-11-30")


def test_no_gap_before_first_statement(household):
    ws, d = household
    nw, months = d["networth"], d["networth"]["months"]
    brk = dict(zip(months, nw["by_account"]["brk"]))
    assert brk["2026-07"] is None                       # before any money went in
    assert (brk["2026-08"], brk["2026-09"], brk["2026-10"]) == (3000, 6000, 7500)   # money put in so far
    assert brk["2026-11"] == 3100 + 2000                # statement value + the deposit made after it
    assert nw["estimated_until"]["brk"] == "2026-11-14" and nw["estimated_until"]["ira"] is None
    assert set(nw["by_account"]["ira"][months.index("2026-08"):]) == {5000}


def test_funding_is_investing_not_spending(household):
    ws, d = household
    con = db.connect(ws.db_path)
    cats = dict(con.execute("SELECT description_raw, category FROM transactions WHERE description_raw LIKE 'PERSHING%' OR description_raw LIKE 'FID%'").fetchall())
    assert set(cats.values()) == {"Investments"}
    assert sum(m["invested"] for m in d["summary"]) == 14500
    g = next(a for a in d["growth"]["accounts"] if a["id"] == "brk")
    assert g["contributed"] == 9500 and g["value"] == 5100 and g["growth"] == pytest.approx(5100 - 9500)


def test_business_income_and_untracked_card(household):
    ws, d = household
    sep = next(m for m in d["summary"] if m["month"] == "2026-09")
    assert sep["income"] == 4000 + 1000                     # payroll + business deposit
    assert sep["by_category"].get("Credit Card (untracked)") == 300
    con = db.connect(ws.db_path)
    biz = con.execute("SELECT category, is_transfer FROM transactions WHERE description_raw LIKE '%BUSINESS CHECKING%'").fetchone()
    assert tuple(biz) == ("Income:Business", 0)              # never paired with the same-day $1,000 transfer
    pairs = con.execute("SELECT COUNT(*) FROM transactions WHERE category='Transfer' AND transfer_pair IS NOT NULL").fetchone()[0]
    assert pairs == 2                                        # the Aug checking->savings pair only
    assert d["unmatched_transfers"] == []                    # nothing repeated enough to flag


def test_payments_to_a_card_that_is_not_imported(tmp_path):
    """Two cards paid with the same wording: payments that pair with the imported card stay transfers,
    the rest count as spending, except near the edges of the imported card's dates."""
    ws = Workspace(tmp_path / "w")
    ws.init()
    (ws.config_dir / "accounts.yaml").write_text(yaml.safe_dump({"accounts": {
        "chk": {"name": "Checking", "type": "checking"}, "card": {"name": "Card", "type": "credit", "flip_sign": True}}}))
    (ws.config_dir / "rules.yaml").write_text(yaml.safe_dump({"rules": [
        {"match": "EXAMPLE CARD (ACH PMT|RETRY PYMT)", "category": "Transfer", "if_unmatched": "Card (spouse)", "pairs_with": "card"}]}))
    for k in ("chk", "card"):
        (ws.inbox / k).mkdir(parents=True)
    write_wf(ws.inbox / "chk" / "Checking.csv", [
        ("09/10/2026", "EXAMPLE CARD ACH PMT 000000", -300), ("10/10/2026", "EXAMPLE CARD ACH PMT 000000", -400),  # pay my card
        ("09/20/2026", "EXAMPLE CARD ACH PMT 000000", -250), ("10/22/2026", "EXAMPLE CARD RETRY PYMT 000000", -175),  # spouse's card
        ("12/05/2026", "EXAMPLE CARD ACH PMT 000000", -500),  # after the card file ends: can't tell, stays a transfer
    ])
    (ws.inbox / "card" / "activity.csv").write_text(
        "Date,Description,Amount\n09/01/2026,STORE,300.00\n09/11/2026,MOBILE PAYMENT - THANK YOU,-300.00\n"
        "10/01/2026,STORE,400.00\n10/11/2026,MOBILE PAYMENT - THANK YOU,-400.00\n11/15/2026,STORE,20.00\n")
    ingest(ws, log=lambda m: None)
    con = db.connect(ws.db_path)
    rows = {(r["date"], r["amount"]): (r["category"], r["is_transfer"]) for r in con.execute(
        "SELECT date, amount, category, is_transfer FROM transactions WHERE account_id='chk'")}
    assert rows[("2026-09-10", -300)] == ("Transfer", 1) and rows[("2026-10-10", -400)] == ("Transfer", 1)
    assert rows[("2026-09-20", -250)] == ("Card (spouse)", 0) and rows[("2026-10-22", -175)] == ("Card (spouse)", 0)
    assert rows[("2026-12-05", -500)] == ("Transfer", 1)
    d = compute(ws, as_of="2026-12-31")
    spend = {m["month"]: m["by_category"].get("Card (spouse)", 0) for m in d["summary"]}
    assert spend["2026-09"] == 250 and spend["2026-10"] == 175 and sum(spend.values()) == 425  # counted once
    assert d["unmatched_counted"] == [{"category": "Card (spouse)", "n": 2, "total": 425.0, "first": "2026-09-20", "last": "2026-10-22"}]
    # The card's own purchases are still its own spending; the paired payments are not counted twice.
    assert sum(m["by_category"].get("Uncategorized", 0) for m in d["summary"]) == 720
