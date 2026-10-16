"""Synthetic R-1 / P-1 / O-1 / M-1 workbooks for tests and the dashboard demo.

THESE ARE NOT REAL BUDGET FIGURES. Titles echo the kinds of lines found in the real books so the
rules have something to bite on, but program-element codes start with 99 and every amount is
generated. The three column layouts mimic the format eras the parser must handle:
  FY2021-22  base / OCO / total request columns, title rows above the header
  FY2023-25  multi-line headers, P-1 quantity columns, FY2024 supplemental column in the FY2025 book
  FY2026-27  discretionary + reconciliation + total request columns
Each book also prints account totals and a grand total so the reconciliation check runs.
"""
from __future__ import annotations

import random
from pathlib import Path

import openpyxl

ACCOUNTS = {
    "r1": [("2040A", "Research, Development, Test & Evaluation, Army", "Army"),
           ("1319N", "Research, Development, Test & Evaluation, Navy", "Navy"),
           ("3600F", "Research, Development, Test & Evaluation, Air Force", "Air Force"),
           ("1206F", "Research, Development, Test & Evaluation, Space Force", "Space Force"),
           ("0400D", "Research, Development, Test & Evaluation, Defense-Wide", "Defense-Wide")],
    "p1": [("2032A", "Missile Procurement, Army", "Army"),
           ("1507N", "Weapons Procurement, Navy", "Navy"),
           ("1611N", "Shipbuilding and Conversion, Navy", "Navy"),
           ("3020F", "Missile Procurement, Air Force", "Air Force"),
           ("1022F", "Procurement, Space Force", "Space Force"),
           ("0300D", "Procurement, Defense-Wide", "Defense-Wide")],
    "o1": [("2020A", "Operation and Maintenance, Army", "Army"),
           ("3400F", "Operation and Maintenance, Air Force", "Air Force")],
    "m1": [("2010A", "Military Personnel, Army", "Army")],
}

