-- Defense budget & awards database. Built from scratch on every run by `python -m budget.etl all`.
-- Amounts are in thousands of dollars ($K), as printed in the comptroller exhibits.

PRAGMA foreign_keys = ON;

CREATE TABLE meta (
  key   TEXT PRIMARY KEY,
  value TEXT
);

-- ---------------------------------------------------------------- Taxonomy (from the map)
CREATE TABLE segments (
  id    TEXT PRIMARY KEY,
  code  TEXT,
  name  TEXT NOT NULL,
  blurb TEXT,
  sort  INTEGER NOT NULL
);

CREATE TABLE subsegments (
  id         TEXT PRIMARY KEY,
  segment_id TEXT NOT NULL REFERENCES segments(id),
  name       TEXT NOT NULL,
  blurb      TEXT,
  sort       INTEGER NOT NULL
);

CREATE TABLE companies (
  id                  TEXT PRIMARY KEY,
  name                TEXT NOT NULL,
  status              TEXT CHECK (status IN ('public', 'private')),
  ticker              TEXT,
  exchange            TEXT,
  country             TEXT,
  domain              TEXT,
  primary_subsegment  TEXT REFERENCES subsegments(id),
  consensus_sales_cy25_m REAL,
  consensus_sales_cy26_m REAL
);

CREATE TABLE company_subsegments (
  company_id    TEXT NOT NULL REFERENCES companies(id),
  subsegment_id TEXT NOT NULL REFERENCES subsegments(id),
  PRIMARY KEY (company_id, subsegment_id)
);

CREATE TABLE programs (
  id       TEXT PRIMARY KEY,
  name     TEXT NOT NULL,
  customer TEXT,
  blurb    TEXT
);

CREATE TABLE company_programs (
  company_id TEXT NOT NULL REFERENCES companies(id),
  program_id TEXT NOT NULL REFERENCES programs(id),
  PRIMARY KEY (company_id, program_id)
);

-- ---------------------------------------------------------------- Budget
-- One row per budget line, stable across budget books. line_id = '<exhibit>:<account>:<pe/bli>'.
CREATE TABLE budget_lines (
  line_id         TEXT PRIMARY KEY,
  exhibit         TEXT NOT NULL,          -- r1, p1, o1, m1, rf1, c1, recon, supp
  appropriation   TEXT NOT NULL,          -- RDT&E, Procurement, O&M, MilPers, Revolving Funds, MilCon, ...
  account         TEXT,                   -- e.g. 2040A, 3600F, 0400D
  account_title   TEXT,
  component       TEXT,                   -- Army, Navy, USMC, Air Force, Space Force, Defense-Wide
  organization    TEXT,                   -- as printed
  budget_activity TEXT,
  ba_title        TEXT,
  line_number     TEXT,                   -- from the latest book that carries the line
  pe_bli          TEXT,                   -- program element, P-1 line item or O-1/M-1 SAG
  title           TEXT NOT NULL,
  classification  TEXT,
  first_book      INTEGER,
  last_book       INTEGER,
  counted         INTEGER NOT NULL DEFAULT 1  -- 0 = Non-Add or not-in-TOA memo entry
);

-- Every value keeps the book it came from: the FY24 actual comes from the FY26 book, the FY25
-- enacted from the FY26 book, and so on. v_values_latest picks the newest book per value.
CREATE TABLE source_docs (
  source_doc  TEXT PRIMARY KEY,           -- e.g. 'FY2026 R-1'
  book_fy     INTEGER,
  exhibit     TEXT,
  source_file TEXT,                       -- workbook path under budget/raw/, or the curated CSV
  sheet       TEXT,
  loaded      TEXT
);

CREATE TABLE budget_values (
  line_id     TEXT NOT NULL REFERENCES budget_lines(line_id),
  fy          INTEGER NOT NULL,
  value_type  TEXT NOT NULL CHECK (value_type IN
                ('actual', 'enacted', 'request', 'cr', 'reconciliation', 'reconciliation_request',
                 'supplemental', 'fydp')),
                -- reconciliation = mandatory money enacted or spent (spend plans, actuals);
                -- reconciliation_request = mandatory money still being requested
  amount_k    REAL NOT NULL,
  source_doc  TEXT NOT NULL REFERENCES source_docs(source_doc),
  book_fy     INTEGER,                    -- budget year of the source book
  page        TEXT,                       -- worksheet row for Excel, page or section for other sources
  PRIMARY KEY (line_id, fy, value_type, source_doc)
) WITHOUT ROWID;

