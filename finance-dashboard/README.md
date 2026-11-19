# Personal Finance Dashboard

Drop in your bank, credit card, and brokerage statements, run one command, and get a single `dashboard.html` file. It shows where your money goes, what you earn, how your net worth and investments are growing, and what to watch.

**Everything runs on your computer.** Statements are read by local Python code, stored in a local SQLite file, and turned into an HTML file that works offline. Nothing is uploaded anywhere, and the dashboard loads no external scripts. Your data folder is gitignored.

## Quick start

```bash
cd finance-dashboard
python3 -m pip install -e ".[dev]"     # pyyaml + pdfplumber (+ pytest, reportlab for the demo)
python3 -m finance demo --open         # try it on two years of fake data first
```

Then set it up for your own money:

```bash
python3 -m finance init                # creates ./data with inbox/ and config/
```

1. In `data/config/accounts.yaml`, list your accounts. The key is a folder name:
   ```yaml
   accounts:
     chase-checking: {name: Chase Checking, institution: Chase, type: checking}
     amex-gold:      {name: Amex Gold, institution: Amex, type: credit, apr: 27.49}
     fidelity-brk:   {name: Fidelity Brokerage, institution: Fidelity, type: brokerage, tax: taxable}
     fidelity-roth:  {name: Roth IRA, institution: Fidelity, type: retirement, tax: roth}
   ```
2. Make one folder per account under `data/inbox/` and drop that account's files in it, for example `data/inbox/chase-checking/2026-10.csv`.
3. Run:
   ```bash
   python3 -m finance ingest            # import anything new (files already imported are skipped)
   python3 -m finance build --open      # write and open data/out/dashboard.html
   python3 -m finance review            # what is still uncategorized + import problems
   ```

Repeat every month: download, drop the files in, `make update`. Re-dropping a file, or exports that overlap, never double count.

## What to download from each institution

| Account | Best file | Notes |
|---|---|---|
| Checking / savings | **CSV** or **OFX/QFX** ("Download transactions", "Quicken/Web Connect") | Files with a running balance column give you net worth automatically. |
| Credit cards | **CSV** or **OFX/QFX** | Purchases-as-positive exports are detected and flipped. If the file has no balance column, add one `anchors:` balance in `balances.yaml`. |
| Brokerage / IRA | **Positions CSV** (holdings) plus an **activity/history CSV**, or **OFX/QFX** | Positions give allocation and value. Put the date in the file name (`positions_2026-10-31.csv`). Activity gives contributions, dividends and fees. |
| PDF statements | Works for text PDFs | Each one is **checked**: opening balance + transactions must equal the closing balance, or the file is not imported. |
| 401(k), house, car, mortgage, loans | `config/balances.yaml` | Type in a value whenever you check it. It is carried forward. |

CSV/OFX is always more reliable than PDF. Use PDFs only when there is no export.

## Your institutions

`init` creates `config/accounts.yaml` already set up for these. Rename the keys if you like, and make a matching folder under `data/inbox/` for each one.

