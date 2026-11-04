// Step 2 of the logo pipeline: trim each harvested logo, key out flat backgrounds, and make a version for light
// backgrounds (white artwork recolored to ink) and one for dark backgrounds (dark neutrals turned white).
// Hand-picked sources in logos/source/<id>.wm.(svg|png) or <id>.icon.(svg|png) take precedence over harvested ones.
// Usage: node scripts/logos/process.mjs [--only id,id]
// Writes logos/<id>.wm.webp (wordmark for light backgrounds), logos/<id>.icon.webp and logos/logos.json (sizes and flags).
// The page derives dark-background versions of the wordmarks in the browser.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
function loadCompanies() {
  const ctx = {}; ctx.window = ctx; ctx.DTM = { companies: [], add(c) { this.companies.push(c); } };
  vm.createContext(ctx);
  const dir = path.join(root, 'src', 'data');
  for (const f of ['taxonomy.js', ...fs.readdirSync(path.join(dir, 'companies')).sort().map((f) => 'companies/' + f)]) vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), ctx);
  return ctx.DTM.companies.map((c) => ({ id: c.id, name: c.name, domain: c.domain }));
}

const RAW = path.join(root, '.cache', 'logos', 'raw'), NORM = path.join(root, 'logos'), OVR = path.join(root, 'logos', 'source');
fs.mkdirSync(NORM, { recursive: true });
const ids = loadCompanies().map((c) => c.id);
const OVERRIDES = fs.existsSync(path.join(NORM, 'overrides.json')) ? JSON.parse(fs.readFileSync(path.join(NORM, 'overrides.json'), 'utf8')) : {};
const only = process.argv.includes('--only') ? new Set(process.argv[process.argv.indexOf('--only') + 1].split(',')) : null;
const MIME = { png: 'image/png', svg: 'image/svg+xml', jpg: 'image/jpeg', webp: 'image/webp', ico: 'image/x-icon', bin: 'application/octet-stream' };
const find = (dir, id, kind) => {
  for (const e of ['svg', 'png', 'webp', 'jpg', 'ico', 'bin']) {
    const f = path.join(dir, `${id}.${kind}.${e}`);
    if (fs.existsSync(f)) return `data:${MIME[e]};base64,${fs.readFileSync(f).toString('base64')}`;
  }
  return null;
};

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<canvas id="c"></canvas>');

