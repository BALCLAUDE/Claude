"""Investment analytics: allocation, target drift, contributions vs. market growth, returns."""
from __future__ import annotations

import calendar
from collections import defaultdict
from datetime import date

from .metrics import month_end
from .models import INVEST_TYPES

UNKNOWN = "Unclassified"


class Securities:
    def __init__(self, defaults: dict, user: dict):
        self.table = {k.upper(): dict(v or {}) for k, v in (defaults.get("securities") or {}).items()}
        for k, v in (user.get("securities") or {}).items():
            self.table.setdefault(k.upper(), {}).update(v or {})

    def split(self, symbol: str) -> tuple[dict[str, float], bool]:
        """Asset-class weights for a symbol, and whether it was a guess."""
        s = self.table.get(symbol.upper())
        if not s:
            return {"US Stocks": 1.0}, True  # an individual stock or fund we don't know: assume US equity
        if s.get("split"):
            return dict(s["split"]), False
        return {s.get("asset_class", UNKNOWN): 1.0}, False

    def info(self, symbol):
        return self.table.get(symbol.upper(), {})


def latest_holdings(con) -> list[dict]:
    """Most recent snapshot per account, for accounts that are investments."""
    rows = con.execute(
        """SELECT h.*, a.name AS account_name, a.type AS account_type, a.tax FROM holdings h
           JOIN accounts a ON a.id=h.account_id
           WHERE h.as_of = (SELECT MAX(as_of) FROM holdings h2 WHERE h2.account_id=h.account_id)""").fetchall()
    return [dict(r) for r in rows]


def allocation(con, secs: Securities, targets: dict, concentration_limit: float = 10) -> dict:
    hold = latest_holdings(con)
    invest_accts = {r["id"]: dict(r) for r in con.execute(f"SELECT * FROM accounts WHERE type IN {INVEST_TYPES}")}
    # Accounts with a value but no holdings breakdown still count toward the total, as Unclassified.
    with_holdings = {h["account_id"] for h in hold}
    no_breakdown = []
    for aid, a in invest_accts.items():
        if aid in with_holdings:
            continue
        r = con.execute("SELECT date, balance FROM balances WHERE account_id=? ORDER BY date DESC LIMIT 1", (aid,)).fetchone()
        if r and r["balance"]:
            no_breakdown.append({"account_id": aid, "account_name": a["name"], "tax": a["tax"], "account_type": a["type"],
                                 "symbol": UNKNOWN, "name": f"{a['name']} (no holdings detail)", "market_value": r["balance"],
                                 "as_of": r["date"], "cost_basis": None, "quantity": None, "price": None})

    by_class, by_account, by_tax = defaultdict(float), defaultdict(float), defaultdict(float)
    by_symbol: dict[str, dict] = {}
    guessed = set()
    for h in hold + no_breakdown:
        mv = h["market_value"] or 0.0
        sym = h["symbol"]
        weights, guess = ({UNKNOWN: 1.0}, False) if sym == UNKNOWN else secs.split(sym)
        if guess:
            guessed.add(sym)
        for cls, w in weights.items():
            by_class[cls] += mv * w
        by_account[h["account_name"]] += mv
        by_tax[h["tax"] or ("taxable" if h["account_type"] == "brokerage" else "traditional")] += mv
        s = by_symbol.setdefault(sym, {"symbol": sym, "name": h["name"], "value": 0.0, "cost_basis": 0.0, "has_basis": True,
                                       "accounts": [], "asset_class": "/".join(weights), "index": bool(secs.info(sym).get("index")),
                                       "expense_ratio": secs.info(sym).get("expense_ratio")})
        s["value"] += mv
        if h.get("cost_basis") is None:
            s["has_basis"] = False
        else:
            s["cost_basis"] += h["cost_basis"]
        if h["account_name"] not in s["accounts"]:
            s["accounts"].append(h["account_name"])

    total = sum(by_class.values())
    pct = lambda v: round(100 * v / total, 2) if total else 0.0
    holdings = sorted(by_symbol.values(), key=lambda s: -s["value"])
    for s in holdings:
        s["value"] = round(s["value"], 2)
        s["pct"] = pct(s["value"])
        s["gain"] = round(s["value"] - s["cost_basis"], 2) if s["has_basis"] and s["cost_basis"] else None
        s["cost_basis"] = round(s["cost_basis"], 2) if s["has_basis"] else None
        del s["has_basis"]

    tgt = {k: float(v) for k, v in ((targets or {}).get("targets") or {}).items()}
    drift = []
    for cls in sorted(set(tgt) | set(by_class), key=lambda c: -by_class.get(c, 0)):
        cur = by_class.get(cls, 0.0)
        t = tgt.get(cls)
        row = {"asset_class": cls, "value": round(cur, 2), "pct": pct(cur), "target_pct": t}
        if t is not None:
            row["drift_pct"] = round(pct(cur) - t, 2)
            row["rebalance"] = round(total * t / 100 - cur, 2)  # + buy, - sell
        drift.append(row)

    er_known = [(s["value"], s["expense_ratio"]) for s in holdings if s["expense_ratio"] is not None]
    weighted_er = sum(v * e for v, e in er_known) / sum(v for v, _ in er_known) if er_known else None
    limit = float(concentration_limit)
    return {
        "total": round(total, 2),
        "as_of": max((h["as_of"] for h in hold + no_breakdown), default=None),
        "by_class": drift,
        "by_account": [{"name": k, "value": round(v, 2), "pct": pct(v)} for k, v in sorted(by_account.items(), key=lambda kv: -kv[1])],
        "by_tax": [{"name": k, "value": round(v, 2), "pct": pct(v)} for k, v in sorted(by_tax.items(), key=lambda kv: -kv[1])],
        "holdings": holdings,
        "guessed": sorted(guessed),
        "weighted_expense_ratio": round(weighted_er, 4) if weighted_er is not None else None,
        "annual_fee_cost": round(sum(v * e / 100 for v, e in er_known), 2) if er_known else None,
        "concentration": [s for s in holdings if not s["index"] and s["symbol"] not in ("CASH", UNKNOWN) and s["pct"] > limit],
        "concentration_limit": limit,
        "targets_sum": sum(tgt.values()) if tgt else None,
    }


