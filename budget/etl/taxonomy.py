"""Loads the map's taxonomy, companies and programs (budget/build/taxonomy.json) into the database.

The JSON is written by `node scripts/export-taxonomy.mjs`; `npm run budget:build` runs it first.
"""
from __future__ import annotations

import json
import sqlite3
import subprocess
from pathlib import Path

from .common import BUILD_DIR, REPO_DIR, BuildError

TAXONOMY_JSON = BUILD_DIR / "taxonomy.json"


def export(path: Path = TAXONOMY_JSON) -> None:
    """Re-exports the taxonomy from src/data (needs node)."""
    try:
        subprocess.run(["node", str(REPO_DIR / "scripts" / "export-taxonomy.mjs")], check=True, cwd=REPO_DIR)
    except (OSError, subprocess.CalledProcessError) as e:
        if not path.exists():
            raise BuildError(f"cannot export taxonomy ({e}) and {path} does not exist") from e
        print(f"  node export failed ({e}); using existing {path.name}")


def read(path: Path = TAXONOMY_JSON) -> dict:
    if not path.exists():
        export(path)
    return json.loads(path.read_text())


def load(con: sqlite3.Connection, tax: dict) -> dict:
    subs = set()
    for i, seg in enumerate(tax["segments"]):
        con.execute("INSERT INTO segments (id, code, name, blurb, sort) VALUES (?,?,?,?,?)",
                    (seg["id"], seg.get("code"), seg["name"], seg.get("blurb"), i))
        for j, s in enumerate(seg["subsegments"]):
            con.execute("INSERT INTO subsegments (id, segment_id, name, blurb, sort) VALUES (?,?,?,?,?)",
                        (s["id"], seg["id"], s["name"], s.get("blurb"), i * 100 + j))
            subs.add(s["id"])
    for p in tax.get("programs", []):
        con.execute("INSERT INTO programs (id, name, customer, blurb) VALUES (?,?,?,?)",
                    (p["id"], p["name"], p.get("customer"), p.get("blurb")))
    programs = {p["id"] for p in tax.get("programs", [])}
    for c in tax["companies"]:
        sales = c.get("consensusSalesM") or [None, None]
        primary = next((s for s in c["subsegments"] if s in subs), None)
        con.execute(
            """INSERT INTO companies (id, name, status, ticker, exchange, country, domain, primary_subsegment,
                 consensus_sales_cy25_m, consensus_sales_cy26_m) VALUES (?,?,?,?,?,?,?,?,?,?)""",
            (c["id"], c["name"], c["status"], c.get("ticker"), c.get("exchange"), c.get("country"),
             c.get("domain"), primary, sales[0], sales[1]))
        con.executemany("INSERT OR IGNORE INTO company_subsegments VALUES (?,?)",
                        [(c["id"], s) for s in c["subsegments"] if s in subs])
        con.executemany("INSERT OR IGNORE INTO company_programs VALUES (?,?)",
                        [(c["id"], p) for p in c.get("programs", []) if p in programs])
    return {"segments": len(tax["segments"]), "subsegments": len(subs),
            "companies": len(tax["companies"]), "programs": len(programs)}
