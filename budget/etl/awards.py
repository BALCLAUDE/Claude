"""Loads entities.json and the per-company award files into the database and assigns sectors."""
from __future__ import annotations

import sqlite3

from . import entities, usaspending
from .award_sectors import Assigner


def load(con: sqlite3.Connection, ents: list | None = None, companies: list | None = None,
         universe: list | None = None) -> dict:
    """Loads from budget/raw/usaspending/ unless data is passed in (the sample build does)."""
    ents = entities.read() if ents is None else ents
    companies = usaspending.read_companies() if companies is None else companies
    universe = usaspending.read_universe() if universe is None else universe
    stats = {"companies_resolved": 0, "recipients": 0, "companies_with_awards": 0, "awards": 0, "vehicles": 0,
             "universe_rows": 0}
    company_ids = {r[0] for r in con.execute("SELECT id FROM companies")}
    for e in ents:
        if e["company_id"] not in company_ids:
            continue
        if e["recipients"]:
            stats["companies_resolved"] += 1
        for r in e["recipients"]:
            con.execute("""INSERT INTO entity_aliases (uei, name, company_id, level, method, evidence, amount_all_agencies, note)
                           VALUES (?,?,?,?,?,?,?,?)""",
                        (r["uei"], r.get("name") or r["uei"], e["company_id"], r.get("level"), r.get("method"),
                         r.get("evidence"), r.get("amount_all_agencies"), e.get("note")))
            stats["recipients"] += 1

    seg_of = dict(con.execute("SELECT id, segment_id FROM subsegments"))
    company_subs: dict = {}
    for cid, sid in con.execute("SELECT cs.company_id, cs.subsegment_id FROM company_subsegments cs "
                                "JOIN subsegments s ON s.id = cs.subsegment_id ORDER BY s.sort"):
        company_subs.setdefault(cid, []).append(sid)
    assigner = Assigner(seg_of, company_subs)

    for d in companies:
        cid = d["company_id"]
        if cid not in company_ids:
            continue
        stats["companies_with_awards"] += 1
        con.executemany("INSERT OR REPLACE INTO company_obligations_month VALUES (?,?,?,?,?,?)",
                        [(cid, m["fy"], m["month"], m["obligated"], m.get("contracts"), m.get("other")) for m in d["months"]])
        con.executemany("INSERT OR REPLACE INTO company_psc_fy VALUES (?,?,?,?,?)",
                        [(cid, p["fy"], p["psc"], p["name"], p["obligated"]) for p in d["psc"]])
        sector: dict = {}
        for p in d["psc"]:
            weights, method, _ = assigner.assign(cid, p["psc"])
            for sid, w in weights.items():
                key = (p["fy"], sid, method)
                sector[key] = sector.get(key, 0.0) + p["obligated"] * w
        con.executemany("INSERT INTO company_sector_fy VALUES (?,?,?,?,?)",
                        [(cid, fy, sid, amt, method) for (fy, sid, method), amt in sector.items()])
        for a in d["awards"]:
            weights, method, rule_id = assigner.assign(cid, a["psc"])
            con.execute(
                """INSERT OR IGNORE INTO awards (award_id, piid, parent_idv, award_type, agency, sub_agency, recipient_name,
                     recipient_uei, company_id, psc, psc_name, naics, start_date, end_date, obligated, description,
                     source, sector_method)
                   VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                (a["award_id"], a["piid"], a["parent_idv"], a["award_type"], "Department of Defense", a["sub_agency"],
                 a["recipient_name"], a["recipient_uei"], cid, a["psc"], a.get("psc_name"), a["naics"],
                 a["start_date"], a["end_date"], a["obligated"], a["description"], "usaspending", method))
            con.executemany("INSERT OR IGNORE INTO award_sector_map (award_id, subsegment_id, weight, method, rationale)"
                            " VALUES (?,?,?,?,?)",
                            [(a["award_id"], sid, w, method, f"psc rule {rule_id}" if rule_id else "company subsegments")
                             for sid, w in weights.items()])
            stats["awards"] += 1
        for v in d.get("vehicles", []):
            con.execute("INSERT OR IGNORE INTO idv_vehicles VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
                        (v["idv_id"], cid, v["piid"], v["description"], v["type"], v["agency"], v["date_signed"],
                         v["last_date_to_order"], v["ceiling"], v["orders"], v["orders_obligated"], v["orders_potential"]))
            stats["vehicles"] += 1

    uei_company = dict(con.execute("SELECT uei, company_id FROM entity_aliases WHERE uei IS NOT NULL"))
    universe_sub = {r.id: next(iter(r.universe_subsegments), None) for r in assigner.rules if r.universe}
    for row in universe:
        con.execute("INSERT OR REPLACE INTO sector_recipients_fy VALUES (?,?,?,?,?,?,?,?)",
                    (row["rule"], universe_sub.get(row["rule"]), row["fy"], row["rank"], row["recipient"], row["uei"],
                     uei_company.get(row["uei"]), row["obligated"]))
        stats["universe_rows"] += 1
    return stats
