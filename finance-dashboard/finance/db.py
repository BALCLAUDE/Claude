"""SQLite storage. One file (finance.db) inside the workspace."""
from __future__ import annotations

import sqlite3
from datetime import datetime

SCHEMA = """
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,            -- the inbox folder name
  name TEXT NOT NULL,
  institution TEXT,
  type TEXT NOT NULL,             -- checking/savings/credit/brokerage/retirement/loan/asset
  tax TEXT,                       -- taxable/traditional/roth/hsa (investment accounts)
  currency TEXT DEFAULT 'USD'
);
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id),
  date TEXT NOT NULL,
  amount REAL NOT NULL,
  description_raw TEXT NOT NULL,
  merchant TEXT,
  category TEXT,
  source_category TEXT,           -- category the bank itself supplied, if any
  is_transfer INTEGER DEFAULT 0,
  transfer_pair TEXT,
  tags TEXT DEFAULT '',
  source_file TEXT
);
CREATE INDEX IF NOT EXISTS ix_txn_date ON transactions(date);
CREATE TABLE IF NOT EXISTS balances (
  account_id TEXT NOT NULL,
  date TEXT NOT NULL,
  balance REAL NOT NULL,
  source TEXT,
  PRIMARY KEY (account_id, date)
);
CREATE TABLE IF NOT EXISTS holdings (
  account_id TEXT NOT NULL,
  as_of TEXT NOT NULL,
  symbol TEXT NOT NULL,
  name TEXT,
  quantity REAL,
  price REAL,
  market_value REAL NOT NULL,
  cost_basis REAL,
  PRIMARY KEY (account_id, as_of, symbol)
);
CREATE TABLE IF NOT EXISTS investment_flows (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  amount REAL NOT NULL,
  symbol TEXT,
  description TEXT
);
CREATE TABLE IF NOT EXISTS imports (
  file_hash TEXT PRIMARY KEY,
  path TEXT,
  account_id TEXT,
  parser TEXT,
  rows INTEGER,
  status TEXT,                    -- ok / warning / unreconciled
  message TEXT,
  imported_at TEXT
);
"""


def connect(path) -> sqlite3.Connection:
    con = sqlite3.connect(str(path))
    con.row_factory = sqlite3.Row
    con.executescript(SCHEMA)
    return con


def already_imported(con, fhash: str) -> bool:
    return con.execute("SELECT 1 FROM imports WHERE file_hash=?", (fhash,)).fetchone() is not None


def record_import(con, fhash, path, account_id, parser, rows, status, message=""):
    con.execute(
        "INSERT OR REPLACE INTO imports VALUES (?,?,?,?,?,?,?,?)",
        (fhash, str(path), account_id, parser, rows, status, message, datetime.now().isoformat(timespec="seconds")),
    )


def upsert_account(con, acct_id: str, meta: dict):
    con.execute(
        """INSERT INTO accounts (id, name, institution, type, tax, currency) VALUES (?,?,?,?,?,?)
           ON CONFLICT(id) DO UPDATE SET name=excluded.name, institution=excluded.institution,
             type=excluded.type, tax=excluded.tax, currency=excluded.currency""",
        (acct_id, meta.get("name", acct_id), meta.get("institution"), meta["type"], meta.get("tax"), meta.get("currency", "USD")),
    )