-- Printed appropriation totals (from the exhibit itself or budget/data/toplines.csv) and the
-- parsed sums they were checked against. The build fails on a mismatch over $1K.
CREATE TABLE exhibit_checks (
  source_doc  TEXT NOT NULL,
  account     TEXT NOT NULL,              -- '*' = exhibit grand total
  fy          INTEGER NOT NULL,
  value_type  TEXT NOT NULL,
  printed_k   REAL NOT NULL,
  parsed_k    REAL NOT NULL,
  ok          INTEGER NOT NULL,
  origin      TEXT NOT NULL,              -- 'exhibit' or 'toplines.csv'
  PRIMARY KEY (source_doc, account, fy, value_type, origin)
);

-- Curated mandatory funding (reconciliation sections, supplementals), kept whole for reference.
-- Rows not already carried in the exhibits also become budget_lines/budget_values.
CREATE TABLE mandatory_funding (
  id                  TEXT PRIMARY KEY,
  law                 TEXT NOT NULL,
  public_law          TEXT,
  section             TEXT,
  title               TEXT NOT NULL,
  kind                TEXT CHECK (kind IN ('reconciliation', 'supplemental')),
  fy                  INTEGER NOT NULL,
  available_through   INTEGER,
  component           TEXT,
  appropriation       TEXT,
  program_id          TEXT,
  amount_k            REAL NOT NULL,
  counted_in_exhibits INTEGER NOT NULL DEFAULT 0,
  source_url          TEXT,
  source_page         TEXT,
  notes               TEXT
);

-- One line can be split across several subsegments; weights per line sum to 1.
CREATE TABLE line_sector_map (
  line_id       TEXT NOT NULL REFERENCES budget_lines(line_id),
  subsegment_id TEXT NOT NULL REFERENCES subsegments(id),
  weight        REAL NOT NULL CHECK (weight > 0 AND weight <= 1),
  method        TEXT NOT NULL CHECK (method IN ('rule', 'claude', 'human')),
  confidence    REAL,
  rule_id       TEXT,
  rationale     TEXT,
  reviewer      TEXT,
  PRIMARY KEY (line_id, subsegment_id)
);

-- Classification outcome per line: mapped (rows in line_sector_map), not_tech, or unclassified.
CREATE TABLE line_status (
  line_id    TEXT PRIMARY KEY REFERENCES budget_lines(line_id),
  status     TEXT NOT NULL CHECK (status IN ('mapped', 'not_tech', 'unclassified')),
  method     TEXT,
  rule_id    TEXT,
  confidence REAL,
  rationale  TEXT
);

CREATE TABLE line_program (
  line_id    TEXT NOT NULL REFERENCES budget_lines(line_id),
  program_id TEXT NOT NULL REFERENCES programs(id),
  method     TEXT NOT NULL,
  evidence   TEXT,
  PRIMARY KEY (line_id, program_id)
);

CREATE TABLE review_queue (
  id         INTEGER PRIMARY KEY,
  item_type  TEXT NOT NULL,               -- 'line' or 'award'
  item_id    TEXT NOT NULL,
  reason     TEXT NOT NULL,
  amount_k   REAL,
  suggestion TEXT,
  created    TEXT
);

-- ---------------------------------------------------------------- Awards (filled from Phase 2)
CREATE TABLE entity_aliases (
  uei        TEXT,
  parent_uei TEXT,
  name       TEXT NOT NULL,
  company_id TEXT NOT NULL REFERENCES companies(id),
  level      TEXT,                        -- USAspending recipient level: P parent, C child, R recipient
  method     TEXT,                        -- name (pattern match), parent (child of a matched parent), curated
  evidence   TEXT,
  amount_all_agencies REAL,               -- lifetime obligations across all agencies, for review
  valid_from TEXT,
  valid_to   TEXT,
  note       TEXT
);

-- DoD obligations per company (all award types), by month and by product/service code.
CREATE TABLE company_obligations_month (
  company_id TEXT NOT NULL REFERENCES companies(id),
  fy         INTEGER NOT NULL,
  month      INTEGER NOT NULL,             -- fiscal month, 1 = October
  obligated  REAL NOT NULL,                -- dollars
  contracts  REAL,
  other      REAL,
  PRIMARY KEY (company_id, fy, month)
);