# exhibit, account, BA, code, title, FY2021 base ($K), annual growth, first FY, last FY, recon share
LINES = [
    ("r1", "2040A", "04", "9960301A", "Long Range Hypersonic Weapon", 800_000, 0.04, 2021, 2027, 0),
    ("r1", "2040A", "05", "9960402A", "Robotic Combat Vehicle", 120_000, 0.10, 2021, 2027, 0),
    ("r1", "2040A", "05", "9960403A", "Future Tactical Unmanned Aircraft System", 60_000, 0.12, 2023, 2027, 0),
    ("r1", "2040A", "04", "9960404A", "Directed Energy Prototyping", 250_000, -0.05, 2021, 2027, 0),
    ("r1", "2040A", "05", "9960405A", "Integrated Air and Missile Defense", 300_000, 0.03, 2021, 2027, 0),
    ("r1", "2040A", "05", "9960406A", "Next Generation Command and Control", 40_000, 0.45, 2024, 2027, 0),
    ("r1", "2040A", "06", "9960407A", "Army Test Ranges and Facilities", 400_000, 0.01, 2021, 2027, 0),
    ("r1", "1319N", "04", "9960501N", "Conventional Prompt Strike", 1_100_000, 0.02, 2021, 2027, 0),
    ("r1", "1319N", "04", "9960502N", "Large Unmanned Surface Vessel", 140_000, 0.08, 2021, 2027, 0),
    ("r1", "1319N", "04", "9960503N", "Extra Large Unmanned Undersea Vehicle", 90_000, 0.02, 2021, 2025, 0),
    ("r1", "1319N", "05", "9960504N", "Next Generation Jammer Mid-Band", 220_000, -0.06, 2021, 2027, 0),
    ("r1", "1319N", "05", "9960505N", "Medium Unmanned Surface Vessel", 30_000, 0.25, 2023, 2027, 0),
    ("r1", "3600F", "04", "9960601F", "Collaborative Combat Aircraft", 50_000, 0.70, 2023, 2027, 0),
    ("r1", "3600F", "05", "9960602F", "Advanced Battle Management System", 200_000, 0.10, 2021, 2027, 0),
    ("r1", "3600F", "04", "9960603F", "Hypersonic Attack Cruise Missile", 150_000, 0.20, 2022, 2027, 0),
    ("r1", "3600F", "05", "9960604F", "Air-Launched Rapid Response Weapon", 380_000, -0.30, 2021, 2024, 0),
    ("r1", "3600F", "07", "9960605F", "Family of Affordable Mass Missiles", 25_000, 0.80, 2025, 2027, 0),
    ("r1", "3600F", "06", "9960606F", "Major T&E Investment", 180_000, 0.02, 2021, 2027, 0),
    ("r1", "1206F", "05", "9960701SF", "Space Development Agency Tranche 2 Transport Layer", 500_000, 0.15, 2021, 2027, 0.1),
    ("r1", "1206F", "05", "9960702SF", "Resilient Missile Warning Missile Tracking", 900_000, 0.06, 2021, 2027, 0.1),
    ("r1", "1206F", "05", "9960703SF", "Space Domain Awareness Technology", 150_000, 0.07, 2021, 2027, 0),
    ("r1", "1206F", "05", "9960704SF", "GPS III Follow-On", 300_000, -0.03, 2021, 2027, 0),
    ("r1", "1206F", "05", "9960705SF", "Space Based Interceptor", 100_000, 0.90, 2026, 2027, 0.6),
    ("r1", "1206F", "07", "9960706SF", "Satellite Control Network", 80_000, 0.02, 2021, 2027, 0),
    ("r1", "0400D", "02", "9960801D8Z", "Chief Digital and Artificial Intelligence Office", 180_000, 0.18, 2022, 2027, 0),
    ("r1", "0400D", "03", "9960802D8Z", "Manufacturing Technology Program", 160_000, 0.03, 2021, 2027, 0),
    ("r1", "0400D", "04", "9960803C", "Ballistic Missile Defense Midcourse Segment", 950_000, 0.01, 2021, 2027, 0.2),
    ("r1", "0400D", "05", "9960804D8Z", "Replicator Initiative", 200_000, 0.10, 2024, 2027, 0),
    ("r1", "0400D", "07", "9960805D8Z", "Cyber Security Initiative", 90_000, 0.04, 2021, 2027, 0),
    ("r1", "0400D", "03", "9960806D8Z", "Quantum Science", 40_000, 0.12, 2021, 2027, 0),
    ("r1", "0400D", "06", "9960807D8Z", "Classified Programs", 3_000_000, 0.03, 2021, 2027, 0),
    ("p1", "2032A", "02", "9910001A", "Precision Strike Missile (PrSM)", 200_000, 0.25, 2021, 2027, 0.2),
    ("p1", "2032A", "02", "9910002A", "Lower Tier Air and Missile Defense Sensor", 150_000, 0.20, 2022, 2027, 0),
    ("p1", "2032A", "02", "9910003A", "Counter-Small Unmanned Aircraft Systems Interceptors", 30_000, 0.55, 2023, 2027, 0.2),
    ("p1", "2032A", "02", "9910004A", "Guided MLRS Rocket (GMLRS)", 900_000, 0.02, 2021, 2027, 0),
    ("p1", "1507N", "02", "9920001N", "Tomahawk", 400_000, 0.05, 2021, 2027, 0.1),
    ("p1", "1507N", "02", "9920002N", "Standard Missile", 700_000, 0.08, 2021, 2027, 0.15),
    ("p1", "1611N", "02", "9920101N", "Virginia Class Submarine", 4_200_000, 0.05, 2021, 2027, 0.1),
    ("p1", "1611N", "05", "9920102N", "Shipbuilding Industrial Base Investment", 100_000, 0.40, 2023, 2027, 0.3),
    ("p1", "3020F", "02", "9930001F", "Joint Air-to-Surface Standoff Missile", 600_000, 0.10, 2021, 2027, 0.1),
    ("p1", "3020F", "02", "9930002F", "Small Diameter Bomb II", 300_000, -0.04, 2021, 2027, 0),
    ("p1", "1022F", "01", "9940001F", "National Security Space Launch", 1_300_000, 0.03, 2021, 2027, 0),
    ("p1", "1022F", "01", "9940002F", "SDA Tranche Procurement", 300_000, 0.20, 2023, 2027, 0.1),
    ("p1", "0300D", "01", "9950001D", "Defense Production Act Purchases", 150_000, 0.20, 2021, 2027, 0.3),
    ("p1", "0300D", "01", "9950002D", "Major Equipment, Defense Information Systems Agency", 250_000, 0.02, 2021, 2027, 0),
    ("o1", "2020A", "01", "111", "Maneuver Units", 3_500_000, 0.03, 2021, 2027, 0),
    ("o1", "2020A", "01", "131", "Base Operations Support", 9_000_000, 0.02, 2021, 2027, 0),
    ("o1", "2020A", "04", "431", "Servicewide Communications", 1_800_000, 0.04, 2021, 2027, 0),
    ("o1", "3400F", "01", "011Z", "Cyberspace Activities", 900_000, 0.06, 2021, 2027, 0),
    ("o1", "3400F", "01", "011W", "Facilities Sustainment, Restoration & Modernization", 4_000_000, 0.01, 2021, 2027, 0),
    ("m1", "2010A", "01", "1A1A", "Basic Pay - Officers", 7_000_000, 0.04, 2021, 2027, 0),
    ("m1", "2010A", "02", "2A1A", "Basic Pay - Enlisted", 16_000_000, 0.04, 2021, 2027, 0),
]

