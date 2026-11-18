"""Import every new file in inbox/<account>/ into the database, then categorize and match transfers."""
from __future__ import annotations

import re
from collections import Counter
from pathlib import Path

from . import db
from .categorize import Categorizer
from .config import PKG_ROOT, Workspace
from .models import ACCOUNT_TYPES, INVEST_TYPES, Flow, ParseResult
from .normalize import merchant as clean_merchant
from .parsers import SUPPORTED_SUFFIXES, parse_file
from .transfers import match_transfers
from .util import file_hash, txn_id

import yaml


def classify_flow(desc: str, amount: float) -> str:
    """Brokerage activity rows -> flow type."""
    d = desc.upper()
    if re.search(r"REINVEST", d):
        return "buy"
    if re.search(r"DIVIDEND|DIV\b|CAP GAIN|CAPITAL GAIN|DISTRIBUTION", d):
        return "dividend"
    if re.search(r"INTEREST", d):
        return "interest"
    if re.search(r"\bFEE|ADVISORY|COMMISSION|EXPENSE", d):
        return "fee"
    if re.search(r"YOU BOUGHT|\bBUY\b|BOUGHT|PURCHASE", d):
        return "buy"
    if re.search(r"YOU SOLD|\bSELL\b|SOLD|REDEMPTION", d):
        return "sell"
    if re.search(r"CONTRIBUTION|DEPOSIT|TRANSFER IN|ELECTRONIC FUNDS TRANSFER RECEIVED|EFT RECEIVED|ACH IN|JOURNALED|ROLLOVER|MONEYLINK|WIRE IN", d):
        return "contribution" if amount > 0 else "withdrawal"
    if re.search(r"WITHDRAWAL|TRANSFER OUT|DISBURSEMENT|ACH OUT|WIRE OUT|DISTRIBUTION PAID", d):
        return "withdrawal"
    return "other"


def ingest(ws: Workspace, force: bool = False, log=print) -> dict:
    con = db.connect(ws.db_path)
    accounts = ws.accounts()
    stats = Counter()
    if not ws.inbox.exists():
        raise SystemExit(f"No inbox at {ws.inbox}. Run `python -m finance init` first.")
    for folder in sorted(p for p in ws.inbox.iterdir() if p.is_dir()):
        acct = accounts.get(folder.name)
        if acct is None:
            log(f"! {folder.name}/: not in config/accounts.yaml, skipped. Add it with a type (checking, credit, brokerage...).")
            stats["skipped"] += 1
            continue
        if acct.get("type") not in ACCOUNT_TYPES:
            raise SystemExit(f"accounts.yaml: {folder.name} has type {acct.get('type')!r}; use one of {ACCOUNT_TYPES}")
        db.upsert_account(con, folder.name, acct)
        for path in sorted(folder.rglob("*")):
            if not path.is_file() or path.suffix.lower() not in SUPPORTED_SUFFIXES or path.name.startswith("."):
                continue
            fh = file_hash(path)
            if db.already_imported(con, fh) and not force:
                stats["unchanged"] += 1
                continue
            rel = path.relative_to(ws.root)
            try:
                res = parse_file(path, acct)
            except Exception as e:  # report and move on: one bad file should not stop the rest
                log(f"✗ {rel}: {e}")
                db.record_import(con, fh, rel, folder.name, "-", 0, "error", str(e))
                stats["errors"] += 1
                continue
            if res.reconciled is False and not force:
                log(f"✗ {rel}: {res.parser} read it but it {res.warnings[0] if res.warnings else 'did not reconcile'}. Not imported. "
                    f"Run `python -m finance inspect {rel}` to build a parser for this layout, or re-run with --force.")
                db.record_import(con, fh, rel, folder.name, res.parser, 0, "unreconciled", "; ".join(res.warnings))
                stats["errors"] += 1
                continue
            n = store(con, folder.name, acct, res, str(rel))
            status = "verified" if res.reconciled else ("warning" if res.warnings else "ok")
            db.record_import(con, fh, rel, folder.name, res.parser, n, status, "; ".join(res.warnings))
            mark = "✓" if res.reconciled else "•"
            log(f"{mark} {rel}: " + (f"{n} rows" if n or not res.balances else f"{len(res.balances)} balance" + ("s" if len(res.balances) > 1 else "")) + f" via {res.parser}" + (" (reconciled)" if res.reconciled else "") +
                "".join(f"\n    note: {w}" for w in res.warnings))
            stats["files"] += 1
            stats["rows"] += n
    load_manual(con, ws)
    con.commit()
    process(con, ws)
    con.close()
    return dict(stats)


