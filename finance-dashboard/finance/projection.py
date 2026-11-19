"""Starting point for the Projection tab: your current balances and your recent averages.

The projection itself runs in the dashboard (web/projection.js) so you can change any assumption
and see the result immediately. This module only works out sensible defaults from your history.
"""
from __future__ import annotations

from collections import defaultdict

from .metrics import month_end
from .models import CASH_TYPES, DEBT_TYPES, INVEST_TYPES

DEFAULT_ASSUMPTIONS = {"return": 6.0, "volatility": 14.0}


def complete_months(summary: list[dict], as_of: str) -> list[dict]:
    """Months fully in the past (the current month is partial unless as_of is its last day)."""
    return [m for m in summary if month_end(m["month"]) <= as_of]


def _growth(rows: list[dict], key: str):
    """Year-over-year change of the last 12 months vs. the 12 before, or None without 2 years of data."""
    if len(rows) < 24:
        return None
    last, prev = sum(m[key] for m in rows[-12:]), sum(m[key] for m in rows[-24:-12])
    if prev <= 0:
        return None
    return max(-0.05, min(0.10, last / prev - 1))  # clamp: one unusual year shouldn't drive 30 years


def portfolio_assumptions(by_class: list[dict], table: dict) -> dict:
    total = sum(r["value"] for r in by_class if r["value"] > 0)
    if not total:
        a = table.get("US Stocks", DEFAULT_ASSUMPTIONS)
        return {"return": a["return"], "volatility": a["volatility"], "weights": {}}
    ret = vol_sq = 0.0
    weights = {}
    for r in by_class:
        if r["value"] <= 0:
            continue
        w = r["value"] / total
        a = table.get(r["asset_class"]) or table.get("Other") or DEFAULT_ASSUMPTIONS
        weights[r["asset_class"]] = round(w, 4)
        ret += w * float(a["return"])
        vol_sq += (w * float(a["volatility"])) ** 2
    # Asset classes are not perfectly correlated; between "independent" (sqrt of squares) and
    # "move together" (weighted sum). Use the midpoint, which is close to typical stock/bond history.
    vol_sum = sum(weights[c] * float((table.get(c) or DEFAULT_ASSUMPTIONS)["volatility"]) for c in weights)
    vol = (vol_sq ** 0.5 + vol_sum) / 2
    return {"return": round(ret, 2), "volatility": round(vol, 2), "weights": weights}


def inputs(con, summary, nw, alloc, growth, debts, settings, as_of) -> dict:
    proj = settings.get("projection") or {}
    rows = complete_months(summary, as_of) or summary
    last12 = rows[-12:]
    n = max(len(last12), 1)
    income = sum(m["income"] for m in last12) / n
    spending = sum(m["spending"] for m in last12) / n
    invested = sum(m["invested"] for m in last12) / n
    saved = income - spending
    invest_share = max(0.0, min(1.0, invested / saved)) if saved > 0 else 0.0

    accts = {r["id"]: dict(r) for r in con.execute("SELECT * FROM accounts")}
    li = len(nw["months"]) - 1
    bal = defaultdict(float)
    for aid, vals in nw["by_account"].items():
        v = vals[li] if vals else None
        if v is None:
            continue
        t = accts[aid]["type"]
        if t in CASH_TYPES:
            bal["cash"] += v
        elif t == "brokerage":
            bal["taxable"] += v
        elif t == "retirement":
            bal["retirement"] += v
        elif t == "asset":
            bal["other"] += v
    loans = []
    for d in debts:
        if d["balance"] <= 0.5:
            continue
        if d.get("paid_in_full"):
            bal["cash"] -= d["balance"]  # a card you clear each month is just float against cash
            continue
        apr = d["apr"] or 0.0
        pay = d["min_payment"] or 0.0
        loans.append({"name": d["name"], "balance": d["balance"], "apr": apr, "payment": pay})

    # Retirement contributions (payroll deductions + match) never pass through checking, so they
    # are not in income or savings above; they are added on top.
    first12 = rows[-12]["month"] if len(rows) >= 12 else (rows[0]["month"] if rows else as_of[:7])
    ret_ids = [a for a, r in accts.items() if r["type"] == "retirement"]
    contrib = 0.0
    if ret_ids:
        q = f"SELECT SUM(amount) FROM investment_flows WHERE type='contribution' AND account_id IN ({','.join('?' * len(ret_ids))}) AND substr(date,1,7) >= ? AND substr(date,1,7) <= ?"
        # money that came from a bank account is already in income - spending; count payroll contributions only
        q += " AND id NOT LIKE 'fund:%' AND id NOT IN (SELECT transfer_pair FROM transactions WHERE transfer_pair IS NOT NULL)"
        contrib = (con.execute(q, (*ret_ids, first12, rows[-1]["month"] if rows else as_of[:7])).fetchone()[0] or 0.0) / n

    table = {k: {"return": float(v["return"]), "volatility": float(v["volatility"])} for k, v in (proj.get("assumptions") or {}).items()}
    port = portfolio_assumptions(alloc["by_class"], table)
    months_hist = sum(1 for r in growth["monthly_returns"] if r is not None)
    twr = growth.get("twr_since_start")
    twr_annual = (1 + twr) ** (12 / months_hist) - 1 if twr is not None and months_hist >= 12 else None

    return {
        "basis_months": len(last12),
        "balances": {k: round(bal[k], 2) for k in ("cash", "taxable", "retirement", "other")},
        "loans": loans,
        "monthly": {"income": round(income, 2), "spending": round(spending, 2), "saved": round(saved, 2),
                    "invested": round(invested, 2), "retirement_contrib": round(contrib, 2)},
        "invest_share": round(invest_share, 4),
        "income_growth": _growth(rows, "income"),
        "spending_growth": _growth(rows, "spending"),
        "portfolio": port,
        "history": {"xirr": growth.get("xirr"), "twr_annual": round(twr_annual, 4) if twr_annual is not None else None, "months": months_hist},
        "defaults": {
            "years": int(proj.get("years") or 30), "birth_year": proj.get("birth_year"),
            "inflation": float(proj.get("inflation_pct", 2.5)), "cash_yield": float(proj.get("cash_yield_pct", 3.5)),
            "other_growth": float(proj.get("other_assets_growth_pct", 0)), "fi_multiple": float(settings.get("fi_multiple") or 25),
        },
    }
