"""The projection engine (web/projection.js, run with Node) and its inputs (finance/projection.py)."""
import json
import shutil
import subprocess
from datetime import date
from pathlib import Path

import pytest

from finance.build import compute
from finance.config import Workspace
from finance.ingest import ingest
from finance.projection import portfolio_assumptions
from finance.sample import make_demo

JS = Path(__file__).resolve().parent.parent / "web" / "projection.js"
pytestmark = pytest.mark.skipif(shutil.which("node") is None, reason="needs node")

BASE = dict(years=1, cash=0, taxable=0, retirement=0, other=0, loans=[], income=0, spending=0, incomeGrowth=0, spendingGrowth=0,
            investShare=1, retireContrib=0, extraSavings=0, spendingChange=0, invReturn=0, cashYield=0, otherGrowth=0,
            stopAfter=None, freeDebtPayments=True, fiMultiple=25)


def run(expr: str, **params):
    p = {**BASE, **params}
    # Load as a plain script (the repo root's package.json makes .js files ES modules for require()).
    code = (f"const m = {{exports: {{}}}}; new Function('module', require('fs').readFileSync({json.dumps(str(JS))}, 'utf8'))(m);"
            f"const P = m.exports; const p = {json.dumps(p)}; console.log(JSON.stringify({expr}));")
    return json.loads(subprocess.run(["node", "-e", code], capture_output=True, text=True, check=True).stdout)


def test_compounding_matches_annual_rate():
    rows = run("P.project(p)", years=2, taxable=1000, invReturn=0.10)
    assert rows[1]["taxable"] == pytest.approx(1100) and rows[2]["taxable"] == pytest.approx(1210)
    assert rows[2]["growth"] == pytest.approx(210) and rows[2]["principal"] == pytest.approx(1000)


def test_savings_split_between_cash_and_investments():
    r = run("P.project(p)[1]", income=1000, investShare=0.5, retireContrib=200)
    assert (r["cash"], r["taxable"], r["retirement"]) == (pytest.approx(6000), pytest.approx(6000), pytest.approx(2400))
    assert r["principal"] == pytest.approx(8400) and r["saved"] == pytest.approx(12000)


def test_growth_rates_apply_to_income_and_spending():
    rows = run("P.project(p)", years=2, income=1000, spending=500, incomeGrowth=0.10, spendingGrowth=0.0)
    assert rows[2]["income"] > rows[1]["income"] * 1.09 and rows[2]["spending"] == pytest.approx(6000)


def test_paid_off_loan_payment_becomes_savings():
    loan = [{"name": "L", "balance": 1000, "apr": 0, "payment": 500}]
    on = run("P.project(p)[1]", income=500, spending=500, loans=loan)       # payment is inside spending
    off = run("P.project(p)[1]", income=500, spending=500, loans=loan, freeDebtPayments=False)
    assert on["debt"] == 0 and off["debt"] == 0
    assert on["taxable"] == pytest.approx(5000) and off["taxable"] == pytest.approx(0)  # 10 freed months x $500


def test_stop_working_draws_cash_then_investments_and_flags_running_out():
    r = run("P.project(p)", years=2, stopAfter=0, spending=1000, cash=6000, taxable=10000)
    assert r[1]["cash"] == pytest.approx(0) and r[1]["taxable"] == pytest.approx(4000)
    assert run("P.project(p).depleted", years=2, stopAfter=0, spending=1000, cash=6000, taxable=10000) == 1


def test_monte_carlo_with_no_volatility_equals_the_smooth_path():
    p = dict(years=10, taxable=10000, income=2000, spending=1000, invReturn=0.06)
    mc = run("P.monteCarlo(p, 0, 50)", **p)
    smooth = run("P.project(p).map(r => r.netWorth)", **p)
    assert mc["p10"] == pytest.approx(smooth) and mc["p90"] == pytest.approx(smooth)


def test_monte_carlo_spreads_and_is_repeatable():
    p = dict(years=20, taxable=100000, invReturn=0.07)
    a, b = run("P.monteCarlo(p, 0.16, 300)", **p), run("P.monteCarlo(p, 0.16, 300)", **p)
    assert a == b
    assert a["p10"][20] < a["p50"][20] < a["p90"][20]
    assert a["p50"][20] < 100000 * 1.07 ** 20  # median of a volatile path is below the smooth path


def test_fi_year():
    # Needs 25 x 12,000 = 300k. Saving 20k/yr from 0 at 0% -> year 15.
    assert run("P.fiYear(P.project(p), 25)", years=20, income=2666.6667, spending=1000) == 15


def test_portfolio_assumptions_weighting():
    table = {"US Stocks": {"return": 7, "volatility": 16}, "Bonds": {"return": 4, "volatility": 6}}
    a = portfolio_assumptions([{"asset_class": "US Stocks", "value": 60}, {"asset_class": "Bonds", "value": 40}], table)
    assert a["return"] == pytest.approx(5.8)
    assert 6 < a["volatility"] < 16


def test_demo_inputs_add_up_to_net_worth(tmp_path):
    ws = Workspace(tmp_path / "d")
    make_demo(ws, end=date(2026, 11, 18))
    ingest(ws, log=lambda m: None)
    d = compute(ws, as_of="2026-11-18")
    pj = d["projection"]
    b = pj["balances"]
    total = b["cash"] + b["taxable"] + b["retirement"] + b["other"] - sum(l["balance"] for l in pj["loans"])
    assert total == pytest.approx(d["networth"]["total"][-1], abs=1)
    assert pj["monthly"]["retirement_contrib"] == pytest.approx(1250)
    assert pj["basis_months"] == 12 and 0 < pj["invest_share"] < 1
