"""R-1 / P-1 / O-1 / M-1 Excel exhibits → budget_lines, budget_values, exhibit_checks.

The comptroller has changed column layouts several times since FY2021 (base/OCO/total columns,
then actual/enacted/supplemental/request, then discretionary + reconciliation). Rather than
hard-code each era, the parser finds the header row and reads each column's meaning from its
text: identity columns by name, amount columns by fiscal year plus a value-type keyword.

Files are read from budget/raw/FY<book>/<exhibit>.xlsx. `fetch` downloads them; any file
whose name contains r1/p1/o1/m1 (e.g. FY2026_r1.xlsx) may also be dropped in by hand.
"""
from __future__ import annotations

import re
import sqlite3
import sys
import time
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path

import openpyxl

from .common import (BuildError, DATA_DIR, FIRST_FY, LAST_FY, RAW_DIR, component_of,
                     norm_space, parse_amount)

EXHIBITS = {
    "r1": ("RDT&E", "R-1"),
    "p1": ("Procurement", "P-1"),
    "o1": ("O&M", "O-1"),
    "m1": ("MilPers", "M-1"),
}

# The comptroller site moved from comptroller.defense.gov to comptroller.war.gov in 2025;
# both are tried. {fy} is the budget year of the book.
URL_PATTERNS = [
    "https://comptroller.war.gov/Portals/45/Documents/defbudget/FY{fy}/FY{fy}_{ex}.xlsx",
    "https://comptroller.defense.gov/Portals/45/Documents/defbudget/FY{fy}/FY{fy}_{ex}.xlsx",
    "https://comptroller.defense.gov/Portals/45/Documents/defbudget/fy{fy}/fy{fy}_{ex}.xlsx",
]

TOLERANCE_K = 1.0
# Zeros in these columns mean "none" rather than a funded-to-zero line, so they are not stored.
SPARSE_TYPES = {"supplemental", "reconciliation", "cr", "fydp"}

# ---------------------------------------------------------------- header recognition

ID_FIELDS = [  # order matters: titles before codes, since "PE Title" also contains "PE"
    ("account_title", r"^(account|appropriation) (title|name)$|^appropriation$"),
    ("account", r"^(account|appropriation)( code| number| no\.?)?$|^acct$|^treasury account"),
    ("organization", r"^org(anization)?( title| name)?$|^component$|^service$"),
    ("ba_title", r"^(budget activity|ba) (title|name)$"),
    ("budget_activity", r"^(budget activity|ba)( number| no\.?| code)?$"),
    ("title", r"(program element|pe/bli|budget line item|\bbli\b|line item|\bsag\b|ag/bsa|"
              r"sub ?activity group|budget sub ?activity).*\b(title|name|description)$|"
              r"^(title|item title|description|nomenclature)$"),
    ("line_number", r"^(line|line number|line no\.?|line #|ln)$"),
    ("pe_bli", r"program element|^pe( number| no\.?| #)?$|pe/bli|^bli( number| no\.?| #)?$|"
               r"^budget line item( number| no\.?)?$|^line item( number| no\.?)?$|^li$|"
               r"^(sag|ag/bsa|sub ?activity group|budget sub ?activity)( number| no\.?| code)?$"),
    ("classification", r"^classification$|^class$|^security class"),
]
ID_RX = [(f, re.compile(rx)) for f, rx in ID_FIELDS]

FY_RX = re.compile(r"\bfy\s*-?\s*(\d{4}|\d{2})\b|(?<!\d)(20\d{2})(?!\d)")
VT_KEYWORDS = [
    ("skip", r"\bquantit|\bqty\b|\bunits?\b|\bchange\b|\bdelta\b|\bpercent\b|%"),
    ("reconciliation", r"reconcil|\brecon\b|mandatory"),
    ("supplemental", r"supplemental|\bsupp\b|emergency"),
    ("cr", r"continuing resolution|\bcr\b|annualized"),
    ("actual", r"\bactuals?\b"),
    ("enacted", r"enacted|\bapprop|\bappn\b|congressional"),
    ("request", r"request|\bpb\b|president'?s budget|\bbudget\b|estimate"),
]
VT_RX = [(v, re.compile(rx)) for v, rx in VT_KEYWORDS]
PART_KEYWORDS = [("oco", r"\boco\b|overseas contingency|\bdirect war\b|enduring"),
                 ("disc", r"discretionary|\bdisc\b"),
                 ("base", r"\bbase\b"),
                 ("total", r"\btotal\b")]