| Institution | Folder (key) | What to download | How it's read |
|---|---|---|---|
| **Wells Fargo** checking & savings | `wf-checking`, `wf-savings` | Account Activity → **Download** → "Comma Delimited" (or "Quicken (QFX)") | Wells Fargo's CSV has no header row and no balance, so it has its own parser (`wells_fargo_csv`). Add one `anchors:` balance per account in `balances.yaml`, or use QFX, which includes the balance. |
| **American Express** | `amex` | Statements & Activity → **Download** → CSV, with "include all additional transaction details" ticked (or QFX) | Purchases are positive in Amex files (`flip_sign: true` is set). Amex's own categories ("Merchandise & Supplies-Groceries") are used when no rule matches. Add an anchor balance from your statement. |
| **Marcus by Goldman Sachs** | `marcus-hysa` | Monthly **PDF statements**: drop in one per month, as far back as you want history | A statement that only shows balances (no transaction list) imports its ending balance as that month's data point; months in between carry forward. A statement that lists transactions is checked against its beginning and ending balances. Transfers to and from Marcus on the Wells Fargo side are marked as transfers (check `review` in case Wells Fargo words them differently). If a PDF is rejected, run `inspect` on it (see below). Or skip the PDFs and type month-end balances into `balances.yaml` under `manual:` with `type: savings`. |
| **NetX Investor** (Pershing) brokerage | `netx-brokerage` | **Holdings** export (.xlsx or CSV) each month, plus the **Activity/History** export if you want dividends | Holdings give allocation, value and gains (the "as of" date is read from the file). `funded_by: 'PERSHING'` turns your Wells Fargo transfers into contributions, so the months **before your first statement** are filled in with the money you put in (marked "estimated", no gains assumed), and there is no gap. |
| **Fidelity IRA** | `fidelity-ira` | A Fidelity positions export, once you have one | Until then `funded_by: 'FID BKG SVC'` values it at the money you've moved in. Set `tax:` to `roth` or `traditional`. |
| **Fidelity 401(k)** (NetBenefits) | `balances.yaml` → `manual:` | Your balance and contributions from NetBenefits, monthly or quarterly | A commented example (`fidelity-401k`) is in `balances.yaml`. Add `holdings:` with dollars per fund to include it in allocation. |

