/* Defense Budget Tracker: queries budget.sqlite in the browser with sql.js.
   Views: Sector trends, Line explorer, Movers. Amounts in the database are $K. */
(function () {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };

  // ---------------------------------------------------------------- formatting
  function money(k, opts = {}) {
    if (k == null || Number.isNaN(k)) return '–';
    const sign = k < 0 ? '−' : (opts.plus && k > 0 ? '+' : '');
    const a = Math.abs(k);
    if (a >= 1e6) return `${sign}$${(a / 1e6).toFixed(a >= 1e7 ? 1 : 2)}B`;
    if (a >= 1e3) return `${sign}$${(a / 1e3).toFixed(a >= 1e5 ? 0 : 1)}M`;
    if (a === 0) return '$0';
    return `${sign}$${a.toFixed(0)}K`;
  }
  const pct = (x, plus = true) => (x == null || !Number.isFinite(x)) ? '–' : `${plus && x > 0 ? '+' : x < 0 ? '−' : ''}${Math.abs(x * 100).toFixed(1)}%`;
  const fyLabel = (fy) => `FY${String(fy).slice(2)}`;
  const VT_LABEL = { actual: 'Actual', enacted: 'Enacted', request: 'Request', cr: 'CR', reconciliation: 'Reconciliation', supplemental: 'Supplemental', fydp: 'FYDP' };

  // ---------------------------------------------------------------- data
  const D = { meta: {}, segments: [], subs: {}, segOf: {}, lines: [], byId: {}, programs: [], years: [] };
  const S = { basis: 'best', mandatory: true, view: 'trends', sort: { key: 'delta', dir: -1 } };

  function rows(db, sql, params) {
    const st = db.prepare(sql);
    if (params) st.bind(params);
    const out = [];
    while (st.step()) out.push(st.getAsObject());
    st.free();
    return out;
  }

  function loadModel(db) {
    D.meta = Object.fromEntries(rows(db, 'SELECT key, value FROM meta').map((r) => [r.key, r.value]));
    D.segments = rows(db, 'SELECT id, code, name, sort FROM segments ORDER BY sort');
    D.segments.forEach((s, i) => { s.color = i < 8 ? `var(--s${i + 1})` : 'var(--ink-3)'; });
    for (const s of rows(db, 'SELECT id, segment_id, name, sort FROM subsegments ORDER BY sort')) {
      D.subs[s.id] = s;
      D.segOf[s.id] = s.segment_id;
    }
    // Subsegment colors follow their order inside the segment, so they stay fixed under filters.
    for (const seg of D.segments) {
      Object.values(D.subs).filter((s) => s.segment_id === seg.id)
        .forEach((s, i) => { s.color = i < 8 ? `var(--s${i + 1})` : 'var(--ink-3)'; });
    }
    D.programs = rows(db, 'SELECT id, name FROM programs ORDER BY name');
    D.lines = rows(db, `SELECT l.*, s.status, s.method, s.rule_id, s.confidence, s.rationale
                        FROM budget_lines l LEFT JOIN line_status s USING (line_id)`);
    for (const l of D.lines) { l.subs = []; l.programs = []; l.vals = {}; D.byId[l.line_id] = l; }
    for (const m of rows(db, 'SELECT line_id, subsegment_id, weight, method, confidence, rationale, reviewer FROM line_sector_map ORDER BY weight DESC')) {
      D.byId[m.line_id]?.subs.push(m);
    }
    for (const p of rows(db, 'SELECT line_id, program_id FROM line_program')) D.byId[p.line_id]?.programs.push(p.program_id);
    for (const v of rows(db, 'SELECT line_id, fy, value_type, amount_k, source_doc FROM v_values_latest')) {
      const l = D.byId[v.line_id];
      if (!l) continue;
      (l.vals[v.fy] ||= {})[v.value_type] = { amt: v.amount_k, src: v.source_doc };
    }
    const first = +D.meta.first_fy || 2021, last = +D.meta.last_fy || 2027;
    const present = new Set(rows(db, 'SELECT DISTINCT fy FROM budget_values').map((r) => r.fy));
    D.years = [];
    for (let y = first; y <= last; y++) if (present.has(y)) D.years.push(y);
    D.requestYears = [...new Set(rows(db, "SELECT DISTINCT fy FROM budget_values WHERE value_type='request' ORDER BY fy").map((r) => r.fy))]
      .filter((y) => y >= first && y <= last);
    D.db = db;
  }

  const v = (l, fy, vt) => l.vals[fy]?.[vt]?.amt;
  function core(l, fy) {
    if (S.basis === 'best') {
      for (const vt of ['actual', 'enacted', 'request']) { const x = v(l, fy, vt); if (x != null) return [x, vt]; }
      return [undefined, null];
    }
    return [v(l, fy, S.basis), S.basis];
  }
  function amount(l, fy) {
    const [c] = core(l, fy);
    let t = c;
    if (S.mandatory) for (const vt of ['reconciliation', 'supplemental']) {
      const x = v(l, fy, vt);
      if (x != null) t = (t || 0) + x;
    }
    return t;
  }
  const primarySeg = (l) => (l.subs[0] ? D.segOf[l.subs[0].subsegment_id] : null);

  // ---------------------------------------------------------------- tooltip
  const tip = $('#tooltip');
  function showTip(html, ev) {
    tip.innerHTML = html;
    tip.hidden = false;
    const r = tip.getBoundingClientRect();
    let x = ev.clientX + 14, y = ev.clientY + 14;
    if (x + r.width > innerWidth - 8) x = ev.clientX - r.width - 14;
    if (y + r.height > innerHeight - 8) y = ev.clientY - r.height - 14;
    tip.style.left = `${Math.max(8, x)}px`;
    tip.style.top = `${Math.max(8, y)}px`;
  }
  const hideTip = () => { tip.hidden = true; };

  // ---------------------------------------------------------------- sector trends
  function trendSeries() {
    const segFilter = $('#trend-segment').value;
    const series = segFilter
      ? Object.values(D.subs).filter((s) => s.segment_id === segFilter).map((s) => ({ id: s.id, name: s.name, color: s.color }))
      : D.segments.map((s) => ({ id: s.id, name: s.name, color: s.color }));
    const idx = Object.fromEntries(series.map((s, i) => [s.id, i]));
    const totals = series.map(() => Object.fromEntries(D.years.map((y) => [y, 0])));
    const basisUsed = Object.fromEntries(D.years.map((y) => [y, {}]));
    let all = Object.fromEntries(D.years.map((y) => [y, 0]));
    for (const l of D.lines) {
      for (const y of D.years) {
        const a = amount(l, y);
        if (a == null) continue;
        all[y] += a;
        if (l.status !== 'mapped') continue;
        const [, used] = core(l, y);
        for (const m of l.subs) {
          const key = segFilter ? m.subsegment_id : D.segOf[m.subsegment_id];
          if (segFilter && D.segOf[m.subsegment_id] !== segFilter) continue;
          const i = idx[key];
          if (i == null) continue;
          totals[i][y] += a * m.weight;
          if (used) basisUsed[y][used] = (basisUsed[y][used] || 0) + Math.abs(a * m.weight);
        }
      }
    }
    series.forEach((s, i) => { s.vals = totals[i]; s.sum = D.years.reduce((t, y) => t + totals[i][y], 0); });
    const kept = series.filter((s) => s.sum !== 0);
    const used = Object.fromEntries(D.years.map((y) => {
      const e = Object.entries(basisUsed[y]).sort((a, b) => b[1] - a[1])[0];
      return [y, e ? e[0] : null];
    }));
    return { series: kept, all, used };
  }

  function renderTrends() {
    const { series, all, used } = trendSeries();
    const ys = D.years;
    const tot = Object.fromEntries(ys.map((y) => [y, series.reduce((t, s) => t + s.vals[y], 0)]));
    const segName = $('#trend-segment').selectedOptions[0].textContent;
    const last = ys[ys.length - 1], prev = ys[ys.length - 2], first = ys[0];
    const cagr = (a, b, n) => (a > 0 && b > 0 && n > 0 ? (b / a) ** (1 / n) - 1 : null);
    $('#trend-caption').textContent = `${segName === 'All segments' ? 'Defense tech budget by segment' : segName + ' by subsegment'}, ${fyLabel(first)}–${fyLabel(last)}`;
    $('#trend-hint').textContent = basisHint();
    $('#trend-kpis').innerHTML = [
      kpi(`${fyLabel(last)} ${used[last] ? VT_LABEL[used[last]].toLowerCase() : ''}`, money(tot[last]), prev ? `${pct(tot[prev] ? tot[last] / tot[prev] - 1 : null)} vs ${fyLabel(prev)}` : ''),
      kpi(`CAGR ${fyLabel(first)}–${fyLabel(last)}`, pct(cagr(tot[first], tot[last], last - first)), `${money(tot[first])} → ${money(tot[last])}`),
      kpi(`Share of loaded budget, ${fyLabel(last)}`, pct(all[last] ? tot[last] / all[last] : null, false), `of ${money(all[last])} across all loaded lines`),
      kpi('Lines mapped to sectors', D.lines.filter((l) => l.status === 'mapped').length.toLocaleString(),
        `${D.lines.filter((l) => l.status === 'unclassified').length.toLocaleString()} unclassified of ${D.lines.length.toLocaleString()}`)
    ].join('');
    $('#trend-legend').innerHTML = series.map((s) => `<span><i class="swatch" style="background:${s.color}"></i>${esc(s.name)}</span>`).join('');
    drawStack(series, ys, tot, used);
    // Table view of the same numbers.
    const head = `<thead><tr><th>${segName === 'All segments' ? 'Segment' : 'Subsegment'}</th>${ys.map((y) => `<th class="num">${fyLabel(y)}</th>`).join('')}<th class="num">CAGR</th><th class="num">Share ${fyLabel(last)}</th></tr></thead>`;
    const body = series.map((s) => `<tr><td><span class="legend"><span><i class="swatch" style="background:${s.color}"></i>${esc(s.name)}</span></span></td>${ys.map((y) => `<td class="num">${money(s.vals[y])}</td>`).join('')}<td class="num">${pct(cagr(s.vals[first], s.vals[last], last - first))}</td><td class="num">${pct(tot[last] ? s.vals[last] / tot[last] : null, false)}</td></tr>`).join('');
    const foot = `<tfoot><tr><td>Total</td>${ys.map((y) => `<td class="num">${money(tot[y])}</td>`).join('')}<td class="num">${pct(cagr(tot[first], tot[last], last - first))}</td><td class="num">100%</td></tr></tfoot>`;
    $('#trend-table').innerHTML = head + `<tbody>${body || `<tr><td colspan="${ys.length + 3}">No mapped lines yet.</td></tr>`}</tbody>` + foot;
    $('#trend-note').textContent = 'Lines split across several subsegments are counted by weight. Each year uses the newest budget book that reports it. ' +
      (S.mandatory ? 'Reconciliation and supplemental funding are added to the year they were appropriated.' : 'Reconciliation and supplemental funding are excluded.');
  }

  function basisHint() {
    return S.basis === 'best' ? 'Best available: actuals where published, then enacted, then the request.' : `${VT_LABEL[S.basis]} values only.`;
  }
  const kpi = (label, value, sub) => `<div class="kpi"><div class="label">${esc(label)}</div><div class="value">${esc(value)}</div><div class="sub">${esc(sub)}</div></div>`;

  function niceMax(x) {
    if (x <= 0) return 1;
    const p = 10 ** Math.floor(Math.log10(x));
    const n = x / p;
    return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
  }

  function drawStack(series, ys, tot, used) {
    const el = $('#trend-chart');
    // Drawn at the container's pixel width so text stays at its CSS size; narrow screens scroll.
    const W = Math.max(520, Math.floor(el.clientWidth || 760)), H = 340, m = { t: 22, r: 12, b: 42, l: 64 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const max = niceMax(Math.max(1, ...ys.map((y) => series.reduce((t, s) => t + Math.max(0, s.vals[y]), 0))));
    const yS = (x) => m.t + ih - (x / max) * ih;
    const band = iw / ys.length, bw = Math.min(56, band * 0.62);
    let g = '';
    for (let i = 0; i <= 4; i++) {
      const val = (max / 4) * i, yy = yS(val);
      g += `<line class="grid" x1="${m.l}" x2="${W - m.r}" y1="${yy}" y2="${yy}"></line><text x="${m.l - 8}" y="${yy + 4}" text-anchor="end">${money(val)}</text>`;
    }
    let cols = '';
    ys.forEach((y, i) => {
      const x = m.l + band * i + (band - bw) / 2;
      let acc = 0, segs = '';
      const pos = series.filter((s) => s.vals[y] > 0);
      pos.forEach((s, j) => {
        const y0 = yS(acc), y1 = yS(acc + s.vals[y]);
        acc += s.vals[y];
        const h = Math.max(0, y0 - y1);
        if (j === pos.length - 1 && h > 4) {
          const r = 4;
          segs += `<path class="seg" fill="${s.color}" d="M${x},${y0}V${y1 + r}Q${x},${y1} ${x + r},${y1}H${x + bw - r}Q${x + bw},${y1} ${x + bw},${y1 + r}V${y0}Z" stroke="var(--panel)" stroke-width="2"></path>`;
        } else {
          segs += `<rect class="seg" fill="${s.color}" x="${x}" y="${y1}" width="${bw}" height="${h}"></rect>`;
        }
      });
      const lab = used[y] ? VT_LABEL[used[y]].toLowerCase() : '';
      cols += `<g class="col" data-fy="${y}">${segs}<rect x="${m.l + band * i}" y="${m.t}" width="${band}" height="${ih}" fill="transparent"></rect>` +
        `<text class="total-label" x="${x + bw / 2}" y="${yS(acc) - 6}" text-anchor="middle">${money(tot[y])}</text>` +
        `<text x="${x + bw / 2}" y="${H - m.b + 16}" text-anchor="middle">${fyLabel(y)}</text>` +
        `<text x="${x + bw / 2}" y="${H - m.b + 30}" text-anchor="middle">${lab}</text></g>`;
    });
    const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Stacked bar chart of budget by fiscal year">${g}<line class="axis" x1="${m.l}" x2="${W - m.r}" y1="${yS(0)}" y2="${yS(0)}"></line>${cols}</svg>`;
    el.innerHTML = svg;
    $$('.col', el).forEach((c) => {
      const y = +c.dataset.fy;
      c.addEventListener('mousemove', (ev) => {
        const items = series.filter((s) => s.vals[y]).slice().reverse();
        showTip(`<strong>${fyLabel(y)}</strong> · ${money(tot[y])}` + items.map((s) =>
          `<div class="row"><span><i class="swatch" style="display:inline-block;background:${s.color}"></i> ${esc(s.name)}</span><b>${money(s.vals[y])}</b></div>`).join(''), ev);
      });
      c.addEventListener('mouseleave', hideTip);
    });
  }

  // ---------------------------------------------------------------- line explorer
  function sectorChips(l) {
    if (l.status === 'mapped') {
      return l.subs.map((m) => `<span class="chip ${m.method}" title="${esc(m.method)}${m.confidence != null ? ' · confidence ' + m.confidence : ''}">${esc(D.subs[m.subsegment_id]?.name || m.subsegment_id)}${m.weight < 1 ? ' ' + Math.round(m.weight * 100) + '%' : ''}</span>`).join(' ');
    }
    return `<span class="chip ${l.status || 'unclassified'}">${l.status === 'not_tech' ? 'Not defense tech' : 'Unclassified'}</span>`;
  }

  function lineRows() {
    const by = +$('#f-by').value;
    const q = $('#f-q').value.trim().toLowerCase();
    const comp = $('#f-component').value, ap = $('#f-approp').value, seg = $('#f-segment').value,
      sub = $('#f-sub').value, prog = $('#f-program').value, st = $('#f-status').value;
    const out = [];
    for (const l of D.lines) {
      if (comp && l.component !== comp) continue;
      if (ap && l.appropriation !== ap) continue;
      if (st && l.status !== st) continue;
      if (seg && !l.subs.some((m) => D.segOf[m.subsegment_id] === seg)) continue;
      if (sub && !l.subs.some((m) => m.subsegment_id === sub)) continue;
      if (prog && !l.programs.includes(prog)) continue;
      if (q && !`${l.title} ${l.pe_bli} ${l.account} ${l.account_title} ${l.line_id}`.toLowerCase().includes(q)) continue;
      const py = v(l, by - 2, 'actual'), cy = v(l, by - 1, 'enacted'), req = v(l, by, 'request');
      const recon = (v(l, by, 'reconciliation') || 0) + (v(l, by, 'supplemental') || 0);
      if (py == null && cy == null && req == null && !recon) continue;
      const base = cy ?? 0, now = (req ?? 0) + (S.mandatory ? recon : 0);
      const delta = now - base;
      out.push({ l, py, cy, req, recon: recon || null, delta, deltaPct: base ? delta / Math.abs(base) : null,
        sector: l.subs[0] ? D.subs[l.subs[0].subsegment_id]?.name : '', title: l.title });
    }
    const { key, dir } = S.sort;
    out.sort((a, b) => {
      const x = a[key], y = b[key];
      if (typeof x === 'string' || typeof y === 'string') return dir * String(x ?? '').localeCompare(String(y ?? ''));
      return dir * ((x ?? -Infinity) - (y ?? -Infinity));
    });
    return { out, by };
  }

  const LIMIT = 400;
  function renderLines() {
    const { out, by } = lineRows();
    const cols = [
      ['title', 'Budget line'], ['component', 'Component'], ['sector', 'Sector'],
      ['py', `${fyLabel(by - 2)} actual`, 1], ['cy', `${fyLabel(by - 1)} enacted`, 1], ['req', `${fyLabel(by)} request`, 1],
      ['recon', `${fyLabel(by)} recon / supp`, 1], ['delta', 'Δ $', 1], ['deltaPct', 'Δ %', 1]
    ];
    const th = cols.map(([k, label, num]) => `<th data-key="${k}" class="${num ? 'num' : ''}" ${S.sort.key === k ? `aria-sort="${S.sort.dir > 0 ? 'ascending' : 'descending'}"` : ''}>${esc(label)}</th>`).join('');
    const body = out.slice(0, LIMIT).map((r) => `<tr class="clickable" data-id="${esc(r.l.line_id)}" tabindex="0">
      <td class="title">${esc(r.l.title)}<span class="code">${esc(r.l.appropriation)} · ${esc(r.l.account)} · ${esc(r.l.pe_bli || '')}</span></td>
      <td>${esc(r.l.component)}</td><td>${sectorChips(r.l)}</td>
      <td class="num">${money(r.py)}</td><td class="num">${money(r.cy)}</td><td class="num">${money(r.req)}</td><td class="num">${r.recon ? money(r.recon) : '–'}</td>
      <td class="num ${r.delta > 0 ? 'up' : r.delta < 0 ? 'down' : ''}">${money(r.delta, { plus: true })}</td>
      <td class="num ${r.delta > 0 ? 'up' : r.delta < 0 ? 'down' : ''}">${pct(r.deltaPct)}</td></tr>`).join('');
    const sum = (k) => out.reduce((t, r) => t + (r[k] || 0), 0);
    const foot = `<tfoot><tr><td>Total (${out.length.toLocaleString()} lines)</td><td></td><td></td><td class="num">${money(sum('py'))}</td><td class="num">${money(sum('cy'))}</td><td class="num">${money(sum('req'))}</td><td class="num">${money(sum('recon'))}</td><td class="num">${money(sum('delta'), { plus: true })}</td><td class="num">${pct(sum('cy') ? sum('delta') / sum('cy') : null)}</td></tr></tfoot>`;
    $('#lines-table').innerHTML = `<thead><tr>${th}</tr></thead><tbody>${body || '<tr><td colspan="9">No lines match these filters.</td></tr>'}</tbody>${foot}`;
    $('#lines-count').textContent = out.length > LIMIT ? `Showing the first ${LIMIT} of ${out.length.toLocaleString()} lines. Narrow the filters or copy all as CSV.` : `${out.length.toLocaleString()} lines`;
    D.lastLines = { out, by };
  }

  function linesCsv() {
    const { out, by } = D.lastLines;
    const head = ['line_id', 'title', 'appropriation', 'account', 'pe_bli', 'component', 'status', 'subsegments',
      `fy${by - 2}_actual_k`, `fy${by - 1}_enacted_k`, `fy${by}_request_k`, `fy${by}_recon_supp_k`, 'delta_k'];
    const q = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
    return [head.join(',')].concat(out.map((r) => [r.l.line_id, r.l.title, r.l.appropriation, r.l.account, r.l.pe_bli, r.l.component,
      r.l.status, r.l.subs.map((m) => `${m.subsegment_id}:${m.weight}`).join(';'), r.py, r.cy, r.req, r.recon, r.delta].map(q).join(','))).join('\n');
  }

  function openDetail(id) {
    const l = D.byId[id];
    if (!l) return;
    $('#detail-eyebrow').textContent = `${l.appropriation} · ${l.component || ''} · ${l.account || ''} ${l.pe_bli || ''}`;
    $('#detail-title').textContent = l.title;
    const vt = ['actual', 'enacted', 'request', 'cr', 'reconciliation', 'supplemental'];
    const fys = Object.keys(l.vals).map(Number).sort();
    const usedVt = vt.filter((t) => fys.some((y) => l.vals[y][t]));
    const hist = `<div class="table-wrap"><table class="data"><thead><tr><th>FY</th>${usedVt.map((t) => `<th class="num">${VT_LABEL[t]}</th>`).join('')}</tr></thead><tbody>` +
      fys.map((y) => `<tr><td>${fyLabel(y)}</td>${usedVt.map((t) => { const c = l.vals[y][t]; return `<td class="num" title="${c ? esc(c.src) : ''}">${c ? money(c.amt) : '–'}</td>`; }).join('')}</tr>`).join('') +
      '</tbody></table></div>';
    const allRows = rows(D.db, 'SELECT fy, value_type, amount_k, source_doc, page FROM budget_values WHERE line_id = ? ORDER BY fy, value_type, book_fy', [id]);
    const books = `<details><summary class="subtle">Every value by source book (${allRows.length})</summary><div class="table-wrap"><table class="data"><thead><tr><th>FY</th><th>Type</th><th class="num">Amount</th><th>Source</th><th>Cell</th></tr></thead><tbody>` +
      allRows.map((r) => `<tr><td>${fyLabel(r.fy)}</td><td>${VT_LABEL[r.value_type]}</td><td class="num">${money(r.amount_k)}</td><td>${esc(r.source_doc)}</td><td>${esc(r.page || '')}</td></tr>`).join('') + '</tbody></table></div></details>';
    const cls = l.status === 'mapped'
      ? l.subs.map((m) => `${esc(D.subs[m.subsegment_id]?.name)} (${Math.round(m.weight * 100)}%)`).join(', ')
      : (l.status === 'not_tech' ? 'Not defense tech' : 'Unclassified');
    const how = l.method === 'human' ? 'Analyst decision' : l.method === 'rule' ? `Rule ${l.rule_id}` : l.method || 'No rule matched';
    $('#detail-body').innerHTML = `<dl class="facts">
        <div><dt>Sector</dt><dd>${cls}</dd></div>
        <div><dt>Classified by</dt><dd>${esc(how)}${l.confidence != null ? ` · confidence ${l.confidence}` : ''}</dd></div>
        <div><dt>Programs</dt><dd>${l.programs.length ? l.programs.map((p) => esc(D.programs.find((x) => x.id === p)?.name || p)).join(', ') : 'None linked'}</dd></div>
        <div><dt>Account</dt><dd>${esc(l.account_title || l.account || '–')}</dd></div>
        <div><dt>Budget activity</dt><dd>${esc([l.budget_activity, l.ba_title].filter(Boolean).join(' · ') || '–')}</dd></div>
        <div><dt>Books</dt><dd>FY${l.first_book}${l.last_book !== l.first_book ? `–FY${l.last_book}` : ''}</dd></div>
      </dl>
      ${l.rationale ? `<p class="subtle">${esc(l.rationale)}</p>` : ''}
      <h3>History</h3>${hist}${books}
      <p class="subtle">Awards linked to this line (inferred from announcements and the program registry) arrive with the awards data in Phase 2.</p>`;
    const dlg = $('#detail');
    if (!dlg.open) dlg.showModal();
  }

  // ---------------------------------------------------------------- movers
  function renderMovers() {
    const by = +$('#m-by').value;
    const techOnly = $('#m-tech').checked;
    const pool = D.lines.filter((l) => !techOnly || l.status === 'mapped');
    const reqNow = (l) => (v(l, by, 'request') ?? 0) + (S.mandatory ? (v(l, by, 'reconciliation') || 0) : 0);
    const changes = pool.map((l) => {
      const before = v(l, by - 1, 'enacted'), now = v(l, by, 'request');
      if (before == null && now == null) return null;
      return { l, from: before ?? 0, to: reqNow(l), delta: reqNow(l) - (before ?? 0) };
    }).filter(Boolean);
    const inc = changes.filter((c) => c.delta > 0).sort((a, b) => b.delta - a.delta).slice(0, 10);
    const cut = changes.filter((c) => c.delta < 0).sort((a, b) => a.delta - b.delta).slice(0, 10);
    const priorFunded = (l) => Object.entries(l.vals).some(([y, o]) => +y < by && Object.values(o).some((c) => c.amt > 0));
    const starts = pool.filter((l) => (v(l, by, 'request') || 0) > 0 && !priorFunded(l))
      .map((l) => ({ l, from: 0, to: reqNow(l), delta: reqNow(l) })).sort((a, b) => b.to - a.to).slice(0, 10);
    const ends = pool.filter((l) => (v(l, by - 1, 'enacted') || 0) > 0 && !(v(l, by, 'request') > 0) && (l.exhibit || '').match(/^[rpom]1$/))
      .map((l) => ({ l, from: v(l, by - 1, 'enacted'), to: 0, delta: -v(l, by - 1, 'enacted'),
        note: l.last_book < by ? 'dropped from book' : 'zero request' }))
      .sort((a, b) => a.delta - b.delta).slice(0, 10);
    const gy = by - 1;
    const gaps = pool.map((l) => {
      const r = v(l, gy, 'request'), e = v(l, gy, 'enacted');
      if (r == null || e == null || r === e) return null;
      return { l, from: r, to: e, delta: e - r };
    }).filter(Boolean).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)).slice(0, 12);
    $('#movers').innerHTML = [
      moverCard('Biggest increases', `${fyLabel(by)} request vs ${fyLabel(by - 1)} enacted`, inc, `${fyLabel(by - 1)} enacted`, `${fyLabel(by)} request`),
      moverCard('Biggest cuts', `${fyLabel(by)} request vs ${fyLabel(by - 1)} enacted`, cut, `${fyLabel(by - 1)} enacted`, `${fyLabel(by)} request`),
      moverCard('New starts', `Funded in the ${fyLabel(by)} request with no funding in any earlier year`, starts, 'Before', `${fyLabel(by)} request`),
      moverCard('Terminations', `Enacted in ${fyLabel(by - 1)}, no ${fyLabel(by)} request`, ends, `${fyLabel(by - 1)} enacted`, `${fyLabel(by)} request`),
      moverCard('Congress vs the request', `${fyLabel(gy)} enacted minus ${fyLabel(gy)} request, a proxy for congressional adds and cuts`, gaps, `${fyLabel(gy)} request`, `${fyLabel(gy)} enacted`)
    ].join('');
  }

  function moverCard(title, sub, list, fromLabel, toLabel) {
    const max = Math.max(1, ...list.map((c) => Math.abs(c.delta)));
    const body = list.map((c) => `<tr class="clickable" data-id="${esc(c.l.line_id)}" tabindex="0">
      <td class="title">${esc(c.l.title)}<span class="code">${esc(c.l.component)} · ${esc(c.l.subs[0] ? D.subs[c.l.subs[0].subsegment_id]?.name : (c.l.status === 'not_tech' ? 'Not defense tech' : 'Unclassified'))}${c.note ? ' · ' + c.note : ''}</span></td>
      <td class="num">${money(c.from)}</td><td class="num">${money(c.to)}</td>
      <td class="num ${c.delta > 0 ? 'up' : 'down'}">${money(c.delta, { plus: true })}</td>
      <td class="bar-cell" aria-hidden="true"><span class="${c.delta < 0 ? 'neg' : ''}" style="width:${(Math.abs(c.delta) / max) * 100}%"></span></td></tr>`).join('');
    return `<section class="mover-card"><h3>${esc(title)}</h3><p>${esc(sub)}</p>
      <div class="table-wrap"><table class="data"><thead><tr><th>Line</th><th class="num">${esc(fromLabel)}</th><th class="num">${esc(toLabel)}</th><th class="num">Δ</th><th></th></tr></thead>
      <tbody>${body || '<tr><td colspan="5">None for this year.</td></tr>'}</tbody></table></div></section>`;
  }

  // ---------------------------------------------------------------- shell
  function setView(view) {
    if (!['trends', 'lines', 'movers'].includes(view)) view = 'trends';
    S.view = view;
    $$('.tabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.view === view)));
    $$('.view').forEach((v) => { v.hidden = v.id !== `view-${view}`; });
    if (location.hash !== `#${view}`) history.replaceState(null, '', `#${view}`);
    render();
  }
  function render() {
    if (!D.db) return;
    if (S.view === 'trends') renderTrends();
    else if (S.view === 'lines') renderLines();
    else renderMovers();
  }

  function fill(sel, items, keepFirst = true) {
    const el = $(sel);
    const first = keepFirst ? el.options[0].outerHTML : '';
    el.innerHTML = first + items.map(([v, l]) => `<option value="${esc(v)}">${esc(l)}</option>`).join('');
  }

  function populate() {
    const used = new Set(D.lines.flatMap((l) => l.subs.map((m) => D.segOf[m.subsegment_id])));
    const segs = D.segments.filter((s) => used.has(s.id)).map((s) => [s.id, s.name]);
    fill('#trend-segment', segs);
    fill('#f-segment', segs);
    fill('#f-sub', Object.values(D.subs).filter((s) => D.lines.some((l) => l.subs.some((m) => m.subsegment_id === s.id))).map((s) => [s.id, s.name]));
    fill('#f-component', [...new Set(D.lines.map((l) => l.component).filter(Boolean))].sort().map((c) => [c, c]));
    fill('#f-approp', [...new Set(D.lines.map((l) => l.appropriation))].sort().map((c) => [c, c]));
    const progs = new Set(D.lines.flatMap((l) => l.programs));
    fill('#f-program', D.programs.filter((p) => progs.has(p.id)).map((p) => [p.id, p.name]));
    const years = D.requestYears.slice().reverse().map((y) => [y, `FY${y}`]);
    fill('#f-by', years, false);
    fill('#m-by', years, false);
    const sample = D.meta.sample === '1';
    $('#sample-banner').hidden = !sample;
    $('#foot').textContent = `Database built ${D.meta.built || '?'} from budget books FY${(D.meta.books || '').split(',').join(', FY')}. ` +
      `Taxonomy: market map ${D.meta.taxonomy_edition || ''} (${D.meta.taxonomy_as_of || ''}). ` +
      `${D.meta.exhibit_checks || 0} printed totals checked, ${D.meta.exhibit_mismatches || 0} mismatches. Amounts in ${D.meta.units || '$K'}, shown as $M / $B.`;
  }

  function bind() {
    $$('.tabs button').forEach((b) => b.addEventListener('click', () => setView(b.dataset.view)));
    window.addEventListener('hashchange', () => setView(location.hash.slice(1)));
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (S.view === 'trends') render(); }, 150); });
    $('#basis').addEventListener('change', (e) => { S.basis = e.target.value; render(); });
    $('#mandatory').addEventListener('change', (e) => { S.mandatory = e.target.checked; render(); });
    $('#trend-segment').addEventListener('change', render);
    $$('#view-lines select').forEach((s) => s.addEventListener('change', render));
    let t;
    $('#f-q').addEventListener('input', () => { clearTimeout(t); t = setTimeout(render, 120); });
    $('#lines-table').addEventListener('click', (e) => {
      const th = e.target.closest('th[data-key]');
      if (th) {
        const k = th.dataset.key;
        S.sort = { key: k, dir: S.sort.key === k ? -S.sort.dir : (['title', 'component', 'sector'].includes(k) ? 1 : -1) };
        return render();
      }
    });
    for (const sel of ['#lines-table', '#movers']) {
      $(sel).addEventListener('click', (e) => { const tr = e.target.closest('tr[data-id]'); if (tr) openDetail(tr.dataset.id); });
      $(sel).addEventListener('keydown', (e) => { const tr = e.target.closest('tr[data-id]'); if (tr && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openDetail(tr.dataset.id); } });
    }
    $('#m-by').addEventListener('change', render);
    $('#m-tech').addEventListener('change', render);
    $('#lines-copy').addEventListener('click', async (e) => {
      const btn = e.currentTarget, text = linesCsv();
      try { await navigator.clipboard.writeText(text); btn.textContent = 'Copied'; }
      catch (err) { btn.textContent = 'Copy blocked by the browser'; }
      setTimeout(() => { btn.textContent = 'Copy as CSV'; }, 1600);
    });
    $('#detail-close').addEventListener('click', () => $('#detail').close());
    $('#detail').addEventListener('click', (e) => { if (e.target.id === 'detail') e.target.close(); });
    $('#theme-btn').addEventListener('click', () => {
      const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      store.set('dbt-theme', next);
    });
    $('#db-file').addEventListener('change', async (e) => {
      const f = e.target.files[0];
      if (f) start(new Uint8Array(await f.arrayBuffer()));
    });
  }

  let SQL;
  function start(bytes) {
    try {
      loadModel(new SQL.Database(bytes));
    } catch (err) {
      $('#loader').hidden = false;
      $('#load-error').hidden = false;
      $('#load-error').textContent = `That file could not be read as a budget database: ${err.message}`;
      return;
    }
    $('#loader').hidden = true;
    populate();
    setView(location.hash.slice(1) || 'trends');
  }

  async function boot() {
    const saved = store.get('dbt-theme');
    if (saved === 'dark' || saved === 'light') document.documentElement.dataset.theme = saved;
    bind();
    if (typeof window.initSqlJs !== 'function') {
      $('#loader').hidden = false;
      $('#load-error').hidden = false;
      $('#load-error').textContent = 'The SQL engine (sql.js) did not load. Check the network connection and reload.';
      return;
    }
    SQL = await window.initSqlJs({});
    if (window.BUDGET_DB_B64) {
      const bin = atob(window.BUDGET_DB_B64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return start(bytes);
    }
    if (/^https?:/.test(location.protocol)) {
      try {
        const r = await fetch('../build/budget.sqlite');
        if (r.ok) return start(new Uint8Array(await r.arrayBuffer()));
      } catch (e) { /* fall through to the file picker */ }
    }
    $('#loader').hidden = false;
  }

  window.BudgetApp = { D, S, render, setView };
  boot();
})();
