"""TEMPLATE for a bank-specific PDF parser. Copy to e.g. mybank_pdf.py, fill in, register in __init__.py.

Workflow that keeps your statement private:
  1. python -m finance inspect inbox/<account>/statement.pdf > layout.txt
     (digits become 9 and words become x, except common statement words like "Balance")
  2. Share layout.txt (not the PDF) to get a parser written against that layout.
  3. Add a synthetic fixture in tests/ that mimics the layout, and a test.
  4. The parser must set res.reconciled so a half-read statement is never imported silently.
"""
from __future__ import annotations

import re
from pathlib import Path

from ..models import Balance, ParseResult, Txn
from ..util import parse_amount, parse_date
from .generic_pdf import extract_lines

NAME = "mybank_pdf"


def detect(path: Path, account: dict) -> bool:
    if path.suffix.lower() != ".pdf":
        return False
    # Use a phrase that only this bank prints, e.g. its legal name on page 1.
    return any("MYBANK N.A." in l.upper() for l in extract_lines(path)[:20])


def parse(path: Path, account: dict) -> ParseResult:
    lines = extract_lines(path)
    res = ParseResult(parser=NAME)
    row = re.compile(r"^(\d{2}/\d{2})\s+(.+?)\s+(-?[\d,]+\.\d{2})$")
    year = 2026  # read from the statement period line
    for l in lines:
        if m := row.match(l):
            res.transactions.append(Txn(parse_date(m.group(1), year_hint=year), parse_amount(m.group(3)), m.group(2)))
    opening, closing, end = 0.0, 0.0, f"{year}-01-31"  # read these from the summary box
    res.reconciled = abs(opening + sum(t.amount for t in res.transactions) - closing) < 0.01
    res.balances.append(Balance(end, closing))
    return res
