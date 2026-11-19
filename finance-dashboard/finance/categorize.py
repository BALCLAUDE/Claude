"""Assign categories and tags from rules.yaml.

Priority: your rules (workspace config/rules.yaml) > the bundled default rules (they know specific
merchants) > the bank's own category, mapped through `source_categories` > 'Uncategorized'.
"""
from __future__ import annotations

import re
from dataclasses import dataclass


@dataclass
class Rule:
    rx: re.Pattern
    category: str | None
    merchant: str | None
    tags: list[str]
    amount_sign: int  # 0 any, 1 only inflows, -1 only outflows
    if_unmatched: str | None = None  # category to use when this "Transfer" finds no matching transaction
    pairs_with: str | None = None    # ...but only within this account's imported date range


def compile_rules(raw: list[dict]) -> list[Rule]:
    out = []
    for r in raw or []:
        sign = {"in": 1, "out": -1}.get(r.get("when"), 0)
        tags = r.get("tags") or []
        out.append(Rule(re.compile(r["match"], re.I), r.get("category"), r.get("merchant"), [tags] if isinstance(tags, str) else tags, sign,
                        r.get("if_unmatched"), r.get("pairs_with")))
    return out


class Categorizer:
    def __init__(self, user_cfg: dict, default_cfg: dict):
        self.user = compile_rules(user_cfg.get("rules"))
        self.default = compile_rules(default_cfg.get("rules"))
        src = dict(default_cfg.get("source_categories") or {})
        src.update(user_cfg.get("source_categories") or {})
        self.source = {k.lower(): v for k, v in src.items()}

    def unmatched_rules(self) -> list[Rule]:
        return [r for r in self.user if r.if_unmatched]

    def source_lookup(self, src: str) -> str | None:
        """Bank-supplied category -> ours. Amex uses "Group-Subcategory" (e.g. "Merchandise &
        Supplies-Groceries"): try the full name, then the subcategory, then the group."""
        key = src.strip().lower()
        if key in self.source:
            return self.source[key]
        if "-" in key:
            group, sub = key.split("-", 1)
            return self.source.get(sub.strip()) or self.source.get(group.strip())
        return None

    def apply(self, description: str, merchant: str, amount: float, source_category: str | None):
        """Return (merchant, category, tags). The first rule with a category wins. Your rules without a
        category only rename the merchant or add tags, and every one of your rules that matches adds its tags."""
        text = f"{description} || {merchant}"
        tags: list[str] = []
        renamed = False
        cat = None

        def run(rules, stop_at_category):
            nonlocal merchant, renamed, cat
            for r in rules:
                if stop_at_category and cat is not None:
                    break
                if r.amount_sign and (amount > 0) != (r.amount_sign > 0):
                    continue
                if not r.rx.search(text):
                    continue
                if r.merchant and not renamed:
                    merchant, renamed = r.merchant, True
                tags.extend(t for t in r.tags if t not in tags)
                if cat is None and r.category:
                    cat = r.category

        run(self.user, False)  # every matching user rule adds its tags
        run(self.default, True)  # the defaults stop at the first rule that sets a category
        if cat is None and source_category:
            cat = self.source_lookup(source_category)
        return merchant, cat or "Uncategorized", tags
