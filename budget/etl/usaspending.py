"""USAspending (DoD as awarding agency) → per-company award data and per-sector top recipients.

For every company with resolved UEIs (entities.json) it fetches, for FY2021 to date:
  - monthly obligations, all award types (spending_over_time, grouped by month);
  - obligations by product/service code for each fiscal year (spending_by_category/psc);
  - the 100 largest contract awards (spending_by_award, contracts A-D);
  - order totals and reported ceilings for the 10 IDVs carrying the most of those awards.
It also fetches the top 25 recipients for each `universe` PSC rule and fiscal year.

Results are written as compact JSON under budget/raw/usaspending/ (committed, so a database build
needs no network). Raw API responses are cached under budget/build/cache/usaspending/.
"""
from __future__ import annotations

import datetime as dt
import gzip
import json
import re
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import yaml

from . import entities, http
from .common import FIRST_FY, RAW_DIR, RULES_DIR

OUT_DIR = RAW_DIR / "usaspending"
COMPANY_DIR = OUT_DIR / "companies"
UNIVERSE_PATH = OUT_DIR / "sector_recipients.json"
PSC_RULES_PATH = RULES_DIR / "psc_rules.yaml"
DOD = [{"type": "awarding", "tier": "toptier", "name": "Department of Defense"}]
CONTRACTS = ["A", "B", "C", "D"]
AWARD_FIELDS = ["Award ID", "Recipient Name", "Recipient UEI", "Award Amount", "Description", "Start Date",
                "End Date", "Awarding Sub Agency", "Contract Award Type", "generated_internal_id", "NAICS", "PSC"]
TOP_AWARDS = 100
TOP_IDVS = 10


def fiscal_year(d: dt.date) -> int:
    return d.year + 1 if d.month >= 10 else d.year


def fy_range(fy: int, today: dt.date | None = None) -> dict:
    today = today or dt.date.today()
    end = min(dt.date(fy, 9, 30), today)
    return {"start_date": f"{fy - 1}-10-01", "end_date": end.isoformat()}


def fiscal_years(today: dt.date | None = None) -> list[int]:
    return list(range(FIRST_FY, fiscal_year(today or dt.date.today()) + 1))


def all_period(today: dt.date | None = None) -> list[dict]:
    today = today or dt.date.today()
    return [{"start_date": f"{FIRST_FY - 1}-10-01", "end_date": today.isoformat()}]


def parent_idv(generated_id: str) -> str | None:
    """CONT_AWD_<piid>_<agency>_<parent piid>_<parent agency> → CONT_IDV_<parent piid>_<parent agency>."""
    m = re.match(r"CONT_AWD_[^_]+_[^_]+_([^_]+)_([^_]+)$", generated_id or "")
    if not m or m.group(1) == "-NONE-":
        return None
    return f"CONT_IDV_{m.group(1)}_{m.group(2)}"


def fetch_company(ent: dict, today: dt.date | None = None) -> dict | None:
    ueis = [r["uei"] for r in ent["recipients"] if r.get("uei")]
    if not ueis:
        return None
    base = {"agencies": DOD, "recipient_search_text": ueis}
    out = {"company_id": ent["company_id"], "ueis": ueis, "fetched": dt.date.today().isoformat()}

    months = http.call("search/spending_over_time/",
                       {"group": "month", "filters": {**base, "time_period": all_period(today)}})
    out["months"] = [
        {"fy": int(r["time_period"]["fiscal_year"]), "month": int(r["time_period"]["month"]),
         "obligated": r["aggregated_amount"],
         "contracts": (r.get("Contract_Obligations") or 0) + (r.get("Idv_Obligations") or 0),
         "other": (r.get("Grant_Obligations") or 0) + (r.get("Other_Obligations") or 0) + (r.get("Direct_Obligations") or 0)}
        for r in months.get("results", []) if r.get("aggregated_amount")]

    out["psc"] = []
    for fy in fiscal_years(today):
        d = http.call("search/spending_by_category/psc/",
                      {"filters": {**base, "time_period": [fy_range(fy, today)]}, "limit": 100, "page": 1})
        out["psc"] += [{"fy": fy, "psc": r["code"], "name": r["name"], "obligated": r["amount"]}
                       for r in d.get("results", []) if r.get("amount")]

    d = http.call("search/spending_by_award/",
                  {"filters": {**base, "time_period": all_period(today), "award_type_codes": CONTRACTS},
                   "fields": AWARD_FIELDS, "sort": "Award Amount", "order": "desc", "limit": TOP_AWARDS, "page": 1})
    awards = []
    for r in d.get("results", []):
        awards.append({
            "award_id": r.get("generated_internal_id"), "piid": r.get("Award ID"),
            "recipient_name": r.get("Recipient Name"), "recipient_uei": r.get("Recipient UEI"),
            "obligated": r.get("Award Amount"), "description": r.get("Description"),
            "start_date": r.get("Start Date"), "end_date": r.get("End Date"),
            "sub_agency": r.get("Awarding Sub Agency"), "award_type": r.get("Contract Award Type"),
            "naics": (r.get("NAICS") or {}).get("code"), "psc": (r.get("PSC") or {}).get("code"),
            "psc_name": (r.get("PSC") or {}).get("description"), "parent_idv": parent_idv(r.get("generated_internal_id"))})
    out["awards"] = awards

    by_idv: dict = {}
    for a in awards:
        if a["parent_idv"]:
            by_idv[a["parent_idv"]] = by_idv.get(a["parent_idv"], 0) + (a["obligated"] or 0)
    vehicles = []
    for idv_id, _ in sorted(by_idv.items(), key=lambda kv: -kv[1])[:TOP_IDVS]:
        try:
            amounts = http.call(f"idvs/amounts/{idv_id}/")
            detail = http.call(f"awards/{idv_id}/")
        except RuntimeError:
            continue
        vehicles.append({
            "idv_id": idv_id, "piid": detail.get("piid"), "description": detail.get("description"),
            "type": detail.get("type_description"),
            "agency": ((detail.get("awarding_agency") or {}).get("subtier_agency") or {}).get("name"),
            "date_signed": detail.get("date_signed"),
            "last_date_to_order": (detail.get("period_of_performance") or {}).get("end_date"),
            "ceiling": detail.get("base_and_all_options_value"),
            "orders": amounts.get("child_award_count", 0) + amounts.get("grandchild_award_count", 0),
            "orders_obligated": (amounts.get("child_award_total_obligation") or 0) + (amounts.get("grandchild_award_total_obligation") or 0),
            "orders_potential": (amounts.get("child_award_base_and_all_options_value") or 0) + (amounts.get("grandchild_award_base_and_all_options_value") or 0)})
    out["vehicles"] = vehicles
    return out


