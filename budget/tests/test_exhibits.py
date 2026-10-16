import pytest

from budget.etl import budget_exhibits as bx
from budget.etl import sample
from budget.etl.common import BuildError


def by_code(book):
    return {pl.pe_bli: pl for pl in book.lines.values()}


@pytest.mark.parametrize("book_fy", [2021, 2025, 2027])
@pytest.mark.parametrize("ex", ["r1", "p1", "o1", "m1"])
def test_each_format_era_parses_to_generated_values(tmp_path, ex, book_fy):
    path = tmp_path / f"FY{book_fy}_{ex}.xlsx"
    sample.write_book(ex, book_fy, path)
    book = bx.parse_workbook(path, ex, book_fy)
    lines = by_code(book)
    expected = [ln for ln in sample.LINES if ln[0] == ex and ln[7] <= book_fy and ln[8] >= book_fy - 2]
    assert set(lines) == {ln[3] for ln in expected}
    for ln in expected:
        pl = lines[ln[3]]
        assert pl.title == ln[4]
        assert pl.values[(book_fy, "request")] == sample.true_value(ln, book_fy, "request")
        assert pl.values[(book_fy - 1, "enacted")] == sample.true_value(ln, book_fy - 1, "enacted")
        assert pl.values[(book_fy - 2, "actual")] == sample.true_value(ln, book_fy - 2, "actual")
    checks = bx.check_book(book, [])
    assert checks and all(c[6] for c in checks)


def test_old_book_has_title_rows_and_base_oco(tmp_path):
    path = tmp_path / "FY2021_r1.xlsx"
    sample.write_book("r1", 2021, path)
    book = bx.parse_workbook(path, "r1", 2021)
    pl = by_code(book)["9960501N"]
    assert pl.account == "1319N" and pl.component == "Navy" and pl.appropriation == "RDT&E"
    assert pl.line_id == "r1:1319N:9960501N"
    assert pl.ref.startswith("Exhibit R-1!")


def test_reconciliation_column_is_separate_from_request(tmp_path):
    path = tmp_path / "FY2026_r1.xlsx"
    sample.write_book("r1", 2026, path)
    pl = by_code(bx.parse_workbook(path, "r1", 2026))["9960705SF"]
    line = next(ln for ln in sample.LINES if ln[3] == "9960705SF")
    assert pl.values[(2026, "request")] == sample.true_value(line, 2026, "request")
    assert pl.values[(2026, "reconciliation")] == sample.true_value(line, 2026, "recon") > 0


def test_supplemental_not_double_counted_in_enacted(tmp_path):
    path = tmp_path / "FY2025_p1.xlsx"
    sample.write_book("p1", 2025, path)
    pl = by_code(bx.parse_workbook(path, "p1", 2025))["9920002N"]
    line = next(ln for ln in sample.LINES if ln[3] == "9920002N")
    assert pl.values[(2024, "enacted")] == sample.true_value(line, 2024, "enacted")
    assert pl.values[(2024, "supplemental")] == sample.supplemental(line, 2024) > 0


def test_component_and_account_totals(tmp_path):
    path = tmp_path / "FY2027_p1.xlsx"
    sample.write_book("p1", 2027, path)
    book = bx.parse_workbook(path, "p1", 2027)
    assert {pl.component for pl in book.lines.values()} == {"Army", "Navy", "Air Force", "Space Force", "Defense-Wide"}
    accounts = {t[0] for t in book.printed_totals}
    assert "*" in accounts and "1611N" in accounts


def test_mismatched_printed_total_fails_build(tmp_path, db):
    raw = tmp_path / "raw" / "FY2027"
    sample.write_book("r1", 2027, raw / "FY2027_r1.xlsx", tamper_total=True)
    with pytest.raises(BuildError, match="do not reconcile"):
        bx.load(db, tmp_path / "raw", toplines=[])
    stats = bx.load(db, tmp_path / "raw", toplines=[], allow_mismatch=True)
    assert len(stats["mismatches"]) == 1


def test_toplines_csv_rows_are_checked(tmp_path, db):
    raw = tmp_path / "raw" / "FY2027"
    sample.write_book("o1", 2027, raw / "FY2027_o1.xlsx")
    wrong = [{"book_fy": "2027", "exhibit": "o1", "account": "2020A", "fy": "2027", "value_type": "request",
              "amount_k": "1", "source": "test"}]
    with pytest.raises(BuildError):
        bx.load(db, tmp_path / "raw", toplines=wrong)


@pytest.mark.parametrize("name, ex, fy", [
    ("FY2026_r1.xlsx", "r1", 2026), ("fy2025_p1.xlsx", "p1", 2025), ("FY2024 O-1.xlsx", "o1", 2024),
    ("m1.xlsx", "m1", None), ("FY2026_c1.xlsx", None, 2026), ("rdte_r10.xlsx", None, None),
])
def test_file_detection(tmp_path, name, ex, fy):
    from pathlib import Path
    p = Path("raw") / "misc" / name
    assert bx.detect_exhibit(p.stem) == ex
    assert bx.detect_book_fy(p) == fy


def test_missing_header_is_an_error(tmp_path):
    import openpyxl
    wb = openpyxl.Workbook()
    wb.active.append(["nothing", "useful"])
    p = tmp_path / "FY2026_r1.xlsx"
    wb.save(p)
    with pytest.raises(BuildError, match="header"):
        bx.parse_workbook(p, "r1", 2026)
