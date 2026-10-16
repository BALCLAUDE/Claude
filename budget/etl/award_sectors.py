"""Assigns award obligations to map subsegments (see rules/psc_rules.yaml for the signals)."""
from __future__ import annotations

from dataclasses import dataclass

from .usaspending import load_psc_rules


@dataclass
class PscRule:
    id: str
    codes: list
    subsegments: dict
    segments: list
    universe: bool
    universe_subsegments: dict

    def matches(self, psc: str) -> bool:
        psc = (psc or "").upper()
        return any(psc.startswith(c[:-1]) if c.endswith("*") else psc == c for c in self.codes)


def rules() -> list[PscRule]:
    return [PscRule(r["id"], r["codes"], r.get("subsegments") or {}, r.get("segments") or [],
                    bool(r.get("universe")), r.get("universe_subsegments") or r.get("subsegments") or {})
            for r in load_psc_rules()]


class Assigner:
    def __init__(self, seg_of: dict, company_subs: dict):
        self.rules = rules()
        self.seg_of = seg_of                  # subsegment -> segment
        self.company_subs = company_subs      # company -> [subsegment, ...] in map order

    def rule_for(self, psc: str) -> PscRule | None:
        return next((r for r in self.rules if r.matches(psc)), None)

    def assign(self, company_id: str, psc: str) -> tuple[dict, str, str | None]:
        """Returns ({subsegment: weight}, method, rule id)."""
        subs = self.company_subs.get(company_id) or []
        tech = [s for s in subs if self.seg_of.get(s) != "primes"] or subs
        rule = self.rule_for(psc)
        if rule:
            if rule.subsegments:
                return dict(rule.subsegments), "psc", rule.id
            in_seg = [s for s in tech if self.seg_of.get(s) in rule.segments]
            if in_seg:
                return {s: 1 / len(in_seg) for s in in_seg}, "psc+company", rule.id
        if not tech:
            return {}, "none", None
        return {s: 1 / len(tech) for s in tech}, "company", rule.id if rule else None