def load_psc_rules(path: Path = PSC_RULES_PATH) -> list[dict]:
    return yaml.safe_load(path.read_text())["rules"]


def expand_codes(codes: list[str], known: set[str]) -> list[str]:
    out = []
    for c in codes:
        out += sorted(k for k in known if k.startswith(c[:-1])) if c.endswith("*") else [c]
    return out


def fetch_universe(rules: list[dict], known_pscs: set[str], today: dt.date | None = None) -> list[dict]:
    rows = []
    for rule in [r for r in rules if r.get("universe")]:
        codes = expand_codes(rule["codes"], known_pscs)
        if not codes:
            continue
        for fy in fiscal_years(today):
            d = http.call("search/spending_by_category/recipient/",
                          {"filters": {"agencies": DOD, "time_period": [fy_range(fy, today)], "psc_codes": codes},
                           "limit": 25, "page": 1})
            for rank, r in enumerate(d.get("results", []), start=1):
                rows.append({"rule": rule["id"], "fy": fy, "rank": rank, "recipient": r.get("name"),
                             "uei": r.get("uei"), "obligated": r.get("amount")})
    return rows


def fetch_all(workers: int = 6, only: set | None = None) -> dict:
    ents = [e for e in entities.read() if e["recipients"] and (not only or e["company_id"] in only)]
    COMPANY_DIR.mkdir(parents=True, exist_ok=True)
    stats = {"companies": 0, "failed": []}

    def one(e):
        try:
            data = fetch_company(e)
        except RuntimeError as err:
            return e["company_id"], str(err)
        if data:
            with gzip.open(COMPANY_DIR / f"{e['company_id']}.json.gz", "wt") as f:
                json.dump(data, f, separators=(",", ":"))
        return e["company_id"], None

    with ThreadPoolExecutor(workers) as ex:
        for cid, err in ex.map(one, ents):
            if err:
                stats["failed"].append((cid, err[:200]))
            else:
                stats["companies"] += 1
    if not only:
        known = {r["psc"] for p in COMPANY_DIR.glob("*.json.gz") for r in read_company(p)["psc"]}
        rules = load_psc_rules()
        # IT codes are 4-character alphanumerics; make sure every explicit code is queryable.
        for r in rules:
            known |= {c for c in r["codes"] if not c.endswith("*")}
        rows = fetch_universe(rules, known)
        UNIVERSE_PATH.write_text(json.dumps({"fetched": dt.date.today().isoformat(), "rows": rows}, separators=(",", ":")))
        stats["universe_rows"] = len(rows)
    return stats


def read_company(path: Path) -> dict:
    with gzip.open(path, "rt") as f:
        return json.load(f)


def read_companies(directory: Path = COMPANY_DIR) -> list[dict]:
    return [read_company(p) for p in sorted(directory.glob("*.json.gz"))]


def read_universe(path: Path = UNIVERSE_PATH) -> list[dict]:
    return json.loads(path.read_text())["rows"] if path.exists() else []
