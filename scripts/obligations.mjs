// Pulls federal obligations for every company on the map, FY2020–FY2026 (Oct 1, 2019 – Sep 30, 2026):
//   USAspending  prime contracts (A–D), IDVs and grants; subawards received
//   FPDS         Other Transaction agreements, OT IDVs and OT orders (not in USAspending's contract data)
// and writes src/data/obligations.js plus a review file listing every recipient name matched to each company.
//
//   NODE_USE_ENV_PROXY=1 node scripts/obligations.mjs [--only id,id] [--no-cache] [--review path]
//
// API responses are cached under .cache/obligations/, so reruns only refetch what changed.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadData } from './validate.mjs';
import ALIASES from './recipient-aliases.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const ONLY = opt('--only') ? new Set(opt('--only').split(',')) : null;
const NO_CACHE = args.includes('--no-cache');
const REVIEW = opt('--review') || path.join(root, '.cache', 'obligations-review.txt');
const CACHE = path.join(root, '.cache', 'obligations');
fs.mkdirSync(CACHE, { recursive: true });

const WINDOW = { start: '2019-10-01', end: '2026-09-30' };
const USA = 'https://api.usaspending.gov/api/v2/search/spending_by_category/recipient/';
const FPDS = 'https://www.fpds.gov/ezsearch/FEEDS/ATOM?FEEDNAME=PUBLIC&q=';
const GROUPS = {
  contracts: ['A', 'B', 'C', 'D'],
  idvs: ['IDV_A', 'IDV_B', 'IDV_B_A', 'IDV_B_B', 'IDV_B_C', 'IDV_C', 'IDV_D', 'IDV_E'],
  grants: ['02', '03', '04', '05']
};
// FPDS matches AWARD_TYPE loosely (it also returns ordinary contracts), so one query fetches every OT record
// and parseFpds keeps only OtherTransactionAward / OtherTransactionIDV entries, de-duplicated by transaction key.
const OT_QUERY = 'AWARD_TYPE:"OTHER TRANSACTION"';
const MAX_FPDS_PAGES = 400;