**Wells Fargo exports now include a header row and a STATUS column**; pending rows are skipped (they're imported once posted). The Marcus PDF reader uses the running balance column to tell credits from debits, and checks every statement against its beginning and ending balance.

### Transfers between your accounts

Money moving between accounts you import (checking ↔ savings, checking → Amex, savings ↔ Marcus) is matched automatically by amount and date, and is never counted as spending or income. Two kinds of money need one rule each in **your** `config/rules.yaml` (examples are in the file):

- **Deposits from a business account you don't import** count as household income: `{match: 'TRANSFER FROM .*BUSINESS CHECKING', category: 'Income:Business', when: in}`
- **Payments to a card you don't import** count as spending: `{match: 'ACTIVE CASH VISA', category: 'Credit Card (untracked)', when: out}`

- **Two cards paid with the same wording, one not imported** (for example your Amex and your spouse's): payments that match a payment in your imported card stay transfers, and the rest count as spending: `{match: 'AMERICAN EXPRESS (ACH PMT|RETRY PYMT)', category: Transfer, if_unmatched: "Amex (spouse's card)", pairs_with: amex}`. Payments within a few days of either end of your card's export stay transfers, since their match may simply be outside the file. The Data tab and `review` show how many payments were counted this way.

`python3 -m finance review` and the Data tab list **transfers with no match**: money sent to an account that isn't imported. If you see many payments to a card with no match, you likely have a second card (for example another Amex). Import it so its purchases count, or add a rule like the one above.

Checking, savings and Amex CSVs have no balance column. Add one known balance per account under `anchors:` in `balances.yaml` (or download Wells Fargo as QFX, which includes it), otherwise they aren't in your net worth.

These parsers were tested on synthetic look-alikes, not on real files from these institutions. If a file is rejected or looks wrong, `python3 -m finance inspect <file>` gives a safe-to-share layout so the parser can be adjusted.

## The dashboard

- **Overview**: net worth, income, spending, savings rate, and amount invested. Also cash flow by month, net worth by cash/investments/assets/debt, where the money went, alerts, and a monthly report card.
- **Spending**: categories per month, totals and averages, top merchants, recurring charges and subscriptions (price increases and new ones flagged), and this year vs. last year.
- **Investments**: value, money put in vs. market growth, time-weighted return and XIRR, allocation vs. your targets with buy/sell amounts to rebalance, allocation by account and by tax treatment, holdings with gains and expense ratios, monthly returns, dividends/interest/fees, and concentration warnings.
- **Projection**: extrapolates your income, spending, savings rate and investment returns month by month. It starts from your real balances and your last 12 months, and every assumption is editable on the page (and remembered in your browser):
  - **Where the growth comes from**: cash, money you put in, investment growth and other assets, year by year.
  - **Range of outcomes**: 400 simulations with random yearly returns. Shows the typical case and the 10th–90th percentile band, plus your financial independence target (25× spending by default).
  - **What moves the needle**: how much each change matters (return ±1 point, saving $500/mo more, spending 10% less, investing all savings...), in dollars and in years to independence.
  - **Milestones** ($500k, $1M, loans paid off, when your investments earn more than you save, independence) and a **year-by-year table**.
  - Optional: **stop working after N years** (spending is then drawn from cash, then investments, and it shows the chance your money lasts), your **birth year** (ages on the timeline), and today's vs. future dollars.
  - The default return is your current allocation weighted by long-run assumptions per asset class (`projection.assumptions` in `settings.yaml`). Your own historical return is shown next to it for reference. These are estimates, not predictions.
- **Planning**: budgets with month-to-date pace, emergency-fund runway, savings-rate trend, debt payoff (avalanche vs. snowball), and tax-time totals by tag.
- **Transactions**: search, filter, sort, and export CSV. Clicking a category anywhere jumps here.
- **Data**: accounts and every imported file with its status.

The date range and account filters at the top apply to cash flow, spending, and transactions.

## Customizing (all in `data/config/`)

| File | What it controls |
|---|---|
| `rules.yaml` | Your categorization rules (regex → category, merchant name, tags). They override the ~35 built-in rules. Every rule re-applies to all history on each build. |
| `budgets.yaml` | Monthly limits per category. |
| `targets.yaml` | Target allocation and the concentration limit. |
| `securities.yaml` | Asset class / expense ratio for funds that aren't built in (about 65 common ETFs and funds are). |
| `balances.yaml` | Manual accounts (house, car, 401k, loans) and anchor balances. |
| `settings.yaml` | Essential categories, transfer-matching window, title, and projection defaults (horizon, birth year, inflation, cash yield, and return/volatility per asset class). |

How the numbers are defined: **income** is categories starting with `Income`. **Spending** is everything else minus refunds, and leaves out `Transfer` (between your own accounts, found automatically by matching amounts) and `Investments` (money moved into brokerage/retirement accounts). **Savings rate** = (income − spending) / income.

## Adding a parser for your bank, without sharing your statements

If a file isn't recognised, or a PDF doesn't reconcile:

```bash
python3 -m finance inspect data/inbox/mybank/statement.pdf > layout.txt
```

This prints the file's **layout only**: every digit becomes `9`, and every word becomes `x`'s, except common statement words like "Balance" and "Purchases". Read it, then share `layout.txt` (not the statement) to get a parser written. Copy `finance/parsers/_template_pdf.py`, add it to `REGISTRY` in `finance/parsers/__init__.py`, and add a test with a synthetic copy of the layout.

For CSVs, a column mapping in `accounts.yaml` usually fixes it without a parser:
```yaml
  mybank-checking:
    type: checking
    columns: {date: "Post Date", description: "Payee", debit: "Withdrawals", credit: "Deposits"}
    date_format: "%d/%m/%Y"
```

## Project layout

```
finance/              Python package (python -m finance ...)
  parsers/            wells_fargo_csv, generic_csv, positions_csv (CSV/xlsx), ofx, generic_pdf, _template_pdf
  ingest.py           inbox → SQLite, dedupe, manual balances
  categorize.py normalize.py transfers.py recurring.py
  metrics.py          cash flow, net worth
  investments.py      allocation, drift, contributions vs. growth, TWR, XIRR
  insights.py         budgets, runway, debts, alerts, year over year, tax tags, report cards
  projection.py       starting balances and recent averages for the Projection tab
  build.py            computes everything and inlines it into one HTML file
  sample.py           fake data for the demo and tests
  default_rules.yaml  default_securities.yaml
config/               templates copied into your workspace by `init`
web/                  template.html, app.js, projection.js (the projection engine), styles.css, vendor/chart.umd.min.js (Chart.js 4.4.6, MIT)
tests/                pytest, on synthetic data only
```

Run the tests with `python3 -m pytest -q` (the projection tests need Node).
