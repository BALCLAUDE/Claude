/* Defense Software & AI segment. Anduril is defined here and appears across many segments. */
(function () {
  const S = (t, u) => (u ? { t, u } : { t });

  /* ---------------- C2 & battle management ---------------- */
  DTM.add({
    id: 'anduril', name: 'Anduril Industries', short: 'Anduril', domain: 'anduril.com', status: 'private', stage: 'Series H',
    hq: 'Costa Mesa, CA', country: 'US', founded: 2017,
    subsegments: ['software.c2', 'uas.cca', 'uas.small', 'missiles.strike', 'missiles.propulsion', 'cuas.kinetic', 'maritime.uuv', 'space.sda'],
    oneLiner: 'The defining new prime: Lattice C2 software plus autonomous aircraft, interceptors, missiles, subs and rocket motors.',
    description: [
      'Anduril builds hardware products on top of a common software layer, Lattice, which fuses sensors and controls autonomous systems. Its portfolio spans the Fury (FQ-44) collaborative combat aircraft, Roadrunner and Anvil interceptors, Barracuda cruise missiles, Ghost and Altius drones, Dive-LD and Ghost Shark undersea vehicles, solid rocket motors and space surveillance.',
      'Revenue doubled to $2.2B in 2025. In May 2026 it raised a $5B Series H at $61B, led by Thrive Capital and Andreessen Horowitz, to fund manufacturing including the Arsenal-1 factory in Columbus, Ohio. Reports in July 2026 described talks at about $100B. In June 2026 the Air Force awarded Fury a CCA Increment 1 production contract.'
    ],
    leadership: [['Brian Schimpf', 'Co-founder & CEO'], ['Palmer Luckey', 'Founder'], ['Trae Stephens', 'Co-founder & Executive Chairman']],
    products: ['Lattice', 'Fury (FQ-44)', 'Roadrunner', 'Anvil', 'Barracuda', 'Altius', 'Ghost', 'Dive-LD', 'Ghost Shark', 'Sentry'],
    funding: {
      totalUsdM: 11300, asOf: '2026-05',
      rounds: [
        { date: '2022-12', type: 'Series E', amountUsdM: 1480, postUsdM: 8480, leads: ['Valor Equity Partners'] },
        { date: '2024-08', type: 'Series F', amountUsdM: 1500, postUsdM: 14000, leads: ['Founders Fund', 'Sands Capital'] },
        { date: '2025-06', type: 'Series G', amountUsdM: 2500, postUsdM: 30500, leads: ['Founders Fund'] },
        { date: '2026-05', type: 'Series H', amountUsdM: 5000, postUsdM: 61000, leads: ['Thrive Capital', 'Andreessen Horowitz'] }
      ],
      investors: ['Founders Fund', 'Thrive Capital', 'Andreessen Horowitz', 'General Catalyst', 'Valor Equity Partners', '8VC', 'Lux Capital'],
      note: 'Totals vary by tracker ($6.8B–$12.7B); about $11.3B across rounds is shown.',
      src: [S('TechCrunch, May 2026', 'https://techcrunch.com/2026/05/13/anduril-raises-5b-doubles-valuation-to-61b/'), S('Gunderson Dettmer', 'https://www.gunder.com/en/news-insights/client-news/anduril-raises-5-billion-usd-series-h-at-61-billion-usd-valuation')]
    },
    revenue: { valueUsdM: 2200, period: 'FY2025', kind: 'reported', note: 'Disclosed by CEO; about $1B in 2024. Sacra estimates a $4.3B 2026 plan.', src: S('TechCrunch, May 2026', 'https://techcrunch.com/2026/05/13/anduril-raises-5b-doubles-valuation-to-61b/') },
    programs: [
      { name: 'CCA Increment 1 production (FQ-44 Fury)', ref: 'cca', customer: 'US Air Force', role: 'Prime', year: 2026, status: 'Production', note: 'Value and quantity not disclosed.', src: S('The Aviationist', 'https://theaviationist.com/2026/09/16/andurils-yfq-44a-fury-air-to-ground-munitions/') },
      { name: 'Next Generation Command and Control', ref: 'ngc2', customer: 'US Army', role: 'Prime', year: 2025, status: 'Prototype' },
      { name: 'Soldier Borne Mission Command (formerly IVAS)', customer: 'US Army', role: 'Prime', year: 2025, status: 'Development' },
      { name: 'Counter-drone systems (Roadrunner, Anvil, Lattice)', ref: 'cuas-army', customer: 'USMC / SOCOM / US Army', role: 'Prime', status: 'Fielding' },
      { name: 'Barracuda for the Enterprise Test Vehicle', ref: 'etv', customer: 'US Air Force', role: 'Prime', status: 'Prototype' },
      { name: 'Golden Dome space-based interceptor prototype', ref: 'golden-dome', customer: 'US Space Force', role: '1 of 12 awardees', value: 'Up to $3.2B (pool)', year: 2026, status: 'Prototype', note: 'Also leads an industry team including K2 Space and Impulse Space.', src: S('MeriTalk, Apr 2026', 'https://www.meritalk.com/articles/space-force-taps-12-companies-for-golden-dome-space-based-interceptor/') },
      { name: 'Altius and Ghost-X under Replicator', ref: 'replicator', customer: 'DIU', role: 'Supplier', status: 'Fielded' },
      { name: 'Ghost Shark XL-AUV', customer: 'Royal Australian Navy', role: 'Prime', status: 'Production' }
    ]
  });

  DTM.add({
    id: 'palantir', name: 'Palantir', domain: 'palantir.com', status: 'public', ticker: 'PLTR', exchange: 'NASDAQ',
    hq: 'Denver, CO', country: 'US', founded: 2003,
    subsegments: ['software.c2', 'software.intel'],
    oneLiner: 'Data and AI platforms (Gotham, Foundry, AIP, Maven) running targeting, logistics and decisions across DoD.',
    description: [
      'Palantir builds software platforms that integrate data and AI for decision making. Gotham and the Maven Smart System are used for targeting and situational awareness across the US military and allies, and AIP brings large language models into operational workflows.',
      'It is the most valuable US defense technology company. US government revenue grew 55% to $1.86B in 2025, and an Army enterprise agreement consolidated dozens of contracts into a single vehicle worth up to $10B over ten years.'
    ],
    leadership: [['Alex Karp', 'Co-founder & CEO'], ['Shyam Sankar', 'CTO']],
    products: ['Gotham', 'Foundry', 'AIP', 'Maven Smart System', 'TITAN', 'Apollo'],
    marketCap: { usdM: 432410, asOf: '2026-08-21', src: S('Equibles', 'https://equibles.com/stocks/pltr/summary') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [
        { label: 'FY2023', revenue: 2225, netIncome: 210 },
        { label: 'FY2024', revenue: 2866, netIncome: 462 },
        { label: 'FY2025', revenue: 4475, netIncome: 1625 }
      ],
      defenseMix: '≈41% (US gov.)',
      extra: [{ label: 'Adj. operating margin', value: '50%', note: 'FY2025' }, { label: '2026 revenue guidance', value: '$7.18B–$7.20B', note: '≈61% growth' }],
      notes: 'FY2025 US government revenue was $1.855B (+55%); adjusted operating income $2.254B.',
      asOf: '2026-02-02', src: S('Palantir Q4 2025 results (8-K)', 'https://www.sec.gov/Archives/edgar/data/1321655/000132165526000004/a2025q4ex991earningsrelease.htm')
    },
    valuation: { evUsdM: 430000, evSales: 96, pe: 266, peBasis: 'FY2025 GAAP net income', basis: 'EV ÷ FY2025 revenue', note: 'EV estimated as market cap less ~$2.3B of cash (no debt). On 2026 guidance the multiple is about 60×.', asOf: '2026-08-21', src: [S('Equibles', 'https://equibles.com/stocks/pltr/summary'), S('TIKR', 'https://www.tikr.com/blog/palantir-stock-has-dropped-31-from-its-peak-heres-where-pltr-could-go-in-2026')] },
    programs: [
      { name: 'Maven Smart System', ref: 'maven', customer: 'DoD / NGA / combatant commands', role: 'Prime', status: 'Operational', note: 'Contract ceiling raised in 2025 to meet demand.' },
      { name: 'Army Enterprise Agreement', customer: 'US Army', role: 'Prime', value: 'Up to $10B', year: 2025, status: 'Active', note: 'Ten-year agreement consolidating software contracts.' },
      { name: 'TITAN ground station', customer: 'US Army', role: 'Prime', value: '$178M', year: 2024, status: 'Prototype' },
      { name: 'Next Generation C2 (Anduril team)', ref: 'ngc2', customer: 'US Army', role: 'Teammate', status: 'Prototype' }
    ]
  });

  /* ---------------- Intelligence & data fusion ---------------- */
  DTM.add({
    id: 'scale-ai', name: 'Scale AI', short: 'Scale AI', domain: 'scale.com', status: 'private', stage: 'Strategic',
    hq: 'San Francisco, CA', country: 'US', founded: 2016,
    subsegments: ['software.intel', 'software.c2'],
    oneLiner: 'AI data and evaluation company whose public sector arm builds agentic AI for military planning (Thunderforge).',
    description: [
      'Scale AI provides training data, evaluation and AI deployment services, and its public sector business works with the DoD on AI test and evaluation and on Thunderforge, a DIU program bringing AI agents into military planning.',
      'In June 2025 Meta invested about $14.3B for a 49% non-voting stake, valuing Scale at about $29B, and founder Alexandr Wang moved to Meta.'
    ],
    leadership: [['Jason Droege', 'CEO']],
    products: ['Scale Data Engine', 'Donovan', 'Scale Evaluation'],
    funding: {
      totalUsdM: 15900, asOf: '2025-06',
      rounds: [
        { date: '2024-05', type: 'Series F', amountUsdM: 1000, postUsdM: 13800, leads: ['Accel'] },
        { date: '2025-06', type: 'Strategic', amountUsdM: 14300, postUsdM: 29000, leads: ['Meta'] }
      ],
      investors: ['Meta', 'Accel', 'Founders Fund', 'Index Ventures', 'Thrive Capital', 'Amazon', 'NVIDIA'],
      note: 'Meta\'s investment bought a 49% non-voting stake. Total is approximate.',
      src: S('Mexico Business News', 'https://mexicobusiness.news/cloudanddata/news/meta-backs-scale-ai-boosting-its-us29-billion-valuation')
    },
    programs: [{ name: 'Thunderforge AI planning', customer: 'DIU / INDOPACOM / EUCOM', role: 'Prime', year: 2025, status: 'Prototype' }]
  });

  DTM.add({
    id: 'vannevar-labs', name: 'Vannevar Labs', short: 'Vannevar', domain: 'vannevarlabs.com', status: 'private', stage: 'Series B',
    hq: 'Arlington, VA', country: 'US', founded: 2019,
    subsegments: ['software.intel'],
    oneLiner: 'AI for foreign-language open-source intelligence and strategic competition analysis.',
    description: [
      'Vannevar Labs builds software that collects and analyzes foreign-language open-source and commercial data with AI, helping US national security analysts track adversary activity, influence operations and economic coercion.'
    ],
    leadership: [['Brett Granberg', 'Co-founder & CEO'], ['Nini Hamrick', 'Co-founder & President']],
    funding: {
      totalUsdM: 92, asOf: '2023-01',
      rounds: [{ date: '2023-01', type: 'Series B', amountUsdM: 75, leads: ['Felicis'] }],
      investors: ['Felicis'],
      note: 'Some trackers report about $255M raised and a $1.2B–$1.5B valuation, but no later priced round has been confirmed.',
      src: S('Komo', 'https://komo.ai/directory/vannevar-labs')
    },
    programs: []
  });

  DTM.add({
    id: 'bigbear-ai', name: 'BigBear.ai', domain: 'bigbear.ai', status: 'public', ticker: 'BBAI', exchange: 'NYSE',
    hq: 'Columbia, MD', country: 'US', founded: 2020,
    subsegments: ['software.intel', 'software.logistics'],
    oneLiner: 'AI decision-intelligence for defense, border security and supply chains; acquired Ask Sage.',
    description: [
      'BigBear.ai sells AI analytics for national security, including computer vision and biometrics for border and travel security, and supply chain and logistics forecasting for defense customers.',
      'It agreed to acquire Ask Sage, a generative AI platform widely used across government, in November 2025.'
    ],
    leadership: [['Kevin McAleenan', 'CEO']],
    products: ['ConductorOS', 'Ask Sage', 'veriScan', 'ProModel'],
    marketCap: { usdM: 1540, asOf: '2026-09-11', src: S('Syfe', 'https://www.syfe.com/stocks/us/BBAI') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [{ label: 'FY2023', revenue: 155.2 }, { label: 'FY2024', revenue: 158.2 }],
      notes: '2025 guidance was revenue of $125M–$140M (Q3 2025 release).',
      asOf: '2025-11-10', src: S('BigBear.ai Q3 2025 results', 'https://ir.bigbear.ai/sec-filings/all-sec-filings/content/0001836981-25-000025/earningsrelease-3q25.htm')
    },
    valuation: { evSales: 11.6, basis: 'Market cap ÷ 2025 guidance midpoint', note: 'EV not compiled; ratio shown uses market cap.', asOf: '2026-09-11', src: S('Syfe', 'https://www.syfe.com/stocks/us/BBAI') },
    programs: []
  });

  /* ---------------- Digital engineering & simulation ---------------- */
  DTM.add({
    id: 'istari', name: 'Istari Digital', short: 'Istari', domain: 'istaridigital.com', status: 'private', stage: 'Series A',
    hq: '', country: 'US', founded: 2020,
    subsegments: ['software.engineering'],
    oneLiner: 'Digital engineering platform linking models and simulations so weapons can be certified faster.',
    description: [
      'Istari connects engineering models, simulations and test data across tools and contractors so that defense systems can be designed, verified and certified digitally. It has a $19M Air Force contract.'
    ],
    leadership: [['Will Roper', 'Co-founder & CEO']],
    funding: {
      totalUsdM: 40, asOf: '2025-01',
      rounds: [
        { date: '2023-02', type: 'Seed', amountUsdM: 13 },
        { date: '2025-01', type: 'Series A', amountUsdM: 27 }
      ],
      note: 'The 2025 Series A is listed by CB Insights but not confirmed by the company.',
      src: S('CB Insights', 'https://www.cbinsights.com/company/istari-1/financials')
    },
    programs: [{ name: 'Air Force digital engineering', customer: 'US Air Force', role: 'Prime', value: '$19M', status: 'Active' }]
  });

  DTM.add({
    id: 'hadean', name: 'Hadean', domain: 'hadean.com', status: 'private', stage: 'Series A',
    hq: 'London', country: 'UK', founded: 2015,
    subsegments: ['software.engineering'],
    oneLiner: 'Spatial computing for AI wargaming, training and mission rehearsal; UK MoD enterprise agreement.',
    description: [
      'Hadean builds distributed spatial computing software used to create large synthetic environments for military training, wargaming and decision support.',
      'It holds a £20M enterprise agreement with the UK Ministry of Defence, partners with Palantir, and raised bridge funding in March 2026 from investors including Booz Allen Ventures and the British Business Bank ahead of a Series B.'
    ],
    funding: {
      totalUsdM: null, label: 'Undisclosed', asOf: '2026-03',
      rounds: [{ date: '2026-03', type: 'Bridge' }],
      investors: ['Booz Allen Ventures', 'British Business Bank', 'Twin Track Ventures', 'Entrepreneurs First'],
      note: 'The March 2026 round size was not disclosed; the British Business Bank invested £2.1M.',
      src: S('Hadean', 'https://hadean.com/news/hadean-secures-acceleration-funding-to-fuel-ambitions-as-the-uks-next-defence-dual-use-tech-unicorn/')
    },
    programs: [{ name: 'UK MoD enterprise agreement', customer: 'UK Ministry of Defence', role: 'Prime', value: '£20M', status: 'Active' }]
  });

  /* ---------------- Logistics & readiness ---------------- */
  DTM.add({
    id: 'govini', name: 'Govini', domain: 'govini.com', status: 'private', stage: 'Growth',
    hq: 'Arlington, VA', country: 'US', founded: 2011,
    subsegments: ['software.logistics'],
    oneLiner: 'Ark decision-science platform for defense acquisition, supply chains and the industrial base.',
    description: [
      'Govini\'s Ark platform maps the defense supply chain, spending and technology base so acquisition teams can find bottlenecks, foreign dependencies and suppliers.',
      'It passed $100M of annual recurring revenue and raised $150M in October 2025, led by Bain Capital, at a valuation above $1B.'
    ],
    leadership: [['Tara Murphy Dougherty', 'CEO']],
    products: ['Ark'],
    funding: {
      totalUsdM: 150, asOf: '2025-10',
      rounds: [{ date: '2025-10', type: 'Growth', amountUsdM: 150, postUsdM: 1250, leads: ['Bain Capital'] }],
      investors: ['Bain Capital'],
      note: 'Total shows the 2025 round only. Valuation reported as $1B–$1.25B.',
      src: S('Tectonic Defense', 'https://www.tectonicdefense.com/icymi-govini-raises-150m-at-over-1b-valuation/')
    },
    revenue: { valueUsdM: 100, period: '2025 ARR', kind: 'reported', src: S('Tectonic Defense', 'https://www.tectonicdefense.com/icymi-govini-raises-150m-at-over-1b-valuation/') },
    programs: [{ name: 'DoD acquisition and supply chain analytics', customer: 'DoD', role: 'Prime', status: 'Active' }]
  });

  DTM.add({
    id: 'rune', name: 'Rune Technologies', short: 'Rune', domain: 'runetech.co', status: 'private', stage: 'Series A',
    hq: '', country: 'US', founded: 2023,
    subsegments: ['software.logistics'],
    oneLiner: 'TyrOS predictive logistics that runs at the tactical edge without a network connection.',
    description: [
      'Rune, founded by Anduril alumni, builds TyrOS, an AI logistics operating system that forecasts supply needs and plans sustainment for units at the tactical edge, even when disconnected from servers.'
    ],
    products: ['TyrOS'],
    funding: {
      totalUsdM: 30, asOf: '2025-07',
      rounds: [
        { date: '2024', type: 'Seed', amountUsdM: 6.2, leads: ['Andreessen Horowitz'] },
        { date: '2025-07', type: 'Series A', amountUsdM: 24, leads: ['Human Capital'] }
      ],
      investors: ['Human Capital', 'Andreessen Horowitz', 'Point72 Ventures', 'XYZ Venture Capital'],
      src: S('Washington Technology, Jul 2025', 'https://www.washingtontechnology.com/companies/2025/07/rune-technologies-fetches-24m-series-capital/406930')
    },
    programs: []
  });

  DTM.add({
    id: 'edgerunner', name: 'EdgeRunner AI', short: 'EdgeRunner', status: 'private', stage: 'Series A',
    hq: 'Seattle, WA', country: 'US', founded: 2023,
    subsegments: ['software.intel'],
    oneLiner: 'Air-gapped, on-device AI agents for warfighters who operate without connectivity.',
    description: [
      'EdgeRunner builds small language models and AI agents that run fully on local devices with no cloud connection, so units can use generative AI in denied or classified environments.'
    ],
    funding: {
      totalUsdM: 17.5, asOf: '2025-05',
      rounds: [
        { date: '2024-07', type: 'Seed', amountUsdM: 5.5, leads: ['Four Rivers'] },
        { date: '2025-05', type: 'Series A', amountUsdM: 12, leads: ['Madrona'] }
      ],
      investors: ['Madrona', 'Four Rivers', 'HP Tech Ventures', 'Alumni Ventures'],
      src: S('Pulse 2.0', 'https://pulse2.com/edgerunner-12-million-series-a-funding-raised-for-on-device-ai-agents-for-military-and-enterprise/amp/')
    },
    programs: []
  });

  /* ---------------- Cyber ---------------- */
  DTM.add({
    id: 'shift5', name: 'Shift5', domain: 'shift5.io', status: 'private', stage: 'Series C',
    hq: 'Rosslyn, VA', country: 'US', founded: 2019,
    subsegments: ['software.cyber'],
    oneLiner: 'Onboard cybersecurity and data for weapon systems, aircraft, rail and vehicles.',
    description: [
      'Shift5 monitors the serial data buses inside weapon systems, aircraft, locomotives and vehicles to detect cyber intrusions and turn onboard data into maintenance and readiness insights.',
      'It raised a $75M Series C in September 2025 to expand across defense and transportation.'
    ],
    leadership: [['Josh Lospinoso', 'Co-founder & CEO']],
    funding: {
      totalUsdM: 158, asOf: '2025-09',
      rounds: [
        { date: '2022-05', type: 'Series B', amountUsdM: 83, leads: ['Insight Partners'] },
        { date: '2025-09', type: 'Series C', amountUsdM: 75 }
      ],
      investors: ['Insight Partners', 'Squadra Ventures', '645 Ventures', 'General Catalyst', 'Moore Strategic Ventures'],
      note: 'Series B was $50M plus a $33M extension. Total is approximate.',
      src: S('Pulse 2.0, Sep 2025', 'https://pulse2.com/shift5-75-million-raised-for-expanding-operational-intelligence-across-defense-sectors/amp/')
    },
    programs: [{ name: 'Weapon system cyber monitoring', customer: 'US Army / USAF / US Navy', role: 'Prime', status: 'Deployed' }]
  });
})();
