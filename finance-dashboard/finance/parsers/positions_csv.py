"""Brokerage "Positions" / "Holdings" CSV exports (Fidelity, Schwab, Vanguard, E*TRADE, etc. all have one).

Recognised by a header with a symbol, a quantity and a market value column. The snapshot date is
taken from, in order: accounts.yaml `as_of`, an "as of <date>" line in the file, a date in the file
name (e.g. Positions_2026-10-31.csv), or the file's modified time (with a warning).
"""
from __future__ import annotations

import re
from datetime import date
from pathlib import Path

from ..models import Balance, Holding, ParseResult
from ..util import parse_amount, parse_date
from .csvutil import col, find_header, read_rows, read_text

NAME = "positions_csv"

SYMBOL = ["symbol", "ticker", "symbol/cusip", "investment", "fund symbol"]
QTY = ["quantity", "shares", "qty", "qty (quantity)", "units", "share balance"]
VALUE = ["current value", "market value", "value", "mkt val (market value)", "total value", "mkt val", "current balance"]
PRICE = ["last price", "price", "share price", "last", "current price", "closing price"]
NAME_COL = ["description", "name", "security description", "investment name", "security name"]
COST = ["cost basis total", "cost basis", "total cost basis", "cost basis ($)", "cost"]

CASHLIKE = re.compile(r"^(SPAXX|FDRXX|FCASH|SWVXX|VMFXX|VMMXX|CORE|CASH|MONEY MARKET|PENDING ACTIVITY)", re.I)
SKIP = re.compile(r"^(ACCOUNT TOTAL|TOTAL|POSITIONS TOTAL|PENDING ACTIVITY)$", re.I)


def detect(path: Path, account: dict) -> bool:
    if path.suffix.lower() != ".csv":
        return False
    return find_header(read_rows(path), [set(SYMBOL), set(QTY), set(VALUE)]) is not None


def _as_of(path: Path, account: dict, res: ParseResult) -> str:
    if account.get("as_of"):
        return str(account["as_of"])
    head = read_text(path)[:2000]
    m = re.search(r"as of\s+([A-Za-z]{3,9}\.? \d{1,2},? \d{4}|\d{1,2}/\d{1,2}/\d{2,4}|\d{4}-\d{2}-\d{2})", head, re.I)
    if m and (d := parse_date(m.group(1).replace(".", ""))):
        return d
    m = re.search(r"(\d{4})[-_]?(\d{2})[-_]?(\d{2})", path.stem)
    if m:
        try:
            return date(int(m.group(1)), int(m.group(2)), int(m.group(3))).isoformat()
        except ValueError:
            pass
    res.warnings.append("no snapshot date found; used the file's modified date. Put the date in the file name, e.g. positions_2026-10-31.csv")
    return date.fromtimestamp(path.stat().st_mtime).isoformat()


def parse(path: Path, account: dict) -> ParseResult:
    rows = read_rows(path)
    hi = find_header(rows, [set(SYMBOL), set(QTY), set(VALUE)])
    header = rows[hi]
    cs, cq, cv = col(header, SYMBOL), col(header, QTY), col(header, VALUE)
    cp, cn, cc = col(header, PRICE), col(header, NAME_COL), col(header, COST)
    res = ParseResult(parser=NAME)
    as_of = _as_of(path, account, res)
    seen: dict[str, Holding] = {}
    for row in rows[hi + 1:]:
        get = lambda i: row[i] if i is not None and i < len(row) else ""
        sym = get(cs).strip().strip("*").upper()
        if not sym or SKIP.match(sym):
            continue
        mv = parse_amount(get(cv))
        if mv is None:
            continue
        qty = parse_amount(get(cq))
        price = parse_amount(get(cp))
        if CASHLIKE.match(sym):
            sym, qty, price = "CASH", mv, 1.0
        if qty is None:
            qty = mv if price in (None, 0) else mv / price
        if price is None:
            price = mv / qty if qty else 0.0
        h = seen.get(sym)
        if h:  # the same symbol listed twice (e.g. two lots): combine
            h.quantity += qty
            h.market_value += mv
            h.cost_basis = (h.cost_basis or 0) + (parse_amount(get(cc)) or 0)
        else:
            seen[sym] = Holding(as_of, sym, get(cn) or sym, qty, price, mv, parse_amount(get(cc)))
    res.holdings = list(seen.values())
    total = round(sum(h.market_value for h in res.holdings), 2)
    res.balances = [Balance(as_of, total)]
    return res
