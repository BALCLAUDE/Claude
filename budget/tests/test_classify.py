from pathlib import Path

import pytest
import yaml

from budget.etl import classify, reconciliation
from budget.etl.common import BuildError

GOLDEN = yaml.safe_load((Path(__file__).parent / "golden" / "rules.yaml").read_text())


@pytest.fixture(scope="module")
def rules(tax):
    subs = {s["id"] for seg in tax["segments"] for s in seg["subsegments"]}
    return classify.load_rules(subsegments=subs, programs={p["id"] for p in tax["programs"]})


@pytest.mark.parametrize("case", GOLDEN, ids=[c["title"] for c in GOLDEN])
def test_golden(rules, case):
    line = {"title": case["title"], "exhibit": case.get("exhibit", "r1"),
            "component": case.get("component", "Defense-Wide"), "pe_bli": case.get("pe", "")}
    rule = rules.match(line)
    if case["expect"] is None:
        assert rule is None, f"matched {rule.id}"
    elif case["expect"] == "not_tech":
        assert rule is not None and rule.not_tech
    else:
        assert rule is not None, "no rule matched"
        assert rule.subsegments == pytest.approx(case["expect"]), rule.id


def test_rule_validation(tmp_path):
    bad = tmp_path / "r.yaml"
    bad.write_text("rules:\n  - id: x\n    title: foo\n    subsegments: {space.launch: 0.5}\n")
    with pytest.raises(BuildError, match="sum to 1"):
        classify.load_rules(bad)
    bad.write_text("rules:\n  - id: x\n    subsegments: {space.launch: 1}\n")
    with pytest.raises(BuildError, match="matches everything"):
        classify.load_rules(bad)
    bad.write_text("rules:\n  - id: x\n    title: foo\n    subsegments: {nope.nope: 1}\n")
    with pytest.raises(BuildError, match="unknown subsegments"):
        classify.load_rules(bad, subsegments={"space.launch"})


def test_pe_glob_rule(tmp_path):
    p = tmp_path / "r.yaml"
    p.write_text("rules:\n  - id: pe\n    pe: ['0604*SF']\n    subsegments: {space.launch: 1}\n")
    rs = classify.load_rules(p)
    assert rs.match({"title": "x", "pe_bli": "0604853SF"}).confidence == 1.0
    assert rs.match({"title": "x", "pe_bli": "0604853F"}) is None


def add_line(db, line_id, title, amount_k, exhibit="r1"):
    db.execute("INSERT INTO budget_lines (line_id, exhibit, appropriation, title) VALUES (?,?,?,?)",
               (line_id, exhibit, "RDT&E", title))
    db.execute("INSERT OR IGNORE INTO source_docs (source_doc, book_fy) VALUES ('FY2027 R-1', 2027)")
    db.execute("INSERT INTO budget_values (line_id, fy, value_type, amount_k, source_doc, book_fy) VALUES (?,?,?,?,?,?)",
               (line_id, 2027, "request", amount_k, "FY2027 R-1", 2027))


def test_overrides_win_and_queue(db):
    add_line(db, "r1:X:1", "Collaborative Combat Aircraft", 2_000_000)
    add_line(db, "r1:X:2", "Something Opaque", 500_000)
    add_line(db, "r1:X:3", "Something Small", 5_000)
    add_line(db, "r1:X:4", "Tactical UAS", 50_000)
    overrides = {"r1:X:2": [("uas.cca", 0.5, "analyst call", "jd"), ("software.c2", 0.5, "analyst call", "jd")],
                 "r1:GONE:9": [("not_tech", 1, "", "jd")]}
    stats = classify.classify(db, overrides=overrides)
    assert stats["override"] == 1 and stats["stale_overrides"] == ["r1:GONE:9"]
    m = dict(db.execute("SELECT subsegment_id, method FROM line_sector_map WHERE line_id='r1:X:2'"))
    assert m == {"uas.cca": "human", "software.c2": "human"}
    status = dict(db.execute("SELECT line_id, status FROM line_status"))
    assert status == {"r1:X:1": "mapped", "r1:X:2": "mapped", "r1:X:3": "unclassified", "r1:X:4": "mapped"}
    queue = {r[0]: r[1] for r in db.execute("SELECT item_id, reason FROM review_queue")}
    # $2B mapped by a rule → queued for a look; small unclassified line → not queued; overrides never queued.
    assert set(queue) == {"r1:X:1"} and "large line" in queue["r1:X:1"]
    assert db.execute("SELECT program_id FROM line_program WHERE line_id='r1:X:1'").fetchone() == ("cca",)


def test_mandatory_funding_rows(db):
    base = {c: "" for c in reconciliation.COLUMNS}
    rows = [dict(base, id="a", law="Act", title="Shipyards", kind="reconciliation", fy="2025",
                 subsegments="maritime.shipbuilding", amount_k="100", counted_in_exhibits="0", source_page="p. 1"),
            dict(base, id="b", law="Act", title="Already in R-1", kind="reconciliation", fy="2026",
                 amount_k="50", counted_in_exhibits="yes", source_url="https://example.gov")]
    stats = reconciliation.load(db, rows)
    assert stats == {"rows": 2, "lines_added": 1}
    assert db.execute("SELECT SUM(amount_k) FROM budget_values").fetchone() == (100,)
    assert db.execute("SELECT COUNT(*) FROM mandatory_funding").fetchone() == (2,)
    classify.classify(db, overrides={})
    assert db.execute("SELECT method FROM line_status WHERE line_id='recon:a'").fetchone() == ("human",)
    with pytest.raises(BuildError, match="source"):
        reconciliation.load(db, [dict(base, id="c", law="Act", title="t", kind="supplemental", fy="2024", amount_k="1")])