CREATE TABLE company_psc_fy (
  company_id TEXT NOT NULL REFERENCES companies(id),
  fy         INTEGER NOT NULL,
  psc        TEXT NOT NULL,
  psc_name   TEXT,
  obligated  REAL NOT NULL,
  PRIMARY KEY (company_id, fy, psc)
);

-- company_psc_fy spread over subsegments (award_sectors.py).
CREATE TABLE company_sector_fy (
  company_id    TEXT NOT NULL REFERENCES companies(id),
  fy            INTEGER NOT NULL,
  subsegment_id TEXT NOT NULL REFERENCES subsegments(id),
  obligated     REAL NOT NULL,
  method        TEXT NOT NULL,             -- psc, psc+company, company
  PRIMARY KEY (company_id, fy, subsegment_id, method)
);

-- IDVs carrying a company's largest awards: order totals and the ceiling where reported.
CREATE TABLE idv_vehicles (
  idv_id             TEXT PRIMARY KEY,
  company_id         TEXT REFERENCES companies(id),
  piid               TEXT,
  description        TEXT,
  type               TEXT,
  agency             TEXT,
  date_signed        TEXT,
  last_date_to_order TEXT,
  ceiling            REAL,
  orders             INTEGER,
  orders_obligated   REAL,
  orders_potential   REAL
);

-- Top recipients per sector and FY across all DoD contractors, by product/service code.
CREATE TABLE sector_recipients_fy (
  rule_id       TEXT NOT NULL,
  subsegment_id TEXT REFERENCES subsegments(id),
  fy            INTEGER NOT NULL,
  rank          INTEGER NOT NULL,
  recipient     TEXT,
  uei           TEXT,
  company_id    TEXT REFERENCES companies(id),
  obligated     REAL,
  PRIMARY KEY (rule_id, fy, rank)
);

CREATE TABLE awards (
  award_id        TEXT PRIMARY KEY,       -- USAspending generated id, or source-specific key
  psc_name        TEXT,
  sector_method   TEXT,
  piid            TEXT,
  parent_idv      TEXT,
  award_type      TEXT,                   -- contract, idv, ota, sbir, grant
  agency          TEXT,
  sub_agency      TEXT,
  recipient_name  TEXT,
  recipient_uei   TEXT,
  parent_uei      TEXT,
  company_id      TEXT REFERENCES companies(id),
  psc             TEXT,
  naics           TEXT,
  start_date      TEXT,
  end_date        TEXT,
  obligated       REAL,                   -- dollars
  ceiling         REAL,
  description     TEXT,
  source          TEXT
);

CREATE TABLE award_transactions (
  award_id    TEXT NOT NULL REFERENCES awards(award_id),
  action_date TEXT,
  mod_number  TEXT,
  obligated   REAL,
  description TEXT
);

CREATE TABLE subawards (
  award_id        TEXT REFERENCES awards(award_id),
  sub_recipient   TEXT,
  sub_uei         TEXT,
  company_id      TEXT REFERENCES companies(id),
  amount          REAL,
  action_date     TEXT,
  description     TEXT
);

CREATE TABLE announcements (
  id          TEXT PRIMARY KEY,
  date        TEXT,
  agency      TEXT,
  raw_text    TEXT,
  piid        TEXT,
  company_id  TEXT REFERENCES companies(id),
  amount      REAL,
  program     TEXT,
  funds_text  TEXT,
  url         TEXT
);

CREATE TABLE award_sector_map (
  award_id      TEXT NOT NULL REFERENCES awards(award_id),
  subsegment_id TEXT NOT NULL REFERENCES subsegments(id),
  weight        REAL NOT NULL,
  method        TEXT NOT NULL,
  confidence    REAL,
  rationale     TEXT,
  PRIMARY KEY (award_id, subsegment_id)
);

-- ---------------------------------------------------------------- Views
-- Newest book wins for each (line, FY, value type).
CREATE VIEW v_values_latest AS
SELECT line_id, fy, value_type, amount_k, source_doc, book_fy FROM (
  SELECT v.*, ROW_NUMBER() OVER (PARTITION BY line_id, fy, value_type ORDER BY book_fy DESC, source_doc) AS rn
  FROM budget_values v
) WHERE rn = 1;

-- Values spread across subsegments by weight.
CREATE VIEW v_sector_values AS
SELECT v.fy, v.value_type, m.subsegment_id, s.segment_id, v.line_id, v.amount_k * m.weight AS amount_k
FROM v_values_latest v
JOIN line_sector_map m ON m.line_id = v.line_id
JOIN subsegments s ON s.id = m.subsegment_id;