def store(con, acct_id: str, acct: dict, res: ParseResult, source: str) -> int:
    invest = acct["type"] in INVEST_TYPES
    seen = Counter()
    n = 0
    flows = list(res.flows)
    for t in res.transactions:
        key = (t.date, round(t.amount, 2), t.description)
        seen[key] += 1
        if invest:
            flows.append(Flow(t.date, classify_flow(t.description, t.amount), t.amount, "", t.description))
            continue
        tid = txn_id(acct_id, t.date, t.amount, t.description, seen[key])
        cur = con.execute(
            "INSERT OR IGNORE INTO transactions (id, account_id, date, amount, description_raw, source_category, source_file) VALUES (?,?,?,?,?,?,?)",
            (tid, acct_id, t.date, t.amount, t.description, t.category, source))
        n += cur.rowcount
    fseen = Counter()
    for f in flows:
        key = (f.date, round(f.amount, 2), f.type, f.symbol, f.description)
        fseen[key] += 1
        fid = txn_id(acct_id, f.date, f.amount, f"{f.type}|{f.symbol}|{f.description}", fseen[key])
        cur = con.execute("INSERT OR IGNORE INTO investment_flows VALUES (?,?,?,?,?,?,?)",
                          (fid, acct_id, f.date, f.type, f.amount, f.symbol, f.description))
        n += cur.rowcount
    for b in res.balances:
        con.execute("INSERT OR REPLACE INTO balances VALUES (?,?,?,?)", (acct_id, b.date, b.balance, source))
    if res.holdings:
        for as_of in {h.as_of for h in res.holdings}:
            con.execute("DELETE FROM holdings WHERE account_id=? AND as_of=?", (acct_id, as_of))
        for h in res.holdings:
            con.execute("INSERT OR REPLACE INTO holdings VALUES (?,?,?,?,?,?,?,?)",
                        (acct_id, h.as_of, h.symbol, h.name, h.quantity, h.price, round(h.market_value, 2), h.cost_basis))
            n += 1
    return n


def load_manual(con, ws: Workspace):
    """balances.yaml: accounts without statements. Re-loaded on every run so edits apply."""
    manual = (ws.load("balances.yaml") or {}).get("manual") or {}
    con.execute("DELETE FROM balances WHERE source='balances.yaml'")
    con.execute("DELETE FROM investment_flows WHERE id LIKE 'manual:%'")
    con.execute("DELETE FROM holdings WHERE account_id IN (SELECT id FROM accounts WHERE institution='(manual)')")
    for key, m in manual.items():
        db.upsert_account(con, key, {"name": m.get("name", key), "type": m.get("type", "asset"), "tax": m.get("tax"), "institution": "(manual)"})
        for d, v in (m.get("values") or {}).items():
            con.execute("INSERT OR REPLACE INTO balances VALUES (?,?,?,?)", (key, str(d), float(v), "balances.yaml"))
        for d, v in (m.get("contributions") or {}).items():
            con.execute("INSERT INTO investment_flows VALUES (?,?,?,?,?,?,?)", (f"manual:{key}:{d}", key, str(d), "contribution", float(v), "", "balances.yaml"))
        for d, funds in (m.get("holdings") or {}).items():
            for sym, v in (funds or {}).items():
                con.execute("INSERT OR REPLACE INTO holdings VALUES (?,?,?,?,?,?,?,?)", (key, str(d), sym.upper(), sym.upper(), None, None, float(v), None))


def process(con, ws: Workspace):
    """Re-categorize everything and redo transfer matching. Cheap, so it runs on every ingest/build,
    which means a rule you add later applies to all past transactions too."""
    with open(PKG_ROOT / "finance" / "default_rules.yaml", encoding="utf-8") as f:
        defaults = yaml.safe_load(f)
    cat = Categorizer(ws.load("rules.yaml") or {}, defaults)
    rows = con.execute("SELECT id, description_raw, amount, source_category FROM transactions").fetchall()
    for r in rows:
        m, c, tags = cat.apply(r["description_raw"], clean_merchant(r["description_raw"]), r["amount"], r["source_category"])
        con.execute("UPDATE transactions SET merchant=?, category=?, tags=?, is_transfer=?, transfer_pair=NULL WHERE id=?",
                    (m, c, ",".join(tags), 1 if c == "Transfer" else 0, r["id"]))
    match_transfers(con, window_days=int(ws.settings().get("transfer_window_days", 4)))
    con.commit()
