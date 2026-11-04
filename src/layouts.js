/* Market-map layouts. One shared model (companies grouped by segment and subsegment, private companies ranked
   by capital raised and public companies by market cap) and four on-screen renderers:
   Logo wall, Funding tiers, Leaderboard and Treemap. export.js draws the same layouts on a canvas. */
(function () {
  'use strict';

  const D = window.DTM;
  const LOGOS = D.logos || {};
  let H = null; // helpers from app.js: esc, money, metricText, metricLong, monogram, hue, inLens, lens

  const LAYOUTS = [
    { id: 'wall', name: 'Logo wall', blurb: 'Logos ranked by capital raised in each subsegment' },
    { id: 'tiers', name: 'Funding tiers', blurb: 'Subsegment columns, rows by amount raised' },
    { id: 'leaderboard', name: 'Leaderboard', blurb: 'Ranked lists with bars on one scale' },
    { id: 'treemap', name: 'Treemap', blurb: 'Area shows capital raised' }
  ];
  const TIERS = [
    { id: 'pub', name: 'Public', note: 'market cap', test: (c) => c.isPublic },
    { id: 't1', name: '$1B+', note: 'raised', test: (c) => !c.isPublic && c.value >= 1000 },
    { id: 't2', name: '$250M–1B', note: 'raised', test: (c) => !c.isPublic && c.value >= 250 && c.value < 1000 },
    { id: 't3', name: '$50–250M', note: 'raised', test: (c) => !c.isPublic && c.value >= 50 && c.value < 250 },
    { id: 't4', name: 'Under $50M', note: 'raised', test: (c) => !c.isPublic && c.value != null && c.value < 50 },
    { id: 't5', name: 'Undisclosed', note: 'no total', test: (c) => !c.isPublic && c.value == null }
  ];
  // Treemap tile colors (one per subsegment block); light text sits on all of them.
  const BLOCKS = ['#1f3a5f', '#2e4f4f', '#4a3b6b', '#5b3a29', '#2f4858', '#3d4f2a', '#5c2a3d', '#264653', '#41403a', '#1d3557'];

  /* ---------------------------------------------------------------- model */
  const byValue = (a, b) => (b.value == null ? -1 : b.value) - (a.value == null ? -1 : a.value) || a.name.localeCompare(b.name);
  const sum = (list) => list.reduce((t, c) => t + (c.value || 0), 0);
  const uniq = (list) => [...new Set(list)];
  const segOf = (subId) => subId.split('.')[0];

  function model(list, segIds) {
    return D.segments.filter((s) => !segIds || segIds.includes(s.id)).map((seg) => {
      const subs = seg.subsegments.map((sub) => {
        const items = list.filter((c) => c.subs.includes(sub.id));
        const priv = items.filter((c) => !c.isPublic).sort(byValue);
        const pub = items.filter((c) => c.isPublic).sort(byValue);
        return { sub, priv, pub, n: items.length, raised: sum(priv), cap: sum(pub) };
      }).filter((g) => g.n).sort((a, b) => b.raised - a.raised || b.cap - a.cap);
      const cos = uniq(subs.flatMap((g) => g.priv.concat(g.pub)));
      return { seg, subs, cos, raised: sum(cos.filter((c) => !c.isPublic)), cap: sum(cos.filter((c) => c.isPublic)) };
    }).filter((s) => s.subs.length);
  }

  // Treemap: each private company counted once per segment, in its first subsegment there.
  const weight = (c) => Math.pow(Math.max(c.value || 8, 8), 0.62);
  function treemapModel(section) {
    const blocks = section.subs.map((g, i) => {
      const items = g.priv.filter((c) => c.subs.find((s) => segOf(s) === section.seg.id) === g.sub.id);
      return { g, items, v: items.reduce((t, c) => t + weight(c), 0), raised: sum(items) };
    }).filter((b) => b.items.length).sort((a, b) => b.v - a.v);
    blocks.forEach((b, i) => { b.color = BLOCKS[i % BLOCKS.length]; });
    const pubs = uniq(section.subs.flatMap((g) => g.pub)).sort(byValue);
    return { blocks, pubs };
  }

  // Squarified treemap (Bruls, Huizing & van Wijk): items [{v, ...}] largest first -> rectangles.
  function squarify(items, x, y, w, h) {
    const total = items.reduce((s, i) => s + i.v, 0);
    if (!total || w <= 0 || h <= 0) return [];
    const k = (w * h) / total;
    const nodes = items.map((i) => Object.assign({}, i, { a: i.v * k }));
    const out = [];
    let r = { x, y, w, h };
    let row = [];
    const worst = (rw, side) => {
      const s = rw.reduce((t, n) => t + n.a, 0);
      let mx = 0, mn = Infinity;
      rw.forEach((n) => { mx = Math.max(mx, n.a); mn = Math.min(mn, n.a); });
      return Math.max((side * side * mx) / (s * s), (s * s) / (side * side * mn));
    };
    const lay = (rw) => {
      const s = rw.reduce((t, n) => t + n.a, 0);
      if (r.w >= r.h) {
        const cw = s / r.h; let yy = r.y;
        rw.forEach((n) => { const hh = n.a / cw; out.push(Object.assign(n, { x: r.x, y: yy, w: cw, h: hh })); yy += hh; });
        r = { x: r.x + cw, y: r.y, w: r.w - cw, h: r.h };
      } else {
        const rh = s / r.w; let xx = r.x;
        rw.forEach((n) => { const ww = n.a / rh; out.push(Object.assign(n, { x: xx, y: r.y, w: ww, h: rh })); xx += ww; });
        r = { x: r.x, y: r.y + rh, w: r.w, h: r.h - rh };
      }
    };
    for (const n of nodes) {
      const side = Math.min(r.w, r.h);
      if (!row.length || worst(row.concat(n), side) <= worst(row, side)) row.push(n);
      else { lay(row); row = [n]; }
    }
    if (row.length) lay(row);
    return out;
  }

  // Optically balanced logo size: wide and square artwork get the same visual area.
  function fit(ar, area, maxW, maxH) {
    let w = Math.sqrt(area * ar), h = Math.sqrt(area / ar);
    if (w > maxW) { w = maxW; h = w / ar; }
    if (h > maxH) { h = maxH; w = h * ar; }
    return { w: Math.round(w), h: Math.round(h) };
  }
  const logoOf = (c) => LOGOS[c.id] || null;
  const logScale = (v, max) => (v ? Math.max(3, (100 * Math.log10(1 + v)) / Math.log10(1 + max)) : 0);

  /* ---------------------------------------------------------------- logo styles */
  // Logos are set once as CSS custom properties per company (class L-<id>), so re-rendering the map never
  // re-inlines image data. Dark-background versions of wordmarks are derived in the browser on demand.
  function ensureStyles() {
    if (document.getElementById('dtm-logo-css')) return;
    const css = Object.keys(LOGOS).map((id) => {
      const L = LOGOS[id];
      return `.L-${id}{${L.wm ? `--wl:url("${L.wm}");` : ''}${L.icon ? `--ic:url("${L.icon}");` : ''}}`;
    }).join('\n');
    const el = document.createElement('style');
    el.id = 'dtm-logo-css';
    el.textContent = css;
    document.head.appendChild(el);
  }
  let darkDone = false;
  function ensureDark() {
    if (darkDone) return;
    darkDone = true;
    const ids = Object.keys(LOGOS).filter((id) => LOGOS[id].wm);
    Promise.all(ids.map((id) => darkVersion(LOGOS[id].wm).then((u) => (u ? `.L-${id}{--wd:url("${u}")}` : '')))).then((out) => {
      const el = document.createElement('style');
      el.id = 'dtm-logo-dark-css';
      el.textContent = out.join('\n');
      document.head.appendChild(el);
    });
  }
  function darkVersion(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        try {
          const c = document.createElement('canvas');
          c.width = img.naturalWidth; c.height = img.naturalHeight;
          const x = c.getContext('2d', { willReadFrequently: true });
          x.drawImage(img, 0, 0);
          const d = x.getImageData(0, 0, c.width, c.height); const p = d.data;
          for (let k = 0; k < p.length; k += 4) {
            if (p[k + 3] < 8) continue;
            const r = p[k], g = p[k + 1], b = p[k + 2];
            const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
            if (mx > 80 && (mx - mn) / mx > 0.22) continue; // keep brand colors; near-black ink counts as neutral
            const l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
            const v = Math.round(240 - l * 70); p[k] = p[k + 1] = p[k + 2] = v; // dark neutrals -> light
          }
          x.putImageData(d, 0, 0);
          resolve(c.toDataURL('image/webp', 0.85));
        } catch (e) { resolve(null); }
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  /* ---------------------------------------------------------------- shared markup */
  const E = (s) => H.esc(s);
  function mono(c, size) {
    const m = H.monogram(c.short || c.name);
    return `<span class="lg lg-m" style="width:${size}px;height:${size}px;font-size:${Math.round(size * (m.length >= 3 ? 0.32 : 0.42))}px;--mh:${190 + (H.hue(c.id) % 110)}">${E(m)}</span>`;
  }
  /* A company's logo for the layouts: a wordmark alone, or a symbol / icon / monogram with the name beside it.
     o: { area, maxW, maxH, icon (square px), name: 'never' } */
  function logoHTML(c, o) {
    const L = logoOf(c);
    if (L && L.kind === 'wordmark') {
      const s = fit(L.ar, o.area, o.maxW, o.maxH);
      return `<span class="lg lg-w L-${c.id}" style="width:${s.w}px;height:${s.h}px"></span>`;
    }
    const sq = o.icon || Math.round(Math.min(o.maxH, Math.sqrt(o.area) * 0.72));
    let mark;
    if (L && L.kind === 'mark') { const s = fit(L.ar, sq * sq, sq * 1.7, sq); mark = `<span class="lg lg-w L-${c.id}" style="width:${s.w}px;height:${s.h}px"></span>`; }
    else if (L && L.icon) mark = `<span class="lg lg-i L-${c.id}${L.il ? ' is-light' : ''}" style="width:${sq}px;height:${sq}px"></span>`;
    else mark = mono(c, sq);
    return `<span class="lg-lock">${mark}${o.name === 'never' ? '' : `<span class="lg-name">${E(c.short || c.name)}</span>`}</span>`;
  }
  // Square chip for list layouts.
  function chipHTML(c, size) {
    const L = logoOf(c);
    if (L && L.icon) return `<span class="lg lg-i L-${c.id}${L.il ? ' is-light' : ''}" style="width:${size}px;height:${size}px"></span>`;
    if (L && L.wm) return `<span class="lg lg-c" style="width:${size}px;height:${size}px"><span class="lg lg-w L-${c.id}"></span></span>`;
    return mono(c, size);
  }
  function attrs(c, cls) {
    const k = ['tile', cls];
    if (H.lens && H.inLens(c)) k.push('in-lens');
    const label = `${c.name}, ${c.isPublic ? 'public' : 'private'}, ${H.metricLong(c)}${c.flag ? ', ' + c.flag : ''}`;
    return `class="${k.join(' ')}" type="button" data-id="${c.id}" data-status="${c.isPublic ? 'public' : 'private'}"${c.flag ? ' data-flag' : ''} aria-label="${E(label)}"`;
  }
  const flagTag = (c) => (c.flag ? `<span class="tile-flag" title="${E(c.flag)}">${E(c.flagShort || '!')}</span>` : '');
  const value = (c) => `<span class="ly-v${c.value == null ? ' is-na' : ''}">${E(H.metricText(c))}</span>`;
  function subTotal(g) {
    const bits = [`${g.n} ${g.n === 1 ? 'co' : 'cos'}`];
    if (g.raised) bits.push(`${H.money(g.raised)} raised`);
    else if (g.cap) bits.push(`${H.money(g.cap)} mkt cap`);
    return bits.join(' · ');
  }
  function sectionHTML(s, body, cls) {
    const nPub = s.cos.filter((c) => c.isPublic).length;
    return `<section class="ly-sec ${cls}" aria-labelledby="seg-${s.seg.id}">
      <header class="ly-sec-head">
        <h2 class="segment-title" id="seg-${s.seg.id}"><span class="segment-code">${E(s.seg.code)}</span>${E(s.seg.name)}</h2>
        <p class="segment-stats"><span>${s.cos.length} cos</span>${s.raised ? `<span class="stat-private" title="Capital raised by private companies shown">${H.money(s.raised)} raised</span>` : ''}${nPub ? `<span class="stat-public" title="Market cap of public companies shown">${H.money(s.cap)} mkt cap</span>` : ''}</p>
      </header>
      <div class="ly-body">${body}</div>
    </section>`;
  }

  /* ---------------------------------------------------------------- 1. logo wall */
  function wall(sections) {
    const cell = (c, i) => `<button ${attrs(c, 'lw-cell')}>${c.isPublic ? '' : `<span class="lw-rk">${String(i + 1).padStart(2, '0')}</span>`}${flagTag(c)}${logoHTML(c, { area: 1300, maxW: 92, maxH: 30 })}${value(c)}</button>`;
    return sections.map((s) => sectionHTML(s, `<div class="lw-cols">${s.subs.map((g) => `
      <div class="lw-panel"><div class="ly-sub-head"><h3 class="group-title">${E(g.sub.name)}</h3><span class="group-count">${subTotal(g)}</span></div>
        <div class="lw-grid">${g.priv.map(cell).join('')}${g.pub.length ? `<div class="ly-pubsep">Public · market cap</div>${g.pub.map(cell).join('')}` : ''}</div>
      </div>`).join('')}</div>`, 'is-wall')).join('');
  }

  /* ---------------------------------------------------------------- 2. funding tiers */
  const TIER_LOGO = {
    pub: { area: 1000, maxW: 100, maxH: 24 }, t1: { area: 2000, maxW: 120, maxH: 36 }, t2: { area: 1400, maxW: 108, maxH: 30 },
    t3: { area: 1000, maxW: 100, maxH: 24 }, t4: { area: 560, maxW: 74, maxH: 18, icon: 16 }, t5: { area: 560, maxW: 74, maxH: 18, icon: 16 }
  };
  function tiers(sections) {
    return sections.map((s) => {
      const rows = TIERS.filter((t) => s.subs.some((g) => g.priv.concat(g.pub).some(t.test)));
      const head = `<div class="lt-corner"></div>${s.subs.map((g) => `<div class="lt-colhead"><h3 class="group-title">${E(g.sub.name)}</h3><span class="group-count">${subTotal(g)}</span></div>`).join('')}`;
      const body = rows.map((t) => {
        const n = uniq(s.subs.flatMap((g) => g.priv.concat(g.pub).filter(t.test))).length;
        return `<div class="lt-label lt-${t.id}"><b>${E(t.name)}</b><span>${E(t.note)} · ${n}</span></div>${s.subs.map((g) => `<div class="lt-cell lt-${t.id}">${(t.id === 'pub' ? g.pub : g.priv).filter(t.test).map((c) => `<button ${attrs(c, 'lt-card')}>${flagTag(c)}${logoHTML(c, TIER_LOGO[t.id])}${value(c)}</button>`).join('')}</div>`).join('')}`;
      }).join('');
      return sectionHTML(s, `<div class="lt-scroll"><div class="lt-grid" style="--n:${s.subs.length}">${head}${body}</div></div>`, 'is-tiers');
    }).join('');
  }

  /* ---------------------------------------------------------------- 3. leaderboard */
  function leaderboard(sections) {
    const all = uniq(sections.flatMap((s) => s.cos));
    const maxP = Math.max(1, ...all.filter((c) => !c.isPublic).map((c) => c.value || 0));
    const maxQ = Math.max(1, ...all.filter((c) => c.isPublic).map((c) => c.value || 0));
    const row = (c, i) => `<button ${attrs(c, 'lb-row')}><span class="lb-rk">${c.isPublic ? '' : String(i + 1).padStart(2, '0')}</span>${chipHTML(c, 30)}<span class="lb-nm">${E(c.short || c.name)}${flagTag(c)}</span><span class="lb-bar"><i style="width:${logScale(c.value, c.isPublic ? maxQ : maxP).toFixed(1)}%"></i></span>${value(c)}</button>`;
    return sections.map((s) => sectionHTML(s, `<div class="lb-cols">${s.subs.map((g) => `
      <div class="lb-card"><div class="ly-sub-head"><h3 class="group-title">${E(g.sub.name)}</h3><span class="group-count">${subTotal(g)}</span></div>
        ${g.priv.map(row).join('')}${g.pub.length ? `<div class="ly-pubsep">Public · market cap</div>${g.pub.map(row).join('')}` : ''}
      </div>`).join('')}</div>`, 'is-leaderboard')).join('');
  }

  /* ---------------------------------------------------------------- 4. treemap */
  function treemapTile(c, w, h) {
    const L = logoOf(c);
    let inner;
    if (L && L.kind === 'wordmark' && w > 64 && h > 30) {
      const s = fit(L.ar, Math.min(w * h * 0.16, 9000), w * 0.76, Math.min(h * 0.36, 52));
      inner = `<span class="lg lg-w L-${c.id}" style="width:${s.w}px;height:${s.h}px"></span>`;
    } else {
      const q = Math.round(Math.max(12, Math.min(56, Math.min(w, h) * (w > 120 && h > 70 ? 0.36 : 0.5))));
      const mark = L && L.kind === 'mark' ? (() => { const s = fit(L.ar, q * q, q * 1.7, q); return `<span class="lg lg-w L-${c.id}" style="width:${s.w}px;height:${s.h}px"></span>`; })()
        : L && L.icon ? `<span class="lg lg-i L-${c.id}${L.il ? ' is-light' : ''}" style="width:${q}px;height:${q}px"></span>` : mono(c, q);
      inner = mark + (w > 74 && h > 74 ? `<span class="tm-nm">${E(c.short || c.name)}</span>` : '');
    }
    return inner + (w > 60 && h > 56 ? value(c) : '');
  }
  function treemap(sections, width) {
    const W = Math.max(260, Math.floor(width));
    return sections.map((s) => {
      const t = treemapModel(s);
      const n = t.blocks.reduce((a, b) => a + b.items.length, 0);
      const Ht = Math.round(Math.max(300, Math.min(780, W * 0.56)) * Math.min(1, 0.45 + n / 24));
      let html = '';
      if (n) {
        squarify(t.blocks, 0, 0, W, Ht).forEach((b) => {
          const G = 2, HB = 24;
          html += `<div class="tm-block" style="left:${(b.x + G).toFixed(1)}px;top:${(b.y + G).toFixed(1)}px;width:${(b.w - 2 * G).toFixed(1)}px;height:${(b.h - 2 * G).toFixed(1)}px;background:${b.color}"><div class="tm-bh"><span>${E(b.g.sub.name)}</span><b>${H.money(b.raised)}</b></div></div>`;
          squarify(b.items.map((c) => ({ c, v: weight(c) })), b.x + G + 3, b.y + G + HB, b.w - 2 * G - 6, b.h - 2 * G - HB - 3).forEach((nd) => {
            const w = nd.w - 3, h = nd.h - 3;
            if (w < 4 || h < 4) return;
            html += `<button ${attrs(nd.c, 'tm-tile')} style="left:${(nd.x + 1.5).toFixed(1)}px;top:${(nd.y + 1.5).toFixed(1)}px;width:${w.toFixed(1)}px;height:${h.toFixed(1)}px">${flagTag(nd.c)}${treemapTile(nd.c, w, h)}</button>`;
          });
        });
      }
      const pubs = t.pubs.length ? `<div class="tm-pubs"><span class="tm-pubs-title">Public · market cap</span>${t.pubs.map((c) => `<button ${attrs(c, 'tm-pub')}>${logoHTML(c, { area: 640, maxW: 92, maxH: 20, icon: 20 })}${value(c)}</button>`).join('')}</div>` : '';
      return sectionHTML(s, `${n ? `<div class="tm" style="height:${Ht}px">${html}</div>` : ''}${pubs}`, 'is-treemap');
    }).join('');
  }

  /* ---------------------------------------------------------------- entry */
  function render(board, list, segIds, layout, helpers) {
    H = helpers;
    ensureStyles();
    const sections = model(list, segIds);
    const id = LAYOUTS.some((l) => l.id === layout) ? layout : 'wall';
    board.dataset.layout = id;
    if (id === 'wall') board.innerHTML = wall(sections);
    else if (id === 'tiers') board.innerHTML = tiers(sections);
    else if (id === 'leaderboard') board.innerHTML = leaderboard(sections);
    else {
      board.innerHTML = '';
      const w = board.clientWidth - 26; // section body padding and border
      board.innerHTML = treemap(sections, w);
    }
  }
  // Peers in a profile reuse the logo-wall cell.
  function peerCells(list, helpers) {
    H = helpers;
    ensureStyles();
    return `<div class="lw-grid is-peers">${list.map((c) => `<button ${attrs(c, 'lw-cell')}>${flagTag(c)}${logoHTML(c, { area: 1200, maxW: 90, maxH: 28 })}${value(c)}</button>`).join('')}</div>`;
  }
  function logoClass(c) { const L = logoOf(c); return L ? `L-${c.id}${L.icon ? ' has-ic' : ' has-wm'}${L.il ? ' il' : ''}` : ''; }

  window.DTMLayouts = { LAYOUTS, TIERS, BLOCKS, model, treemapModel, weight, squarify, fit, logScale, render, peerCells, ensureStyles, ensureDark, logoClass, byValue };
})();