BA_TITLES = {"01": "Basic Research / Operating Forces", "02": "Applied Research / Procurement",
             "03": "Advanced Technology Development", "04": "Advanced Component Development & Prototypes",
             "05": "System Development & Demonstration", "06": "RDT&E Management Support",
             "07": "Operational System Development"}

ID_HEADERS = {
    "r1": ["Account", "Account Title", "Organization", "Budget Activity", "Budget Activity Title",
           "Line Number", "Program Element/Budget Line Item (BLI) Number",
           "Program Element/Budget Line Item (BLI) Title", "Classification"],
    "p1": ["Account", "Account Title", "Organization", "Budget Activity", "Budget Activity Title",
           "Line Number", "Budget Line Item", "Budget Line Item (BLI) Title", "Classification"],
    "o1": ["Account", "Account Title", "Organization", "Budget Activity", "Budget Activity Title",
           "Line Number", "SAG", "SAG Title", "Classification"],
    "m1": ["Account", "Account Title", "Organization", "Budget Activity", "Budget Activity Title",
           "Line Number", "Budget Line Item", "Budget Line Item (BLI) Title", "Classification"],
}


def true_value(line, fy: int, kind: str) -> float:
    """Deterministic synthetic amount ($K). kind: request | enacted | actual | recon."""
    _, acct, _, code, _, base, growth, first, last, recon = line
    if fy < first or fy > last:
        return 0.0
    rng = random.Random(f"{code}:{fy}")
    req = base * (1 + growth) ** (fy - 2021) * rng.uniform(0.93, 1.07)
    if kind == "recon":
        return round(req * recon) if fy >= 2026 else 0.0
    if kind == "request":
        return round(req)
    enacted = req * rng.uniform(0.9, 1.12)
    if kind == "enacted":
        return round(enacted)
    return round(enacted * rng.uniform(0.94, 1.0))


def supplemental(line, fy: int) -> float:
    return round(true_value(line, fy, "enacted") * 0.15) if fy == 2024 and line[3] in ("9920002N", "9910001A") else 0.0


def book_columns(ex: str, book: int):
    """[(header, fy, kind, part)] in the era's layout. part splits base/OCO for old books."""
    a, e, r = book - 2, book - 1, book
    if book <= 2022:
        cols = [(f"FY {a} Actuals", a, "actual", None), (f"FY {e} Enacted", e, "enacted", None),
                (f"FY {r} Base Request", r, "request", "base"), (f"FY {r} OCO Request", r, "request", "oco"),
                (f"FY {r} Total Request", r, "request", "total")]
    elif book <= 2025:
        cols = [(f"FY {a}\nActuals", a, "actual", None), (f"FY {e}\nEnacted", e, "enacted", None)]
        if book == 2025:
            cols += [(f"FY {e}\nSupplemental", e, "supplemental", None),
                     (f"FY {e}\nTotal", e, "enacted+supp", None)]
        if ex == "p1":
            cols.append((f"FY {r}\nRequest\nQuantity", r, "qty", None))
        cols.append((f"FY {r}\nRequest", r, "request", None))
    else:
        cols = [(f"FY {a} Actuals", a, "actual", None), (f"FY {e} Enacted", e, "enacted", None),
                (f"FY {r} Disc Request", r, "request", None),
                (f"FY {r} Reconciliation Request", r, "recon", None),
                (f"FY {r} Total Request", r, "request+recon", None)]
    return cols


