/* Capital vs. Contracts: private capital raised (or public market cap) against federal obligations, FY2020–FY2026.
   The approach follows Defense Tech Signals' "Capital vs. Contracts" dashboard, rebuilt on this map's companies,
   segment toggle and design system. Obligations come from DTM.obligations (scripts/obligations.mjs). */
(function () {
  'use strict';

  const D = window.DTM;
  const A = () => window.DTMApp;
  const $ = (sel, root = document) => root.querySelector(sel);
  const SVG = 'http://www.w3.org/2000/svg';
  const panel = $('#panel-dashboard');
  if (!panel) return;
  const local = { sortKey: 'obl', sortDir: -1, q: '', cq: '', built: false, lastWidth: 0 };

  /* ---------------------------------------------------------------- data */
  const US_GOV = /\b(US|U\.S\.|Army|Navy|Air Force|Space Force|Marine|USMC|DoD|Department of (War|Defense)|DIU|DARPA|AFRL|AFWERX|SpaceWERX|SDA|Space Development|Missile Defense|NASA|SOCOM|JIATF|DHS|CBP|NGA|NRO|ONR|DLA|DOE|Pentagon|Cyber Command|CDAO|Coast Guard)\b/i;
  function underFlag(c, o) {
    if (!o) return 'Federal obligations not yet pulled';
    if (o.flag) return o.flag;
    if (o.capped) return 'More Other Transaction records than the pull limit; OT total is partial';
    if (c.country !== 'US') return 'Non-US company: only awards recorded to US entities appear';
    if (/^Acquired/i.test(c.stage || '')) return 'Acquired: later awards may be recorded under the buyer';
    const usPrograms = (c.programs || []).filter((p) => US_GOV.test(p.customer || ''));
    if (o.total < 1 && usPrograms.length) return 'Announced US awards not visible under its own name (likely via primes, consortium OTs or resellers)';
    return '';
  }
  function scope() {
    const app = A();
    const g = app.focusIndex[app.state.focus] || app.focusIndex.all;
    const pub = app.state.dashMode === 'public';
    return { g, pub };
  }
  function rows() {
    const app = A();
    const { g, pub } = scope();
    const O = (D.obligations && D.obligations.byId) || {};
    return app.companies
      .filter((c) => c.isPublic === pub && (!g.segments || c.segs.some((s) => g.segments.includes(s))))
      .map((c) => {
        const o = O[c.id] || null;
        const size = pub ? (c.latestRevenue ? c.latestRevenue.usdM : null) : (c.lastPost ? c.lastPost.postUsdM : null);
        const flag = underFlag(c, o);
        const seg = D.segments.find((s) => s.id === c.segs[0]);
        return {
          c, o, size, flag, seg,
          y: c.value, obl: o ? o.total : null, prime: o ? o.prime : null, ot: o ? o.ot : null, sub: o ? o.sub : null,
          under: !!flag && !/^Recorded (as|under)/i.test(flag),
          incl: c.value != null && c.value > 0 && !!o
        };
      });
  }

  /* ---------------------------------------------------------------- formatting */
  const money = (v) => A().money(v);
  const ratio = (a, b) => (b > 0 ? (a / b >= 100 ? Math.round(a / b) : (a / b).toFixed(1)) + '×' : '—');
  const esc = (s) => A().esc(s);
  const fmt$ = (v) => (v >= 1e6 ? '$' + v / 1e6 + 'T' : v >= 1000 ? '$' + v / 1000 + 'B' : '$' + v + 'M');
  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  /* ---------------------------------------------------------------- skeleton */
  function build() {
    panel.innerHTML = `
      <header class="dash-head">
        <p class="dash-eyebrow">Capital vs. Contracts</p>
        <h2 class="dash-title" id="dash-title"></h2>
        <p class="dash-lede" id="dash-lede"></p>
        <div class="dash-modes seg" role="radiogroup" aria-label="Companies">
          <input type="radio" name="dash-mode" id="dash-mode-private" value="private"><label for="dash-mode-private"><i class="swatch swatch-private"></i>Private · capital raised</label>
          <input type="radio" name="dash-mode" id="dash-mode-public" value="public"><label for="dash-mode-public"><i class="swatch swatch-public"></i>Public · market cap</label>
        </div>
      </header>
      <div class="dash-tiles" id="dash-tiles"></div>
      <section class="dash-card">
        <h3 class="dash-h" id="dash-chart-title"></h3>
        <p class="dash-note" id="dash-chart-note"></p>
        <div class="dash-find">
          <input id="dash-cq" type="search" list="dash-cos" placeholder="Find a company on the chart" autocomplete="off" aria-label="Find a company on the chart">
          <datalist id="dash-cos"></datalist><span id="dash-cqmsg" aria-live="polite"></span>
        </div>
        <div class="dash-chart" id="dash-chart"><div class="dash-tip" id="dash-tip" hidden></div></div>
        <div class="dash-legend" id="dash-legend"></div>
      </section>
      <section class="dash-card">
        <h3 class="dash-h">All companies</h3>
        <p class="dash-note">$M unless noted. Faded rows have no disclosed figure and are left out of the chart and totals. Click a header to sort, or a row to open the profile.</p>
        <input class="dash-filter" id="dash-q" type="search" placeholder="Filter companies" aria-label="Filter companies">
        <div class="dash-tablewrap"><table class="dash-table" id="dash-table"><thead></thead><tbody></tbody></table></div>
      </section>
      <section class="dash-card dash-method">
        <h3 class="dash-h">How this was built</h3>
        <ul id="dash-method"></ul>
      </section>
      <p class="dash-sources" id="dash-sources"></p>`;
    panel.addEventListener('change', (e) => { if (e.target.name === 'dash-mode') A().setDashMode(e.target.value); });
    $('#dash-q').addEventListener('input', (e) => { local.q = e.target.value; renderTable(rows()); });
    const cq = $('#dash-cq');
    cq.addEventListener('input', () => { local.cq = cq.value; highlight(); });
    cq.addEventListener('keydown', (e) => { if (e.key === 'Escape') { cq.value = ''; local.cq = ''; highlight(); } });
    $('#dash-table').addEventListener('click', (e) => {
      const th = e.target.closest('[data-dsort]');
      if (!th) return;
      const k = th.dataset.dsort;
      local.sortDir = local.sortKey === k ? -local.sortDir : (k === 'name' || k === 'seg' || k === 'flag' ? 1 : -1);
      local.sortKey = k;
      renderTable(rows());
    });
    let t;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(() => { if (!panel.hidden && $('#dash-chart').clientWidth !== local.lastWidth) drawChart(rows()); }, 150);
    });
    local.built = true;
  }

  /* ---------------------------------------------------------------- render */
  function render() {
    if (panel.hidden) return;
    if (!local.built) build();
    const { g, pub } = scope();
    const all = rows();
    const s = all.filter((r) => r.incl);
    const R = s.reduce((a, r) => a + r.y, 0);
    const O = s.reduce((a, r) => a + r.obl, 0);
    const above = s.filter((r) => r.obl > r.y).length;
    const where = g.segments ? ` ${g.short}` : '';
    $(`#dash-mode-${pub ? 'public' : 'private'}`).checked = true;
    $('#dash-title').textContent = pub ? 'How much contract money do public defense companies take in?' : 'Who is actually getting paid in defense tech?';
    const x = O > 0 ? (R / O).toFixed(1) : '—';
    const one = above === 1;
    $('#dash-lede').textContent = pub
      ? `Across ${s.length} public${where} companies on the map, about ${money(R)} of market value sits against ${money(O)} in visible federal obligations since FY2020, roughly ${x} dollars of market cap per government dollar. ${above ? `${above} ${one ? 'has' : 'have'} been obligated more than ${one ? 'its' : 'their'} market cap.` : 'None has been obligated more than its market cap.'}`
      : `Across ${s.length} private${where} companies on the map, about ${money(R)} of private capital sits against ${money(O)} in visible federal obligations since FY2020, roughly ${x} private dollars per government dollar. ${above ? `Only ${above} ${one ? 'has' : 'have'} been obligated more than ${one ? 'it has' : "they've"} raised.` : "None has been obligated more than it's raised."}`;
    const tiles = [
      ['Companies shown', String(s.length), `${g.segments ? g.name : 'All segments'} · ${pub ? 'public' : 'private'}`],
      [pub ? 'Market cap' : 'Capital raised', money(R), pub ? 'Latest in each profile' : 'Cumulative, as compiled'],
      ['Federal obligations', money(O), 'FY2020–FY2026'],
      [pub ? 'Market cap per $1 obligated' : 'Raised per $1 obligated', O > 0 ? x + '×' : '—', 'Across companies shown'],
      [pub ? 'Obligated more than market cap' : 'Obligated more than raised', String(above), 'Below the parity line']
    ];
    $('#dash-tiles').innerHTML = tiles.map(([l, v, n], i) => `<div class="dash-tile${i === 1 ? (pub ? ' is-public' : ' is-private') : ''}"><span class="dash-tl">${esc(l)}</span><span class="dash-tv">${esc(v)}</span><span class="dash-tn">${esc(n)}</span></div>`).join('');
    $('#dash-chart-title').textContent = pub ? 'Federal obligations vs. market cap' : 'Federal obligations vs. capital raised';
    $('#dash-chart-note').textContent = `Both axes log scale. Bubble area = ${pub ? 'latest annual revenue' : 'latest disclosed post-money valuation'}; hollow rings = not ${pub ? 'compiled' : 'disclosed'}. Dashed outline = obligations likely understated. Dashed line = $1 ${pub ? 'of market cap' : 'raised'} per $1 obligated. Hover a bubble for detail, click to open the profile, or type a name to find it.`;
    $('#dash-legend').innerHTML = `
      <span><i class="dl-dot is-${pub ? 'public' : 'private'}"></i>Obligations look complete</span>
      <span><i class="dl-dot is-${pub ? 'public' : 'private'} is-under"></i>Obligations likely understated</span>
      <span><i class="dl-dot is-${pub ? 'public' : 'private'} is-hollow"></i>${pub ? 'Revenue not compiled' : 'Valuation not disclosed'}</span>`;
    $('#dash-cos').innerHTML = s.map((r) => `<option value="${esc(r.c.short || r.c.name)}">`).join('');
    drawChart(all);
    renderTable(all);
    renderMethod(pub);
  }

  /* ---------------------------------------------------------------- chart */
  let chartState = null;
  function drawChart(all) {
    const box = $('#dash-chart');
    const tip = $('#dash-tip');
    box.querySelectorAll('svg').forEach((n) => n.remove());
    tip.hidden = true;
    const W = box.clientWidth;
    local.lastWidth = W;
    if (!W) return;
    const { pub } = scope();
    const H = Math.round(Math.max(400, Math.min(720, W * 0.62)));
    const m = { t: 16, r: 16, b: 52, l: 64 }, floor = 0.5;
    const pts = all.filter((r) => r.incl).map((r) => ({ r, x: Math.max(r.obl, floor), y: Math.max(r.y, 1), v: r.size }));
    if (!pts.length) { chartState = null; return; }
    const log = Math.log10;
    const xMax = Math.pow(10, Math.ceil(log(Math.max(8000, Math.max(...pts.map((p) => p.x)) * 1.3))));
    const yMin = Math.pow(10, Math.floor(log(Math.min(5, Math.min(...pts.map((p) => p.y))))));
    const yMax = Math.pow(10, Math.ceil(log(Math.max(20000, Math.max(...pts.map((p) => p.y)) * 1.3))));
    const xd = [floor * 0.8, xMax], yd = [yMin, yMax];
    const sx = (v) => m.l + (log(Math.min(Math.max(v, xd[0]), xd[1])) - log(xd[0])) / (log(xd[1]) - log(xd[0])) * (W - m.l - m.r);
    const sy = (v) => H - m.b - (log(Math.min(Math.max(v, yd[0]), yd[1])) - log(yd[0])) / (log(yd[1]) - log(yd[0])) * (H - m.t - m.b);
    const sizes = pts.map((p) => p.v || 0);
    const maxV = Math.max(1, ...sizes);
    const maxR = Math.max(16, Math.min(44, W / 24));
    const R = (p) => (p.v ? Math.max(4, Math.sqrt(p.v / maxV) * maxR) : 3.5);
    const col = css(pub ? '--public' : '--private');
    const grid = css('--chart-grid'), ink = css('--ink'), muted = css('--ink-3'), panelBg = css('--panel');

    const svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', String(H));
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', `${pub ? 'Market cap' : 'Capital raised'} against federal obligations for ${pts.length} companies; the table below lists every value.`);
    box.insertBefore(svg, tip); // attached first: label layout measures text with getComputedTextLength
    const el = (tag, attrs, parent = svg) => { const n = document.createElementNS(SVG, tag); Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v)); parent.appendChild(n); return n; };
    const text = (str, attrs, parent) => { const t = el('text', attrs, parent); t.textContent = str; return t; };

    const decades = (lo, hi) => { const out = []; for (let v = Math.pow(10, Math.ceil(log(lo))); v <= hi; v *= 10) out.push(v); return out; };
    const xt = decades(1, xd[1]), yt = decades(Math.max(1, yd[0]), yd[1]);
    xt.forEach((v) => el('line', { x1: sx(v), x2: sx(v), y1: m.t, y2: H - m.b, stroke: grid }));
    yt.forEach((v) => el('line', { y1: sy(v), y2: sy(v), x1: m.l, x2: W - m.r, stroke: grid }));
    const lo = Math.max(xd[0], yd[0], 1), hi = Math.min(xd[1], yd[1]);
    el('line', { x1: sx(lo), y1: sy(lo), x2: sx(hi), y2: sy(hi), stroke: muted, 'stroke-dasharray': '4 4' });
    // Parity label a quarter of the way along the line (log space), below it; company labels avoid its box.
    const lblAt = Math.pow(10, log(lo) + 0.28 * (log(hi) - log(lo)));
    const parity = text(`$1 ${pub ? 'of market cap' : 'raised'} per $1 obligated`, { x: sx(lblAt) + 8, y: sy(lblAt) + 16, fill: muted, 'font-size': 11 });
    const parityBox = [sx(lblAt) + 8, sy(lblAt) + 5, sx(lblAt) + 8 + parity.getComputedTextLength(), sy(lblAt) + 18];
    const thin = W < 520;
    xt.forEach((v, i) => { if (!thin || i % 2 === 0) text(fmt$(v), { x: sx(v), y: H - m.b + 18, 'text-anchor': 'middle', fill: muted, 'font-size': 11 }); });
    if (!thin) text('none', { x: sx(floor), y: H - m.b + 18, 'text-anchor': 'middle', fill: muted, 'font-size': 11 });
    yt.forEach((v) => text(fmt$(v), { x: m.l - 8, y: sy(v) + 4, 'text-anchor': 'end', fill: muted, 'font-size': 11 }));
    text('Federal obligations, FY2020–FY2026', { x: (m.l + W - m.r) / 2, y: H - 10, 'text-anchor': 'middle', fill: muted, 'font-size': 12 });
    text(pub ? 'Market cap' : 'Capital raised (cumulative)', { transform: `translate(14,${(m.t + H - m.b) / 2}) rotate(-90)`, 'text-anchor': 'middle', fill: muted, 'font-size': 12 });

    const dotsG = el('g', {});
    const sorted = pts.slice().sort((a, b) => R(b) - R(a));
    const dots = sorted.map((p) => {
      const c = el('circle', {
        cx: sx(p.x), cy: sy(p.y), r: R(p), fill: p.v ? col : 'none', 'fill-opacity': 0.35, stroke: col, 'stroke-width': 1.25,
        'data-id': p.r.c.id, tabindex: 0, role: 'button', 'aria-label': `${p.r.c.name}: ${pub ? 'market cap' : 'raised'} ${money(p.r.y)}, obligated ${p.r.obl ? money(p.r.obl) : 'none found'}`
      }, dotsG);
      if (p.r.under) c.setAttribute('stroke-dasharray', '3 2');
      c.style.cursor = 'pointer';
      p.node = c;
      return p;
    });

    // Labels: companies obligated more than they raised first, then the largest; skip any that would collide.
    const lg = el('g', {});
    const fs = W < 600 ? 9.5 : 10.5, maxL = W < 600 ? 14 : 36;
    const prio = pts.slice().sort((a, b) => ((b.r.obl > b.r.y) - (a.r.obl > a.r.y)) || (Math.max(b.v || 0, b.r.y) - Math.max(a.v || 0, a.r.y)));
    const placed = [parityBox];
    const circles = pts.map((p) => [sx(p.x), sy(p.y), R(p), p]);
    const hitBox = (b) => placed.some((o) => b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1]);
    const hitDot = (b, p) => circles.some(([cx, cy, r, q]) => q !== p && cx + r > b[0] && cx - r < b[2] && cy + r > b[1] && cy - r < b[3]);
    let n = 0;
    for (const p of prio) {
      if (n >= maxL) break;
      const t = text(p.r.c.short || p.r.c.name, { 'font-size': fs, fill: ink, 'paint-order': 'stroke', stroke: panelBg, 'stroke-width': 3, 'stroke-linejoin': 'round' }, lg);
      const w = t.getComputedTextLength(), h = fs + 1, cx = sx(p.x), cy = sy(p.y), r = R(p);
      const opts = [[cx + r + 3, cy + h / 3, 'start', [cx + r + 3, cy - h / 2, cx + r + 3 + w, cy + h / 2]],
        [cx - r - 3, cy + h / 3, 'end', [cx - r - 3 - w, cy - h / 2, cx - r - 3, cy + h / 2]],
        [cx, cy - r - 3, 'middle', [cx - w / 2, cy - r - 3 - h, cx + w / 2, cy - r - 3]],
        [cx, cy + r + h, 'middle', [cx - w / 2, cy + r + 1, cx + w / 2, cy + r + 1 + h]]];
      const ok = opts.find((o) => o[3][0] >= m.l && o[3][2] <= W - 2 && o[3][1] >= 0 && o[3][3] <= H - m.b && !hitBox(o[3]) && !hitDot(o[3], p));
      if (!ok) { t.remove(); continue; }
      placed.push(ok[3]);
      n++;
      t.setAttribute('x', ok[0]); t.setAttribute('y', ok[1]); t.setAttribute('text-anchor', ok[2]);
    }
    const hl = el('g', {});
    chartState = { svg, dots, sx, sy, R, hl, lg, W, pub, panelBg, ink, box };

    const fillTip = (p) => {
      const r = p.r;
      tip.innerHTML = `<b>${esc(r.c.name)}</b>
        <span>${pub ? 'Market cap' : 'Raised'} ${money(r.y)} · ${pub ? 'Revenue' : 'Valuation'} ${p.v ? money(p.v) : (pub ? 'not compiled' : 'not disclosed')}</span>
        <span>Obligated ${r.obl ? money(r.obl) : 'none found'} (contracts ${r.prime ? money(r.prime) : '$0'}, OTs ${r.ot ? money(r.ot) : '$0'}, subawards ${r.sub ? money(r.sub) : '$0'})</span>
        ${r.flag ? `<span class="dash-tip-flag">⚑ ${esc(r.flag)}</span>` : ''}
        <span class="dash-tip-hint">Click for the full profile</span>`;
      tip.hidden = false;
    };
    const placeTip = (px, py) => {
      tip.style.left = Math.min(Math.max(0, px + 14), box.clientWidth - tip.offsetWidth) + 'px';
      tip.style.top = Math.max(0, py - tip.offsetHeight - 10) + 'px';
    };
    const pointFor = (node) => dots.find((d) => d.node === node);
    svg.addEventListener('pointermove', (e) => {
      const p = e.target.tagName === 'circle' && pointFor(e.target);
      if (!p) return;
      const rect = box.getBoundingClientRect();
      fillTip(p);
      placeTip(e.clientX - rect.left, e.clientY - rect.top);
    });
    svg.addEventListener('pointerleave', () => highlight());
    svg.addEventListener('click', (e) => { const p = e.target.tagName === 'circle' && pointFor(e.target); if (p) A().openCompany(p.r.c.id); });
    svg.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.tagName === 'circle') A().openCompany(e.target.dataset.id); });
    svg.addEventListener('focusin', (e) => { const p = e.target.tagName === 'circle' && pointFor(e.target); if (p) { fillTip(p); placeTip(sx(p.x) + R(p), sy(p.y) - R(p)); } });
    chartState.fillTip = fillTip;
    chartState.placeTip = placeTip;
    highlight();
  }
  function highlight() {
    const st = chartState;
    const msg = $('#dash-cqmsg');
    const tip = $('#dash-tip');
    if (!st) { if (msg) msg.textContent = ''; return; }
    const q = local.cq.trim().toLowerCase();
    st.hl.innerHTML = '';
    if (!q) {
      st.dots.forEach((d) => { d.node.setAttribute('opacity', 1); d.node.setAttribute('stroke-width', 1.25); });
      st.lg.setAttribute('opacity', 1);
      tip.hidden = true;
      msg.textContent = '';
      return;
    }
    const name = (d) => (d.r.c.short || d.r.c.name).toLowerCase();
    const exact = st.dots.filter((d) => name(d) === q || d.r.c.name.toLowerCase() === q);
    const found = exact.length ? exact : st.dots.filter((d) => name(d).includes(q) || d.r.c.name.toLowerCase().includes(q));
    const set = new Set(found);
    st.dots.forEach((d) => { d.node.setAttribute('opacity', !found.length || set.has(d) ? 1 : 0.12); d.node.setAttribute('stroke-width', set.has(d) ? 3 : 1.25); });
    found.forEach((d) => d.node.parentNode.appendChild(d.node));
    st.lg.setAttribute('opacity', found.length ? 0.15 : 1);
    found.slice(0, 12).forEach((d) => {
      const cx = st.sx(d.x), cy = st.sy(d.y), r = st.R(d);
      const t = document.createElementNS(SVG, 'text');
      t.textContent = d.r.c.short || d.r.c.name;
      Object.entries({ 'font-size': 12, 'font-weight': 700, fill: st.ink, 'paint-order': 'stroke', stroke: st.panelBg, 'stroke-width': 4, 'stroke-linejoin': 'round' }).forEach(([k, v]) => t.setAttribute(k, v));
      st.hl.appendChild(t);
      const w = t.getComputedTextLength();
      const right = cx + r + 6 + w <= st.W - 2;
      t.setAttribute('x', right ? cx + r + 6 : cx - r - 6);
      t.setAttribute('y', cy + 4);
      t.setAttribute('text-anchor', right ? 'start' : 'end');
    });
    if (found.length === 1) { const d = found[0]; st.fillTip(d); st.placeTip(st.sx(d.x) + st.R(d), st.sy(d.y) - st.R(d)); } else tip.hidden = true;
    if (found.length) msg.textContent = found.length === 1 ? '' : `${found.length} matches${found.length > 12 ? ' (first 12 labeled)' : ''}`;
    else {
      const any = rows().find((r) => (r.c.short || r.c.name).toLowerCase().includes(q));
      msg.textContent = any ? `${any.c.name} has no disclosed ${scope().pub ? 'market cap' : 'funding total'}, so it isn't plotted` : 'No company matches in this view';
    }
  }

  /* ---------------------------------------------------------------- table */
  function renderTable(all) {
    const { pub } = scope();
    const cols = [
      ['name', 'Company', 0], ['seg', 'Segment', 0], ['y', pub ? 'Market cap' : 'Raised', 1], ['size', pub ? 'Revenue' : 'Valuation', 1],
      ['obl', 'Obligated', 1], ['prime', 'Contracts', 1], ['ot', 'OTs', 1], ['sub', 'Subawards', 1],
      ['ratio', pub ? 'Mkt cap per $1' : 'Raised per $1', 1], ['flag', 'Obligations note', 0]
    ];
    const val = (r, k) => (k === 'name' ? (r.c.short || r.c.name) : k === 'seg' ? (r.seg ? r.seg.short : '') : k === 'ratio' ? (r.incl && r.obl > 0 ? r.y / r.obl : null) : k === 'flag' ? r.flag : r[k]);
    $('#dash-table thead').innerHTML = `<tr>${cols.map(([k, l, num]) => `<th class="${num ? 'num' : ''}${local.sortKey === k ? ' is-sorted' : ''}" aria-sort="${local.sortKey === k ? (local.sortDir > 0 ? 'ascending' : 'descending') : 'none'}"><button type="button" data-dsort="${k}">${esc(l)}${local.sortKey === k ? (local.sortDir > 0 ? ' ↑' : ' ↓') : ''}</button></th>`).join('')}</tr>`;
    const q = local.q.trim().toLowerCase();
    const list = all.filter((r) => !q || [r.c.name, r.c.short, r.seg && r.seg.name, r.flag, ...(r.o && r.o.recipients || [])].join(' ').toLowerCase().includes(q))
      .sort((a, b) => {
        const av = val(a, local.sortKey), bv = val(b, local.sortKey);
        if (typeof av === 'string' || typeof bv === 'string') return String(av || '').localeCompare(String(bv || '')) * local.sortDir || 0;
        return ((av == null ? -1 : av) - (bv == null ? -1 : bv)) * local.sortDir;
      });
    const m = (v) => (v == null ? '—' : v === 0 ? '0' : A().money(v));
    $('#dash-table tbody').innerHTML = list.map((r) => `<tr data-id="${r.c.id}" class="${r.incl ? '' : 'is-out'}" tabindex="0">
      <td class="co"><b>${esc(r.c.short || r.c.name)}</b></td>
      <td>${esc(r.seg ? r.seg.short : '')}</td>
      <td class="num">${r.y == null ? esc(pub ? 'n/a' : (r.c.funding && r.c.funding.label) || 'Undisclosed') : m(r.y)}</td>
      <td class="num">${m(r.size)}</td>
      <td class="num"><b>${m(r.obl)}</b></td>
      <td class="num">${m(r.prime)}</td>
      <td class="num">${m(r.ot)}</td>
      <td class="num">${m(r.sub)}</td>
      <td class="num">${r.incl && r.obl > 0 ? ratio(r.y, r.obl) : '—'}</td>
      <td class="note">${r.flag ? `<span class="${r.under ? 'is-under' : ''}">${esc(r.flag)}</span>` : ''}</td>
    </tr>`).join('');
  }

  /* ---------------------------------------------------------------- methodology */
  function renderMethod(pub) {
    const O = D.obligations || {};
    const items = [
      ['Companies', `every ${pub ? 'public' : 'private'} company on this map in the selected segment. ${pub ? 'Market caps' : 'Funding totals'} with no disclosed figure are listed but not plotted.`],
      ['Obligations', `USAspending prime contracts, IDVs and grants to each company's own-name recipients, plus subawards it received; FPDS Other Transaction agreements, OT IDVs and OT orders. Window ${O.window || 'FY2020–FY2026'}; pulled ${O.asOf ? A().date(O.asOf, true) : '—'}. Recipient names matched to each company are listed in its profile.`],
      ['Undercounts', 'OTs booked to consortium managers, work done as an unreported subcontractor, reseller and marketplace sales, classified work and awards to non-US parents are not captured. The Obligations note column flags likely undercounts.'],
      [pub ? 'Market cap' : 'Capital raised', pub ? 'the dated market cap in each profile; sheet figures are undated. Bubble area is the latest full-year revenue in USD.' : 'cumulative funding as compiled in each profile, with its own source and as-of date; some totals include debt. Bubble area is the latest disclosed post-money valuation.'],
      ['Approach', 'adapted from Defense Tech Signals’ “Capital vs. Contracts” dashboard of the NatSec100, applied here to the companies on this map.']
    ];
    $('#dash-method').innerHTML = items.map(([k, v]) => `<li><b>${esc(k)}:</b> ${esc(v)}</li>`).join('');
    $('#dash-sources').innerHTML = `Sources: USAspending.gov; FPDS-NG; company filings, announcements and press reporting linked in each profile. Approach: <a href="https://dtscontracts.netlify.app/" target="_blank" rel="noopener">Defense Tech Signals, Capital vs. Contracts</a>.`;
  }

  window.DTMDashboard = { render, rows };
  if (A() && A().state.page === 'dashboard') render();
})();
