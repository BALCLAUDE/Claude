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
- **135 companies.** 53 are public and show their **market cap** (blue). 82 are private and show **total funding raised** (orange).
- **Companies that span several subsegments** appear in each one. Hovering one copy highlights the others.
- **Click any tile** for a profile with these tabs:
  - **Company description**
  - **Financials:** revenue history, margins, backlog for public companies, and funding rounds for private ones.
  - **Valuation:** multiples with a peer chart for public companies; post-money history and step-ups for private ones.
  - **Key programs**
  - **Peers**

## Features

- Search across names, tickers, programs, investors and products. Press `/` to focus the search box.
- Filters for Public / Private and for region (US, UK, Europe, Israel, Asia-Pacific, Canada).
- **Program Lens:** highlight every company on a program such as Golden Dome, CCA, SDA PWSA, NSSL, Replicator or Affordable Mass Missiles.
- Group by subsegment, founding era or funding stage. Sort by size, name or founding year.
- **Scale by size** enlarges the largest public companies and the best-funded private companies.
- **Table view** with sortable columns. Non-USD revenue is converted to USD in this view.
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

Private companies also add `funding {totalUsdM, asOf, src, rounds[], investors[], note}`, and optionally `revenue {valueUsdM, period, kind, src}` and `valuation {postUsdM, date, src}`.

All amounts are in **millions**. A source is `{ t: 'label', u: 'https://…' }`.

After editing:

```bash
npm run validate   # schema checks: valid subsegments, dates and sources on every figure
npm run build      # writes defense-tech-map.html (and dist/ for publishing)
npm test           # Playwright smoke tests (Chromium)
```

During editing you can open `src/index.html` directly. It loads the source files without a build step.

### Logos

Put logo files in `logos/`, named by company id:
- `anduril.svg` sits on a white square.
- `anduril.dark.svg` (white artwork) sits on the dark square.

The build embeds them into the HTML. Four logos are included from [Simple Icons](https://simpleicons.org).

When you open the file locally, other companies use their website favicon. If no logo is available, the tile shows a monogram. Logos are trademarks of their respective owners.
