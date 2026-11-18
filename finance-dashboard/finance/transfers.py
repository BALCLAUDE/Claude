"""Find money moving between your own accounts so it is not counted as spending or income.

A transfer is a pair of opposite amounts in two different accounts a few days apart: a card payment
(checking -500, card +500), checking -> savings, or checking -> brokerage (matched against the
brokerage's contribution flow). Each transaction pairs at most once, closest date first.
"""
from __future__ import annotations

from datetime import date


def _d(s):
    return date.fromisoformat(s)


def match_transfers(con, window_days: int = 4) -> int:
    txns = [dict(r) for r in con.execute("SELECT id, account_id, date, amount, category FROM transactions ORDER BY date")]
    flows = [dict(r) for r in con.execute(
        "SELECT id, account_id, date, amount FROM investment_flows WHERE type IN ('contribution','withdrawal')")]
    by_amount: dict[float, list[dict]] = {}
    for t in txns:
        by_amount.setdefault(round(t["amount"], 2), []).append(t)
    used: set[str] = set()
    pairs = 0

    # Cash/credit <-> cash/credit
    candidates = []
    for t in txns:
        if t["amount"] >= 0:
            continue
        for o in by_amount.get(round(-t["amount"], 2), []):
            if o["account_id"] == t["account_id"]:
                continue
            gap = abs((_d(o["date"]) - _d(t["date"])).days)
            if gap <= window_days:
                # Prefer pairs the rules already think are transfers, then the closest dates.
                hint = 0 if (t["category"] == "Transfer" or o["category"] == "Transfer") else 1
                # Without a rule hint, only pair larger round-trip amounts close together, so a $40
                # refund on the card is not mistaken for a $40 purchase on checking.
                if hint and (gap > 2 or abs(t["amount"]) < 100):
                    continue
                candidates.append((hint, gap, t["id"], o["id"]))
    for _, _, a, b in sorted(candidates):
        if a in used or b in used:
            continue
        used.update((a, b))
        con.execute("UPDATE transactions SET is_transfer=1, transfer_pair=?, category='Transfer' WHERE id=?", (b, a))
        con.execute("UPDATE transactions SET is_transfer=1, transfer_pair=?, category='Transfer' WHERE id=?", (a, b))
        pairs += 1

    # Cash -> investment account contributions (and withdrawals back).
    for f in flows:
        best = None
        for t in by_amount.get(round(-f["amount"], 2), []):
            if t["id"] in used or t["account_id"] == f["account_id"]:
                continue
            gap = abs((_d(t["date"]) - _d(f["date"])).days)
            if gap <= window_days and (best is None or gap < best[0]):
                best = (gap, t["id"])
        if best:
            used.add(best[1])
            con.execute("UPDATE transactions SET is_transfer=1, transfer_pair=?, category='Investments' WHERE id=?", (f["id"], best[1]))
            pairs += 1
    return pairs
