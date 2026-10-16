import pytest

from budget.etl.budget_exhibits import classify_header, resolve_amount_columns


@pytest.mark.parametrize("header, book, expected", [
    ("Account", 2026, ("id", "account")),
    ("Account Title", 2026, ("id", "account_title")),
    ("Organization", 2026, ("id", "organization")),
    ("Budget Activity", 2026, ("id", "budget_activity")),
    ("Budget Activity Title", 2026, ("id", "ba_title")),
    ("Line Number", 2026, ("id", "line_number")),
    ("Program Element/Budget Line Item (BLI) Number", 2026, ("id", "pe_bli")),
    ("Program Element/Budget Line Item (BLI) Title", 2026, ("id", "title")),
    ("Budget Line Item", 2026, ("id", "pe_bli")),
    ("Budget Line Item (BLI) Title", 2026, ("id", "title")),
    ("SAG", 2026, ("id", "pe_bli")),
    ("SAG Title", 2026, ("id", "title")),
    ("Classification", 2026, ("id", "classification")),
    ("FY 2024 Actuals", 2026, ("amount", 2024, "actual", None, True)),
    ("FY 2025\nEnacted", 2026, ("amount", 2025, "enacted", None, True)),
    ("FY 2026 Disc Request", 2026, ("amount", 2026, "request", "disc", True)),
    ("FY 2026 Reconciliation Request", 2026, ("amount", 2026, "reconciliation", None, True)),
    ("FY 2026 Total Request", 2026, ("amount", 2026, "request", "total", True)),
    ("FY 2021 OCO Request", 2021, ("amount", 2021, "request", "oco", True)),
    ("FY 2021 Base Request", 2021, ("amount", 2021, "request", "base", True)),
    ("FY 2024\nSupplemental", 2025, ("amount", 2024, "supplemental", None, True)),
    ("FY 2024 Annualized CR", 2024, ("amount", 2024, "cr", None, True)),
    ("FY 2024\nTotal", 2025, ("amount", 2024, "enacted", "total", False)),
    ("FY 2028", 2027, ("amount", 2028, "fydp", None, False)),
    ("FY 2025\nRequest\nQuantity", 2025, None),
    ("FY25 Request", 2025, ("amount", 2025, "request", None, True)),
    ("", 2025, None),
    ("Notes", 2025, None),
])
def test_classify_header(header, book, expected):
    assert classify_header(header, book) == expected


def test_disc_wins_over_total_and_recon_is_separate():
    cols = [(10, 2026, "request", "disc", True), (11, 2026, "reconciliation", None, True),
            (12, 2026, "request", "total", True)]
    assert resolve_amount_columns(cols) == {(2026, "request"): [10], (2026, "reconciliation"): [11]}


def test_total_preferred_over_base_and_oco():
    cols = [(5, 2021, "request", "base", True), (6, 2021, "request", "oco", True), (7, 2021, "request", "total", True)]
    assert resolve_amount_columns(cols) == {(2021, "request"): [7]}


def test_base_and_oco_summed_without_total():
    cols = [(5, 2021, "request", "base", True), (6, 2021, "request", "oco", True)]
    assert resolve_amount_columns(cols) == {(2021, "request"): [5, 6]}


def test_bare_total_ignored_next_to_enacted_and_supplemental():
    cols = [(4, 2024, "enacted", None, True), (5, 2024, "supplemental", None, True), (6, 2024, "enacted", "total", False)]
    assert resolve_amount_columns(cols) == {(2024, "enacted"): [4], (2024, "supplemental"): [5]}
