# Defense Tech Market Map

An interactive market map of the US and allied defense technology sector. It ships as a single HTML file you can open by double-clicking, with no server or install needed.

**Open it:** download [`defense-tech-map.html`](defense-tech-map.html) and open it in any modern browser.

## What's on the map

- **9 segment columns**, each split into subsegments:
  - Space
  - Missiles & Munitions
  - Drones & Air Autonomy
  - Counter-UAS & Air Defense
  - Maritime & Ground Robotics
  - Defense Software & AI
  - Sensors, EW & Comms
  - Manufacturing & Energy
  - Primes & Mid-Tier (a separate column)
- **Subsegments added in the Q4 2026 update:** Stations, Spaceplanes & Reentry and Ground Systems & Mission Ops (Space); Hypersonic Test & Reentry (Missiles); Commercial, Delivery & Public Safety and Airspace Management & UTM (Drones); Missile Defense (Counter-UAS & Air Defense); and Additive Manufacturing (Manufacturing & Energy).
- **282 companies**, 275 of them with their logo. 76 are public and show their **market cap** (blue). 206 are private and show **total funding raised** (orange).
- **Companies that span several subsegments** appear in each one. Hovering one copy highlights the others.
- **Click any company** for a profile with these tabs:
  - **Company description**
  - **Financials:** revenue history, margins, backlog for public companies, and funding rounds for private ones.
  - **Valuation:** multiples with a peer chart for public companies; post-money history and step-ups for private ones. Public companies on the shared comps sheet also show its CY25E/CY26E street estimates and an EV / CY26E sales peer chart.
  - **Key programs**
  - **Peers**

## Two tabs

- **Capital vs. Contracts** (the default tab) asks who is actually getting paid. For every company in the selected segment it sets capital raised (private) or market cap (public) against federal obligations from FY2020 to FY2026:
  - Five headline tiles and a one-line takeaway.
  - A log-log bubble chart with a $1-per-$1 parity line, bubble area for valuation (private) or revenue (public), and dashed outlines where obligations are likely understated. Hover for detail, click to open the profile, or type a name to find it.
  - A sortable, filterable table with contracts, Other Transactions and subawards per company, plus a methodology note.
  - The approach follows Defense Tech Signals' [Capital vs. Contracts](https://dtscontracts.netlify.app/) dashboard of the NatSec100, applied here to the companies on this map.
- **Market map**: every company's logo, ordered by funding, in four switchable layouts (below), plus search, filters, Program Lens, table view, compare and PNG export.

## Four map layouts

Pick one with the **Layout** switcher in the map toolbar. In every layout private companies are ranked by total capital raised and public companies by market cap, and subsegments are ordered by the capital they have raised.

| Layout | What it shows |
|---|---|
| **Logo wall** (default) | Subsegment panels with a ranked grid of logos and the amount raised under each. |
| **Funding tiers** | Subsegment columns; rows group companies by amount raised ($1B+, $250M–1B, $50–250M, under $50M, undisclosed) with public companies on top. Logos grow with the tier. |
| **Leaderboard** | Ranked lists per subsegment with a square logo, name and a bar on one log scale for the whole view. |
| **Treemap** | Box area shows capital raised (compressed so small companies stay visible). Each private company appears once, in its primary subsegment; public companies sit in a strip below. |

The layout is remembered and kept in the link: `#map/space/treemap`, `#map/unmanned/leaderboard`, `#map/tiers`.

Both tabs share the segment toggle, and the link keeps the view: `#dashboard/unmanned`, `#dashboard/space/public`, `#map/manufacturing`, `#map/space/treemap`. Company links like `#anduril.programs` open the map with that profile.

## Features

- **Segment toggle:** show All, **Unmanned** (Drones & Air Autonomy + Maritime & Ground Robotics), **Space**, **Manufacturing**, or any single segment column. The map, table, dashboard, counts and headline stats follow it. Groups are defined in `DTM.focusGroups` in `src/data/taxonomy.js`.
- **Export PNG:** renders a shareable poster of any segment group in any of the four layouts (the leaderboard poster is dark, the others light): title, totals, legend, the layout itself and a sources footer. Choose all, public-only or private-only companies and a Standard (1600 px, saved at 3200 px) or Wide (2400 px, saved at 4800 px) size. Posters are drawn from the data (`src/export.js`), so they look the same whatever the screen, theme or filters. In the published claude.ai version, saving asks you to confirm the download.
- Search across names, tickers, programs, investors and products. Press `/` to focus the search box.
- Filters for Public / Private and for region (US, UK, Europe, Israel, Asia-Pacific, Canada, and China for non-allied companies).
- **Program Lens:** highlight every company on a program such as Golden Dome, CCA, SDA PWSA, NSSL, Replicator or Affordable Mass Missiles.
- **Table view** with sortable columns, including EV / CY26E sales from the comps sheet. Non-USD revenue is converted to USD in this view.
- **Compare tray:** pin up to four companies for a side-by-side comparison.
- **Deep links**, e.g. `defense-tech-map.html#anduril.programs`.
- Light and dark themes, keyboard navigation, and a phone layout.

## About the data

