import re

import pytest

from budget.etl import awards, entities, sample, usaspending
from budget.etl.award_sectors import Assigner


def test_normalize_and_default_pattern():
    assert entities.normalize("Rocket Lab USA, Inc.") == "ROCKET LAB USA INC"
    assert entities.normalize("Kratos Defense & Security") == "KRATOS DEFENSE AND SECURITY"
    rx = re.compile(entities.default_pattern("Firefly Aerospace"))
    assert rx.search("FIREFLY AEROSPACE INC") and not rx.search("FIREFLY COMPUTERS LLC")
    rx = re.compile(entities.default_pattern("Ondas Holdings"))  # trailing "Holdings" is dropped
    assert rx.search("ONDAS NETWORKS INC")
    assert not re.compile(entities.default_pattern("Apex")).search("APEXTRA LLC")


def fake_search(results):
    def search(keyword, limit=100):
        return results
    return search


def test_resolve_company_matches_patterns_and_skips_parents(monkeypatch):
    recs = [{"name": "SIKORSKY AIRCRAFT CORPORATION", "uei": "U1", "recipient_level": "C", "id": "a-C", "amount": 5},
            {"name": "LOCKHEED MARTIN CORPORATION", "uei": "U2", "recipient_level": "P", "id": "b-P", "amount": 9},
            {"name": "LOCKHEED ELECTRIC SUPPLY", "uei": "U3", "recipient_level": "C", "id": "c-C", "amount": 1}]
    monkeypatch.setattr(entities, "search_recipients", fake_search(recs))
    monkeypatch.setattr(entities, "children", lambda u: pytest.fail("children must not be fetched by default"))
    cfg = {"lockheed-martin": {"match": [r"^LOCKHEED MARTIN\b", r"^SIKORSKY\b"]}}
    out = entities.resolve_company({"id": "lockheed-martin", "name": "Lockheed Martin"}, cfg)
    assert [r["uei"] for r in out["recipients"]] == ["U2", "U1"]


def test_skip_and_overrides(monkeypatch):
    monkeypatch.setattr(entities, "search_recipients", fake_search([{"name": "HELSING JUNCTION FARMS", "uei": "X", "id": "x"}]))
    assert entities.resolve_company({"id": "helsing", "name": "Helsing"}, {"helsing": {"skip": True}})["recipients"] == []
    out = entities.resolve_company({"id": "x", "name": "Helsing"}, {"x": {"exclude_ueis": ["X"], "include_ueis": ["Y"]}})
    assert [(r["uei"], r["method"]) for r in out["recipients"]] == [("Y", "curated")]


def test_conflicts_name_beats_parent_and_ties_drop():
    a = {"company_id": "a", "recipients": [{"uei": "U1", "name": "S", "method": "name"}, {"uei": "U2", "name": "T", "method": "parent"}]}
    b = {"company_id": "b", "recipients": [{"uei": "U1", "name": "S", "method": "parent"}, {"uei": "U2", "name": "T", "method": "parent"}]}
    entities.resolve_conflicts([a, b])
    assert [r["uei"] for r in a["recipients"]] == ["U1"]
    assert b["recipients"] == [] and {c["uei"] for c in b["conflicts"]} == {"U1", "U2"}


def test_parent_idv_from_award_id():
    assert usaspending.parent_idv("CONT_AWD_H9240224F0057_9700_H9240222D0001_9700") == "CONT_IDV_H9240222D0001_9700"
    assert usaspending.parent_idv("CONT_AWD_W91CRB20C0001_9700_-NONE-_-NONE-") is None


@pytest.fixture
def assigner():
    seg_of = {"uas.small": "uas", "uas.cca": "uas", "missiles.strike": "missiles", "space.buses": "space",
              "primes.us": "primes", "software.c2": "software", "software.intel": "software", "space.launch": "space"}
    subs = {"startup": ["uas.small", "software.c2"], "prime": ["primes.us"], "space-co": ["space.buses"]}
    return Assigner(seg_of, subs)


def test_psc_assignment(assigner):
    assert assigner.assign("prime", "1840")[:2] == ({"space.launch": 1.0}, "psc")          # specific code wins
    assert assigner.assign("startup", "7A21")[:2] == ({"software.c2": 1.0}, "psc+company")  # segment code → company sub
    w, method, _ = assigner.assign("startup", "5340")                                         # unmapped → company subs
    assert method == "company" and w == {"uas.small": 0.5, "software.c2": 0.5}
    assert assigner.assign("prime", "R425")[:2] == ({"primes.us": 1.0}, "company")          # primes stay primes
    assert assigner.assign("space-co", "AC21")[:2] == ({"space.buses": 1.0}, "psc+company")


def test_awards_load_sample(db):
    stats = awards.load(db, **sample.sample_awards())
    assert stats["companies_with_awards"] == 3 and stats["awards"] == 36 and stats["vehicles"] == 3
    total = db.execute("SELECT SUM(obligated) FROM company_psc_fy WHERE company_id='anduril'").fetchone()[0]
    split = db.execute("SELECT SUM(obligated) FROM company_sector_fy WHERE company_id='anduril'").fetchone()[0]
    assert abs(total - split) < 1e-3  # sector split keeps every dollar
    assert db.execute("SELECT company_id FROM sector_recipients_fy WHERE uei='SAMPLEUEI0001' LIMIT 1").fetchone() == ("anduril",)
