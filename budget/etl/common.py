"""Paths, database helpers and small parsing utilities shared by the ETL steps."""
from __future__ import annotations

import re
import sqlite3
from pathlib import Path

BUDGET_DIR = Path(__file__).resolve().parent.parent
REPO_DIR = BUDGET_DIR.parent
BUILD_DIR = BUDGET_DIR / "build"
RAW_DIR = BUDGET_DIR / "raw"
DATA_DIR = BUDGET_DIR / "data"
RULES_DIR = BUDGET_DIR / "rules"
OVERRIDES_DIR = BUDGET_DIR / "overrides"
SCHEMA = BUDGET_DIR / "schema.sql"
DEFAULT_DB = BUILD_DIR / "budget.sqlite"

FIRST_FY = 2021
LAST_FY = 2027


class BuildError(Exception):
    """A check failed and the database must not be published."""


def connect(path: Path) -> sqlite3.Connection:
    con = sqlite3.connect(path)
    con.execute("PRAGMA foreign_keys = ON")
    return con


def create_db(path: Path) -> sqlite3.Connection:
    """Creates an empty database from schema.sql, replacing any file at `path`."""
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        path.unlink()
    con = connect(path)
    con.executescript(SCHEMA.read_text())
    return con


def set_meta(con: sqlite3.Connection, **values) -> None:
    con.executemany(
        "INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
        [(k, None if v is None else str(v)) for k, v in values.items()],
    )


def norm_space(s) -> str:
    return re.sub(r"\s+", " ", str(s or "")).strip()


def parse_amount(v):
    """Exhibit cells: numbers, '1,234', '(1,234)' for negatives, '-' or blank for none."""
    if v is None:
        return None
    if isinstance(v, bool):
        return None
    if isinstance(v, (int, float)):
        return float(v)
    s = str(v).strip().replace(",", "").replace("$", "")
    if s in ("", "-", "--", "—", "–", "n/a", "N/A", "NA", "*"):
        return None
    neg = s.startswith("(") and s.endswith(")")
    s = s.strip("()")
    try:
        x = float(s)
    except ValueError:
        return None
    return -x if neg else x


COMPONENTS = [
    (re.compile(r"marine corps|\busmc\b", re.I), "USMC"),
    (re.compile(r"space force|\bussf\b", re.I), "Space Force"),
    (re.compile(r"air force|\busaf\b|\bdaf\b", re.I), "Air Force"),
    (re.compile(r"\bnavy\b", re.I), "Navy"),
    (re.compile(r"\barmy\b", re.I), "Army"),
]

# Account-code suffixes used in the exhibits (2040A, 1319N, 3600F, 1206F, 0400D ...).
ACCOUNT_SUFFIX = {"A": "Army", "N": "Navy", "F": "Air Force", "D": "Defense-Wide"}


def component_of(*texts: str, account: str = "") -> str:
    joined = " ".join(t for t in texts if t)
    for rx, name in COMPONENTS:
        if rx.search(joined):
            return name
    if re.search(r"defense[- ]wide|defense agencies|\bosd\b|\bdod\b|defense", joined, re.I):
        return "Defense-Wide"
    m = re.search(r"([ANFD])$", account or "")
    return ACCOUNT_SUFFIX.get(m.group(1), "Other") if m else "Other"
