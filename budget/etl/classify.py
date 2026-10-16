"""Budget lines → map subsegments.

Order of precedence, highest first:
  1. budget/overrides/line_sector.csv: analyst decisions, versioned in git, always win.
  2. Curated weights already written by reconciliation.py (method 'human').
  3. budget/rules/sector_rules.yaml: PE / line-number / title / program rules, first match wins.
  4. (Phase 4) the cached Claude pass for the remaining tech-relevant lines.
Whatever is left is 'unclassified'. Low-confidence and very large machine mappings, and large
unclassified RDT&E / Procurement lines, go to the review queue.
"""
from __future__ import annotations

import csv
import datetime as dt
import fnmatch
import re
import sqlite3
from dataclasses import dataclass, field
from pathlib import Path

import yaml

from .common import BuildError, OVERRIDES_DIR, RULES_DIR

RULES_PATH = RULES_DIR / "sector_rules.yaml"
OVERRIDES_PATH = OVERRIDES_DIR / "line_sector.csv"
LIST_FIELDS = ("exhibit", "appropriation", "component", "account")


@dataclass
class Rule:
    id: str
    title: re.Pattern | None = None
    exclude: re.Pattern | None = None
    pe: list = field(default_factory=list)
    filters: dict = field(default_factory=dict)
    subsegments: dict = field(default_factory=dict)
    not_tech: bool = False
    program: str | None = None
    confidence: float = 1.0
    note: str = ""

    def matches(self, line: dict) -> bool:
        for f, allowed in self.filters.items():
            if (line.get(f) or "") not in allowed:
                return False
        if self.pe:
            code = (line.get("pe_bli") or "").upper()
            if not any(fnmatch.fnmatchcase(code, p.upper()) for p in self.pe):
                return False
        title = line.get("title") or ""
        if self.title and not self.title.search(title):
            return False
        if self.exclude and self.exclude.search(title):
            return False
        return True


@dataclass
class RuleSet:
    rules: list
    review: dict

    def match(self, line: dict) -> Rule | None:
        return next((r for r in self.rules if r.matches(line)), None)


def load_rules(path: Path = RULES_PATH, subsegments: set | None = None, programs: set | None = None) -> RuleSet:
    doc = yaml.safe_load(path.read_text())
    rules, seen = [], set()
    for raw in doc.get("rules", []):
        rid = raw.get("id")
        if not rid or rid in seen:
            raise BuildError(f"{path.name}: every rule needs a unique id (got {rid!r})")
        seen.add(rid)
        unknown = set(raw) - {"id", "title", "exclude", "pe", "subsegments", "not_tech", "program",
                              "confidence", "note", *LIST_FIELDS}
        if unknown:
            raise BuildError(f"{path.name} {rid}: unknown fields {sorted(unknown)}")
        subs = {k: float(v) for k, v in (raw.get("subsegments") or {}).items()}
        if bool(subs) == bool(raw.get("not_tech")):
            raise BuildError(f"{path.name} {rid}: give either subsegments or not_tech")
        if subs:
            if abs(sum(subs.values()) - 1) > 1e-6:
                raise BuildError(f"{path.name} {rid}: subsegment weights must sum to 1")
            if subsegments is not None and set(subs) - subsegments:
                raise BuildError(f"{path.name} {rid}: unknown subsegments {sorted(set(subs) - subsegments)}")
        if raw.get("program") and programs is not None and raw["program"] not in programs:
            raise BuildError(f"{path.name} {rid}: unknown program {raw['program']}")
        if not any(raw.get(k) for k in ("title", "pe", *LIST_FIELDS)):
            raise BuildError(f"{path.name} {rid}: rule matches everything; add a condition")
        pe = [str(p) for p in raw.get("pe") or []]
        rules.append(Rule(
            id=rid,
            title=re.compile(raw["title"], re.I) if raw.get("title") else None,
            exclude=re.compile(raw["exclude"], re.I) if raw.get("exclude") else None,
            pe=pe,
            filters={f: set(raw[f]) for f in LIST_FIELDS if raw.get(f)},
            subsegments=subs,
            not_tech=bool(raw.get("not_tech")),
            program=raw.get("program"),
            confidence=float(raw.get("confidence", 1.0 if pe else 0.9)),
            note=raw.get("note", ""),
        ))
    review = {"min_confidence": 0.8, "unreviewed_max_k": 1_000_000, "unclassified_min_k": 100_000}
    review.update(doc.get("review") or {})
    return RuleSet(rules, review)


def load_overrides(path: Path = OVERRIDES_PATH) -> dict:
    """line_id → list of (subsegment_id | 'not_tech', weight, rationale, reviewer)."""
    out: dict = {}
    if not path.exists():
        return out
    with path.open(newline="") as f:
        for r in csv.DictReader(f):
            if not r.get("line_id") or r["line_id"].startswith("#"):
                continue
            out.setdefault(r["line_id"], []).append(
                (r["subsegment_id"].strip(), float(r.get("weight") or 1), r.get("rationale", ""), r.get("reviewer", "")))
    return out


