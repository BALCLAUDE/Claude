/* Awards explorer and Company view. Award amounts are in dollars (USAspending), unlike budget
   lines ($K). Registers with app.js through BudgetApp.register. */
(function () {
  'use strict';
  const B = window.BudgetApp;
  const { $, esc, pct, rows, kpi } = B.h;
  const D = B.D;
  const usd = (x, opts) => B.h.money(x == null ? x : x / 1000, opts);  // money() takes $K
  const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const A = { loaded: false };

  // ---------------------------------------------------------------- data
  function load() {
    if (A.loaded) return;
    const db = D.db;
    const has = (t) => rows(db, "SELECT name FROM sqlite_master WHERE type='table' AND name=?", [t]).length > 0;
    A.available = has('company_obligations_month') && rows(db, 'SELECT 1 FROM company_obligations_month LIMIT 1').length > 0;
    A.companies = Object.fromEntries(rows(db, 'SELECT * FROM companies').map((c) => [c.id, c]));
    A.subs = Object.fromEntries(rows(db, 'SELECT s.id, s.name, s.segment_id, s.sort FROM subsegments s').map((s) => [s.id, s]));
    A.segName = Object.fromEntries(rows(db, 'SELECT id, name FROM segments').map((s) => [s.id, s.name]));
    if (!A.available) { A.loaded = true; return; }
    // Fiscal months as one index (FY*12 + month, month 1 = October).
    A.months = {};
    let total = {};
    for (const r of rows(db, 'SELECT company_id, fy, month, obligated FROM company_obligations_month')) {
      const i = r.fy * 12 + r.month;
      (A.months[r.company_id] ||= {})[i] = r.obligated;
      total[i] = (total[i] || 0) + r.obligated;
    }
    // DoD contract data reaches USAspending with a 90-day delay, so the latest months are thin.
    // "Data through" is the last month at or above half the trailing-year monthly average.
    const idx = Object.keys(total).map(Number).sort((a, b) => a - b);
    let through = idx[idx.length - 1];
    for (let k = idx.length - 1; k >= 12; k--) {
      const avg = idx.slice(k - 12, k).reduce((t, i) => t + total[i], 0) / 12;
      if (total[idx[k]] >= 0.5 * avg) { through = idx[k]; break; }
    }
    A.through = through;
    A.sectorFy = {};
    for (const r of rows(db, 'SELECT company_id, fy, subsegment_id, SUM(obligated) AS o FROM company_sector_fy GROUP BY 1, 2, 3')) {
      ((A.sectorFy[r.company_id] ||= {})[r.fy] ||= {})[r.subsegment_id] = r.o;
    }
    A.fys = rows(db, 'SELECT DISTINCT fy FROM company_obligations_month ORDER BY fy').map((r) => r.fy);
    A.ueis = {};
    for (const r of rows(db, 'SELECT company_id, COUNT(*) AS n FROM entity_aliases GROUP BY 1')) A.ueis[r.company_id] = r.n;
    A.loaded = true;
  }
  const monthLabel = (i) => { const fy = Math.floor((i - 1) / 12), m = ((i - 1) % 12) + 1; return `${MONTHS[m - 1]} ${m <= 3 ? fy - 1 : fy}`; };
  function ttm(cid, end = A.through) {
    const m = A.months[cid] || {};
    let cur = 0, prior = 0;
    for (let k = 0; k < 12; k++) { cur += m[end - k] || 0; prior += m[end - 12 - k] || 0; }
    return { cur, prior, growth: prior > 0 ? cur / prior - 1 : null };
  }
  const fyTotal = (cid, fy) => { const m = A.months[cid] || {}; let t = 0; for (let k = 1; k <= 12; k++) t += m[fy * 12 + k] || 0; return t; };
  const subName = (id) => A.subs[id]?.name || id;
  // An award whose product code names no sector is split evenly across the company's map
  // subsegments; show that as one chip rather than a row of guesses.
  function sectorChips(sectors, method) {
    const list = (sectors || '').split('|').filter(Boolean).map((x) => { const [id, w] = x.split(':'); return { id, w: w == null ? null : +w }; });
    if (method === 'company' && list.length > 2) {
      return `<span class="chip" title="${esc(list.map((x) => subName(x.id)).join(', '))}">Split across ${list.length} map sectors</span>`;
    }
    return list.map((x) => `<span class="chip">${esc(subName(x.id))}${x.w != null && x.w < 1 ? ' ' + Math.round(x.w * 100) + '%' : ''}</span>`).join(' ');
  }
  const companyLink = (cid, label) => `<a href="#company-${esc(cid)}">${esc(label || A.companies[cid]?.name || cid)}</a>`;
  const noData = (el) => { el.innerHTML = '<section class="empty"><h2>No award data in this database</h2><p>Award data comes from USAspending. Run <code>python -m budget.etl entities</code> and <code>python -m budget.etl awards</code>, then rebuild.</p></section>'; };

  // ---------------------------------------------------------------- awards explorer
  function renderAwards() {
    load();
    if (!A.available) return noData($('#awards-body'));
    const f = {
      q: $('#aw-q').value.trim().toLowerCase(), company: $('#aw-company').value, segment: $('#aw-segment').value,
      agency: $('#aw-agency').value, type: $('#aw-type').value, from: +$('#aw-from').value || 0, min: +$('#aw-min').value || 0
    };
    const where = ['1=1'], params = [];
    if (f.company) { where.push('a.company_id = ?'); params.push(f.company); }
    if (f.agency) { where.push('a.sub_agency = ?'); params.push(f.agency); }
    if (f.type) { where.push('a.award_type = ?'); params.push(f.type); }
    if (f.from) { where.push("substr(a.start_date, 1, 4) >= ?"); params.push(String(f.from)); }
    if (f.min) { where.push('a.obligated >= ?'); params.push(f.min); }
    if (f.segment) { where.push('EXISTS (SELECT 1 FROM award_sector_map m JOIN subsegments s ON s.id = m.subsegment_id WHERE m.award_id = a.award_id AND s.segment_id = ?)'); params.push(f.segment); }
    if (f.q) { where.push("lower(coalesce(a.description,'') || ' ' || coalesce(a.piid,'') || ' ' || coalesce(a.recipient_name,'') || ' ' || coalesce(a.psc_name,'')) LIKE ?"); params.push(`%${f.q}%`); }
    const list = rows(D.db, `SELECT a.*, (SELECT group_concat(m.subsegment_id || ':' || m.weight, '|') FROM award_sector_map m WHERE m.award_id = a.award_id) AS sectors
      FROM awards a WHERE ${where.join(' AND ')} ORDER BY a.obligated DESC LIMIT 300`, params);
    const count = rows(D.db, `SELECT COUNT(*) AS n, SUM(a.obligated) AS t FROM awards a WHERE ${where.join(' AND ')}`, params)[0];
    $('#aw-count').textContent = `${count.n.toLocaleString()} awards, ${usd(count.t)} obligated${count.n > 300 ? '. Showing the largest 300.' : ''}`;
    $('#aw-table').innerHTML = `<thead><tr><th>Award</th><th>Company</th><th>Agency</th><th>Sector</th><th>Period</th><th class="num">Obligated</th></tr></thead><tbody>` +
      (list.map((a) => `<tr>
        <td class="title"><a href="https://www.usaspending.gov/award/${encodeURIComponent(a.award_id)}" target="_blank" rel="noopener">${esc(a.piid)}</a> ${esc((a.description || '').slice(0, 140))}
          <span class="code">${esc(a.award_type || '')} · PSC ${esc(a.psc || '–')} ${esc(a.psc_name ? '· ' + a.psc_name.slice(0, 60) : '')}${a.parent_idv ? ' · order on ' + esc(a.parent_idv.split('_')[2]) : ''}</span></td>
        <td>${companyLink(a.company_id)}<span class="code">${esc(a.recipient_name || '')}</span></td>
        <td>${esc(a.sub_agency || '')}</td><td class="sectors">${sectorChips(a.sectors, a.sector_method)}</td>
        <td>${esc((a.start_date || '').slice(0, 7))} – ${esc((a.end_date || '').slice(0, 7))}</td>
        <td class="num">${usd(a.obligated)}</td></tr>`).join('') || '<tr><td colspan="6">No awards match these filters.</td></tr>') + '</tbody>';
    renderUniverse();
  }

  function renderUniverse() {
    const rule = $('#aw-rule').value;
    if (!rule) return;
    const data = rows(D.db, 'SELECT fy, rank, recipient, uei, company_id, obligated FROM sector_recipients_fy WHERE rule_id = ?', [rule]);
    const fys = [...new Set(data.map((r) => r.fy))].sort();
    const by = {};
    for (const r of data) {
      const key = r.company_id || `uei:${r.uei || r.recipient}`;
      const o = (by[key] ||= { name: r.recipient, company_id: r.company_id, vals: {}, total: 0 });
      o.vals[r.fy] = (o.vals[r.fy] || 0) + r.obligated;
      o.total += r.obligated;
      if (r.company_id) o.name = A.companies[r.company_id]?.name || r.recipient;
    }
    const top = Object.values(by).sort((a, b) => b.total - a.total).slice(0, 15);
    const sum = Object.fromEntries(fys.map((y) => [y, data.filter((r) => r.fy === y).reduce((t, r) => t + r.obligated, 0)]));
    $('#aw-universe').innerHTML = `<thead><tr><th>Recipient</th>${fys.map((y) => `<th class="num">${B.h.fyLabel(y)}</th>`).join('')}<th class="num">Total</th></tr></thead><tbody>` +
      top.map((o) => `<tr><td>${o.company_id ? companyLink(o.company_id, o.name) + ' <span class="chip human">on map</span>' : esc(o.name)}</td>${fys.map((y) => `<td class="num">${usd(o.vals[y])}</td>`).join('')}<td class="num">${usd(o.total)}</td></tr>`).join('') +
      `</tbody><tfoot><tr><td>Top 25 recipients, combined</td>${fys.map((y) => `<td class="num">${usd(sum[y])}</td>`).join('')}<td class="num">${usd(Object.values(sum).reduce((a, b) => a + b, 0))}</td></tr></tfoot>`;
  }

  // ---------------------------------------------------------------- companies
  function renderCompanies(param) {
    load();
    const el = $('#co-body');
    if (!A.available) return noData(el);
    if (param && A.companies[param]) return renderCompany(param);
    $('#co-picker').value = '';
    const q = $('#co-q').value.trim().toLowerCase(), status = $('#co-status').value;
    const shownFys = A.fys.filter((y) => y * 12 + 12 <= A.through).slice(-5);  // complete fiscal years
    const list = Object.keys(A.months).map((cid) => {
      const c = A.companies[cid];
      const t = ttm(cid);
      const sec = Object.entries(Object.values(A.sectorFy[cid] || {}).reduce((acc, o) => { for (const [k, v] of Object.entries(o)) acc[k] = (acc[k] || 0) + v; return acc; }, {})).sort((a, b) => b[1] - a[1])[0];
      return { c, cid, t, sec: sec ? sec[0] : null, fy: Object.fromEntries(shownFys.map((y) => [y, fyTotal(cid, y)])) };
    }).filter((r) => r.c && (!q || r.c.name.toLowerCase().includes(q)) && (!status || r.c.status === status))
      .sort((a, b) => b.t.cur - a.t.cur);
    const head = `<thead><tr><th>Company</th><th>Main DoD sector</th>${shownFys.map((y) => `<th class="num">${B.h.fyLabel(y)}</th>`).join('')}<th class="num">Last 12 months</th><th class="num">vs prior 12</th></tr></thead>`;
    el.innerHTML = `<p class="subtle">DoD obligations to each company's matched recipients, all award types. Last 12 months ends ${monthLabel(A.through)}; DoD contract data is published with a 90-day delay.</p>
      <div class="table-wrap"><table class="data">${head}<tbody>` +
      list.map((r) => `<tr class="clickable" data-company="${esc(r.cid)}" tabindex="0"><td>${companyLink(r.cid)} <span class="code">${esc(r.c.status)}${r.c.ticker ? ' · ' + esc(r.c.ticker) : ''}</span></td>
        <td>${r.sec ? esc(subName(r.sec)) : '–'}</td>${shownFys.map((y) => `<td class="num">${usd(r.fy[y])}</td>`).join('')}
        <td class="num">${usd(r.t.cur)}</td><td class="num ${r.t.growth > 0 ? 'up' : r.t.growth < 0 ? 'down' : ''}">${pct(r.t.growth)}</td></tr>`).join('') +
      `</tbody></table></div><p class="subtle">${list.length} companies with DoD obligations since FY${A.fys[0]}. Companies not listed had no matched recipients or no DoD awards.</p>`;
  }

  function renderCompany(cid) {
    const c = A.companies[cid];
    $('#co-picker').value = cid;
    const el = $('#co-body');
    const t = ttm(cid);
    const fys = A.fys;
    const segs = rows(D.db, 'SELECT s.id, s.name FROM company_subsegments cs JOIN subsegments s ON s.id = cs.subsegment_id WHERE cs.company_id = ? ORDER BY s.sort', [cid]);
    const awards = rows(D.db, `SELECT a.*, (SELECT group_concat(m.subsegment_id || ':' || m.weight, '|') FROM award_sector_map m WHERE m.award_id = a.award_id) AS sectors
      FROM awards a WHERE a.company_id = ? ORDER BY a.obligated DESC LIMIT 25`, [cid]);
    const vehicles = rows(D.db, 'SELECT * FROM idv_vehicles WHERE company_id = ? ORDER BY orders_obligated DESC', [cid]);
    const recips = rows(D.db, 'SELECT uei, name, level, method, evidence, amount_all_agencies FROM entity_aliases WHERE company_id = ? ORDER BY amount_all_agencies DESC', [cid]);
    const pscs = rows(D.db, 'SELECT psc, psc_name, SUM(obligated) AS o FROM company_psc_fy WHERE company_id = ? GROUP BY psc ORDER BY o DESC LIMIT 8', [cid]);
    const lastFull = fys.filter((y) => y * 12 + 12 <= A.through).pop();
    const sector = A.sectorFy[cid] || {};
    const subIds = [...new Set(Object.values(sector).flatMap((o) => Object.keys(o)))].sort((a, b) => (A.subs[a]?.sort ?? 0) - (A.subs[b]?.sort ?? 0));
    const colors = Object.fromEntries(subIds.map((s, i) => [s, i < 8 ? `var(--s${i + 1})` : 'var(--ink-3)']));
    const capacity = vehicles.reduce((t, v) => t + Math.max(0, (v.orders_potential || 0) - (v.orders_obligated || 0)), 0);
    const mapHref = `../../defense-tech-map.html#${encodeURIComponent(cid)}`;
    el.innerHTML = `
      <div class="co-head">
        <div><span class="eyebrow">${esc(c.status)}${c.ticker ? ' · ' + esc(c.ticker) : ''} · ${segs.map((s) => esc(s.name)).join(', ')}</span>
          <h2>${esc(c.name)}</h2></div>
        <div class="co-links"><a href="#company">All companies</a> <a href="${mapHref}">Open in the market map</a></div>
      </div>
      <div class="kpis">
        ${kpi(`DoD obligations, ${B.h.fyLabel(lastFull)}`, usd(fyTotal(cid, lastFull)), lastFull ? `${pct(fyTotal(cid, lastFull - 1) ? fyTotal(cid, lastFull) / fyTotal(cid, lastFull - 1) - 1 : null)} vs ${B.h.fyLabel(lastFull - 1)}` : '')}
        ${kpi('Last 12 months', usd(t.cur), `${pct(t.growth)} vs the prior 12 (award momentum), to ${monthLabel(A.through)}`)}
        ${kpi('Open capacity on top vehicles', usd(capacity), `${vehicles.length} vehicles: order potential not yet obligated`)}
        ${kpi('Matched recipients', String(recips.length), 'USAspending entities (UEIs) counted for this company')}
      </div>
      <figure class="chart-card"><figcaption>DoD obligations by sector, FY${String(fys[0]).slice(2)}–FY${String(fys[fys.length - 1]).slice(2)}</figcaption>
        <div class="legend">${subIds.map((s) => `<span><i class="swatch" style="background:${colors[s]}"></i>${esc(subName(s))}</span>`).join('')}</div>
        <div class="chart" id="co-chart"></div>
        <p class="subtle">Sectors come from each award's product/service code where it names one, otherwise from the company's subsegments on the map. FY${String(fys[fys.length - 1]).slice(2)} is partial.</p></figure>
      <h3>Largest contracts</h3>
      <div class="table-wrap"><table class="data"><thead><tr><th>Award</th><th>Agency</th><th>Sector</th><th>Period</th><th class="num">Obligated</th></tr></thead><tbody>
        ${awards.map((a) => `<tr><td class="title"><a href="https://www.usaspending.gov/award/${encodeURIComponent(a.award_id)}" target="_blank" rel="noopener">${esc(a.piid)}</a> ${esc((a.description || '').slice(0, 140))}<span class="code">${esc(a.award_type || '')} · PSC ${esc(a.psc || '–')}</span></td>
          <td>${esc(a.sub_agency || '')}</td><td class="sectors">${sectorChips(a.sectors, a.sector_method)}</td>
          <td>${esc((a.start_date || '').slice(0, 7))} – ${esc((a.end_date || '').slice(0, 7))}</td><td class="num">${usd(a.obligated)}</td></tr>`).join('') || '<tr><td colspan="5">No contract awards.</td></tr>'}
      </tbody></table></div>
      <h3>Contract vehicles</h3>
      <div class="table-wrap"><table class="data"><thead><tr><th>Vehicle (IDV)</th><th>Agency</th><th>Ordering ends</th><th class="num">Orders</th><th class="num">Obligated on orders</th><th class="num">Order potential</th><th class="num">Ceiling (reported)</th></tr></thead><tbody>
        ${vehicles.map((v) => `<tr><td class="title"><a href="https://www.usaspending.gov/award/${encodeURIComponent(v.idv_id)}" target="_blank" rel="noopener">${esc(v.piid)}</a> ${esc((v.description || '').slice(0, 110))}<span class="code">${esc(v.type || '')}</span></td>
          <td>${esc(v.agency || '')}</td><td>${esc((v.last_date_to_order || '').slice(0, 7))}</td><td class="num">${v.orders ?? '–'}</td>
          <td class="num">${usd(v.orders_obligated)}</td><td class="num">${usd(v.orders_potential)}</td><td class="num">${v.ceiling ? usd(v.ceiling) : '–'}</td></tr>`).join('') || '<tr><td colspan="7">No IDVs among the largest awards.</td></tr>'}
      </tbody></table></div>
      <div class="two-col">
        <section><h3>Product and service codes</h3><div class="table-wrap"><table class="data"><thead><tr><th>PSC</th><th class="num">Obligated since FY${String(fys[0]).slice(2)}</th></tr></thead><tbody>
          ${pscs.map((p) => `<tr><td>${esc(p.psc)} <span class="code">${esc(p.psc_name || '')}</span></td><td class="num">${usd(p.o)}</td></tr>`).join('')}</tbody></table></div></section>
        <section><h3>Matched recipients</h3><div class="table-wrap"><table class="data"><thead><tr><th>Recipient</th><th>How matched</th><th class="num">All agencies, lifetime</th></tr></thead><tbody>
          ${recips.map((r) => `<tr><td>${esc(r.name)}<span class="code">UEI ${esc(r.uei)}${r.level ? ' · ' + esc(r.level) : ''}</span></td><td><span class="code">${esc(r.evidence || r.method || '')}</span></td><td class="num">${usd(r.amount_all_agencies)}</td></tr>`).join('')}</tbody></table></div></section>
      </div>`;
    drawCompanyChart(sector, fys, subIds, colors);
  }

  function drawCompanyChart(sector, fys, subIds, colors) {
    const el = $('#co-chart');
    const W = Math.max(520, Math.floor(el.clientWidth || 760)), H = 260, m = { t: 20, r: 12, b: 28, l: 64 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const tot = fys.map((y) => subIds.reduce((t, s) => t + Math.max(0, sector[y]?.[s] || 0), 0));
    const p = 10 ** Math.floor(Math.log10(Math.max(1, ...tot)));
    const max = Math.ceil(Math.max(1, ...tot) / p) * p;
    const yS = (x) => m.t + ih - (x / max) * ih;
    const band = iw / fys.length, bw = Math.min(48, band * 0.6);
    let svg = '';
    for (let i = 0; i <= 4; i++) { const v = (max / 4) * i; svg += `<line class="grid" x1="${m.l}" x2="${W - m.r}" y1="${yS(v)}" y2="${yS(v)}"></line><text x="${m.l - 8}" y="${yS(v) + 4}" text-anchor="end">${usd(v)}</text>`; }
    fys.forEach((y, i) => {
      const x = m.l + band * i + (band - bw) / 2;
      let acc = 0, segs = '';
      for (const s of subIds) {
        const v = Math.max(0, sector[y]?.[s] || 0);
        if (!v) continue;
        segs += `<rect class="seg" fill="${colors[s]}" x="${x}" y="${yS(acc + v)}" width="${bw}" height="${Math.max(0, yS(acc) - yS(acc + v))}"><title>${esc(subName(s))}: ${usd(v)}</title></rect>`;
        acc += v;
      }
      svg += `<g>${segs}<text class="total-label" x="${x + bw / 2}" y="${yS(acc) - 6}" text-anchor="middle">${acc ? usd(acc) : ''}</text><text x="${x + bw / 2}" y="${H - m.b + 16}" text-anchor="middle">${B.h.fyLabel(y)}</text></g>`;
    });
    el.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="DoD obligations by sector and fiscal year">${svg}<line class="axis" x1="${m.l}" x2="${W - m.r}" y1="${yS(0)}" y2="${yS(0)}"></line></svg>`;
  }

  // ---------------------------------------------------------------- wiring
  function fill(sel, items, first) {
    $(sel).innerHTML = (first ? `<option value="">${esc(first)}</option>` : '') + items.map(([v, l]) => `<option value="${esc(v)}">${esc(l)}</option>`).join('');
  }
  function populate() {
    load();
    if (!A.available) return;
    const withAwards = rows(D.db, 'SELECT DISTINCT a.company_id AS id, c.name FROM awards a JOIN companies c ON c.id = a.company_id ORDER BY c.name');
    fill('#aw-company', withAwards.map((r) => [r.id, r.name]), 'All companies');
    fill('#co-picker', Object.keys(A.months).map((id) => [id, A.companies[id]?.name || id]).sort((a, b) => a[1].localeCompare(b[1])), 'Choose a company');
    fill('#aw-segment', rows(D.db, 'SELECT DISTINCT s.segment_id AS id FROM award_sector_map m JOIN subsegments s ON s.id = m.subsegment_id').map((r) => [r.id, A.segName[r.id]]), 'All sectors');
    fill('#aw-agency', rows(D.db, 'SELECT DISTINCT sub_agency AS v FROM awards WHERE sub_agency IS NOT NULL ORDER BY 1').map((r) => [r.v, r.v]), 'All DoD components');
    fill('#aw-type', rows(D.db, 'SELECT DISTINCT award_type AS v FROM awards WHERE award_type IS NOT NULL ORDER BY 1').map((r) => [r.v, r.v.toLowerCase()]), 'All types');
    const years = rows(D.db, "SELECT DISTINCT substr(start_date, 1, 4) AS y FROM awards WHERE start_date >= '2000' ORDER BY 1 DESC").map((r) => [r.y, `${r.y} or later`]);
    fill('#aw-from', years, 'Any start date');
    const rules = rows(D.db, 'SELECT rule_id, subsegment_id FROM sector_recipients_fy GROUP BY rule_id');
    const RULE_LABEL = { 'guided-missiles': 'Guided missiles (PSC 1410-1440)', 'unmanned-aircraft': 'Unmanned aircraft (PSC 1550)', ships: 'Ships and small craft (PSC 19xx, 20xx)', 'it-software': 'Software and IT applications (PSC 7A, DA)', 'it-security': 'IT security (PSC 7J, DJ)' };
    fill('#aw-rule', rules.map((r) => [r.rule_id, RULE_LABEL[r.rule_id] || `${subName(r.subsegment_id)} (${r.rule_id})`]).sort((a, b) => a[1].localeCompare(b[1])));
    if (rules.some((r) => r.rule_id === 'unmanned-aircraft')) $('#aw-rule').value = 'unmanned-aircraft';
  }
  function bind() {
    let t;
    for (const id of ['#aw-company', '#aw-segment', '#aw-agency', '#aw-type', '#aw-from', '#aw-min']) $(id).addEventListener('change', () => B.render());
    $('#aw-q').addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => B.render(), 150); });
    $('#aw-rule').addEventListener('change', renderUniverse);
    $('#co-picker').addEventListener('change', (e) => B.setView(e.target.value ? `company-${e.target.value}` : 'company'));
    $('#co-q').addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => B.render(), 150); });
    $('#co-status').addEventListener('change', () => B.render());
    $('#co-body').addEventListener('click', (e) => { const tr = e.target.closest('tr[data-company]'); if (tr && !e.target.closest('a')) B.setView(`company-${tr.dataset.company}`); });
    $('#co-body').addEventListener('keydown', (e) => { const tr = e.target.closest('tr[data-company]'); if (tr && e.key === 'Enter') B.setView(`company-${tr.dataset.company}`); });
  }

  B.register('awards', { render: renderAwards, populate, bind });
  B.register('company', { render: renderCompanies, populate() {}, bind() {} });
})();
