"""Curated mandatory funding (reconciliation sections and supplementals) → mandatory_funding,
plus budget_lines/budget_values for rows the exhibits do not already carry.

Source: budget/data/mandatory_funding.csv, one row per law section (or per component split of a
section), each with its own citation. From FY2026 the R-1/P-1/O-1 books print a reconciliation
column per line, which budget_exhibits.py reads directly; mark rows already reflected there with
counted_in_exhibits=1 so they are kept for reference but not counted twice.
"""
from __future__ import annotations

import csv
import sqlite3
from pathlib import Path

from .common import BuildError, DATA_DIR, component_of

CSV_PATH = DATA_DIR / "mandatory_funding.csv"
COLUMNS = ["id", "law", "public_law", "section", "title", "kind", "fy", "available_through", "component",
           "appropriation", "program_id", "subsegments", "amount_k", "counted_in_exhibits", "source_url",
           "source_page", "notes"]


def read(path: Path = CSV_PATH) -> list[dict]:
    if not path.exists():
        return []
    with path.open(newline="") as f:
        reader = csv.DictReader(f)
        missing = set(COLUMNS) - set(reader.fieldnames or [])
        if missing:
            raise BuildError(f"{path.name}: missing columns {sorted(missing)}")
        return [r for r in reader if r["id"] and not r["id"].startswith("#")]


def parse_weights(spec: str) -> list[tuple[str, float]]:
    """'cuas.missiledefense:0.6; space.buses:0.4' → [(id, weight), ...]; a bare id gets weight 1."""
    out = []
    for part in (spec or "").replace(",", ";").split(";"):
        part = part.strip()
        if not part:
            continue
        sid, _, w = part.partition(":")
        out.append((sid.strip(), float(w) if w else 1.0))
    return out


def load(con: sqlite3.Connection, rows: list[dict], source_name: str = CSV_PATH.name) -> dict:
    subs = {r[0] for r in con.execute("SELECT id FROM subsegments")}
    programs = {r[0] for r in con.execute("SELECT id FROM programs")}
    added = 0
    for r in rows:
        kind = r["kind"].strip().lower()
        if kind not in ("reconciliation", "supplemental"):
            raise BuildError(f"{source_name} {r['id']}: kind must be reconciliation or supplemental")
        if not r.get("source_url") and not r.get("source_page"):
            raise BuildError(f"{source_name} {r['id']}: every row needs a source_url or source_page")
        counted = r.get("counted_in_exhibits", "").strip().lower() in ("1", "yes", "true", "y")
        amount = float(r["amount_k"])
        fy = int(r["fy"])
        con.execute(
            "INSERT INTO mandatory_funding VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            (r["id"], r["law"], r.get("public_law"), r.get("section"), r["title"], kind, fy,
             int(r["available_through"]) if r.get("available_through") else None, r.get("component"),
             r.get("appropriation"), r.get("program_id") or None, amount, int(counted),
             r.get("source_url"), r.get("source_page"), r.get("notes")))
        if counted:
            continue
        line_id = f"{'recon' if kind == 'reconciliation' else 'supp'}:{r['id']}"
        title = f"{r['title']} ({r['law']}{' §' + r['section'] if r.get('section') else ''})"
        con.execute(
            """INSERT INTO budget_lines (line_id, exhibit, appropriation, account, account_title, component,
                 organization, title, first_book, last_book) VALUES (?,?,?,?,?,?,?,?,?,?)""",
            (line_id, line_id.split(":")[0], kind.capitalize(), r.get("appropriation") or None, r["law"],
             r.get("component") or component_of(r.get("component", "")), r.get("component"), title, fy, fy))
        con.execute(
            """INSERT INTO budget_values (line_id, fy, value_type, amount_k, source_doc, book_fy, source_file, page)
               VALUES (?,?,?,?,?,?,?,?)""",
            (line_id, fy, kind, amount, r["law"], fy, source_name, r.get("source_page") or r.get("source_url")))
        weights = parse_weights(r.get("subsegments", ""))
        if weights:
            bad = [s for s, _ in weights if s not in subs]
            if bad or abs(sum(w for _, w in weights) - 1) > 1e-6:
                raise BuildError(f"{source_name} {r['id']}: subsegments {bad or ''} must exist and weights sum to 1")
            con.executemany(
                "INSERT INTO line_sector_map (line_id, subsegment_id, weight, method, confidence, rationale, reviewer)"
                " VALUES (?,?,?,'human',1.0,?,?)",
                [(line_id, s, w, "Curated in mandatory_funding.csv", "curated") for s, w in weights])
            con.execute("INSERT INTO line_status VALUES (?,?,?,?,?,?)",
                        (line_id, "mapped", "human", None, 1.0, "Curated in mandatory_funding.csv"))
        if r.get("program_id") in programs:
            con.execute("INSERT OR IGNORE INTO line_program VALUES (?,?,?,?)",
                        (line_id, r["program_id"], "human", "mandatory_funding.csv"))
        added += 1
    return {"rows": len(rows), "lines_added": added}
