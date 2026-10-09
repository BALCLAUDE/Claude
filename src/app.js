/* Defense Tech Market Map: rendering, filters, detail panel, compare, deep links. */
(function () {
  'use strict';

  const D = window.DTM;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };

  /* ---------------------------------------------------------------- formatting */
  const CUR = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', KRW: '₩', AUD: 'A$', CAD: 'C$', ILS: '₪', SEK: 'SEK ', NOK: 'NOK ', CHF: 'CHF ' };
  function money(m, cur = 'USD') {
    if (m == null || isNaN(m)) return '—';
    const sym = CUR[cur] != null ? CUR[cur] : cur + ' ';
    const a = Math.abs(m), sign = m < 0 ? '−' : '';
    let s;
    if (a >= 1e6) s = trim((a / 1e6).toFixed(a >= 1e7 ? 1 : 2)) + 'T';
    else if (a >= 1e3) s = trim((a / 1e3).toFixed(a >= 1e5 ? 0 : 1)) + 'B';
    else if (a >= 1) s = trim(a.toFixed(a >= 100 ? 0 : 1)) + 'M';
    else s = Math.round(a * 1000) + 'K';
    return sign + sym + s;
  }
  function trim(s) { return s.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1'); }
  const mult = (x) => (x == null || isNaN(x) ? null : x >= 100 ? Math.round(x) + '×' : x.toFixed(1) + '×');
  const pct = (x) => (x == null || isNaN(x) ? '—' : (x > 0 ? '+' : x < 0 ? '−' : '') + Math.abs(x).toFixed(1) + '%');
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function date(s, long) {
    if (!s) return '';
    const m = String(s).match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/);
    if (!m) return String(s);
    if (!m[2]) return m[1];
    const mon = MONTHS[+m[2] - 1];
    if (!m[3] || !long) return `${mon} ${m[1]}`;
    return `${mon} ${+m[3]}, ${m[1]}`;
  }
  function srcList(src) {
    if (!src) return [];
    return (Array.isArray(src) ? src : [src]).map((s) => (typeof s === 'string' ? { t: s } : s));
  }
  function srcHTML(src, asOf, label = 'Source') {
    const list = srcList(src);
    if (!list.length && !asOf) return '';
    const items = list.map((s) => (s.u ? `<a href="${esc(s.u)}" target="_blank" rel="noopener">${esc(s.t || hostOf(s.u))}</a>` : esc(s.t))).join('; ');
    return `<p class="src">${asOf ? `As of ${esc(date(asOf, true))}. ` : ''}${items ? `${label}: ${items}` : ''}</p>`;
  }
  function hostOf(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return u; } }

  /* ---------------------------------------------------------------- data prep */
  const subIndex = {}; // sub id -> { sub, seg }
  D.segments.forEach((seg) => seg.subsegments.forEach((sub) => { subIndex[sub.id] = { sub, seg }; }));
  const programIndex = {};
  (D.programs || []).forEach((p) => { programIndex[p.id] = p; });
  const regionOf = {};
  D.regions.forEach((r) => r.countries.forEach((cc) => { regionOf[cc] = r.id; }));

  const byId = {};
  const companies = D.companies.filter((c) => c && c.id && Array.isArray(c.subsegments) && c.subsegments.some((s) => subIndex[s]));
  companies.forEach((c) => {
    byId[c.id] = c;
    c.subs = c.subsegments.filter((s) => subIndex[s]);
    c.segs = Array.from(new Set(c.subs.map((s) => subIndex[s].seg.id)));
    c.isPublic = c.status === 'public';
    c.value = c.isPublic ? (c.marketCap && c.marketCap.usdM) : (c.funding && c.funding.totalUsdM);
    if (c.value == null || isNaN(c.value)) c.value = null;
    c.rounds = (c.funding && c.funding.rounds) || [];
    const sorted = c.rounds.slice().sort((a, b) => String(a.date).localeCompare(String(b.date)));
    c.rounds = sorted;
    c.lastRound = sorted[sorted.length - 1] || null;
    const withPost = sorted.filter((r) => r.postUsdM);
    c.lastPost = c.valuation && c.valuation.postUsdM ? { postUsdM: c.valuation.postUsdM, date: c.valuation.date, type: c.valuation.type, src: c.valuation.src }
      : withPost.length ? { postUsdM: withPost[withPost.length - 1].postUsdM, date: withPost[withPost.length - 1].date, type: withPost[withPost.length - 1].type, src: withPost[withPost.length - 1].src } : null;
    c.fx = c.marketCap && c.marketCap.local && c.marketCap.local.valueM ? c.marketCap.usdM / c.marketCap.local.valueM : 1;
    c.latestRevenue = latestRevenue(c);
    c.isBig = c.value != null && (c.isPublic ? c.value >= 25000 : c.value >= 1500);
    c.region = regionOf[c.country] || 'other';
    c.programRefs = new Set((c.programs || []).map((p) => p.ref).filter(Boolean));
    c.hay = [
      c.name, c.ticker, c.exchange, c.oneLiner, c.hq, D.countryNames[c.country], c.stage,
      (c.products || []).join(' '), (c.tags || []).join(' '),
      (c.programs || []).map((p) => `${p.name} ${p.customer || ''} ${p.ref ? (programIndex[p.ref] || {}).name : ''}`).join(' '),
      ((c.funding && c.funding.investors) || []).join(' '),
      c.rounds.map((r) => (r.leads || []).join(' ')).join(' '),
      (c.leadership || []).map((l) => l[0]).join(' '),
      c.subs.map((s) => `${subIndex[s].sub.name} ${subIndex[s].seg.name}`).join(' ')
    ].filter(Boolean).join(' ').toLowerCase();
  });

  function latestRevenue(c) {
    if (c.isPublic && c.financials && c.financials.periods && c.financials.periods.length) {
      const ps = c.financials.periods.filter((p) => p.revenue != null);
      const p = ps.find((x) => /TTM|LTM/i.test(x.label)) || ps[ps.length - 1];
      if (p) return { valueM: p.revenue, cur: c.financials.cur || 'USD', usdM: p.revenue * (c.financials.cur && c.financials.cur !== 'USD' ? c.fx : 1), label: p.label, kind: 'reported' };
    }
    if (!c.isPublic && c.revenue && c.revenue.valueUsdM != null) {
      return { valueM: c.revenue.valueUsdM, cur: 'USD', usdM: c.revenue.valueUsdM, label: c.revenue.period, kind: c.revenue.kind || 'reported' };
    }
    return null;
  }

  function monogram(name) {
    const words = name.replace(/[^A-Za-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w && !/^(the|of|and|inc|corp|co|ltd|plc|ag|se|sa|group|industries|technologies|systems|holdings|defense|security)$/i.test(w));
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    const w = words[0] || name;
    if (w.length <= 4 && w === w.toUpperCase()) return w;
    const caps = w.match(/[A-Z0-9]/g) || [];
    if (caps.length >= 2 && caps.length <= 3) return caps.join('');
    return w[0].toUpperCase() + (w[1] || '').toLowerCase();
  }
  function hue(id) { let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360; return h; }

  /* ---------------------------------------------------------------- logos */
  let remoteLogos = false;
  const FAVICON = (d) => `https://www.google.com/s2/favicons?domain=${encodeURIComponent(d)}&sz=128`;
  function monoHTML(c) {
    const m = monogram(c.short || c.name);
    return `<span class="mono${m.length >= 3 ? ' len-3' : ''}">${esc(m)}</span>`;
  }
  function logoHTML(c) {
    const h = 190 + (hue(c.id) % 110);
    const style = `--mono-bg: linear-gradient(145deg, hsl(${h} 32% 27%), hsl(${h + 14} 38% 13%))`;
    const local = D.logos && D.logos[c.id];
    if (local) {
      return `<span class="logo ${local.dark ? 'is-dark' : 'is-light'}" style="${style}"><img src="${local.src}" alt="" loading="lazy" decoding="async"></span>`;
    }
    if (remoteLogos && c.domain) {
      return `<span class="logo is-light" style="${style}" data-mono="${esc(monogram(c.short || c.name))}"><img src="${FAVICON(c.domain)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"></span>`;
    }
    return `<span class="logo" style="${style}">${monoHTML(c)}</span>`;
  }
  function fallbackLogo(img) {
    const box = img.closest('.logo');
    if (!box || !box.dataset.mono) return;
    const m = box.dataset.mono;
    box.classList.remove('is-light');
    box.innerHTML = `<span class="mono${m.length >= 3 ? ' len-3' : ''}">${esc(m)}</span>`;
  }
  document.addEventListener('error', (e) => { if (e.target.tagName === 'IMG' && e.target.closest('.logo')) fallbackLogo(e.target); }, true);
  document.addEventListener('load', (e) => {
    const img = e.target;
    if (img.tagName === 'IMG' && img.closest('.logo[data-mono]') && img.naturalWidth < 32) fallbackLogo(img);
  }, true);
  function probeRemoteLogos() {
    if (window.DTM_REMOTE_LOGOS === false) return;
    const img = new Image();
    img.onload = () => { if (img.naturalWidth > 0) { remoteLogos = true; render(); } };
    img.referrerPolicy = 'no-referrer';
    img.src = FAVICON('github.com');
  }

  /* ---------------------------------------------------------------- state */
  const state = {
    q: '', own: 'all', region: '', lens: '', group: 'sub', sort: 'value', scale: false, view: 'map',
    tableSort: { key: 'value', dir: -1 }, compare: [], open: null, tab: 'overview'
  };

  function matches(c) {
    if (state.own !== 'all' && c.status !== state.own) return false;
    if (state.region && c.region !== state.region) return false;
    if (state.q) {
      const terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      if (!terms.every((t) => c.hay.includes(t))) return false;
    }
    return true;
  }
  const inLens = (c) => !state.lens || c.programRefs.has(state.lens);

  function sorter(a, b) {
    if (state.sort === 'name') return a.name.localeCompare(b.name);
    if (state.sort === 'founded') return (b.founded || 0) - (a.founded || 0) || a.name.localeCompare(b.name);
    const av = a.value == null ? -1 : a.value, bv = b.value == null ? -1 : b.value;
    return bv - av || a.name.localeCompare(b.name);
  }

  const ERAS = [
    { id: 'pre2000', name: 'Founded before 2000', test: (y) => y < 2000 },
    { id: '2000', name: 'Founded 2000–2015', test: (y) => y >= 2000 && y <= 2015 },
    { id: '2016', name: 'Founded 2016–2019', test: (y) => y >= 2016 && y <= 2019 },
    { id: '2020', name: 'Founded 2020–2022', test: (y) => y >= 2020 && y <= 2022 },
    { id: '2023', name: 'Founded 2023 or later', test: (y) => y >= 2023 }
  ];
  const STAGES = [
    { id: 'public', name: 'Public', test: (c) => c.isPublic },
    { id: 'p1b', name: 'Private · $1B+ raised', test: (c) => !c.isPublic && c.value >= 1000 },
    { id: 'p250', name: 'Private · $250M–$1B raised', test: (c) => !c.isPublic && c.value >= 250 && c.value < 1000 },
    { id: 'p50', name: 'Private · $50M–$250M raised', test: (c) => !c.isPublic && c.value >= 50 && c.value < 250 },
    { id: 'p0', name: 'Private · under $50M raised', test: (c) => !c.isPublic && c.value != null && c.value < 50 },
    { id: 'pna', name: 'Private · undisclosed', test: (c) => !c.isPublic && c.value == null }
  ];

  /* ---------------------------------------------------------------- tiles */
  function metricText(c) {
    if (c.value == null) return c.isPublic ? 'n/a' : (c.funding && c.funding.label) || 'Undisclosed';
    return money(c.value);
  }
  function metricLong(c) {
    if (c.isPublic) return c.value == null ? 'Market cap n/a' : `${money(c.value)} market cap`;
    if (c.value == null) return (c.funding && c.funding.label) || 'Funding undisclosed';
    return `${money(c.value)} raised to date`;
  }
  function tileHTML(c) {
    const cls = ['tile'];
    if (c.isBig) cls.push('is-big');
    if (state.lens && inLens(c)) cls.push('in-lens');
    const undisclosed = c.value == null;
    return `<button class="${cls.join(' ')}" type="button" data-id="${c.id}" data-status="${c.isPublic ? 'public' : 'private'}" aria-label="${esc(`${c.name}, ${c.isPublic ? 'public' : 'private'}, ${metricLong(c)}`)}">
      ${logoHTML(c)}<span class="name">${esc(c.short || c.name)}</span><span class="metric${undisclosed ? ' is-undisclosed' : ''}">${esc(metricText(c))}</span></button>`;
  }

  /* ---------------------------------------------------------------- board */
  const segTracks = {};
  D.segments.forEach((seg) => {
    let n = 0;
    seg.subsegments.forEach((sub) => { n += companies.filter((c) => c.subs.includes(sub.id)).length; });
    segTracks[seg.id] = n <= 8 ? 2 : n <= 20 ? 3 : n <= 34 ? 4 : 5;
  });

  function renderBoard(visible) {
    const board = $('#board');
    board.classList.toggle('is-scaled', state.scale);
    board.classList.toggle('has-lens', !!state.lens);
    let html = '';
    D.segments.forEach((seg) => {
      const inSeg = visible.filter((c) => c.segs.includes(seg.id));
      if (!inSeg.length) return;
      let groups;
      if (state.group === 'sub') {
        groups = seg.subsegments.map((sub) => ({ id: sub.id, name: sub.name, blurb: sub.blurb, items: inSeg.filter((c) => c.subs.includes(sub.id)) }));
      } else if (state.group === 'era') {
        groups = ERAS.map((e) => ({ id: e.id, name: e.name, items: inSeg.filter((c) => c.founded && e.test(c.founded)) }));
      } else {
        groups = STAGES.map((s) => ({ id: s.id, name: s.name, items: inSeg.filter(s.test) }));
      }
      groups = groups.filter((g) => g.items.length);
      const pubCap = inSeg.filter((c) => c.isPublic && c.value).reduce((a, c) => a + c.value, 0);
      const privRaised = inSeg.filter((c) => !c.isPublic && c.value).reduce((a, c) => a + c.value, 0);
      const nPub = inSeg.filter((c) => c.isPublic).length;
      html += `<section class="segment" style="--tracks:${segTracks[seg.id]}" aria-labelledby="seg-${seg.id}">
        <header class="segment-head">
          <h2 class="segment-title" id="seg-${seg.id}"><span class="segment-code">${esc(seg.code)}</span>${esc(seg.name)}</h2>
          <p class="segment-stats">
            <span>${inSeg.length} cos</span>
            ${nPub ? `<span class="stat-public" title="Combined market cap of public companies in this segment">${money(pubCap)}</span>` : ''}
            ${privRaised ? `<span class="stat-private" title="Combined funding raised by private companies in this segment">${money(privRaised)}</span>` : ''}
          </p>
        </header>
        <div class="segment-body">
          ${groups.map((g) => `<div class="group">
            <div class="group-head"><h3 class="group-title"${g.blurb ? ` title="${esc(g.blurb)}"` : ''}>${esc(g.name)}</h3><span class="group-count">${g.items.length}</span></div>
            <div class="tiles">${g.items.slice().sort(sorter).map(tileHTML).join('')}</div>
          </div>`).join('')}
        </div>
      </section>`;
    });
    board.innerHTML = html;
  }

  /* ---------------------------------------------------------------- table */
  const TABLE_COLS = [
    { key: 'name', label: 'Company', get: (c) => c.name },
    { key: 'segment', label: 'Segment', get: (c) => subIndex[c.subs[0]].seg.name },
    { key: 'status', label: 'Status', get: (c) => c.status },
    { key: 'country', label: 'HQ', get: (c) => c.country },
    { key: 'founded', label: 'Founded', get: (c) => c.founded || 0, num: true },
    { key: 'value', label: 'Mkt cap / Raised', get: (c) => c.value, num: true },
    { key: 'val', label: 'EV / Last valuation', get: (c) => (c.isPublic ? c.valuation && c.valuation.evUsdM : c.lastPost && c.lastPost.postUsdM), num: true },
    { key: 'rev', label: 'Revenue (≈USD)', get: (c) => c.latestRevenue && c.latestRevenue.usdM, num: true },
    { key: 'evs', label: 'Sales multiple', get: (c) => c.valuation && c.valuation.evSales, num: true }
  ];
  function renderTable(visible) {
    const { key, dir } = state.tableSort;
    const col = TABLE_COLS.find((x) => x.key === key) || TABLE_COLS[5];
    const rows = visible.slice().sort((a, b) => {
      const av = col.get(a), bv = col.get(b);
      if (av == null && bv == null) return a.name.localeCompare(b.name);
      if (av == null) return 1;
      if (bv == null) return -1;
      return (typeof av === 'string' ? av.localeCompare(bv) : av - bv) * dir;
    });
    $('#table-view').innerHTML = `<table class="data-table">
      <thead><tr>${TABLE_COLS.map((x) => `<th scope="col" class="${x.num ? 'num' : ''}"${x.key === key ? ` aria-sort="${dir > 0 ? 'ascending' : 'descending'}"` : ''}><button type="button" data-sort="${x.key}">${esc(x.label)}</button></th>`).join('')}</tr></thead>
      <tbody>${rows.map((c) => {
        const sub = subIndex[c.subs[0]];
        const v = TABLE_COLS[6].get(c);
        return `<tr data-id="${c.id}" tabindex="0">
          <td><span class="co">${logoHTML(c)}${esc(c.name)}</span></td>
          <td>${esc(sub.seg.name)} <span class="src">· ${esc(sub.sub.name)}</span></td>
          <td><span class="status-chip ${c.status}">${c.isPublic ? esc(`${c.exchange || ''}: ${c.ticker || ''}`) : esc(c.stage || 'Private')}</span></td>
          <td>${esc(c.country)}</td>
          <td class="num">${c.founded || '—'}</td>
          <td class="num">${c.value == null ? '—' : money(c.value)}</td>
          <td class="num">${v == null ? '—' : money(v)}</td>
          <td class="num">${c.latestRevenue ? money(c.latestRevenue.usdM) + (c.latestRevenue.kind === 'estimate' ? '*' : '') : '—'}</td>
          <td class="num">${(c.valuation && mult(c.valuation.evSales)) || '—'}</td>
        </tr>`;
      }).join('')}</tbody></table>
      <p class="src" style="padding:8px 12px">* Third-party estimate. Non-USD figures converted at the market-cap snapshot exchange rate.</p>`;
  }

  /* ---------------------------------------------------------------- top-level render */
  function render() {
    const visible = companies.filter(matches);
    $('#result-count').textContent = `Showing ${visible.length} of ${companies.length} companies`;
    const filtered = state.q || state.own !== 'all' || state.region || state.lens;
    $('#reset-btn').hidden = !filtered;
    $('#empty').hidden = visible.length > 0;
    $('#board').hidden = state.view !== 'map' || !visible.length;
    $('#table-view').hidden = state.view !== 'table' || !visible.length;
    if (state.view === 'map') renderBoard(visible); else renderTable(visible);
    renderLensBanner(visible);
    renderTray();
  }

  function renderLensBanner(visible) {
    const banner = $('#lens-banner');
    const sel = $('#lens');
    sel.classList.toggle('is-active', !!state.lens);
    if (!state.lens) { banner.hidden = true; return; }
    const p = programIndex[state.lens];
    const n = visible.filter(inLens).length;
    banner.hidden = false;
    banner.innerHTML = `<strong>${esc(p.name)}</strong><span>${n} ${n === 1 ? 'company' : 'companies'} highlighted · ${esc(p.customer)}</span><span>${esc(p.blurb)}</span><button class="link-btn" type="button" data-action="clear-lens">Clear lens</button>`;
  }

  function renderHeadline() {
    const pub = companies.filter((c) => c.isPublic);
    const priv = companies.filter((c) => !c.isPublic);
    const cap = pub.reduce((a, c) => a + (c.value || 0), 0);
    const raised = priv.reduce((a, c) => a + (c.value || 0), 0);
    $('#headline-stats').innerHTML = `
      <div><dt>Companies</dt><dd>${companies.length}</dd></div>
      <div><dt>Segments</dt><dd>${D.segments.length}</dd></div>
      <div class="is-public"><dt>Public market cap · ${pub.length} cos</dt><dd>${money(cap)}</dd></div>
      <div class="is-private"><dt>Private capital raised · ${priv.length} cos</dt><dd>${money(raised)}</dd></div>`;
    $('#edition').textContent = `${D.meta.edition} edition`;
    $('#asof').textContent = `Compiled ${date(D.meta.asOf, true)}`;
    $('#method-note').textContent = D.meta.note;
  }

  function populateControls() {
    const regionSel = $('#region');
    D.regions.forEach((r) => {
      const n = companies.filter((c) => c.region === r.id).length;
      if (n) regionSel.insertAdjacentHTML('beforeend', `<option value="${r.id}">${esc(r.name)} (${n})</option>`);
    });
    const lensSel = $('#lens');
    (D.programs || []).map((p) => ({ p, n: companies.filter((c) => c.programRefs.has(p.id)).length }))
      .filter((x) => x.n)
      .sort((a, b) => b.n - a.n)
      .forEach(({ p, n }) => lensSel.insertAdjacentHTML('beforeend', `<option value="${p.id}">${esc(p.name)} (${n})</option>`));
  }

  /* ---------------------------------------------------------------- hover card */
  let hoverTimer = null;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  function showHover(tile) {
    const c = byId[tile.dataset.id];
    if (!c) return;
    const card = $('#hovercard');
    const also = c.subs.map((s) => subIndex[s].sub.name);
    const meta = [c.hq, c.founded ? `Founded ${c.founded}` : '', c.isPublic ? `${c.exchange}: ${c.ticker}` : c.stage].filter(Boolean).join(' · ');
    card.innerHTML = `<h3>${esc(c.name)}</h3><p class="hc-meta">${esc(meta)}</p><p>${esc(c.oneLiner || '')}</p>
      <div class="hc-metric">${esc(metricLong(c))}${c.isPublic && c.marketCap && c.marketCap.asOf ? ` <span class="src">(${esc(date(c.marketCap.asOf, true))})</span>` : ''}</div>
      ${!c.isPublic && c.lastPost ? `<div class="hc-metric">${money(c.lastPost.postUsdM)} last valuation <span class="src">(${esc(date(c.lastPost.date))})</span></div>` : ''}
      ${also.length > 1 ? `<div class="hc-also">Appears in: ${esc(also.join(', '))}</div>` : ''}
      <div class="hc-hint">Click for full profile</div>`;
    card.hidden = false;
    const r = tile.getBoundingClientRect();
    const cw = card.offsetWidth, ch = card.offsetHeight;
    let x = r.right + 10;
    if (x + cw > window.innerWidth - 12) x = r.left - cw - 10;
    if (x < 12) x = Math.min(window.innerWidth - cw - 12, Math.max(12, r.left));
    let y = r.top;
    if (y + ch > window.innerHeight - 12) y = window.innerHeight - ch - 12;
    card.style.left = `${Math.max(12, x)}px`;
    card.style.top = `${Math.max(12, y)}px`;
  }
  function hideHover() { clearTimeout(hoverTimer); $('#hovercard').hidden = true; }
  function setLinked(id, on) {
    $$('.board .tile.is-linked').forEach((t) => t.classList.remove('is-linked'));
    if (on) {
      const copies = $$(`.board .tile[data-id="${CSS.escape(id)}"]`);
      if (copies.length > 1) copies.forEach((t) => t.classList.add('is-linked'));
    }
  }

  /* ---------------------------------------------------------------- detail */
  const TABS = [
    { id: 'overview', label: 'Company description' },
    { id: 'financials', label: 'Financials' },
    { id: 'valuation', label: 'Valuation' },
    { id: 'programs', label: 'Key programs' },
    { id: 'peers', label: 'Peers' }
  ];

  function kpi(label, value, note, headline) {
    return `<div class="kpi${headline ? ' is-headline' : ''}"><span class="kpi-label">${esc(label)}</span><span class="kpi-value">${value}</span>${note ? `<span class="kpi-note">${note}</span>` : ''}</div>`;
  }
  const NA = '<span class="na">Not disclosed</span>';
  const NC = '<span class="na">Not compiled</span>';
  const salesLabel = (v) => (v && /^Market cap/i.test(v.basis || '') ? 'Price / Sales' : 'EV / Sales');
  const ratio = (x) => (x == null ? '—' : x > 0 ? mult(x) : 'n/m');

  function kpisHTML(c) {
    if (c.isPublic) {
      const v = c.valuation || {};
      const r = c.latestRevenue;
      return kpi('Market cap', c.value == null ? NA : money(c.value), c.marketCap && c.marketCap.asOf ? esc(date(c.marketCap.asOf, true)) : '', true)
        + kpi('Enterprise value', v.evUsdM != null ? money(v.evUsdM) : NC, v.evUsdM != null && v.asOf ? esc(date(v.asOf, true)) : '')
        + kpi('Revenue', r ? money(r.valueM, r.cur) : NA, r ? esc(r.label) : '')
        + kpi(salesLabel(v), v.evSales != null ? mult(v.evSales) : NC, v.evSales != null ? esc(v.basis || 'Trailing twelve months') : '');
    }
    const lr = c.lastRound;
    const r = c.latestRevenue;
    return kpi('Total raised', c.value == null ? NA : money(c.value), c.funding && c.funding.asOf ? `Through ${esc(date(c.funding.asOf))}` : '', true)
      + kpi('Last valuation', c.lastPost ? money(c.lastPost.postUsdM) : NA, c.lastPost ? esc(`Post-money · ${date(c.lastPost.date)}`) : '')
      + kpi('Last round', lr ? esc(lr.type) : NA, lr ? esc(`${lr.amountUsdM ? money(lr.amountUsdM) + ' · ' : ''}${date(lr.date)}`) : '')
      + kpi('Revenue', r ? money(r.valueM) + (r.kind === 'estimate' ? '<span class="est-tag">est.</span>' : '') : NA, r ? esc(r.label) : '');
  }

  function overviewHTML(c) {
    const paras = Array.isArray(c.description) ? c.description : [c.description || c.oneLiner || ''];
    const facts = [];
    facts.push(['Founded', c.founded || '—']);
    facts.push(['Headquarters', esc([c.hq, D.countryNames[c.country] || c.country].filter(Boolean).join(', '))]);
    if (c.employees) facts.push(['Employees', esc(c.employees)]);
    if (c.leadership && c.leadership.length) facts.push(['Leadership', c.leadership.map((l) => `${esc(l[0])} <span class="src">${esc(l[1])}</span>`).join('<br>')]);
    if (c.isPublic) facts.push(['Listing', esc(`${c.exchange}: ${c.ticker}`)]);
    else facts.push(['Stage', esc(c.stage || 'Private')]);
    if (c.domain) facts.push(['Website', `<a href="https://${esc(c.domain)}" target="_blank" rel="noopener">${esc(c.domain)}</a>`]);
    const investors = (c.funding && c.funding.investors) || [];
    return `<div class="cols">
      <div>
        <div class="section prose">${paras.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
        ${c.products && c.products.length ? `<div class="section"><h3 class="section-title">Key products</h3><div class="chips">${c.products.map((p) => `<span class="chip">${esc(p)}</span>`).join('')}</div></div>` : ''}
        ${investors.length ? `<div class="section"><h3 class="section-title">Notable investors</h3><div class="chips">${investors.map((p) => `<span class="chip">${esc(p)}</span>`).join('')}</div></div>` : ''}
        ${srcHTML(c.descSrc, null)}
      </div>
      <div>
        <div class="section"><h3 class="section-title">Fact sheet</h3><dl class="facts">${facts.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`).join('')}</dl></div>
        <div class="section"><h3 class="section-title">On the map</h3><div class="chips">${c.subs.map((s) => `<button class="chip" type="button" data-action="goto-sub" data-sub="${s}"><span class="code">${esc(subIndex[s].seg.code)}</span>${esc(subIndex[s].sub.name)}</button>`).join('')}</div></div>
      </div>
    </div>`;
  }

  function financialsHTML(c) {
    const C = window.DTMCharts;
    if (c.isPublic) {
      const f = c.financials;
      if (!f || !f.periods || !f.periods.length) return `<p class="na">Financials not yet added for this company.</p>`;
      const cur = f.cur || 'USD';
      const ps = f.periods;
      const chartData = ps.filter((p) => p.revenue != null).map((p) => ({ label: p.label, value: p.revenue, display: money(p.revenue, cur) }));
      const rowsDef = [
        ['Revenue', (p) => (p.revenue != null ? money(p.revenue, cur) : '—')],
        ['Revenue growth', (p, i) => {
          if (p.growth != null) return `<span class="${p.growth >= 0 ? 'pos' : 'neg'}">${pct(p.growth)}</span>`;
          const prev = ps[i - 1];
          if (!prev || prev.revenue == null || p.revenue == null || /TTM|LTM/i.test(p.label)) return '—';
          const g = (p.revenue / prev.revenue - 1) * 100;
          return `<span class="${g >= 0 ? 'pos' : 'neg'}">${pct(g)}</span>`;
        }],
        ['Gross margin', (p) => (p.grossMargin != null ? p.grossMargin.toFixed(1) + '%' : '—'), (p) => p.grossMargin != null],
        ['Operating income', (p) => (p.opIncome != null ? `<span class="${p.opIncome >= 0 ? '' : 'neg'}">${money(p.opIncome, cur)}</span>` : '—'), (p) => p.opIncome != null],
        ['Operating margin', (p) => (p.opIncome != null && p.revenue ? `${(p.opIncome / p.revenue * 100).toFixed(1)}%` : '—'), (p) => p.opIncome != null],
        ['Adj. EBITDA', (p) => (p.ebitda != null ? `<span class="${p.ebitda >= 0 ? '' : 'neg'}">${money(p.ebitda, cur)}</span>` : '—'), (p) => p.ebitda != null],
        ['Net income', (p) => (p.netIncome != null ? `<span class="${p.netIncome >= 0 ? '' : 'neg'}">${money(p.netIncome, cur)}</span>` : '—'), (p) => p.netIncome != null],
        ['Free cash flow', (p) => (p.fcf != null ? `<span class="${p.fcf >= 0 ? '' : 'neg'}">${money(p.fcf, cur)}</span>` : '—'), (p) => p.fcf != null]
      ].filter((r) => !r[2] || ps.some(r[2]));
      const extras = [];
      if (f.backlog) extras.push(`<div class="stat"><span class="stat-label">Backlog</span><span class="stat-value">${money(f.backlog.valueM, cur)}</span><span class="stat-note">${esc(f.backlog.note || '')}${f.backlog.asOf ? ` · ${esc(date(f.backlog.asOf, true))}` : ''}</span></div>`);
      if (f.defenseMix) extras.push(`<div class="stat"><span class="stat-label">Defense & government share</span><span class="stat-value">${esc(f.defenseMix)}</span><span class="stat-note">of revenue</span></div>`);
      (f.extra || []).forEach((x) => extras.push(`<div class="stat"><span class="stat-label">${esc(x.label)}</span><span class="stat-value">${esc(x.value)}</span>${x.note ? `<span class="stat-note">${esc(x.note)}</span>` : ''}</div>`));
      return `${chartData.length >= 2 ? `<div class="section"><h3 class="section-title">Revenue (${esc(cur)})${f.fyEnd ? ` · fiscal year ends ${esc(f.fyEnd)}` : ''}</h3>${C.columns(chartData, { format: (v) => money(v, cur), label: `${c.name} revenue by period` })}</div>` : ''}
        <div class="section scroll-x"><table class="fin-table"><thead><tr><th>${esc(cur)}</th>${ps.map((p) => `<th>${esc(p.label)}</th>`).join('')}</tr></thead>
          <tbody>${rowsDef.map(([name, fn]) => `<tr><td>${esc(name)}</td>${ps.map((p, i) => `<td>${fn(p, i)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
        ${extras.length ? `<div class="section stat-grid">${extras.join('')}</div>` : ''}
        ${f.notes ? `<div class="section prose"><p>${esc(f.notes)}</p></div>` : ''}
        ${srcHTML(f.src, f.asOf)}`;
    }
    // Private
    const fnd = c.funding || {};
    const rounds = c.rounds;
    const withAmt = rounds.filter((r) => r.amountUsdM);
    const r = c.latestRevenue;
    return `<div class="stat-grid section">
        <div class="stat"><span class="stat-label">Total raised</span><span class="stat-value">${c.value == null ? NA : money(c.value)}</span><span class="stat-note">${fnd.asOf ? `Through ${esc(date(fnd.asOf))}` : ''}</span></div>
        <div class="stat"><span class="stat-label">Priced rounds tracked</span><span class="stat-value">${rounds.length || '—'}</span><span class="stat-note">${rounds.length ? `First tracked ${esc(date(rounds[0].date))}` : ''}</span></div>
        <div class="stat"><span class="stat-label">Revenue</span><span class="stat-value">${r ? money(r.valueM) + (r.kind === 'estimate' ? '<span class="est-tag">est.</span>' : '') : NA}</span><span class="stat-note">${r ? esc(r.label) + (c.revenue.note ? ' · ' + esc(c.revenue.note) : '') : 'Private companies rarely report revenue'}</span></div>
        ${c.employees ? `<div class="stat"><span class="stat-label">Employees</span><span class="stat-value">${esc(c.employees)}</span></div>` : ''}
      </div>
      ${withAmt.length >= 2 ? `<div class="section"><h3 class="section-title">Capital raised by round (USD)</h3>${window.DTMCharts.columns(withAmt.map((x) => ({ label: shortRound(x.type), value: x.amountUsdM, display: money(x.amountUsdM), tip: `${x.type} · ${date(x.date)}: ${money(x.amountUsdM)}`, cls: 'mark-private' })), { format: (v) => money(v), label: `${c.name} funding by round` })}</div>` : ''}
      ${rounds.length ? `<div class="section scroll-x"><h3 class="section-title">Funding history</h3><table class="fin-table"><thead><tr><th>Round</th><th>Date</th><th>Amount</th><th>Post-money</th><th style="text-align:left">Lead investors</th></tr></thead><tbody>
        ${rounds.slice().reverse().map((x) => `<tr><td>${esc(x.type)}</td><td>${esc(date(x.date))}</td><td>${x.amountUsdM ? money(x.amountUsdM) : '—'}</td><td>${x.postUsdM ? money(x.postUsdM) : '—'}</td><td style="text-align:left;font-family:var(--font-body)">${esc((x.leads || []).join(', ') || '—')}</td></tr>`).join('')}
      </tbody></table></div>` : `<p class="na section">No priced rounds disclosed.</p>`}
      ${fnd.note ? `<div class="section prose"><p>${esc(fnd.note)}</p></div>` : ''}
      ${srcHTML(fnd.src, fnd.asOf)}${c.revenue ? srcHTML(c.revenue.src, null, 'Revenue source') : ''}`;
  }
  function shortRound(t) { return String(t).replace(/^Series /, 'Ser. ').replace(/Strategic/, 'Strat.').replace(/Secondary|Tender offer/, 'Tender'); }

  function valuationHTML(c) {
    const C = window.DTMCharts;
    if (c.isPublic) {
      const v = c.valuation;
      if (!v) return `<p class="na">Valuation data not yet added for this company.</p>`;
      const stats = [
        ['Market cap', c.value != null ? money(c.value) : '—', c.marketCap && c.marketCap.local ? `${money(c.marketCap.local.valueM, c.marketCap.local.cur)} in local currency` : ''],
        ['Enterprise value', v.evUsdM != null ? money(v.evUsdM) : '—', v.evUsdM != null ? 'Market cap + net debt' : 'Not compiled'],
        [salesLabel(v), ratio(v.evSales), v.evSales != null ? (v.basis || 'Trailing twelve months') : 'Not compiled'],
        ['EV / EBITDA', ratio(v.evEbitda), v.evEbitda != null ? 'Trailing twelve months' : 'Not compiled'],
        ['P / E', ratio(v.pe), v.pe != null ? (v.peBasis || 'Latest fiscal year earnings') : 'Not compiled'],
        ['Forward P / E', ratio(v.fwdPe), v.fwdPe != null ? 'Next twelve months, consensus' : 'Not compiled']
      ].filter((x, i) => i < 3 || x[1] !== '—');
      const seg = subIndex[c.subs[0]].seg;
      const peers = companies.filter((p) => p.isPublic && p.valuation && p.valuation.evSales != null && p.segs.includes(seg.id))
        .sort((a, b) => b.valuation.evSales - a.valuation.evSales);
      const chart = peers.length >= 3 && v.evSales != null
        ? `<div class="section"><h3 class="section-title">Sales multiple vs public peers in ${esc(seg.name)}</h3>${C.rows(peers.map((p) => ({ label: p.short || p.name, value: p.valuation.evSales, display: mult(p.valuation.evSales), highlight: p.id === c.id, tip: `${p.name}: ${mult(p.valuation.evSales)} (${salesLabel(p.valuation)}, ${p.valuation.basis || 'TTM'})` })), { format: mult, label: 'Sales multiple comparison' })}<p class="chart-caption">EV / Sales where enterprise value was compiled, otherwise market cap / sales. Each peer uses its own as-of date; hover a bar for its basis.</p></div>` : '';
      return `<div class="section stat-grid">${stats.map(([l, val, n]) => `<div class="stat"><span class="stat-label">${esc(l)}</span><span class="stat-value">${val}</span><span class="stat-note">${esc(n)}</span></div>`).join('')}</div>
        ${chart}${v.note ? `<div class="section prose"><p>${esc(v.note)}</p></div>` : ''}${srcHTML(v.src, v.asOf)}`;
    }
    const posts = c.rounds.filter((r) => r.postUsdM);
    const lp = c.lastPost;
    const prior = posts.length >= 2 ? posts[posts.length - 2] : null;
    const step = lp && prior && prior.postUsdM && lp.date !== prior.date ? lp.postUsdM / prior.postUsdM : null;
    const rev = c.latestRevenue;
    const stats = [
      ['Last post-money valuation', lp ? money(lp.postUsdM) : NA, lp ? `${lp.type ? esc(lp.type) + ' · ' : ''}${esc(date(lp.date))}` : ''],
      ['Step-up vs prior round', step ? mult(step) : '—', prior ? `From ${money(prior.postUsdM)} (${esc(date(prior.date))})` : ''],
      ['Valuation / capital raised', lp && c.value ? mult(lp.postUsdM / c.value) : '—', 'Post-money ÷ total raised'],
      ['Implied revenue multiple', lp && rev ? mult(lp.postUsdM / rev.usdM) : '—', lp && rev ? `On ${esc(rev.label)} revenue${rev.kind === 'estimate' ? ' (est.)' : ''}` : 'Needs disclosed revenue']
    ];
    return `<div class="section stat-grid">${stats.map(([l, val, n]) => `<div class="stat"><span class="stat-label">${esc(l)}</span><span class="stat-value">${val}</span><span class="stat-note">${n}</span></div>`).join('')}</div>
      ${posts.length >= 2 ? `<div class="section"><h3 class="section-title">Post-money valuation by round (USD)</h3>${C.columns(posts.map((x) => ({ label: `${shortRound(x.type)} '${String(x.date).slice(2, 4)}`, value: x.postUsdM, display: money(x.postUsdM), tip: `${x.type} · ${date(x.date)}: ${money(x.postUsdM)} post-money`, cls: 'mark-private' })), { format: (v) => money(v), label: `${c.name} valuation history` })}</div>` : ''}
      ${!lp ? `<p class="na section">This company has not disclosed a valuation.</p>` : ''}
      ${c.valuation && c.valuation.note ? `<div class="section prose"><p>${esc(c.valuation.note)}</p></div>` : ''}
      ${srcHTML(lp && lp.src ? lp.src : (c.valuation && c.valuation.src) || (c.funding && c.funding.src), null)}`;
  }

  function programsHTML(c) {
    const ps = c.programs || [];
    if (!ps.length) return `<p class="na">No major program awards disclosed yet.</p>`;
    return `<div class="programs">${ps.map((p) => {
      const ref = p.ref && programIndex[p.ref];
      const meta = [p.customer && `<span><b>Customer</b> ${esc(p.customer)}</span>`, p.role && `<span><b>Role</b> ${esc(p.role)}</span>`, p.year && `<span><b>Awarded</b> ${esc(p.year)}</span>`].filter(Boolean).join('');
      return `<article class="program">
        <div><h4>${esc(p.name)}</h4><div class="p-meta">${meta}</div></div>
        <div>${p.value ? `<div class="p-value">${esc(p.value)}</div>` : ''}${p.status ? `<div class="p-status">${esc(p.status)}</div>` : ''}</div>
        ${p.note ? `<p>${esc(p.note)}</p>` : ''}
        <div class="p-foot">${ref ? `<button class="chip" type="button" data-action="lens" data-lens="${ref.id}">Show all ${esc(ref.name)} companies on the map</button>` : ''}${srcHTML(p.src, null)}</div>
      </article>`;
    }).join('')}</div>`;
  }

  function peersHTML(c) {
    return c.subs.map((s) => {
      const peers = companies.filter((p) => p.id !== c.id && p.subs.includes(s)).sort(sorter);
      if (!peers.length) return '';
      return `<div class="peer-group"><h3 class="section-title">${esc(subIndex[s].seg.name)} · ${esc(subIndex[s].sub.name)}</h3><div class="tiles">${peers.map(tileHTML).join('')}</div></div>`;
    }).join('') || `<p class="na">No peers in the same subsegment.</p>`;
  }

  function navList(c) {
    const sub = c.subs[0];
    return companies.filter((p) => p.subs.includes(sub)).sort(sorter);
  }

  function renderDetail() {
    const c = byId[state.open];
    if (!c) return;
    const tab = TABS.some((t) => t.id === state.tab) ? state.tab : 'overview';
    const list = navList(c);
    const i = list.findIndex((p) => p.id === c.id);
    const prev = list[i - 1], next = list[i + 1];
    const inCompare = state.compare.includes(c.id);
    const body = { overview: overviewHTML, financials: financialsHTML, valuation: valuationHTML, programs: programsHTML, peers: peersHTML }[tab](c);
    const badge = c.isPublic ? `Public · ${c.exchange}: ${c.ticker}` : `Private${c.stage ? ' · ' + c.stage : ''}`;
    const dlg = $('#detail');
    dlg.style.setProperty('--d-wash', c.isPublic ? 'var(--public-wash)' : 'var(--private-wash)');
    dlg.style.setProperty('--headline', c.isPublic ? 'var(--public)' : 'var(--private)');
    $('#detail-inner').innerHTML = `
      <header class="d-head">
        ${logoHTML(c)}
        <div class="d-titles">
          <h2 class="d-name" id="detail-name">${esc(c.name)}</h2>
          <p class="d-one">${esc(c.oneLiner || '')}</p>
          <div class="d-badges"><span class="badge ${c.status}">${esc(badge)}</span><span>${esc([c.hq, D.countryNames[c.country] || c.country].filter(Boolean).join(' · '))}</span>${c.founded ? `<span>Founded ${c.founded}</span>` : ''}${c.domain ? `<a href="https://${esc(c.domain)}" target="_blank" rel="noopener">${esc(c.domain)} ↗</a>` : ''}</div>
        </div>
        <div class="d-actions">
          <button class="icon-btn" type="button" data-action="compare" aria-pressed="${inCompare}" title="${inCompare ? 'Remove from compare' : 'Add to compare'}" aria-label="${inCompare ? 'Remove from compare' : 'Add to compare'}">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 17h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><rect x="4.5" y="9" width="4" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="11.5" y="4" width="4" height="13" rx="1" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
          </button>
          <button class="icon-btn" type="button" data-action="close" aria-label="Close" title="Close (Esc)">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
        </div>
      </header>
      <div class="d-kpis">${kpisHTML(c)}</div>
      <nav class="d-tabs" role="tablist" aria-label="Company profile sections">
        ${TABS.map((t) => `<button type="button" role="tab" id="tab-${t.id}" aria-selected="${t.id === tab}" aria-controls="d-body" data-tab="${t.id}" tabindex="${t.id === tab ? 0 : -1}">${esc(t.label)}${t.id === 'programs' && c.programs && c.programs.length ? ` (${c.programs.length})` : ''}</button>`).join('')}
      </nav>
      <div class="d-body" id="d-body" role="tabpanel" aria-labelledby="tab-${tab}" tabindex="0">${body}</div>
      <footer class="d-foot">
        <span>${esc(subIndex[c.subs[0]].seg.name)} · ${esc(subIndex[c.subs[0]].sub.name)} · ${i + 1} of ${list.length}</span>
        <div class="d-nav">
          <button type="button" data-action="nav" data-to="${prev ? prev.id : ''}" ${prev ? '' : 'disabled'} aria-label="Previous company${prev ? ': ' + esc(prev.name) : ''}">← <span>${prev ? esc(prev.name) : 'Previous'}</span></button>
          <button type="button" data-action="nav" data-to="${next ? next.id : ''}" ${next ? '' : 'disabled'} aria-label="Next company${next ? ': ' + esc(next.name) : ''}"><span>${next ? esc(next.name) : 'Next'}</span> →</button>
        </div>
      </footer>`;
  }

  function openCompany(id, opts = {}) {
    const c = byId[id];
    if (!c) return;
    hideHover();
    state.open = id;
    state.tab = opts.tab || 'overview';
    renderDetail();
    const dlg = $('#detail');
    if (opts.from) {
      const r = opts.from.getBoundingClientRect();
      const vw = window.innerWidth, vh = window.innerHeight;
      const w = Math.min(1040, vw - 32);
      const left = (vw - w) / 2;
      const top = Math.max(16, (vh - Math.min(900, vh - 32)) / 2);
      dlg.style.transformOrigin = `${r.left + r.width / 2 - left}px ${r.top + r.height / 2 - top}px`;
    } else {
      dlg.style.transformOrigin = '50% 30%';
    }
    if (!dlg.open) {
      try { dlg.showModal(); } catch (e) { dlg.setAttribute('open', ''); }
    }
    $('#detail-inner').setAttribute('tabindex', '-1');
    if (!opts.keepFocus) $('#detail-inner').focus({ preventScroll: true });
    $('#d-body').scrollTop = 0;
    setHash(`${id}${state.tab !== 'overview' ? '.' + state.tab : ''}`);
  }
  function closeDetail() {
    const dlg = $('#detail');
    if (dlg.open) dlg.close();
  }
  $('#detail').addEventListener('close', () => {
    if ($('#detail').open) return; // reopened before the queued close event ran
    state.open = null;
    setHash('');
    hideChartTip();
  });

  function setHash(h) {
    try {
      const url = location.pathname + location.search + (h ? '#' + h : '');
      history.replaceState(null, '', url);
    } catch (e) { /* history unavailable in some sandboxes */ }
  }
  function readHash() {
    const h = decodeURIComponent((location.hash || '').slice(1));
    if (!h) return;
    const [id, tab] = h.split('.');
    if (byId[id]) openCompany(id, { tab });
  }

  /* ---------------------------------------------------------------- compare */
  function toggleCompare(id) {
    const i = state.compare.indexOf(id);
    if (i >= 0) state.compare.splice(i, 1);
    else {
      if (state.compare.length >= 4) state.compare.shift();
      state.compare.push(id);
    }
    renderTray();
  }
  function renderTray() {
    const tray = $('#compare-tray');
    if (!state.compare.length) { tray.hidden = true; return; }
    tray.hidden = false;
    tray.innerHTML = `<span class="tray-label">Compare</span>${state.compare.map((id) => `<button class="tray-chip" type="button" data-action="uncompare" data-id="${id}" aria-label="Remove ${esc(byId[id].name)} from compare">${esc(byId[id].short || byId[id].name)} <b>✕</b></button>`).join('')}
      <button class="tray-go" type="button" data-action="open-compare" ${state.compare.length < 2 ? 'disabled title="Add at least two companies"' : ''}>Compare ${state.compare.length}</button>
      <button class="tray-clear" type="button" data-action="clear-compare">Clear</button>`;
  }
  function openCompare() {
    const cs = state.compare.map((id) => byId[id]).filter(Boolean);
    const rows = [
      ['Status', (c) => `<span class="status-chip ${c.status}">${c.isPublic ? esc(`${c.exchange}: ${c.ticker}`) : esc(c.stage || 'Private')}</span>`],
      ['Segment', (c) => esc(c.subs.map((s) => subIndex[s].sub.name).join(', '))],
      ['Headquarters', (c) => esc(`${c.hq || ''}${c.country ? ', ' + c.country : ''}`)],
      ['Founded', (c) => c.founded || '—'],
      ['Employees', (c) => esc(c.employees || '—')],
      ['Market cap / Raised', (c) => (c.value == null ? '—' : `${money(c.value)} <span class="src">${c.isPublic ? 'market cap' : 'raised'}</span>`)],
      ['EV / Last valuation', (c) => (c.isPublic ? (c.valuation && c.valuation.evUsdM != null ? money(c.valuation.evUsdM) + ' <span class="src">EV</span>' : '—') : (c.lastPost ? money(c.lastPost.postUsdM) + ` <span class="src">post · ${esc(date(c.lastPost.date))}</span>` : '—'))],
      ['Revenue', (c) => (c.latestRevenue ? `${money(c.latestRevenue.valueM, c.latestRevenue.cur)} <span class="src">${esc(c.latestRevenue.label)}${c.latestRevenue.kind === 'estimate' ? ' est.' : ''}</span>` : '—')],
      ['Sales multiple', (c) => (c.valuation && c.valuation.evSales != null ? `${mult(c.valuation.evSales)} <span class="src">${salesLabel(c.valuation)}</span>` : '—')],
      ['P / E', (c) => (c.valuation && c.valuation.pe > 0 ? mult(c.valuation.pe) : '—')],
      ['Key programs', (c) => esc((c.programs || []).slice(0, 4).map((p) => p.name).join(' · ') || '—')]
    ];
    $('#compare-inner').innerHTML = `
      <header class="d-head" style="grid-template-columns:1fr auto">
        <div class="d-titles"><h2 class="d-name" id="compare-title">Compare</h2><p class="d-one">${cs.length} companies side by side. Click a name to open its profile.</p></div>
        <div class="d-actions"><button class="icon-btn" type="button" data-action="close-compare" aria-label="Close"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button></div>
      </header>
      <div class="d-body"><div class="scroll-x"><table class="data-table compare-table">
        <thead><tr><th></th>${cs.map((c) => `<th><button type="button" class="co" data-action="open-from-compare" data-id="${c.id}" style="text-transform:none;letter-spacing:0;font-size:var(--step-0);color:var(--ink)">${logoHTML(c)}${esc(c.name)}</button></th>`).join('')}</tr></thead>
        <tbody>${rows.map(([label, fn]) => `<tr style="cursor:default"><td style="color:var(--ink-3)">${esc(label)}</td>${cs.map((c) => `<td style="white-space:normal">${fn(c)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></div></div>`;
    const dlg = $('#compare-dialog');
    if (!dlg.open) { try { dlg.showModal(); } catch (e) { dlg.setAttribute('open', ''); } }
  }

  /* ---------------------------------------------------------------- chart tooltips */
  function showChartTip(target, x, y) {
    const tip = $('#chart-tip');
    tip.textContent = target.dataset.tip;
    tip.hidden = false;
    const w = tip.offsetWidth;
    tip.style.left = `${Math.min(window.innerWidth - w - 8, Math.max(8, x - w / 2))}px`;
    tip.style.top = `${Math.max(8, y - 40)}px`;
  }
  function hideChartTip() { $('#chart-tip').hidden = true; }

  /* ---------------------------------------------------------------- events */
  function bind() {
    const q = $('#q');
    let qTimer;
    q.addEventListener('input', () => { clearTimeout(qTimer); qTimer = setTimeout(() => { state.q = q.value.trim(); render(); }, 80); });
    $$('input[name="own"]').forEach((r) => r.addEventListener('change', () => { state.own = r.value; render(); }));
    $$('input[name="view"]').forEach((r) => r.addEventListener('change', () => { state.view = r.value; store.set('dtm-view', r.value); render(); }));
    $('#region').addEventListener('change', (e) => { state.region = e.target.value; render(); });
    $('#lens').addEventListener('change', (e) => { state.lens = e.target.value; render(); });
    $('#group').addEventListener('change', (e) => { state.group = e.target.value; render(); });
    $('#sort').addEventListener('change', (e) => { state.sort = e.target.value; render(); });
    $('#scale').addEventListener('change', (e) => { state.scale = e.target.checked; render(); });
    $('#reset-btn').addEventListener('click', resetFilters);
    $('#theme-btn').addEventListener('click', toggleTheme);

    document.addEventListener('click', (e) => {
      const tile = e.target.closest('.tile');
      if (tile) { openCompany(tile.dataset.id, { from: tile }); return; }
      const row = e.target.closest('tr[data-id]');
      if (row) { openCompany(row.dataset.id, { from: row }); return; }
      const sortBtn = e.target.closest('[data-sort]');
      if (sortBtn) {
        const k = sortBtn.dataset.sort;
        state.tableSort = { key: k, dir: state.tableSort.key === k ? -state.tableSort.dir : (k === 'name' || k === 'segment' || k === 'country' || k === 'status' ? 1 : -1) };
        render();
        return;
      }
      const tabBtn = e.target.closest('[data-tab]');
      if (tabBtn) { selectTab(tabBtn.dataset.tab); return; }
      const act = e.target.closest('[data-action]');
      if (!act) return;
      const a = act.dataset.action;
      if (a === 'close') closeDetail();
      else if (a === 'nav' && act.dataset.to) openCompany(act.dataset.to, { tab: state.tab });
      else if (a === 'compare' && state.open) { toggleCompare(state.open); renderDetail(); }
      else if (a === 'uncompare') toggleCompare(act.dataset.id);
      else if (a === 'clear-compare') { state.compare = []; renderTray(); }
      else if (a === 'open-compare') openCompare();
      else if (a === 'close-compare') $('#compare-dialog').close();
      else if (a === 'open-from-compare') { $('#compare-dialog').close(); openCompany(act.dataset.id); }
      else if (a === 'lens') { state.lens = act.dataset.lens; $('#lens').value = state.lens; closeDetail(); setView('map'); render(); scrollToBoard(); }
      else if (a === 'clear-lens') { state.lens = ''; $('#lens').value = ''; render(); }
      else if (a === 'reset') resetFilters();
      else if (a === 'goto-sub') { closeDetail(); gotoSub(act.dataset.sub); }
    });

    // Click on the backdrop closes the dialogs.
    ['#detail', '#compare-dialog'].forEach((sel) => {
      $(sel).addEventListener('click', (e) => { if (e.target === e.currentTarget) e.currentTarget.close(); });
    });

    const board = $('#board');
    board.addEventListener('pointerover', (e) => {
      const tile = e.target.closest('.tile');
      if (!tile) return;
      setLinked(tile.dataset.id, true);
      if (!fine.matches) return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => showHover(tile), 260);
    });
    board.addEventListener('pointerout', (e) => {
      const tile = e.target.closest('.tile');
      if (!tile || (e.relatedTarget && tile.contains(e.relatedTarget))) return;
      setLinked(tile.dataset.id, false);
      hideHover();
    });
    board.addEventListener('focusin', (e) => { const t = e.target.closest('.tile'); if (t) setLinked(t.dataset.id, true); });
    board.addEventListener('focusout', () => setLinked('', false));
    window.addEventListener('scroll', hideHover, { passive: true });

    $('#detail').addEventListener('pointermove', (e) => {
      const bar = e.target.closest('[data-tip]');
      if (bar) showChartTip(bar, e.clientX, e.clientY); else hideChartTip();
    });
    $('#detail').addEventListener('pointerleave', hideChartTip);

    document.addEventListener('keydown', (e) => {
      const typing = /^(INPUT|SELECT|TEXTAREA)$/.test((e.target || {}).tagName);
      if (e.key === '/' && !typing && !$('#detail').open) { e.preventDefault(); q.focus(); q.select(); return; }
      if ($('#detail').open && !typing) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          if (e.target.closest && e.target.closest('.d-tabs')) {
            const i = TABS.findIndex((t) => t.id === state.tab);
            const n = TABS[(i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length];
            selectTab(n.id);
            $(`#tab-${n.id}`).focus();
          } else {
            const btn = $$('.d-nav button')[e.key === 'ArrowLeft' ? 0 : 1];
            if (btn && !btn.disabled) btn.click();
          }
        }
      }
      if (e.key === 'Enter' && e.target.matches && e.target.matches('tr[data-id]')) openCompany(e.target.dataset.id, { from: e.target });
    });
    window.addEventListener('hashchange', readHash);
  }

  function selectTab(tab) {
    state.tab = tab;
    renderDetail();
    const btn = $(`#tab-${tab}`);
    if (btn) btn.focus({ preventScroll: true });
    $('#d-body').scrollTop = 0;
    setHash(`${state.open}${tab !== 'overview' ? '.' + tab : ''}`);
  }
  function setView(v) { state.view = v; const r = $(`#view-${v}`); if (r) r.checked = true; }
  function scrollToBoard() { $('#main').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); }
  function gotoSub(sub) {
    if (state.group !== 'sub') { state.group = 'sub'; $('#group').value = 'sub'; }
    setView('map');
    render();
    const seg = subIndex[sub] && subIndex[sub].seg.id;
    const el = seg && document.getElementById(`seg-${seg}`);
    if (el) el.closest('.segment').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function resetFilters() {
    Object.assign(state, { q: '', own: 'all', region: '', lens: '' });
    $('#q').value = '';
    $('#own-all').checked = true;
    $('#region').value = '';
    $('#lens').value = '';
    render();
  }

  function effectiveTheme() {
    const t = document.documentElement.dataset.theme;
    if (t) return t;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function toggleTheme() {
    const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    store.set('dtm-theme', next);
  }

  /* ---------------------------------------------------------------- boot */
  const savedTheme = store.get('dtm-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') document.documentElement.dataset.theme = savedTheme;
  const savedView = store.get('dtm-view');
  if (savedView === 'table') setView('table');
  populateControls();
  renderHeadline();
  bind();
  render();
  readHash();
  probeRemoteLogos();
  window.DTMApp = { state, render, openCompany, companies, byId };
})();
