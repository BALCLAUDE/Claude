"""Parser registry.

Every parser module exposes:
    NAME: str
    detect(path: Path, account: dict) -> bool    # cheap check: is this file mine?
    parse(path: Path, account: dict) -> ParseResult

`account` is the account's entry from accounts.yaml (type, institution, overrides...).
Parsers are tried in REGISTRY order; put institution-specific parsers before the generic ones.
To add a bank, copy _template_pdf.py, fill it in, and add it to the list below.
"""
from __future__ import annotations

from pathlib import Path

from ..models import ParseResult
from . import generic_csv, generic_pdf, ofx, positions_csv

REGISTRY = [
    # Institution-specific parsers go here, first.
    ofx,
    positions_csv,
    generic_csv,
    generic_pdf,
]

SUPPORTED_SUFFIXES = {".csv", ".ofx", ".qfx", ".pdf", ".txt"}


def parse_file(path: Path, account: dict) -> ParseResult:
    forced = account.get("parser")
    for mod in REGISTRY:
        if forced and mod.NAME != forced:
            continue
        if forced or mod.detect(path, account):
            return mod.parse(path, account)
    raise ValueError(f"No parser recognised {path.name}. Run `python -m finance inspect` on it and add a parser.")
