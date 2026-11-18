"""Categorization, transfers, metrics, investments, insights, and a full demo run."""
from datetime import date

import pytest
import yaml

from finance import db
from finance.build import compute, render
from finance.categorize import Categorizer
from finance.config import PKG_ROOT, Workspace
from finance.ingest import classify_flow, ingest
from finance.investments import modified_dietz, xirr
from finance.metrics import monthly_summary
from finance.normalize import merchant
from finance.recurring import detect
from finance.sample import make_demo
from finance.transfers import match_transfers

DEFAULTS = yaml.safe_load(open(PKG_ROOT / "finance" / "default_rules.yaml"))


@pytest.mark.parametrize("desc,cat", [
    ("CVS/PHARMACY #09123 OAKLAND CA", "Health"), ("ENTERPRISE RENT-A-CAR", "Travel"), ("AVALON APARTMENTS RENT", "Rent/Mortgage"),
    ("ONLINE TRANSFER TO SAV XXXX4821", "Transfer"), ("UBER EATS", "Dining"), ("UBER *TRIP", "Transport"),
    ("NETFLIX.COM", "Subscriptions"), ("WATERFRONT GRILL", "Dining"), ("MONTHLY SERVICE FEE", "Fees & Interest"),
])
def test_default_rules(desc, cat):
    assert Categorizer({}, DEFAULTS).apply(desc, merchant(desc), -10, None)[1] == cat


def test_user_rules_win_and_add_tags():
    user = {"rules": [{"match": "FIGMA", "tags": ["business"]}, {"match": "FIGMA", "category": "Software"}]}
    m, cat, tags = Categorizer(user, DEFAULTS).apply("FIGMA INC", "Figma", -15, None)
    assert cat == "Software" and tags == ["business"]
    # A transfer is not tagged as a fee just because "TRANSFER" contains "NSF".
    assert Categorizer({}, DEFAULTS).apply("ONLINE TRANSFER TO SAV", "x", -5, None)[2] == []


def test_source_category_used_as_fallback():
    assert Categorizer({}, DEFAULTS).apply("ZZQ LOCAL PLACE", "Zzq Local Place", -5, "Restaurant")[1] == "Dining"


def test_when_in_out():
    c = Categorizer({}, DEFAULTS)
    assert c.apply("ACME PAYROLL", "Acme", 1000, None)[1] == "Income:Salary"
    assert c.apply("ACME PAYROLL", "Acme", -1000, None)[1] != "Income:Salary"


@pytest.mark.parametrize("raw,clean", [
    ("SQ *BLUE BOTTLE COFFEE OAKLAND CA", "Blue Bottle Coffee"), ("TST* SOBA ICHI OAKLAND CA", "Soba Ichi"),
    ("AMZN MKTP US*2K4L81", "Amazon"), ("LA TAQUERIA SAN FRANCISCO CA", "La Taqueria"), ("HOME DEPOT #0632 EMERYVILLE", "Home Depot"),
])
def test_merchant_names(raw, clean):
    assert merchant(raw) == clean


def make_db(tmp_path, accounts, txns, flows=()):
    con = db.connect(tmp_path / "t.db")
    for aid, t in accounts.items():
        db.upsert_account(con, aid, {"type": t})
    for i, (a, d, amt, cat) in enumerate(txns):
        con.execute("INSERT INTO transactions (id, account_id, date, amount, description_raw, merchant, category) VALUES (?,?,?,?,?,?,?)",
                    (f"t{i}", a, d, amt, "x", "x", cat))
    for i, (a, d, typ, amt) in enumerate(flows):
        con.execute("INSERT INTO investment_flows VALUES (?,?,?,?,?,?,?)", (f"f{i}", a, d, typ, amt, "", ""))
    return con


def test_transfer_matching(tmp_path):
    con = make_db(tmp_path, {"chk": "checking", "card": "credit", "brk": "brokerage"}, [
        ("chk", "2026-10-25", -500.0, "Uncategorized"), ("card", "2026-10-26", 500.0, "Transfer"),  # card payment
        ("chk", "2026-10-03", -40.0, "Shopping"), ("card", "2026-10-04", 40.0, "Shopping"),         # small refund: not a transfer
        ("chk", "2026-10-16", -1000.0, "Uncategorized"),                                            # to brokerage
    ], flows=[("brk", "2026-10-16", "contribution", 1000.0)])
    assert match_transfers(con) == 2
    rows = dict(con.execute("SELECT id, category FROM transactions").fetchall())
    assert rows == {"t0": "Transfer", "t1": "Transfer", "t2": "Shopping", "t3": "Shopping", "t4": "Investments"}


def test_monthly_summary_definitions():
    T = lambda d, a, c, tr=0, at="checking": {"date": d, "amount": a, "category": c, "is_transfer": tr, "account_type": at}
    s = monthly_summary([T("2026-10-01", 5000, "Income:Salary"), T("2026-10-02", -1200, "Rent/Mortgage"), T("2026-10-03", -100, "Shopping"),
                         T("2026-10-04", 30, "Shopping"), T("2026-10-05", -500, "Transfer", 1), T("2026-10-06", -1000, "Investments"),
                         T("2026-10-07", 25, "Income:Interest", at="brokerage"), T("2026-12-01", -10, "Dining")])
    oct_ = s[0]
    assert (oct_["income"], oct_["spending"], oct_["invested"]) == (5000, 1270, 1000)  # refund nets against Shopping
    assert oct_["by_category"] == {"Rent/Mortgage": 1200, "Shopping": 70}
    assert oct_["savings_rate"] == round(3730 / 5000, 4)
    assert [m["month"] for m in s] == ["2026-10", "2026-11", "2026-12"]  # empty months filled


