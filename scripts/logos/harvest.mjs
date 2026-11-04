// Step 1 of the logo pipeline: visit each company's website in headless Chromium and capture its header logo
// (rendered on a transparent background) plus its declared site icon and Google's favicon as fallbacks.
// Usage: node scripts/logos/harvest.mjs [--only id,id]
// Writes .cache/logos/raw/<id>.wm.png, <id>.icon.<ext>, <id>.g.<ext> and .cache/logos/meta/<id>.json.
// Behind an HTTPS proxy, Chromium uses $HTTPS_PROXY. Then run scripts/logos/process.mjs.
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

const RAW = path.join(root, '.cache', 'logos', 'raw'), META = path.join(root, '.cache', 'logos', 'meta');
fs.mkdirSync(RAW, { recursive: true }); fs.mkdirSync(META, { recursive: true });
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const only = arg('--only') ? new Set(arg('--only').split(',')) : null;
const all = loadCompanies().filter((c) => c.domain && (!only || only.has(c.id)));

const browser = await chromium.launch(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {});
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

function pool(n) {
  let active = 0; const q = [];
  const next = () => { if (active >= n || !q.length) return; active++; const [fn, res, rej] = q.shift(); fn().then(res, rej).finally(() => { active--; next(); }); };
  return (fn) => new Promise((res, rej) => { q.push([fn, res, rej]); next(); });
}
const run = pool(6);

