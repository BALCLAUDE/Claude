"""Transaction CSV exports from almost any bank or card ("Download transactions" -> CSV).

Finds the header row and picks columns by common names. Anything it guesses wrong can be fixed per
account in accounts.yaml:

    columns: {date: "Posting Date", description: "Payee", amount: "Amount"}   # or debit:/credit:
    date_format: "%m/%d/%Y"
    flip_sign: true          # card exports that list purchases as positive numbers
"""
from __future__ import annotations

import re
from pathlib import Path

from ..models import Balance, ParseResult, Txn
from ..util import parse_amount, parse_date
from .csvutil import col, find_header, norm, read_rows

NAME = "generic_csv"

DATE = ["transaction date", "trans date", "date", "posted date", "posting date", "post date", "run date", "settlement date", "trade date"]
DESC = ["description", "payee", "merchant", "name", "transaction description", "details", "memo", "action", "transaction"]
AMOUNT = ["amount", "transaction amount", "amount ($)", "amount usd", "net amount", "value"]
DEBIT = ["debit", "debits", "withdrawal", "withdrawals", "withdrawal amount", "debit amount", "charges", "outflow"]
CREDIT = ["credit", "credits", "deposit", "deposits", "deposit amount", "credit amount", "payments", "inflow"]
CATEGORY = ["category", "transaction category"]
BALANCE = ["balance", "running balance", "running bal", "available balance", "cash balance ($)"]
TYPE = ["type", "transaction type", "details"]


def detect(path: Path, account: dict) -> bool:
    if path.suffix.lower() not in (".csv", ".txt"):
        return False
    return find_header(read_rows(path), _required(account)) is not None


def _required(account: dict) -> list[set[str]]:
    """Header-row test: a date column and some amount column, including any names set in accounts.yaml."""
    ov = {k: norm(v) for k, v in (account.get("columns") or {}).items() if v}
    dates = set(DATE) | ({ov["date"]} if "date" in ov else set())
    amounts = set(AMOUNT) | set(DEBIT) | set(CREDIT) | {ov[k] for k in ("amount", "debit", "credit") if k in ov}
    return [dates, amounts]


def _pick(header, override, names):
    if override:
        i = col(header, [norm(override)])
        if i is None:
            raise ValueError(f"Column {override!r} from accounts.yaml is not in the header: {header}")
        return i
    return col(header, names)


def parse(path: Path, account: dict) -> ParseResult:
    rows = read_rows(path)
    hi = find_header(rows, _required(account))
    if hi is None:
        raise ValueError("no header row with a date and an amount column")
    header = rows[hi]
    ov = account.get("columns") or {}
    c_date = _pick(header, ov.get("date"), DATE)
    c_desc = _pick(header, ov.get("description"), DESC)
    c_amt = _pick(header, ov.get("amount"), AMOUNT)
    c_deb = _pick(header, ov.get("debit"), DEBIT)
    c_cred = _pick(header, ov.get("credit"), CREDIT)
    c_cat = _pick(header, ov.get("category"), CATEGORY)
    c_bal = _pick(header, ov.get("balance"), BALANCE)
    c_action = col(header, ["action", "activity", "transaction type"])
    c_type = col(header, TYPE)
    if c_type in (c_desc, c_cat):
        c_type = None
    if ov.get("debit") or ov.get("credit"):
        c_amt = None
    fmt = account.get("date_format")

    res = ParseResult(parser=NAME)
    bal_points: dict[str, float] = {}
    for row in rows[hi + 1:]:
        if not row or len(row) <= c_date:
            continue
        d = parse_date(row[c_date], fmt)
        if not d:
            continue  # footer/summary lines
        get = lambda i: row[i] if i is not None and i < len(row) else ""
        if c_amt is not None and get(c_amt) != "":
            amt = parse_amount(get(c_amt))
        else:
            deb, cred = parse_amount(get(c_deb)), parse_amount(get(c_cred))
            if deb is None and cred is None:
                continue
            amt = (cred or 0.0) - abs(deb or 0.0)
        if amt is None:
            continue
        # Some exports put the sign in a separate column ("DEBIT"/"CREDIT").
        t = get(c_type).strip().upper()
        if t in ("DEBIT", "DR", "WITHDRAWAL") and amt > 0:
            amt = -amt
        desc = get(c_desc) or "(no description)"
        if c_action is not None and c_action != c_desc and get(c_action):
            desc = f"{get(c_action)} {desc}"  # brokerage exports: "Action" says what happened
        res.transactions.append(Txn(d, round(amt, 2), re.sub(r"\s+", " ", desc).strip(), get(c_cat) or None))
        if c_bal is not None and get(c_bal):
            b = parse_amount(get(c_bal))
            if b is not None:
                bal_points.setdefault(d, b)  # most exports are newest-first; keep the first seen per day

    res.transactions = _fix_sign(res.transactions, account, res)
    if bal_points:
        # Running balances: keep the latest point per month (enough for the net worth chart).
        by_month: dict[str, tuple[str, float]] = {}
        for d, b in bal_points.items():
            if d[:7] not in by_month or d > by_month[d[:7]][0]:
                by_month[d[:7]] = (d, b)
        sign = -1 if account.get("type") in ("credit", "loan") and all(b >= 0 for _, b in by_month.values()) else 1
        res.balances = [Balance(d, sign * b) for d, b in sorted(by_month.values())]
    return res


PAYMENT_RE = re.compile(r"PAYMENT|AUTOPAY|THANK YOU|AUTO PAY|PYMT", re.I)


def _fix_sign(txns: list[Txn], account: dict, res: ParseResult) -> list[Txn]:
    flip = account.get("flip_sign")
    if flip is None and account.get("type") == "credit" and txns:
        # Card exports differ: some show purchases as negative (correct), some as positive.
        # If payments are negative and most other rows positive, the export is purchases-positive.
        pay = [t.amount for t in txns if PAYMENT_RE.search(t.description)]
        other = [t.amount for t in txns if not PAYMENT_RE.search(t.description)]
        pos_share = sum(a > 0 for a in other) / len(other) if other else 0
        flip = (pay and sum(a < 0 for a in pay) > len(pay) / 2) or (not pay and pos_share > 0.8)
        if flip:
            res.warnings.append("card export lists purchases as positive; flipped signs (set flip_sign in accounts.yaml to override)")
    if flip:
        return [Txn(t.date, -t.amount, t.description, t.category) for t in txns]
    return txns
