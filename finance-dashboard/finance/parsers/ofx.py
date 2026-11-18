"""OFX / QFX files ("Download to Quicken" / "Web Connect"). Banks, cards and brokerages.

A small tolerant reader for both OFX 1.x (SGML, leaf tags not closed) and OFX 2.x (XML), so there is
no extra dependency. Reads bank/card transactions, the ledger balance, and for investment accounts
the positions, the security list, and income/buy/sell/transfer activity.
"""
from __future__ import annotations

import re
from pathlib import Path

from ..models import Balance, Flow, Holding, ParseResult, Txn
from ..util import parse_amount

NAME = "ofx"

_TOKEN = re.compile(r"<(/?)([A-Za-z0-9.]+)>([^<]*)")


class Node:
    __slots__ = ("tag", "text", "children")

    def __init__(self, tag, text=""):
        self.tag, self.text, self.children = tag, text, []

    def find(self, tag):
        for c in self.children:
            if c.tag == tag:
                return c
        return None

    def get(self, tag, default=""):
        n = self.find(tag)
        return n.text if n is not None else default

    def iter(self, tag):
        if self.tag == tag:
            yield self
        for c in self.children:
            yield from c.iter(tag)


def parse_tree(text: str) -> Node:
    start = text.upper().find("<OFX>")
    if start < 0:
        raise ValueError("not an OFX file")
    root, stack = Node("ROOT"), []
    stack.append(root)
    for close, tag, body in _TOKEN.findall(text[start:]):
        tag, body = tag.upper(), body.strip()
        if close:
            # Pop back to the matching open aggregate (ignores closes of SGML leaves).
            for i in range(len(stack) - 1, 0, -1):
                if stack[i].tag == tag:
                    del stack[i:]
                    break
            continue
        node = Node(tag, body)
        stack[-1].children.append(node)
        if not body:
            stack.append(node)  # an aggregate; leaves carry their value inline
    return root


def ofx_date(s: str) -> str | None:
    m = re.match(r"(\d{4})(\d{2})(\d{2})", s or "")
    return f"{m.group(1)}-{m.group(2)}-{m.group(3)}" if m else None


def detect(path: Path, account: dict) -> bool:
    if path.suffix.lower() in (".ofx", ".qfx"):
        return True
    if path.suffix.lower() == ".txt":
        return b"<OFX>" in path.read_bytes()[:8192].upper()
    return False


def parse(path: Path, account: dict) -> ParseResult:
    text = path.read_bytes().decode("utf-8", errors="replace")
    root = parse_tree(text)
    res = ParseResult(parser=NAME)

    # Bank and credit card statements.
    for rs in list(root.iter("STMTRS")) + list(root.iter("CCSTMTRS")):
        for t in rs.iter("STMTTRN"):
            d, amt = ofx_date(t.get("DTPOSTED")), parse_amount(t.get("TRNAMT"))
            if not d or amt is None:
                continue
            desc = " ".join(x for x in (t.get("NAME"), t.get("MEMO")) if x) or t.get("TRNTYPE")
            res.transactions.append(Txn(d, round(amt, 2), desc))
        lb = rs.find("LEDGERBAL")
        if lb is not None and (d := ofx_date(lb.get("DTASOF"))):
            res.balances.append(Balance(d, parse_amount(lb.get("BALAMT")) or 0.0))

    # Investment statements.
    secs = {}
    for s in root.iter("SECINFO"):
        sid = s.find("SECID")
        uid = sid.get("UNIQUEID") if sid is not None else ""
        secs[uid] = (s.get("TICKER") or uid, s.get("SECNAME"))
    for rs in root.iter("INVSTMTRS"):
        as_of = ofx_date(rs.get("DTASOF"))
        for pos in rs.iter("INVPOS"):
            sid = pos.find("SECID")
            uid = sid.get("UNIQUEID") if sid is not None else ""
            sym, name = secs.get(uid, (uid, uid))
            d = as_of or ofx_date(pos.get("DTPRICEASOF"))
            units, price, mv = parse_amount(pos.get("UNITS")) or 0, parse_amount(pos.get("UNITPRICE")) or 0, parse_amount(pos.get("MKTVAL")) or 0
            res.holdings.append(Holding(d, sym, name, units, price, mv))
        cash = parse_amount((rs.find("INVBAL") or Node("")).get("AVAILCASH"))
        if cash:
            res.holdings.append(Holding(as_of, "CASH", "Cash", cash, 1.0, cash))
        if res.holdings and as_of:
            res.balances.append(Balance(as_of, round(sum(h.market_value for h in res.holdings), 2)))
        tl = rs.find("INVTRANLIST")
        if tl is None:
            continue
        for tx in tl.children:
            inv = tx.find("INVTRAN") or next(tx.iter("INVTRAN"), None)
            d = ofx_date(inv.get("DTTRADE") if inv is not None else tx.get("DTPOSTED") or "")
            if tx.tag == "INVBANKTRAN":
                st = tx.find("STMTTRN") or Node("")
                d = ofx_date(st.get("DTPOSTED"))
                amt = parse_amount(st.get("TRNAMT")) or 0
                res.flows.append(Flow(d, "contribution" if amt > 0 else "withdrawal", amt, "", st.get("NAME") or st.get("MEMO")))
                continue
            if not d:
                continue
            sid = next(tx.iter("SECID"), None)
            sym = secs.get(sid.get("UNIQUEID"), ("", ""))[0] if sid is not None else ""
            total = parse_amount(tx.get("TOTAL") or next((n.text for n in tx.iter("TOTAL")), "")) or 0
            memo = inv.get("MEMO") if inv is not None else ""
            if tx.tag == "INCOME":
                kind = "interest" if tx.get("INCOMETYPE") == "INTEREST" else "dividend"
                res.flows.append(Flow(d, kind, abs(total), sym, memo))
            elif tx.tag == "REINVEST":  # a dividend used to buy more shares: both income and a buy
                res.flows.append(Flow(d, "dividend", abs(total), sym, memo))
                res.flows.append(Flow(d, "buy", -abs(total), sym, memo))
            elif tx.tag.startswith("BUY"):
                res.flows.append(Flow(d, "buy", -abs(total), sym, memo))
            elif tx.tag.startswith("SELL"):
                res.flows.append(Flow(d, "sell", abs(total), sym, memo))
            elif tx.tag == "TRANSFER":
                res.flows.append(Flow(d, "other", total, sym, memo))
    return res
