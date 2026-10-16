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
    ("FY 2026 Reconciliation Request", 2026, ("amount", 2026, "reconciliation_request", None, True)),
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
    # Headers as printed in the FY2021-FY2027 comptroller workbooks.
    ("PE / BLI", 2021, ("id", "pe_bli")),
    ("SAG / BLI", 2021, ("id", "pe_bli")),
    ("SAG / Budget Line Item (BLI) Title", 2021, ("id", "title")),
    ("Budget|Sub|Activity".replace("|", "\n"), 2021, ("id", "pe_bli")),
    ("BSA", 2024, ("id", "pe_bli")),
    ("Budget SubActivity (BSA) Title", 2024, ("id", "title")),
    ("Add/\nNon-Add", 2021, ("id", "add_flag")),
    ("Include\nin\nTOA", 2021, ("id", "toa_flag")),
    ("FY 2019\n(Base + OCO)", 2021, ("amount", 2019, "actual", "total", False)),
    ("FY 2020\nBase Enacted", 2021, ("amount", 2020, "enacted", "base", True)),
    ("FY 2020\nEmergency", 2021, ("amount", 2020, "supplemental", None, True)),
    ("FY 2020\nTotal Enacted\n(Base+Emerg+\nOCO)", 2021, ("amount", 2020, "enacted", "total_incl", True)),
    ("FY 2021\nOCO for\nDirect War\nand Enduring\nCosts", 2021, ("amount", 2021, "request", "oco", False)),
    ("FY 2021\nTotal\nOCO", 2021, ("amount", 2021, "request", "oco_total", False)),
    ("FY 2021\nTotal\n(Base + OCO)", 2021, ("amount", 2021, "request", "total", False)),
    ("FY 2020\nActual*", 2022, ("amount", 2020, "actual", None, True)),
    ("FY 2022\nLess\nSupplementals\nEnactment", 2023, ("amount", 2022, "enacted", "excl", True)),
    ("FY 2022\nDivision N\nP.L. 117-103\nEnactment****", 2023, ("amount", 2022, "supplemental", "piece", True)),
    ("FY 2022\nTotal\nSupplemental\nEnactment", 2023, ("amount", 2022, "supplemental", "total", True)),
    ("FY 2022\nTotal\nEnactment", 2023, ("amount", 2022, "enacted", "total_incl", True)),
    ("FY 2023  Supplementals Enacted*", 2024, ("amount", 2023, "supplemental", None, True)),
    ("FY 2024 PB Request with CR Adjustments*", 2025, ("amount", 2024, "cr", None, True)),
    ("FY 2026 PL 119-21 Spend Plan", 2027, ("amount", 2026, "reconciliation", None, True)),
    ("FY 2026 Discretionary Enacted", 2027, ("amount", 2026, "enacted", "disc", True)),
    ("FY 2027 Mandatory Request", 2027, ("amount", 2027, "reconciliation_request", None, True)),
    ("FY 2027 Mandatory Quantity", 2027, None),
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


def test_fy2021_layout_uses_base_plus_oco_not_total_with_emergency():
    hdrs = ["FY 2020\nBase Enacted", "FY 2020\nEmergency", "FY 2020\nOCO Enacted",
            "FY 2020\nTotal Enacted\n(Base+Emerg+\nOCO)", "FY 2021\nBase", "FY 2021\nOCO for Base\nRequirements",
            "FY 2021\nOCO for\nDirect War\nand Enduring\nCosts", "FY 2021\nTotal\nOCO", "FY 2021\nTotal\n(Base + OCO)"]
    cols = [(i,) + classify_header(h, 2021)[1:] for i, h in enumerate(hdrs)]
    assert resolve_amount_columns(cols) == {(2020, "enacted"): [0, 2], (2020, "supplemental"): [1],
                                            (2021, "request"): [8]}


def test_fy2023_layout_splits_supplementals_from_enacted():
    hdrs = ["FY 2022\nLess\nSupplementals\nEnactment", "FY 2022\nDivision B\nDivision C\nP.L.117-43\nEnactment",
            "FY 2022\nDivision N\nP.L. 117-103\nEnactment****", "FY 2022\nTotal\nSupplemental\nEnactment",
            "FY 2022\nTotal\nEnactment", "FY 2023\nRequest"]
    cols = [(i,) + classify_header(h, 2023)[1:] for i, h in enumerate(hdrs)]
    assert resolve_amount_columns(cols) == {(2022, "enacted"): [0], (2022, "supplemental"): [3], (2023, "request"): [5]}


def test_fy2027_layout_separates_mandatory():
    hdrs = ["FY 2025 Actuals", "FY 2025 Reconciliation", "FY 2025 Total", "FY 2026 Discretionary Enacted",
            "FY 2026 PL 119-21 Spend Plan", "FY 2026 Total", "FY 2027 Discretionary Request",
            "FY 2027 Mandatory Request", "FY 2027 Total"]
    cols = [(i,) + classify_header(h, 2027)[1:] for i, h in enumerate(hdrs)]
    assert resolve_amount_columns(cols) == {(2025, "actual"): [0], (2025, "reconciliation"): [1],
                                            (2026, "enacted"): [3], (2026, "reconciliation"): [4],
                                            (2027, "request"): [6], (2027, "reconciliation_request"): [7]}