const PICK = () => {
  const vis = (el) => {
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    return r.width > 8 && r.height > 8 && cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.05;
  };
  const sels = ['header img', 'header svg', 'nav img', 'nav svg', 'a[href="/"] img', 'a[href="/"] svg', 'a[href="./"] img', 'a[href="./"] svg',
    '[class*="logo" i] img', '[class*="logo" i] svg', '[id*="logo" i] img', '[id*="logo" i] svg', 'img[alt*="logo" i]', 'img[src*="logo" i]',
    'img[class*="logo" i]', 'svg[class*="logo" i]', '[class*="brand" i] img', '[class*="brand" i] svg', 'a[aria-label*="home" i] svg', 'a[aria-label*="home" i] img',
    '[class*="logo" i]', '[class*="brand" i]', 'a[href="/"]', '[class*="header" i] img', '[class*="header" i] svg', '[class*="navbar" i] img', '[class*="navbar" i] svg'];
  const cand = new Set();
  sels.forEach((s) => { try { document.querySelectorAll(s).forEach((e) => cand.add(e)); } catch {} });
  const host = location.host.replace(/^www\./, '');
  const out = [];
  for (let el of cand) {
    if (el.tagName.toLowerCase() === 'svg' || el.closest('svg')) { let p = el; let top = el; while (p) { if (p.tagName && p.tagName.toLowerCase() === 'svg') top = p; p = p.parentElement; } el = top; }
    const tag = el.tagName.toLowerCase();
    // a [class*=logo] container: accept only if it has a CSS background image and no img/svg child
    if (tag !== 'img' && tag !== 'svg') {
      const cs0 = getComputedStyle(el);
      const bg = cs0.backgroundImage, mk = cs0.maskImage || cs0.webkitMaskImage;
      if ((!bg || bg === 'none' || !/url\(/.test(bg)) && (!mk || mk === 'none')) continue;
      if (el.querySelector('img,svg')) continue;
    }
    if (!vis(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.top + window.scrollY > 260) continue;
    if (r.width > 520 || r.height > 170 || r.height < 10 || r.left < -5 || r.left > 1100) continue;
    if (r.width < 22 && r.height < 22) continue;
    const a = el.closest('a');
    const s = ((el.outerHTML || '').slice(0, 500) + ' ' + (a ? a.outerHTML.slice(0, 200) : '') + ' ' + (el.parentElement ? el.parentElement.className : '')).toLowerCase();
    let score = 0;
    if (/logo/.test(s)) score += 5;
    if (/brand/.test(s)) score += 2;
    if (el.closest('header, nav, [class*="header" i], [class*="nav" i]')) score += 3;
    if (a) {
      const h = (a.getAttribute('href') || '').trim();
      const hh = h.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
      if (h === '/' || h === './' || h === '' || h === '#' || /^\/(\?|#|index|home|en\/?$|$)/.test(h) || hh === host || hh === host + '/en') score += 4;
    }
    score -= r.left / 250;
    score -= r.top / 150;
    const ar = r.width / r.height;
    if (ar > 1.6) score += 1.5;
    if (/menu|hamburger|close|search|arrow|chevron|linkedin|twitter|youtube|facebook|instagram|caret|toggle|burger|globe|language|cart|play/.test(s)) score -= 6;
    if (r.width < 28 && r.height < 28) score -= 3;
    out.push({ el, score, r: { x: r.left, y: r.top + window.scrollY, w: r.width, h: r.height }, tag });
  }
  out.sort((a, b) => b.score - a.score);
  const best = out[0] && out[0].score >= 2 ? out[0] : null;
  // background colour behind the logo
  let bgc = null;
  if (best) {
    let p = best.el;
    while (p && p !== document.documentElement) { const c = getComputedStyle(p).backgroundColor; if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') { bgc = c; break; } p = p.parentElement; }
    if (!bgc) bgc = getComputedStyle(document.body).backgroundColor;
    best.el.setAttribute('data-logo-pick', '1');
  }
  const icons = [...document.querySelectorAll('link[rel~="icon" i], link[rel~="apple-touch-icon" i], link[rel="shortcut icon" i], link[rel~="mask-icon" i]')]
    .map((l) => ({ rel: l.rel, href: l.href, sizes: l.getAttribute('sizes') || '', type: l.type || '' }));
  return {
    title: document.title, url: location.href,
    best: best ? { score: best.score, r: best.r, tag: best.tag, src: best.tag === 'img' ? (best.el.currentSrc || best.el.src) : null, alt: best.el.getAttribute('alt') || '', bg: bgc } : null,
    alts: out.slice(1, 4).map((x) => ({ score: +x.score.toFixed(1), tag: x.tag, r: x.r })), icons
  };
};

const ISOLATE = `
  *:not([data-logo-pick]):not([data-logo-pick] *), *:not([data-logo-pick]):not([data-logo-pick] *)::before, *:not([data-logo-pick]):not([data-logo-pick] *)::after { background-color: transparent !important; background-image: none !important; box-shadow: none !important; border-color: transparent !important; text-shadow: none !important; }
  html, body { background: transparent !important; }
  * { visibility: hidden !important; transition: none !important; animation: none !important; }
  [data-logo-pick], [data-logo-pick] * { visibility: visible !important; opacity: 1 !important; }
`;

async function harvest(c) {
  const meta = { id: c.id, domain: c.domain };
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 }, deviceScaleFactor: 3, locale: 'en-US' });
  const page = await ctx.newPage();
  try {
    const resp = await page.goto('https://' + c.domain + '/', { waitUntil: 'domcontentloaded', timeout: 35000 });
    meta.status = resp ? resp.status() : 0;
    await page.waitForLoadState('load', { timeout: 12000 }).catch(() => {});
    await page.waitForTimeout(4000);
    await page.evaluate(() => window.scrollTo(0, 0));
    let info = await page.evaluate(PICK);
    if (!info.best) { await page.waitForTimeout(5000); await page.evaluate(() => window.scrollTo(0, 0)); info = await page.evaluate(PICK); }
    Object.assign(meta, info);
    if (info.best) {
      await page.addStyleTag({ content: ISOLATE });
      await page.waitForTimeout(300);
      const h = await page.$('[data-logo-pick]');
      if (h) {
        await h.screenshot({ path: path.join(RAW, c.id + '.wm.png'), omitBackground: true, timeout: 15000 });
        meta.wm = true;
      }
    }
    // best declared icon: prefer svg, then the largest size
    const icons = (info.icons || []).filter((i) => i.href && !i.href.startsWith('data:') || (i.href || '').startsWith('data:image'));
    const size = (i) => (/svg/.test(i.type + i.href) ? 1000 : Math.max(0, ...String(i.sizes).split(/\s+/).map((s) => parseInt(s, 10) || 0), /apple/.test(i.rel) ? 180 : 0));
    icons.sort((a, b) => size(b) - size(a));
    for (const ic of icons.slice(0, 2)) {
      try {
        const r = await ctx.request.get(ic.href, { timeout: 15000 });
        if (!r.ok()) continue;
        const ct = (r.headers()['content-type'] || '').split(';')[0];
        const ext = /svg/.test(ct + ic.href) ? 'svg' : /png/.test(ct) ? 'png' : /jpe?g/.test(ct) ? 'jpg' : /webp/.test(ct) ? 'webp' : /icon|ico/.test(ct + ic.href) ? 'ico' : 'bin';
        const buf = await r.body();
        if (buf.length < 100) continue;
        fs.writeFileSync(path.join(RAW, `${c.id}.icon.${ext}`), buf);
        meta.icon = { href: ic.href, ext, size: size(ic) };
        break;
      } catch {}
    }
  } catch (e) {
    meta.error = String(e.message).split('\n')[0].slice(0, 160);
  }
  // Google's favicon service as a fallback square icon
  try {
    const g = await ctx.request.get(`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${c.domain}&size=256`, { timeout: 15000 });
    if (g.ok()) { const ct = g.headers()['content-type'] || ''; fs.writeFileSync(path.join(RAW, `${c.id}.g.${/png/.test(ct) ? 'png' : /jpe?g/.test(ct) ? 'jpg' : 'ico'}`), await g.body()); meta.g = true; }
  } catch {}
  await ctx.close();
  fs.writeFileSync(path.join(META, c.id + '.json'), JSON.stringify(meta, null, 1));
  return meta;
}

let done = 0;
await Promise.all(all.map((c) => run(async () => {
  const m = await harvest(c).catch((e) => ({ id: c.id, error: e.message }));
  done++;
  console.log(`${done}/${all.length} ${c.id} ${m.error ? 'ERR ' + m.error : (m.wm ? 'wm' : '--') + ' ' + (m.icon ? 'icon' : '--') + ' ' + (m.best ? m.best.score.toFixed(1) + ' ' + m.best.tag + ' ' + Math.round(m.best.r.w) + 'x' + Math.round(m.best.r.h) : '')}`);
})));
await browser.close();
