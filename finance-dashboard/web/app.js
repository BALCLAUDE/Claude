/* Personal finance dashboard. All data is in window.FIN, written by `python -m finance build`. */
(function () {
  'use strict';
  const F = window.FIN;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const INVEST = new Set(['brokerage', 'retirement']);
  const ACCTS = F.accounts;
  const MONTHS = F.networth.months;

  // ---------- formatting ----------
  const fmt0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const fmt2 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const money = (v, cents) => (v == null || isNaN(v) ? '–' : (cents ? fmt2 : fmt0).format(v));
  const short = (v) => {
    if (v == null) return '–';
    const a = Math.abs(v), s = v < 0 ? '-' : '';
    if (a >= 1e6) return s + '$' + (a / 1e6).toFixed(a >= 1e7 ? 1 : 2) + 'M';
    if (a >= 1e4) return s + '$' + Math.round(a / 1e3) + 'k';
    if (a >= 1e3) return s + '$' + (a / 1e3).toFixed(1) + 'k';
    return s + '$' + Math.round(a);
  };
  const pct = (v, d = 1) => (v == null || isNaN(v) ? '–' : (v * 100).toFixed(d) + '%');
  const signed = (v, f = money) => (v == null ? '–' : (v > 0 ? '+' : v < 0 ? '−' : '') + f(Math.abs(v)));
  const mlabel = (ym) => { const [y, m] = ym.split('-'); return new Date(+y, +m - 1, 1).toLocaleString('en-US', { month: 'short', year: '2-digit' }); };
  const mlong = (ym) => { const [y, m] = ym.split('-'); return new Date(+y, +m - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' }); };
  const isIncome = (c) => c.startsWith('Income');
  // Investment accounts valued from deposits before their first statement (see funded_by in accounts.yaml).
  const EST = F.networth.estimated_until || {};
  const acctName = (id) => (F.accounts.find((a) => a.id === id) || { name: id }).name;
  const estimatedIn = (ym) => Object.entries(EST).filter(([, until]) => until == null || ym < until.slice(0, 7)).map(([id]) => acctName(id));
  const estText = (id) => EST[id] === null ? 'estimated from deposits (no statement yet)' : `estimated from deposits before ${EST[id]}`;

  // ---------- theme tokens ----------
  const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const SERIES = () => [1, 2, 3, 4, 5, 6, 7, 8].map((i) => css('--s' + i));

  // Category colours follow the category, never its rank in the current filter: the 7 biggest
  // categories over all data get slots 1-7, everything else is "Other".
  const CAT_TOTALS = {};
  for (const m of F.summary) for (const [c, v] of Object.entries(m.by_category)) CAT_TOTALS[c] = (CAT_TOTALS[c] || 0) + v;
  const TOP_CATS = Object.entries(CAT_TOTALS).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([c]) => c);
  const catColor = (c) => { const i = TOP_CATS.indexOf(c); return i >= 0 ? SERIES()[i] : css('--other'); };

  // ---------- state ----------
  const state = { from: null, to: null, accounts: new Set(ACCTS.filter((a) => !INVEST.has(a.type)).map((a, i) => a.id)), tab: 'overview', tx: { q: '', cat: '', transfers: false, sort: [0, -1], limit: 200 } };
  const ACCT_IDX = ACCTS.map((a) => a.id);
  try { const t = localStorage.getItem('fin-theme'); if (t) document.documentElement.dataset.theme = t; } catch (e) {}

  // ---------- data from transactions (respects filters) ----------
  function txnsInRange(includeAll) {
    return F.txns.filter((t) => t[0].slice(0, 7) >= state.from && t[0].slice(0, 7) <= state.to && (includeAll || state.accounts.has(ACCT_IDX[t[1]])));
  }
  function monthly(rows) {
    const out = {};
    for (const m of MONTHS) if (m >= state.from && m <= state.to) out[m] = { income: 0, spending: 0, invested: 0, cats: {} };
    for (const t of rows) {
      const a = ACCTS[t[1]]; if (INVEST.has(a.type)) continue;
      const m = out[t[0].slice(0, 7)]; if (!m) continue;
      const cat = t[4] || 'Uncategorized';
      if (cat === 'Investments') m.invested -= t[2];
      else if (cat === 'Transfer' || t[6]) continue;
      else if (isIncome(cat)) m.income += t[2];
      else { m.spending -= t[2]; m.cats[cat] = (m.cats[cat] || 0) - t[2]; }
    }
    return out;
  }
  const isSpend = (t) => !INVEST.has(ACCTS[t[1]].type) && !t[6] && t[4] !== 'Transfer' && t[4] !== 'Investments' && !isIncome(t[4]);

  // ---------- charts ----------
  const charts = {};
  function chart(id, cfg) {
    if (charts[id]) charts[id].destroy();
    const ink2 = css('--ink-2'), grid = css('--grid'), axis = css('--axis'), muted = css('--muted');
    Chart.defaults.font.family = 'system-ui, -apple-system, "Segoe UI", sans-serif';
    Chart.defaults.color = ink2;
    const base = {
      responsive: true, maintainAspectRatio: false, animation: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top', align: 'end', labels: { boxWidth: 10, boxHeight: 10, useBorderRadius: true, borderRadius: 3, color: ink2 } },
        tooltip: { backgroundColor: css('--surface'), titleColor: css('--ink'), bodyColor: css('--ink'), borderColor: css('--border'), borderWidth: 1, padding: 10,
          callbacks: { label: (c) => ` ${c.dataset.label}: ${c.parsed.y == null ? '–' : (cfg._fmt || money)(c.parsed.y)}` } },
      },
      scales: {
        x: { grid: { display: false }, border: { color: axis }, ticks: { color: muted, maxRotation: 0, autoSkipPadding: 12 } },
        y: { grid: { color: grid }, border: { display: false }, ticks: { color: muted, callback: (v) => (cfg._tick || short)(v) } },
      },
    };
    cfg.options = deepMerge(base, cfg.options || {});
    charts[id] = new Chart(document.getElementById(id), cfg);
  }
  function deepMerge(a, b) {
    for (const k of Object.keys(b)) {
      if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]) && a[k] && typeof a[k] === 'object') deepMerge(a[k], b[k]);
      else a[k] = b[k];
    }
    return a;
  }
  const barDs = (label, data, color, extra = {}) => ({ label, data, backgroundColor: color, borderRadius: 4, borderSkipped: 'start', maxBarThickness: 28, ...extra });

  // ---------- small HTML builders ----------
  const tile = (lbl, val, sub, cls = '') => `<div class="tile"><div class="lbl">${esc(lbl)}</div><div class="val ${cls}">${val}</div>${sub ? `<div class="sub">${sub}</div>` : ''}</div>`;
  function table(cols, rows, opts = {}) {
    if (!rows.length) return `<div class="empty">${opts.empty || 'Nothing to show.'}</div>`;
    return `<div class="tablewrap"><table class="tbl"><thead><tr>${cols.map((c) => `<th class="${c.num ? 'num' : ''}">${esc(c.h)}</th>`).join('')}</tr></thead><tbody>${
      rows.map((r, i) => `<tr ${opts.click ? `class="click" data-i="${i}"` : ''}>${cols.map((c) => `<td class="${c.num ? 'num' : ''}">${c.f(r)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  function bars(rows, opts = {}) {
    // rows: {name, value, text, color?, target?, pace?}
    if (!rows.length) return `<div class="empty">${opts.empty || 'Nothing to show.'}</div>`;
    const max = opts.max ?? Math.max(...rows.map((r) => Math.max(r.value, r.target || 0)), 1);
    return `<div class="bars">${rows.map((r, i) => `<div class="bar-row ${opts.click ? 'click' : ''}" data-i="${i}" title="${esc(r.title || '')}">
      <div class="name">${r.dot ? `<span class="dot" style="background:${r.dot}"></span>` : ''}${esc(r.name)}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.max(0, Math.min(100, (100 * r.value) / max))}%;${r.color ? `background:${r.color}` : ''}"></div>
        ${r.target != null ? `<div class="bar-target" style="left:${Math.min(100, (100 * r.target) / max)}%" title="target"></div>` : ''}
        ${r.pace != null ? `<div class="bar-pace" style="left:${Math.min(100, (100 * r.pace) / max)}%" title="pace"></div>` : ''}</div>
      <div class="v">${r.text}</div></div>`).join('')}</div>`;
  }
  const statusBadge = (s) => ({ ok: '<span class="status ok"><i>✓</i>On track</span>', at_risk: '<span class="status at_risk"><i>!</i>At risk</span>', over: '<span class="status over"><i>×</i>Over</span>' }[s] || '');

  // ---------- filters ----------
  function initFilters() {
    const opts = MONTHS.map((m) => `<option value="${m}">${mlabel(m)}</option>`).join('');
    $('#from').innerHTML = opts; $('#to').innerHTML = opts;
    setRange('12');
    $('#range').addEventListener('click', (e) => { const r = e.target.dataset.r; if (r) { setRange(r); render(); } });
    $('#from').addEventListener('change', (e) => { state.from = e.target.value; if (state.from > state.to) state.to = state.from; markRange(null); render(); });
    $('#to').addEventListener('change', (e) => { state.to = e.target.value; if (state.to < state.from) state.from = state.to; markRange(null); render(); });
    const groups = [['Cash & cards', (a) => !INVEST.has(a.type) && a.type !== 'asset' && a.type !== 'loan'], ['Loans & assets', (a) => a.type === 'asset' || a.type === 'loan'], ['Investments', (a) => INVEST.has(a.type)]];
    $('#acctlist').innerHTML = groups.map(([g, f]) => {
      const as = ACCTS.filter(f); if (!as.length) return '';
      return `<div class="grp">${g}</div>` + as.map((a) => `<label><input type="checkbox" value="${esc(a.id)}" ${state.accounts.has(a.id) ? 'checked' : ''}> ${esc(a.name)} <span class="muted small">${esc(a.type)}</span></label>`).join('');
    }).join('') + '<div class="muted small" style="padding:6px 4px 0">Filters cash flow, spending and transactions. Net worth and investments always include every account.</div>';
    $('#acctlist').addEventListener('change', (e) => { if (e.target.checked) state.accounts.add(e.target.value); else state.accounts.delete(e.target.value); render(); });
  }
  function setRange(r) {
    const last = MONTHS[MONTHS.length - 1];
    let i0 = 0;
    if (r === 'ytd') i0 = Math.max(0, MONTHS.indexOf(last.slice(0, 4) + '-01'));
    else if (r !== 'all') i0 = Math.max(0, MONTHS.length - +r);
    if (MONTHS.indexOf(last.slice(0, 4) + '-01') < 0 && r === 'ytd') i0 = 0;
    state.from = MONTHS[i0]; state.to = last; markRange(r);
  }
  function markRange(r) { $$('#range button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.r === r))); }
  function syncFilterUI() {
    $('#from').value = state.from; $('#to').value = state.to;
    const n = state.accounts.size, all = ACCTS.filter((a) => !INVEST.has(a.type)).length;
    $('#acctlabel').textContent = n === all ? 'All cash & cards' : `${n} selected`;
    const nMonths = MONTHS.filter((m) => m >= state.from && m <= state.to).length;
    const partial = state.to === F.meta.as_of.slice(0, 7) && F.meta.as_of.slice(8) !== lastDay(state.to);
    $('#filternote').textContent = `${nMonths} month${nMonths === 1 ? '' : 's'}` + (partial ? ` · ${mlabel(state.to)} is month-to-date` : '');
    $('#filters').hidden = !['overview', 'spending', 'transactions'].includes(state.tab);
  }
  const lastDay = (ym) => String(new Date(+ym.slice(0, 4), +ym.slice(5, 7), 0).getDate()).padStart(2, '0');

  // ---------- Overview ----------
  function renderOverview() {
    const rows = txnsInRange();
    const mo = monthly(rows);
    const ms = Object.keys(mo);
    const inc = ms.reduce((s, m) => s + mo[m].income, 0), sp = ms.reduce((s, m) => s + mo[m].spending, 0), inv = ms.reduce((s, m) => s + mo[m].invested, 0);
    const n = Math.max(ms.length, 1);
    const nw = F.networth, i1 = nw.months.indexOf(state.to), i0 = nw.months.indexOf(state.from);
    const nwEnd = nw.total[i1], nwStart = i0 > 0 ? nw.total[i0 - 1] : nw.total[i0];
    const nwPrev = i1 > 0 ? nw.total[i1 - 1] : null;
    const sr = inc > 0 ? (inc - sp) / inc : null;
    $('#kpis').innerHTML = [
      tile('Net worth', money(nwEnd), `${signed(nwEnd - nwPrev)} vs. last month · ${signed(nwEnd - nwStart)} in range`),
      tile('Income', money(inc), `${money(inc / n)} / month avg`),
      tile('Spending', money(sp), `${money(sp / n)} / month avg`),
      tile('Savings rate', pct(sr), sr == null ? '' : `${money(inc - sp)} kept`, sr != null && sr < 0 ? 'down' : ''),
      tile('Invested', money(inv), 'Moved into investment accounts'),
    ].join('');

    chart('c-cashflow', {
      type: 'bar',
      data: { labels: ms.map(mlabel), datasets: [barDs('Income', ms.map((m) => mo[m].income), css('--s1')), barDs('Spending', ms.map((m) => mo[m].spending), css('--s2'))] },
      options: { datasets: { bar: { categoryPercentage: 0.7, barPercentage: 0.9 } } },
    });

    const sl = nw.months.slice(i0, i1 + 1);
    const g = (k) => nw.by_group[k].slice(i0, i1 + 1);
    const areaDs = (label, data, color) => ({ label, data, fill: true, backgroundColor: color + '55', borderColor: color, borderWidth: 2, pointRadius: 0, tension: 0.2, stack: 's' });
    chart('c-networth', {
      type: 'line',
      data: { labels: sl.map(mlabel), datasets: [
        areaDs('Cash', g('Cash'), css('--s1')), areaDs('Investments', g('Investments'), css('--s3')), areaDs('Other assets', g('Other assets'), css('--s7')),
        areaDs('Debt', g('Debt'), css('--s8')),
        { label: 'Net worth', data: nw.total.slice(i0, i1 + 1), borderColor: css('--ink'), borderWidth: 2, pointRadius: 0, fill: false, tension: 0.2 },
      ] },
      options: { scales: { y: { stacked: true } }, plugins: { tooltip: { itemSort: (a, b) => b.datasetIndex - a.datasetIndex,
        callbacks: { footer: (items) => { const e = estimatedIn(sl[items[0].dataIndex]); return e.length ? `Estimated from deposits (no statement yet): ${e.join(', ')}` : ''; } } } } },
    });
    $('#nw-note').textContent = `${money(nwEnd)} at end of ${mlabel(state.to)}`;

    const cats = {};
    for (const m of ms) for (const [c, v] of Object.entries(mo[m].cats)) cats[c] = (cats[c] || 0) + v;
    const top = Object.entries(cats).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
    const shown = top.slice(0, 10);
    $('#ov-cats').innerHTML = bars(shown.map(([c, v]) => ({ name: c, value: v, dot: catColor(c), text: `${money(v)} <span class="muted">· ${pct(v / sp, 0)}</span>` })), { click: true, empty: 'No spending in this range.' });
    $$('#ov-cats .bar-row').forEach((el) => el.addEventListener('click', () => goTx(shown[+el.dataset.i][0])));

    const icons = { unusual: '⚠️', duplicate: '⧉', new_recurring: '🆕', price_increase: '↑', fee: '$' };
    const al = F.alerts.slice(0, 8);
    $('#ov-alerts').innerHTML = al.length ? al.map((a) => `<li><span class="ic" aria-hidden="true">${icons[a.kind] || '•'}</span><span>${esc(a.text)}</span><span class="muted small">${esc(a.date)}</span></li>`).join('')
      : '<li><span></span><span class="muted">Nothing unusual. No odd charges, duplicates, new subscriptions or fees.</span><span></span></li>';
    renderReportCard();
  }
  function renderReportCard() {
    const sel = $('#rc-month');
    if (!sel.options.length) {
      sel.innerHTML = F.report_cards.slice().reverse().map((r) => `<option value="${r.month}">${mlong(r.month)}</option>`).join('');
      const complete = F.report_cards.filter((r) => r.month < F.meta.as_of.slice(0, 7));
      if (complete.length) sel.value = complete[complete.length - 1].month;
      sel.addEventListener('change', renderReportCard);
    }
    const r = F.report_cards.find((x) => x.month === sel.value);
    if (!r) { $('#reportcard').innerHTML = '<div class="empty">No data.</div>'; return; }
    const ch = r.changes.filter((c) => Math.abs(c.diff) >= 25);
    $('#reportcard').innerHTML = `<div class="rc">
      <div><div class="lbl">Income</div><div class="val">${money(r.income)}</div></div>
      <div><div class="lbl">Spending</div><div class="val">${money(r.spending)}</div></div>
      <div><div class="lbl">Savings rate</div><div class="val">${pct(r.savings_rate)}</div></div>
      <div><div class="lbl">Invested</div><div class="val">${money(r.invested)}</div></div>
      <div><div class="lbl">Net worth change</div><div class="val ${r.net_worth_change < 0 ? 'down' : ''}">${signed(r.net_worth_change)}</div></div></div>
      ${ch.length ? `<div class="small muted" style="margin-bottom:4px">Biggest changes vs. the prior 6-month average</div>` + table(
        [{ h: 'Category', f: (c) => esc(c.category) }, { h: 'This month', num: 1, f: (c) => money(c.this) }, { h: '6-mo avg', num: 1, f: (c) => money(c.avg) }, { h: 'Difference', num: 1, f: (c) => `<span class="${c.diff > 0 ? 'down' : 'up'}">${signed(c.diff)}</span>` }], ch) : ''}`;
  }

  // ---------- Spending ----------
  function renderSpending() {
    const mo = monthly(txnsInRange());
    const ms = Object.keys(mo);
    const order = [...TOP_CATS, 'Other'];
    const ds = order.map((c) => barDs(c, ms.map((m) => c === 'Other'
      ? Object.entries(mo[m].cats).filter(([k]) => !TOP_CATS.includes(k)).reduce((s, [, v]) => s + v, 0)
      : mo[m].cats[c] || 0), c === 'Other' ? css('--other') : catColor(c), { stack: 's', borderRadius: 0, borderColor: css('--surface'), borderWidth: { top: 2 }, borderSkipped: false }));
    chart('c-catmonthly', { type: 'bar', data: { labels: ms.map(mlabel), datasets: ds }, options: { scales: { x: { stacked: true }, y: { stacked: true } } } });

    const cats = {};
    let total = 0;
    for (const m of ms) for (const [c, v] of Object.entries(mo[m].cats)) { cats[c] = (cats[c] || 0) + v; total += v; }
    const list = Object.entries(cats).filter(([, v]) => Math.abs(v) >= 0.5).sort((a, b) => b[1] - a[1]);
    const n = Math.max(ms.length, 1);
    $('#sp-cats').innerHTML = bars(list.map(([c, v]) => ({ name: c, value: Math.max(v, 0), dot: catColor(c), text: `${money(v)} <span class="muted">· ${money(v / n)}/mo · ${pct(v / total, 0)}</span>` })), { click: true });
    $$('#sp-cats .bar-row').forEach((el) => el.addEventListener('click', () => goTx(list[+el.dataset.i][0])));

    const mer = {};
    for (const t of txnsInRange()) if (isSpend(t)) { const k = t[3]; (mer[k] = mer[k] || { n: 0, v: 0, cat: t[4] }); mer[k].n++; mer[k].v -= t[2]; }
    const ml = Object.entries(mer).sort((a, b) => b[1].v - a[1].v).slice(0, 15);
    $('#sp-merchants').innerHTML = table([{ h: 'Merchant', f: ([k]) => esc(k) }, { h: 'Category', f: ([, m]) => `<span class="dot" style="background:${catColor(m.cat)}"></span>${esc(m.cat)}` },
      { h: 'Visits', num: 1, f: ([, m]) => m.n }, { h: 'Total', num: 1, f: ([, m]) => money(m.v) }], ml, { click: true });
    $$('#sp-merchants tr.click').forEach((el) => el.addEventListener('click', () => { state.tx.q = ml[+el.dataset.i][0]; state.tx.cat = ''; switchTab('transactions'); }));

    const rec = F.recurring.filter((r) => r.active);
    const annual = rec.reduce((s, r) => s + r.annual_cost, 0);
    const subs = rec.filter((r) => r.fixed);
    $('#rec-total').textContent = `${rec.length} active · ${money(annual)}/year · fixed-price subscriptions ${money(subs.reduce((s, r) => s + r.annual_cost, 0))}/year`;
    $('#sp-recurring').innerHTML = table([
      { h: 'Merchant', f: (r) => esc(r.merchant) + (r.price_increase ? ` <span class="tag" title="from ${money(r.price_increase.from, 1)}">↑ price</span>` : '') + (r.first_date >= daysAgo(75) ? ' <span class="tag">new</span>' : '') },
      { h: 'Category', f: (r) => esc(r.category) }, { h: 'How often', f: (r) => r.cadence + (r.fixed ? '' : ' <span class="muted small">(varies)</span>') },
      { h: 'Last charge', num: 1, f: (r) => money(r.last_amount, 1) }, { h: 'Next expected', f: (r) => r.next_expected }, { h: 'Per year', num: 1, f: (r) => money(r.annual_cost) },
    ], F.recurring.filter((r) => r.active), { empty: 'No recurring charges found yet (needs 3+ months of history).' });

    const y = F.yoy;
    $('#yoy-note').textContent = y.has_last_year ? `Jan 1 to ${y.through.slice(5)} · ${money(y.total_this)} vs. ${money(y.total_last)} (${signed(y.total_this - y.total_last)})` : 'Needs last year\'s statements';
    $('#sp-yoy').innerHTML = y.has_last_year ? table([{ h: 'Category', f: (r) => esc(r.category) }, { h: String(y.year), num: 1, f: (r) => money(r.this_year) }, { h: String(y.year - 1), num: 1, f: (r) => money(r.last_year) },
      { h: 'Change', num: 1, f: (r) => `<span class="${r.change > 0 ? 'down' : r.change < 0 ? 'up' : ''}">${signed(r.change)}</span>${r.change_pct != null ? ` <span class="muted small">${r.change_pct > 0 ? '+' : ''}${r.change_pct}%</span>` : ''}` }],
      y.rows.filter((r) => Math.abs(r.this_year) + Math.abs(r.last_year) > 1)) : '<div class="empty">Add statements from last year to compare.</div>';
  }
  const daysAgo = (n) => { const d = new Date(F.meta.as_of); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };

  // ---------- Investments ----------
  function renderInvestments() {
    const a = F.allocation, g = F.growth;
    const last = g.value.length - 1;
    $('#inv-kpis').innerHTML = [
      tile('Invested assets', money(a.total || g.value[last]), a.as_of ? `as of ${a.as_of}` : ''),
      tile('You put in', money(g.contributed[last]), 'Starting balances + net contributions'),
      tile('Market growth', signed(g.growth[last]), g.contributed[last] ? `${pct(g.growth[last] / g.contributed[last])} on money in` : '', g.growth[last] < 0 ? 'down' : 'up'),
      tile('Time-weighted return', pct(g.twr_since_start), `${pct(g.twr_ytd)} this year · ignores timing of deposits`),
      tile('Your return (XIRR)', pct(g.xirr), 'Annualised, includes timing of deposits'),
      tile('Fund costs', a.annual_fee_cost != null ? money(a.annual_fee_cost) + '/yr' : '–', a.weighted_expense_ratio != null ? `${a.weighted_expense_ratio.toFixed(3)}% weighted expense ratio` : 'Add expense ratios in securities.yaml'),
    ].join('');

    const est = Object.keys(EST);
    $('#inv-est').hidden = !est.length;
    $('#inv-est').innerHTML = est.map((id) => `<b>${esc(acctName(id))}</b>: ${esc(estText(id))}. Those months count only the money you moved in, with no market gains, so there's no gap before the first statement.`).join('<br>');
    const idx = g.value.map((v, i) => i).filter((i) => g.value[i]);
    const lab = idx.map((i) => mlabel(g.months[i]));
    chart('c-growth', {
      type: 'line',
      data: { labels: lab, datasets: [
        { label: 'Money you put in', data: idx.map((i) => g.contributed[i]), fill: true, backgroundColor: css('--s1') + '55', borderColor: css('--s1'), borderWidth: 2, pointRadius: 0, tension: 0.2 },
        { label: 'Market growth', data: idx.map((i) => g.value[i]), fill: '-1', backgroundColor: css('--s3') + '55', borderColor: css('--s3'), borderWidth: 2, pointRadius: 0, tension: 0.2 },
      ] },
      options: { plugins: { tooltip: { callbacks: { label: (c) => c.datasetIndex === 0 ? ` Put in: ${money(c.parsed.y)}` : ` Value: ${money(c.parsed.y)} (growth ${signed(c.parsed.y - g.contributed[idx[c.dataIndex]])})` } } } },
    });

    const cls = a.by_class;
    const max = Math.max(...cls.map((r) => Math.max(r.pct, r.target_pct || 0)), 1);
    $('#inv-alloc').innerHTML = bars(cls.map((r, i) => ({ name: r.asset_class, value: r.pct, target: r.target_pct, color: SERIES()[i % 8], dot: SERIES()[i % 8],
      text: `${r.pct.toFixed(1)}%${r.target_pct != null ? ` <span class="muted">/ ${r.target_pct}%</span>` : ''} <span class="muted">· ${short(r.value)}</span>` })), { max: max * 1.05 })
      + `<div class="muted small" style="margin-top:8px">Bar = actual share; dark tick = your target from targets.yaml.</div>`
      + (a.targets_sum != null && Math.abs(a.targets_sum - 100) > 0.01 ? `<div class="notice">Your targets add up to ${a.targets_sum}%, not 100%.</div>` : '');
    $('#alloc-note').textContent = `${money(a.total)} across ${a.by_account.length} account${a.by_account.length === 1 ? '' : 's'}`;
    const rb = cls.filter((r) => r.rebalance != null);
    $('#inv-rebal').innerHTML = table([{ h: 'Asset class', f: (r) => esc(r.asset_class) }, { h: 'Now', num: 1, f: (r) => r.pct.toFixed(1) + '%' }, { h: 'Target', num: 1, f: (r) => r.target_pct + '%' },
      { h: 'Drift', num: 1, f: (r) => `${r.drift_pct > 0 ? '+' : ''}${r.drift_pct.toFixed(1)} pts` },
      { h: 'Action', num: 1, f: (r) => Math.abs(r.rebalance) < Math.max(50, a.total * 0.002) ? '<span class="muted">on target</span>' : r.rebalance > 0 ? `Buy ${money(r.rebalance)}` : `Sell ${money(-r.rebalance)}` }], rb, { empty: 'Set targets in config/targets.yaml.' })
      + (a.concentration.length ? `<div class="notice">⚠️ Concentration: ${a.concentration.map((c) => `<b>${esc(c.symbol)}</b> is ${c.pct.toFixed(1)}% of your portfolio`).join(', ')} (limit ${a.concentration_limit}%).</div>` : '')
      + `<div class="muted small" style="margin-top:8px">Tip: rebalance with new contributions first, and sell inside tax-advantaged accounts to avoid capital gains.</div>`;
    $('#inv-acct').innerHTML = bars(a.by_account.map((r) => ({ name: r.name, value: r.value, text: `${money(r.value)} <span class="muted">· ${r.pct.toFixed(1)}%</span>` })));
    const taxName = { taxable: 'Taxable', traditional: 'Traditional (pre-tax)', roth: 'Roth (tax-free)', hsa: 'HSA' };
    $('#inv-tax').innerHTML = bars(a.by_tax.map((r) => ({ name: taxName[r.name] || r.name, value: r.value, text: `${money(r.value)} <span class="muted">· ${r.pct.toFixed(1)}%</span>` })));
    $('#inv-holdings').innerHTML = table([
      { h: 'Symbol', f: (h) => `<b>${esc(h.symbol)}</b>` }, { h: 'Name', f: (h) => esc(h.name) }, { h: 'Class', f: (h) => esc(h.asset_class) + (a.guessed.includes(h.symbol) ? ' <span class="tag" title="Not in the built-in list; assumed. Set it in securities.yaml">assumed</span>' : '') },
      { h: 'Accounts', f: (h) => esc(h.accounts.join(', ')) }, { h: 'Value', num: 1, f: (h) => money(h.value) }, { h: 'Share', num: 1, f: (h) => h.pct.toFixed(1) + '%' },
      { h: 'Gain', num: 1, f: (h) => h.gain == null ? '–' : `<span class="${h.gain < 0 ? 'down' : 'up'}">${signed(h.gain)}</span>` },
      { h: 'Exp. ratio', num: 1, f: (h) => h.expense_ratio == null ? '–' : h.expense_ratio + '%' }], a.holdings, { empty: 'Import a positions export from your brokerage to see holdings.' });
    $('#hold-note').textContent = a.guessed.length ? `${a.guessed.join(', ')}: asset class assumed. Set it in config/securities.yaml` : '';

    const rm = g.months.map((m, i) => [m, g.monthly_returns[i]]).filter(([, r]) => r != null).slice(-24);
    chart('c-returns', {
      type: 'bar', _fmt: (v) => pct(v), _tick: (v) => pct(v, 0),
      data: { labels: rm.map(([m]) => mlabel(m)), datasets: [barDs('Return', rm.map(([, r]) => r), rm.map(([, r]) => (r >= 0 ? css('--pos') : css('--neg'))), { borderSkipped: false })] },
      options: { plugins: { legend: { display: false } } },
    });
    const inc = g.income.filter((r) => r.month >= g.months[idx[0]]).slice(-24);
    chart('c-income', {
      type: 'bar',
      data: { labels: inc.map((r) => mlabel(r.month)), datasets: [barDs('Dividends', inc.map((r) => r.dividends), css('--s1'), { stack: 's' }), barDs('Interest', inc.map((r) => r.interest), css('--s3'), { stack: 's' }), barDs('Fees', inc.map((r) => r.fees), css('--s8'), { stack: 's' })] },
      options: { scales: { x: { stacked: true }, y: { stacked: true } } },
    });
    $('#inv-perf').innerHTML = table([{ h: 'Account', f: (r) => esc(r.name) }, { h: 'Value', num: 1, f: (r) => money(r.value) }, { h: 'Put in', num: 1, f: (r) => money(r.contributed) },
      { h: 'Growth', num: 1, f: (r) => `<span class="${r.growth < 0 ? 'down' : 'up'}">${signed(r.growth)}</span>` }, { h: 'Time-weighted', num: 1, f: (r) => pct(r.twr) }, { h: 'XIRR / yr', num: 1, f: (r) => pct(r.xirr) }], g.accounts);
  }

  // ---------- Planning ----------
  function renderPlanning() {
    const b = F.budgets;
    $('#bud-note').textContent = b.month ? `${mlong(b.month)} · ${b.elapsed_pct}% of the month gone · ${money(b.total_spent)} of ${money(b.total_limit)}` : '';
    const brows = b.rows || [];
    $('#pl-budgets').innerHTML = brows.length ? bars(brows.map((r) => ({
      name: r.category, value: r.spent, target: r.limit, pace: r.limit * b.elapsed_pct / 100, color: css(r.status === 'over' ? '--critical' : r.status === 'at_risk' ? '--warning' : '--s1'),
      text: `${money(r.spent)} <span class="muted">/ ${money(r.limit)}</span> ${statusBadge(r.status)}`, title: `Projected ${money(r.projected)} by month end · 6-mo avg ${money(r.avg_6m)}`,
    })), { max: Math.max(...brows.map((r) => Math.max(r.spent, r.limit))) * 1.05 }) + '<div class="muted small" style="margin-top:8px">Dark tick = budget; grey tick = where you\'d be at an even pace. Hover for the month-end projection.</div>'
      : '<div class="empty">Set monthly limits in config/budgets.yaml.</div>';

    const r = F.runway;
    $('#pl-runway').innerHTML = r && r.cash != null ? `<div class="tiles">${tile('Cash on hand', money(r.cash), 'Checking + savings')}${tile('Essentials covered', r.months_essential != null ? r.months_essential + ' months' : '–', `at ${money(r.essential_monthly)}/mo essentials`)}${tile('All spending covered', r.months_all != null ? r.months_all + ' months' : '–', `at ${money(r.all_monthly)}/mo`)}</div>
      <div class="muted small" style="margin-top:10px">A common target is 3–6 months of essentials. Essentials are set in settings.yaml (${esc((F.meta.settings.essential_categories || []).join(', '))}).</div>` : '<div class="empty">Needs a few months of data.</div>';

    // Savings rate trend
    const S = F.summary.filter((m) => m.month < F.meta.as_of.slice(0, 7) || F.meta.as_of.slice(8) === lastDay(m.month));
    const roll = (k) => S.map((_, i) => { const w = S.slice(Math.max(0, i - k + 1), i + 1); if (w.length < k) return null; const inc = w.reduce((s, m) => s + m.income, 0), sp = w.reduce((s, m) => s + m.spending, 0); return inc > 0 ? (inc - sp) / inc : null; });
    chart('c-savings', {
      type: 'line', _fmt: (v) => pct(v), _tick: (v) => pct(v, 0),
      data: { labels: S.map((m) => mlabel(m.month)), datasets: [
        { label: 'Monthly', data: S.map((m) => m.savings_rate), borderColor: css('--other'), backgroundColor: css('--other'), borderWidth: 2, pointRadius: 3, showLine: false },
        { label: '3-month', data: roll(3), borderColor: css('--s1'), borderWidth: 2, pointRadius: 0, tension: 0.3 },
        { label: '12-month', data: roll(12), borderColor: css('--s2'), borderWidth: 2, pointRadius: 0, tension: 0.3 }] },
    });
    renderDebts();

    const years = Object.keys(F.tax).sort().reverse();
    $('#pl-tax').innerHTML = years.length ? table([{ h: 'Year', f: (y) => y }, ...Array.from(new Set(years.flatMap((y) => Object.keys(F.tax[y])))).sort().map((tag) => ({ h: tag, num: 1, f: (y) => F.tax[y][tag] ? money(F.tax[y][tag].total, 1) + ` <span class="muted small">(${F.tax[y][tag].items.length})</span>` : '–' }))], years)
      + '<div class="muted small" style="margin-top:8px">Totals of transactions with each tag. Search the Transactions tab for the details. Not tax advice.</div>' : '<div class="empty">Tag transactions in config/rules.yaml, e.g. tags: [business].</div>';
  }

  // ---------- Projection ----------
  const PJ = F.projection;
  const PJ_KEY = 'fin-projection-v1';
  function pjDefaults() {
    const d = PJ.defaults, m = PJ.monthly, b = PJ.balances;
    const r1 = (x) => Math.round(x * 10) / 10;
    return {
      cash: Math.round(b.cash), taxable: Math.round(b.taxable), retirement: Math.round(b.retirement), other: Math.round(b.other),
      income: Math.round(m.income), incomeGrowth: r1(((PJ.income_growth ?? 0.03)) * 100), spending: Math.round(m.spending),
      spendingGrowth: r1(((PJ.spending_growth ?? d.inflation / 100)) * 100), investShare: Math.round(PJ.invest_share * 100),
      retireContrib: Math.round(m.retirement_contrib), extraSavings: 0,
      invReturn: r1(PJ.portfolio.return), vol: r1(PJ.portfolio.volatility), cashYield: d.cash_yield, otherGrowth: d.other_growth, inflation: d.inflation,
      years: d.years, stopAfter: '', fiMultiple: d.fi_multiple, birthYear: d.birth_year || '', freeDebt: true,
    };
  }
  let pj = pjDefaults();
  try { const saved = JSON.parse(localStorage.getItem(PJ_KEY) || 'null'); if (saved) pj = { ...pj, ...saved }; } catch (e) {}

  function pjFields() {
    const d = pjDefaults(), m = PJ.monthly, h = PJ.history;
    const histG = (g) => (g == null ? 'not enough history (needs 2 years)' : `your last year: ${g >= 0 ? '+' : ''}${(g * 100).toFixed(1)}%`);
    const w = Object.entries(PJ.portfolio.weights).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${Math.round(v * 100)}% ${k}`).join(', ');
    return [
      ['Your money today', [
        ['cash', 'Cash ($)', 1000, 'Checking + savings, minus cards you pay off monthly'],
        ['taxable', 'Taxable investments ($)', 1000, 'Brokerage accounts'],
        ['retirement', 'Retirement accounts ($)', 1000, '401(k), IRA, HSA'],
        ['other', 'Other assets ($)', 1000, 'House, car… (from balances.yaml)'],
      ]],
      ['Earning & saving', [
        ['income', 'Take-home income ($/mo)', 100, `Average of your last ${PJ.basis_months} months`],
        ['incomeGrowth', 'Income growth (%/yr)', 0.5, histG(PJ.income_growth)],
        ['spending', 'Spending ($/mo)', 100, `Average of your last ${PJ.basis_months} months, loan payments included`],
        ['spendingGrowth', 'Spending growth (%/yr)', 0.5, histG(PJ.spending_growth)],
        ['investShare', 'Share of savings invested (%)', 5, `You moved ${money(m.invested)}/mo of ${money(m.saved)}/mo saved into investments`],
        ['retireContrib', '401(k) contributions ($/mo)', 50, 'Yours + employer match (from balances.yaml contributions). Grows with income.'],
        ['extraSavings', 'Extra savings, what-if ($/mo)', 100, 'Added on top of income − spending'],
      ]],
      ['Returns & prices', [
        ['invReturn', 'Investment return (%/yr)', 0.5, `From your allocation${w ? ` (${w})` : ''}. Your history: ${h.xirr != null ? 'XIRR ' + pct(h.xirr) : '–'}${h.twr_annual != null ? ', time-weighted ' + pct(h.twr_annual) + '/yr' : ''} over ${h.months} months`],
        ['vol', 'Volatility (%/yr)', 1, 'How much a single year can swing (used for the range of outcomes)'],
        ['cashYield', 'Cash interest (%/yr)', 0.25, 'What your savings accounts pay'],
        ['otherGrowth', 'Other assets growth (%/yr)', 0.5, 'Negative for a car, ~3% for a house'],
        ['inflation', 'Inflation (%/yr)', 0.25, 'Used for "today\'s dollars"'],
      ]],
      ['Horizon & goals', [
        ['years', 'Years to project', 1, ''],
        ['stopAfter', 'Stop working after (years)', 1, 'Leave blank to keep working. After this, spending is paid from savings.'],
        ['fiMultiple', 'Independence target (× spending)', 1, '25× = the 4% rule'],
        ['birthYear', 'Birth year (optional)', 1, 'Shows your age on the timeline'],
        ['freeDebt', 'Save payments of paid-off loans', 0, 'When a loan ends, its payment keeps going to savings'],
      ]],
    ].map(([g, fs]) => [g, fs.map(([k, l, step, hint]) => ({ k, l, step, hint, def: d[k] }))]);
  }
  function initProjection() {
    const box = $('#pj-inputs');
    box.innerHTML = pjFields().map(([g, fs]) => `<fieldset><legend>${esc(g)}</legend>${fs.map((f) => f.k === 'freeDebt'
      ? `<label class="pj-field" title="${esc(f.hint)}"><span>${esc(f.l)}</span><input type="checkbox" data-k="${f.k}" ${pj[f.k] ? 'checked' : ''} style="justify-self:start;width:auto"><span class="hint">${esc(f.hint)}</span></label>`
      : `<label class="pj-field" data-f="${f.k}"><span>${esc(f.l)}</span><input type="number" data-k="${f.k}" step="${f.step}" value="${esc(pj[f.k])}"><span class="hint">${esc(f.hint)}</span></label>`).join('')}</fieldset>`).join('');
    box.addEventListener('input', (e) => {
      const k = e.target.dataset.k; if (!k) return;
      pj[k] = e.target.type === 'checkbox' ? e.target.checked : e.target.value === '' ? '' : parseFloat(e.target.value);
      try { localStorage.setItem(PJ_KEY, JSON.stringify(pj)); } catch (err) {}
      renderProjection();
    });
    $('#pj-real').addEventListener('change', renderProjection);
    $('#pj-reset').addEventListener('click', () => {
      pj = pjDefaults();
      try { localStorage.removeItem(PJ_KEY); } catch (err) {}
      $$('input[data-k]', box).forEach((i) => { if (i.type === 'checkbox') i.checked = !!pj[i.dataset.k]; else i.value = pj[i.dataset.k]; });
      renderProjection();
    });
    const loans = PJ.loans;
    $('#pj-basis').innerHTML = (loans.length ? `Loans paid down on schedule: ${loans.map((l) => `${esc(l.name)} ${money(l.balance)} at ${l.apr}% (${money(l.payment)}/mo)`).join(', ')}. ` : '')
      + 'Defaults come from your data. Your changes are remembered in this browser. Blue outline = changed from your data. '
      + 'Projections are estimates, not predictions: returns are never smooth.';
  }
  function pjParams(over = {}) {
    const v = { ...pj, ...over }, n = (x) => (x === '' || x == null || isNaN(x) ? 0 : +x);
    return {
      years: Math.max(1, Math.min(60, Math.round(n(v.years)) || 30)), cash: n(v.cash), taxable: n(v.taxable), retirement: n(v.retirement), other: n(v.other),
      loans: PJ.loans, income: n(v.income), spending: n(v.spending), incomeGrowth: n(v.incomeGrowth) / 100, spendingGrowth: n(v.spendingGrowth) / 100,
      investShare: Math.max(0, Math.min(1, n(v.investShare) / 100)), retireContrib: n(v.retireContrib), extraSavings: n(v.extraSavings), spendingChange: n(v.spendingChange),
      invReturn: n(v.invReturn) / 100, cashYield: n(v.cashYield) / 100, otherGrowth: n(v.otherGrowth) / 100,
      stopAfter: v.stopAfter === '' || v.stopAfter == null ? null : Math.max(0, Math.round(n(v.stopAfter))), freeDebtPayments: !!v.freeDebt, fiMultiple: n(v.fiMultiple) || 25,
    };
  }
  function renderProjection() {
    if (!$('#pj-inputs').innerHTML) initProjection();
    const d = pjDefaults();
    $$('#pj-inputs .pj-field[data-f]').forEach((el) => { const k = el.dataset.f; el.classList.toggle('changed', String(pj[k]) !== String(d[k])); });
    const p = pjParams(), real = $('#pj-real').checked, infl = (+pj.inflation || 0) / 100;
    const rows = FinProjection.project(p), mc = FinProjection.monteCarlo(p, (+pj.vol || 0) / 100, 400);
    const y0 = new Date(F.meta.as_of).getFullYear();
    const defl = (v, y) => (real ? v / Math.pow(1 + infl, y) : v);
    const birth = +pj.birthYear || null;
    const yearLabel = (y) => String(y0 + y) + (birth ? ` (${y0 + y - birth})` : '');
    const at = (y) => Math.min(y, p.years);
    const fi = FinProjection.fiYear(rows, p.fiMultiple);
    const unit = real ? "today's dollars" : 'future dollars';

    const kp = (y) => tile(`Net worth in ${y} years`, short(defl(mc.p50[at(y)], at(y))), `likely ${short(defl(mc.p10[at(y)], at(y)))} – ${short(defl(mc.p90[at(y)], at(y)))}`);
    const marks = [5, 10, 20].filter((y) => y < p.years).concat([p.years]);
    const saveNow = p.income - p.spending + p.extraSavings;
    $('#pj-kpis').innerHTML = [
      tile('Saving now', money(saveNow + p.retireContrib) + '/mo', `${p.income > 0 ? pct(saveNow / p.income, 0) + ' of take-home' : ''}${p.retireContrib ? ` + ${money(p.retireContrib)} to 401(k)` : ''}`),
      ...marks.slice(-3).map(kp),
      tile('Financially independent', fi == null ? `Not in ${p.years} yrs` : fi === 0 ? 'Already' : String(y0 + fi), fi == null ? 'Try saving more or a longer horizon'
        : `${fi ? `in ${fi} years${birth ? `, at ${y0 + fi - birth}` : ''} · ` : ''}${pct(mc.fiChance[fi], 0)} chance by then`),
      ...(p.stopAfter != null ? [tile('Money lasts', pct(mc.lastedChance, 0), `of ${mc.n} simulations never run out after you stop working in ${y0 + p.stopAfter}`, mc.lastedChance < 0.8 ? 'down' : '')] : []),
    ].join('');

    const end = rows[rows.length - 1];
    const growthShare = end.invested > 0 ? Math.max(0, end.growth) / (end.investable + Math.max(0, -end.cash) || 1) : 0;
    $('#pj-summary').innerHTML = `If you keep saving about <b>${money(saveNow + p.retireContrib)}/month</b> and investments return <b>${(+pj.invReturn).toFixed(1)}%</b> a year, `
      + `your net worth grows from <b>${short(rows[0].netWorth)}</b> to a typical <b>${short(defl(mc.p50[p.years], p.years))}</b> in ${p.years} years (${unit}). `
      + `There's a 10% chance it ends below ${short(defl(mc.p10[p.years], p.years))}, and a 10% chance above ${short(defl(mc.p90[p.years], p.years))}. `
      + `On the smooth path below, ${pct(growthShare, 0)} of your investments by then is market growth, not money you put in.`
      + (end.cash > 2 * end.annualSpending && p.investShare < 0.9
        ? ` <br>💡 Only ${pct(p.investShare, 0)} of your savings gets invested, so cash grows to ${short(defl(end.cash, p.years))}, earning just ${(+pj.cashYield).toFixed(1)}%. Once you have a solid emergency fund, investing more of it is one of the biggest levers (see "What moves the needle").`
        : '');

    const labels = rows.map((r) => yearLabel(r.year));
    const area = (label, data, color) => ({ label, data, fill: true, backgroundColor: color + '66', borderColor: color, borderWidth: 1.5, pointRadius: 0, tension: 0.25, stack: 's' });
    chart('c-pj-stack', {
      type: 'line',
      data: { labels, datasets: [
        area('Cash', rows.map((r) => defl(r.cash, r.year)), css('--s1')),
        area('Money you put in', rows.map((r) => defl(Math.min(r.principal, r.invested), r.year)), css('--s7')),
        area('Investment growth', rows.map((r) => defl(Math.max(0, r.invested - r.principal), r.year)), css('--s3')),
        area('Other assets', rows.map((r) => defl(r.other, r.year)), css('--s4')),
        { label: 'Net worth', data: rows.map((r) => defl(r.netWorth, r.year)), borderColor: css('--ink'), borderWidth: 2, pointRadius: 0, fill: false, tension: 0.25 },
      ] },
      options: { scales: { y: { stacked: true } }, plugins: { tooltip: { itemSort: (a, b) => b.datasetIndex - a.datasetIndex } } },
    });
    $('#pj-mc-note').textContent = `The smooth path above assumes the same return every year; real returns vary, so the typical outcome is a bit lower. ${mc.n} simulations with random yearly returns (average ${(+pj.invReturn).toFixed(1)}%, swings of ±${(+pj.vol).toFixed(0)}%)`;
    chart('c-pj-mc', {
      type: 'line',
      data: { labels, datasets: [
        { label: 'Bad luck (10th percentile)', data: mc.p10.map((v, i) => defl(v, i)), borderColor: css('--s1') + '88', borderWidth: 1, pointRadius: 0, fill: false, tension: 0.25 },
        { label: 'Good luck (90th percentile)', data: mc.p90.map((v, i) => defl(v, i)), borderColor: css('--s1') + '88', backgroundColor: css('--s1') + '2a', borderWidth: 1, pointRadius: 0, fill: '-1', tension: 0.25 },
        { label: 'Typical (median)', data: mc.p50.map((v, i) => defl(v, i)), borderColor: css('--s1'), borderWidth: 2.5, pointRadius: 0, fill: false, tension: 0.25 },
        { label: `Independence target (${p.fiMultiple}× spending)`, data: rows.map((r) => defl(r.annualSpending * p.fiMultiple, r.year)), borderColor: css('--s2'), borderWidth: 2, pointRadius: 0, fill: false },
      ] },
    });

    // Sensitivity: how each change moves net worth at a horizon and the independence year.
    const H = at(20);
    const base = defl(rows[H].netWorth, H);
    const variants = [
      ['Return 1 point higher', { invReturn: +pj.invReturn + 1 }], ['Return 1 point lower', { invReturn: +pj.invReturn - 1 }],
      ['Save $500/month more', { extraSavings: (+pj.extraSavings || 0) + 500 }], ['Spend 10% less', { spendingChange: -0.1 * (+pj.spending || 0) }],
      ['Invest all savings (no extra cash)', { investShare: 100 }], ['Income grows 1 point faster', { incomeGrowth: +pj.incomeGrowth + 1 }],
      ['Spending grows 1 point faster', { spendingGrowth: +pj.spendingGrowth + 1 }],
    ].map(([name, o]) => {
      const r = FinProjection.project(pjParams(o));
      return { name, nw: defl(r[H].netWorth, H), fi: FinProjection.fiYear(r, p.fiMultiple) };
    });
    $('#pj-sens-note').textContent = `Net worth in ${H} years (${unit})`;
    const fiTxt = (f) => (f == null ? 'not reached' : f === 0 ? 'now' : String(y0 + f));
    $('#pj-sens').innerHTML = table([{ h: 'If…', f: (r) => esc(r.name) }, { h: 'Net worth', num: 1, f: (r) => short(r.nw) },
      { h: 'vs. plan', num: 1, f: (r) => `<span class="${r.nw - base < 0 ? 'down' : 'up'}">${signed(r.nw - base, short)}</span>` },
      { h: 'Independent', num: 1, f: (r) => fiTxt(r.fi) + (r.fi != null && fi != null && r.fi !== fi ? ` <span class="muted small">(${r.fi < fi ? '−' : '+'}${Math.abs(r.fi - fi)} yr)</span>` : '') }],
      [{ name: 'Your plan', nw: base, fi }, ...variants]);

    // Milestones on the smooth path.
    const miles = [];
    for (const t of [100e3, 250e3, 500e3, 1e6, 2e6, 5e6]) {
      if (defl(rows[0].netWorth, 0) >= t) continue;
      const r = rows.find((x) => defl(x.netWorth, x.year) >= t);
      if (r) miles.push({ what: `Net worth reaches ${short(t)}`, y: r.year });
    }
    const debtFree = PJ.loans.length ? rows.find((r) => r.debt <= 0.5) : null;
    if (debtFree) miles.push({ what: 'Loans paid off', y: debtFree.year });
    const cross = rows.find((r, i) => i > 0 && (r.invested - rows[i - 1].invested - Math.max(0, r.saved) * p.investShare - r.contrib) > Math.max(0, r.saved) + r.contrib && r.saved + r.contrib > 0);
    if (cross) miles.push({ what: 'Your investments earn more in a year than you save', y: cross.year });
    if (fi != null) miles.push({ what: `Independence (${p.fiMultiple}× spending)`, y: fi });
    if (p.stopAfter != null) miles.push({ what: 'You stop working', y: p.stopAfter });
    if (rows.depleted != null) miles.push({ what: '⚠️ Savings run out (smooth path)', y: rows.depleted });
    miles.sort((a, b) => a.y - b.y);
    $('#pj-miles').innerHTML = table([{ h: 'Milestone', f: (m) => esc(m.what) }, { h: 'Year', num: 1, f: (m) => (m.y === 0 ? 'now' : yearLabel(m.y)) }, { h: 'In', num: 1, f: (m) => (m.y === 0 ? '' : m.y + ' yr') }], miles, { empty: 'No milestones within the horizon.' });

    const pick = rows.filter((r) => r.year <= 10 || r.year % 5 === 0 || r.year === p.years);
    $('#pj-table').innerHTML = table([{ h: 'Year', f: (r) => yearLabel(r.year) }, { h: 'Income', num: 1, f: (r) => (r.year ? short(defl(r.income, r.year)) : '') },
      { h: 'Spending', num: 1, f: (r) => (r.year ? short(defl(r.spending, r.year)) : '') }, { h: 'Saved + 401(k)', num: 1, f: (r) => (r.year ? short(defl(r.saved + r.contrib, r.year)) : '') },
      { h: 'Investments', num: 1, f: (r) => short(defl(r.invested, r.year)) }, { h: 'Cash', num: 1, f: (r) => short(defl(r.cash, r.year)) },
      { h: 'Net worth', num: 1, f: (r) => `<b>${short(defl(r.netWorth, r.year))}</b>` }, { h: 'Likely range', num: 1, f: (r) => r.year ? `<span class="muted">${short(defl(mc.p10[r.year], r.year))} – ${short(defl(mc.p90[r.year], r.year))}</span>` : '' }], pick);
  }

  function renderDebts() {
    const D = F.debts.filter((d) => d.balance > 0.5);
    $('#debt-table').innerHTML = table([{ h: 'Debt', f: (d) => esc(d.name) }, { h: 'Balance', num: 1, f: (d) => money(d.balance) }, { h: 'APR', num: 1, f: (d) => d.apr != null ? d.apr + '%' : '<span class="muted" title="add apr: in accounts.yaml">?</span>' },
      { h: 'Interest, last 12 mo', num: 1, f: (d) => money(d.interest_12m) }, { h: 'Minimum', num: 1, f: (d) => money(d.min_payment) },
      { h: '', f: (d) => d.paid_in_full ? '<span class="muted small">paid in full monthly</span>' : '' }], D, { empty: 'No debts. 🎉' });
    const box = $('#debt-inputs');
    const revolving = D.filter((d) => !d.paid_in_full);
    if (!revolving.length) { box.innerHTML = ''; $('#debt-result').innerHTML = D.length ? '<div class="muted small">Cards you pay in full each month are left out of the payoff plan.</div>' : ''; return; }
    if (!box.dataset.init) {
      box.dataset.init = 1;
      const mins = revolving.reduce((s, d) => s + d.min_payment, 0);
      box.innerHTML = `<label>Total monthly payment ($)<input type="number" id="debt-pay" value="${Math.ceil(mins + 200)}" step="50"></label><div class="muted small" style="align-self:end">Minimums add up to ${money(mins)}. Debts without an APR are treated as 0%.</div>`;
      $('#debt-pay').addEventListener('input', renderDebts);
    }
    const pay = parseFloat($('#debt-pay').value) || 0;
    const sim = (order) => {
      const ds = revolving.map((d) => ({ ...d, bal: d.balance, r: (d.apr || 0) / 1200, done: null }));
      let m = 0, interest = 0;
      while (ds.some((d) => d.bal > 0.005) && m < 600) {
        m++;
        let budget = pay;
        for (const d of ds) if (d.bal > 0) { const i = d.bal * d.r; interest += i; d.bal += i; }
        for (const d of ds) if (d.bal > 0) { const p = Math.min(d.bal, d.min_payment); d.bal -= p; budget -= p; }
        if (budget < 0) return null;
        for (const d of order(ds.filter((x) => x.bal > 0))) { const p = Math.min(d.bal, budget); d.bal -= p; budget -= p; if (budget <= 0) break; }
        for (const d of ds) if (d.bal <= 0.005 && d.done == null) d.done = m;
      }
      return m >= 600 ? null : { months: m, interest, ds };
    };
    const av = sim((ds) => ds.sort((a, b) => b.r - a.r)), sn = sim((ds) => ds.sort((a, b) => a.bal - b.bal));
    if (!av || !sn) { $('#debt-result').innerHTML = '<p class="callout">That payment does not cover the minimums and interest. Increase it.</p>'; return; }
    const when = (m) => { const d = new Date(F.meta.as_of); d.setMonth(d.getMonth() + m); return d.toLocaleString('en-US', { month: 'short', year: 'numeric' }); };
    $('#debt-result').innerHTML = table([{ h: 'Strategy', f: (s) => s.name }, { h: 'Debt-free', f: (s) => `${when(s.r.months)} <span class="muted small">(${s.r.months} mo)</span>` }, { h: 'Total interest', num: 1, f: (s) => money(s.r.interest) },
      { h: 'Order paid off', f: (s) => s.r.ds.slice().sort((a, b) => a.done - b.done).map((d) => esc(d.name)).join(' → ') }],
      [{ name: 'Avalanche <span class="muted small">(highest APR first)</span>', r: av }, { name: 'Snowball <span class="muted small">(smallest balance first)</span>', r: sn }])
      + (revolving.length > 1 ? `<p class="callout">Avalanche saves ${money(Math.max(0, sn.interest - av.interest))} in interest. Snowball gives quicker early wins.</p>` : '');
  }

  // ---------- Transactions ----------
  function goTx(cat) { state.tx.cat = cat; state.tx.q = ''; switchTab('transactions'); }
  function txRows() {
    const q = state.tx.q.toLowerCase();
    let rows = txnsInRange().filter((t) => (!state.tx.cat || t[4] === state.tx.cat) && (state.tx.transfers || state.tx.cat === 'Transfer' || state.tx.cat === 'Investments' || !(t[6] || t[4] === 'Transfer'))
      && (!q || t[3].toLowerCase().includes(q) || t[7].toLowerCase().includes(q) || t[4].toLowerCase().includes(q) || t[5].toLowerCase().includes(q)));
    const [k, dir] = state.tx.sort;
    rows.sort((a, b) => (k === 1 ? ACCTS[a[1]].name.localeCompare(ACCTS[b[1]].name) : a[k] < b[k] ? -1 : a[k] > b[k] ? 1 : 0) * dir);
    return rows;
  }
  function renderTransactions() {
    const cats = Array.from(new Set(F.txns.map((t) => t[4]))).sort();
    $('#tx-cat').innerHTML = '<option value="">All categories</option>' + cats.map((c) => `<option ${c === state.tx.cat ? 'selected' : ''}>${esc(c)}</option>`).join('');
    $('#tx-search').value = state.tx.q;
    $('#tx-transfers').checked = state.tx.transfers;
    const rows = txRows();
    const sum = rows.reduce((s, t) => s + t[2], 0);
    $('#tx-count').textContent = `${rows.length} transactions · net ${money(sum, 1)}`;
    $('#tx-table tbody').innerHTML = rows.slice(0, state.tx.limit).map((t) => `<tr title="${esc(t[7])}"><td class="num" style="text-align:left">${t[0]}</td><td>${esc(t[3])}${t[5] ? t[5].split(',').map((g) => `<span class="tag">${esc(g)}</span>`).join('') : ''}</td>
      <td><span class="dot" style="background:${catColor(t[4])}"></span>${esc(t[4])}</td><td class="muted">${esc(ACCTS[t[1]].name)}</td><td class="num ${t[2] > 0 ? 'up' : ''}">${money(t[2], 1)}</td></tr>`).join('')
      || '<tr><td colspan="5" class="empty">No transactions match.</td></tr>';
    $('#tx-more').hidden = rows.length <= state.tx.limit;
  }
  function initTransactions() {
    $('#tx-search').addEventListener('input', (e) => { state.tx.q = e.target.value; state.tx.limit = 200; renderTransactions(); });
    $('#tx-cat').addEventListener('change', (e) => { state.tx.cat = e.target.value; state.tx.limit = 200; renderTransactions(); });
    $('#tx-transfers').addEventListener('change', (e) => { state.tx.transfers = e.target.checked; renderTransactions(); });
    $('#tx-more').addEventListener('click', () => { state.tx.limit += 500; renderTransactions(); });
    $$('#tx-table th').forEach((th) => th.addEventListener('click', () => { const k = +th.dataset.k; state.tx.sort = [k, state.tx.sort[0] === k ? -state.tx.sort[1] : (k === 0 || k === 2 ? -1 : 1)]; renderTransactions(); }));
    $('#tx-csv').addEventListener('click', () => {
      const q = (s) => '"' + String(s).replace(/"/g, '""') + '"';
      const csv = ['date,account,amount,merchant,category,tags,description'].concat(txRows().map((t) => [t[0], q(ACCTS[t[1]].name), t[2], q(t[3]), q(t[4]), q(t[5]), q(t[7])].join(','))).join('\n');
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'transactions.csv'; a.click();
    });
  }

  // ---------- Data ----------
  function renderData() {
    const nw = F.networth, li = nw.months.length - 1;
    $('#dt-accounts').innerHTML = table([{ h: 'Account', f: (a) => esc(a.name) }, { h: 'Institution', f: (a) => esc(a.institution || '') }, { h: 'Type', f: (a) => esc(a.type) + (a.tax ? ` · ${esc(a.tax)}` : '') },
      { h: 'Transactions', num: 1, f: (a) => F.txns.filter((t) => ACCT_IDX[t[1]] === a.id).length || '–' },
      { h: 'Latest balance', num: 1, f: (a) => { const v = (nw.by_account[a.id] || [])[li]; return v == null ? '<span class="muted" title="No balance known. Add an anchor in balances.yaml">not in net worth</span>' : money(v); } },
      { h: 'Notes', f: (a) => (a.id in EST ? `<span class="small muted">${esc(estText(a.id))}</span>` : '') }], ACCTS);
    const um = F.unmatched_transfers || [], uc = F.unmatched_counted || [];
    $('#dt-unmatched-card').hidden = !um.length && !uc.length;
    $('#dt-unmatched').innerHTML = table([{ h: 'Payee', f: (r) => esc(r.merchant) }, { h: 'From', f: (r) => esc(r.account) }, { h: 'Count', num: 1, f: (r) => r.n },
      { h: 'Total', num: 1, f: (r) => money(r.total) }, { h: 'Dates', f: (r) => `${r.first} – ${r.last}` }], um)
      + (um.length ? '<div class="notice">These are treated as transfers, so they aren\'t counted as spending. If they pay an account you haven\'t imported (for example a second credit card), import it so its purchases are counted, or add a rule in rules.yaml that gives these payments a spending category.</div>' : '')
      + uc.map((r) => `<div class="notice">✓ ${r.n} payments (${money(r.total)}, ${r.first} – ${r.last}) are counted as spending in <b>${esc(r.category)}</b>, because they matched no payment in an imported account.</div>`).join('');
    const mark = { verified: '✓', ok: '•', warning: '•', unreconciled: '✗', error: '✗' };
    $('#dt-imports').innerHTML = table([{ h: '', f: (r) => `<span title="${esc(r.status)}">${mark[r.status] || ''}</span>` },
      { h: 'File', f: (r) => esc(r.path) }, { h: 'Parser', f: (r) => esc(r.parser) }, { h: 'Rows', num: 1, f: (r) => r.rows }, { h: 'Notes', f: (r) => `<span class="small muted">${esc(r.message || '')}</span>` }], F.imports);
  }

  // ---------- tabs and boot ----------
  function switchTab(t) {
    state.tab = t;
    $$('#tabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === t)));
    $$('.tab').forEach((s) => (s.hidden = s.id !== 'tab-' + t));
    try { localStorage.setItem('fin-tab', t); } catch (e) {}
    render();
    window.scrollTo(0, 0);
  }
  function render() {
    syncFilterUI();
    ({ overview: renderOverview, spending: renderSpending, investments: renderInvestments, projection: renderProjection, planning: renderPlanning, transactions: renderTransactions, data: renderData })[state.tab]();
  }
  $('#title').textContent = F.meta.title;
  $('#asof').textContent = `Data through ${F.meta.as_of} · built ${F.meta.generated.replace('T', ' ')}`;
  $('#tabs').addEventListener('click', (e) => { const t = e.target.dataset.tab; if (t) switchTab(t); });
  $('#theme').addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('fin-theme', document.documentElement.dataset.theme); } catch (e) {}
    render();
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', render);
  initFilters();
  initTransactions();
  let start = 'overview';
  try { start = localStorage.getItem('fin-tab') || 'overview'; } catch (e) {}
  switchTab(document.getElementById('tab-' + start) ? start : 'overview');
})();