def test_xirr_and_dietz():
    # $1000 in, $1100 out exactly one year later -> 10%.
    assert xirr([("2025-01-01", -1000), ("2026-01-01", 1100)]) == pytest.approx(0.10, abs=1e-3)
    # Two deposits; known answer from a spreadsheet XIRR.
    assert xirr([("2025-01-01", -1000), ("2025-07-01", -1000), ("2026-01-01", 2200)]) == pytest.approx(0.1349, abs=2e-3)
    # 1000 -> 1600 with a 500 deposit mid-period: gain 100 on average capital 1250 = 8%.
    assert modified_dietz(1000, 1600, [(0.5, 500)]) == pytest.approx(0.08)


def test_recurring_detection():
    txns = [{"date": f"2026-{m:02d}-08", "amount": -15.49 if m < 9 else -17.99, "merchant": "Netflix", "account_id": "c",
             "category": "Subscriptions", "is_transfer": 0} for m in range(1, 11)]
    txns += [{"date": d, "amount": -50, "merchant": "Shell", "account_id": "c", "category": "Transport", "is_transfer": 0}
             for d in ("2026-01-02", "2026-01-28", "2026-03-15", "2026-04-01", "2026-05-25", "2026-06-09")]
    r = detect(txns, "2026-10-20")
    assert [x["merchant"] for x in r] == ["Netflix"]
    assert r[0]["cadence"] == "monthly" and r[0]["price_increase"] == {"date": "2026-09-08", "from": 15.49, "to": 17.99}


def test_classify_flow():
    assert classify_flow("ELECTRONIC FUNDS TRANSFER RECEIVED", 1000) == "contribution"
    assert classify_flow("YOU BOUGHT VTI", -500) == "buy"
    assert classify_flow("DIVIDEND RECEIVED VTI", 12) == "dividend"
    assert classify_flow("REINVESTMENT VTI", -12) == "buy"
    assert classify_flow("ADVISORY FEE", -10) == "fee"


@pytest.fixture(scope="module")
def demo(tmp_path_factory):
    ws = Workspace(tmp_path_factory.mktemp("demo"))
    make_demo(ws, end=date(2026, 11, 18))
    stats = ingest(ws, log=lambda m: None)
    return ws, stats, compute(ws, as_of="2026-11-18")


def test_demo_imports_cleanly(demo):
    ws, stats, data = demo
    assert stats.get("errors", 0) == 0 and stats.get("skipped", 0) == 0
    assert sum(1 for i in data["imports"] if i["status"] == "verified") == 8  # every PDF statement reconciled


def test_demo_reimport_is_noop_and_overlap_dedupes(demo):
    ws, _, data = demo
    stats = ingest(ws, log=lambda m: None)
    assert stats.get("files", 0) == 0 and stats["unchanged"] > 0
    con = db.connect(ws.db_path)
    # The two card exports overlap by 3 months; overlapping rows are stored once.
    dupes = con.execute("SELECT COUNT(*) FROM (SELECT date, amount, description_raw, COUNT(*) c FROM transactions "
                        "WHERE account_id='rewards-card' AND description_raw NOT LIKE 'CHIPOTLE%' GROUP BY 1,2,3 HAVING c > 1)").fetchone()[0]
    assert dupes == 0
    # Card payments are matched as transfers on both sides.
    unmatched = con.execute("SELECT COUNT(*) FROM transactions WHERE description_raw LIKE '%AUTOPAY%' AND is_transfer=0").fetchone()[0]
    assert unmatched == 0


def test_demo_numbers_are_consistent(demo):
    _, _, d = demo
    a, g, nw = d["allocation"], d["growth"], d["networth"]
    assert sum(r["pct"] for r in a["by_class"]) == pytest.approx(100, abs=0.05)
    assert sum(h["value"] for h in a["holdings"]) == pytest.approx(a["total"], abs=0.05)
    last = len(g["value"]) - 1
    assert g["contributed"][last] + g["growth"][last] == pytest.approx(g["value"][last], abs=0.05)
    assert g["value"][last] == pytest.approx(a["total"], abs=1)  # growth series and allocation agree
    for i in range(len(nw["months"])):
        assert sum(v[i] for v in nw["by_group"].values()) == pytest.approx(nw["total"][i], abs=0.05)
    # Rebalancing trades net to zero.
    assert sum(r["rebalance"] for r in a["by_class"] if r.get("rebalance") is not None) == pytest.approx(0, abs=1)


def test_demo_insights(demo):
    _, _, d = demo
    kinds = {x["kind"] for x in d["alerts"]}
    assert {"unusual", "duplicate", "new_recurring", "price_increase"} <= kinds
    assert any(r["merchant"] == "Netflix" and r["price_increase"] for r in d["recurring"])
    assert {x["name"]: x["paid_in_full"] for x in d["debts"] if x["type"] == "credit"} == {"Rewards Card": True, "Cashback Card": True}
    assert d["allocation"]["guessed"] == ["NVDA"]
    assert d["yoy"]["has_last_year"]


def test_render_is_self_contained(demo):
    _, _, d = demo
    html = render(d)
    assert "window.FIN" in html and "Chart.js" in html
    assert "<script src=" not in html and "http://" not in html.split("window.FIN")[0].split("<script>")[0]