PART_RX = [(p, re.compile(rx)) for p, rx in PART_KEYWORDS]


def norm_header(h) -> str:
    return norm_space(str(h or "").replace("\n", " ")).lower().replace("&", "and")


def classify_header(h, book_fy: int):
    """Returns ('id', field) | ('amount', fy, value_type, part, explicit) | None."""
    t = norm_header(h)
    if not t:
        return None
    m = FY_RX.search(t)
    if m:
        y = m.group(1) or m.group(2)
        fy = int(y) + 2000 if len(y) == 2 else int(y)
        if not 2000 <= fy <= 2050:
            return None
        vt = next((v for v, rx in VT_RX if rx.search(t)), None)
        if vt == "skip":
            return None
        part = next((p for p, rx in PART_RX if rx.search(t)), None)
        explicit = vt is not None
        if vt is None:  # bare "FY 2026": infer from its position relative to the book year
            vt = ("actual" if fy <= book_fy - 2 else "enacted" if fy == book_fy - 1
                  else "request" if fy == book_fy else "fydp")
        return ("amount", fy, vt, part, explicit)
    for f, rx in ID_RX:
        if rx.search(t):
            return ("id", f)
    return None


@dataclass
class Layout:
    header_row: int
    ids: dict                      # field -> column index
    amounts: dict                  # (fy, value_type) -> list of (col, combine) where combine is +1


def resolve_amount_columns(cols):
    """cols: list of (col, fy, vt, part, explicit). Picks which columns make up each (fy, vt)."""
    by_key: dict = {}
    fys_with_explicit = {fy for _, fy, _, _, explicit in cols if explicit}
    for c in cols:
        col, fy, vt, part, explicit = c
        # "FY 2025 Total" next to "FY 2025 Enacted" + "FY 2025 Supplemental" would double count.
        if part == "total" and not explicit and fy in fys_with_explicit:
            continue
        by_key.setdefault((fy, vt), []).append(c)
    out = {}
    for key, group in by_key.items():
        parts = {}
        for col, _, _, part, _ in group:
            parts.setdefault(part, col)
        if "disc" in parts:              # FY2026+: request = discretionary, reconciliation separate
            out[key] = [parts["disc"]]
        elif "total" in parts:
            out[key] = [parts["total"]]
        elif "base" in parts or "oco" in parts:
            out[key] = [parts[p] for p in ("base", "oco") if p in parts]
        else:
            out[key] = [parts[None]] if None in parts else [group[0][0]]
    return out


def find_layout(ws, book_fy: int, scan_rows: int = 25) -> Layout | None:
    rows = list(ws.iter_rows(min_row=1, max_row=scan_rows, values_only=True))
    for i, row in enumerate(rows):
        ids, amt = {}, []
        for j, cell in enumerate(row):
            r = classify_header(cell, book_fy)
            if not r:
                continue
            if r[0] == "id":
                # The rightmost code/title column is the most granular (SAG after AG/BSA).
                if r[1] in ("title", "pe_bli"):
                    ids[r[1]] = j
                else:
                    ids.setdefault(r[1], j)
            else:
                amt.append((j, r[1], r[2], r[3], r[4]))
        if "title" in ids and ("pe_bli" in ids or "line_number" in ids) and len(ids) >= 3 and amt:
            return Layout(header_row=i + 1, ids=ids, amounts=resolve_amount_columns(amt))
    return None


# ---------------------------------------------------------------- parsing

