"""The data workspace and its YAML config files.

A workspace is a folder that holds everything private (default: ./data, which is gitignored):

    data/
      inbox/<account-key>/...   statements you drop in, one folder per account
      config/*.yaml             your accounts, rules, targets, budgets, manual balances
      finance.db                SQLite database built from the inbox
      out/dashboard.html        the generated dashboard
"""
from __future__ import annotations

import shutil
from pathlib import Path

import yaml

PKG_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_CONFIG = PKG_ROOT / "config"
CONFIG_FILES = ("accounts.yaml", "rules.yaml", "securities.yaml", "targets.yaml", "budgets.yaml", "balances.yaml", "settings.yaml")


class Workspace:
    def __init__(self, root: str | Path):
        self.root = Path(root).expanduser().resolve()
        self.inbox = self.root / "inbox"
        self.config_dir = self.root / "config"
        self.db_path = self.root / "finance.db"
        self.out_dir = self.root / "out"

    def init(self) -> list[str]:
        """Create folders and copy any missing config templates. Never overwrites your files."""
        created = []
        for d in (self.inbox, self.config_dir, self.out_dir):
            d.mkdir(parents=True, exist_ok=True)
        for name in CONFIG_FILES:
            dst = self.config_dir / name
            if not dst.exists():
                shutil.copy(DEFAULT_CONFIG / name, dst)
                created.append(str(dst))
        return created

    def load(self, name: str):
        """Load config/<name>. Falls back to the bundled default if the workspace has none."""
        p = self.config_dir / name
        if not p.exists():
            p = DEFAULT_CONFIG / name
        with open(p, encoding="utf-8") as f:
            return yaml.safe_load(f) or {}

    def load_default(self, name: str):
        with open(DEFAULT_CONFIG / name, encoding="utf-8") as f:
            return yaml.safe_load(f) or {}

    def accounts(self) -> dict:
        return (self.load("accounts.yaml") or {}).get("accounts") or {}

    def settings(self) -> dict:
        s = self.load_default("settings.yaml")
        s.update(self.load("settings.yaml") or {})
        return s
