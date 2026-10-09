// Loads the data files the same way the browser does and checks them against the schema.
// Fails (exit 1) on errors; prints warnings for gaps worth filling.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function dataScripts() {
  const html = fs.readFileSync(path.join(root, 'src/index.html'), 'utf8');
  return [...html.matchAll(/<script src="(data\/[^"]+)"><\/script>/g)].map((m) => m[1]);
}

export function loadData() {
  const ctx = { window: {} };
  ctx.window.window = ctx.window;
  vm.createContext(ctx.window);
  for (const rel of dataScripts()) {
    const file = path.join(root, 'src', rel);
    if (!fs.existsSync(file)) continue;
    vm.runInContext(fs.readFileSync(file, 'utf8'), ctx.window, { filename: rel });
  }
  return ctx.window.DTM;
}

const isDate = (s) => typeof s === 'string' && /^\d{4}(-\d{2}(-\d{2})?)?$/.test(s);
const isNum = (n) => typeof n === 'number' && Number.isFinite(n);

function checkSrc(src, where, errors) {
  if (!src) { errors.push(`${where}: missing source`); return; }
  const list = Array.isArray(src) ? src : [src];
  for (const s of list) {
    if (typeof s === 'string') { if (!s.trim()) errors.push(`${where}: empty source`); continue; }
    if (!s || (!s.t && !s.u)) errors.push(`${where}: source needs t (text) or u (url)`);
    if (s && s.u && !/^https:\/\//.test(s.u)) errors.push(`${where}: source url must be https: ${s.u}`);
  }
}

export function validate(D) {
  const errors = [], warnings = [];
  const subs = new Set();
  for (const seg of D.segments) for (const s of seg.subsegments) {
    if (subs.has(s.id)) errors.push(`duplicate subsegment id ${s.id}`);
    subs.add(s.id);
  }
  const programs = new Set((D.programs || []).map((p) => p.id));
  const ids = new Set();
  for (const c of D.companies) {
    const w = `[${c.id || c.name || '?'}]`;
    if (!c.id || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(c.id)) errors.push(`${w} id must be kebab-case`);
    if (ids.has(c.id)) errors.push(`${w} duplicate id`);
    ids.add(c.id);
    if (!c.name) errors.push(`${w} missing name`);
    if (!['public', 'private'].includes(c.status)) errors.push(`${w} status must be public or private`);
    if (!D.countryNames[c.country]) errors.push(`${w} unknown country ${c.country}`);
    if (!isNum(c.founded) || c.founded < 1800 || c.founded > 2026) errors.push(`${w} founded year invalid`);
    if (!Array.isArray(c.subsegments) || !c.subsegments.length) errors.push(`${w} needs at least one subsegment`);
    else for (const s of c.subsegments) if (!subs.has(s)) errors.push(`${w} unknown subsegment ${s}`);
    if (!c.oneLiner) errors.push(`${w} missing oneLiner`);
    else if (c.oneLiner.length > 160) warnings.push(`${w} oneLiner over 160 chars`);
    if (!c.description) errors.push(`${w} missing description`);
    if (!c.domain) warnings.push(`${w} no domain (no favicon logo)`);
    if (!c.hq) warnings.push(`${w} no hq`);

    if (c.status === 'public') {
      if (!c.ticker || !c.exchange) errors.push(`${w} public company needs ticker and exchange`);
      const m = c.marketCap;
      if (!m || !isNum(m.usdM)) errors.push(`${w} public company needs marketCap.usdM`);
      else {
        if (!isDate(m.asOf)) errors.push(`${w} marketCap.asOf missing`);
        checkSrc(m.src, `${w} marketCap`, errors);
        if (m.local && (!m.local.cur || !isNum(m.local.valueM))) errors.push(`${w} marketCap.local needs cur and valueM`);
      }
      if (c.valuation) {
        if (!isDate(c.valuation.asOf)) errors.push(`${w} valuation.asOf missing`);
        checkSrc(c.valuation.src, `${w} valuation`, errors);
      } else warnings.push(`${w} no valuation block`);
      if (c.financials) {
        const f = c.financials;
        if (!Array.isArray(f.periods) || !f.periods.length) errors.push(`${w} financials.periods empty`);
        else for (const p of f.periods) if (!p.label) errors.push(`${w} financial period missing label`);
        checkSrc(f.src, `${w} financials`, errors);
        if (f.cur && f.cur !== 'USD' && !(m && m.local)) warnings.push(`${w} non-USD financials without marketCap.local (fx defaults to 1)`);
      } else warnings.push(`${w} no financials block`);
    } else {
      const f = c.funding;
      if (!f) errors.push(`${w} private company needs funding block`);
      else {
        if (f.totalUsdM != null && !isNum(f.totalUsdM)) errors.push(`${w} funding.totalUsdM must be a number or null`);
        if (f.totalUsdM == null && !f.label) warnings.push(`${w} undisclosed funding without label`);
        if (!isDate(f.asOf)) errors.push(`${w} funding.asOf missing`);
        checkSrc(f.src, `${w} funding`, errors);
        for (const r of f.rounds || []) {
          if (!isDate(r.date)) errors.push(`${w} round date invalid: ${r.date}`);
          if (!r.type) errors.push(`${w} round missing type`);
          if (r.amountUsdM != null && !isNum(r.amountUsdM)) errors.push(`${w} round amount not a number`);
          if (r.postUsdM != null && !isNum(r.postUsdM)) errors.push(`${w} round post-money not a number`);
        }
      }
      if (c.revenue) {
        if (!isNum(c.revenue.valueUsdM) || !c.revenue.period) errors.push(`${w} revenue needs valueUsdM and period`);
        if (!['reported', 'estimate'].includes(c.revenue.kind)) errors.push(`${w} revenue.kind must be reported or estimate`);
        checkSrc(c.revenue.src, `${w} revenue`, errors);
      }
      if (c.valuation && c.valuation.postUsdM != null) {
        if (!isDate(c.valuation.date)) errors.push(`${w} valuation.date missing`);
        checkSrc(c.valuation.src, `${w} valuation`, errors);
      }
    }
    for (const p of c.programs || []) {
      if (!p.name) errors.push(`${w} program missing name`);
      if (p.ref && !programs.has(p.ref)) errors.push(`${w} unknown program ref ${p.ref}`);
    }
    if (!(c.programs || []).length) warnings.push(`${w} no programs listed`);
  }
  return { errors, warnings };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const D = loadData();
  const { errors, warnings } = validate(D);
  const verbose = process.argv.includes('--verbose');
  const bySeg = {};
  for (const seg of D.segments) bySeg[seg.id] = new Set();
  const segOf = {};
  for (const seg of D.segments) for (const s of seg.subsegments) segOf[s.id] = seg.id;
  for (const c of D.companies) for (const s of c.subsegments || []) if (segOf[s]) bySeg[segOf[s]].add(c.id);
  const pub = D.companies.filter((c) => c.status === 'public').length;
  console.log(`${D.companies.length} companies (${pub} public, ${D.companies.length - pub} private)`);
  for (const seg of D.segments) console.log(`  ${seg.code.padEnd(6)} ${seg.name.padEnd(28)} ${bySeg[seg.id].size}`);
  if (warnings.length) {
    console.log(`\n${warnings.length} warning(s)${verbose ? ':' : ' (run with --verbose to list)'}`);
    if (verbose) warnings.forEach((x) => console.log('  ' + x));
  }
  if (errors.length) {
    console.error(`\n${errors.length} error(s):`);
    errors.forEach((x) => console.error('  ' + x));
    process.exit(1);
  }
  console.log('\nData valid.');
}