def line_sizes(con: sqlite3.Connection) -> dict:
    """Largest absolute value per line across the latest books ($K); used for review thresholds."""
    return dict(con.execute("SELECT line_id, MAX(ABS(amount_k)) FROM v_values_latest GROUP BY line_id"))


def classify(con: sqlite3.Connection, rules: RuleSet | None = None, overrides: dict | None = None) -> dict:
    subsegments = {r[0] for r in con.execute("SELECT id FROM subsegments")}
    programs = {r[0] for r in con.execute("SELECT id FROM programs")}
    rules = rules or load_rules(subsegments=subsegments, programs=programs)
    overrides = load_overrides() if overrides is None else overrides
    today = dt.date.today().isoformat()
    con.row_factory = sqlite3.Row
    lines = [dict(r) for r in con.execute("SELECT * FROM budget_lines")]
    con.row_factory = None
    curated = {r[0] for r in con.execute("SELECT line_id FROM line_status WHERE method = 'human'")}
    stats = {"lines": len(lines), "override": 0, "rule": 0, "not_tech": 0, "unclassified": 0, "curated": 0}
    known = {ln["line_id"] for ln in lines}
    stale = sorted(set(overrides) - known)

    for ln in lines:
        lid = ln["line_id"]
        if lid in overrides:
            rows = overrides[lid]
            con.execute("DELETE FROM line_sector_map WHERE line_id = ?", (lid,))
            con.execute("DELETE FROM line_status WHERE line_id = ?", (lid,))
            if any(s == "not_tech" for s, *_ in rows):
                con.execute("INSERT INTO line_status VALUES (?,?,?,?,?,?)",
                            (lid, "not_tech", "human", None, 1.0, rows[0][2]))
            else:
                bad = [s for s, *_ in rows if s not in subsegments]
                if bad or abs(sum(w for _, w, *_ in rows) - 1) > 1e-6:
                    raise BuildError(f"{OVERRIDES_PATH.name} {lid}: unknown subsegments {bad} or weights do not sum to 1")
                con.executemany(
                    "INSERT INTO line_sector_map (line_id, subsegment_id, weight, method, confidence, rationale, reviewer)"
                    " VALUES (?,?,?,'human',1.0,?,?)", [(lid, s, w, why, who) for s, w, why, who in rows])
                con.execute("INSERT INTO line_status VALUES (?,?,?,?,?,?)",
                            (lid, "mapped", "human", None, 1.0, rows[0][2]))
            stats["override"] += 1
            continue
        if lid in curated:
            stats["curated"] += 1
            continue
        rule = rules.match(ln)
        if rule is None:
            con.execute("INSERT INTO line_status VALUES (?,?,?,?,?,?)", (lid, "unclassified", None, None, None, None))
            stats["unclassified"] += 1
        elif rule.not_tech:
            con.execute("INSERT INTO line_status VALUES (?,?,?,?,?,?)",
                        (lid, "not_tech", "rule", rule.id, rule.confidence, rule.note or None))
            stats["not_tech"] += 1
        else:
            con.executemany(
                "INSERT INTO line_sector_map (line_id, subsegment_id, weight, method, confidence, rule_id, rationale)"
                " VALUES (?,?,?,'rule',?,?,?)",
                [(lid, s, w, rule.confidence, rule.id, rule.note or None) for s, w in rule.subsegments.items()])
            con.execute("INSERT INTO line_status VALUES (?,?,?,?,?,?)",
                        (lid, "mapped", "rule", rule.id, rule.confidence, rule.note or None))
            if rule.program:
                con.execute("INSERT OR IGNORE INTO line_program VALUES (?,?,?,?)",
                            (lid, rule.program, "rule", f"rule {rule.id}"))
            stats["rule"] += 1

    # Review queue.
    sizes = line_sizes(con)
    rv = rules.review
    queue = []
    for lid, status, method, rule_id, conf in con.execute(
            "SELECT line_id, status, method, rule_id, confidence FROM line_status"):
        size = sizes.get(lid) or 0
        if method == "human":
            continue
        if status == "unclassified":
            if size >= rv["unclassified_min_k"] and lid.split(":")[0] in ("r1", "p1", "recon", "supp"):
                queue.append(("line", lid, "unclassified", size, None, today))
        elif conf is not None and conf < rv["min_confidence"]:
            queue.append(("line", lid, f"low confidence ({conf:.2f}) from rule {rule_id}", size, rule_id, today))
        elif status == "mapped" and size >= rv["unreviewed_max_k"]:
            queue.append(("line", lid, f"large line mapped by {method} {rule_id or ''}".strip(), size, rule_id, today))
    con.executemany("INSERT INTO review_queue (item_type, item_id, reason, amount_k, suggestion, created)"
                    " VALUES (?,?,?,?,?,?)", queue)
    stats["review_queue"] = len(queue)
    stats["stale_overrides"] = stale
    return stats
