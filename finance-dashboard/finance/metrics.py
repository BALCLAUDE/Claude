"""Cash flow and net worth.

Definitions used everywhere (the dashboard's JavaScript uses the same ones):
  income   = inflows in categories starting with "Income"
  spending = outflows minus refunds in every other category, excluding transfers between your
             own accounts ("Transfer") and money moved into investments ("Investments")
  invested = net money moved into investment accounts
  savings rate = (income - spending) / income
Investment-account activity (dividends, buys) is not cash flow; it shows on the Investments tab.
"""
from __future__ import annotations

import calendar
from collections import defaultdict
from datetime import date

from .models import CASH_TYPES, DEBT_TYPES, INVEST_TYPES

NON_SPEND = ("Transfer", "Investments")


def is_income(cat: str) -> bool:
    return cat.startswith("Income")


def month_end(ym: str) -> str:
    y, m = int(ym[:4]), int(ym[5:7])
    return f"{ym}-{calendar.monthrange(y, m)[1]:02d}"


def month_range(first: str, last: str) -> list[str]:
    y, m = int(first[:4]), int(first[5:7])
    out = []
    while f"{y:04d}-{m:02d}" <= last[:7]:
        out.append(f"{y:04d}-{m:02d}")
        m += 1
        if m > 12:
            y, m = y + 1, 1
    return out


def load_txns(con) -> list[dict]:
    return [dict(r) for r in con.execute(
        """SELECT t.*, a.type AS account_type FROM transactions t JOIN accounts a ON a.id=t.account_id ORDER BY t.date""")]


def monthly_summary(txns: list[dict]) -> list[dict]:
    """One row per month: income, spending, invested, net, savings_rate, by_category (spend > 0)."""
    months: dict[str, dict] = {}
    for t in txns:
        if t["account_type"] in INVEST_TYPES:
            continue
        m = months.setdefault(t["date"][:7], {"income": 0.0, "spending": 0.0, "invested": 0.0, "by_category": defaultdict(float)})
        cat = t["category"] or "Uncategorized"
        if cat == "Investments":
            m["invested"] -= t["amount"]
        elif cat == "Transfer" or t["is_transfer"]:
            continue
        elif is_income(cat):
            m["income"] += t["amount"]
        else:
            m["spending"] -= t["amount"]
            m["by_category"][cat] -= t["amount"]
    out = []
    if not months:
        return out
    for ym in month_range(min(months), max(months)):
        m = months.get(ym) or {"income": 0.0, "spending": 0.0, "invested": 0.0, "by_category": {}}
        inc, sp = round(m["income"], 2), round(m["spending"], 2)
        out.append({
            "month": ym, "income": inc, "spending": sp, "invested": round(m["invested"], 2),
            "net": round(inc - sp, 2), "savings_rate": round((inc - sp) / inc, 4) if inc > 0 else None,
            "by_category": {k: round(v, 2) for k, v in sorted(m["by_category"].items(), key=lambda kv: -kv[1])},
        })
    return out


def account_balance_series(con, months: list[str], anchors: dict | None = None, estimates: dict | None = None) -> dict[str, list[float | None]]:
    """Month-end balance per account.

    For accounts with transactions, balances between statements are rebuilt from the transactions
    (balance at month end = nearest known balance adjusted by the transactions in between), so the
    chart moves every month instead of jumping at each statement. Other accounts carry their last
    known value forward. Months before an account's first data are None.

    Investment accounts also use their contributions/withdrawals (activity files, balances.yaml, or bank
    transfers matched by `funded_by`): money added after the latest statement is included, and months
    before the first statement are valued at the money put in so far (no gains assumed). Those months
    are reported in `estimates` as {account: first statement date, or None if there is none yet}.
    """
    accts = [dict(r) for r in con.execute("SELECT * FROM accounts")]
    points: dict[str, list[tuple[str, float]]] = defaultdict(list)
    for r in con.execute("SELECT account_id, date, balance FROM balances ORDER BY date"):
        points[r["account_id"]].append((r["date"], r["balance"]))
    for acct, vals in (anchors or {}).items():
        for d, v in vals.items():
            points[acct].append((str(d), float(v)))
        points[acct].sort()
    txns: dict[str, list[tuple[str, float]]] = defaultdict(list)
    for r in con.execute("SELECT account_id, date, amount FROM transactions ORDER BY date"):
        txns[r["account_id"]].append((r["date"], r["amount"]))
    flows: dict[str, list[tuple[str, float]]] = defaultdict(list)
    for r in con.execute("SELECT account_id, date, amount FROM investment_flows WHERE type IN ('contribution','withdrawal') ORDER BY date"):
        flows[r["account_id"]].append((r["date"], r["amount"]))

    series = {}
    for a in accts:
        aid = a["id"]
        pts, tx = points.get(aid, []), txns.get(aid, [])
        if a["type"] in INVEST_TYPES and flows.get(aid):
            series[aid] = _invest_series(pts, flows[aid], months)
            first_bal = pts[0][0] if pts else None
            if first_bal is None or flows[aid][0][0] < first_bal[:7] + "-01":
                if estimates is not None:
                    estimates[aid] = first_bal
            continue
        if not pts:
            continue  # no balance information: cannot place this account in net worth
        first_data = min([p[0] for p in pts] + [t[0] for t in tx])
        out = []
        for ym in months:
            end = month_end(ym)
            if ym < first_data[:7]:
                out.append(None)
                continue
            if tx and a["type"] not in INVEST_TYPES:
                out.append(round(_rebuild(pts, tx, end), 2))
            else:
                prior = [v for d, v in pts if d <= end]
                out.append(prior[-1] if prior else None)
        series[aid] = out
    return series


def _invest_series(pts, flows, months) -> list[float | None]:
    out = []
    for ym in months:
        end = month_end(ym)
        prior = [(d, v) for d, v in pts if d <= end]
        if prior:
            d0, v0 = prior[-1]
            out.append(round(v0 + sum(a for d, a in flows if d0 < d <= end), 2))
        elif flows[0][0] <= end:
            out.append(round(sum(a for d, a in flows if d <= end), 2))  # before the first statement
        else:
            out.append(None)
    return out


def _rebuild(pts, tx, end: str) -> float:
    prior = [(d, v) for d, v in pts if d <= end]
    if prior:
        d0, v0 = prior[-1]
        return v0 + sum(a for d, a in tx if d0 < d <= end)
    d1, v1 = pts[0]  # only later balances known: walk backwards
    return v1 - sum(a for d, a in tx if end < d <= d1)


def net_worth(con, months: list[str], anchors=None) -> dict:
    accts = {r["id"]: dict(r) for r in con.execute("SELECT * FROM accounts")}
    estimates: dict = {}
    per = account_balance_series(con, months, anchors, estimates)
    groups = {"Cash": CASH_TYPES, "Investments": INVEST_TYPES, "Other assets": ("asset",), "Debt": DEBT_TYPES}
    by_group = {g: [0.0] * len(months) for g in groups}
    for aid, vals in per.items():
        t = accts[aid]["type"]
        g = next(k for k, v in groups.items() if t in v)
        for i, v in enumerate(vals):
            if v is not None:
                by_group[g][i] += v
    total = [round(sum(by_group[g][i] for g in groups), 2) for i in range(len(months))]
    return {
        "months": months,
        "by_group": {g: [round(x, 2) for x in v] for g, v in by_group.items()},
        "by_account": per,
        "total": total,
        # account -> date of its first real statement (None = none yet): earlier months are estimates
        "estimated_until": estimates,
    }


def today() -> str:
    return date.today().isoformat()