# ---------- growth and returns ----------

def _days(a: str, b: str) -> int:
    return (date.fromisoformat(b) - date.fromisoformat(a)).days


def xirr(cashflows: list[tuple[str, float]]) -> float | None:
    """Annualised money-weighted return. cashflows: (date, amount) from the investor's view:
    money put in is negative, money taken out (and the ending value) positive."""
    cfs = sorted(cashflows)
    if len(cfs) < 2 or not any(a > 0 for _, a in cfs) or not any(a < 0 for _, a in cfs):
        return None
    t0 = cfs[0][0]
    ts = [(_days(t0, d) / 365.0, a) for d, a in cfs]
    if ts[-1][0] <= 0:
        return None

    def npv(r):
        return sum(a / (1 + r) ** t for t, a in ts)

    lo, hi = -0.9999, 10.0
    f_lo, f_hi = npv(lo), npv(hi)
    if f_lo * f_hi > 0:
        return None
    for _ in range(200):
        mid = (lo + hi) / 2
        f_mid = npv(mid)
        if abs(f_mid) < 1e-7:
            break
        if f_lo * f_mid < 0:
            hi = mid
        else:
            lo, f_lo = mid, f_mid
    return mid


def modified_dietz(v0: float, v1: float, flows: list[tuple[float, float]]) -> float | None:
    """Return for one period. flows: (weight = share of the period remaining, amount in)."""
    denom = v0 + sum(w * a for w, a in flows)
    if denom <= 0:
        return None
    return (v1 - v0 - sum(a for _, a in flows)) / denom


