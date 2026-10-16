# Defense Budget Tracker

A companion database and dashboard for the defense tech market map. It classifies DoD budget lines into the map's segments and subsegments and tracks them from FY2021 through the FY2027 request. The full design is in [PLAN.md](PLAN.md). **Phase 1** is built: the foundation and the budget views. Awards come in Phase 2.

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

- **Value types.** The discretionary request is stored as `request` and the reconciliation column as `reconciliation`. A bare "Total" next to enacted + supplemental is ignored, so nothing is counted twice.
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

## Not built yet (later phases)

- **Phase 2:** awards, entity resolution and the company view.
- **Phase 3:** announcements, subawards, SBIR and OTAs.
- **Phase 4:** the Claude classification pass, exposure scores, the weekly digest and scheduled refreshes.

The award tables already exist in `schema.sql` and are empty.
