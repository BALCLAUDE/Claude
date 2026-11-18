"""`python -m finance inspect FILE`: print a redacted picture of a statement's layout.

The output keeps the structure (line shapes, column positions, punctuation, common statement
words) and removes the content: every digit becomes 9 and every other word becomes x's of the
same length. Read it before you share it.
"""
from __future__ import annotations

import re
from pathlib import Path

KEEP_WORDS = set("""
account accounts activity additions amount amounts annual apr atm available average balance balances basis
beginning buy card cash category charge charged charges check checks closing code contribution contributions cost
credit credits current date days debit debits deposit deposits description detail details dividend dividends due
earned electronic ending fee fees from interest last limit market minimum new opening other paid payment payments
pending period post posted posting previous price purchase purchases quantity rate reference reinvest sale sell
shares starting statement subtotal summary symbol through to total trade trans transaction transactions transfer
transfers type units value withdrawal withdrawals year ytd and of the for in on per your cr dr
jan feb mar apr may jun jul aug sep oct nov dec
""".split())

_WORD = re.compile(r"[A-Za-z]+")


def redact(line: str) -> str:
    line = re.sub(r"\d", "9", line)
    return _WORD.sub(lambda m: m.group(0) if m.group(0).lower() in KEEP_WORDS else "x" * len(m.group(0)), line)


def inspect_file(path: Path, max_lines: int = 400) -> str:
    out = [f"# {path.suffix.lower()} file, redacted layout (digits->9, other words->x)"]
    suffix = path.suffix.lower()
    if suffix == ".pdf":
        from .parsers.generic_pdf import extract_lines
        lines = extract_lines(path)
    else:
        from .parsers.csvutil import read_text
        lines = read_text(path).splitlines()
    if suffix in (".ofx", ".qfx"):
        # Tags are structure; values are content.
        lines = [re.sub(r">([^<]+)", lambda m: ">" + redact(m.group(1)), l) for l in lines]
    else:
        lines = [redact(l) for l in lines]
    out += lines[:max_lines]
    if len(lines) > max_lines:
        out.append(f"... {len(lines) - max_lines} more lines")
    return "\n".join(out)
