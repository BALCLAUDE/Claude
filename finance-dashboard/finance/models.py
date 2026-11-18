"""Plain data records that every parser returns. Amounts are floats in the account's currency:
negative = money leaving the account (a purchase, a withdrawal), positive = money arriving."""
from __future__ import annotations

from dataclasses import dataclass, field

ACCOUNT_TYPES = ("checking", "savings", "credit", "brokerage", "retirement", "loan", "asset")
CASH_TYPES = ("checking", "savings")
INVEST_TYPES = ("brokerage", "retirement")
DEBT_TYPES = ("credit", "loan")

FLOW_TYPES = ("contribution", "withdrawal", "dividend", "interest", "fee", "buy", "sell", "other")


@dataclass
class Txn:
    date: str  # ISO yyyy-mm-dd
    amount: float
    description: str
    category: str | None = None  # a parser may know it (e.g. a card's own category)


@dataclass
class Balance:
    date: str
    balance: float  # liabilities are negative


@dataclass
class Holding:
    as_of: str
    symbol: str
    name: str
    quantity: float
    price: float
    market_value: float
    cost_basis: float | None = None


@dataclass
class Flow:
    date: str
    type: str  # one of FLOW_TYPES
    amount: float  # contribution > 0, withdrawal < 0, fee < 0, dividend > 0
    symbol: str = ""
    description: str = ""


@dataclass
class ParseResult:
    parser: str
    transactions: list[Txn] = field(default_factory=list)
    balances: list[Balance] = field(default_factory=list)
    holdings: list[Holding] = field(default_factory=list)
    flows: list[Flow] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    # Set by statement parsers that can check themselves: opening + sum(txns) == closing.
    reconciled: bool | None = None
