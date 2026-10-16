# Defense Budget Tracker

A companion database and dashboard for the defense tech market map. It classifies DoD budget lines into the map's segments and subsegments and tracks them from FY2021 through the FY2027 request. The full design is in [PLAN.md](PLAN.md). **Phases 1 and 2** are built: the budget foundation and views, then USAspending awards, entity resolution and the Awards and Companies views.

## Quick start

```sh
pip install -r budget/requirements.txt   # openpyxl, PyYAML, pytest
npm install                              # playwright + sql.js for the dashboard tests

npm run budget:fetch    # download R-1/P-1/O-1/M-1 workbooks for FY2021-FY2027 into budget/raw/
npm run budget:build    # taxonomy export → budget/build/budget.sqlite → dashboard
open budget/build/budget-dashboard.html   # or budget/dashboard/index.html

npm run budget:sample   # same pipeline on synthetic exhibits, for a demo without real data
npm run budget:test     # pytest + Playwright smoke tests (uses the sample build)
```

**Real data is checked in** under `budget/raw/Budget Materials/<year>/`: the comptroller download set for the FY2021–FY2027 books. All 166 printed totals in those workbooks reconcile to the dollar, and each book's request matches the published DoD request:

| Book | DoD request ($B) |
|---|---|
| FY2021 | 706.7 |
| FY2022 | 716.7 |
| FY2023 | 774.5 |
| FY2024 | 843.5 |
| FY2025 | 851.5 |
| FY2026 | 850.7 discretionary + 113.3 mandatory |
| FY2027 | 1,104.2 discretionary + 350.0 mandatory = 1,454.2 |

National defense (budget function 050) is higher. It adds about $40–50B a year of Energy Department and other non-DoD funding, which is not in these books.

**Which files are read.**
- For each book, the pipeline reads the six exhibits that make up the DoD request, taking the plain file over its `_display` twin:

  | Exhibit | Contents |
  |---|---|
  | `r1` | RDT&E |
  | `p1` | Procurement |
  | `o1` | Operation & maintenance |
  | `m1` | Military personnel |
  | `rf1` | Revolving funds |
  | `c1` | Military construction & family housing |

  C-1 lists projects on one sheet per fiscal year; they roll up to account × budget-activity lines, using total obligational authority.
- It skips the displays of lines already counted elsewhere:
  - `p1r`, a reserve-component view of P-1 lines;
  - `*_ooc` files and C-1 "(OOC)" sheets, the overseas-operations costs funded inside the base budget.
- Only the first sheet is parsed. The later sheets repeat it one column at a time.
- Rows marked Non-Add or excluded from total obligational authority (TOA) are kept as `…:memo` lines, so the printed totals still reconcile, but they are never counted.

**If the download is blocked**, download the workbooks in a browser from the comptroller's Budget Materials page (comptroller.war.gov). Save each one as `budget/raw/FY<year>/FY<year>_r1.xlsx` (or `_p1`, `_o1`, `_m1`). The site's CDN returns 403 to some cloud IPs. Any file name containing `r1` / `p1` / `o1` / `m1` works, as long as the folder or file name carries the `FY<year>`.

## Pipeline (`python -m budget.etl <step>`)

| Step | What it does |
|---|---|
| `fetch` | Downloads the Excel exhibits for each budget book (`--books 2025-2027` limits the range). |
| `build` | Builds the database:<br>1. Creates it from `schema.sql`.<br>2. Loads the taxonomy, companies and programs from `budget/build/taxonomy.json`, written by `scripts/export-taxonomy.mjs`.<br>3. Parses every workbook in `budget/raw/`.<br>4. Checks printed totals.<br>5. Loads the curated mandatory funding.<br>6. Classifies the lines.<br>7. Writes `dashboard/data.js`. |
| `sample` | Runs `build` on synthetic workbooks (`etl/sample.py`). The dashboard shows a "Sample data" banner. |
| `classify` | Re-runs classification on an existing database after you edit rules or overrides. |

**How the exhibits are parsed** (`etl/budget_exhibits.py`). The parser finds the header row and reads each column's meaning from its text, so all three format eras parse with the same code:

| Book years | Request columns |
|---|---|
| FY2021–22 | Base / OCO / total |
| FY2023–25 | Actuals / enacted / supplemental / request |
| FY2026+ | Discretionary + reconciliation |

- **Value types.** Overlapping columns are resolved so nothing is counted twice:

  | Columns in the book | Stored as |
  |---|---|
  | Discretionary request | `request` |
  | Reconciliation or mandatory amounts for the book year or later, e.g. "FY 2027 Mandatory Request" | `reconciliation_request` |
  | Reconciliation or mandatory amounts enacted or spent, e.g. "PL 119-21 Spend Plan", "Mandatory Enacted" | `reconciliation` |
  | FY2021 base + OCO | `enacted` / `request`, from the base and OCO columns rather than totals that fold in emergency funding |
  | FY2023–24 "Less Supplementals" | `enacted` |
  | FY2023–24 "Total Supplemental" | `supplemental` |
  | FY2025 book's "PB Request with CR Adjustments" | `cr` |
  | Bare "Total" columns next to explicit ones | ignored |

  The FY2027 book puts large mandatory requests on a few lines: about $40.6B in Industrial Base Analysis and Sustainment Support and $30.0B in Defense Production Act Purchases. Use the dashboard's mandatory toggle to see trends with and without them.
