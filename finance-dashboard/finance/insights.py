"""Planning and insights: budgets, runway, debts, alerts, year over year, tax tags, report cards."""
from __future__ import annotations

from collections import defaultdict
from datetime import date, timedelta
from statistics import median

from .investments import days_in_month
from .metrics import NON_SPEND, is_income
from .models import CASH_TYPES, DEBT_TYPES


def spend_txns(txns):
    from .models import INVEST_TYPES
    return [t for t in txns if t["account_type"] not in INVEST_TYPES and not t["is_transfer"]
            and t["category"] not in NON_SPEND and not is_income(t["category"])]


def budgets(summary: list[dict], cfg: dict, as_of: str) -> dict:
    limits = {k: float(v) for k, v in (cfg.get("budgets") or {}).items()}
    if not summary:
        return {"month": None, "rows": []}
    month = as_of[:7]
    cur = next((m for m in summary if m["month"] == month), summary[-1])
    month = cur["month"]
    elapsed = int(as_of[8:10]) / days_in_month(month) if as_of[:7] == month else 1.0
    prior = [m for m in summary if m["month"] < month][-6:]
    rows = []
    for cat, lim in limits.items():
        spent = cur["by_category"].get(cat, 0.0)
        avg = sum(m["by_category"].get(cat, 0.0) for m in prior) / len(prior) if prior else None
        projected = spent / elapsed if elapsed > 0 else spent
        rows.append({"category": cat, "limit": lim, "spent": round(spent, 2), "pct": round(100 * spent / lim, 1) if lim else None,
                     "projected": round(projected, 2), "avg_6m": round(avg, 2) if avg is not None else None,
                     "status": "over" if spent > lim else ("at_risk" if projected > lim else "ok")})
    return {"month": month, "elapsed_pct": round(100 * elapsed, 1), "rows": rows,
            "total_limit": sum(limits.values()), "total_spent": round(sum(r["spent"] for r in rows), 2)}


def runway(summary, txns, nw: dict, accounts: dict, essential: list[str]) -> dict:
    complete = summary[:-1][-6:] if len(summary) > 1 else summary
    if not complete:
        return {}
    ess = sum(sum(m["by_category"].get(c, 0.0) for c in essential) for m in complete) / len(complete)
    allsp = sum(m["spending"] for m in complete) / len(complete)
    cash = 0.0
    for aid, vals in nw["by_account"].items():
        if accounts[aid]["type"] in CASH_TYPES and vals and vals[-1] is not None:
            cash += vals[-1]
    return {"cash": round(cash, 2), "essential_monthly": round(ess, 2), "all_monthly": round(allsp, 2),
            "months_essential": round(cash / ess, 1) if ess > 0 else None,
            "months_all": round(cash / allsp, 1) if allsp > 0 else None, "basis_months": len(complete)}


def debts(con, nw: dict, accounts_cfg: dict, manual_cfg: dict, txns: list[dict]) -> list[dict]:
    out = []
    interest = defaultdict(lambda: defaultdict(float))
    for t in txns:
        if t["account_type"] in DEBT_TYPES and "INTEREST" in t["description_raw"].upper() and t["amount"] < 0:
            interest[t["account_id"]][t["date"][:7]] += -t["amount"]
    pays = defaultdict(list)
    for t in txns:
        if t["account_type"] in DEBT_TYPES and t["amount"] > 0 and t["category"] == "Transfer":
            pays[t["account_id"]].append(t["amount"])
    for r in con.execute(f"SELECT * FROM accounts WHERE type IN {DEBT_TYPES}"):
        vals = nw["by_account"].get(r["id"]) or []
        bal = next((v for v in reversed(vals) if v is not None), None)
        if bal is None:
            continue
        cfg = accounts_cfg.get(r["id"]) or manual_cfg.get(r["id"]) or {}
        owed = max(0.0, -bal)
        apr = cfg.get("apr")
        out.append({
            "id": r["id"], "name": r["name"], "type": r["type"], "balance": round(owed, 2),
            "apr": float(apr) if apr is not None else None,
            "min_payment": float(cfg["min_payment"]) if cfg.get("min_payment") else round(max(25.0, owed * 0.02), 2) if owed else 0.0,
            "interest_by_month": {k: round(v, 2) for k, v in sorted(interest[r["id"]].items())},
            "interest_12m": round(sum(v for k, v in interest[r["id"]].items() if k >= (date.today() - timedelta(days=365)).isoformat()[:7]), 2),
            "avg_payment": round(sum(pays[r["id"]][-6:]) / len(pays[r["id"]][-6:]), 2) if pays[r["id"]] else None,
            # A card you pay off every month: regular payments and no interest charged in the last year.
            "paid_in_full": r["type"] == "credit" and len(pays[r["id"]]) >= 3 and not any(
                k >= (date.today() - timedelta(days=365)).isoformat()[:7] for k in interest[r["id"]]),
        })
    return out


