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
    assert pl.values[(2026, "reconciliation_request")] == sample.true_value(line, 2026, "recon") > 0


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
    ("m1.xlsx", "m1", None), ("FY2026_c1.xlsx", "c1", 2026), ("rdte_r10.xlsx", None, None),
    ("r1_display.xlsx", "r1", None), ("p1r.xlsx", None, None), ("p1r_display.xlsx", None, None),
    ("o1_ooc.xlsx", None, None), ("rf1.xlsx", "rf1", None), ("c1_display.xlsx", "c1", None),
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


def test_file_detection_year_folder():
    from pathlib import Path
    assert bx.detect_book_fy(Path("raw/Budget Materials/2026/r1_display.xlsx")) == 2026


def test_discover_prefers_plain_file_and_skips_other_exhibits(tmp_path):
    for name in ("r1.xlsx", "r1_display.xlsx", "p1r.xlsx", "o1_ooc.xlsx", "c1.xlsx", "m1_display.xlsx"):
        (tmp_path / "2025").mkdir(exist_ok=True)
        (tmp_path / "2025" / name).write_bytes(b"")
    found = {(ex, fy): p.name for p, ex, fy in bx.discover(tmp_path)}
    assert found == {("r1", 2025): "r1.xlsx", ("m1", 2025): "m1_display.xlsx", ("c1", 2025): "c1.xlsx"}


def test_memo_rows_and_total_above_header(tmp_path):
    import openpyxl
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.append([None, None, None, None, None, None, None, None, "Total of Displayed Rows", 600, 60])
    ws.append(["Account", "Account Title", "Organization", "Budget Activity", "Budget Activity Title", "Line Number",
               "Budget Line Item", "Budget Line Item (BLI) Title", "Add/Non-Add", "FY 2027 Request Amount", "FY 2027 Request Quantity"])
    ws.append(["2035A", "Other Procurement, Army", "A", "01", "Tactical", 1, "B00001", "Radio Systems", "Add", 300, 10])
    ws.append(["2035A", "Other Procurement, Army", "A", "01", "Tactical", 1, "B00001", "Radio Systems", "Add", 200, 20])
    ws.append(["2035A", "Other Procurement, Army", "A", "01", "Tactical", 2, "B00002", "Advance Procurement memo", "Non-Add", 100, 30])
    p = tmp_path / "p1.xlsx"
    wb.save(p)
    book = bx.parse_workbook(p, "p1", 2027)
    assert book.lines["p1:2035A:B00001"].values == {(2027, "request"): 500}
    memo = book.lines["p1:2035A:B00002:memo"]
    assert memo.counted is False
    assert all(c[6] for c in bx.check_book(book, []))   # 600 printed = 500 + 100 parsed


def test_c1_rolls_projects_up_by_sheet(tmp_path):
    import openpyxl
    wb = openpyxl.Workbook()
    hdr = ["Account", "Account Title", "Budget Activity", "Budget Activity Title", "Organization", "Fiscal Year",
           "Construction Project", "Construction Project Title", "Appropriation Amount", "Total Obligation Authority"]
    sheets = {"FY 2021": [("2050A", "Military Construction, Army", "01", "MAJOR CONSTRUCTION", 100), ("2050A", "Military Construction, Army", "01", "MAJOR CONSTRUCTION", 50)],
              "FY 2021 OCO": [("2050A", "Military Construction, Army", "01", "MAJOR CONSTRUCTION", 7)],
              "FY 2020 Emergency": [("1205N", "Military Construction, Navy", "01", "MAJOR CONSTRUCTION", 9)],
              "FY 2021 (OOC)": [("2050A", "Military Construction, Army", "01", "MAJOR CONSTRUCTION", 999)],
              "FY2021 Mandatory Reconciliation": [("2050A", "Military Construction, Army", "01", "MAJOR CONSTRUCTION", 3)]}
    wb.remove(wb.active)
    for name, rows in sheets.items():
        ws = wb.create_sheet(name)
        ws.append([None, None, None, None, None, None, None, "Total of Displayed Rows", None, sum(r[4] for r in rows)])
        ws.append(hdr)
        for a, t, ba, bat, amt in rows:
            ws.append([a, t, ba, bat, "A", 2021, "P1", "Barracks", amt, amt])
    p = tmp_path / "c1.xlsx"
    wb.save(p)
    book = bx.parse_workbook(p, "c1", 2021)
    army = book.lines["c1:2050A:01"]
    assert army.values == {(2021, "request"): 157, (2021, "reconciliation_request"): 3}
    assert army.component == "Army" and army.appropriation == "MilCon"
    assert book.lines["c1:1205N:01"].values == {(2020, "supplemental"): 9}
    assert all(c[6] for c in bx.check_book(book, []))