def cell_value(line, fy, kind, part):
    if kind == "qty":
        return random.Random(f"q{line[3]}{fy}").randint(0, 400)
    if kind == "enacted+supp":
        return true_value(line, fy, "enacted") + supplemental(line, fy)
    if kind == "supplemental":
        return supplemental(line, fy)
    if kind == "request+recon":
        return true_value(line, fy, "request") + true_value(line, fy, "recon")
    v = true_value(line, fy, kind)
    if part == "base":
        return round(v * 0.9)
    if part == "oco":
        return v - round(v * 0.9)
    return v


def write_book(ex: str, book: int, path: Path, tamper_total: bool = False) -> None:
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = f"Exhibit {ex.upper()[0]}-1"
    cols = book_columns(ex, book)
    if book <= 2022:  # title rows above the header, as in the older books
        ws.append(["Department of Defense"])
        ws.append([f"FY {book} President's Budget"])
        ws.append([f"Exhibit {ex.upper()[0]}-1 (SYNTHETIC SAMPLE - NOT REAL DATA)"])
        ws.append([])
    ws.append(ID_HEADERS[ex] + [c[0] for c in cols])
    grand = [0.0] * len(cols)
    n = 0
    for acct, acct_title, org in ACCOUNTS[ex]:
        lines = [ln for ln in LINES if ln[0] == ex and ln[1] == acct]
        # A line appears in a book if any of its three years is funded.
        lines = [ln for ln in lines if ln[7] <= book and ln[8] >= book - 2]
        if not lines:
            continue
        sub = [0.0] * len(cols)
        for ln in lines:
            n += 1
            amounts = [cell_value(ln, fy, kind, part) for _, fy, kind, part in cols]
            ws.append([acct, acct_title, org, ln[2], BA_TITLES.get(ln[2], ""), n, ln[3], ln[4], "U"] + amounts)
            for i, (_, _, kind, _) in enumerate(cols):
                if kind != "qty":
                    sub[i] += amounts[i]
        ws.append([None, None, None, None, None, None, None, f"Total {acct_title}", None]
                  + [None if c[2] == "qty" else s for c, s in zip(cols, sub)])
        grand = [g + s for g, s in zip(grand, sub)]
    if tamper_total:  # break the current-year request total
        grand[next(i for i, c in enumerate(cols) if c[1] == book and c[2] == "request")] += 5_000
    ws.append([None, None, None, None, None, None, None, "Grand Total", None]
              + [None if c[2] == "qty" else g for c, g in zip(cols, grand)])
    path.parent.mkdir(parents=True, exist_ok=True)
    wb.save(path)


def write_all(raw_dir: Path, books=range(2021, 2028), exhibits=("r1", "p1", "o1", "m1")) -> list[Path]:
    out = []
    for book in books:
        for ex in exhibits:
            p = raw_dir / f"FY{book}" / f"FY{book}_{ex}.xlsx"
            write_book(ex, book, p)
            out.append(p)
    return out


SAMPLE_MANDATORY = [
    {"id": "sample-recon-shipbuilding", "law": "Sample Reconciliation Act (synthetic)", "public_law": "",
     "section": "1", "title": "Shipbuilding industrial base (synthetic)", "kind": "reconciliation", "fy": "2025",
     "available_through": "2029", "component": "Navy", "appropriation": "Procurement", "program_id": "",
     "subsegments": "maritime.shipbuilding:1", "amount_k": "2500000", "counted_in_exhibits": "0",
     "source_url": "", "source_page": "synthetic sample row", "notes": "Synthetic demo row, not real data."},
    {"id": "sample-supp-munitions", "law": "Sample Security Supplemental (synthetic)", "public_law": "",
     "section": "2", "title": "Munitions replenishment (synthetic)", "kind": "supplemental", "fy": "2024",
     "available_through": "2026", "component": "Army", "appropriation": "Procurement", "program_id": "",
     "subsegments": "missiles.energetics:0.5;missiles.strike:0.5", "amount_k": "1800000",
     "counted_in_exhibits": "0", "source_url": "", "source_page": "synthetic sample row",
     "notes": "Synthetic demo row, not real data."},
]


