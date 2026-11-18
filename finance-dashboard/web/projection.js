/* Projection engine: extrapolates income, spending, savings and returns month by month.
   Pure functions, no DOM, so they also run under Node for the tests (tests/test_projection.py). */
(function (root) {
  'use strict';

  /**
   * p: {
   *   years, cash, taxable, retirement, other,              starting balances
   *   loans: [{name, balance, apr (%), payment}],            amortizing debts (payments are part of spending)
   *   income, spending,                                      per month, today
   *   incomeGrowth, spendingGrowth,                          per year, as decimals (0.03 = 3%)
   *   investShare,                                           share of monthly savings that gets invested (rest stays cash)
   *   retireContrib,                                         401k etc. per month, grows with income
   *   extraSavings, spendingChange,                          per month what-ifs
   *   invReturn, cashYield, otherGrowth,                     per year, decimals
   *   stopAfter,                                             stop working after this many years (null = never)
   *   freeDebtPayments,                                      once a loan is paid off, its payment becomes savings
   * }
   * annualReturns: optional per-year investment returns (Monte Carlo); default p.invReturn every year.
   * Returns one row per year (row 0 = today), nominal dollars.
   */
  function project(p, annualReturns) {
    let cash = p.cash, taxable = p.taxable, retirement = p.retirement, other = p.other;
    let principal = p.taxable + p.retirement; // money put into investments (starting balance counts)
    const loans = (p.loans || []).map((l) => ({ ...l, bal: l.balance }));
    let freed = 0, depleted = null;
    const rows = [snap(0, 0, 0, 0, 0)];
    let yi = 0, ys = 0, yc = 0, yInt = 0;
    const cashF = Math.pow(1 + p.cashYield, 1 / 12), otherF = Math.pow(1 + p.otherGrowth, 1 / 12);

    for (let m = 0; m < p.years * 12; m++) {
      const year = Math.floor(m / 12);
      const R = annualReturns ? annualReturns[year] : p.invReturn;
      const invF = Math.pow(1 + R, 1 / 12);
      const g = (rate) => Math.pow(1 + rate, m / 12);
      const working = p.stopAfter == null || p.stopAfter === '' || year < p.stopAfter;

      // growth on what is already there
      taxable *= invF; retirement *= invF; other *= otherF;
      if (cash > 0) cash *= cashF;

      // loans: interest accrues, scheduled payment (already counted inside spending) pays it down.
      // A payment is freed from the month after the final one.
      const freedNow = freed;
      let debtInterest = 0;
      for (const l of loans) {
        if (l.bal <= 0) continue;
        const i = l.bal * l.apr / 1200;
        debtInterest += i;
        const pay = Math.min(l.bal + i, l.payment);
        l.bal += i - pay;
        if (l.bal <= 0.005) { l.bal = 0; if (p.freeDebtPayments) freed += l.payment; }
      }

      const income = working ? p.income * g(p.incomeGrowth) : 0;
      const spending = Math.max(0, (p.spending + p.spendingChange) * g(p.spendingGrowth) - freedNow);
      const contrib = working ? p.retireContrib * g(p.incomeGrowth) : 0;
      const saved = income - spending + (working ? p.extraSavings : 0);

      if (saved >= 0) {
        taxable += saved * p.investShare; principal += saved * p.investShare; cash += saved * (1 - p.investShare);
      } else {
        // Spending more than income: draw from cash, then taxable, then retirement accounts.
        let need = -saved;
        const fromCash = Math.min(Math.max(cash, 0), need); cash -= fromCash; need -= fromCash;
        for (const which of ['taxable', 'retirement']) {
          if (need <= 0) break;
          const have = which === 'taxable' ? taxable : retirement;
          const take = Math.min(have, need);
          const invested = taxable + retirement;
          if (invested > 0) principal *= 1 - take / invested;
          if (which === 'taxable') taxable -= take; else retirement -= take;
          need -= take;
        }
        if (need > 0.01) { cash -= need; if (depleted == null) depleted = year; }
      }
      retirement += contrib; principal += contrib;
      yi += income; ys += spending; yc += contrib; yInt += debtInterest;

      if ((m + 1) % 12 === 0) { rows.push(snap(year + 1, yi, ys, yc, yInt)); yi = ys = yc = yInt = 0; }
    }
    rows.depleted = depleted;
    return rows;

    function snap(y, income, spending, contrib, interest) {
      const debt = loans.reduce((s, l) => s + l.bal, 0);
      const invested = taxable + retirement;
      return {
        year: y, cash, taxable, retirement, other, debt, invested, principal,
        growth: invested - principal, investable: cash + invested, netWorth: cash + invested + other - debt,
        income, spending, contrib, saved: income - spending, debtInterest: interest,
        annualSpending: Math.max(0, (p.spending + p.spendingChange) * Math.pow(1 + p.spendingGrowth, y) - freed) * 12,
      };
    }
  }

  // Deterministic, seeded random numbers so the chart doesn't jitter between renders.
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** Many projections with random yearly returns (lognormal, mean p.invReturn, sd vol). */
  function monteCarlo(p, vol, n = 500, seed = 42) {
    const rnd = mulberry32(seed);
    const normal = () => { let u = 0, v = 0; while (u === 0) u = rnd(); while (v === 0) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
    const mu = p.invReturn, s2 = Math.log(1 + (vol * vol) / ((1 + mu) * (1 + mu)));
    const m = Math.log(1 + mu) - s2 / 2, s = Math.sqrt(s2);
    const Y = p.years + 1;
    const nw = Array.from({ length: Y }, () => []), inv = Array.from({ length: Y }, () => []);
    let lasted = 0;
    const base = project(p);
    const fiHits = Array(Y).fill(0);
    for (let k = 0; k < n; k++) {
      const rs = Array.from({ length: p.years }, () => Math.exp(m + s * normal()) - 1);
      const rows = project(p, rs);
      if (rows.depleted == null) lasted++;
      let hit = false;
      rows.forEach((r, i) => {
        nw[i].push(r.netWorth); inv[i].push(r.investable);
        if (!hit && r.investable >= r.annualSpending * (p.fiMultiple || 25) && r.annualSpending > 0) hit = true;
        if (hit) fiHits[i]++;
      });
    }
    const q = (arr, f) => { const a = arr.slice().sort((x, y) => x - y); const i = (a.length - 1) * f, lo = Math.floor(i); return a[lo] + (a[Math.ceil(i)] - a[lo]) * (i - lo); };
    return {
      years: base.map((r) => r.year),
      p10: nw.map((a) => q(a, 0.1)), p50: nw.map((a) => q(a, 0.5)), p90: nw.map((a) => q(a, 0.9)),
      inv10: inv.map((a) => q(a, 0.1)), inv50: inv.map((a) => q(a, 0.5)), inv90: inv.map((a) => q(a, 0.9)),
      fiChance: fiHits.map((h) => h / n), lastedChance: lasted / n, n,
    };
  }

  /** First year index where investable assets cover `multiple` years of that year's spending. */
  function fiYear(rows, multiple) {
    const r = rows.find((x) => x.annualSpending > 0 && x.investable >= x.annualSpending * multiple);
    return r ? r.year : null;
  }

  const api = { project, monteCarlo, fiYear };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.FinProjection = api;
})(typeof window !== 'undefined' ? window : globalThis);
