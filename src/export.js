/* Poster PNG export: draws a shareable market-map image for one segment group on a canvas.
   Drawn from the data, not the screen, so filters, theme and window size never change the result.
   Saves through the claude.ai "downloads" capability when the page is published there, or a plain
   download link when the file is opened directly. */
(function () {
  'use strict';

  const D = window.DTM;
  const app = () => window.DTMApp;
  const $ = (sel) => document.querySelector(sel);

  // The poster always uses the light palette so every export looks the same.
  const C = {
    bg: '#eef1f2', panel: '#ffffff', ink: '#0e1a22', ink2: '#44535d', ink3: '#66747e', rule: '#d8dfe3', ruleStrong: '#b7c2c9',
    public: '#2459d3', publicWash: '#eaf0fc', private: '#d9560f', privateWash: '#fcefe5', privatePill: '#b2460b',
    flag: '#b3261e', logoDark: '#131c23', logoInk: '#f3f6f8'
  };
  const F = {
    display: '"Saira Condensed", "Arial Narrow", "Roboto Condensed", sans-serif',
    body: '"Public Sans", "Segoe UI", system-ui, -apple-system, sans-serif',
    data: '"IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace'
  };

  /* ---------------------------------------------------------------- assets */
  async function fontsReady() {
    if (!document.fonts || !document.fonts.load) return;
    const faces = ['800 64px "Saira Condensed"', '700 30px "Saira Condensed"', '700 13px "Public Sans"', '600 12px "Public Sans"',
      '400 13px "Public Sans"', '600 11px "IBM Plex Mono"', '500 12px "IBM Plex Mono"'];
    const all = Promise.all(faces.map((f) => document.fonts.load(f).catch(() => null)));
    await Promise.race([all, new Promise((r) => setTimeout(r, 2500))]);
  }
  const imgCache = {};
  function loadImg(src) {
    if (!imgCache[src]) {
      imgCache[src] = new Promise((resolve) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = () => resolve(null);
        i.src = src;
      });
    }
    return imgCache[src];
  }

  /* ---------------------------------------------------------------- drawing helpers */
  function rrect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    if (ctx.roundRect) { ctx.roundRect(x, y, w, h, r); return; }
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function setFont(ctx, f, spacing) {
    ctx.font = f;
    if ('letterSpacing' in ctx) ctx.letterSpacing = spacing || '0px';
  }
  function ellipsize(ctx, text, maxW) {
    if (ctx.measureText(text).width <= maxW) return text;
    let t = text;
    while (t.length > 1 && ctx.measureText(t + '…').width > maxW) t = t.slice(0, -1);
    return t.trimEnd() + '…';
  }
  function wrapLines(ctx, text, maxW, maxLines) {
    const words = String(text).split(/\s+/);
    const lines = [];
    let cur = '';
    for (const w of words) {
      const t = cur ? cur + ' ' + w : w;
      if (!cur || ctx.measureText(t).width <= maxW) cur = t;
      else { lines.push(cur); cur = w; }
    }
    if (cur) lines.push(cur);
    if (lines.length > maxLines) {
      const keep = lines.slice(0, maxLines);
      keep[maxLines - 1] = lines.slice(maxLines - 1).join(' ');
      return keep.map((l) => ellipsize(ctx, l, maxW));
    }
    return lines.map((l) => ellipsize(ctx, l, maxW));
  }

  /* ---------------------------------------------------------------- model */
  const byValue = (a, b) => (b.value == null ? -1 : b.value) - (a.value == null ? -1 : a.value) || a.name.localeCompare(b.name);

  function buildModel(groupId, own) {
    const A = app();
    const g = A.focusIndex[groupId] || A.focusIndex.unmanned;
    const segIds = g.segments || D.segments.map((s) => s.id);
    const pick = (c) => own === 'all' || c.status === own;
    const sections = segIds.map((id) => {
      const seg = D.segments.find((s) => s.id === id);
      const blocks = seg.subsegments
        .map((sub) => ({ sub, items: A.companies.filter((c) => c.subs.includes(sub.id) && pick(c)).sort(byValue) }))
        .filter((b) => b.items.length);
      const cos = new Set(blocks.flatMap((b) => b.items));
      return { seg, blocks, cos: [...cos] };
    }).filter((s) => s.blocks.length);
    const cos = [...new Set(sections.flatMap((s) => s.cos))];
    const sum = (list, pub) => list.filter((c) => c.isPublic === pub && c.value).reduce((a, c) => a + c.value, 0);
    return {
      g, own, sections, cos,
      nPub: cos.filter((c) => c.isPublic).length, nPriv: cos.filter((c) => !c.isPublic).length,
      cap: sum(cos, true), raised: sum(cos, false),
      tiles: sections.reduce((a, s) => a + s.blocks.reduce((b, x) => b + x.items.length, 0), 0)
    };
  }

  /* ---------------------------------------------------------------- layout */
  function layout(model, width) {
    const L = { W: width, P: 56, GAP: 16, headH: 196, secHeadH: 58, secGap: 30, footH: 96 };
    L.K = width >= 2400 ? 4 : 3;
    L.colW = (width - 2 * L.P - (L.K - 1) * L.GAP) / L.K;
    L.pad = 14; L.blockHead = 40; L.tg = 8; L.TH = 120;
    L.r = Math.max(3, Math.floor((L.colW - 2 * L.pad + L.tg) / (100 + L.tg)));
    L.TW = (L.colW - 2 * L.pad - (L.r - 1) * L.tg) / L.r;
    let y = L.P + L.headH;
    // A single-segment poster already names the segment in its title, so it skips the section header.
    const secHead = model.sections.length > 1 ? L.secHeadH : 0;
    L.showSecHead = secHead > 0;
    model.sections.forEach((s) => {
      s.y = y;
      const cols = new Array(L.K).fill(0);
      s.blocks.forEach((b) => {
        const rows = Math.ceil(b.items.length / L.r);
        b.h = L.blockHead + rows * L.TH + (rows - 1) * L.tg + L.pad;
        let col = 0;
        for (let i = 1; i < L.K; i++) if (cols[i] < cols[col] - 0.5) col = i;
        b.x = L.P + col * (L.colW + L.GAP);
        b.y = y + secHead + cols[col];
        cols[col] += b.h + L.GAP;
      });
      s.h = secHead + Math.max(...cols) - L.GAP;
      y += s.h + L.secGap;
    });
    L.footY = y - L.secGap + 28;
    L.H = Math.ceil(L.footY + L.footH + L.P / 2);
    return L;
  }

  /* ---------------------------------------------------------------- render */
  async function renderPoster({ group = 'unmanned', own = 'all', width = 1600, scale = 2 } = {}) {
    const A = app();
    await fontsReady();
    const model = buildModel(group, own);
    const L = layout(model, width);
    const logoIds = model.cos.filter((c) => D.logos && D.logos[c.id]).map((c) => c.id);
    const imgs = {};
    await Promise.all(logoIds.map(async (id) => { imgs[id] = await loadImg(D.logos[id].src); }));

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(L.W * scale);
    canvas.height = Math.round(L.H * scale);
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    ctx.textBaseline = 'alphabetic';

    // Page
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, L.W, L.H);
    drawHeader(ctx, model, L, A);
    model.sections.forEach((s) => drawSection(ctx, s, L, A, imgs));
    drawFooter(ctx, model, L, A);
    return { canvas, model, layout: L };
  }

  function drawHeader(ctx, m, L, A) {
    const x = L.P;
    let y = L.P;
    setFont(ctx, `500 13px ${F.data}`, '1.5px');
    ctx.fillStyle = C.ink3;
    ctx.fillText(`${D.meta.edition.toUpperCase()} EDITION · COMPILED ${A.date(D.meta.asOf, true).toUpperCase()}`, x, y + 12);
    setFont(ctx, `800 64px ${F.display}`, '0.5px');
    ctx.fillStyle = C.ink;
    const title = m.g.name.toUpperCase();
    ctx.fillText(title, x, y + 78);
    setFont(ctx, `400 19px ${F.body}`);
    ctx.fillStyle = C.ink2;
    const segNames = m.sections.map((s) => s.seg.name).join(' + ');
    const scope = m.own === 'public' ? ' · public companies only' : m.own === 'private' ? ' · private companies only' : '';
    ctx.fillText(ellipsize(ctx, `Defense Tech Market Map · ${segNames}${scope}`, L.W * 0.55), x, y + 112);

    // Legend
    let lx = x;
    const ly = y + 148;
    [[C.public, 'Public · market cap'], [C.private, 'Private · total raised']].forEach(([col, label]) => {
      ctx.fillStyle = col;
      rrect(ctx, lx, ly - 11, 12, 12, 3);
      ctx.fill();
      setFont(ctx, `600 13px ${F.body}`);
      ctx.fillStyle = C.ink2;
      ctx.fillText(label, lx + 18, ly);
      lx += 18 + ctx.measureText(label).width + 26;
    });

    // Stats, right-aligned
    const stats = [
      ['COMPANIES', String(m.cos.length), C.ink],
      [`PUBLIC MARKET CAP · ${m.nPub}`, m.nPub ? A.money(m.cap) : '—', C.public],
      [`PRIVATE RAISED · ${m.nPriv}`, m.nPriv ? A.money(m.raised) : '—', C.private]
    ];
    let sx = L.W - L.P;
    stats.slice().reverse().forEach(([label, value, col]) => {
      setFont(ctx, `700 40px ${F.display}`);
      const vw = ctx.measureText(value).width;
      setFont(ctx, `500 11px ${F.data}`, '1px');
      const lw = ctx.measureText(label).width;
      const w = Math.max(vw, lw);
      ctx.fillStyle = C.ink3;
      ctx.textAlign = 'right';
      ctx.fillText(label, sx, y + 42);
      setFont(ctx, `700 40px ${F.display}`);
      ctx.fillStyle = col;
      ctx.fillText(value, sx, y + 86);
      ctx.textAlign = 'left';
      sx -= w + 40;
    });

    ctx.fillStyle = C.ink;
    ctx.fillRect(x, y + L.headH - 22, L.W - 2 * L.P, 2);
  }

  function drawSection(ctx, s, L, A, imgs) {
    if (!L.showSecHead) { s.blocks.forEach((b) => drawBlock(ctx, b, L, A, imgs)); return; }
    const x = L.P;
    const y = s.y;
    // Section header: code chip, name and totals
    setFont(ctx, `600 12px ${F.data}`, '1px');
    const code = s.seg.code;
    const cw = ctx.measureText(code).width + 14;
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 1.5;
    rrect(ctx, x, y + 8, cw, 22, 5);
    ctx.stroke();
    ctx.fillStyle = C.ink;
    ctx.fillText(code, x + 7, y + 23);
    setFont(ctx, `700 30px ${F.display}`, '0.5px');
    ctx.fillText(s.seg.name.toUpperCase(), x + cw + 12, y + 30);
    const pub = s.cos.filter((c) => c.isPublic && c.value).reduce((a, c) => a + c.value, 0);
    const priv = s.cos.filter((c) => !c.isPublic && c.value).reduce((a, c) => a + c.value, 0);
    setFont(ctx, `500 12px ${F.data}`);
    ctx.textAlign = 'right';
    let rx = L.W - L.P;
    [[priv ? `${A.money(priv)} raised` : '', C.private], [pub ? `${A.money(pub)} market cap` : '', C.public], [`${s.cos.length} companies`, C.ink3]].forEach(([t, col]) => {
      if (!t) return;
      ctx.fillStyle = col;
      ctx.fillText(t, rx, y + 26);
      rx -= ctx.measureText(t).width + 18;
    });
    ctx.textAlign = 'left';

    s.blocks.forEach((b) => drawBlock(ctx, b, L, A, imgs));
  }

  function drawBlock(ctx, b, L, A, imgs) {
    ctx.fillStyle = C.panel;
    rrect(ctx, b.x, b.y, L.colW, b.h, 12);
    ctx.fill();
    ctx.strokeStyle = C.rule;
    ctx.lineWidth = 1;
    ctx.stroke();
    setFont(ctx, `500 12px ${F.data}`);
    const count = String(b.items.length);
    const cwid = ctx.measureText(count).width;
    ctx.fillStyle = C.ink3;
    ctx.fillText(count, b.x + L.colW - L.pad - cwid, b.y + 25);
    setFont(ctx, `700 12px ${F.body}`, '0.8px');
    ctx.fillStyle = C.ink2;
    ctx.fillText(ellipsize(ctx, b.sub.name.toUpperCase(), L.colW - 2 * L.pad - cwid - 10), b.x + L.pad, b.y + 25);
    b.items.forEach((c, i) => {
      const col = i % L.r, row = Math.floor(i / L.r);
      drawTile(ctx, c, b.x + L.pad + col * (L.TW + L.tg), b.y + L.blockHead + row * (L.TH + L.tg), L.TW, L.TH, A, imgs);
    });
  }

  function drawTile(ctx, c, x, y, w, h, A, imgs) {
    ctx.fillStyle = c.isPublic ? C.publicWash : C.privateWash;
    rrect(ctx, x, y, w, h, 10);
    ctx.fill();
    if (c.flag) {
      ctx.save();
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = C.flag;
      ctx.lineWidth = 1;
      rrect(ctx, x + 0.5, y + 0.5, w - 1, h - 1, 10);
      ctx.stroke();
      ctx.restore();
    }
    // Logo square
    const ls = 46, lx = x + (w - ls) / 2, ly = y + 11;
    const logo = D.logos && D.logos[c.id];
    const img = imgs[c.id];
    if (logo && img) {
      ctx.fillStyle = logo.dark ? C.logoDark : '#ffffff';
      rrect(ctx, lx, ly, ls, ls, 11);
      ctx.fill();
      const inset = 9, box = ls - 2 * inset;
      const r = Math.min(box / (img.naturalWidth || box), box / (img.naturalHeight || box));
      const iw = (img.naturalWidth || box) * r, ih = (img.naturalHeight || box) * r;
      ctx.drawImage(img, lx + (ls - iw) / 2, ly + (ls - ih) / 2, iw, ih);
    } else {
      const hh = 190 + (A.hue(c.id) % 110);
      const grad = ctx.createLinearGradient(lx, ly, lx + ls, ly + ls);
      grad.addColorStop(0, `hsl(${hh} 32% 27%)`);
      grad.addColorStop(1, `hsl(${hh + 14} 38% 13%)`);
      ctx.fillStyle = grad;
      rrect(ctx, lx, ly, ls, ls, 11);
      ctx.fill();
      const mono = A.monogram(c.short || c.name);
      setFont(ctx, `700 ${mono.length >= 3 ? 15 : 20}px ${F.display}`, '0.5px');
      ctx.fillStyle = C.logoInk;
      ctx.textAlign = 'center';
      ctx.fillText(mono, lx + ls / 2, ly + ls / 2 + (mono.length >= 3 ? 5 : 7));
      ctx.textAlign = 'left';
    }
    // Flag tag
    if (c.flag) {
      const t = c.flagShort || '!';
      setFont(ctx, `700 9px ${F.data}`, '0.5px');
      const tw = ctx.measureText(t).width + 8;
      ctx.fillStyle = C.flag;
      rrect(ctx, x + w - tw - 4, y + 4, tw, 14, 3);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillText(t, x + w - tw, y + 14);
    }
    // Name, up to two lines
    setFont(ctx, `600 12px ${F.body}`);
    ctx.fillStyle = C.ink;
    ctx.textAlign = 'center';
    const lines = wrapLines(ctx, c.short || c.name, w - 10, 2);
    lines.forEach((ln, i) => ctx.fillText(ln, x + w / 2, y + 74 + i * 14));
    // Metric pill
    const undisclosed = c.value == null;
    const text = A.metricText(c);
    // Long labels ("Privately held") shrink to fit before falling back to an ellipsis.
    let size = 11;
    setFont(ctx, `600 ${size}px ${F.data}`);
    while (size > 8 && ctx.measureText(text).width + 14 > w - 10) setFont(ctx, `600 ${--size}px ${F.data}`);
    const pw = Math.min(w - 10, ctx.measureText(text).width + 14);
    const px = x + (w - pw) / 2, py = y + h - 25;
    if (undisclosed) {
      ctx.save();
      ctx.setLineDash([3, 2]);
      ctx.strokeStyle = C.ruleStrong;
      rrect(ctx, px, py, pw, 18, 9);
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = C.ink3;
    } else {
      ctx.fillStyle = c.isPublic ? C.public : C.privatePill;
      rrect(ctx, px, py, pw, 18, 9);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
    }
    ctx.fillText(ellipsize(ctx, text, pw - 8), x + w / 2, py + 13);
    ctx.textAlign = 'left';
  }

  function drawFooter(ctx, m, L, A) {
    const y = L.footY;
    ctx.fillStyle = C.rule;
    ctx.fillRect(L.P, y, L.W - 2 * L.P, 1);
    setFont(ctx, `400 13px ${F.body}`);
    ctx.fillStyle = C.ink2;
    const notes = [
      'Public companies show market capitalization; private companies show total funding raised to date. Companies that span several subsegments appear in each.',
      'Each figure carries its own as-of date and source in the interactive map; figures copied from undated sheets are marked there. Logos are trademarks of their owners.'
    ];
    notes.forEach((n, i) => ctx.fillText(ellipsize(ctx, n, L.W - 2 * L.P - 280), L.P, y + 30 + i * 20));
    setFont(ctx, `600 12px ${F.data}`, '1px');
    ctx.fillStyle = C.ink3;
    ctx.textAlign = 'right';
    ctx.fillText(`${m.cos.length} COMPANIES · ${m.tiles} TILES`, L.W - L.P, y + 30);
    ctx.fillText(`DEFENSE TECH MARKET MAP · ${D.meta.edition.toUpperCase()}`, L.W - L.P, y + 50);
    ctx.textAlign = 'left';
  }

  function toBlob(canvas) {
    return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG encoding failed'))), 'image/png'));
  }

  /* ---------------------------------------------------------------- saving */
  // Inside the claude.ai viewer, frame code can't download directly: the downloads capability asks the viewer instead.
  let downloads = null;
  const inViewer = !!(window.claude && typeof window.claude.use === 'function');
  if (inViewer) {
    try { window.claude.use('downloads').then((x) => { downloads = x; }, () => {}); } catch (e) { /* not served */ }
  }
  async function save(blob, filename) {
    if (downloads) return downloads.save({ filename, data: blob });
    if (inViewer) { const err = new Error('unavailable'); err.code = 'unavailable'; throw err; }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    return { status: 'saved' };
  }

  /* ---------------------------------------------------------------- dialog */
  const ui = { blob: null, url: null, filename: '', token: 0 };
  const opts = () => ({
    group: $('#export-group').value,
    own: (document.querySelector('input[name="export-own"]:checked') || {}).value || 'all',
    width: Number((document.querySelector('input[name="export-size"]:checked') || {}).value || 1600)
  });
  function note(text, warn) {
    const n = $('#export-note');
    n.textContent = text;
    n.classList.toggle('is-warn', !!warn);
  }
  async function refresh() {
    const token = ++ui.token;
    const o = opts();
    const preview = $('#export-preview');
    $('#export-download').disabled = true;
    preview.innerHTML = '<p class="export-status">Rendering…</p>';
    try {
      const { canvas, model } = await renderPoster(o);
      const blob = await toBlob(canvas);
      if (token !== ui.token) return;
      if (ui.url) URL.revokeObjectURL(ui.url);
      ui.blob = blob;
      ui.url = URL.createObjectURL(blob);
      const month = new Date().toISOString().slice(0, 7);
      ui.filename = `defense-tech-map-${model.g.id}${o.own !== 'all' ? '-' + o.own : ''}-${month}.png`;
      preview.innerHTML = `<img src="${ui.url}" alt="${model.g.name} market map: ${model.cos.length} companies">`;
      $('#export-download').disabled = false;
      note(`${canvas.width} × ${canvas.height} px · ${model.cos.length} companies · ${(blob.size / 1048576).toFixed(1)} MB. Rendered at 2× for sharp text.`);
    } catch (e) {
      if (token !== ui.token) return;
      preview.innerHTML = '<p class="export-status">The image could not be rendered in this browser.</p>';
      note(String(e && e.message || e), true);
    }
  }
  async function download() {
    if (!ui.blob) return;
    const btn = $('#export-download');
    btn.disabled = true;
    try {
      await save(ui.blob, ui.filename);
      note(`Saved ${ui.filename}.`);
    } catch (e) {
      const code = e && e.code;
      if (code === 'declined') note('Download cancelled.');
      else if (code === 'rate_limited') note('A save prompt is already open. Try again in a moment.', true);
      else note('Saving isn\'t available in this view. Right-click (or long-press) the preview and choose “Save image”.', true);
    } finally {
      btn.disabled = false;
    }
  }
  function openDialog() {
    const A = app();
    const sel = $('#export-group');
    if (!sel.options.length) {
      Object.values(A.focusIndex).filter((g) => g.segments).forEach((g) => {
        const o = document.createElement('option');
        o.value = g.id;
        o.textContent = g.featured ? g.name : `${g.name} (segment)`;
        sel.appendChild(o);
      });
    }
    sel.value = A.state.focus !== 'all' ? A.state.focus : 'unmanned';
    const dlg = $('#export-dialog');
    if (!dlg.open) dlg.showModal();
    refresh();
  }

  function bind() {
    const btn = $('#export-btn');
    if (!btn || !$('#export-dialog')) return;
    btn.addEventListener('click', openDialog);
    $('#export-group').addEventListener('change', refresh);
    document.querySelectorAll('input[name="export-own"], input[name="export-size"]').forEach((r) => r.addEventListener('change', refresh));
    $('#export-download').addEventListener('click', download);
    $('#export-dialog').addEventListener('close', () => { ui.token++; });
  }
  bind();

  window.DTMExport = { renderPoster, toBlob, buildModel, open: openDialog };
})();