- This is a **curated snapshot compiled in October 2026**. Every market cap, funding total, round, valuation and financial figure records its own as-of date and source link, shown in the profile.
- Market caps come from different dates between April and October 2026, so check the date shown before comparing companies.
- Values a company hasn't disclosed are shown as "Not disclosed." Third-party estimates are labeled "est."
- Where we calculated a figure ourselves (for example an EV less cash, a market cap from price × shares, or a price/sales ratio), the profile note says so.
- Non-USD market caps are converted at approximate 2026 exchange rates, listed at the top of `src/data/companies/primes.js`.
- Private-company funding totals often differ between trackers. The profile notes say which figure is shown and why.
- **Shared funding tables.** Companies added from the hypersonics, space, drone and missile funding tables shared for this update use those tables' total raised, round count and last funding date, cited as such. The drone (mid-2025) and missile (late 2025) tables are older, so later rounds found in research are added on top and explained in the note. Companies already on the map keep their researched figures.
- **Public names sheet and private names list.** Public companies added from the shared public names sheet show that sheet's market cap and multiples, labeled undated. Profiles for names added from the private names list are concise: one paragraph, a sourced funding total and a program where one was found. Founding years that couldn't be confirmed are left blank and shown as "not compiled".
- **Comps sheet.** The shared public comps sheet is stored in `src/data/consensus.js` and shown as street estimates in the Valuation tab. The sheet is undated, so its prices and market caps may differ from the dated market cap on the tile.
- **Non-allied companies.** DJI is included for completeness because it appears in the drone funding table. Its tile carries a red "CN" flag, and its profile explains the US restrictions on it.
- **Federal obligations** (Capital vs. Contracts tab and each profile's Key programs tab) come from public award data, Oct 1, 2019 – Sep 30, 2026:
  - USAspending prime contracts, IDVs and grants to each company's own-name recipients, plus subawards it received.
  - FPDS Other Transaction agreements, OT IDVs and OT orders, which USAspending's contract data doesn't include.
  - Companies are matched to recipients by name. `scripts/recipient-aliases.mjs` maps companies recorded under another legal name (Forterra as Robotic Research OpCo, Govini as Poplicus) and limits generic names to exact matches. Large groups include named subsidiaries; non-US groups show only their US subsidiaries.
  - Not captured: OTs booked to consortium managers, unreported subcontracts, reseller and marketplace sales, classified work, and awards to non-US parents. The dashboard flags likely undercounts.
  - Matched recipient names are listed in each profile so a reader can check them.
  - **Cross-check:** 51 companies also appear in the Defense Tech Signals dataset, and 45 of them land within 10% (or $2M) of its totals. The other six differ for known reasons: OTs signed in mid-2026 (Sierra Space, True Anomaly, Umbra), federal subsidiaries included here (Relativity Federal, Divergent Industries), and CesiumAstro OTs recorded under its own UEI.

## Editing the data

Data lives in plain JavaScript files under `src/data/`:

| File | Contents |
|---|---|
| `taxonomy.js` | Segments, subsegments, regions, edition and as-of date |
| `programs.js` | Programs available in the Program Lens |
| `companies/<segment>.js` | One `DTM.add({...})` per company |

Each company has:
- `id`, `name`, `status` (`public` or `private`), `country`, `founded`
- `subsegments`: the first one listed is the company's primary subsegment.
- `oneLiner`, `description`, and optionally `products`, `leadership` and `programs`.

Public companies also add `ticker`, `exchange`, `marketCap {usdM, asOf, src}`, `financials {cur, fyEnd, periods[], backlog, src}` and `valuation {evUsdM, evSales, basis, pe, asOf, src}`.

Private companies also add `funding {totalUsdM, asOf, src, rounds[], investors[], note}`, and optionally `revenue {valueUsdM, period, kind, src}` and `valuation {postUsdM, date, src}`. When only a total is known (for example from a funding table), add `funding.roundCount` and `funding.lastDate`. Use `totalUsdM: null, label: 'Undisclosed'` when there's no disclosed total.

Optional for any company: `short` (tile name), `formerly` (former name, searchable), `employees`, and `flag` / `flagShort` (a warning shown on the tile and in the profile). Set `founded: null` when the founding year can't be confirmed; the profile shows "Not compiled". Figures copied from an undated sheet add `undated: true` to `marketCap` or `valuation`.

Street estimates live in `src/data/consensus.js`, keyed by public company id.

All amounts are in **millions**. A source is `{ t: 'label', u: 'https://…' }`.

After editing:

```bash
npm run validate   # schema checks: valid subsegments, dates and sources on every figure
npm run build      # writes defense-tech-map.html (and dist/ for publishing)
npm test           # Playwright smoke tests (Chromium)
```

During editing you can open `src/index.html` directly. It loads the source files without a build step.

To refresh federal obligations (writes `src/data/obligations.js`, caches API responses in `.cache/`, and writes a review file listing every matched recipient):

```bash
NODE_USE_ENV_PROXY=1 node scripts/obligations.mjs                 # all companies
NODE_USE_ENV_PROXY=1 node scripts/obligations.mjs --only anduril   # one or more ids
```

`NODE_USE_ENV_PROXY=1` is only needed behind an HTTPS proxy. Check the review file for same-name recipients that aren't the company, and add them to `exclude` in `scripts/recipient-aliases.mjs`.

### Logos

Logos are collected from each company's website and embedded in the page, so they show everywhere, including the published version.

```bash
node scripts/logos/harvest.mjs [--only id,id]   # visits each company's site (its `domain`), captures the header logo and site icon into .cache/logos/
node scripts/logos/process.mjs [--only id,id]   # trims, keys out backgrounds and writes logos/<id>.wm.webp, logos/<id>.icon.webp and logos/logos.json
npm run build                                    # embeds them
```

- `logos/overrides.json` holds the hand review: `use: "icon"` or `"none"` skips a wrong or broken wordmark, `name: true` shows the company name beside a symbol-only logo, and `recolor: true` darkens pale artwork.
- To supply a logo by hand, put it in `logos/source/<id>.wm.svg` (or `.png`, or `<id>.icon.png`) and rerun `process.mjs`.
- Companies without a logo show a monogram. The page derives dark-theme versions of the wordmarks itself. Logos are trademarks of their respective owners.