// In-page processing
await page.evaluate(() => {
  const load = (src) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
  const lum = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const sat = (r, g, b) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b); return mx === 0 ? 0 : (mx - mn) / mx; };
  function draw(img, maxW, maxH) {
    let w = img.naturalWidth || 256, h = img.naturalHeight || 256;
    const s = Math.min(maxW / w, maxH / h, 4); w = Math.max(1, Math.round(w * s)); h = Math.max(1, Math.round(h * s));
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0, w, h);
    return { c, x, w, h };
  }
  function keyBackground(x, w, h) {
    const d = x.getImageData(0, 0, w, h); const p = d.data;
    const at = (i, j) => { const k = (j * w + i) * 4; return [p[k], p[k + 1], p[k + 2], p[k + 3]]; };
    const corners = [at(0, 0), at(w - 1, 0), at(0, h - 1), at(w - 1, h - 1)];
    const opaque = corners.every((c) => c[3] > 245);
    if (!opaque) return { keyed: false };
    const bg = corners[0];
    const close = corners.every((c) => Math.abs(c[0] - bg[0]) + Math.abs(c[1] - bg[1]) + Math.abs(c[2] - bg[2]) < 30);
    if (!close) return { keyed: false };
    for (let k = 0; k < p.length; k += 4) {
      const dist = Math.abs(p[k] - bg[0]) + Math.abs(p[k + 1] - bg[1]) + Math.abs(p[k + 2] - bg[2]);
      const a = Math.min(1, dist / 120);
      p[k + 3] = Math.round(p[k + 3] * a);
    }
    x.putImageData(d, 0, 0);
    return { keyed: true, bg: bg.slice(0, 3) };
  }
  function trim(c, x, w, h) {
    const p = x.getImageData(0, 0, w, h).data;
    let x0 = w, y0 = h, x1 = -1, y1 = -1, ink = 0, L = 0, white = 0, colored = 0;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const k = (j * w + i) * 4; const a = p[k + 3];
      if (a > 24) {
        if (i < x0) x0 = i; if (i > x1) x1 = i; if (j < y0) y0 = j; if (j > y1) y1 = j;
        ink++; const l = lum(p[k], p[k + 1], p[k + 2]); L += l;
        const s = sat(p[k], p[k + 1], p[k + 2]);
        if (l > 0.78 && s < 0.18) white++;
        if (s > 0.35 && l > 0.15) colored++;
      }
    }
    if (x1 < 0) return null;
    const pad = 2; x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad); x1 = Math.min(w - 1, x1 + pad); y1 = Math.min(h - 1, y1 + pad);
    const tw = x1 - x0 + 1, th = y1 - y0 + 1;
    const o = document.createElement('canvas'); o.width = tw; o.height = th; o.getContext('2d').drawImage(c, x0, y0, tw, th, 0, 0, tw, th);
    return { c: o, w: tw, h: th, ink, fill: ink / (tw * th), meanL: L / ink, white: white / ink, colored: colored / ink };
  }
  function recolorWhite(c, ink = [17, 24, 32]) {
    const o = document.createElement('canvas'); o.width = c.width; o.height = c.height;
    const x = o.getContext('2d', { willReadFrequently: true }); x.drawImage(c, 0, 0);
    const d = x.getImageData(0, 0, o.width, o.height); const p = d.data;
    for (let k = 0; k < p.length; k += 4) {
      if (p[k + 3] < 8) continue;
      const l = lum(p[k], p[k + 1], p[k + 2]), s = sat(p[k], p[k + 1], p[k + 2]);
      if (s < 0.22) { // neutral: map light->ink, keep darkness ordering inverted
        const t = l; // 1 = white -> ink, 0 = black -> light grey
        p[k] = Math.round(ink[0] * t + 200 * (1 - t)); p[k + 1] = Math.round(ink[1] * t + 200 * (1 - t)); p[k + 2] = Math.round(ink[2] * t + 200 * (1 - t));
      }
    }
    x.putImageData(d, 0, 0); return o;
  }
  function shrink(c, maxW, maxH) {
    const k = Math.min(1, maxW / c.width, maxH / c.height);
    if (k >= 1) return c;
    const o = document.createElement('canvas'); o.width = Math.max(1, Math.round(c.width * k)); o.height = Math.max(1, Math.round(c.height * k));
    const x = o.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(c, 0, 0, o.width, o.height); return o;
  }
  window.processLogo = async (wmSrc, iconSrcs, force) => {
    const out = {};
    if (wmSrc) {
      const img = await load(wmSrc);
      if (img) {
        const { c, x, w, h } = draw(img, 1200, 300);
        const key = keyBackground(x, w, h);
        const t = trim(c, x, w, h);
        if (t && t.ink > 150 && t.w >= 12 && t.h >= 8) {
          const light = force || (t.white > 0.45 && t.meanL > 0.6);
          const ar = t.w / t.h;
          out.wm = { w: t.w, h: t.h, ar: +ar.toFixed(2), fill: +t.fill.toFixed(2), white: +t.white.toFixed(2), colored: +t.colored.toFixed(2), light, keyed: key.keyed };
          const forLight = light ? recolorWhite(t.c) : t.c;
          out.wmPng = shrink(forLight, 320, 64).toDataURL('image/webp', 0.82);
          if (!light) {
            // dark artwork: for dark backgrounds turn neutral darks white
            const o = document.createElement('canvas'); o.width = t.w; o.height = t.h; const xx = o.getContext('2d', { willReadFrequently: true }); xx.drawImage(t.c, 0, 0);
            const d = xx.getImageData(0, 0, t.w, t.h); const p = d.data;
            for (let k = 0; k < p.length; k += 4) { const s = sat(p[k], p[k + 1], p[k + 2]); if (s < 0.22) { const l = lum(p[k], p[k + 1], p[k + 2]); const v = Math.round(255 - l * 60); p[k] = p[k + 1] = p[k + 2] = v; } }
            xx.putImageData(d, 0, 0); out.wmdPng = null;
          } else out.wmdPng = null;
        }
      }
    }
    // icon: largest decodable candidate that actually has visible artwork
    const cands = [];
    for (const s of iconSrcs.filter(Boolean)) {
      const img = await load(s); if (!img) continue;
      const n = Math.min(img.naturalWidth || 0, img.naturalHeight || 0) || (s.startsWith('data:image/svg') ? 512 : 0);
      if (n >= 16) cands.push({ img, n });
    }
    cands.sort((a, b) => b.n - a.n);
    for (const best of cands) {
      const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d', { willReadFrequently: true });
      x.imageSmoothingQuality = 'high'; x.drawImage(best.img, 0, 0, 64, 64);
      const p = x.getImageData(0, 0, 64, 64).data; let transparent = 0, L = 0, n = 0, L2 = 0;
      for (let k = 0; k < p.length; k += 4) { if (p[k + 3] < 20) transparent++; else { const l = lum(p[k], p[k + 1], p[k + 2]); L += l; L2 += l * l; n++; } }
      const meanL = n ? L / n : 0, tr = transparent / (64 * 64), sd = n ? Math.sqrt(Math.max(0, L2 / n - meanL * meanL)) : 0;
      if (tr > 0.97) continue;               // empty artwork
      if (tr < 0.02 && sd < 0.02) continue;  // a flat square with nothing on it
      out.icon = { n: best.n, transparent: +tr.toFixed(2), meanL: +meanL.toFixed(2), light: tr > 0.12 && meanL > 0.82 };
      out.iconPng = c.toDataURL('image/webp', 0.82);
      break;
    }
    return out;
  };
});

