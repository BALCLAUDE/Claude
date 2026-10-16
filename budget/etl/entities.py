"""Company ↔ USAspending recipient (UEI) resolution.

For each map company: search the recipient index with its keywords, keep recipients whose
normalized name matches the company's patterns (rules/entity_aliases.yaml, or the map name by
default). Subsidiaries with other names are listed as patterns in the YAML. USAspending's parent ->
children lists are not used by default: they keep every entity ever linked to a parent (Lockheed
Martin still "owns" Leidos and RTX owns Sikorsky), so `parents: true` turns them on per company only
after review. The result, with the evidence for every
match, is written to budget/raw/usaspending/entities.json, which is committed so reviewers can see
and correct it, and is what the awards fetch and the database build read.
"""
from __future__ import annotations

import json
import re
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import yaml

from . import http
from .common import RAW_DIR, RULES_DIR

ALIASES_PATH = RULES_DIR / "entity_aliases.yaml"
OUT_PATH = RAW_DIR / "usaspending" / "entities.json"
SUFFIXES = r"(INC|INCORPORATED|LLC|L L C|CORP|CORPORATION|CO|COMPANY|LTD|LIMITED|LP|LLP|PLC|PBC|HOLDINGS|GROUP|SA|AG|GMBH|NV|BV|AB|AS|ASA|SPA|S P A)"


def normalize(name: str) -> str:
    s = (name or "").upper().replace("&", " AND ")
    s = re.sub(r"[^A-Z0-9 ]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def default_pattern(company_name: str) -> str:
    core = re.sub(rf"(\s{SUFFIXES})+$", "", normalize(company_name))
    return rf"^{re.escape(core)}\b"


def load_config(path: Path = ALIASES_PATH) -> dict:
    return (yaml.safe_load(path.read_text()) or {}).get("companies", {}) if path.exists() else {}


def company_rules(company: dict, cfg: dict) -> dict:
    c = cfg.get(company["id"], {}) or {}
    return {
        "skip": bool(c.get("skip")),
        "search": c.get("search") or [company["name"]],
        "match": [re.compile(p) for p in (c.get("match") or [default_pattern(company["name"])])],
        "exclude": [re.compile(p) for p in c.get("exclude") or []],
        "include_ueis": set(c.get("include_ueis") or []),
        "exclude_ueis": set(c.get("exclude_ueis") or []),
        "note": c.get("note"),
        "parents": bool(c.get("parents")),
    }


def search_recipients(keyword: str, limit: int = 100) -> list[dict]:
    out, page = [], 1
    while True:
        d = http.call("recipient/", {"keyword": keyword, "award_type": "all", "limit": limit, "page": page,
                                     "sort": "amount", "order": "desc"})
        out += d.get("results", [])
        meta = d.get("page_metadata", {})
        if not meta.get("hasNext") or page >= 5:
            return out
        page += 1


def children(parent_uei: str) -> list[dict]:
    try:
        return http.call(f"recipient/children/{parent_uei}/") or []
    except RuntimeError:
        return []


def resolve_company(company: dict, cfg: dict) -> dict:
    r = company_rules(company, cfg)
    result = {"company_id": company["id"], "name": company["name"], "recipients": [], "note": r["note"]}
    if r["skip"]:
        result["skipped"] = True
        return result
    seen: dict = {}
    for kw in r["search"]:
        for rec in search_recipients(kw):
            nm = normalize(rec.get("name"))
            uei = rec.get("uei")
            if not uei or uei in r["exclude_ueis"]:
                continue
            if any(p.search(nm) for p in r["match"]) and not any(p.search(nm) for p in r["exclude"]):
                prev = seen.get(uei)
                if prev is None or rec.get("recipient_level") == "P":
                    seen[uei] = {"uei": uei, "name": rec["name"], "level": rec.get("recipient_level"),
                                 "recipient_id": rec.get("id"), "amount_all_agencies": rec.get("amount"),
                                 "method": "name", "evidence": f"matched search '{kw}'"}
    for parent in [v for v in list(seen.values()) if v["level"] == "P" and r["parents"]]:
        for ch in children(parent["uei"]):
            uei = ch.get("uei")
            if uei and uei not in seen and uei not in r["exclude_ueis"]:
                seen[uei] = {"uei": uei, "name": ch.get("name"), "level": "C", "recipient_id": ch.get("recipient_id"),
                             "amount_all_agencies": ch.get("amount"), "method": "parent",
                             "evidence": f"child of parent {parent['uei']} ({parent['name']})"}
    for uei in r["include_ueis"] - set(seen):
        seen[uei] = {"uei": uei, "name": None, "level": None, "recipient_id": None, "amount_all_agencies": None,
                     "method": "curated", "evidence": "include_ueis in entity_aliases.yaml"}
    result["recipients"] = sorted(seen.values(), key=lambda x: -(x["amount_all_agencies"] or 0))
    return result


def resolve_all(companies: list[dict], workers: int = 6, out: Path = OUT_PATH) -> list[dict]:
    """Resolves `companies` and merges them into entities.json (other companies are kept)."""
    cfg = load_config()
    with ThreadPoolExecutor(workers) as ex:
        results = list(ex.map(lambda c: resolve_company(c, cfg), companies))
    merged = {e["company_id"]: e for e in read(out)}
    merged.update({e["company_id"]: e for e in results})
    resolve_conflicts(list(merged.values()))
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({"companies": sorted(merged.values(), key=lambda e: e["company_id"])}, indent=1) + "\n")
    return results


def resolve_conflicts(results: list[dict]) -> list[tuple]:
    """A UEI may match two companies (a subsidiary sold between them). Name matches beat parent links;
    remaining ties are dropped from every claimant and listed under `conflicts` for review."""
    claims: dict = {}
    for e in results:
        for r in e["recipients"]:
            claims.setdefault(r["uei"], []).append((e, r))
    dropped = []
    for uei, cl in claims.items():
        if len(cl) < 2:
            continue
        strong = [(e, r) for e, r in cl if r["method"] in ("name", "curated")]
        keep = strong[0][0]["company_id"] if len(strong) == 1 else None
        for e, r in cl:
            if e["company_id"] != keep:
                e["recipients"] = [x for x in e["recipients"] if x["uei"] != uei]
                e.setdefault("conflicts", []).append({"uei": uei, "name": r["name"], "kept_by": keep})
                dropped.append((uei, e["company_id"], keep))
    return dropped


def read(path: Path = OUT_PATH) -> list[dict]:
    return json.loads(path.read_text())["companies"] if path.exists() else []
