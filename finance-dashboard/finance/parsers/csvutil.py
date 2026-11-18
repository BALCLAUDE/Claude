"""Reading CSV exports that often start with a few lines of preamble before the header row."""
from __future__ import annotations

import csv
import io
from pathlib import Path


def read_text(path: Path) -> str:
    raw = path.read_bytes()
    for enc in ("utf-8-sig", "cp1252", "latin-1"):
        try:
            return raw.decode(enc)
        except UnicodeDecodeError:
            continue
    return raw.decode("utf-8", errors="replace")


def read_rows(path: Path) -> list[list[str]]:
    if path.suffix.lower() == ".xlsx":
        return read_xlsx(path)
    text = read_text(path)
    try:
        dialect = csv.Sniffer().sniff(text[:4096], delimiters=",;\t|")
    except csv.Error:
        dialect = csv.excel
    return [[c.strip() for c in row] for row in csv.reader(io.StringIO(text), dialect)]


def norm(h: str) -> str:
    return " ".join(h.lower().replace("_", " ").replace(".", " ").split())


def find_header(rows: list[list[str]], required: list[set[str]], scan: int = 30) -> int | None:
    """Index of the first row (within the first `scan`) that has a cell matching each group in `required`."""
    for i, row in enumerate(rows[:scan]):
        cells = {norm(c) for c in row if c}
        if all(cells & group for group in required):
            return i
    return None


def col(header: list[str], names) -> int | None:
    """Index of the first header cell whose normalised text is in `names` (checked in `names` order)."""
    normed = [norm(h) for h in header]
    for n in names:
        if n in normed:
            return normed.index(n)
    return None


def read_xlsx(path: Path) -> list[list[str]]:
    """Excel exports (some brokerages, e.g. NetX Investor, offer .xlsx). Needs openpyxl.
    Old .xls files are not supported: open them and "Save as" CSV or .xlsx."""
    try:
        import openpyxl
    except ImportError as e:
        raise RuntimeError("Reading .xlsx needs openpyxl: pip install openpyxl (or save the file as CSV)") from e
    wb = openpyxl.load_workbook(str(path), read_only=True, data_only=True)
    ws = wb.worksheets[0]
    out = []
    for row in ws.iter_rows(values_only=True):
        cells = []
        for v in row:
            if v is None:
                cells.append("")
            elif hasattr(v, "strftime"):
                cells.append(v.strftime("%Y-%m-%d"))
            else:
                cells.append(str(v).strip())
        out.append(cells)
    wb.close()
    return out
