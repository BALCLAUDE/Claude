"""Compute everything and write one self-contained, offline HTML file."""
from __future__ import annotations

import json
import re
from datetime import date, datetime
from pathlib import Path

import yaml

from . import db, insights, investments, metrics, recurring
from .config import PKG_ROOT, Workspace
from .ingest import load_manual, process

WEB = PKG_ROOT / "web"


def compute(ws: Workspace, as_of: str | None = None) -> dict:
    con = db.connect(ws.db_path)
    load_manual(con, ws)
    process(con, ws)
    settings = ws.settings()
    accounts = {r["id"]: dict(r) for r in con.execute("SELECT * FROM accounts ORDER BY type, name")}
    txns = metrics.load_txns(con)
    dates = [t["date"] for t in txns] + [r["date"] for r in con.execute("SELECT date FROM balances")]
    if not dates:
        raise SystemExit("Nothing imported yet. Drop statements into inbox/<account>/ and run `python -m finance ingest`.")
    last = as_of or min(max(dates), date.today().isoformat())
    months = metrics.month_range(min(dates), last)
    bal_cfg = ws.load("balances.yaml") or {}
    nw = metrics.net_worth(con, months, bal_cfg.get("anchors"))
    summary = metrics.monthly_summary([t for t in txns if t["date"] <= last])

    with open(PKG_ROOT / "finance" / "default_securities.yaml", encoding="utf-8") as f:
        secs = investments.Securities(yaml.safe_load(f), ws.load("securities.yaml") or {})
    targets = ws.load("targets.yaml") or {}
    alloc = investments.allocation(con, secs, targets, targets.get("concentration_limit", 10))
    grow = investments.growth(con, months, nw["by_account"])
    rec = recurring.detect(txns, last)
    manual = bal_cfg.get("manual") or {}

    data = {
        "meta": {"title": settings.get("dashboard_title", "My Finances"), "generated": datetime.now().isoformat(timespec="minutes"),
                 "as_of": last, "first": min(dates), "settings": {k: settings.get(k) for k in ("expected_return_pct", "fi_multiple", "essential_categories")}},
        "accounts": [{"id": a["id"], "name": a["name"], "type": a["type"], "institution": a["institution"], "tax": a["tax"]} for a in accounts.values()],
        # Compact rows: date, account index, amount, merchant, category, tags, is_transfer, raw description
        "txns": [],
        "summary": summary,
        "networth": nw,
        "allocation": alloc,
        "growth": grow,
        "recurring": rec,
        "budgets": insights.budgets(summary, ws.load("budgets.yaml") or {}, last),
        "runway": insights.runway(summary, txns, nw, accounts, settings.get("essential_categories") or []),
        "debts": insights.debts(con, nw, ws.accounts(), manual, txns),
        "alerts": insights.alerts(txns, rec, last, float(settings.get("unusual_multiple", 2.5))),
        "yoy": insights.year_over_year(txns, last),
        "tax": insights.tax_tags(txns),
        "report_cards": insights.report_cards(summary, nw),
        "imports": [dict(r) for r in con.execute("SELECT path, account_id, parser, rows, status, message, imported_at FROM imports ORDER BY imported_at DESC")],
    }
    idx = {aid: i for i, aid in enumerate(accounts)}
    for t in txns:
        data["txns"].append([t["date"], idx[t["account_id"]], t["amount"], t["merchant"], t["category"], t["tags"] or "",
                             1 if t["is_transfer"] else 0, t["description_raw"]])
    con.close()
    return data


def render(data: dict) -> str:
    html = (WEB / "template.html").read_text(encoding="utf-8")
    safe = lambda s: s.replace("</script", "<\\/script").replace("</style", "<\\/style")
    blob = json.dumps(data, separators=(",", ":"), default=str).replace("</", "<\\/")
    parts = {
        "/*STYLES*/": safe((WEB / "styles.css").read_text(encoding="utf-8")),
        "/*CHARTJS*/": safe((WEB / "vendor" / "chart.umd.min.js").read_text(encoding="utf-8")),
        "/*APP*/": safe((WEB / "app.js").read_text(encoding="utf-8")),
        "/*DATA*/": f"window.FIN = {blob};",
        "%%TITLE%%": data["meta"]["title"].replace("<", "&lt;"),
    }
    # One pass over the template, so inserted content is never re-scanned for placeholders.
    return re.sub("|".join(re.escape(k) for k in parts), lambda m: parts[m.group(0)], html)


def build(ws: Workspace, out: Path | None = None, as_of: str | None = None) -> Path:
    data = compute(ws, as_of)
    out = out or ws.out_dir / "dashboard.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(render(data), encoding="utf-8")
    return out
