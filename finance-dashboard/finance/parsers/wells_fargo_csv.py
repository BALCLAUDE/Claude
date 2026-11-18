"""Wells Fargo checking/savings "Download Account Activity" -> Comma Delimited.

Wells Fargo's CSV has NO header row. Each line is:
    "10/14/2026","-45.67","*","","PURCHASE AUTHORIZED ON 10/12 SAFEWAY #1234 ..."
    date,        amount,  *,  check number, description
Amounts are already signed (withdrawals negative). There is no balance column, so add one
anchor balance per account in balances.yaml (or download the QFX "Quicken" format instead, which
includes the balance and is read by the OFX parser).
"""
from __future__ import annotations

import re
from pathlib import Path

from ..models import ParseResult, Txn
from ..util import parse_amount, parse_date
from .csvutil import read_rows

NAME = "wells_fargo_csv"
_DATE = re.compile(r"^\d{1,2}/\d{1,2}/\d{4}$")


def _is_row(r: list[str]) -> bool:
    return len(r) == 5 and bool(_DATE.match(r[0])) and parse_amount(r[1]) is not None and r[2] in ("*", "")


def detect(path: Path, account: dict) -> bool:
    if path.suffix.lower() != ".csv":
        return False
    rows = [r for r in read_rows(path) if any(r)]
    return bool(rows) and all(_is_row(r) for r in rows[:5])


def parse(path: Path, account: dict) -> ParseResult:
    res = ParseResult(parser=NAME)
    for r in read_rows(path):
        if not any(r):
            continue
        if not _is_row(r):
            res.warnings.append(f"skipped a line that is not in Wells Fargo's format: {r[:2]}")
            continue
        desc = re.sub(r"\s+", " ", r[4]).strip()
        if r[3]:
            desc = f"{desc} CHECK #{r[3]}".strip()
        res.transactions.append(Txn(parse_date(r[0], "%m/%d/%Y"), round(parse_amount(r[1]), 2), desc or "(no description)"))
    return res
