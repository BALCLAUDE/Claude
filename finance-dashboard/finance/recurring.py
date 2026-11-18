"""Detect recurring charges (subscriptions, bills) from transaction history."""
from __future__ import annotations

from collections import defaultdict
from datetime import date, timedelta
from statistics import median

CADENCES = [("weekly", 7, 2), ("biweekly", 14, 3), ("monthly", 30.4, 5), ("quarterly", 91, 12), ("yearly", 365, 25)]


def detect(txns: list[dict], as_of: str) -> list[dict]:
    groups = defaultdict(list)
    for t in txns:
        if t["amount"] >= 0 or t["is_transfer"] or t["category"] in ("Transfer", "Investments") or t["category"].startswith("Income"):
            continue
        groups[(t["merchant"], t["account_id"])].append(t)
    out = []
    end = date.fromisoformat(as_of)
    for (merchant, acct), ts in groups.items():
        ts.sort(key=lambda t: t["date"])
        # One charge per day at most (a day with two is not a subscription pattern).
        ds = []
        for t in ts:
            if not ds or ds[-1]["date"] != t["date"]:
                ds.append(t)
        if len(ds) < 3:
            continue
        gaps = [(date.fromisoformat(b["date"]) - date.fromisoformat(a["date"])).days for a, b in zip(ds, ds[1:])]
        g = median(gaps)
        cad = next(((name, days) for name, days, tol in CADENCES if abs(g - days) <= tol), None)
        if not cad:
            continue
        # Most gaps must fit the cadence, and amounts must be steady (within 25% of typical).
        tol = next(t for n, d, t in CADENCES if n == cad[0])
        fit = sum(abs(x - cad[1]) <= tol for x in gaps) / len(gaps)
        amts = [-t["amount"] for t in ds]
        typical = median(amts)
        steady = sum(abs(a - typical) <= 0.25 * typical for a in amts[-6:]) / len(amts[-6:])
        if fit < 0.75 or steady < 0.6:
            continue
        # "Fixed" = the same price each time (a subscription), as opposed to a bill that varies.
        fixed = sum(abs(a - amts[-1]) <= 0.01 * amts[-1] + 0.01 for a in amts[-3:]) == len(amts[-3:]) or \
            sum(abs(a - typical) <= 0.01 * typical for a in amts) / len(amts) >= 0.6
        last = date.fromisoformat(ds[-1]["date"])
        nxt = last + timedelta(days=round(cad[1]))
        active = (end - last).days <= cad[1] * 1.6
        per_year = 365 / cad[1]
        # A price increase: a fixed charge that steps up and stays up.
        changes = [(ds[i]["date"], amts[i - 1], amts[i]) for i in range(1, len(amts))
                   if fixed and amts[i] > amts[i - 1] * 1.01 and abs(amts[i] - amts[-1]) <= 0.01 * amts[-1] + 0.01]
        out.append({
            "merchant": merchant, "account_id": acct, "category": ds[-1]["category"], "cadence": cad[0],
            "typical": round(typical, 2), "last_amount": round(amts[-1], 2), "last_date": ds[-1]["date"],
            "first_date": ds[0]["date"], "count": len(ds), "fixed": fixed, "next_expected": nxt.isoformat(), "active": active,
            "annual_cost": round(amts[-1] * per_year, 2),
            "price_increase": {"date": changes[-1][0], "from": round(changes[-1][1], 2), "to": round(changes[-1][2], 2)} if changes else None,
        })
    out.sort(key=lambda r: (not r["active"], -r["annual_cost"]))
    return out
