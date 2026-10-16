# Defense Budget & Awards Database: Plan

## Context
The research team has an interactive defense-tech market map (`defense-tech-map.html`, built from `src/` in this repo). It has 9 segments, 46 sub-segments and 282 companies. They want a companion **database and dashboard** that does three things:
- classifies every DoD/DoW budget line (RDT&E, Procurement, O&M, plus reconciliation and supplementals) into the map's sectors;
- shows actual, enacted and requested values from FY2021 through the FY2027 request;
- tracks awards (prime, daily announcements, subawards, OTA/SBIR/DIU) and which companies receive them.

The goal is trend analysis: where the money is flowing, what the department is prioritizing, and which companies are positioned to benefit.

**Decisions made with the user:**
- A real database plus a dashboard.
- **Local SQLite with a static dashboard** that queries the DB in the browser (sql.js). There is no server.
- Classification is **rules first, then a Claude pass, then human review**.
- All four output types: trends and movers, company exposure scores, a weekly digest, and exports.
- The user will open network access to the government data hosts.

## Prerequisites (user action)
- **Allow these domains** in the environment's network settings: api.usaspending.gov, files.usaspending.gov, comptroller.war.gov, comptroller.defense.gov, www.defense.gov, www.war.gov, api.sam.gov, api.www.sbir.gov, www.diu.mil. They currently return 403.
- **Add `ANTHROPIC_API_KEY`** as an environment secret for the classification pass. A free `SAM_API_KEY` is optional and used for entity lookups.

## Architecture
The new top-level `budget/` folder leaves the map untouched. ETL is in Python, because the comptroller exhibits are Excel and PDF. The dashboard is a static HTML page reusing the map's design tokens.

```
budget/
  etl/                      # python -I -m budget.etl <step>
    taxonomy.py             # loads sectors and companies exported from src/data
    budget_exhibits.py      # R-1 / P-1 / O-1 / M-1 Excel → budget_lines, budget_values
    reconciliation.py       # curated mandatory-funding tables (reconciliation sections, supplementals)
    usaspending.py          # prime awards, transactions, subawards (DoD agency 097)
    announcements.py        # defense.gov daily contracts scrape → Claude extraction → structured rows
    sbir.py, ota_diu.py     # SBIR/STTR API; OTA via FPDS award types; DIU curated
    entities.py             # company ↔ UEI/parent/alias resolution
    classify.py             # rules.yaml → Claude (cached) → review_queue
    scores.py               # exposure and momentum metrics
    digest.py               # weekly markdown/HTML digest
  rules/sector_rules.yaml   # PE/line-number, title-keyword and program → subsegment rules
  rules/entity_aliases.yaml
  overrides/*.csv           # human review decisions (versioned in git)
  schema.sql
  dashboard/index.html, app.js, styles.css
  tests/                    # pytest with small fixture slices of real exhibits and API responses
scripts/export-taxonomy.mjs # dumps DTM taxonomy, companies and programs to budget/build/taxonomy.json
.github/workflows/budget-refresh.yml  # weekly ETL, build DB, digest
```

Reuse from the existing code:
- `src/data/taxonomy.js`: segment and subsegment ids are the sector keys.
- `src/data/companies/*.js`: company ids, names, tickers and public/private status.
- `src/data/programs.js`: the 25-program registry, which seeds a `programs` table and line/award linking.
- `src/data/consensus.js`: revenue estimates, used as denominators in the exposure scores.
- The color, font and dark-mode tokens in `src/styles.css`.
- The Playwright setup in `tests/map.spec.mjs`, a template for the dashboard smoke tests.
- Every dashboard company card deep-links back into the map (`defense-tech-map.html#<id>`).

## Data model (`schema.sql`)
- **`subsegments`** and **`companies`**, imported from the map.
- **`budget_lines`**: `line_id`, appropriation (RDT&E, Proc, O&M, Recon), account/TAS, component (Army, Navy, USMC, Air Force, Space Force, Defense-wide/agency), budget activity, PE or P-1 line number, title.
- **`budget_values`**: line, FY, `value_type` (actual, enacted, request, CR, reconciliation, supplemental, FYDP outyear), amount ($K), source document, page, as-of date.
  - Each value is stored with its source book. Example: the FY24 actual comes from the FY26 book, and the FY25 enacted value from the FY26 book.
- **`line_sector_map`**: line, subsegment, weight (so one line can be split across sectors), method (rule, claude or human), confidence, rationale, reviewer.
- **`programs`** and **`line_program`**: program-level rollups, e.g. Golden Dome, CCA, Replicator.
- **`awards`**: PIID/parent IDV, award type (contract, IDV, OTA, SBIR, grant), agency and sub-agency, recipient UEI, `company_id`, PSC, NAICS, dates, obligated amount, ceiling, description, source.
  - Also **`award_transactions`**, **`subawards`** and **`announcements`** (raw text plus extracted fields, linked to awards by PIID).
- **`award_sector_map`** works like `line_sector_map`. Signals include PSC/NAICS, program keywords, the company's primary subsegment, and the announcement's program name.
- **`entity_aliases`** (UEI, parent UEI, names, M&A history → `company_id`) and **`review_queue`**.

