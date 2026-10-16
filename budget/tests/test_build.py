import sqlite3

from budget.etl.__main__ import build
from budget.etl import sample


def test_end_to_end_sample_build(tmp_path, sample_raw):
    db = tmp_path / "b.sqlite"
    out = tmp_path / "data.js"
    stats = build(db, sample_raw, is_sample=True, mandatory_rows=sample.SAMPLE_MANDATORY, toplines=[],
                  dashboard_data=out)
    assert stats["exhibits"]["files"] == 28 and not stats["exhibits"]["mismatches"]
    con = sqlite3.connect(db)
    meta = dict(con.execute("SELECT key, value FROM meta"))
    assert meta["sample"] == "1" and meta["books"] == "2021,2022,2023,2024,2025,2026,2027"
    # The newest book wins: FY2025 enacted is printed in the FY2026 and FY2027 books (as actual in 2027).
    rows = con.execute("SELECT source_doc FROM v_values_latest WHERE line_id='r1:3600F:9960601F' "
                       "AND fy=2025 AND value_type='enacted'").fetchall()
    assert rows == [("FY2026 R-1",)]
    # Lines dropped from later books keep their history (ARRW ends FY2024).
    assert con.execute("SELECT last_book FROM budget_lines WHERE line_id='r1:3600F:9960604F'").fetchone() == (2026,)
    # Sector values: weights split amounts without losing any.
    total, split = con.execute(
        "SELECT (SELECT SUM(amount_k) FROM v_values_latest v JOIN line_status s USING(line_id) "
        "        WHERE s.status='mapped' AND fy=2027 AND value_type='request'),"
        "       (SELECT SUM(amount_k) FROM v_sector_values WHERE fy=2027 AND value_type='request')").fetchone()
    assert abs(total - split) < 1e-6
    assert out.read_text().startswith("/* Generated")