/* ---------------------------------------------------------------- http with cache, retry and a small pool */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function pool(limit) {
  let active = 0;
  const q = [];
  const next = () => { if (active >= limit || !q.length) return; active++; const [fn, res, rej] = q.shift(); fn().then(res, rej).finally(() => { active--; next(); }); };
  return (fn) => new Promise((res, rej) => { q.push([fn, res, rej]); next(); });
}
const usaPool = pool(6);
const fpdsPool = pool(6);
const companyPool = pool(8);
async function cached(key, fetcher) {
  const file = path.join(CACHE, crypto.createHash('sha1').update(key).digest('hex') + '.json');
  if (!NO_CACHE && fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  const v = await fetcher();
  fs.writeFileSync(file, JSON.stringify(v));
  return v;
}
async function withRetry(fn, label) {
  for (let i = 0; ; i++) {
    try { return await fn(); } catch (e) {
      if (i >= 4) throw new Error(`${label}: ${e.message}`);
      await sleep(1500 * 2 ** i);
    }
  }
}
function usaQuery(term, group) {
  const body = {
    filters: { recipient_search_text: [term], time_period: [{ start_date: WINDOW.start, end_date: WINDOW.end }] },
    limit: 100, page: 1
  };
  if (group === 'subawards') body.spending_level = 'subawards';
  else { body.spending_level = 'transactions'; body.filters.award_type_codes = GROUPS[group]; }
  const key = 'usa|' + JSON.stringify(body);
  return cached(key, () => usaPool(() => withRetry(async () => {
    const out = [];
    for (let page = 1; page <= 5; page++) {
      body.page = page;
      const r = await fetch(USA, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error(`USAspending ${r.status}`);
      const j = await r.json();
      out.push(...(j.results || []).map((x) => ({ name: x.name, uei: x.uei, amount: x.amount })));
      if (!j.page_metadata || !j.page_metadata.hasNext) break;
    }
    return out;
  }, `USAspending ${group} "${term}"`)));
}
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
function parseFpds(xml) {
  const entries = xml.split('<entry>').slice(1).map((e) => {
    const g = (re) => { const m = e.match(re); return m ? decode(m[1]) : ''; };
    const kind = (e.match(/<ns1:(OtherTransactionAward|OtherTransactionIDV|award|IDV) /) || [])[1] || '';
    const key = [g(/<ns1:agencyID[^>]*>([^<]*)</), g(/<ns1:PIID>([^<]*)</), g(/<ns1:modNumber>([^<]*)</),
      g(/<ns1:referencedIDVID>[\s\S]*?<ns1:PIID>([^<]*)</), g(/<ns1:transactionNumber>([^<]*)</)].join('|');
    return {
      kind, key,
      amount: parseFloat(g(/<ns1:obligatedAmount>([-\d.]+)</)) || 0,
      vendor: g(/<ns1:vendorName>([^<]*)</), legal: g(/<ns1:UEILegalBusinessName>([^<]*)</), uei: g(/<ns1:UEI>([^<]*)</),
      signed: g(/<ns1:signedDate>([^<]*)</).slice(0, 10)
    };
  });
  const last = xml.match(/<link rel="last"[^>]*start=(\d+)"/);
  return { entries, last: last ? Number(last[1]) : 0 };
}
function fpdsPage(q, start) {
  const url = FPDS + encodeURIComponent(q).replace(/%20/g, '+') + `&start=${start}`;
  return cached('fpds|' + url, () => fpdsPool(() => withRetry(async () => {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`FPDS ${r.status}`);
    const t = await r.text();
    if (!t.includes('<feed')) throw new Error('FPDS returned a non-feed page');
    return parseFpds(t);
  }, `FPDS ${q} @${start}`)));
}
const dateFilter = `SIGNED_DATE:[${WINDOW.start.replace(/-/g, '/')},${WINDOW.end.replace(/-/g, '/')}]`;
async function fpdsAll(q) {
  const first = await fpdsPage(q, 0);
  const pages = Math.min(first.last / 10 + 1, MAX_FPDS_PAGES);
  const rest = await Promise.all(Array.from({ length: pages - 1 }, (_, i) => fpdsPage(q, (i + 1) * 10)));
  return { entries: [first, ...rest].flatMap((p) => p.entries), capped: first.last / 10 + 1 > MAX_FPDS_PAGES };
}

/* ---------------------------------------------------------------- name matching */
const SUFFIX = new Set(['INC', 'INCORPORATED', 'LLC', 'L', 'C', 'CORP', 'CORPORATION', 'CO', 'COMPANY', 'LTD', 'LIMITED', 'LP', 'LLP', 'PLC',
  'PBC', 'GMBH', 'AG', 'SA', 'SAS', 'BV', 'AB', 'AS', 'ASA', 'OY', 'SPA', 'SRL', 'PTY', 'PTE', 'NV', 'SE', 'KG', 'THE', 'DBA']);
const TAIL = new Set(['TECHNOLOGIES', 'TECHNOLOGY', 'SYSTEMS', 'INDUSTRIES', 'AEROSPACE', 'LABS', 'LABORATORIES', 'USA', 'US', 'AMERICA',
  'INTERNATIONAL', 'GROUP', 'HOLDINGS', 'SOLUTIONS', 'DEFENSE', 'DEFENCE', 'SPACE', 'ROBOTICS', 'AI']);
function norm(s) {
  const t = String(s || '').toUpperCase().replace(/&/g, ' AND ').replace(/\([^)]*\)/g, ' ').replace(/[^A-Z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
  while (t.length > 1 && SUFFIX.has(t[t.length - 1])) t.pop();
  while (t.length > 1 && t[0] === 'THE') t.shift();
  return t.join(' ');
}
function matcher(c) {
  const a = ALIASES[c.id] || {};
  const own = a.names ? a.names : [c.name, c.short, c.formerly].filter(Boolean);
  const variants = new Set([...own, ...(a.names || [])].map(norm).filter(Boolean));
  const prefixes = a.prefix ? (a.terms || [c.name]).map(norm) : [];
  const exclude = new Set((a.exclude || []).map((x) => (/^[A-Z0-9]{12}$/.test(x) ? x : norm(x))));
  return (name, uei) => {
    const n = norm(name);
    if (!n || exclude.has(n) || (uei && exclude.has(uei))) return false;
    if (variants.has(n)) return true;
    // "SARONIC" also matches "SARONIC TECHNOLOGIES": the rest must be generic company words only
    for (const v of variants) if (n.startsWith(v + ' ') && n.slice(v.length + 1).split(' ').every((w) => TAIL.has(w))) return true;
    return prefixes.some((p) => n === p || n.startsWith(p + ' '));
  };
}
function terms(c) {
  const a = ALIASES[c.id];
  if (a && a.terms) return a.terms;
  return [...new Set([c.name, c.short, c.formerly].filter(Boolean).map((x) => x.replace(/\([^)]*\)/g, '').trim()))];
}

/* ---------------------------------------------------------------- per company */
async function pull(c) {
  const accept = matcher(c);
  const ts = terms(c);
  const recipients = new Map(); // key uei|name -> record
  const near = new Map();
  const add = (kind, rows, t) => rows.forEach((r) => {
    const key = (r.uei || '') + '|' + norm(r.name);
    if (accept(r.name, r.uei)) {
      const rec = recipients.get(key) || { name: r.name, uei: r.uei || '', contracts: 0, idvs: 0, grants: 0, subawards: 0, ot: 0 };
      rec[kind] += r.amount || 0;
      recipients.set(key, rec);
    } else if (norm(r.name).split(' ')[0] === norm(t).split(' ')[0]) {
      near.set(norm(r.name), (near.get(norm(r.name)) || 0) + (r.amount || 0));
    }
  });
  // Several terms can return the same recipient; take each (term, group) result once and de-duplicate by recipient.
  const seen = new Set();
  for (const t of ts) {
    for (const group of ['contracts', 'idvs', 'grants', 'subawards']) {
      const rows = await usaQuery(t, group);
      const fresh = rows.filter((r) => { const k = group + '|' + (r.uei || '') + '|' + norm(r.name); if (seen.has(k)) return false; seen.add(k); return true; });
      add(group, fresh, t);
    }
  }
  // Other Transactions: discover vendors by name, then page each accepted UEI in full. Large public groups have
  // hundreds of small recipient UEIs, so for them only UEIs with at least $5M of USAspending awards are paged.
  const big = (r) => (r.contracts + r.idvs + r.grants + r.subawards) >= 5e6;
  const ueis = new Set([...recipients.values()].filter((r) => !c.isPublic || big(r)).map((r) => r.uei).filter(Boolean));
  const isOT = (e) => e.kind === 'OtherTransactionAward' || e.kind === 'OtherTransactionIDV';
  for (const t of ts) {
    const first = await fpdsPage(`VENDOR_NAME:"${t}" ${OT_QUERY} ${dateFilter}`, 0);
    first.entries.forEach((e) => { if (isOT(e) && e.uei && (accept(e.vendor, e.uei) || accept(e.legal, e.uei))) ueis.add(e.uei); });
  }
  let capped = false;
  const counted = new Set();
  for (const uei of ueis) {
    {
      const { entries, capped: cap } = await fpdsAll(`VENDOR_UEI:"${uei}" ${OT_QUERY} ${dateFilter}`);
      capped = capped || cap;
      entries.forEach((e) => {
        if (!isOT(e) || counted.has(e.key)) return;
        counted.add(e.key);
        if (e.signed && (e.signed < WINDOW.start || e.signed > WINDOW.end)) return;
        const key = uei + '|' + norm(e.legal || e.vendor);
        const rec = recipients.get(key) || [...recipients.values()].find((r) => r.uei === uei) || { name: e.legal || e.vendor, uei, contracts: 0, idvs: 0, grants: 0, subawards: 0, ot: 0 };
        rec.ot += e.amount;
        recipients.set(rec.uei + '|' + norm(rec.name), rec);
      });
    }
  }
  const list = [...recipients.values()];
  const sum = (k) => list.reduce((a, r) => a + r[k], 0) / 1e6;
  const r1 = (x) => Math.round(x * 10) / 10;
  const prime = sum('contracts') + sum('idvs') + sum('grants');
  const ot = sum('ot'), sub = sum('subawards');
  return {
    id: c.id,
    out: {
      prime: r1(prime), contracts: r1(sum('contracts')), idvs: r1(sum('idvs')), grants: r1(sum('grants')),
      ot: r1(ot), sub: r1(sub), total: r1(prime + ot + sub),
      recipients: [...new Set(list.filter((r) => r.contracts || r.idvs || r.grants || r.subawards || r.ot).map((r) => r.name))].slice(0, 6),
      ...(capped ? { capped: true } : {}),
      ...(ALIASES[c.id] && ALIASES[c.id].flag ? { flag: ALIASES[c.id].flag } : {})
    },
    review: { terms: ts, list, near: [...near.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6) }
  };
}

/* ---------------------------------------------------------------- run */
const D = loadData();
const unknown = Object.keys(ALIASES).filter((id) => !D.companies.some((c) => c.id === id));
if (unknown.length) console.warn('Aliases for unknown company ids:', unknown.join(', '));
const outFile = path.join(root, 'src', 'data', 'obligations.js');
let prev = {};
if (fs.existsSync(outFile)) {
  const m = fs.readFileSync(outFile, 'utf8').match(/DTM\.obligations = (\{[\s\S]*\});\s*$/);
  if (m) prev = JSON.parse(m[1]).byId || {};
}
// Private companies first (the dashboard's main view), then public groups, which take longest.
const todo = D.companies.filter((c) => !ONLY || ONLY.has(c.id)).sort((a, b) => (a.status === b.status ? 0 : a.status === 'private' ? -1 : 1));
const results = {};
const review = [];
let done = 0;
await Promise.all(todo.map((c) => companyPool(async () => {
  try {
    const r = await pull(c);
    results[c.id] = r.out;
    review.push([c, r]);
  } catch (e) {
    console.error(`\n${c.id}: ${e.message}`);
  }
  done++;
  console.log(`${done}/${todo.length} ${c.id}`);
})));

const byId = { ...prev, ...results };
const out = {
  asOf: new Date().toISOString().slice(0, 10),
  window: 'FY2020–FY2026 (Oct 1, 2019 – Sep 30, 2026)',
  method: 'USAspending prime contracts, IDVs and grants plus subawards received; FPDS Other Transaction agreements, IDVs and orders. Matched to each company by recipient name; see scripts/recipient-aliases.mjs.',
  sources: [{ t: 'USAspending.gov API', u: 'https://api.usaspending.gov' }, { t: 'FPDS-NG ATOM feed', u: 'https://www.fpds.gov' }],
  byId: Object.fromEntries(D.companies.filter((c) => byId[c.id]).map((c) => [c.id, byId[c.id]]))
};
fs.writeFileSync(outFile, `/* Generated by scripts/obligations.mjs. Do not edit by hand; rerun the script instead. */\nDTM.obligations = ${JSON.stringify(out, null, 0)};\n`);

review.sort((a, b) => a[0].id.localeCompare(b[0].id));
fs.writeFileSync(REVIEW, review.map(([c, r]) => {
  const o = results[c.id];
  const lines = [`${c.id} (${c.name}) terms=${JSON.stringify(r.review.terms)} prime=${o.prime} ot=${o.ot} sub=${o.sub} total=${o.total}${o.capped ? ' CAPPED' : ''}`];
  r.review.list.forEach((x) => lines.push(`   + ${x.name} [${x.uei}] c=${(x.contracts / 1e6).toFixed(1)} idv=${(x.idvs / 1e6).toFixed(1)} g=${(x.grants / 1e6).toFixed(1)} sub=${(x.subawards / 1e6).toFixed(1)} ot=${(x.ot / 1e6).toFixed(1)}`));
  r.review.near.forEach(([n, amt]) => lines.push(`   ? ${n} ${(amt / 1e6).toFixed(1)}`));
  return lines.join('\n');
}).join('\n'));
console.log(`Wrote ${outFile} (${Object.keys(out.byId).length} companies) and ${REVIEW}`);