const stats = fs.existsSync(path.join(NORM, 'logos.json')) ? JSON.parse(fs.readFileSync(path.join(NORM, 'logos.json'), 'utf8')) : {};
for (const id of ids) {
  if (only && !only.has(id)) continue;
  const wm = find(OVR, id, 'wm') || find(RAW, id, 'wm');
  const icons = [find(OVR, id, 'icon'), find(RAW, id, 'icon'), find(RAW, id, 'g')];
  const r = await page.evaluate(([a, b, f]) => window.processLogo(a, b, f), [wm, icons, !!(OVERRIDES[id] && OVERRIDES[id].recolor)]);
  for (const f of ['wm', 'wmd', 'icon']) { const p = path.join(NORM, `${id}.${f}.webp`); if (fs.existsSync(p)) fs.unlinkSync(p); }
  if (r.wmPng) fs.writeFileSync(path.join(NORM, `${id}.wm.webp`), Buffer.from(r.wmPng.split(',')[1], 'base64'));
  if (r.wmdPng) fs.writeFileSync(path.join(NORM, `${id}.wmd.webp`), Buffer.from(r.wmdPng.split(',')[1], 'base64'));
  if (r.iconPng) fs.writeFileSync(path.join(NORM, `${id}.icon.webp`), Buffer.from(r.iconPng.split(',')[1], 'base64'));
  stats[id] = { wm: r.wm || null, icon: r.icon || null };
}
const sorted = Object.fromEntries(Object.keys(stats).sort().map((k) => [k, stats[k]]));
fs.writeFileSync(path.join(NORM, 'logos.json'), JSON.stringify(sorted, null, 1) + '\n');
const v = Object.values(stats);
console.log('wordmarks', v.filter((s) => s.wm).length, 'wide (ar>=1.8)', v.filter((s) => s.wm && s.wm.ar >= 1.8).length, 'icons', v.filter((s) => s.icon).length, 'of', v.length);
await browser.close();
