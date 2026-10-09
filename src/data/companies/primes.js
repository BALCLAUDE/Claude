/* Primes & Mid-Tier column. Non-USD market caps are converted at approximate 2026 exchange rates
   (EUR 1.16, GBP 1.34, SEK 0.105, KRW 1/1,380, JPY 1/150, ILS 0.27 USD). */
(function () {
  const S = (t, u) => (u ? { t, u } : { t });
  const mcapRatio = 'Market cap ÷ latest fiscal-year revenue';

  /* ---------------- US primes ---------------- */
  DTM.add({
    id: 'lockheed-martin', name: 'Lockheed Martin', domain: 'lockheedmartin.com', status: 'public', ticker: 'LMT', exchange: 'NYSE',
    hq: 'Bethesda, MD', country: 'US', founded: 1995,
    subsegments: ['primes.us'],
    oneLiner: 'World\'s largest defense contractor: F-35, missiles (PAC-3, JASSM, PrSM), space and missile defense.',
    description: [
      'Lockheed Martin builds the F-35, the C-130J and Black Hawk helicopters, and is the leading US missile and missile defense maker with PAC-3 MSE, JASSM, LRASM, PrSM and GMLRS. Its space business builds GPS, missile warning and Trident and NGI interceptors.',
      'Sales grew 6% to $75.0B in 2025 and backlog reached a record $193.6B.'
    ],
    leadership: [['Jim Taiclet', 'Chairman, President & CEO']],
    products: ['F-35', 'PAC-3 MSE', 'JASSM / LRASM', 'PrSM', 'C-130J', 'Black Hawk', 'NGI'],
    marketCap: { usdM: 135171, asOf: '2026-08-07', src: S('Fintel', 'https://fintel.io/s/US/LMT') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [
        { label: 'FY2023', revenue: 67571, netIncome: 6920 },
        { label: 'FY2024', revenue: 71043, netIncome: 5336 },
        { label: 'FY2025', revenue: 75048, netIncome: 5017, fcf: 6900 }
      ],
      backlog: { valueM: 193600, asOf: '2025-12-31', note: 'Record; ~37% converts within 12 months' },
      defenseMix: '~93%',
      asOf: '2026-01-29', src: S('Lockheed Martin FY2025 results', 'https://news.lockheedmartin.com/2026-01-29-Lockheed-Martin-Reports-Fourth-Quarter-and-Full-Year-2025-Financial-Results')
    },
    valuation: { evSales: 1.8, pe: 26.9, basis: mcapRatio, note: 'Ratios use market cap; EV not compiled. P/E on FY2025 GAAP net earnings.', asOf: '2026-08-07', src: S('Fintel', 'https://fintel.io/s/US/LMT') },
    programs: [
      { name: 'F-35 Lightning II', ref: 'f35', customer: 'US and 19 allied nations', role: 'Prime', status: 'Production' },
      { name: 'Next Generation Interceptor', ref: 'ngi', customer: 'Missile Defense Agency', role: 'Prime', year: 2024, status: 'Development' },
      { name: 'Golden Dome space-based interceptor prototype', ref: 'golden-dome', customer: 'US Space Force', role: '1 of 12 awardees', value: 'Up to $3.2B (pool)', year: 2026, status: 'Prototype', note: 'Selected in April 2026 alongside its broader Golden Dome sensor and interceptor work.', src: S('MeriTalk, Apr 2026', 'https://www.meritalk.com/articles/space-force-taps-12-companies-for-golden-dome-space-based-interceptor/') },
      { name: 'PAC-3 MSE production ramp', customer: 'US Army and allies', role: 'Prime', status: 'Production' }
    ]
  });

  DTM.add({
    id: 'rtx', name: 'RTX', domain: 'rtx.com', status: 'public', ticker: 'RTX', exchange: 'NYSE',
    hq: 'Arlington, VA', country: 'US', founded: 1922,
    subsegments: ['primes.us'],
    oneLiner: 'Raytheon missiles and air defense (Patriot, SM-6, Tomahawk), Pratt & Whitney engines and Collins avionics.',
    description: [
      'RTX combines Raytheon (Patriot, LTAMDS, Standard Missile, AMRAAM, Tomahawk, StormBreaker), Pratt & Whitney (including the F135 engine for the F-35) and Collins Aerospace.',
      'Sales rose 10% to $88.6B in 2025. Backlog reached $289B by September 2026, not counting a $23B Tomahawk undefinitized contract.'
    ],
    leadership: [['Chris Calio', 'Chairman & CEO']],
    products: ['Patriot', 'LTAMDS', 'SM-3 / SM-6', 'Tomahawk', 'AMRAAM', 'F135 engine'],
    marketCap: { usdM: 270560, asOf: '2026-09-05', src: S('Ad-hoc News', 'https://www.ad-hoc-news.de/boerse/news/corporate-news/rtx-corporation-stock-gains-on-stronger-q2-results/70058973') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [{ label: 'FY2023', revenue: 68920 }, { label: 'FY2024', revenue: 80738 }, { label: 'FY2025', revenue: 88600, fcf: 7900 }],
      backlog: { valueM: 268000, asOf: '2025-12-31', note: '$107B defense; $289B by Sep 2026' },
      defenseMix: '~45%',
      notes: '2026 guidance: adjusted sales $92B–$93B, adjusted EPS $6.60–$6.80, free cash flow $8.25B–$8.75B.',
      asOf: '2026-01-27', src: S('GovConWire', 'https://www.govconwire.com/articles/rtx-2025-financial-results-2026-outlook')
    },
    valuation: { evSales: 3.1, basis: mcapRatio, note: 'Ratio uses market cap; EV not compiled.', asOf: '2026-09-05', src: S('Ad-hoc News', 'https://www.ad-hoc-news.de/boerse/news/corporate-news/rtx-corporation-stock-gains-on-stronger-q2-results/70058973') },
    programs: [
      { name: 'Golden Dome space-based interceptor prototype', ref: 'golden-dome', customer: 'US Space Force', role: '1 of 12 awardees', value: 'Up to $3.2B (pool)', year: 2026, status: 'Prototype', note: 'Raytheon selected for space-based interceptor prototypes.', src: S('MeriTalk, Apr 2026', 'https://www.meritalk.com/articles/space-force-taps-12-companies-for-golden-dome-space-based-interceptor/') },
      { name: 'Tomahawk production', customer: 'US Navy', role: 'Prime', value: '$23B (UCA)', year: 2026, status: 'Production' },
      { name: 'Patriot and LTAMDS', customer: 'US Army and allies', role: 'Prime', status: 'Production' },
      { name: 'Hypersonic Attack Cruise Missile', ref: 'hypersonic-test', customer: 'US Air Force', role: 'Prime', status: 'Development' }
    ]
  });

  DTM.add({
    id: 'northrop-grumman', name: 'Northrop Grumman', domain: 'northropgrumman.com', status: 'public', ticker: 'NOC', exchange: 'NYSE',
    hq: 'Falls Church, VA', country: 'US', founded: 1939,
    subsegments: ['primes.us'],
    oneLiner: 'B-21 Raider, Sentinel ICBM, solid rocket motors and space-based missile warning.',
    description: [
      'Northrop Grumman builds the B-21 stealth bomber and the Sentinel ICBM, is the largest US solid rocket motor maker, and builds missile-tracking satellites, the Glide Phase Interceptor and E-2D and E-130J aircraft.',
      'Sales were $42.0B in 2025 with a record $95.7B backlog. 2026 guidance is $43.5B–$44.0B.'
    ],
    leadership: [['Kathy Warden', 'Chair, CEO & President']],
    products: ['B-21 Raider', 'Sentinel', 'GMLRS & SRMs', 'Glide Phase Interceptor', 'E-2D', 'IBCS'],
    marketCap: { usdM: 73390, asOf: '2026-09-07', src: S('Capital.com', 'https://capital.com/en-ke/markets/shares/northrop-grumman-share-price/market-cap') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [{ label: 'FY2023', revenue: 39290 }, { label: 'FY2024', revenue: 41033 }, { label: 'FY2025', revenue: 42000 }],
      backlog: { valueM: 95700, asOf: '2025-12-31', note: 'Record; $46B+ net awards in 2025' },
      asOf: '2026-01-27', src: S('Northrop Grumman FY2025 results (8-K)', 'https://www.sec.gov/Archives/edgar/data/1133421/000113342126000002/noc-12312025xearningsrelea.htm')
    },
    valuation: { evSales: 1.7, basis: mcapRatio, note: 'Ratio uses market cap; EV not compiled.', asOf: '2026-09-07', src: S('Capital.com', 'https://capital.com/en-ke/markets/shares/northrop-grumman-share-price/market-cap') },
    programs: [
      { name: 'Golden Dome space-based interceptor prototype', ref: 'golden-dome', customer: 'US Space Force', role: '1 of 12 awardees', value: 'Up to $3.2B (pool)', year: 2026, status: 'Prototype', note: 'Completed ground tests in 2026; plans an on-orbit demonstration in 2027 using Apex buses.', src: S('MeriTalk, Apr 2026', 'https://www.meritalk.com/articles/space-force-taps-12-companies-for-golden-dome-space-based-interceptor/') },
      { name: 'B-21 Raider', ref: 'b21', customer: 'US Air Force', role: 'Prime', status: 'Low-rate production' },
      { name: 'Sentinel ICBM', ref: 'sentinel', customer: 'US Air Force', role: 'Prime', status: 'Development (restructured)' },
      { name: 'SDA Tracking Layer satellites', ref: 'pwsa', customer: 'Space Development Agency', role: 'Prime', status: 'Production' },
      { name: 'Solid rocket motors', ref: 'srm', customer: 'US Army / Navy / MDA', role: 'Supplier', status: 'Production' }
    ]
  });

  DTM.add({
    id: 'general-dynamics', name: 'General Dynamics', domain: 'gd.com', status: 'public', ticker: 'GD', exchange: 'NYSE',
    hq: 'Reston, VA', country: 'US', founded: 1952,
    subsegments: ['primes.us'],
    oneLiner: 'Nuclear submarines (Electric Boat), Abrams and Stryker, 155 mm artillery shells, IT and Gulfstream jets.',
    description: [
      'General Dynamics builds Columbia- and Virginia-class submarines at Electric Boat, surface ships at Bath and NASSCO, Abrams tanks and Stryker vehicles, and leads US artillery shell production. It also owns Gulfstream and GDIT.',
      'Revenue grew 10% to $52.6B in 2025, and backlog jumped about 30% to a record $118B.'
    ],
    leadership: [['Phebe Novakovic', 'Chairman & CEO']],
    products: ['Columbia-class SSBN', 'Virginia-class SSN', 'Abrams', 'Stryker', '155 mm artillery', 'Gulfstream'],
    marketCap: { usdM: 90990, asOf: '2026-09-24', src: S('Motley Fool', 'https://www.fool.com/quote/nyse/general-dynamics/gd/') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [
        { label: 'FY2023', revenue: 42272, netIncome: 3315 },
        { label: 'FY2024', revenue: 47716, netIncome: 3782 },
        { label: 'FY2025', revenue: 52600, netIncome: 4200 }
      ],
      backlog: { valueM: 118000, asOf: '2025-12-31', note: 'Record; total estimated contract value $179B' },
      asOf: '2026-01-28', src: S('General Dynamics FY2025 results', 'https://investorrelations.gd.com/news/press-release-details/2026/General-Dynamics-Reports-Fourth-Quarter-and-Full-Year-2025-Financial-Results/')
    },
    valuation: { evSales: 1.7, pe: 21.7, basis: mcapRatio, note: 'Ratios use market cap; EV not compiled.', asOf: '2026-09-24', src: S('Motley Fool', 'https://www.fool.com/quote/nyse/general-dynamics/gd/') },
    programs: [
      { name: 'Golden Dome space-based interceptor prototype', ref: 'golden-dome', customer: 'US Space Force', role: '1 of 12 awardees (GD Mission Systems)', value: 'Up to $3.2B (pool)', year: 2026, status: 'Prototype', note: 'General Dynamics Mission Systems selected in April 2026.', src: S('MeriTalk, Apr 2026', 'https://www.meritalk.com/articles/space-force-taps-12-companies-for-golden-dome-space-based-interceptor/') },
      { name: 'Columbia and Virginia-class submarines', ref: 'aukus', customer: 'US Navy', role: 'Prime', status: 'Production' },
      { name: '155 mm artillery ramp', ref: 'ukraine', customer: 'US Army', role: 'Prime', status: 'Production' }
    ]
  });

  DTM.add({
    id: 'boeing', name: 'Boeing', domain: 'boeing.com', status: 'public', ticker: 'BA', exchange: 'NYSE',
    hq: 'Arlington, VA', country: 'US', founded: 1916,
    subsegments: ['primes.us'],
    oneLiner: 'Defense, Space & Security builds the F-47, F-15EX, KC-46, MQ-25 and T-7, alongside commercial jets.',
    description: [
      'Boeing Defense, Space & Security (about 30% of revenue) won the Air Force\'s sixth-generation F-47 fighter in 2025 and builds the F-15EX, KC-46 tanker, P-8, MQ-25, T-7A, Apache and Chinook, plus satellites.',
      'Defense revenue rose 14% to $27.2B in 2025 and the segment nearly broke even after heavy fixed-price losses in 2024. Defense backlog is a record $85B.'
    ],
    leadership: [['Kelly Ortberg', 'President & CEO']],
    products: ['F-47', 'F-15EX', 'KC-46', 'MQ-25', 'T-7A', 'MQ-28 Ghost Bat', 'Apache'],
    marketCap: { usdM: 166550, asOf: '2026-09-08', src: S('Yahoo Finance valuation', 'https://au.finance.yahoo.com/quote/BA/community/') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [{ label: 'FY2023', revenue: 77794 }, { label: 'FY2024', revenue: 66517 }, { label: 'FY2025', revenue: 89463 }],
      defenseMix: '~30% (BDS)',
      extra: [{ label: 'BDS revenue', value: '$27.2B', note: 'FY2025, +14%' }, { label: 'BDS operating margin', value: '−0.5%', note: 'FY2025' }],
      backlog: { valueM: 85000, asOf: '2025-12-31', note: 'Defense, Space & Security only' },
      asOf: '2026-01-27', src: S('Boeing Q4 2025 results', 'https://investors.boeing.com/investors/news/press-release-details/2026/Boeing-Reports-Fourth-Quarter-Results/default.aspx')
    },
    valuation: { evUsdM: 192440, evSales: 2.2, basis: 'EV ÷ FY2025 revenue', asOf: '2026-09-08', src: S('Yahoo Finance valuation', 'https://au.finance.yahoo.com/quote/BA/community/') },
    programs: [
      { name: 'F-47 (NGAD)', ref: 'f47', customer: 'US Air Force', role: 'Prime', year: 2025, status: 'Development' },
      { name: 'MQ-28 Ghost Bat', ref: 'cca', customer: 'Royal Australian Air Force', role: 'Prime', status: 'Production' },
      { name: 'KC-46 Pegasus', customer: 'US Air Force', role: 'Prime', status: 'Production', note: 'Q4 2025 included $0.6B of KC-46 losses.' }
    ]
  });

  DTM.add({
    id: 'l3harris', name: 'L3Harris', domain: 'l3harris.com', status: 'public', ticker: 'LHX', exchange: 'NYSE',
    hq: 'Melbourne, FL', country: 'US', founded: 2019,
    subsegments: ['primes.us'],
    oneLiner: 'Tactical radios, EW, space sensors and missile-tracking satellites, plus Aerojet Rocketdyne motors.',
    description: [
      'L3Harris is the main US maker of tactical radios and a major supplier of electronic warfare, ISR sensors and space payloads, including missile-tracking satellites for SDA and MDA. Its Aerojet Rocketdyne unit makes solid rocket motors for Javelin, Stinger, GMLRS and Standard Missile.',
      'Revenue was $21.9B in 2025 and backlog reached about $42B by mid-2026.'
    ],
    leadership: [['Chris Kubasik', 'Chair & CEO']],
    products: ['AN/PRC radios', 'Aerojet SRMs', 'RL10 engine', 'Missile-tracking satellites', 'EW pods'],
    marketCap: { usdM: 44229, asOf: '2026-09-25', src: S('Fintel', 'https://fintel.io/s/us/lhx') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [{ label: 'FY2023', revenue: 19419 }, { label: 'FY2024', revenue: 21325 }, { label: 'FY2025', revenue: 21900 }],
      backlog: { valueM: 42000, asOf: '2026-06-30', note: '$38B+ at end-2025' },
      asOf: '2026-07-24', src: [S('L3Harris FY2025 results', 'https://www.l3harris.com/newsroom/press-release/2026/01/l3harris-technologies-reports-strong-full-year-and-fourth-quarter'), S('TIKR', 'https://www.tikr.com/blog/l3harris-is-up-28-in-the-last-6-months-heres-where-the-stock-could-go-in-2026')]
    },
    valuation: { evSales: 2.0, basis: mcapRatio, note: 'Ratio uses market cap; EV not compiled.', asOf: '2026-09-25', src: S('Fintel', 'https://fintel.io/s/us/lhx') },
    programs: [
      { name: 'Solid rocket motors (Aerojet Rocketdyne)', ref: 'srm', customer: 'US Army / Navy / MDA', role: 'Supplier', status: 'Production' },
      { name: 'SDA Tracking Layer satellites', ref: 'pwsa', customer: 'Space Development Agency', role: 'Prime', status: 'Production' }
    ]
  });

  DTM.add({
    id: 'hii', name: 'HII', domain: 'hii.com', status: 'public', ticker: 'HII', exchange: 'NYSE',
    hq: 'Newport News, VA', country: 'US', founded: 2011,
    subsegments: ['primes.us'],
    oneLiner: 'America\'s largest military shipbuilder: aircraft carriers, submarines, destroyers and REMUS UUVs.',
    description: [
      'HII builds every US Navy aircraft carrier and, with General Dynamics, the Navy\'s nuclear submarines at Newport News, plus destroyers and amphibious ships at Ingalls. Its Mission Technologies unit makes REMUS uncrewed undersea vehicles.',
      'Revenue rose 8% to $12.5B in 2025 with a $53.1B backlog, but the shares fell sharply in 2026.'
    ],
    leadership: [['Chris Kastner', 'President & CEO']],
    products: ['Ford-class carriers', 'Virginia/Columbia submarines', 'DDG-51', 'REMUS UUVs'],
    marketCap: { usdM: 11100, asOf: '2026-09-11', src: S('Yahoo Finance key statistics', 'https://finance.yahoo.com/quote/HII/key-statistics/') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [{ label: 'FY2023', revenue: 11454 }, { label: 'FY2024', revenue: 11535 }, { label: 'FY2025', revenue: 12480 }],
      backlog: { valueM: 53100, asOf: '2025-12-31', note: '$16.9B of 2025 awards' },
      notes: '2026 guidance: shipbuilding revenue $9.7B–$9.9B; Mission Technologies $3.0B–$3.2B.',
      asOf: '2026-02-05', src: S('HII 2025 Annual Report', 'https://s29.q4cdn.com/772422961/files/doc_financials/2025/ar/HII-2025-Annual-Report-Final.pdf')
    },
    valuation: { evSales: 0.9, basis: mcapRatio, note: 'Ratio uses market cap; EV not compiled.', asOf: '2026-09-11', src: S('Yahoo Finance', 'https://finance.yahoo.com/quote/HII/key-statistics/') },
    programs: [{ name: 'Submarine and carrier construction', ref: 'aukus', customer: 'US Navy', role: 'Prime', status: 'Production' }]
  });

  /* ---------------- US mid-tier & integrators ---------------- */
  DTM.add({
    id: 'leidos', name: 'Leidos', domain: 'leidos.com', status: 'public', ticker: 'LDOS', exchange: 'NYSE',
    hq: 'Reston, VA', country: 'US', founded: 1969,
    subsegments: ['primes.midtier'],
    oneLiner: 'Largest government IT and engineering integrator, with Dynetics hypersonics and uncrewed systems.',
    description: [
      'Leidos provides IT, engineering and health services to US government agencies and builds hardware through Dynetics, including hypersonic glide bodies, Enduring Indirect Fires launchers and medium uncrewed surface vessels.'
    ],
    leadership: [['Tom Bell', 'CEO']],
    products: ['Dynetics hypersonics', 'IFPC launcher', 'Sea Hunter / MUSV'],
    marketCap: { usdM: 14390, asOf: '2026-07-29', src: S('Bullfincher', 'https://bullfincher.io/companies/leidos-holdings/market-cap') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [{ label: 'FY2023', revenue: 15438 }, { label: 'FY2024', revenue: 16662 }, { label: 'FY2025', revenue: 17170 }],
      backlog: { valueM: 49000, asOf: '2025-12-31', note: '$9.7B funded; policy change adds sole-source IDIQ' },
      asOf: '2026-02-17', src: S('Leidos FY2025 results', 'https://seekingalpha.com/pr/20400805')
    },
    valuation: { evSales: 0.8, basis: mcapRatio, note: 'Ratio uses market cap; EV not compiled.', asOf: '2026-07-29', src: S('Bullfincher', 'https://bullfincher.io/companies/leidos-holdings/market-cap') },
    programs: [{ name: 'Navy medium USV (Sea Hunter lineage)', ref: 'usv-navy', customer: 'US Navy', role: 'Prime', status: 'Prototype' }]
  });

  DTM.add({
    id: 'caci', name: 'CACI', domain: 'caci.com', status: 'public', ticker: 'CACI', exchange: 'NYSE',
    hq: 'Reston, VA', country: 'US', founded: 1962,
    subsegments: ['primes.midtier'],
    oneLiner: 'Mission IT plus EW, SIGINT and counter-UAS technology for the intelligence community and DoD.',
    description: [
      'CACI combines enterprise and mission IT with a growing hardware and software technology business in electronic warfare, signals intelligence, counter-drone systems and space laser communications.',
      'Fiscal 2026 revenue grew 10.9% to $9.6B, and fiscal 2027 guidance is $10.65B–$10.85B.'
    ],
    leadership: [['John Mengucci', 'President & CEO']],
    products: ['CORIAN EW', 'Optical terminals', 'Counter-UAS kits'],
    marketCap: { usdM: 10770, asOf: '2026-07-29', src: S('Finhacker', 'https://www.finhacker.cz/en/stocks/caci-international-market-cap/') },
    financials: {
      cur: 'USD', fyEnd: 'Jun',
      periods: [{ label: 'FY2024', revenue: 7660 }, { label: 'FY2025', revenue: 8630 }, { label: 'FY2026', revenue: 9600 }],
      backlog: { valueM: 32000, asOf: '2026-06-30', note: '$5.4B funded' },
      asOf: '2026-08-05', src: S('CACI fiscal 2026 results', 'https://www.businesswire.com/news/home/20260805256967/en/')
    },
    valuation: { evSales: 1.1, basis: mcapRatio, note: 'Ratio uses market cap; EV not compiled.', asOf: '2026-07-29', src: S('Finhacker', 'https://www.finhacker.cz/en/stocks/caci-international-market-cap/') },
    programs: []
  });

  DTM.add({
    id: 'booz-allen', name: 'Booz Allen Hamilton', short: 'Booz Allen', domain: 'boozallen.com', status: 'public', ticker: 'BAH', exchange: 'NYSE',
    hq: 'McLean, VA', country: 'US', founded: 1914,
    subsegments: ['primes.midtier'],
    oneLiner: 'Defense and intelligence technology consultancy; active investor in defense startups through Booz Allen Ventures.',
    description: [
      'Booz Allen provides AI, cyber and engineering services to the DoD and intelligence community. Through Booz Allen Ventures it backs many defense tech startups on this map, including Hidden Level, Firestorm, Albedo and Hadean.',
      'Fiscal 2026 revenue fell 6.4% to $11.2B as civil-agency spending cuts hit.'
    ],
    leadership: [['Horacio Rozanski', 'Chairman, President & CEO']],
    products: ['AI & data services', 'Cyber', 'Booz Allen Ventures'],
    marketCap: { usdM: 8600, asOf: '2026-07-28', src: S('Trefis', 'https://www.trefis.com/data/companies/bah') },
    financials: {
      cur: 'USD', fyEnd: 'Mar',
      periods: [{ label: 'FY2024', revenue: 10662 }, { label: 'FY2025', revenue: 11980 }, { label: 'FY2026', revenue: 11217 }],
      asOf: '2026-05-22', src: S('Booz Allen fiscal 2026 results (8-K)', 'https://www.sec.gov/Archives/edgar/data/0001443646/000162828026037519/bahexhibit991q4fy26_fina.htm')
    },
    valuation: { evSales: 0.8, basis: mcapRatio, note: 'Ratio uses market cap; EV not compiled.', asOf: '2026-07-28', src: S('Trefis', 'https://www.trefis.com/data/companies/bah') },
    programs: [
      { name: 'Golden Dome space-based interceptor prototype', ref: 'golden-dome', customer: 'US Space Force', role: '1 of 12 awardees', value: 'Up to $3.2B (pool)', year: 2026, status: 'Prototype', note: 'Selected in April 2026.', src: S('MeriTalk, Apr 2026', 'https://www.meritalk.com/articles/space-force-taps-12-companies-for-golden-dome-space-based-interceptor/') }
    ]
  });

  DTM.add({
    id: 'textron', name: 'Textron', domain: 'textron.com', status: 'public', ticker: 'TXT', exchange: 'NYSE',
    hq: 'Providence, RI', country: 'US', founded: 1923,
    subsegments: ['primes.midtier'],
    oneLiner: 'Bell MV-75 (FLRAA) tiltrotor, Textron Systems drones and vehicles, and Cessna business jets.',
    description: [
      'Textron\'s Bell won the Army\'s Future Long-Range Assault Aircraft with the V-280 Valor, now the MV-75. Textron Systems builds Aerosonde drones, ship-to-shore connectors and ground vehicles, alongside commercial Cessna and Beechcraft aircraft.'
    ],
    products: ['MV-75 (V-280)', 'Aerosonde', 'Ship-to-Shore Connector', 'Ripsaw'],
    marketCap: { usdM: 14990, asOf: '2026-08-19', src: S('Equibles', 'https://equibles.com/stocks/TXT') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [{ label: 'FY2023', revenue: 13683 }, { label: 'FY2024', revenue: 13702 }, { label: 'FY2025', revenue: 14800 }],
      asOf: '2026-02-12', src: S('Textron 10-K', 'https://www.sec.gov/Archives/edgar/data/217346/000021734626000006/txt-20260103.htm')
    },
    valuation: { evSales: 1.0, basis: mcapRatio, note: 'Ratio uses market cap; EV not compiled.', asOf: '2026-08-19', src: S('Equibles', 'https://equibles.com/stocks/TXT') },
    programs: [{ name: 'Future Long-Range Assault Aircraft (MV-75)', customer: 'US Army', role: 'Prime', status: 'Development' }]
  });

  DTM.add({
    id: 'teledyne', name: 'Teledyne', domain: 'teledyne.com', status: 'public', ticker: 'TDY', exchange: 'NYSE',
    hq: 'Thousand Oaks, CA', country: 'US', founded: 1960,
    subsegments: ['primes.midtier'],
    oneLiner: 'Sensors and imaging conglomerate: FLIR thermal cameras, Black Hornet nano-drones and Rogue 1.',
    description: [
      'Teledyne makes digital imaging, instrumentation and defense electronics. Its FLIR unit supplies thermal sensors, the Black Hornet nano-drone and the Rogue 1 loitering munition, and it builds undersea vehicles and space imaging sensors.'
    ],
    products: ['FLIR thermal', 'Black Hornet 4', 'Rogue 1', 'Slocum glider'],
    marketCap: { usdM: 30390, asOf: '2026-07-31', src: S('Public.com', 'https://public.com/stocks/tdy/market-cap') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [{ label: 'FY2023', revenue: 5635.5 }, { label: 'FY2024', revenue: 5670.0 }, { label: 'FY2025', revenue: 6115.4 }],
      asOf: '2026-03-01', src: S('Teledyne 2025 annual report', 'https://www.sec.gov/Archives/edgar/data/1094285/000119312526104206/d113749dars.pdf')
    },
    valuation: { evSales: 5.0, basis: mcapRatio, note: 'Ratio uses market cap; EV not compiled.', asOf: '2026-07-31', src: S('Public.com', 'https://public.com/stocks/tdy/market-cap') },
    programs: [{ name: 'Black Hornet soldier-borne sensor', customer: 'US Army and allies', role: 'Prime', status: 'Fielded' }]
  });

  DTM.add({
    id: 'mercury', name: 'Mercury Systems', short: 'Mercury', domain: 'mrcy.com', status: 'public', ticker: 'MRCY', exchange: 'NASDAQ',
    hq: 'Andover, MA', country: 'US', founded: 1981,
    subsegments: ['primes.midtier'],
    oneLiner: 'Rugged processing, RF and mission computers inside radars, EW systems and missiles.',
    description: [
      'Mercury builds secure processing subsystems, RF and microwave modules and mission computers that sit inside radars, electronic warfare systems, missiles and aircraft for primes.'
    ],
    leadership: [['Bill Ballhaus', 'Chairman & CEO']],
    marketCap: { usdM: 5320, asOf: '2026-08-28', src: S('Motley Fool', 'https://www.fool.com/quote/nasdaq/mrcy/') },
    financials: {
      cur: 'USD', fyEnd: 'Jun',
      periods: [{ label: 'FY2024', revenue: 835 }, { label: 'FY2025', revenue: 912 }, { label: 'FY2026', revenue: 984, netIncome: -30 }],
      asOf: '2026-08-18', src: S('Mercury fiscal 2026 results (8-K)', 'https://www.sec.gov/Archives/edgar/data/0001049521/000104952126000043/a2026q4earningsreleaseex.htm')
    },
    valuation: { evSales: 5.4, basis: mcapRatio, note: 'Ratio uses market cap; EV not compiled.', asOf: '2026-08-28', src: S('Motley Fool', 'https://www.fool.com/quote/nasdaq/mrcy/') },
    programs: []
  });

  /* ---------------- European primes ---------------- */
  DTM.add({
    id: 'bae-systems', name: 'BAE Systems', domain: 'baesystems.com', status: 'public', ticker: 'BA.', exchange: 'LSE',
    hq: 'London', country: 'UK', founded: 1999,
    subsegments: ['primes.europe'],
    oneLiner: 'Europe\'s largest defense company: Typhoon and GCAP, submarines, combat vehicles, munitions and EW.',
    description: [
      'BAE Systems builds the UK\'s nuclear submarines and Type 26 frigates, Eurofighter Typhoon and the GCAP sixth-generation fighter with Italy and Japan, artillery and combat vehicles, and electronic warfare systems for US aircraft through BAE Systems Inc.',
      'Sales rose 10% to a record £30.7B in 2025, with an £83.6B order backlog.'
    ],
    leadership: [['Charles Woodburn', 'CEO']],
    products: ['Typhoon', 'GCAP / Tempest', 'Astute & Dreadnought', 'CV90', 'M109', 'AMPV'],
    marketCap: { usdM: 76400, local: { cur: 'GBP', valueM: 57000 }, asOf: '2026-09-15', src: S('Rankia', 'https://www.rankia.com/acciones/bae-systems-ba') },
    financials: {
      cur: 'GBP', fyEnd: 'Dec',
      periods: [{ label: 'FY2023', revenue: 25284 }, { label: 'FY2024', revenue: 28300 }, { label: 'FY2025', revenue: 30662, opIncome: 3322, fcf: 2158 }],
      backlog: { valueM: 83600, asOf: '2025-12-31', note: 'Order intake £36.8B' },
      notes: 'Sales are the company\'s alternative performance measure, including joint ventures. Operating income shown is underlying EBIT.',
      asOf: '2026-02-18', src: S('BAE Systems 2025 full year results', 'https://www.baesystems.com/en/article/2025-full-year-results')
    },
    valuation: { evSales: 1.9, basis: mcapRatio, note: 'Ratio uses market cap; EV not compiled. Market cap is an estimate from a 1,940p share price.', asOf: '2026-09-15', src: S('Rankia', 'https://www.rankia.com/acciones/bae-systems-ba') },
    programs: [
      { name: 'AUKUS SSN and Dreadnought submarines', ref: 'aukus', customer: 'Royal Navy / RAN', role: 'Prime', status: 'Production' },
      { name: 'GCAP sixth-generation fighter', customer: 'UK, Italy, Japan', role: 'Prime', status: 'Development' }
    ]
  });

  DTM.add({
    id: 'rheinmetall', name: 'Rheinmetall', domain: 'rheinmetall.com', status: 'public', ticker: 'RHM', exchange: 'XETRA',
    hq: 'Düsseldorf', country: 'DE', founded: 1889,
    subsegments: ['primes.europe'],
    oneLiner: 'Europe\'s ammunition and land-systems champion: 155 mm shells, Lynx, Boxer, air defense and naval.',
    description: [
      'Rheinmetall is Europe\'s largest ammunition producer and builds Lynx and Boxer vehicles, Skyranger air defense, weapons and digitization systems. It has expanded into naval shipbuilding and satellites (with ICEYE) and has a missile JV with Destinus.',
      'Defense sales rose 29% to €9.9B in 2025 with a record €63.8B backlog. It guides to 40–45% growth in 2026. The shares fell sharply from their 2025 highs to about €1,000 in September 2026.'
    ],
    leadership: [['Armin Papperger', 'CEO']],
    products: ['155 mm ammunition', 'Lynx KF41', 'Boxer', 'Skyranger', 'Panther KF51'],
    marketCap: { usdM: 53100, local: { cur: 'EUR', valueM: 45800 }, asOf: '2026-09-14', src: S('Finanztrends (share price €998)', 'https://www.finanztrends.de/rheinmetall-aktie-neuer-schwung-fuer-den-anstieg/') },
    financials: {
      cur: 'EUR', fyEnd: 'Dec',
      periods: [{ label: 'FY2024', revenue: 7715 }, { label: 'FY2025', revenue: 9935, opIncome: 1841, netIncome: 696 }],
      backlog: { valueM: 63800, asOf: '2025-12-31', note: 'Record, +36%' },
      notes: 'Figures are for continuing (defense) operations. 2026 guidance: sales of €14.0B–€14.5B.',
      asOf: '2026-03-11', src: S('Rheinmetall annual report 2025', 'https://www.rheinmetall.com/en/media/news-watch/news/2026/03/2026-03-11-rheinmetall-presents-annual-report-for-2025')
    },
    valuation: { evSales: 4.6, pe: 65.8, peBasis: 'FY2025 net income', basis: mcapRatio, note: 'Market cap is our estimate: ~€998 share price × ~45.8M shares. EV not compiled.', asOf: '2026-09-14', src: S('Finanztrends', 'https://www.finanztrends.de/rheinmetall-aktie-neuer-schwung-fuer-den-anstieg/') },
    programs: [
      { name: '155 mm ammunition for Ukraine and NATO', ref: 'ukraine', customer: 'Germany / Ukraine / NATO', role: 'Prime', status: 'Production' },
      { name: 'Bundeswehr SAR satellites (with ICEYE)', customer: 'German Armed Forces', role: 'Prime', value: '≈$1.9B', status: 'Production' }
    ]
  });

  DTM.add({
    id: 'thales', name: 'Thales', domain: 'thalesgroup.com', status: 'public', ticker: 'HO', exchange: 'Euronext Paris',
    hq: 'Paris', country: 'FR', founded: 1893,
    subsegments: ['primes.europe'],
    oneLiner: 'French defense electronics leader: radars, sonars, secure comms, air defense and space.',
    description: [
      'Thales supplies radars, sonars, electronic warfare, secure communications, air defense missiles and avionics, and co-owns Thales Alenia Space. It also has large civil aerospace and cybersecurity businesses.',
      'Sales grew 7.6% to €22.1B in 2025 and its order book reached a record of over €53B.'
    ],
    leadership: [['Patrice Caine', 'Chairman & CEO']],
    products: ['Ground Master radars', 'Captas sonar', 'Starstreak / LMM', 'SYRACUSE satcom'],
    marketCap: { usdM: 59500, local: { cur: 'EUR', valueM: 51320 }, asOf: '2026-08-27', src: S('MarketScreener', 'https://www.marketscreener.com/quote/stock/THALES-8357729/') },
    financials: {
      cur: 'EUR', fyEnd: 'Dec',
      periods: [{ label: 'FY2023', revenue: 18428 }, { label: 'FY2024', revenue: 20577 }, { label: 'FY2025', revenue: 22136 }],
      backlog: { valueM: 53000, asOf: '2025-12-31', note: 'Record; order intake €25.3B' },
      asOf: '2026-03-04', src: S('Thales 2025 full-year results', 'https://www.thalesgroup.com/en/news-centre/press-releases/thales-reports-its-2025-full-year-results')
    },
    valuation: { evSales: 2.3, basis: mcapRatio, note: 'Ratio uses market cap; EV not compiled.', asOf: '2026-08-27', src: S('MarketScreener', 'https://www.marketscreener.com/quote/stock/THALES-8357729/') },
    programs: []
  });

  DTM.add({
    id: 'leonardo', name: 'Leonardo', domain: 'leonardo.com', status: 'public', ticker: 'LDO', exchange: 'Borsa Italiana',
    hq: 'Rome', country: 'IT', founded: 1948,
    subsegments: ['primes.europe'],
    oneLiner: 'Italian helicopters, defense electronics, GCAP partner and majority owner of Leonardo DRS.',
    description: [
      'Leonardo builds AW helicopters, defense electronics and space systems and is Italy\'s partner in GCAP. It owns a majority of US-listed Leonardo DRS and is forming a land-systems JV with Rheinmetall.',
      'Revenues grew about 11% to €19.5B in 2025, with a €46.6B order backlog.'
    ],
    leadership: [['Roberto Cingolani', 'CEO']],
    products: ['AW149 / AW101', 'M-346', 'GCAP', 'Leonardo DRS'],
    marketCap: { usdM: 33800, local: { cur: 'EUR', valueM: 29150 }, asOf: '2026-09-16', src: S('Economia Italia', 'https://finanza.economia-italia.com/azioni-leonardo-finantieri-17-settembre-2026') },
    financials: {
      cur: 'EUR', fyEnd: 'Dec',
      periods: [{ label: 'FY2023', revenue: 15291 }, { label: 'FY2024', revenue: 17763 }, { label: 'FY2025', revenue: 19500 }],
      backlog: { valueM: 46624, asOf: '2025-12-31', note: '~2.4 years of production' },
      asOf: '2026-03-12', src: S('Leonardo FY2025 results', 'https://www.leonardo.com/en/press-release-detail/-/detail/12-03-2026-leonardo-board-of-directors-approves-fy2025-results-and-2026-guidance')
    },
    valuation: { evSales: 1.5, basis: mcapRatio, note: 'Ratio uses market cap; EV not compiled.', asOf: '2026-09-16', src: S('Economia Italia', 'https://finanza.economia-italia.com/azioni-leonardo-finantieri-17-settembre-2026') },
    programs: []
  });

  DTM.add({
    id: 'saab', name: 'Saab', domain: 'saab.com', status: 'public', ticker: 'SAAB B', exchange: 'Nasdaq Stockholm',
    hq: 'Stockholm', country: 'SE', founded: 1937,
    subsegments: ['primes.europe'],
    oneLiner: 'Gripen fighters, GlobalEye, Carl-Gustaf and NLAW, A26 submarines and Giraffe radars.',
    description: [
      'Saab builds the Gripen fighter, GlobalEye airborne early warning aircraft, Carl-Gustaf and NLAW anti-armor weapons, A26 submarines and Giraffe radars, and is a key supplier to Ukraine and new NATO member Sweden.',
      'Order bookings rose 74% to a record SEK 168.5B in 2025, lifting the backlog to SEK 274.5B.'
    ],
    leadership: [['Micael Johansson', 'President & CEO']],
    products: ['Gripen E', 'GlobalEye', 'Carl-Gustaf', 'NLAW', 'A26 submarine', 'Giraffe radar'],
    marketCap: { usdM: 36200, local: { cur: 'SEK', valueM: 344500 }, asOf: '2026-08-28', src: S('MarketScreener', 'https://www.marketscreener.com/quote/stock/SAAB-AB-6491624/') },
    financials: {
      cur: 'SEK', fyEnd: 'Dec',
      periods: [{ label: 'FY2023', revenue: 51609 }, { label: 'FY2024', revenue: 63750 }, { label: 'FY2025', revenue: 79100, opIncome: 7700 }],
      backlog: { valueM: 274500, asOf: '2025-12-31', note: 'Order bookings SEK 168.5B (+74%)' },
      asOf: '2026-02-05', src: S('Saab year-end report 2025', 'https://www.saab.com/globalassets/cision/documents/2026/20260205-saab-year-end-report-2025record-order-bookings-building-for-growth-en-1-5300016.pdf')
    },
    valuation: { evSales: 4.4, basis: mcapRatio, note: 'Ratio uses market cap; EV not compiled.', asOf: '2026-08-28', src: S('MarketScreener', 'https://www.marketscreener.com/quote/stock/SAAB-AB-6491624/') },
    programs: [{ name: 'Carl-Gustaf and NLAW for Ukraine', ref: 'ukraine', customer: 'Ukraine / donors', role: 'Supplier', status: 'Fielded' }]
  });

  DTM.add({
    id: 'kongsberg', name: 'Kongsberg', domain: 'kongsberg.com', status: 'public', ticker: 'KOG', exchange: 'Oslo Børs',
    hq: 'Kongsberg', country: 'NO', founded: 1814,
    subsegments: ['primes.europe'],
    oneLiner: 'Naval Strike Missile, NASAMS air defense and Protector weapon stations; owns most of Zone 5.',
    description: [
      'Kongsberg Defence & Aerospace makes the Naval Strike Missile and Joint Strike Missile, co-develops NASAMS air defense with RTX, and builds Protector remote weapon stations used by the US Army. It acquired 90% of US low-cost missile maker Zone 5 Technologies in December 2025.',
      'The group spun off Kongsberg Maritime as a separate listed company in April 2026. Order backlog exceeded NOK 157B at the end of 2025.'
    ],
    products: ['NASAMS', 'Naval Strike Missile', 'Joint Strike Missile', 'Protector RWS'],
    marketCap: { usdM: 27910, local: { cur: 'NOK', valueM: 279100 }, asOf: '2026-08', src: S('CompaniesMarketCap', 'https://companiesmarketcap.com/kongsberg-gruppen/marketcap/') },
    financials: {
      cur: 'NOK', fyEnd: 'Dec',
      periods: [{ label: 'FY2024', revenue: 48300 }, { label: 'Q4 2025', revenue: 16776 }],
      backlog: { valueM: 157000, asOf: '2025-12-31', note: 'Pre-demerger group, including Maritime' },
      notes: 'Pre-demerger figures include Kongsberg Maritime, which was spun off in April 2026.',
      asOf: '2026-02-10', src: S('Kongsberg Q4 2025 results', 'https://www.kongsberg.com/news/news-archive/2026/q4-2025/')
    },
    valuation: { note: 'Post-demerger market cap; pre-demerger revenue is not comparable.', asOf: '2026-08', src: S('CompaniesMarketCap', 'https://companiesmarketcap.com/kongsberg-gruppen/marketcap/') },
    programs: [{ name: 'NASAMS for Ukraine and allies', ref: 'ukraine', customer: 'Ukraine / NATO', role: 'Prime (with RTX)', status: 'Production' }]
  });

  DTM.add({
    id: 'hensoldt', name: 'Hensoldt', domain: 'hensoldt.net', status: 'public', ticker: 'HAG', exchange: 'XETRA',
    hq: 'Taufkirchen', country: 'DE', founded: 2017,
    subsegments: ['primes.europe'],
    oneLiner: 'German sensor house: TRML-4D air-defense radars, EW and optronics.',
    description: [
      'Hensoldt, carved out of Airbus in 2017, makes radars including the TRML-4D used with IRIS-T in Ukraine, electronic warfare systems and optronics.',
      'Revenue reached about €2.46B in 2025, and its backlog grew to around €10B by mid-2026.'
    ],
    leadership: [['Oliver Dörre', 'CEO']],
    products: ['TRML-4D', 'Kalaetron EW', 'PEGASUS SIGINT'],
    marketCap: { usdM: 11500, local: { cur: 'EUR', valueM: 9900 }, asOf: '2026-08-05', src: S('Google Finance', 'https://www.google.com/finance/quote/1HENS:BIT') },
    financials: {
      cur: 'EUR', fyEnd: 'Dec',
      periods: [{ label: 'FY2023', revenue: 1850 }, { label: 'FY2024', revenue: 2240 }, { label: 'FY2025', revenue: 2460 }],
      backlog: { valueM: 10000, asOf: '2026-06-30', note: 'About €10B' },
      asOf: '2026-07-31', src: S('StockAnalysis', 'https://stockanalysis.com/quote/fra/HAG0/')
    },
    valuation: { evSales: 4.0, basis: mcapRatio, note: 'Ratio uses market cap; EV not compiled.', asOf: '2026-08-05', src: S('Google Finance', 'https://www.google.com/finance/quote/1HENS:BIT') },
    programs: [{ name: 'TRML-4D radars for Ukraine', ref: 'ukraine', customer: 'Ukraine / Germany', role: 'Supplier', status: 'Fielded' }]
  });

  /* ---------------- Israel & Asia-Pacific ---------------- */
  DTM.add({
    id: 'elbit', name: 'Elbit Systems', short: 'Elbit', domain: 'elbitsystems.com', status: 'public', ticker: 'ESLT', exchange: 'NASDAQ / TASE',
    hq: 'Haifa', country: 'IL', founded: 1966,
    subsegments: ['primes.apac'],
    oneLiner: 'Israel\'s largest listed defense company: drones, artillery, EW, munitions and the Iron Beam laser.',
    description: [
      'Elbit builds Hermes drones, artillery and rocket systems, electronic warfare, night vision and munitions, and is a partner on the Iron Beam high-energy laser. Wartime demand and European orders have driven record backlog.',
      'Revenue rose 16% to $7.9B in 2025 and backlog reached about $32B by mid-2026.'
    ],
    leadership: [['Bezhalel Machlis', 'President & CEO']],
    products: ['Hermes 900', 'PULS', 'Iron Beam (with Rafael)', 'SkyStriker'],
    marketCap: { usdM: 32700, local: { cur: 'ILS', valueM: 121000 }, asOf: '2026-08-15', src: S('Globes', 'https://en.globes.co.il/en/article-1001551938') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [{ label: 'FY2023', revenue: 5975 }, { label: 'FY2024', revenue: 6828 }, { label: 'FY2025', revenue: 7900 }],
      backlog: { valueM: 32000, asOf: '2026-06-30', note: '$28.1B at end-2025' },
      asOf: '2026-08-15', src: [S('Elbit Q1 2026 investor deck', 'https://www.elbitsystems.com/sites/default/files/2026-05/investor_deck_q1_2026_0.pdf'), S('Globes', 'https://en.globes.co.il/en/article-1001551938')]
    },
    valuation: { evSales: 4.1, basis: mcapRatio, note: 'Ratio uses market cap; EV not compiled.', asOf: '2026-08-15', src: S('Globes', 'https://en.globes.co.il/en/article-1001551938') },
    programs: [{ name: 'Iron Beam high-energy laser', customer: 'Israel MoD', role: 'Partner (with Rafael)', status: 'Initial operations' }]
  });

  DTM.add({
    id: 'hanwha-aerospace', name: 'Hanwha Aerospace', domain: 'hanwhaaerospace.com', status: 'public', ticker: '012450', exchange: 'KRX',
    hq: 'Changwon', country: 'KR', founded: 1977,
    subsegments: ['primes.apac'],
    oneLiner: 'K9 howitzers, Redback IFVs and Chunmoo rockets for Europe and Australia; controls Hanwha Ocean shipyards.',
    description: [
      'Hanwha Aerospace builds the K9 self-propelled howitzer, Chunmoo multiple rocket launcher and Redback infantry fighting vehicle, with major export wins in Poland, Australia and Romania, and makes aircraft engines. Consolidating Hanwha Ocean added large naval shipbuilding revenue in 2025.',
      'It also owns Philly Shipyard in the US and has invested in US defense startups including Firehawk.'
    ],
    products: ['K9 Thunder', 'Chunmoo', 'Redback', 'KSS-III submarines (Hanwha Ocean)'],
    marketCap: { usdM: 37500, local: { cur: 'KRW', valueM: 51810000 }, asOf: '2026-08-05', src: S('Investing.com', 'https://www.investing.com/equities/samsung-techwin') },
    financials: {
      cur: 'KRW', fyEnd: 'Dec',
      periods: [{ label: 'FY2023', revenue: 7890000 }, { label: 'FY2024', revenue: 11240000 }, { label: 'FY2025', revenue: 26600000, opIncome: 3030000 }],
      notes: 'FY2025 includes Hanwha Ocean consolidation. FY2025 actuals are from a secondary profile; check the DART filing.',
      asOf: '2026-03-31', src: [S('Robotics.press profile', 'https://www.robotics.press/news/hanwha-aerospace-company-profile/'), S('Daishin Securities', 'https://money2.daishin.com/m_file/file/271/53213_Daishin%20Securities_Hanwha%20Aerospace%20(012450%20KS%20Apr%209,%202025).pdf')]
    },
    valuation: { evSales: 1.9, basis: mcapRatio, note: 'Ratio uses market cap; EV not compiled.', asOf: '2026-08-05', src: S('Investing.com', 'https://www.investing.com/equities/samsung-techwin') },
    programs: [{ name: 'K9 and Chunmoo for Poland', customer: 'Polish Armed Forces', role: 'Prime', status: 'Delivering' }]
  });

  DTM.add({
    id: 'mitsubishi-heavy', name: 'Mitsubishi Heavy Industries', short: 'MHI', domain: 'mhi.com', status: 'public', ticker: '7011', exchange: 'TSE',
    hq: 'Tokyo', country: 'JP', founded: 1884,
    subsegments: ['primes.apac'],
    oneLiner: 'Japan\'s largest defense contractor: standoff missiles, frigates, submarines, GCAP and space launch.',
    description: [
      'MHI is Japan\'s top defense contractor, building Type 12 standoff missiles, Mogami-class frigates (chosen for Australia\'s general-purpose frigate program), submarines and the H3 rocket, and is Japan\'s lead on GCAP.',
      'Its Aircraft, Defense & Space segment is forecast to reach ¥1.5T of revenue in fiscal 2026 as Japan doubles defense spending.'
    ],
    products: ['Type 12 SSM (upgraded)', 'Mogami-class frigate', 'Taigei submarine', 'H3 rocket'],
    marketCap: { usdM: 107500, local: { cur: 'JPY', valueM: 16118532 }, asOf: '2026-04-30', src: S('Fintel', 'https://fintel.io/s/jp/7011') },
    financials: {
      cur: 'JPY', fyEnd: 'Mar',
      periods: [{ label: 'FY2023', revenue: 4657100 }, { label: 'FY2024', revenue: 5027100 }],
      notes: 'Fiscal years end in March. Nine-month FY2025 revenue was ¥3.33T (+9.2%) and order intake ¥5.03T (+12.6%).',
      asOf: '2026-02-04', src: S('MHI FY2025 Q3 results', 'https://www.mhi.com/news/pdf/fy20253q_press_release.pdf')
    },
    valuation: { evSales: 3.2, basis: mcapRatio, note: 'Ratio uses market cap; EV not compiled.', asOf: '2026-04-30', src: S('Fintel', 'https://fintel.io/s/jp/7011') },
    programs: [{ name: 'Mogami-class frigates for Australia', customer: 'Royal Australian Navy', role: 'Prime', year: 2025, status: 'Contracting' }]
  });
})();
