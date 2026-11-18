"""Parsing helpers shared by the parsers: amounts, dates, hashing."""
from __future__ import annotations

import hashlib
import re
from datetime import date, datetime

_AMOUNT_RE = re.compile(r"[^0-9.\-]")

DATE_FORMATS = (
    "%Y-%m-%d", "%m/%d/%Y", "%m/%d/%y", "%m-%d-%Y", "%m-%d-%y", "%Y/%m/%d",
    "%d %b %Y", "%b %d, %Y", "%b %d %Y", "%d-%b-%Y", "%Y%m%d", "%B %d, %Y",
)


def parse_amount(text) -> float | None:
    """'$1,234.56' -> 1234.56, '(12.00)' -> -12.0, '12.00-' -> -12.0, '12.00 CR' -> 12.0, '' -> None."""
    if text is None:
        return None
    if isinstance(text, (int, float)):
        return float(text)
    s = str(text).strip()
    if not s:
        return None
    neg = False
    if s.startswith("(") and s.endswith(")"):
        neg, s = True, s[1:-1]
    up = s.upper()
    if up.endswith("CR"):
        s = s[:-2]
    elif up.endswith("DR"):
        neg, s = True, s[:-2]
    s = s.strip()
    if s.endswith("-"):
        neg, s = True, s[:-1]
    if s.startswith("-"):
        neg, s = not neg, s[1:]
    s = _AMOUNT_RE.sub("", s)
    if not s or s in (".", "-"):
        return None
    try:
        v = float(s)
    except ValueError:
        return None
    return -v if neg else v


def parse_date(text, fmt: str | None = None, year_hint: int | None = None) -> str | None:
    """Return ISO yyyy-mm-dd or None. `year_hint` fills in dates like '10/14' found on PDF statements."""
    if text is None:
        return None
    s = str(text).strip()
    if not s:
        return None
    if fmt:
        try:
            return datetime.strptime(s, fmt).date().isoformat()
        except ValueError:
            return None
    for f in DATE_FORMATS:
        try:
            return datetime.strptime(s, f).date().isoformat()
        except ValueError:
            pass
    m = re.fullmatch(r"(\d{1,2})[/-](\d{1,2})", s)
    if m and year_hint:
        try:
            return date(year_hint, int(m.group(1)), int(m.group(2))).isoformat()
        except ValueError:
            return None
    return None


def file_hash(path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 16), b""):
            h.update(chunk)
    return h.hexdigest()


def txn_id(account: str, date_: str, amount: float, description: str, n: int) -> str:
    """Stable id for dedupe. `n` is the occurrence number of an identical (date, amount, description)
    row within one file, so two real $4.50 coffees on the same day both survive, while the same
    statement imported twice (or two overlapping exports) does not double count."""
    norm = re.sub(r"\s+", " ", description.upper()).strip()
    key = f"{account}|{date_}|{amount:.2f}|{norm}|{n}"
    return hashlib.sha1(key.encode()).hexdigest()[:16]


def month_of(iso: str) -> str:
    return iso[:7]
