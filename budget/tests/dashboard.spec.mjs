// Smoke tests for the budget dashboard against the sample database. Run with `npm run budget:test`
// (which builds the sample DB and budget/build/budget-dashboard.html first).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const url = pathToFileURL(path.join(root, 'budget', 'build', 'budget-dashboard.html')).href;
const sqlAsm = fs.readFileSync(path.join(root, 'node_modules', 'sql.js', 'dist', 'sql-asm.js'));

let browser;
before(async () => { browser = await chromium.launch(); });
after(async () => { await browser.close(); });

async function open(hash = '', opts = {}) {
  const page = await browser.newPage({ viewport: { width: opts.width || 1400, height: 1000 }, colorScheme: opts.colorScheme || 'light' });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  // Offline and deterministic: serve sql.js from node_modules, block everything else (fonts).
  await page.route(/^https?:/, (route) => (/sql\.js\/1\.13\.0\/sql-asm\.js$/.test(route.request().url())
    ? route.fulfill({ body: sqlAsm, contentType: 'application/javascript' }) : route.abort()));
  await page.goto(url + hash);
  await page.waitForFunction(() => window.BudgetApp && window.BudgetApp.D.db);
  return { page, errors };
}

test('sector trends renders a bar per fiscal year and the sample banner', async () => {
  const { page, errors } = await open();
  assert.equal(await page.locator('#sample-banner').isVisible(), true);
  assert.equal(await page.locator('#trend-chart .col').count(), 7);
  assert.ok(await page.locator('#trend-table tbody tr').count() >= 5);
  assert.ok(await page.locator('#trend-legend span').count() >= 5);
  await page.locator('#trend-chart .col').last().hover();
  assert.match(await page.locator('#tooltip').textContent(), /FY27/);
  // Drill into one segment: rows become its subsegments.
  await page.selectOption('#trend-segment', 'space');
  assert.match(await page.locator('#trend-table thead').textContent(), /Subsegment/);
  assert.deepEqual(errors, []);
  await page.close();
});

test('line explorer filters change the row count and the detail dialog opens', async () => {
  const { page, errors } = await open('#lines');
  const count = () => page.locator('#lines-table tbody tr.clickable').count();
  const all = await count();
  assert.ok(all > 20, `expected many mapped lines, got ${all}`);
  await page.selectOption('#f-component', 'Space Force');
  const space = await count();
  assert.ok(space > 0 && space < all);
  await page.fill('#f-q', 'interceptor');
  await page.waitForFunction(() => document.querySelectorAll('#lines-table tbody tr.clickable').length === 1);
  await page.locator('#lines-table tbody tr.clickable').first().click();
  await page.locator('#detail').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#detail-title').textContent(), 'Space Based Interceptor');
  assert.match(await page.locator('#detail-body').textContent(), /Rule golden-dome/);
  await page.locator('#detail-close').click();
  await page.fill('#f-q', '');
  await page.selectOption('#f-component', '');
  await page.selectOption('#f-status', 'not_tech');
  await page.waitForFunction(() => document.querySelectorAll('#lines-table tbody tr.clickable').length === 4);
  // Sorting by title flips the order.
  await page.locator('#lines-table th[data-key="title"]').click();
  const firstAsc = await page.locator('#lines-table tbody td.title').first().textContent();
  await page.locator('#lines-table th[data-key="title"]').click();
  assert.notEqual(await page.locator('#lines-table tbody td.title').first().textContent(), firstAsc);
  assert.deepEqual(errors, []);
  await page.close();
});

test('movers lists increases, new starts and terminations', async () => {
  const { page, errors } = await open('#movers');
  assert.equal(await page.locator('.mover-card').count(), 5);
  const text = await page.locator('#movers').textContent();
  assert.match(text, /Biggest increases/);
  await page.selectOption('#m-by', '2025');
  // In the sample, Family of Affordable Mass Missiles starts in FY2025 and ARRW ends after FY2024.
  const starts = await page.locator('.mover-card').nth(2).textContent();
  assert.match(starts, /Family of Affordable Mass Missiles/);
  const ends = await page.locator('.mover-card').nth(3).textContent();
  assert.match(ends, /Air-Launched Rapid Response Weapon/);
  assert.deepEqual(errors, []);
  await page.close();
});

test('value basis and mandatory toggles change the totals', async () => {
  const { page } = await open();
  const total = () => page.locator('#trend-table tfoot td').nth(7).textContent();
  const best = await total();
  await page.locator('#mandatory').uncheck();
  const noMandatory = await total();
  assert.notEqual(best, noMandatory);
  await page.selectOption('#basis', 'actual');
  assert.equal(await total(), '$0');
  await page.close();
});

test('dark mode applies dark tokens, and the toggle overrides the OS setting', async () => {
  const { page } = await open('', { colorScheme: 'dark' });
  const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  assert.equal(await bg(), 'rgb(11, 15, 18)');
  await page.locator('#theme-btn').click();
  assert.equal(await bg(), 'rgb(236, 239, 240)');
  await page.close();
});

test('phone width has no horizontal page scroll', async () => {
  const { page } = await open('#lines', { width: 390 });
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(over <= 0, `page scrolls sideways by ${over}px`);
  await page.close();
});

test('awards view lists awards, filters them and shows sector top recipients', async () => {
  const { page, errors } = await open('#awards');
  await page.waitForSelector('#aw-table tbody tr');
  const all = await page.locator('#aw-table tbody tr').count();
  assert.equal(all, 36);
  await page.selectOption('#aw-company', 'shield-ai');
  assert.equal(await page.locator('#aw-table tbody tr').count(), 12);
  await page.selectOption('#aw-company', '');
  await page.selectOption('#aw-min', '1000000000');
  assert.ok(await page.locator('#aw-table tbody tr').count() < all);
  assert.match(await page.locator('#aw-universe').textContent(), /GENERAL ATOMICS \(SAMPLE\)/);
  assert.match(await page.locator('#aw-universe').textContent(), /on map/);  // Anduril's UEI resolves to the map company
  assert.deepEqual(errors, []);
  await page.close();
});

test('company view ranks companies and opens a company page', async () => {
  const { page, errors } = await open('#company');
  await page.waitForSelector('#co-body tr[data-company]');
  assert.equal(await page.locator('#co-body tr[data-company]').count(), 3);
  assert.equal(await page.locator('#co-body tr[data-company]').first().getAttribute('data-company'), 'lockheed-martin');
  await page.locator('#co-body tr[data-company="anduril"] td').nth(1).click();
  await page.waitForSelector('#co-chart svg');
  assert.match(page.url(), /#company-anduril$/);
  const text = await page.locator('#co-body').textContent();
  for (const s of ['Largest contracts', 'Contract vehicles', 'Matched recipients', 'SAMPLEUEI0001']) assert.ok(text.includes(s), s);
  assert.ok(await page.locator('#co-chart rect.seg').count() > 0);
  assert.deepEqual(errors, []);
  await page.close();
});