- **Line IDs.** Each line is `<exhibit>:<account>:<PE/BLI/SAG>`.
- **Sources.** Every value keeps its source book and cell. The view `v_values_latest` picks the newest book for each (line, FY, type).

**Checks.** The parser checks account totals and grand totals printed in the workbook against the parsed sums. It also checks any rows in `data/toplines.csv`, e.g. the toplines printed in the PDF books. A difference over $1K fails the build; `--allow-mismatch` records it instead.

## Files you edit

| File | Purpose |
|---|---|
| `rules/sector_rules.yaml` | Title / PE / account rules mapping a line to weighted subsegments, `not_tech`, and a program. First match wins. Golden cases live in `tests/golden/rules.yaml`; add one whenever you add a rule. |
| `overrides/line_sector.csv` | Analyst decisions: `line_id, subsegment_id, weight, rationale, reviewer, date`. Use `subsegment_id = not_tech` to exclude a line. These always win on rebuild. |
| `data/mandatory_funding.csv` | Reconciliation sections and supplementals, one cited row per section or component split. Set `counted_in_exhibits=1` when the R-1/P-1 already carry the amount (FY2026+ books print a reconciliation column), so it is not counted twice. |
| `data/toplines.csv` | Printed appropriation totals to reconcile against: `book_fy, exhibit, account ('*' = all), fy, value_type, amount_k, source`. |

These are empty in this commit. They are meant to be filled from the source documents, each row with its citation.

## Dashboard

`dashboard/index.html` loads sql.js (asm.js build, pinned on cdnjs) and the database embedded in `dashboard/data.js`. When the page is served over HTTP it falls back to `../build/budget.sqlite`, and it also offers a file picker. `scripts/build-budget-dashboard.mjs` inlines everything into `build/budget-dashboard.html`.

| View | What it shows |
|---|---|
| Sector trends | Stacked FY bars by segment or by one segment's subsegments, with KPIs, CAGR, share and a table view. |
| Line explorer | Filters, sortable PY actual / CY enacted / BY request / recon / Δ columns, and a detail dialog with every value by source book. Copy as CSV. |
| Movers | Biggest increases and cuts, new starts, terminations, and enacted-vs-request gaps. |

**Toggles.** Values can be shown as best available (actual → enacted → request), request only, enacted only or actual only. Reconciliation and supplementals can be included or excluded.

## Phase 2: awards (USAspending)

```sh
python -m budget.etl entities   # company -> USAspending recipients, written to budget/raw/usaspending/entities.json
python -m budget.etl awards     # DoD award data for matched companies, written to budget/raw/usaspending/
npm run budget:build            # loads both into the database
```

Both steps cache raw API responses under `budget/build/cache/` and accept `--companies a,b` to refresh a few companies. Their outputs in `budget/raw/usaspending/` are committed, so a build needs no network.

**Entity resolution** (`etl/entities.py`, `rules/entity_aliases.yaml`):
- Each company is searched by its map name, or by the curated search terms in the YAML.
- A recipient counts when its normalized name matches the company's patterns. Patterns default to the map name as whole words.
- Subsidiaries with other names are listed explicitly: Sikorsky, Electric Boat, Collins, Aerojet Rocketdyne, Arcturus, Heron Systems and so on.
- USAspending's parent → children lists are **not** used by default. They keep historical links, such as Lockheed Martin → Leidos and RTX → Sikorsky. `parents: true` turns them on per company.
- A UEI matched by two companies goes to the one that matched by name, otherwise to neither, and is recorded under `conflicts`.
- Generic names (Twenty, Covenant, Fortify, Albacore) and false matches (Helsing, Caracol, Dominion Dynamics) are skipped until someone adds `include_ueis` after review.
- Every match records how it was made, shown in the Company view.

**What is fetched per company** (DoD as the awarding agency, FY2021 to date):
- monthly obligations, all award types;
- obligations by product/service code (PSC) for each fiscal year;
- the 100 largest contract awards;
- order totals and reported ceilings for the 10 contract vehicles (IDVs) carrying the most of those awards.

Separately, the top 25 recipients across all DoD contractors are fetched for each sector-specific PSC rule and fiscal year.

**Award sectors** (`etl/award_sectors.py`, `rules/psc_rules.yaml`):
- A PSC that names a sector decides it, e.g. 1840 → Launch.
- A broad code, such as an R&D or IT code, goes to the company's own map subsegments in that segment.
- Otherwise the amount is split evenly across the company's map subsegments; Primes stay in the Primes column.
- PSC is a weak signal for startups, whose work is often coded as general hardware (5340) or engineering support (R425).

**Dashboard:**
- **Awards:** top recipients by sector over time, across all DoD contractors, with companies on the map marked. Below it, the largest awards, filterable by company, sector, DoD component, type, start year and size, each linked to its USAspending page.
- **Companies:** a leaderboard by last-12-months obligations. Each company page (`#company-<id>`) shows:
  - obligations by sector and fiscal year;
  - award momentum: the last 12 months against the 12 before;
  - largest contracts;
  - contract vehicles: obligated on orders, order potential, and the reported ceiling;
  - PSC mix;
  - the matched recipients, each with its evidence.
- **Data lag:** DoD contract data reaches USAspending after a 90-day delay. The dashboard measures "data through" from the last month at or above half the trailing average.

## Not built yet (later phases)

- **Phase 3:** announcements, subawards, SBIR and OTAs.
- **Phase 4:** the Claude classification pass, exposure scores, the weekly digest and scheduled refreshes.

The award tables already exist in `schema.sql` and are empty.
