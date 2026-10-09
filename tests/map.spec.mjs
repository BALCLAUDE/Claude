// Smoke tests for the built defense-tech-map.html. Run with `npm test` (builds first).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const url = pathToFileURL(path.join(root, 'defense-tech-map.html')).href;

let browser;
before(async () => { browser = await chromium.launch(); });
after(async () => { await browser.close(); });

async function open(opts = {}, hash = '') {
  const page = await browser.newPage({ viewport: { width: opts.width || 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  // Keep tests offline and deterministic: block fonts and favicon lookups.
  await page.route(/^https?:/, (route) => route.abort());
  await page.goto(url + hash);
  await page.waitForSelector('.tile');
  return { page, errors };
}

test('renders every segment column and every company appearance', async () => {
  const { page, errors } = await open();
  const { segments, expectedTiles } = await page.evaluate(() => {
    const subs = new Set(window.DTM.segments.flatMap((s) => s.subsegments.map((x) => x.id)));
    const n = window.DTMApp.companies.reduce((a, c) => a + c.subsegments.filter((s) => subs.has(s)).length, 0);
    return { segments: window.DTM.segments.length, expectedTiles: n };
  });
  assert.equal(await page.locator('.segment').count(), segments);
  assert.equal(await page.locator('.board .tile').count(), expectedTiles);
  assert.match(await page.locator('#result-count').textContent(), /Showing (\d+) of \1 companies/);
  assert.deepEqual(errors, []);
  await page.close();
});

test('public tiles show market cap and private tiles show funding', async () => {
  const { page } = await open();
  const spacex = page.locator('.tile[data-id="spacex"]').first();
  assert.equal(await spacex.getAttribute('data-status'), 'public');
  assert.match(await spacex.getAttribute('aria-label'), /market cap/);
  const anduril = page.locator('.tile[data-id="anduril"]').first();
  assert.equal(await anduril.getAttribute('data-status'), 'private');
  assert.match(await anduril.getAttribute('aria-label'), /raised to date/);
  await page.close();
});

test('clicking a tile opens the profile and every tab renders', async () => {
  const { page, errors } = await open();
  await page.locator('.tile[data-id="rocket-lab"]').first().click();
  const dialog = page.locator('#detail');
  await dialog.waitFor({ state: 'visible' });
  assert.equal(await page.locator('#detail-name').textContent(), 'Rocket Lab');
  for (const [tab, marker] of [['financials', '.fin-table'], ['valuation', '.stat-grid'], ['programs', '.program'], ['peers', '.peer-group'], ['overview', '.facts']]) {
    await page.locator(`#tab-${tab}`).click();
    assert.equal(await page.locator(`#tab-${tab}`).getAttribute('aria-selected'), 'true');
    assert.ok(await page.locator(`#d-body ${marker}`).count() > 0, `${tab} tab content`);
  }
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  assert.deepEqual(errors, []);
  await page.close();
});

test('every company profile renders all tabs without errors', async () => {
  const { page, errors } = await open();
  const failures = await page.evaluate(() => {
    const bad = [];
    for (const c of window.DTMApp.companies) {
      for (const tab of ['overview', 'financials', 'valuation', 'programs', 'peers']) {
        try { window.DTMApp.openCompany(c.id, { tab }); } catch (e) { bad.push(`${c.id}/${tab}: ${e.message}`); }
        if (!document.querySelector('#d-body').innerHTML.trim()) bad.push(`${c.id}/${tab}: empty`);
      }
    }
    return bad;
  });
  assert.deepEqual(failures, []);
  assert.deepEqual(errors, []);
  await page.close();
});

test('search, ownership and region filters narrow the map', async () => {
  const { page } = await open();
  await page.fill('#q', 'hypersonic');
  await page.waitForFunction(() => document.querySelectorAll('.board .tile').length < 60);
  const searched = await page.locator('.board .tile').evaluateAll((ts) => [...new Set(ts.map((t) => t.dataset.id))]);
  assert.ok(searched.includes('castelion') && searched.length < 40, 'search narrows to hypersonic companies');

  await page.fill('#q', '');
  await page.locator('label[for="own-private"]').click();
  await page.waitForTimeout(150);
  assert.equal(await page.locator('.board .tile[data-status="public"]').count(), 0);

  await page.locator('label[for="own-all"]').click();
  await page.selectOption('#region', 'eu');
  await page.waitForTimeout(150);
  const countries = await page.locator('.board .tile').evaluateAll((ts) => ts.map((t) => window.DTMApp.byId[t.dataset.id].country));
  const eu = await page.evaluate(() => window.DTM.regions.find((r) => r.id === 'eu').countries);
  assert.ok(countries.length > 0 && countries.every((c) => eu.includes(c)));
  await page.close();
});

test('program lens highlights participants and dims the rest', async () => {
  const { page } = await open();
  await page.selectOption('#lens', 'cca');
  await page.waitForTimeout(150);
  const lit = await page.locator('.board .tile.in-lens').evaluateAll((ts) => [...new Set(ts.map((t) => t.dataset.id))]);
  for (const id of ['anduril', 'general-atomics']) assert.ok(lit.includes(id), `${id} is in the CCA lens`);
  assert.ok(await page.locator('#board.has-lens').count());
  assert.ok(await page.locator('#lens-banner').isVisible());
  await page.close();
});

test('deep link opens a company on a specific tab', async () => {
  const { page } = await open({}, '#anduril.programs');
  await page.locator('#detail').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#detail-name').textContent(), 'Anduril Industries');
  assert.equal(await page.locator('#tab-programs').getAttribute('aria-selected'), 'true');
  await page.close();
});

test('table view lists visible companies and sorts by column', async () => {
  const { page } = await open();
  await page.locator('label[for="view-table"]').click();
  await page.waitForSelector('.data-table');
  const total = await page.evaluate(() => window.DTMApp.companies.length);
  assert.equal(await page.locator('.data-table tbody tr').count(), total);
  await page.locator('[data-sort="name"]').click();
  const names = await page.locator('.data-table tbody tr').evaluateAll((rows) => rows.map((r) => window.DTMApp.byId[r.dataset.id].name));
  const sorted = [...names].sort((a, b) => a.localeCompare(b));
  assert.deepEqual(names, sorted);
  await page.close();
});

test('compare tray collects companies and opens a side-by-side table', async () => {
  const { page } = await open();
  for (const id of ['saronic', 'anduril']) {
    await page.evaluate((i) => window.DTMApp.openCompany(i), id);
    await page.locator('[data-action="compare"]').click();
    await page.keyboard.press('Escape');
  }
  await page.locator('[data-action="open-compare"]').click();
  await page.locator('#compare-dialog').waitFor({ state: 'visible' });
  assert.equal(await page.locator('.compare-table thead th').count(), 3);
  await page.close();
});

test('phone width has no horizontal page scroll', async () => {
  const { page } = await open({ width: 390 });
  const [sw, iw] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  assert.ok(sw <= iw, `scrollWidth ${sw} > ${iw}`);
  await page.locator('.tile').first().click();
  await page.locator('#detail').waitFor({ state: 'visible' });
  const [dw] = await page.evaluate(() => [document.querySelector('#detail').getBoundingClientRect().width]);
  assert.ok(dw <= 390);
  await page.close();
});