**Note on linking awards to budget lines.** Federal contract data does not carry PE or P-1 numbers. Awards and budget lines therefore roll up to the same taxonomy independently. Direct line↔award links are made only where there is evidence: the announcement text names the funds or program, or a program registry match exists. The dashboard labels those links as inferred.

## Classification pipeline
1. **Rules.** `sector_rules.yaml` holds PE and line-number patterns, title regexes and program keywords. It should cover most of the big tech lines with 100% confidence.
2. **Claude.** Remaining tech-relevant lines are sent in batches with:
   - the title and R-2/P-40 mission description where it is available
   - the taxonomy, with sub-segment blurbs
   
   Claude returns structured JSON: subsegment weights, confidence, rationale, and a "not defense-tech" flag (e.g. military pay, base ops). Results are cached by content hash, so they cost nothing to rebuild.
3. **Review.** Anything below the confidence threshold, or above a $ size threshold, goes to the `review_queue`. Analysts' decisions are saved in `overrides/*.csv`, which always win on rebuild.

## Dashboard views (static, sql.js from cdnjs, loads `budget.sqlite`)
1. **Sector trends.** A stacked FY21–FY27 chart by segment and subsegment, toggling actual, enacted and request. Share of the tech budget and CAGR.
2. **Line explorer.** A filterable table: FY, component, appropriation, segment/subsegment, program and text search. Columns: PY actual, CY enacted, BY request, Δ$, Δ%, FYDP. Each row opens a detail page with history and the inferred awards and recipients.
3. **Movers.** Biggest increases and cuts, new starts, terminations, and request-vs-enacted gaps, a proxy for congressional adds and cuts.
4. **Awards explorer.** Filters for type (prime, OTA, SBIR, sub), agency, sector, company, date and size. Top recipients by sector over time.
5. **Company view.** Obligations by year and sector, top contracts, IDV ceiling vs obligated, subaward links, and the exposure score with its components. Links to the map profile.
6. **Review queue.** View and export only; edits round-trip through the CSV.
7. **Exports.** CSV/XLSX of any filtered view, and saved views via URL hash.

**Exposure score.** It is transparent, and each component is shown separately:
- **Award momentum:** obligations in the last twelve months vs the prior twelve months.
- **Budget tailwind:** obligation-weighted growth of the sub-segments the company wins in, comparing the FY27 request with FY26 enacted.
- **Gov dependence:** obligations ÷ revenue, from the comps sheet or financials.
- **Pipeline:** unused IDV/OTA ceiling.

The score ranks companies and has a filter for public tickers.

## Phasing (built in order, each phase shippable)
1. **Phase 1. Foundation.**
   - The schema, the taxonomy export, and R-1/P-1/O-1/M-1 ingest for the FY2021–FY2027 books.
   - Reconciliation and supplemental tables, and the rules classifier.
   - The dashboard's Sector trends, Line explorer and Movers views.
2. **Phase 2. Awards.** USAspending prime awards and transactions (DoD; tech-relevant PSC/NAICS plus every tracked company), entity resolution for the 282 companies, the Awards explorer and the Company view.
3. **Phase 3. Coverage.**
   - Daily announcements: scrape, Claude extraction, and a PIID join.
   - Subawards, SBIR/STTR, and OTAs. DIU is curated, because it has no public API.
4. **Phase 4. Intelligence.**
   - The Claude classification pass and the review queue.
   - Exposure scores and the weekly digest (markdown and HTML, optionally emailed via the Gmail connector).
   - A GitHub Actions weekly refresh that publishes the DB and dashboard as a release artifact.

Later candidates to raise with the user (not built now):
- HASC/SASC/approps congressional marks
- unfunded priorities lists
- DD 1414/1415 reprogrammings
- R-2 narrative diffs ("new start" language)
- SAM.gov upcoming solicitations
- GAO protests
- DSCA FMS notifications
- the ratio of VC funding to government awards for private companies

## Verification
- **`pytest budget/tests`.** Parsers run against committed fixture slices: one R-1, P-1 and O-1 sheet per format era, plus sample USAspending and announcement JSON. Rules and entity resolution have golden-file tests.
- **Reconciliation checks in the ETL.** Each exhibit's parsed totals must match its printed appropriation totals to within $1K. FY totals must match the comptroller's published toplines. The build fails on a mismatch.
- **Spot checks against known values,** e.g. PWSA/SDA, Golden Dome, CCA, and Anduril/Palantir obligations against USAspending.gov's own UI.
- **Playwright smoke tests** (`budget/tests/dashboard.spec.mjs`). Each view renders, filters change row counts, exports download, and dark mode works. Same pattern as `tests/map.spec.mjs`.
- **End to end.** `python -I -m budget.etl all && npm run budget:build`, then open `budget/dashboard/index.html` and publish a preview Artifact for the user to review.
- **Delivery.** Commit to `claude/friendly-euler-6nrj63` and push. No PR unless asked.