def alerts(txns: list[dict], recurring: list[dict], as_of: str, multiple: float = 2.5) -> list[dict]:
    out = []
    end = date.fromisoformat(as_of)
    recent_from = (end - timedelta(days=90)).isoformat()
    sp = sorted(spend_txns(txns), key=lambda t: t["date"])
    history = defaultdict(list)
    for t in sp:
        amt = -t["amount"]
        if amt <= 0:
            continue
        h = history[t["merchant"]]
        if t["date"] >= recent_from and len(h) >= 3:
            typ = median(h)
            if amt > multiple * typ and amt - typ > 25:
                out.append({"kind": "unusual", "date": t["date"], "merchant": t["merchant"], "amount": round(amt, 2),
                            "text": f"{t['merchant']}: ${amt:,.2f} is {amt / typ:.1f}× the usual ${typ:,.2f}"})
        h.append(amt)
    for r in recurring:
        if r["active"] and r["first_date"] >= (end - timedelta(days=75)).isoformat():
            out.append({"kind": "new_recurring", "date": r["first_date"], "merchant": r["merchant"], "amount": r["last_amount"],
                        "text": f"New {r['cadence']} charge: {r['merchant']} ${r['last_amount']:,.2f} (${r['annual_cost']:,.0f}/yr)"})
        pi = r.get("price_increase")
        if r["active"] and pi and pi["date"] >= (end - timedelta(days=120)).isoformat():
            out.append({"kind": "price_increase", "date": pi["date"], "merchant": r["merchant"], "amount": pi["to"],
                        "text": f"{r['merchant']} went up from ${pi['from']:,.2f} to ${pi['to']:,.2f}"})
    for t in txns:
        if t["date"] >= recent_from and "fee" in (t["tags"] or "").split(",") and t["amount"] < 0:
            out.append({"kind": "fee", "date": t["date"], "merchant": t["merchant"], "amount": round(-t["amount"], 2),
                        "text": f"Fee: {t['description_raw'][:50]} ${-t['amount']:,.2f}"})
    by_key = defaultdict(list)
    for t in sp:
        if t["date"] >= recent_from and t["amount"] < 0:
            by_key[(t["account_id"], t["merchant"], round(t["amount"], 2))].append(t["date"])
    for (acct, m, amt), ds in by_key.items():
        ds.sort()
        for a, b in zip(ds, ds[1:]):
            if (date.fromisoformat(b) - date.fromisoformat(a)).days <= 1 and -amt >= 5:
                out.append({"kind": "duplicate", "date": b, "merchant": m, "amount": round(-amt, 2),
                            "text": f"Possible duplicate: {m} ${-amt:,.2f} on {a} and {b}"})
    out.sort(key=lambda a: a["date"], reverse=True)
    return out