def sample_awards() -> dict:
    """Synthetic USAspending-shaped data for three map companies (NOT REAL AWARDS)."""
    companies = [("anduril", "SAMPLEUEI0001", 40e6, 0.06, [("5340", "HARDWARE, COMMERCIAL", 0.5), ("1550", "DRONES", 0.3), ("R425", "ENGINEERING SUPPORT", 0.2)]),
                 ("shield-ai", "SAMPLEUEI0002", 8e6, 0.03, [("AC12", "AIRCRAFT R&D", 0.7), ("7A21", "SOFTWARE", 0.3)]),
                 ("lockheed-martin", "SAMPLEUEI0003", 3500e6, 0.005, [("1410", "GUIDED MISSILES", 0.4), ("1510", "AIRCRAFT", 0.4), ("1810", "SPACE VEHICLES", 0.2)])]
    ents, data = [], []
    for cid, uei, base, growth, pscs in companies:
        ents.append({"company_id": cid, "name": cid, "recipients": [{"uei": uei, "name": f"{cid.upper()} (SAMPLE)", "level": "C",
                     "method": "name", "evidence": "synthetic sample", "amount_all_agencies": base * 60}]})
        rng = random.Random(cid)
        months = []
        for fy in range(2021, 2027):
            for m in range(1, 13):
                k = (fy - 2021) * 12 + m
                months.append({"fy": fy, "month": m, "obligated": round(base * (1 + growth) ** k * rng.uniform(0.5, 1.5), 2),
                               "contracts": 0, "other": 0})
        psc = [{"fy": fy, "psc": code, "name": name, "obligated": sum(x["obligated"] for x in months if x["fy"] == fy) * share}
               for fy in range(2021, 2027) for code, name, share in pscs]
        awards = [{"award_id": f"CONT_AWD_SAMPLE{cid.upper()}{i}_9700_SAMPLEIDV{cid.upper()}_9700", "piid": f"SAMPLE{i:04d}",
                   "recipient_name": f"{cid.upper()} (SAMPLE)", "recipient_uei": uei, "obligated": base * rng.uniform(1, 12),
                   "description": f"SYNTHETIC SAMPLE AWARD {i} FOR {cid.upper()}", "start_date": f"{2021 + i % 5}-03-01",
                   "end_date": f"{2025 + i % 3}-09-30", "sub_agency": ["Department of the Army", "Department of the Navy", "Department of the Air Force"][i % 3],
                   "award_type": ["DELIVERY ORDER", "DEFINITIVE CONTRACT"][i % 2], "naics": "336411", "psc": pscs[i % len(pscs)][0],
                   "psc_name": pscs[i % len(pscs)][1], "parent_idv": f"CONT_IDV_SAMPLEIDV{cid.upper()}_9700" if i % 2 == 0 else None}
                  for i in range(12)]
        vehicles = [{"idv_id": f"CONT_IDV_SAMPLEIDV{cid.upper()}_9700", "piid": f"SAMPLEIDV{cid.upper()}", "description": "SYNTHETIC SAMPLE IDV",
                     "type": "IDIQ", "agency": "Department of the Army", "date_signed": "2022-01-01", "last_date_to_order": "2030-12-31",
                     "ceiling": base * 200, "orders": 6, "orders_obligated": base * 30, "orders_potential": base * 45}]
        data.append({"company_id": cid, "ueis": [uei], "months": months, "psc": psc, "awards": awards, "vehicles": vehicles})
    universe = [{"rule": "unmanned-aircraft", "fy": fy, "rank": r + 1, "recipient": n, "uei": u, "obligated": amt * (1.1 ** (fy - 2021))}
                for fy in range(2021, 2027)
                for r, (n, u, amt) in enumerate([("GENERAL ATOMICS (SAMPLE)", "SAMPLEUEI0009", 900e6), ("ANDURIL (SAMPLE)", "SAMPLEUEI0001", 120e6),
                                                 ("TEXTRON (SAMPLE)", "SAMPLEUEI0008", 80e6)])]
    return {"ents": ents, "companies": data, "universe": universe}