def growth(con, months: list[str], balance_series: dict[str, list]) -> dict:
    """Portfolio value split into money you put in vs. market growth, plus TWR and XIRR."""
    accts = {r["id"]: dict(r) for r in con.execute(f"SELECT * FROM accounts WHERE type IN {INVEST_TYPES}")}
    flows = defaultdict(list)
    for r in con.execute("SELECT account_id, date, type, amount FROM investment_flows ORDER BY date"):
        flows[r["account_id"]].append(dict(r))
    first_obs = {}
    for r in con.execute("SELECT account_id, MIN(date) AS d FROM balances GROUP BY account_id"):
        first_obs[r["account_id"]] = r["d"]
    income = defaultdict(lambda: {"dividends": 0.0, "interest": 0.0, "fees": 0.0})

    n = len(months)
    value = [0.0] * n
    contributed = [0.0] * n  # starting value + net external contributions, cumulative
    ext_by_month = [0.0] * n
    per_account = []
    xirr_all: list[tuple[str, float]] = []
    month_idx = {m: i for i, m in enumerate(months)}

    for aid, a in accts.items():
        vals = balance_series.get(aid)
        if not vals or aid not in first_obs:
            continue
        start = first_obs[aid]
        start_val = next((v for v in vals if v is not None), 0.0)
        cum = 0.0
        acct_ext = [0.0] * n
        acct_cfs = [(start, -start_val)]
        for f in flows.get(aid, []):
            if f["type"] in ("dividend", "interest", "fee") and f["date"][:7] in month_idx:
                key = {"dividend": "dividends", "interest": "interest", "fee": "fees"}[f["type"]]
                income[f["date"][:7]][key] += f["amount"]
            if f["type"] not in ("contribution", "withdrawal") or f["date"] <= start:
                continue
            i = month_idx.get(f["date"][:7])
            if i is not None:
                acct_ext[i] += f["amount"]
            acct_cfs.append((f["date"], -f["amount"]))
        acct_contrib = []
        for i, v in enumerate(vals):
            if v is None:
                acct_contrib.append(None)
                continue
            cum += acct_ext[i]
            acct_contrib.append(start_val + cum)
            value[i] += v
            contributed[i] += start_val + cum
            ext_by_month[i] += acct_ext[i]
        last_i = max((i for i, v in enumerate(vals) if v is not None), default=None)
        if last_i is None:
            continue
        end_date = min(month_end(months[last_i]), date.today().isoformat())
        acct_cfs.append((end_date, vals[last_i]))
        xirr_all.extend(acct_cfs[:-1])
        twr = _twr(vals, acct_ext)
        per_account.append({
            "id": aid, "name": a["name"], "value": round(vals[last_i], 2),
            "contributed": round(acct_contrib[last_i], 2), "growth": round(vals[last_i] - acct_contrib[last_i], 2),
            "twr": twr["since_start"], "xirr": _r(xirr(acct_cfs)),
        })

    end_i = max((i for i in range(n) if value[i]), default=None)
    total_twr = _twr(value, ext_by_month)
    if end_i is not None:
        xirr_all.append((min(month_end(months[end_i]), date.today().isoformat()), value[end_i]))
    return {
        "months": months,
        "value": [round(v, 2) for v in value],
        "contributed": [round(c, 2) for c in contributed],
        "growth": [round(v - c, 2) for v, c in zip(value, contributed)],
        "net_contributions": [round(x, 2) for x in ext_by_month],
        "monthly_returns": total_twr["monthly"],
        "twr_since_start": total_twr["since_start"],
        "twr_ytd": total_twr["ytd"](months),
        "xirr": _r(xirr(xirr_all)),
        "accounts": per_account,
        "income": [{"month": m, **{k: round(v, 2) for k, v in income[m].items()}} for m in months],
    }


def _r(x):
    return round(x, 6) if x is not None else None


def _twr(vals: list, ext: list) -> dict:
    """Chain monthly Modified Dietz returns. Flows are assumed mid-month (weight 0.5)."""
    monthly = [None] * len(vals)
    prev = None
    for i, v in enumerate(vals):
        if v is None or not v:
            prev = None if v is None else v
            continue
        if prev:
            monthly[i] = _r(modified_dietz(prev, v, [(0.5, ext[i])] if ext[i] else []))
        prev = v

    def chain(rs):
        g, any_ = 1.0, False
        for r in rs:
            if r is not None:
                g *= 1 + r
                any_ = True
        return _r(g - 1) if any_ else None

    def ytd(months):
        if not months:
            return None
        year = months[-1][:4]
        return chain([r for m, r in zip(months, monthly) if m[:4] == year])

    return {"monthly": monthly, "since_start": chain(monthly), "ytd": ytd}


def days_in_month(ym: str) -> int:
    return calendar.monthrange(int(ym[:4]), int(ym[5:7]))[1]