def year_over_year(txns: list[dict], as_of: str) -> dict:
    y = int(as_of[:4])
    md = as_of[5:]
    cur, prev = defaultdict(float), defaultdict(float)
    for t in spend_txns(txns):
        ty, tmd = int(t["date"][:4]), t["date"][5:]
        if tmd > md:
            continue
        if ty == y:
            cur[t["category"]] -= t["amount"]
        elif ty == y - 1:
            prev[t["category"]] -= t["amount"]
    has_prev = any(int(t["date"][:4]) == y - 1 for t in txns)
    rows = [{"category": c, "this_year": round(cur[c], 2), "last_year": round(prev[c], 2), "change": round(cur[c] - prev[c], 2),
             "change_pct": round(100 * (cur[c] - prev[c]) / prev[c], 1) if prev[c] > 0 else None}
            for c in set(cur) | set(prev)]
    rows.sort(key=lambda r: -max(r["this_year"], r["last_year"]))
    return {"year": y, "through": as_of, "has_last_year": has_prev, "rows": rows,
            "total_this": round(sum(cur.values()), 2), "total_last": round(sum(prev.values()), 2)}


def tax_tags(txns: list[dict]) -> dict:
    out = defaultdict(lambda: defaultdict(lambda: {"total": 0.0, "items": []}))
    for t in txns:
        for tag in filter(None, (t["tags"] or "").split(",")):
            if tag in ("fee", "p2p"):
                continue
            b = out[t["date"][:4]][tag]
            b["total"] += -t["amount"]
            b["items"].append({"date": t["date"], "merchant": t["merchant"], "amount": round(-t["amount"], 2)})
    return {y: {tag: {"total": round(v["total"], 2), "items": v["items"]} for tag, v in tags.items()} for y, tags in sorted(out.items())}


def report_cards(summary: list[dict], nw: dict) -> list[dict]:
    nw_by_month = dict(zip(nw["months"], nw["total"]))
    cards = []
    for i, m in enumerate(summary):
        prior = summary[max(0, i - 6):i]
        changes = []
        if prior:
            cats = set(m["by_category"]) | {c for p in prior for c in p["by_category"]}
            for c in cats:
                avg = sum(p["by_category"].get(c, 0.0) for p in prior) / len(prior)
                changes.append({"category": c, "this": m["by_category"].get(c, 0.0), "avg": round(avg, 2),
                                "diff": round(m["by_category"].get(c, 0.0) - avg, 2)})
            changes.sort(key=lambda x: -abs(x["diff"]))
        prev_m = summary[i - 1]["month"] if i else None
        nwc = (nw_by_month.get(m["month"], 0) - nw_by_month[prev_m]) if prev_m in nw_by_month and m["month"] in nw_by_month else None
        cards.append({"month": m["month"], "income": m["income"], "spending": m["spending"], "savings_rate": m["savings_rate"],
                      "invested": m["invested"], "net_worth": nw_by_month.get(m["month"]),
                      "net_worth_change": round(nwc, 2) if nwc is not None else None, "changes": changes[:4],
                      "top_categories": list(m["by_category"].items())[:5]})
    return cards


def unmatched_transfers(con, min_count: int = 3) -> list[dict]:
    """Transfers with no matching transaction in another imported account, grouped by merchant.
    A long list for one payee usually means an account you pay into but haven't imported (e.g. a
    second card), whose spending is then missing; import it, or add a rule to count those payments
    as spending."""
    rows = con.execute(
        """SELECT t.merchant, a.name AS account, COUNT(*) AS n, ROUND(SUM(t.amount), 2) AS total,
                  MIN(t.date) AS first, MAX(t.date) AS last
           FROM transactions t JOIN accounts a ON a.id=t.account_id
           WHERE t.category='Transfer' AND t.transfer_pair IS NULL
           GROUP BY t.merchant, a.name HAVING COUNT(*) >= ? ORDER BY ABS(SUM(t.amount)) DESC LIMIT 15""", (min_count,)).fetchall()
    return [dict(r) for r in rows]
