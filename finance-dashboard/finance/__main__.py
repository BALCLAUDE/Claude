"""Command line: python -m finance <command>

  init       create the data workspace (folders + config templates)
  ingest     import new files from inbox/<account>/
  build      write out/dashboard.html
  review     list uncategorized merchants and import problems
  inspect    print a redacted layout of a statement (safe to share for writing a parser)
  demo       build a dashboard from generated fake data, to try it out
"""
from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

from .config import Workspace


def main(argv=None):
    ap = argparse.ArgumentParser(prog="python -m finance", description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--data", default=os.environ.get("FINANCE_DATA", "data"), help="workspace folder (default ./data, or $FINANCE_DATA)")
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("init")
    p = sub.add_parser("ingest")
    p.add_argument("--force", action="store_true", help="re-read files already imported, and import statements that do not reconcile")
    p = sub.add_parser("build")
    p.add_argument("--out", type=Path)
    p.add_argument("--as-of", help="treat this date (yyyy-mm-dd) as today")
    p.add_argument("--open", action="store_true", help="open the dashboard in your browser")
    p = sub.add_parser("review")
    p.add_argument("-n", type=int, default=25)
    p = sub.add_parser("inspect")
    p.add_argument("file", type=Path)
    p.add_argument("--lines", type=int, default=400)
    p = sub.add_parser("demo")
    p.add_argument("--dir", default="demo", help="where to write the fake workspace (default ./demo)")
    p.add_argument("--open", action="store_true")
    a = ap.parse_args(argv)

    if a.cmd == "inspect":
        print(__import__("finance.inspect", fromlist=["inspect_file"]).inspect_file(a.file, a.lines))
        return
    if a.cmd == "demo":
        from .sample import make_demo
        from .build import build
        from .ingest import ingest
        ws = Workspace(a.dir)
        make_demo(ws)
        ingest(ws, log=lambda m: None)
        out = build(ws, as_of=None)
        print(f"Demo dashboard: {out}")
        _open(out, a.open)
        return

    ws = Workspace(a.data)
    if a.cmd == "init":
        created = ws.init()
        print(f"Workspace ready at {ws.root}")
        for c in created:
            print(f"  created {c}")
        print("Next: edit config/accounts.yaml, make one folder per account under inbox/, drop statements in, run ingest.")
    elif a.cmd == "ingest":
        stats = ingest_cmd(ws, a.force)
        print(f"Done: {stats.get('files', 0)} new files, {stats.get('rows', 0)} rows, {stats.get('unchanged', 0)} already imported, "
              f"{stats.get('errors', 0)} problems.")
    elif a.cmd == "build":
        from .build import build
        out = build(ws, a.out, a.as_of)
        print(f"Dashboard written to {out}")
        _open(out, a.open)
    elif a.cmd == "review":
        review(ws, a.n)


def ingest_cmd(ws, force):
    from .ingest import ingest
    return ingest(ws, force=force)


def review(ws: Workspace, n: int):
    from . import db
    con = db.connect(ws.db_path)
    rows = con.execute(
        """SELECT merchant, COUNT(*) c, ROUND(SUM(-amount), 2) total, MIN(description_raw) example FROM transactions
           WHERE category='Uncategorized' AND is_transfer=0 GROUP BY merchant ORDER BY ABS(SUM(amount)) DESC LIMIT ?""", (n,)).fetchall()
    total = con.execute("SELECT COUNT(*), ROUND(SUM(-amount),2) FROM transactions WHERE category='Uncategorized' AND is_transfer=0").fetchone()
    print(f"{total[0]} uncategorized transactions (${total[1] or 0:,.2f}). Biggest merchants:\n")
    for r in rows:
        print(f"  {r['total']:>10,.2f}  ×{r['c']:<3} {r['merchant']:<32} e.g. {r['example'][:50]}")
    if rows:
        print("\nAdd rules to config/rules.yaml, for example:")
        for r in rows[:3]:
            word = r["merchant"].split()[0].upper() if r["merchant"] else ""
            print(f"  - {{match: '{word}', category: <Category>}}")
    from .insights import unmatched_transfers
    um = unmatched_transfers(con)
    if um:
        print("\nTransfers with no match in another imported account (a missing account? its spending isn't counted):")
        for r in um:
            print(f"  {r['n']:>4}×  {r['total']:>11,.2f}  {r['merchant'][:30]:<30} from {r['account']}  ({r['first']} to {r['last']})")
        print("  Fix: import that account, or add a rule giving those payments a spending category.")
    probs = con.execute("SELECT path, status, message FROM imports WHERE status NOT IN ('ok', 'verified') ORDER BY imported_at DESC").fetchall()
    if probs:
        print("\nImport notes:")
        for p in probs:
            print(f"  [{p['status']}] {p['path']}: {p['message']}")


def _open(path: Path, do: bool):
    if do:
        import webbrowser
        webbrowser.open(path.resolve().as_uri())


if __name__ == "__main__":
    sys.exit(main())
