"""Best-effort reader for text-based PDF statements (not scans).

Reads the text line by line and picks up lines that look like `MM/DD  description  amount`.
Statements usually group rows under section headings ("Deposits and Additions", "Purchases",
"Payments and Credits", "Withdrawals", "Fees"...). Those headings decide each row's sign.

It then **checks itself**: it looks for the opening and closing balance and requires
opening + sum(transactions) == closing. A file that does not reconcile is NOT imported (unless you
pass --force), because a silently half-read statement is worse than none. When this generic reader
can't handle a bank's layout, write a specific parser (see _template_pdf.py) from the output of
`python -m finance inspect <file>`.
"""
from __future__ import annotations

import re
from pathlib import Path

from ..models import Balance, ParseResult, Txn
from ..util import parse_amount, parse_date

NAME = "generic_pdf"

AMT = r"-?\(?\$?\s?[\d,]+\.\d{2}\)?-?(?:\s?CR)?"
ROW = re.compile(rf"^(\d{{1,2}}/\d{{1,2}}(?:/\d{{2,4}})?)\s+(?:\d{{1,2}}/\d{{1,2}}(?:/\d{{2,4}})?\s+)?(.+?)\s+({AMT})(?:\s+({AMT}))?$")
PERIOD = re.compile(
    r"(\w{3,9}\.? \d{1,2},? \d{4}|\d{1,2}/\d{1,2}/\d{2,4})\s*(?:-|–|to|through|thru)\s*(\w{3,9}\.? \d{1,2},? \d{4}|\d{1,2}/\d{1,2}/\d{2,4})", re.I)
_DATE_TXT = r"(\d{1,2}/\d{1,2}/\d{2,4}|[A-Za-z]{3,9}\.? \d{1,2},? \d{4})"
# "Ending Balance $5,000.00", "Ending balance on 10/31/2026: $5,000.00", "Balance as of October 31, 2026 $5,000.00"
OPENING = re.compile(rf"(?:beginning|opening|previous|starting)\s+balance(?:\s+(?:on|as of))?\s*(?:{_DATE_TXT})?[^\d$(\-]*({AMT})", re.I)
CLOSING = re.compile(rf"(?:(?:ending|closing|new)\s+balance(?:\s+(?:on|as of))?|balance\s+as of)\s*(?:{_DATE_TXT})?[^\d$(\-]*({AMT})", re.I)
STATEMENT_DATE = re.compile(rf"(?:statement (?:closing )?date|closing date|period ending|statement period ending)\s*:?\s*{_DATE_TXT}", re.I)

# Section headings -> sign of the rows that follow, from the account holder's point of view.
NEGATIVE = re.compile(r"^(purchases?|withdrawals?|debits?|checks? paid|electronic withdrawals|atm\b|fees?\b|other debits|card purchases|interest charged|charges|cash advances)", re.I)
POSITIVE = re.compile(r"^(deposits?|credits?|payments?(,| and)? (and )?(other )?credits|payments?\b|additions|electronic deposits|interest (paid|earned)|refunds?|other credits)", re.I)
SKIP_DESC = re.compile(r"^(total|subtotal|balance|beginning|ending|previous|new balance)", re.I)


def detect(path: Path, account: dict) -> bool:
    return path.suffix.lower() == ".pdf"


def extract_lines(path: Path) -> list[str]:
    try:
        import pdfplumber
    except ImportError as e:  # pragma: no cover
        raise RuntimeError("PDF support needs pdfplumber: pip install pdfplumber") from e
    lines = []
    with pdfplumber.open(str(path)) as pdf:
        for page in pdf.pages:
            text = page.extract_text() or ""
            lines.extend(l.strip() for l in text.splitlines() if l.strip())
    if not lines:
        raise ValueError("no text in PDF (scanned image?). Download the CSV/OFX export for this account instead.")
    return lines


def parse(path: Path, account: dict) -> ParseResult:
    return parse_lines(extract_lines(path), account)


def parse_lines(lines: list[str], account: dict) -> ParseResult:
    res = ParseResult(parser=NAME)
    is_debt = account.get("type") in ("credit", "loan")
    start = end = None
    for l in lines[:60]:
        if m := PERIOD.search(l):
            start, end = parse_date(m.group(1).replace(".", "")), parse_date(m.group(2).replace(".", ""))
            if start and end:
                break
    opening = closing = None
    closing_date = None
    for l in lines:
        if opening is None and (m := OPENING.search(l)):
            opening = parse_amount(m.group(2))
        if closing is None and (m := CLOSING.search(l)):
            closing = parse_amount(m.group(2))
            closing_date = parse_date(m.group(1).replace(".", "")) if m.group(1) else None
    if not end:
        # No "date - date" range: fall back to a date printed with the ending balance or a statement date.
        sd = next((parse_date(m.group(1).replace(".", "")) for l in lines[:60] if (m := STATEMENT_DATE.search(l))), None)
        end = closing_date or sd

    sign = None  # unknown until a section heading is seen
    for l in lines:
        m = ROW.match(l)
        if not m:
            if NEGATIVE.match(l):
                sign = -1
            elif POSITIVE.match(l):
                sign = 1
            continue
        d_raw, desc, amt_raw = m.group(1), m.group(2).strip(), m.group(3)
        if SKIP_DESC.match(desc):
            continue
        year = _year_for(d_raw, start, end)
        d = parse_date(d_raw, year_hint=year)
        amt = parse_amount(amt_raw)
        if not d or amt is None:
            continue
        explicit = "-" in amt_raw or "(" in amt_raw
        if sign is not None and not explicit:
            amt = sign * abs(amt)
        elif sign is None and not explicit and is_debt:
            amt = -abs(amt)  # on card statements unsigned rows are charges
        elif explicit and is_debt:
            amt = abs(amt)  # card statements show payments/credits as negative numbers
        res.transactions.append(Txn(d, round(amt, 2), desc))

    if closing is not None and is_debt:  # statements print what you owe as a positive number
        closing = -abs(closing)
        opening = -abs(opening) if opening is not None else None
    if closing is not None and not res.transactions:
        # A balance-only statement (e.g. a savings account that lists just the month-end balance):
        # nothing to reconcile, but the ending balance is still a useful net worth data point.
        if end:
            res.balances.append(Balance(end, closing))
            res.warnings.append(f"balance-only statement: imported the ending balance {closing:,.2f} on {end}; no transactions read")
        else:
            res.warnings.append("found an ending balance but no statement period date, so it could not be placed in time")
    elif opening is not None and closing is not None:
        total = round(sum(t.amount for t in res.transactions), 2)
        res.reconciled = abs(round(opening + total - closing, 2)) < 0.01
        if not res.reconciled:
            res.warnings.append(f"does not reconcile: opening {opening:,.2f} + transactions {total:,.2f} != closing {closing:,.2f}")
        if end:
            res.balances.append(Balance(end, closing))
    else:
        res.warnings.append("no opening/closing balance found, so the import could not be verified")
        if closing is not None and end:
            res.balances.append(Balance(end, closing))
    return res


def _year_for(d_raw: str, start: str | None, end: str | None) -> int | None:
    if not end:
        return None
    if start and start[:4] != end[:4]:
        # A Dec-Jan statement: December rows belong to the start year.
        month = int(d_raw.split("/")[0])
        return int(start[:4]) if month >= int(start[5:7]) else int(end[:4])
    return int(end[:4])