@dataclass
class ParsedLine:
    line_id: str
    exhibit: str
    appropriation: str
    account: str
    account_title: str
    component: str
    organization: str
    budget_activity: str
    ba_title: str
    line_number: str
    pe_bli: str
    title: str
    classification: str
    values: dict = field(default_factory=dict)     # (fy, vt) -> amount_k
    ref: str = ""                                    # sheet!row


@dataclass
class ParsedBook:
    exhibit: str
    book_fy: int
    source_doc: str
    source_file: str
    lines: dict = field(default_factory=dict)       # line_id -> ParsedLine
    printed_totals: list = field(default_factory=list)  # (account, fy, vt, amount_k)
    duplicates: int = 0


TOTAL_RX = re.compile(r"\btotal\b", re.I)


def clean_code(v) -> str:
    if v is None:
        return ""
    if isinstance(v, float) and v.is_integer():
        v = int(v)
    return re.sub(r"\s+", "", str(v)).upper()


def detect_exhibit(name: str) -> str | None:
    m = re.search(r"(?<![a-z])([rpom])-?1(?![0-9])", name.lower())
    return f"{m.group(1)}1" if m else None


def detect_book_fy(path: Path) -> int | None:
    for part in (path.name, path.parent.name):
        m = re.search(r"fy\s*_?(\d{4})", part, re.I)
        if m:
            return int(m.group(1))
    return None


def parse_workbook(path: Path, exhibit: str, book_fy: int) -> ParsedBook:
    appropriation, ex_label = EXHIBITS[exhibit]
    book = ParsedBook(exhibit=exhibit, book_fy=book_fy, source_doc=f"FY{book_fy} {ex_label}",
                      source_file=path.name)
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    found = False
    for ws in wb.worksheets:
        layout = find_layout(ws, book_fy)
        if not layout:
            continue
        found = True
        _parse_sheet(ws, layout, book, appropriation)
    wb.close()
    if not found:
        raise BuildError(f"{path}: no sheet with a recognizable {ex_label} header row")
    return book


def _cell(row, ids, f):
    j = ids.get(f)
    return row[j] if j is not None and j < len(row) else None


def _parse_sheet(ws, layout: Layout, book: ParsedBook, appropriation: str):
    ids = layout.ids
    account_titles: dict = {}
    for r_i, row in enumerate(ws.iter_rows(min_row=layout.header_row + 1, values_only=True),
                              start=layout.header_row + 1):
        if row is None or all(c is None or str(c).strip() == "" for c in row):
            continue
        vals = {}
        for key, cols in layout.amounts.items():
            parts = [parse_amount(row[c]) if c < len(row) else None for c in cols]
            if any(p is not None for p in parts):
                vals[key] = sum(p for p in parts if p is not None)
        account = clean_code(_cell(row, ids, "account"))
        account_title = norm_space(_cell(row, ids, "account_title"))
        pe = clean_code(_cell(row, ids, "pe_bli"))
        line_no = norm_space(_cell(row, ids, "line_number"))
        title = norm_space(_cell(row, ids, "title"))
        text = " ".join(norm_space(c) for c in row if isinstance(c, str))

        # Printed subtotal / total rows: no line code, and "Total" somewhere in the label.
        if not pe and not line_no and TOTAL_RX.search(text):
            if not vals or re.search(r"budget activity|\bba\b|subtotal", text, re.I):
                continue
            acct = account
            if not acct:
                label = TOTAL_RX.sub("", text).lower()
                acct = next((a for a, t in account_titles.items() if t and t.lower() in label), "")
            if not acct and re.search(r"grand total|^total$|total (department|dod|all)", text.strip(), re.I):
                acct = "*"
            if acct:
                for (fy, vt), amt in vals.items():
                    book.printed_totals.append((acct, fy, vt, amt))
            continue
        if not title and not pe:
            continue
        if not vals:
            continue
        if account and account_title:
            account_titles[account] = account_title
        code = pe or line_no or re.sub(r"[^A-Z0-9]+", "-", title.upper()).strip("-")
        line_id = f"{book.exhibit}:{account or '?'}:{code}"
        org = norm_space(_cell(row, ids, "organization"))
        pl = book.lines.get(line_id)
        if pl:
            book.duplicates += 1
            for k, v in vals.items():
                pl.values[k] = pl.values.get(k, 0.0) + v
            continue
        book.lines[line_id] = ParsedLine(
            line_id=line_id, exhibit=book.exhibit, appropriation=appropriation, account=account,
            account_title=account_title, component=component_of(account_title, org, account=account),
            organization=org, budget_activity=norm_space(_cell(row, ids, "budget_activity")),
            ba_title=norm_space(_cell(row, ids, "ba_title")), line_number=line_no, pe_bli=pe,
            title=title or pe, classification=norm_space(_cell(row, ids, "classification")),
            values=vals, ref=f"{ws.title}!{r_i}")


