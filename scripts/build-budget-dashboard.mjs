// Inlines budget/dashboard/{styles.css,app.js,data.js} into one self-contained page:
//   budget/build/budget-dashboard.html            standalone page (open by double-clicking)
//   budget/build/budget-dashboard.artifact.html   the same page as a body fragment for a claude.ai Artifact
// sql.js stays a pinned cdnjs <script> (its asm.js build, so no .wasm fetch is needed).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dash = (p) => path.join(root, 'budget', 'dashboard', p);
const outDir = path.join(root, 'budget', 'build');
if (!fs.existsSync(dash('data.js'))) {
  console.error('budget/dashboard/data.js is missing: run `python3 -m budget.etl build` (or `sample`) first.');
  process.exit(1);
}
const safe = (s) => s.replace(/<\/(script|style)/gi, '<\\/$1');
let html = fs.readFileSync(dash('index.html'), 'utf8');
html = html.replace('<link rel="stylesheet" href="styles.css">', () => `<style>\n${safe(fs.readFileSync(dash('styles.css'), 'utf8'))}\n</style>`);
html = html.replace(/<script src="([^":]+)"><\/script>/g, (_, rel) => `<script>/* ${rel} */\n${safe(fs.readFileSync(dash(rel), 'utf8'))}\n</script>`);
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'budget-dashboard.html'), html);
const fragment = html
  .replace(/<!doctype html>\s*/i, '').replace(/<html[^>]*>\s*/i, '').replace(/<\/html>\s*/i, '')
  .replace(/<head>\s*/i, '').replace(/<\/head>\s*/i, '').replace(/<body>\s*/i, '').replace(/<\/body>\s*/i, '')
  .replace(/<meta charset="utf-8">\s*/i, '').replace(/<meta name="viewport"[^>]*>\s*/i, '');
fs.writeFileSync(path.join(outDir, 'budget-dashboard.artifact.html'), fragment);
console.log(`Wrote budget/build/budget-dashboard.html (${Math.round(html.length / 1024)} KB) and the artifact fragment`);
