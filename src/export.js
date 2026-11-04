/* Poster PNG export: draws a shareable market-map image for one segment group in any of the four layouts
   (logo wall, funding tiers, leaderboard, treemap) on a canvas. Drawn from the data, not the screen, so filters,
   theme and window size never change the result. Saves through the claude.ai "downloads" capability when the page
   is published there, or a plain download link when the file is opened directly. */
(function () {
  'use strict';

  const D = window.DTM;
  const LOGOS = D.logos || {};
  const app = () => window.DTMApp;
  const LY = () => window.DTMLayouts;
  const $ = (sel) => document.querySelector(sel);

  // Posters use fixed palettes so every export looks the same: light for three layouts, dark for the leaderboard.
  const LIGHT = {
    bg: '#f4f5f7', panel: '#ffffff', panel2: '#f6f7f9', ink: '#0e1116', ink2: '#4a5260', ink3: '#8a919c', rule: '#e4e7eb', ruleStrong: '#c4cad2',
    public: '#2459d3', publicWash: '#eef3fd', private: '#d9560f', privateWash: '#fdf0e7', flag: '#b3261e', bar: '#e9ecf0', heroRule: '#0e1116'
  };
  const DARK = {
    bg: '#0a0e13', panel: '#121820', panel2: '#0f151d', ink: '#eef1f5', ink2: '#a9b2be', ink3: '#6b7684', rule: '#212a35', ruleStrong: '#334050',
    public: '#5b8cff', publicWash: '#111c33', private: '#ff7a2f', privateWash: '#2a1a10', flag: '#e5534b', bar: '#1c2530', heroRule: '#2a3441'
  };
  const F = {
    display: '"Saira Condensed", "Arial Narrow", "Roboto Condensed", sans-serif',
    body: '"Public Sans", "Segoe UI", system-ui, -apple-system, sans-serif',
    data: '"IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace'
  };
  const LAYOUT_TITLES = { wall: '', tiers: ' by funding tier', leaderboard: ' leaderboard', treemap: ': where the capital sits' };
  const LAYOUT_NOTES = {
    wall: 'Private companies ranked by total capital raised, then public companies by market cap.',
    tiers: 'Subsegment columns ordered by capital raised; rows group companies by amount raised, public companies on top.',
    leaderboard: 'Every subsegment ranked by capital raised. Bars share one log scale; public companies follow by market cap.',
    treemap: 'Area shows capital raised (compressed so smaller companies stay visible), by each company’s primary subsegment.'
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
  async function loadLogos(cos) {
    const imgs = {};
    await Promise.all(cos.map(async (c) => {
      const L = LOGOS[c.id];
      if (!L) return;
      imgs[c.id] = { wm: L.wm ? await loadImg(L.wm) : null, icon: L.icon ? await loadImg(L.icon) : null };
    }));
    return imgs;
  }

  /* ---------------------------------------------------------------- drawing helpers */
  function rrect(ctx, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    if (ctx.roundRect) { ctx.roundRect(x, y, w, h, r); return; }
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function box(ctx, x, y, w, h, r, fill, stroke) {
    rrect(ctx, x, y, w, h, r);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
  }
  function setFont(ctx, f, spacing) {
    ctx.font = f;
    if ('letterSpacing' in ctx) ctx.letterSpacing = spacing || '0px';
  }
  function ellipsize(ctx, text, maxW) {
    text = String(text);
    if (ctx.measureText(text).width <= maxW) return text;
    let t = text;
    while (t.length > 1 && ctx.measureText(t + '…').width > maxW) t = t.slice(0, -1);
    return t.trimEnd() + '…';
  }
  function wrapLines(ctx, s, maxW, maxLines) {
    const words = String(s).split(/\s+/);
    const lines = [];
    let cur = '';
    for (const w of words) {
      const t = cur ? cur + ' ' + w : w;
      if (!cur || ctx.measureText(t).width <= maxW) cur = t;
      else { lines.push(cur); cur = w; }
    }
    if (cur) lines.push(cur);
    if (lines.length > maxLines) { const keep = lines.slice(0, maxLines); keep[maxLines - 1] = lines.slice(maxLines - 1).join(' '); return keep.map((l) => ellipsize(ctx, l, maxW)); }
    return lines.map((l) => ellipsize(ctx, l, maxW));
  }
  function text(ctx, s, x, y, font, color, align, spacing, maxW) {
    setFont(ctx, font, spacing);
    ctx.fillStyle = color;
    ctx.textAlign = align || 'left';
    ctx.fillText(maxW ? ellipsize(ctx, s, maxW) : s, x, y);
    ctx.textAlign = 'left';
  }
  const money = (v) => app().money(v);
  const valueText = (c) => app().metricText(c);
  const valueColor = (c, P) => (c.value == null ? P.ink3 : c.isPublic ? P.public : P.private);

  // Square logo: icon on a white (or dark, for light artwork) chip, a symbol wordmark, or a monogram.
  function drawSquare(ctx, c, x, y, s, imgs) {
    const L = LOGOS[c.id], im = imgs[c.id] || {};
    if (L && L.icon && im.icon) {
      ctx.save();
      rrect(ctx, x, y, s, s, s * 0.22);
      ctx.fillStyle = L.il ? '#1c232c' : '#ffffff';
      ctx.fill();
      ctx.clip();
      const k = 0.84;
      ctx.drawImage(im.icon, x + (s * (1 - k)) / 2, y + (s * (1 - k)) / 2, s * k, s * k);
      ctx.restore();
      ctx.strokeStyle = 'rgba(14,17,22,0.12)';
      rrect(ctx, x + 0.5, y + 0.5, s - 1, s - 1, s * 0.22);
      ctx.stroke();
      return;
    }
    if (L && L.wm && im.wm) {
      box(ctx, x, y, s, s, s * 0.22, '#ffffff');
      const f = LY().fit(L.ar, s * s * 0.4, s * 0.8, s * 0.62);
      ctx.drawImage(im.wm, x + (s - f.w) / 2, y + (s - f.h) / 2, f.w, f.h);
      return;
    }
    const h = 190 + (app().hue(c.id) % 110);
    const g = ctx.createLinearGradient(x, y, x + s, y + s);
    g.addColorStop(0, `hsl(${h} 32% 30%)`);
    g.addColorStop(1, `hsl(${h + 14} 38% 15%)`);
    box(ctx, x, y, s, s, s * 0.22, g);
    const m = app().monogram(c.short || c.name);
    text(ctx, m, x + s / 2, y + s / 2 + s * (m.length >= 3 ? 0.12 : 0.15), `700 ${Math.round(s * (m.length >= 3 ? 0.32 : 0.42))}px ${F.display}`, '#f3f6f8', 'center');
  }
  /* Logo centered on (cx, cy): a wordmark alone, or a symbol / icon / monogram with the company name beside it.
     o: { area, maxW, maxH, icon, nameSize, nameColor, maxTotal } */
  function drawLogo(ctx, c, cx, cy, o, imgs) {
    const L = LOGOS[c.id], im = imgs[c.id] || {};
    if (L && L.kind === 'wordmark' && im.wm) {
      const f = LY().fit(L.ar, o.area, o.maxW, o.maxH);
      ctx.drawImage(im.wm, cx - f.w / 2, cy - f.h / 2, f.w, f.h);
      return;
    }
    const sq = o.icon || Math.round(Math.min(o.maxH, Math.sqrt(o.area) * 0.72));
    let mw = sq, drawMark;
    if (L && L.kind === 'mark' && im.wm) {
      const f = LY().fit(L.ar, sq * sq, sq * 1.7, sq);
      mw = f.w;
      drawMark = (x) => ctx.drawImage(im.wm, x, cy - f.h / 2, f.w, f.h);
    } else drawMark = (x) => drawSquare(ctx, c, x, cy - sq / 2, sq, imgs);
    setFont(ctx, `700 ${o.nameSize || 12}px ${F.body}`);
    const gap = 7;
    const name = ellipsize(ctx, c.short || c.name, Math.max(20, (o.maxTotal || 140) - mw - gap));
    const nw = ctx.measureText(name).width;
    const x0 = cx - (mw + gap + nw) / 2;
    drawMark(x0);
    ctx.fillStyle = o.nameColor;
    ctx.fillText(name, x0 + mw + gap, cy + (o.nameSize || 12) * 0.36);
  }
  function drawFlag(ctx, c, x, y, P) {
    if (!c.flag) return;
    const t = c.flagShort || '!';
    setFont(ctx, `700 9px ${F.data}`, '0.5px');
    const tw = ctx.measureText(t).width + 8;
    box(ctx, x - tw, y, tw, 14, 3, P.flag);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(t, x - tw + 4, y + 10);
  }
  function subTotal(g) {
    return `${g.n} ${g.n === 1 ? 'CO' : 'COS'}${g.raised ? ' · ' + money(g.raised) + ' RAISED' : g.cap ? ' · ' + money(g.cap) + ' MKT CAP' : ''}`;
  }

  /* ---------------------------------------------------------------- model */
  function buildModel(groupId, own) {
    const A = app();
    const g = A.focusIndex[groupId] || A.focusIndex.unmanned;
    const list = A.companies.filter((c) => own === 'all' || c.status === own);
    const sections = LY().model(list, g.segments || null);
    const cos = [...new Set(sections.flatMap((s) => s.cos))];
    const sum = (arr) => arr.reduce((a, c) => a + (c.value || 0), 0);
    return {
      g, own, sections, cos,
      nPub: cos.filter((c) => c.isPublic).length, nPriv: cos.filter((c) => !c.isPublic).length,
      cap: sum(cos.filter((c) => c.isPublic)), raised: sum(cos.filter((c) => !c.isPublic)),
      tiles: sections.reduce((a, s) => a + s.subs.reduce((b, x) => b + x.n, 0), 0)
    };
  }

  /* ---------------------------------------------------------------- header, section headers, footer */
  const HEAD_H = 200, FOOT_H = 92;
  function drawHeader(ctx, m, L, P, layout) {
    const A = app();
    const x = L.P, y = L.P;
    text(ctx, `DEFENSE TECH MARKET MAP · ${D.meta.edition.toUpperCase()} · COMPILED ${A.date(D.meta.asOf, true).toUpperCase()}`, x, y + 12, `600 13px ${F.data}`, layout === 'leaderboard' ? P.private : P.ink3, 'left', '1.5px');
    const suffix = LAYOUT_TITLES[layout];
    text(ctx, (m.g.name + suffix).toUpperCase(), x, y + 80, `800 66px ${F.display}`, P.ink, 'left', '0.5px', L.W * 0.62);
    const scope = m.own === 'public' ? ' Public companies only.' : m.own === 'private' ? ' Private companies only.' : '';
    text(ctx, LAYOUT_NOTES[layout] + scope, x, y + 114, `400 18px ${F.body}`, P.ink2, 'left', '0px', L.W * 0.6);
    // Legend
    let lx = x;
    const ly = y + 150;
    [[P.private, 'Private · total raised'], [P.public, 'Public · market cap']].forEach(([col, label]) => {
      box(ctx, lx, ly - 11, 12, 12, 3, col);
      text(ctx, label, lx + 18, ly, `600 13px ${F.body}`, P.ink2);
      setFont(ctx, `600 13px ${F.body}`);
      lx += 18 + ctx.measureText(label).width + 26;
    });
    // Stats, right-aligned
    const stats = [
      ['COMPANIES', String(m.cos.length), P.ink],
      [`PRIVATE RAISED · ${m.nPriv}`, m.nPriv ? money(m.raised) : '—', P.private],
      [`PUBLIC MARKET CAP · ${m.nPub}`, m.nPub ? money(m.cap) : '—', P.public]
    ];
    let sx = L.W - L.P;
    stats.slice().reverse().forEach(([label, value, col]) => {
      setFont(ctx, `700 40px ${F.display}`);
      const vw = ctx.measureText(value).width;
      setFont(ctx, `500 11px ${F.data}`, '1px');
      const w = Math.max(vw, ctx.measureText(label).width);
      text(ctx, label, sx, y + 42, `500 11px ${F.data}`, P.ink3, 'right', '1px');
      text(ctx, value, sx, y + 86, `700 40px ${F.display}`, col, 'right');
      sx -= w + 40;
    });
    ctx.fillStyle = P.heroRule;
    ctx.fillRect(x, y + HEAD_H - 24, L.W - 2 * L.P, 2);
  }
  const SEC_H = 56;
  function drawSectionHead(ctx, s, x, y, W, P) {
    setFont(ctx, `600 12px ${F.data}`, '1px');
    const cw = ctx.measureText(s.seg.code).width + 14;
    ctx.strokeStyle = P.ink2;
    ctx.lineWidth = 1.5;
    rrect(ctx, x, y + 8, cw, 22, 5);
    ctx.stroke();
    text(ctx, s.seg.code, x + 7, y + 23, `600 12px ${F.data}`, P.ink2, 'left', '1px');
    text(ctx, s.seg.name.toUpperCase(), x + cw + 12, y + 30, `700 30px ${F.display}`, P.ink, 'left', '0.5px');
    let rx = x + W;
    [[s.raised ? `${money(s.raised)} raised` : '', P.private], [s.cap ? `${money(s.cap)} market cap` : '', P.public], [`${s.cos.length} companies`, P.ink3]].forEach(([t, col]) => {
      if (!t) return;
      text(ctx, t, rx, y + 26, `500 12px ${F.data}`, col, 'right');
      setFont(ctx, `500 12px ${F.data}`);
      rx -= ctx.measureText(t).width + 18;
    });
  }
  function drawFooter(ctx, m, L, P) {
    const y = L.footY;
    ctx.fillStyle = P.rule;
    ctx.fillRect(L.P, y, L.W - 2 * L.P, 1);
    const notes = [
      'Private companies show total funding raised to date; public companies show market capitalization. Companies that span several subsegments appear in each.',
      'Each figure carries its own as-of date and source in the interactive map; figures copied from undated sheets are marked there. Logos are trademarks of their owners.'
    ];
    notes.forEach((n, i) => text(ctx, n, L.P, y + 30 + i * 20, `400 13px ${F.body}`, P.ink2, 'left', '0px', L.W - 2 * L.P - 300));
    text(ctx, `${m.cos.length} COMPANIES`, L.W - L.P, y + 30, `600 12px ${F.data}`, P.ink3, 'right', '1px');
    text(ctx, `DEFENSE TECH MARKET MAP · ${D.meta.edition.toUpperCase()}`, L.W - L.P, y + 50, `600 12px ${F.data}`, P.ink3, 'right', '1px');
  }
  // Masonry: place blocks of known height into K columns, shortest column first.
  function masonry(blocks, K, x0, colW, gap, y0) {
    const cols = new Array(K).fill(0);
    blocks.forEach((b) => {
      let col = 0;
      for (let i = 1; i < K; i++) if (cols[i] < cols[col] - 0.5) col = i;
      b.x = x0 + col * (colW + gap);
      b.y = y0 + cols[col];
      cols[col] += b.h + gap;
    });
    return Math.max(0, ...cols) - gap;
  }

  /* ---------------------------------------------------------------- 1. logo wall */
  const wall = {
    palette: LIGHT,
    measure(m, L) {
      L.K = L.W >= 2400 ? 4 : 3;
      L.colW = (L.W - 2 * L.P - (L.K - 1) * L.GAP) / L.K;
      L.r = Math.max(3, Math.floor(L.colW / 150));
      L.cw = L.colW / L.r;
      L.ch = 88;
      L.headH = 44;
      L.sepH = 28;
      let y = L.P + HEAD_H;
      m.sections.forEach((s) => {
        s.y = y;
        const top = y + (L.secHead ? SEC_H : 0);
        s.subs.forEach((g) => {
          g.rowsP = Math.ceil(g.priv.length / L.r);
          g.rowsQ = Math.ceil(g.pub.length / L.r);
          g.h = L.headH + g.rowsP * L.ch + (g.pub.length ? L.sepH + g.rowsQ * L.ch : 0);
        });
        s.h = (L.secHead ? SEC_H : 0) + masonry(s.subs, L.K, L.P, L.colW, L.GAP, top);
        y += s.h + L.SECGAP;
      });
      return y - L.SECGAP;
    },
    draw(ctx, m, L, P, imgs) {
      m.sections.forEach((s) => {
        if (L.secHead) drawSectionHead(ctx, s, L.P, s.y, L.W - 2 * L.P, P);
        s.subs.forEach((g) => {
          box(ctx, g.x, g.y, L.colW, g.h, 8, P.panel, P.rule);
          text(ctx, g.sub.name.toUpperCase(), g.x + 14, g.y + 27, `700 12.5px ${F.body}`, P.ink, 'left', '0.8px', L.colW * 0.6);
          text(ctx, subTotal(g), g.x + L.colW - 14, g.y + 27, `500 11px ${F.data}`, P.ink3, 'right');
          ctx.fillStyle = P.rule;
          ctx.fillRect(g.x, g.y + L.headH, L.colW, 1);
          const cells = (list, y0, pub) => {
            list.forEach((c, i) => {
              const col = i % L.r, row = Math.floor(i / L.r);
              const x = g.x + col * L.cw, y = y0 + row * L.ch;
              if (!pub && i < 3) { ctx.fillStyle = P.privateWash; ctx.globalAlpha = 0.55; ctx.fillRect(x + 1, y + 1, L.cw - 1, L.ch - 1); ctx.globalAlpha = 1; }
              if (!pub) text(ctx, String(i + 1).padStart(2, '0'), x + 8, y + 15, `600 10px ${F.data}`, P.ink3);
              drawLogo(ctx, c, x + L.cw / 2, y + 36, { area: 1700, maxW: L.cw - 26, maxH: 34, nameSize: 12.5, nameColor: P.ink, maxTotal: L.cw - 16 }, imgs);
              text(ctx, valueText(c), x + L.cw / 2, y + 72, `600 11.5px ${F.data}`, valueColor(c, P), 'center', '0px', L.cw - 12);
              drawFlag(ctx, c, x + L.cw - 5, y + 5, P);
            });
            // hairlines
            ctx.fillStyle = P.rule;
            const rows = Math.ceil(list.length / L.r);
            for (let r = 1; r < rows; r++) ctx.fillRect(g.x, y0 + r * L.ch, L.colW, 1);
            for (let k = 1; k < L.r; k++) ctx.fillRect(g.x + k * L.cw, y0, 1, rows * L.ch);
          };
          const yP = g.y + L.headH;
          cells(g.priv, yP, false);
          if (g.pub.length) {
            const ys = yP + g.rowsP * L.ch;
            ctx.fillStyle = P.publicWash;
            ctx.fillRect(g.x + 1, ys, L.colW - 2, L.sepH);
            ctx.fillStyle = P.rule;
            ctx.fillRect(g.x, ys, L.colW, 1);
            ctx.fillRect(g.x, ys + L.sepH, L.colW, 1);
            text(ctx, 'PUBLIC · MARKET CAP', g.x + 14, ys + 18, `600 10.5px ${F.data}`, P.public, 'left', '1.2px');
            cells(g.pub, ys + L.sepH, true);
          }
        });
      });
    }
  };

  /* ---------------------------------------------------------------- 2. funding tiers */
  const CARD = { pub: 56, t1: 78, t2: 64, t3: 56, t4: 38, t5: 38 };
  const TIER_LOGO = {
    pub: { area: 1100, maxH: 24 }, t1: { area: 2300, maxH: 38 }, t2: { area: 1600, maxH: 30 },
    t3: { area: 1100, maxH: 24 }, t4: { area: 600, maxH: 18, icon: 18 }, t5: { area: 600, maxH: 18, icon: 18 }
  };
  const tiers = {
    palette: LIGHT,
    measure(m, L) {
      L.labelW = 128;
      L.minCol = L.W >= 2400 ? 170 : 150;
      L.headRow = 72;
      const avail = L.W - 2 * L.P - L.labelW;
      let y = L.P + HEAD_H;
      m.sections.forEach((s) => {
        s.y = y;
        y += L.secHead ? SEC_H : 0;
        const per = Math.max(1, Math.floor(avail / L.minCol));
        s.chunks = [];
        for (let i = 0; i < s.subs.length; i += per) s.chunks.push({ subs: s.subs.slice(i, i + per) });
        s.chunks.forEach((ch) => {
          ch.y = y;
          ch.colW = avail / ch.subs.length;
          ch.rows = LY().TIERS.map((t) => {
            const stacks = ch.subs.map((g) => (t.id === 'pub' ? g.pub : g.priv).filter(t.test));
            const n = Math.max(0, ...stacks.map((st) => st.length));
            return { t, stacks, h: n ? 16 + n * CARD[t.id] + (n - 1) * 7 : 0 };
          }).filter((r) => r.h);
          ch.rows.forEach((r) => { r.h = Math.max(r.h, 64); });
          ch.h = L.headRow + ch.rows.reduce((a, r) => a + r.h, 0);
          y += ch.h + 18;
        });
        y += L.SECGAP - 18;
      });
      return y - L.SECGAP;
    },
    draw(ctx, m, L, P, imgs) {
      const tint = { pub: P.publicWash, t1: '#fbe3d3', t2: '#fdeee3', t3: '#fef6f0', t4: P.panel, t5: P.panel };
      m.sections.forEach((s) => {
        if (L.secHead) drawSectionHead(ctx, s, L.P, s.y, L.W - 2 * L.P, P);
        s.chunks.forEach((ch) => {
          const x0 = L.P, W = L.W - 2 * L.P;
          ctx.save();
          rrect(ctx, x0, ch.y, W, ch.h, 8);
          ctx.fillStyle = P.panel;
          ctx.fill();
          ctx.clip();
          let y = ch.y + L.headRow;
          ch.rows.forEach((r) => { ctx.fillStyle = tint[r.t.id]; ctx.fillRect(x0, y, W, r.h); r.y = y; y += r.h; });
          ctx.restore();
          box(ctx, x0, ch.y, W, ch.h, 8, null, P.rule);
          // grid lines and column heads
          ctx.fillStyle = P.rule;
          ch.subs.forEach((g, i) => {
            const cx = x0 + L.labelW + i * ch.colW;
            ctx.fillRect(cx, ch.y, 1, ch.h);
            setFont(ctx, `700 11.5px ${F.body}`, '0.6px');
            const lines = wrapLines(ctx, g.sub.name.toUpperCase(), ch.colW - 18, 2);
            lines.forEach((ln, k) => text(ctx, ln, cx + 10, ch.y + 22 + k * 15, `700 11.5px ${F.body}`, P.ink, 'left', '0.6px'));
            text(ctx, subTotal(g), cx + 10, ch.y + 58, `500 10.5px ${F.data}`, P.ink3, 'left', '0px', ch.colW - 18);
          });
          ctx.fillStyle = P.rule;
          ctx.fillRect(x0, ch.y + L.headRow, W, 1);
          ch.rows.forEach((r) => {
            ctx.fillStyle = P.rule;
            ctx.fillRect(x0, r.y + r.h, W, 1);
            const n = new Set(r.stacks.flat()).size;
            text(ctx, r.t.name, x0 + 12, r.y + 32, `700 26px ${F.display}`, r.t.id === 'pub' ? P.public : r.t.id === 't1' ? P.private : P.ink);
            text(ctx, `${r.t.note.toUpperCase()} · ${n}`, x0 + 12, r.y + 50, `600 10.5px ${F.data}`, P.ink3, 'left', '0.5px');
            r.stacks.forEach((st, i) => {
              const cx = x0 + L.labelW + i * ch.colW + 8, cw = ch.colW - 16;
              st.forEach((c, k) => {
                const ch2 = CARD[r.t.id], cy = r.y + 8 + k * (ch2 + 7);
                box(ctx, cx, cy, cw, ch2, 6, P.panel, P.rule);
                const small = r.t.id === 't4' || r.t.id === 't5';
                if (small) {
                  setFont(ctx, `600 11px ${F.data}`);
                  const vt = valueText(c), vw = ctx.measureText(vt).width;
                  const lw = cw - vw - 22;
                  const o = Object.assign({ maxW: lw, nameSize: 11.5, nameColor: P.ink, maxTotal: lw }, TIER_LOGO[r.t.id]);
                  // left-align: draw centered inside the left part
                  drawLogo(ctx, c, cx + 8 + lw / 2, cy + ch2 / 2, o, imgs);
                  text(ctx, vt, cx + cw - 8, cy + ch2 / 2 + 4, `600 11px ${F.data}`, valueColor(c, P), 'right');
                } else {
                  const o = Object.assign({ maxW: cw - 20, nameSize: 12.5, nameColor: P.ink, maxTotal: cw - 14 }, TIER_LOGO[r.t.id]);
                  drawLogo(ctx, c, cx + cw / 2, cy + ch2 / 2 - 8, o, imgs);
                  text(ctx, valueText(c), cx + cw / 2, cy + ch2 - 10, `600 11px ${F.data}`, valueColor(c, P), 'center');
                }
                drawFlag(ctx, c, cx + cw - 4, cy + 4, P);
              });
            });
          });
        });
      });
    }
  };

  /* ---------------------------------------------------------------- 3. leaderboard */
  const leaderboard = {
    palette: DARK,
    measure(m, L) {
      L.K = L.W >= 2400 ? 4 : 3;
      L.colW = (L.W - 2 * L.P - (L.K - 1) * L.GAP) / L.K;
      L.headH = 52; L.rowH = 44; L.sepH = 28;
      const all = m.cos;
      L.maxP = Math.max(1, ...all.filter((c) => !c.isPublic).map((c) => c.value || 0));
      L.maxQ = Math.max(1, ...all.filter((c) => c.isPublic).map((c) => c.value || 0));
      let y = L.P + HEAD_H;
      m.sections.forEach((s) => {
        s.y = y;
        s.subs.forEach((g) => { g.h = L.headH + (g.priv.length + g.pub.length) * L.rowH + (g.pub.length ? L.sepH : 0); });
        s.h = (L.secHead ? SEC_H : 0) + masonry(s.subs, L.K, L.P, L.colW, L.GAP, y + (L.secHead ? SEC_H : 0));
        y += s.h + L.SECGAP;
      });
      return y - L.SECGAP;
    },
    background(ctx, L) {
      // soft glow behind the header
      const glow = ctx.createRadialGradient(L.W * 0.85, 0, 10, L.W * 0.85, 0, L.W * 0.7);
      glow.addColorStop(0, 'rgba(40,58,82,0.55)');
      glow.addColorStop(1, 'rgba(10,14,19,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, L.W, L.W * 0.7);
    },
    draw(ctx, m, L, P, imgs) {
      m.sections.forEach((s) => {
        if (L.secHead) drawSectionHead(ctx, s, L.P, s.y, L.W - 2 * L.P, P);
        s.subs.forEach((g) => {
          box(ctx, g.x, g.y, L.colW, g.h, 10, P.panel, P.rule);
          text(ctx, g.sub.name.toUpperCase(), g.x + 16, g.y + 33, `700 21px ${F.display}`, P.ink, 'left', '0.5px', L.colW * 0.62);
          text(ctx, g.raised ? `${money(g.raised)} raised` : g.cap ? `${money(g.cap)} mkt cap` : '', g.x + L.colW - 16, g.y + 31, `500 11px ${F.data}`, P.ink3, 'right');
          let y = g.y + L.headH;
          const row = (c, i, pub) => {
            ctx.fillStyle = P.rule;
            ctx.fillRect(g.x, y, L.colW, 1);
            const cy = y + L.rowH / 2;
            if (!pub) text(ctx, String(i + 1).padStart(2, '0'), g.x + 16, cy + 4, `600 11.5px ${F.data}`, i === 0 ? P.private : P.ink3);
            drawSquare(ctx, c, g.x + 44, cy - 15, 30, imgs);
            const barW = Math.round(L.colW * 0.22), valW = 92;
            const nameX = g.x + 86, barX = g.x + L.colW - 16 - valW - barW;
            text(ctx, c.short || c.name, nameX, cy + 5, `600 14px ${F.body}`, P.ink, 'left', '0px', barX - nameX - 12);
            box(ctx, barX, cy - 4, barW, 8, 4, P.bar);
            const pct = LY().logScale(c.value, pub ? L.maxQ : L.maxP) / 100;
            if (pct) {
              const grad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
              grad.addColorStop(0, pub ? '#1b2f66' : '#7a2e05');
              grad.addColorStop(1, pub ? P.public : P.private);
              box(ctx, barX, cy - 4, Math.max(8, barW * pct), 8, 4, grad);
            }
            text(ctx, valueText(c), g.x + L.colW - 16, cy + 4, c.value == null ? `500 10.5px ${F.data}` : `600 12px ${F.data}`, c.value == null ? P.ink3 : P.ink, 'right', '0px', valW);
            drawFlag(ctx, c, g.x + 76, y + 4, P);
            y += L.rowH;
          };
          g.priv.forEach((c, i) => row(c, i, false));
          if (g.pub.length) {
            ctx.fillStyle = P.publicWash;
            ctx.fillRect(g.x + 1, y, L.colW - 2, L.sepH);
            text(ctx, 'PUBLIC · MARKET CAP', g.x + 16, y + 18, `600 10.5px ${F.data}`, P.public, 'left', '1.2px');
            y += L.sepH;
            g.pub.forEach((c, i) => row(c, i, true));
          }
        });
      });
    }
  };

  /* ---------------------------------------------------------------- 4. treemap */
  const treemap = {
    palette: LIGHT,
    measure(m, L) {
      const W = L.W - 2 * L.P;
      let y = L.P + HEAD_H;
      m.sections.forEach((s) => {
        s.y = y;
        y += L.secHead ? SEC_H : 0;
        s.tm = LY().treemapModel(s);
        const n = s.tm.blocks.reduce((a, b) => a + b.items.length, 0);
        s.tmY = y;
        s.tmH = n ? Math.round(Math.max(360, Math.min(1100, W * 0.56)) * Math.min(1, 0.45 + n / 24)) : 0;
        y += s.tmH;
        // public chips wrap into rows
        s.chipRows = [];
        if (s.tm.pubs.length) {
          y += s.tmH ? 20 : 0;
          s.pubY = y;
          let row = [], rw = 190;
          s.tm.pubs.forEach((c) => {
            const w = 180;
            if (rw + w > W && row.length) { s.chipRows.push(row); row = []; rw = 190; }
            row.push(c); rw += w + 10;
          });
          if (row.length) s.chipRows.push(row);
          y += 16 + s.chipRows.length * 52;
        }
        y += L.SECGAP;
      });
      return y - L.SECGAP;
    },
    draw(ctx, m, L, P, imgs) {
      const W = L.W - 2 * L.P;
      m.sections.forEach((s) => {
        if (L.secHead) drawSectionHead(ctx, s, L.P, s.y, W, P);
        if (s.tmH) {
          LY().squarify(s.tm.blocks, L.P, s.tmY, W, s.tmH).forEach((b) => {
            const G = 3, HB = 30;
            box(ctx, b.x + G, b.y + G, b.w - 2 * G, b.h - 2 * G, 6, b.color);
            ctx.save();
            ctx.beginPath();
            ctx.rect(b.x + G, b.y + G, b.w - 2 * G, HB);
            ctx.clip();
            setFont(ctx, `600 11px ${F.data}`);
            const rt = money(b.raised), rw = ctx.measureText(rt).width;
            text(ctx, b.g.sub.name.toUpperCase(), b.x + G + 10, b.y + G + 19, `700 11.5px ${F.body}`, '#ffffff', 'left', '0.8px', b.w - 2 * G - rw - 30);
            text(ctx, rt, b.x + b.w - G - 10, b.y + G + 19, `600 11px ${F.data}`, 'rgba(255,255,255,0.82)', 'right');
            ctx.restore();
            LY().squarify(b.items.map((c) => ({ c, v: LY().weight(c) })), b.x + G + 4, b.y + G + HB, b.w - 2 * G - 8, b.h - 2 * G - HB - 4).forEach((nd) => {
              const x = nd.x + 2, y = nd.y + 2, w = nd.w - 4, h = nd.h - 4;
              if (w < 4 || h < 4) return;
              box(ctx, x, y, w, h, 4, '#ffffff');
              ctx.save();
              rrect(ctx, x, y, w, h, 4);
              ctx.clip();
              const c = nd.c, Lg = LOGOS[c.id];
              const showVal = w > 62 && h > 58;
              const cy = y + h / 2 - (showVal ? 9 : 0);
              if (Lg && Lg.kind === 'wordmark' && w > 64 && h > 30) {
                drawLogo(ctx, c, x + w / 2, cy, { area: Math.min(w * h * 0.16, 16000), maxW: w * 0.76, maxH: Math.min(h * 0.36, 70) }, imgs);
              } else {
                const q = Math.round(Math.max(12, Math.min(72, Math.min(w, h) * (w > 120 && h > 70 ? 0.36 : 0.5))));
                const withName = w > 80 && h > 84;
                drawSquare(ctx, c, x + w / 2 - q / 2, cy - q / 2 - (withName ? 9 : 0), q, imgs);
                if (withName) text(ctx, c.short || c.name, x + w / 2, cy + q / 2 + 10, `700 13px ${F.body}`, P.ink, 'center', '0px', w - 12);
              }
              if (showVal) text(ctx, valueText(c), x + w / 2, y + h - 12, `600 12px ${F.data}`, valueColor(c, P), 'center', '0px', w - 8);
              ctx.restore();
              drawFlag(ctx, c, x + w - 4, y + 4, P);
            });
          });
        }
        if (s.chipRows.length) {
          ctx.fillStyle = P.heroRule;
          ctx.fillRect(L.P, s.pubY - 8, W, 2);
          text(ctx, 'PUBLIC · MARKET CAP', L.P, s.pubY + 36, `700 12px ${F.body}`, P.public, 'left', '1px');
          s.chipRows.forEach((row, ri) => {
            let x = L.P + 190;
            const y = s.pubY + 12 + ri * 52;
            row.forEach((c) => {
              box(ctx, x, y, 180, 42, 6, P.panel, P.rule);
              setFont(ctx, `600 11.5px ${F.data}`);
              const vt = valueText(c), vw = ctx.measureText(vt).width;
              const lw = 180 - vw - 28;
              drawLogo(ctx, c, x + 10 + lw / 2, y + 21, { area: 800, maxW: lw, maxH: 22, icon: 22, nameSize: 12, nameColor: P.ink, maxTotal: lw }, imgs);
              text(ctx, vt, x + 170, y + 25, `600 11.5px ${F.data}`, P.public, 'right');
              x += 190;
            });
          });
        }
      });
    }
  };

  const RENDERERS = { wall, tiers, leaderboard, treemap };

  /* ---------------------------------------------------------------- render */
  async function renderPoster({ group = 'unmanned', own = 'all', width = 1600, scale = 2, layout = 'wall' } = {}) {
    await fontsReady();
    const R = RENDERERS[layout] || wall;
    const model = buildModel(group, own);
    const L = { W: width, P: 56, GAP: 16, SECGAP: 34 };
    // A single-segment poster already names the segment in its title, so it skips section headers.
    L.secHead = model.sections.length > 1;
    const bodyEnd = R.measure(model, L);
    L.footY = bodyEnd + 30;
    L.H = Math.ceil(L.footY + FOOT_H);
    const imgs = await loadLogos(model.cos);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(L.W * scale);
    canvas.height = Math.round(L.H * scale);
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    ctx.imageSmoothingQuality = 'high';
    const P = R.palette;
    ctx.fillStyle = P.bg;
    ctx.fillRect(0, 0, L.W, L.H);
    if (R.background) R.background(ctx, L);
    drawHeader(ctx, model, L, P, layout);
    R.draw(ctx, model, L, P, imgs);
    drawFooter(ctx, model, L, P);
    return { canvas, model, layout: L };
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
    layout: $('#export-layout').value,
    own: (document.querySelector('input[name="export-own"]:checked') || {}).value || 'all',
    width: Number((document.querySelector('input[name="export-size"]:checked') || {}).value || 1600)
  });
  function note(t, warn) {
    const n = $('#export-note');
    n.textContent = t;
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
      ui.filename = `defense-tech-map-${model.g.id}-${o.layout}${o.own !== 'all' ? '-' + o.own : ''}-${month}.png`;
      preview.innerHTML = `<img src="${ui.url}" alt="${model.g.name} market map, ${o.layout} layout: ${model.cos.length} companies">`;
      $('#export-download').disabled = false;
      note(`${canvas.width} × ${canvas.height} px · ${model.cos.length} companies · ${(blob.size / 1048576).toFixed(1)} MB. Rendered at 2× for sharp text.`);
    } catch (e) {
      if (token !== ui.token) return;
      preview.innerHTML = '<p class="export-status">The image could not be rendered in this browser.</p>';
      note(String((e && e.message) || e), true);
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
      else note('Saving isn’t available in this view. Right-click (or long-press) the preview and choose “Save image”.', true);
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
    $('#export-layout').value = A.state.layout || 'wall';
    const dlg = $('#export-dialog');
    if (!dlg.open) dlg.showModal();
    refresh();
  }

  function bind() {
    const btn = $('#export-btn');
    if (!btn || !$('#export-dialog')) return;
    btn.addEventListener('click', openDialog);
    $('#export-group').addEventListener('change', refresh);
    $('#export-layout').addEventListener('change', refresh);
    document.querySelectorAll('input[name="export-own"], input[name="export-size"]').forEach((r) => r.addEventListener('change', refresh));
    $('#export-download').addEventListener('click', download);
    $('#export-dialog').addEventListener('close', () => { ui.token++; });
  }
  bind();

  window.DTMExport = { renderPoster, toBlob, buildModel, open: openDialog, LAYOUTS: Object.keys(RENDERERS) };
})();