# ---------------------------------------------------------------- checks

def load_toplines(path: Path = DATA_DIR / "toplines.csv") -> list[dict]:
    import csv
    if not path.exists():
        return []
    with path.open(newline="") as f:
        return [r for r in csv.DictReader(f) if r.get("book_fy") and not r["book_fy"].startswith("#")]


def check_book(book: ParsedBook, toplines: list[dict]) -> list[tuple]:
    """Compares parsed sums with printed totals. Returns exhibit_checks rows."""
    sums: dict = {}
    for pl in book.lines.values():
        for (fy, vt), amt in pl.values.items():
            for acct in (pl.account, "*"):
                sums[(acct, fy, vt)] = sums.get((acct, fy, vt), 0.0) + amt
    printed = [(a, fy, vt, amt, "exhibit") for a, fy, vt, amt in book.printed_totals]
    printed += [(t["account"] or "*", int(t["fy"]), t["value_type"], float(t["amount_k"]), "toplines.csv")
                for t in toplines
                if int(t["book_fy"]) == book.book_fy and t["exhibit"].lower() == book.exhibit]
    rows, seen = [], set()
    for acct, fy, vt, amt, origin in printed:
        if (acct, fy, vt, origin) in seen:
            continue
        seen.add((acct, fy, vt, origin))
        parsed = sums.get((acct, fy, vt), 0.0)
        ok = abs(parsed - amt) <= TOLERANCE_K
        rows.append((book.source_doc, acct, fy, vt, amt, parsed, int(ok), origin))
    return rows


# ---------------------------------------------------------------- load

def discover(raw_dir: Path = RAW_DIR) -> list[tuple[Path, str, int]]:
    out = []
    for p in sorted(raw_dir.rglob("*.xls*")):
        if p.name.startswith("~$"):
            continue
        ex, fy = detect_exhibit(p.stem), detect_book_fy(p)
        if ex in EXHIBITS and fy:
            out.append((p, ex, fy))
    return out


