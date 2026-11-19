"""Generate a fake but realistic workspace (two years of statements) for the demo and the tests.

Everything here is invented. It writes the same kinds of files you would download from real
institutions: a checking CSV with running balances, a credit card CSV that lists purchases as
positive numbers, PDF card statements, a savings OFX file, and brokerage positions and activity CSVs.
"""
from __future__ import annotations

import csv
import random
import shutil
from datetime import date, timedelta
from pathlib import Path

import yaml

from .config import Workspace
from .metrics import month_end, month_range


def _months_back(end: date, n: int) -> list[str]:
    y, m = end.year, end.month
    out = []
    for _ in range(n):
        out.append(f"{y:04d}-{m:02d}")
        m -= 1
        if m == 0:
            y, m = y - 1, 12
    return out[::-1]


def _d(ym: str, day: int) -> date:
    last = int(month_end(ym)[8:])
    return date(int(ym[:4]), int(ym[5:7]), min(day, last))


def make_demo(ws: Workspace, end: date | None = None, months: int = 24, seed: int = 7) -> None:
    rnd = random.Random(seed)
    end = end or date.today()
    if ws.root.exists():
        shutil.rmtree(ws.root)
    ws.init()
    ms = _months_back(end, months)
    in_range = lambda d: d <= end

    checking, card, card2, savings = [], [], [], []   # (date, desc, amount[, category])
    brokerage_act = []                                 # (date, action, symbol, desc, qty, price, amount)
    add = lambda lst, d, desc, amt, *extra: lst.append((d, desc, round(amt, 2), *extra)) if in_range(d) else None

    # ----- income, bills, transfers (checking) -----
    for i, ym in enumerate(ms):
        pay = 3850 if i < 12 else 4120
        add(checking, _d(ym, 1), "ACME ROBOTICS PAYROLL PPD ID: 9100000001", pay)
        add(checking, _d(ym, 15), "ACME ROBOTICS PAYROLL PPD ID: 9100000001", pay)
        add(checking, _d(ym, 1), "AVALON APARTMENTS RENT WEB PMTS", -2450)
        m = int(ym[5:7])
        add(checking, _d(ym, 6), "PGANDE WEB ONLINE PG&E", -(95 + 70 * (m in (12, 1, 2)) + 45 * (m in (7, 8)) + rnd.uniform(-12, 12)))
        add(checking, _d(ym, 12), "COMCAST XFINITY 800-266-2278", -79.99)
        add(checking, _d(ym, 20), "T-MOBILE AUTO PAY", -65 if i < 18 else -70)
        add(checking, _d(ym, 10), "NAVIENT STUDENT LOAN PMT", -350)
        add(checking, _d(ym, 2), "ONLINE TRANSFER TO SAV XXXXXX4821", -600)
        add(savings, _d(ym, 2), "ONLINE TRANSFER FROM CHK XXXXXX1937", 600)
        add(checking, _d(ym, 16), "VANGUARD BUY INVESTMENT EFT", -1000)
        if i >= months - 4:  # a Roth IRA opened recently: funded from checking, no statement downloaded yet
            add(checking, _d(ym, 20), "EXAMPLE INVEST MONEYLINE IRA CONTRIB", -500)
        if rnd.random() < 0.7:
            add(checking, _d(ym, rnd.randint(3, 27)), "ATM WITHDRAWAL 004521 MAIN ST", -rnd.choice([60, 80, 100, 200]))
        if rnd.random() < 0.5:
            add(checking, _d(ym, rnd.randint(3, 27)), "ZELLE TO DANA R", -rnd.choice([25, 40, 60, 120]))
        if rnd.random() < 0.3:
            add(checking, _d(ym, rnd.randint(3, 27)), "VENMO CASHOUT", rnd.choice([30, 45, 80]))
        if m == 4 and i > 0:
            add(checking, _d(ym, 18), "IRS TREAS 310 TAX REF", 1240)

    # ----- card 1: everyday spending (CSV, purchases positive) -----
    groceries = ["SAFEWAY #1234 OAKLAND CA", "TRADER JOE'S #071 OAKLAND CA", "WHOLEFDS OAK 10234"]
    dining = ["CHIPOTLE 2231 OAKLAND CA", "TST* SOBA ICHI OAKLAND CA", "SQ *BLUE BOTTLE COFFEE OAKLAND CA", "DOORDASH*THAI HOUSE",
              "SWEETGREEN OAKLAND", "STARBUCKS STORE 08812", "TST* FIRE PIZZA EMERYVILLE CA", "SQ *TACOS EL GORDO"]
    shopping = ["AMAZON MKTPL*2K4L81 AMZN.COM/BILL WA", "TARGET 00012345 EMERYVILLE CA", "REI #43 BERKELEY CA", "UNIQLO SF UNION SQ"]
    for i, ym in enumerate(ms):
        for wk in range(4):
            add(card, _d(ym, 3 + wk * 7), rnd.choice(groceries), rnd.uniform(55, 140), "Groceries")
        for _ in range(rnd.randint(7, 11)):
            add(card, _d(ym, rnd.randint(1, 28)), rnd.choice(dining), rnd.uniform(6, 48), "Restaurant")
        for _ in range(rnd.randint(2, 5)):
            add(card, _d(ym, rnd.randint(1, 28)), rnd.choice(shopping), rnd.uniform(18, 95), "Merchandise")
        for _ in range(rnd.randint(2, 4)):
            add(card, _d(ym, rnd.randint(1, 28)), "UBER *TRIP HELP.UBER.COM CA", rnd.uniform(11, 32), "Transportation")
        add(card, _d(ym, rnd.randint(1, 28)), "SHELL OIL 57444 OAKLAND CA", rnd.uniform(40, 62), "Gas")
        add(card, _d(ym, 8), "NETFLIX.COM 866-579-7172 CA", 15.49 if i < months - 3 else 17.99, "Entertainment")
        add(card, _d(ym, 14), "SPOTIFY USA 877-778-1161", 11.99, "Entertainment")
        add(card, _d(ym, 21), "APPLE.COM/BILL ICLOUD 866-712-7753", 2.99, "Merchandise")
        add(card, _d(ym, 17), "CVS/PHARMACY #09123 OAKLAND CA", rnd.uniform(12, 45), "Health Care")
        if i >= months - 3:
            add(card, _d(ym, 5), "EQUINOX OAKLAND 0001", 245, "Health Care")  # a new membership
        if rnd.random() < 0.25:
            add(card, _d(ym, rnd.randint(1, 28)), "BLUE HERON SUPPLY CO", rnd.uniform(30, 90), None)
        if int(ym[5:7]) in (3, 8):
            add(card, _d(ym, 9), "DELTA AIR LINES 0062345 DELTA.COM", rnd.uniform(320, 560), "Airfare")
            add(card, _d(ym, 22), "MARRIOTT PORTLAND DOWNTOWN", rnd.uniform(380, 700), "Lodging")
        if int(ym[5:7]) == 12:
            add(card, _d(ym, 10), "AMERICAN RED CROSS DONATION", 150, None)
            add(card, _d(ym, 12), "WIKIMEDIA FOUNDATION", 50, None)
        if i == months - 5:
            add(card, _d(ym, 19), "FOREIGN TRANSACTION FEE", 4.12, "Fees & Adjustments")
    # One unusual charge and one duplicate in the last month.
    last_m = ms[-1]
    add(card, _d(last_m, min(end.day, 6)), "AMAZON MKTPL*7Q2M00 AMZN.COM/BILL WA", 892.40, "Merchandise")
    add(card, _d(last_m, min(end.day, 4)), "CHIPOTLE 2231 OAKLAND CA", 14.85, "Restaurant")
    add(card, _d(last_m, min(end.day, 4)), "CHIPOTLE 2231 OAKLAND CA", 14.85, "Restaurant")
    # Autopay: on the 25th, pay the previous month's charges in full.
    for i, ym in enumerate(ms[1:], 1):
        prev = ms[i - 1]
        due = round(sum(a for d, _, a, *_ in card if d.isoformat()[:7] == prev and a > 0), 2)
        add(card, _d(ym, 25), "AUTOPAY PAYMENT RECEIVED - THANK YOU", -due, None)
        add(checking, _d(ym, 25), "CHASE CREDIT CRD AUTOPAY PPD ID: 4760039224", -due)
    card_balance = -round(sum(a for _, _, a, *_ in card), 2)  # purchases positive in this export

    # ----- card 2: PDF statements, last 8 months -----
    pdf_months = ms[-9:-1]
    stores = [("COSTCO WHSE #0123 RICHMOND CA", 90, 260), ("HOME DEPOT #0632 EMERYVILLE", 25, 180),
              ("TARGET 00012345 EMERYVILLE CA", 20, 90), ("PETCO 1234 OAKLAND CA", 20, 70)]
    statements = []
    prev_bal = 0.0
    for ym in pdf_months:
        rows = []
        if prev_bal > 0:
            rows.append((_d(ym, 18), "ONLINE PAYMENT THANK YOU", round(prev_bal, 2), "pay"))
            add(checking, _d(ym, 18), "CITI CARD ONLINE PAYMENT", -round(prev_bal, 2))
        for _ in range(rnd.randint(4, 8)):
            s, lo, hi = rnd.choice(stores)
            rows.append((_d(ym, rnd.randint(1, 27)), s, round(rnd.uniform(lo, hi), 2), "buy"))
        rows.sort()
        purchases = sum(a for *_, a, k in rows if k == "buy")
        pays = sum(a for *_, a, k in rows if k == "pay")
        new_bal = round(prev_bal - pays + purchases, 2)
        statements.append((ym, prev_bal, rows, new_bal))
        for d, desc, a, k in rows:
            card2.append((d, desc, a if k == "pay" else -a))
        prev_bal = new_bal

    # ----- savings interest (OFX) -----
    bal = 15000.0
    sav_rows = []
    for ym in ms:
        for d, desc, a in sorted(x for x in savings if x[0].isoformat()[:7] == ym):
            bal += a
            sav_rows.append((d, desc, a))
        intr = round(bal * 0.04 / 12, 2)
        if in_range(_d(ym, 28)):
            bal += intr
            sav_rows.append((_d(ym, 28), "INTEREST PAID", intr))

    # ----- brokerage: monthly positions + activity -----
    syms = {"VTI": (220.0, 0.008, 0.04), "VXUS": (58.0, 0.005, 0.045), "BND": (72.0, 0.002, 0.012), "NVDA": (95.0, 0.02, 0.10)}
    prices = {s: p for s, (p, _, _) in syms.items()}
    shares = {"VTI": 110.0, "VXUS": 160.0, "BND": 90.0, "NVDA": 25.0}
    cash = 350.0
    snapshots = []
    split = {"VTI": 0.6, "VXUS": 0.25, "BND": 0.15}
    for i, ym in enumerate(ms):
        if i:
            for s, (_, mu, sig) in syms.items():
                prices[s] = round(prices[s] * (1 + rnd.gauss(mu, sig)), 2)
        d = _d(ym, 16)
        if in_range(d):
            brokerage_act.append((d, "ELECTRONIC FUNDS TRANSFER RECEIVED", "", "CASH", "", "", 1000.0))
            cash += 1000
            for s, w in split.items():
                q = round(1000 * w / prices[s], 3)
                cash -= q * prices[s]
                brokerage_act.append((d, f"YOU BOUGHT", s, f"{s} ETF", q, prices[s], -round(q * prices[s], 2)))
                shares[s] += q
        if int(ym[5:7]) in (3, 6, 9, 12) and in_range(_d(ym, 28)):
            for s, y in (("VTI", 0.0035), ("VXUS", 0.007), ("BND", 0.009)):
                dv = round(shares[s] * prices[s] * y, 2)
                cash += dv
                brokerage_act.append((_d(ym, 28), "DIVIDEND RECEIVED", s, f"{s} ETF", "", "", dv))
        if i % 6 == 5 and in_range(_d(ym, 28)):
            brokerage_act.append((_d(ym, 28), "ADVISORY FEE", "", "CASH", "", "", -9.95))
            cash -= 9.95
        snap_d = min(date.fromisoformat(month_end(ym)), end)
        snapshots.append((snap_d, {s: (shares[s], prices[s]) for s in shares}, round(cash, 2)))

    # ----- write files -----
    acc = {
        "everyday-checking": {"name": "Everyday Checking", "institution": "Example Bank (Wells Fargo-style CSV)", "type": "checking"},
        "high-yield-savings": {"name": "High-Yield Savings", "institution": "Example Online Bank", "type": "savings"},
        "rewards-card": {"name": "Rewards Card", "institution": "Example Card Co (Amex-style CSV)", "type": "credit", "apr": 26.99},
        "store-card": {"name": "Cashback Card", "institution": "Example Card Co", "type": "credit", "apr": 21.49, "min_payment": 35},
        "taxable-brokerage": {"name": "Taxable Brokerage", "institution": "Example Brokerage", "type": "brokerage", "tax": "taxable"},
        "roth-ira": {"name": "Roth IRA (no statement yet)", "institution": "Example Brokerage", "type": "retirement", "tax": "roth",
                     "funded_by": "EXAMPLE INVEST MONEYLINE"},
    }
    (ws.config_dir / "accounts.yaml").write_text(yaml.safe_dump({"accounts": acc}, sort_keys=False))
    for k in acc:
        (ws.inbox / k).mkdir(parents=True, exist_ok=True)

    # Checking: quarterly exports in Wells Fargo's headerless CSV format (date, amount, *, check #, description).
    checking.sort(key=lambda r: (r[0], -r[2]))
    run = 6200.0
    for d, desc, a in checking:
        run = round(run + a, 2)
    checking_balance = run
    for q in range(0, len(ms), 3):
        qm = set(ms[q:q + 3])
        part = [r for r in checking if r[0].isoformat()[:7] in qm][::-1]
        with open(ws.inbox / "everyday-checking" / f"Checking_{ms[q]}.csv", "w", newline="") as f:
            w = csv.writer(f, quoting=csv.QUOTE_ALL)
            for d, desc, a in part:
                w.writerow([d.strftime("%m/%d/%Y"), f"{a:.2f}", "*", "", desc])

    # Rewards card: two overlapping exports (tests dedupe) in American Express's CSV layout:
    # purchases positive, payments negative, "Group-Subcategory" categories.
    amex_cat = {"Groceries": "Merchandise & Supplies-Groceries", "Restaurant": "Restaurant-Restaurant",
                "Merchandise": "Merchandise & Supplies-General Retail", "Transportation": "Transportation-Taxis & Coach",
                "Gas": "Transportation-Fuel", "Entertainment": "Entertainment-General Events",
                "Health Care": "Business Services-Health Care Services", "Airfare": "Travel-Airline", "Lodging": "Travel-Lodging",
                "Fees & Adjustments": "Fees & Adjustments-Fees & Adjustments"}
    card.sort(key=lambda r: r[0])
    halves = [ms[:14], ms[11:]]
    for n, part_ms in enumerate(halves):
        with open(ws.inbox / "rewards-card" / f"activity_{n + 1}.csv", "w", newline="") as f:
            w = csv.writer(f)
            w.writerow(["Date", "Description", "Card Member", "Account #", "Amount", "Extended Details", "Appears On Your Statement As",
                        "Address", "City/State", "Zip Code", "Country", "Reference", "Category"])
            for k, (d, desc, a, cat) in enumerate(card):
                if d.isoformat()[:7] in part_ms:
                    w.writerow([d.strftime("%m/%d/%Y"), desc, "A CARDMEMBER", "-91000", f"{a:.2f}", "", desc, "", "", "", "UNITED STATES",
                                f"'3200{k:07d}'", amex_cat.get(cat, "") if cat else ""])

    # Store card: PDF statements.
    _write_pdfs(ws.inbox / "store-card", statements)

    # Savings: one OFX file.
    _write_ofx(ws.inbox / "high-yield-savings" / "savings.ofx", sav_rows, round(bal, 2), min(end, date.fromisoformat(month_end(ms[-1]))))

    # Brokerage: monthly positions snapshots and one activity export.
    names = {"VTI": "VANGUARD TOTAL STOCK MARKET ETF", "VXUS": "VANGUARD TOTAL INTL STOCK ETF", "BND": "VANGUARD TOTAL BOND MARKET ETF", "NVDA": "NVIDIA CORP"}
    for d, pos, c in snapshots:
        with open(ws.inbox / "taxable-brokerage" / f"positions_{d.isoformat()}.csv", "w", newline="") as f:
            w = csv.writer(f)
            w.writerow(["Account Number", "Account Name", "Symbol", "Description", "Quantity", "Last Price", "Current Value", "Cost Basis Total"])
            w.writerow(["X00000001", "Individual", "SPAXX**", "HELD IN MONEY MARKET", "", "", f"${c:,.2f}", ""])
            for s, (q, p) in pos.items():
                w.writerow(["X00000001", "Individual", s, names[s], f"{q:.3f}", f"${p:.2f}", f"${q * p:,.2f}", f"${q * syms[s][0] * 0.95:,.2f}"])
            w.writerow([])
            w.writerow(["Date downloaded " + d.strftime("%b-%d-%Y")])
    with open(ws.inbox / "taxable-brokerage" / "activity.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["Run Date", "Action", "Symbol", "Description", "Quantity", "Price", "Amount"])
        for d, act, s, desc, q, p, a in sorted(brokerage_act, key=lambda r: r[0], reverse=True):
            w.writerow([d.strftime("%m/%d/%Y"), act, s, desc, q, p, f"{a:.2f}"])

    # Manual accounts and anchors.
    k401 = {}
    contrib = {}
    v = 52000.0
    for i, ym in enumerate(ms):
        d = min(date.fromisoformat(month_end(ym)), end).isoformat()
        if i:
            contrib[d] = 1250.0
            v = v * (1 + rnd.gauss(0.007, 0.035)) + 1250
        k401[d] = round(v, 2)
    loan, car = {}, {}
    bal_loan, bal_car = 18400.0, 21000.0
    for ym in ms:
        d = min(date.fromisoformat(month_end(ym)), end).isoformat()
        bal_loan = bal_loan * (1 + 0.055 / 12) - 350
        bal_car *= 0.988
        loan[d], car[d] = -round(bal_loan, 2), round(bal_car, -1)
    manual = {
        "work-401k": {"name": "Employer 401(k)", "type": "retirement", "tax": "traditional", "values": k401, "contributions": contrib,
                      "holdings": {max(k401): {"FXAIX": round(v * 0.7, 2), "FTIHX": round(v * 0.2, 2), "FXNAX": round(v * 0.1, 2)}}},
        "student-loan": {"name": "Student Loan", "type": "loan", "apr": 5.5, "min_payment": 350, "values": loan},
        "car": {"name": "Car (estimate)", "type": "asset", "values": car},
    }
    anchors = {"rewards-card": {end.isoformat(): card_balance}, "everyday-checking": {end.isoformat(): checking_balance}}
    (ws.config_dir / "balances.yaml").write_text(
        "# Demo data: manual accounts, and anchor balances for the checking and card exports (they have no balance column).\n"
        + yaml.safe_dump({"manual": manual, "anchors": anchors}, sort_keys=False))
    (ws.config_dir / "rules.yaml").write_text(yaml.safe_dump({"rules": [
        {"match": "NAVIENT", "category": "Debt Payment", "merchant": "Navient (student loan)"},
        {"match": "ACME ROBOTICS PAYROLL", "category": "Income:Salary", "merchant": "Acme Robotics (salary)"},
    ], "source_categories": {}}, sort_keys=False))
    (ws.config_dir / "settings.yaml").write_text(yaml.safe_dump({"dashboard_title": "Demo Finances (fake data)"}))


def _write_ofx(path: Path, rows, ledger: float, as_of: date):
    out = ["OFXHEADER:100", "DATA:OFXSGML", "VERSION:102", "", "<OFX>", "<BANKMSGSRSV1><STMTTRNRS><STMTRS>", "<CURDEF>USD",
           "<BANKACCTFROM><BANKID>000000000<ACCTID>0000004821<ACCTTYPE>SAVINGS</BANKACCTFROM>", "<BANKTRANLIST>"]
    for i, (d, desc, a) in enumerate(rows):
        out.append(f"<STMTTRN><TRNTYPE>{'CREDIT' if a > 0 else 'DEBIT'}<DTPOSTED>{d.strftime('%Y%m%d')}120000<TRNAMT>{a:.2f}"
                   f"<FITID>{i:06d}<NAME>{desc}</STMTTRN>")
    out += ["</BANKTRANLIST>", f"<LEDGERBAL><BALAMT>{ledger:.2f}<DTASOF>{as_of.strftime('%Y%m%d')}</LEDGERBAL>",
            "</STMTRS></STMTTRNRS></BANKMSGSRSV1>", "</OFX>"]
    path.write_text("\n".join(out))


def _write_pdfs(folder: Path, statements):
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.pdfgen import canvas
    except ImportError:
        return  # reportlab is only needed to fake PDF statements for the demo
    for ym, opening, rows, closing in statements:
        start, end = date.fromisoformat(ym + "-01"), date.fromisoformat(month_end(ym))
        c = canvas.Canvas(str(folder / f"statement_{ym}.pdf"), pagesize=letter)
        y = 740

        def line(text, x=50, size=10, bold=False):
            nonlocal y
            c.setFont("Helvetica-Bold" if bold else "Helvetica", size)
            c.drawString(x, y, text)
            y -= 16

        line("EXAMPLE CARD CO - CASHBACK CARD", size=13, bold=True)
        line(f"Statement Period {start.strftime('%m/%d/%Y')} - {end.strftime('%m/%d/%Y')}")
        line("Account ending in 0000")
        y -= 8
        pays = sum(a for *_, a, k in rows if k == "pay")
        buys = sum(a for *_, a, k in rows if k == "buy")
        line("Account Summary", bold=True)
        line(f"Previous Balance ${opening:,.2f}")
        line(f"Payments and Credits -${pays:,.2f}")
        line(f"Purchases +${buys:,.2f}")
        line(f"New Balance ${closing:,.2f}")
        y -= 8
        line("Payments and Credits", bold=True)
        for d, desc, a, k in rows:
            if k == "pay":
                line(f"{d.strftime('%m/%d')}  {desc}  -${a:,.2f}")
        line("Purchases", bold=True)
        for d, desc, a, k in rows:
            if k == "buy":
                line(f"{d.strftime('%m/%d')}  {desc}  ${a:,.2f}")
        line(f"Total Purchases ${buys:,.2f}")
        c.showPage()
        c.save()
