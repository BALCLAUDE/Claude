// Dumps the map's taxonomy, companies, programs and comps-sheet revenue to budget/build/taxonomy.json,
// the single input the budget ETL reads from the map. Run with `npm run budget:taxonomy`.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadData } from './validate.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'budget', 'build', 'taxonomy.json');
const D = loadData();

const taxonomy = {
  exportedFrom: 'src/data',
  edition: D.meta.edition,
  asOf: D.meta.asOf,
  segments: D.segments.map((s) => ({
    id: s.id, code: s.code, name: s.name, blurb: s.blurb,
    subsegments: s.subsegments.map((x) => ({ id: x.id, name: x.name, blurb: x.blurb }))
  })),
  programs: (D.programs || []).map((p) => ({ id: p.id, name: p.name, customer: p.customer, blurb: p.blurb })),
  companies: D.companies.map((c) => ({
    id: c.id, name: c.name, status: c.status, ticker: c.ticker || null, exchange: c.exchange || null,
    country: c.country, domain: c.domain || null, subsegments: c.subsegments,
    programs: [...new Set((c.programs || []).map((p) => p.ref).filter(Boolean))],
    // Comps-sheet street sales estimates ($M, [CY25E, CY26E]) are the exposure-score denominators.
    consensusSalesM: D.consensus && D.consensus[c.id] ? D.consensus[c.id].sales : null
  }))
};

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(taxonomy, null, 1) + '\n');
console.log(`Wrote ${path.relative(root, out)}: ${taxonomy.segments.length} segments, ` +
  `${taxonomy.segments.reduce((a, s) => a + s.subsegments.length, 0)} subsegments, ` +
  `${taxonomy.companies.length} companies, ${taxonomy.programs.length} programs`);