def load(con: sqlite3.Connection, raw_dir: Path = RAW_DIR, allow_mismatch: bool = False,
         toplines: list[dict] | None = None, as_of: str | None = None) -> dict:
    files = discover(raw_dir)
    toplines = load_toplines() if toplines is None else toplines
    stats = {"files": len(files), "lines": 0, "values": 0, "checks": 0, "mismatches": []}
    for path, ex, book_fy in files:
        book = parse_workbook(path, ex, book_fy)
        for pl in book.lines.values():
            con.execute(
                """INSERT INTO budget_lines (line_id, exhibit, appropriation, account, account_title, component,
                     organization, budget_activity, ba_title, line_number, pe_bli, title, classification,
                     first_book, last_book)
                   VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                   ON CONFLICT(line_id) DO UPDATE SET
                     first_book = MIN(first_book, excluded.first_book),
                     last_book = MAX(last_book, excluded.last_book),
                     account_title = CASE WHEN excluded.first_book >= last_book THEN excluded.account_title ELSE account_title END,
                     component = CASE WHEN excluded.first_book >= last_book THEN excluded.component ELSE component END,
                     organization = CASE WHEN excluded.first_book >= last_book THEN excluded.organization ELSE organization END,
                     budget_activity = CASE WHEN excluded.first_book >= last_book THEN excluded.budget_activity ELSE budget_activity END,
                     ba_title = CASE WHEN excluded.first_book >= last_book THEN excluded.ba_title ELSE ba_title END,
                     line_number = CASE WHEN excluded.first_book >= last_book THEN excluded.line_number ELSE line_number END,
                     title = CASE WHEN excluded.first_book >= last_book THEN excluded.title ELSE title END""",
                (pl.line_id, pl.exhibit, pl.appropriation, pl.account, pl.account_title, pl.component,
                 pl.organization, pl.budget_activity, pl.ba_title, pl.line_number, pl.pe_bli, pl.title,
                 pl.classification, book_fy, book_fy))
            for (fy, vt), amt in pl.values.items():
                if fy < FIRST_FY - 1 or fy > LAST_FY + 5:
                    continue
                if amt == 0 and vt in SPARSE_TYPES:
                    continue
                con.execute(
                    """INSERT OR REPLACE INTO budget_values
                       (line_id, fy, value_type, amount_k, source_doc, book_fy, source_file, sheet, page, as_of)
                       VALUES (?,?,?,?,?,?,?,?,?,?)""",
                    (pl.line_id, fy, vt, amt, book.source_doc, book_fy, book.source_file,
                     pl.ref.split("!")[0], pl.ref, as_of))
                stats["values"] += 1
        stats["lines"] += len(book.lines)
        checks = check_book(book, toplines)
        con.executemany("INSERT OR REPLACE INTO exhibit_checks VALUES (?,?,?,?,?,?,?,?)", checks)
        stats["checks"] += len(checks)
        stats["mismatches"] += [c for c in checks if not c[6]]
        print(f"  {book.source_doc}: {len(book.lines)} lines, {len(checks)} total checks"
              + (f", {book.duplicates} repeated rows summed" if book.duplicates else ""))
    if stats["mismatches"] and not allow_mismatch:
        detail = "\n".join(f"    {c[0]} {c[1]} FY{c[2]} {c[3]}: printed {c[4]:,.0f}, parsed {c[5]:,.0f}"
                           for c in stats["mismatches"][:20])
        raise BuildError(f"{len(stats['mismatches'])} exhibit total(s) do not reconcile:\n{detail}")
    return stats


# ---------------------------------------------------------------- fetch

def fetch(raw_dir: Path = RAW_DIR, books=range(FIRST_FY, LAST_FY + 1), exhibits=tuple(EXHIBITS),
          force: bool = False) -> list[str]:
    """Downloads each book's Excel exhibits. Returns the list of failures (blocked or missing)."""
    failures = []
    headers = {"User-Agent": "Mozilla/5.0 (budget-etl; research use)", "Accept": "*/*"}
    for fy in books:
        for ex in exhibits:
            dest = raw_dir / f"FY{fy}" / f"FY{fy}_{ex}.xlsx"
            if dest.exists() and not force:
                continue
            last = None
            for pat in URL_PATTERNS:
                url = pat.format(fy=fy, ex=ex)
                try:
                    req = urllib.request.Request(url, headers=headers)
                    with urllib.request.urlopen(req, timeout=60) as r:
                        body = r.read()
                    if not body.startswith(b"PK"):
                        raise ValueError("not an xlsx file")
                    dest.parent.mkdir(parents=True, exist_ok=True)
                    dest.write_bytes(body)
                    print(f"  fetched {dest.relative_to(raw_dir)} from {url}")
                    last = None
                    break
                except Exception as e:  # noqa: BLE001 - report every failure and move on
                    last = f"{url}: {e}"
                time.sleep(0.5)
            if last:
                failures.append(last)
                print(f"  could not fetch FY{fy} {ex}: {last}", file=sys.stderr)
    return failures
