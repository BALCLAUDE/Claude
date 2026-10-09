/* Space segment. Figures researched Oct 2026; each block carries its own as-of date and source. */
(function () {
  const S = (t, u) => (u ? { t, u } : { t });

  /* ---------------- Launch ---------------- */
  DTM.add({
    id: 'spacex', name: 'SpaceX', domain: 'spacex.com', status: 'public', ticker: 'SPCX', exchange: 'NASDAQ',
    hq: 'Starbase, TX', country: 'US', founded: 2002,
    subsegments: ['space.launch', 'space.buses'],
    oneLiner: 'Dominant launch provider and Starlink/Starshield operator; listed in a record June 2026 IPO.',
    description: [
      'SpaceX flies the large majority of US national security launches on Falcon 9 and Falcon Heavy and is developing the fully reusable Starship. Its Starlink constellation and the government-focused Starshield variant make it the largest satellite operator in the world.',
      'The company went public on Nasdaq in June 2026 after pricing its IPO at $135 per share, at the time the largest IPO on record. Before listing it acquired xAI, which drove a large 2025 net loss.'
    ],
    leadership: [['Elon Musk', 'Founder, CEO & CTO'], ['Gwynne Shotwell', 'President & COO']],
    employees: '13,000+',
    products: ['Falcon 9', 'Falcon Heavy', 'Starship', 'Dragon', 'Starlink', 'Starshield'],
    marketCap: { usdM: 1825783, asOf: '2026-09-19', src: S('Rankia (SPCX at $152.71)', 'https://www.rankia.com/informacion/spacex') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [{ label: 'FY2025', revenue: 18670, netIncome: -4940 }],
      notes: 'IPO priced June 2026 at $135 per share, raising about $75B. The 2025 net loss is largely tied to the xAI acquisition. Trailing revenue was about $19.3B as of mid-2026 (Simply Wall St).',
      asOf: '2026-07-31', src: [S('Motley Fool, Jul 2026', 'https://www.fool.com/investing/2026/07/24/spacex-stock-keeps-dropping/'), S('Simply Wall St', 'https://simplywall.st/stocks/ca/telecom/tsx-spcx/space-exploration-technologies-shares')]
    },
    valuation: {
      note: 'Enterprise value not compiled. At a ~$1.83T market cap the stock trades near 95× trailing revenue of ~$19.3B. Pre-IPO marks: $400B (Jul 2025), ~$800B (Dec 2025 secondary), $1T in the xAI merger.',
      asOf: '2026-09-19', src: S('Rankia', 'https://www.rankia.com/informacion/spacex')
    },
    programs: [
      { name: 'NSSL Phase 3 Lane 2', ref: 'nssl', customer: 'US Space Force', role: 'Prime', value: '$5.9B', year: 2025, status: 'Production', note: '28 heavy national security missions, the largest share of the Phase 3 Lane 2 award.' },
      { name: 'Starshield / NRO proliferated constellation', customer: 'NRO', role: 'Prime', status: 'Deploying', note: 'Hundreds of Starshield-based reconnaissance satellites launched for the National Reconnaissance Office.' },
      { name: 'SDA Tranche 1 Tracking Layer', ref: 'pwsa', customer: 'Space Development Agency', role: 'Prime', value: '$149M', year: 2022, status: 'On orbit', note: 'Four missile-warning tracking satellites.' }
    ]
  });

  DTM.add({
    id: 'rocket-lab', name: 'Rocket Lab', domain: 'rocketlabcorp.com', status: 'public', ticker: 'RKLB', exchange: 'NASDAQ',
    hq: 'Long Beach, CA', country: 'US', founded: 2006,
    subsegments: ['space.launch', 'space.buses', 'missiles.hypersonics'],
    oneLiner: 'End-to-end space company: Electron and Neutron launch, satellite buses and SDA constellations, and HASTE hypersonic testing.',
    description: [
      'Rocket Lab is the second most active US launch provider with Electron, and its medium-lift Neutron is targeted for a first flight in Q4 2026. Its space systems business builds complete spacecraft and components, including solar arrays, reaction wheels and separation systems.',
      'Defense work has become the growth engine: Rocket Lab is building SDA Transport and Tracking Layer satellites, and its suborbital HASTE variant of Electron is a workhorse for US hypersonic flight testing.'
    ],
    leadership: [['Peter Beck', 'Founder & CEO'], ['Adam Spice', 'CFO']],
    employees: '2,600+',
    products: ['Electron', 'HASTE', 'Neutron', 'Photon', 'Pioneer bus'],
    marketCap: { usdM: 40800, asOf: '2026-09-04', src: S('Yahoo Finance key statistics', 'https://finance.yahoo.com/quote/RKLB/key-statistics') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [
        { label: 'FY2023', revenue: 244.6, netIncome: -182.6 },
        { label: 'FY2024', revenue: 436.2, grossMargin: 26.6, netIncome: -190.2 },
        { label: 'FY2025', revenue: 602, grossMargin: 34.4 }
      ],
      backlog: { valueM: 1850, asOf: '2025-12-31', note: 'Up 73% year on year' },
      notes: 'Q1 2026 guidance was $185M–$200M of revenue. The first Neutron launch slipped to Q4 2026 after a stage 1 tank issue.',
      asOf: '2026-02-26', src: S('Rocket Lab Q4 & FY2025 results', 'https://investors.rocketlabcorp.com/news-releases/news-release-details/rocket-lab-announces-fourth-quarter-and-full-year-2025-financial')
    },
    valuation: { evUsdM: 38630, evSales: 64.2, basis: 'On FY2025 revenue', asOf: '2026-09-04', src: S('Yahoo Finance key statistics', 'https://finance.yahoo.com/quote/RKLB/key-statistics') },
    programs: [
      { name: 'SDA Tranche 3 Tracking Layer', ref: 'pwsa', customer: 'Space Development Agency', role: 'Prime', value: '$816M', year: 2025, status: 'Development', note: '18 missile-tracking spacecraft; the largest contract in company history.', src: S('Rocket Lab FY2025 release', 'https://investors.rocketlabcorp.com/news-releases/news-release-details/rocket-lab-announces-fourth-quarter-and-full-year-2025-financial') },
      { name: 'SDA Tranche 2 Transport Layer Beta', ref: 'pwsa', customer: 'Space Development Agency', role: 'Prime', value: '$515M', year: 2024, status: 'Production', note: '18 data-transport satellites.' },
      { name: 'NSSL Phase 3 Lane 1', ref: 'nssl', customer: 'US Space Force', role: 'On-ramped provider', year: 2025, status: 'Pending Neutron', note: 'Neutron eligible to compete for task orders once certified.' },
      { name: 'HASTE hypersonic test flights', ref: 'hypersonic-test', customer: 'DoD / MDA / DIU', role: 'Launch provider', status: 'Flying', note: 'Suborbital Electron variant used for hypersonic test campaigns including MACH-TB.' }
    ]
  });

  DTM.add({
    id: 'firefly', name: 'Firefly Aerospace', short: 'Firefly', domain: 'fireflyspace.com', status: 'public', ticker: 'FLY', exchange: 'NASDAQ',
    hq: 'Cedar Park, TX', country: 'US', founded: 2017,
    subsegments: ['space.launch', 'space.mobility'],
    oneLiner: 'Alpha small launcher, Blue Ghost lunar landers and Elytra orbital vehicles, plus SciTec missile-warning software.',
    description: [
      'Firefly builds the Alpha small launch vehicle, the Blue Ghost lunar lander that landed on the Moon in March 2025, and the Elytra orbital vehicle for on-orbit mobility and domain awareness. It is co-developing the Eclipse medium launcher with Northrop Grumman.',
      'Firefly listed on Nasdaq in August 2025 and then agreed to acquire SciTec, a missile-warning and tracking software company, deepening its national security business. Its Victus Nox mission set a responsive-launch record for the Space Force.'
    ],
    leadership: [['Jason Kim', 'CEO']],
    products: ['Alpha', 'Eclipse', 'Blue Ghost', 'Elytra'],
    marketCap: { usdM: 3460, asOf: '2026-07-21', src: S('Google Finance', 'https://www.google.com/finance/quote/FLY%3ANASDAQ') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [{ label: 'FY2024', revenue: 60.8 }, { label: 'FY2025', revenue: 159.9 }],
      notes: 'Q1 2026 revenue was a record $80.9M. Full-year 2026 guidance is $420M–$450M. Reported 2025 net loss ranges from $298M to $334M depending on the source.',
      asOf: '2026-06-30', src: [S('StockAnalysis', 'https://www.stockanalysis.com/stocks/fly/'), S('American Companies (SEC data)', 'https://americancompanies.com/company/firefly-aerospace-inc/')]
    },
    valuation: { evSales: null, note: 'Trades at roughly 8× the midpoint of 2026 revenue guidance at the July 2026 market cap.', asOf: '2026-07-21', src: S('Google Finance', 'https://www.google.com/finance/quote/FLY%3ANASDAQ') },
    programs: [
      { name: 'Victus Nox', ref: 'trs', customer: 'US Space Force', role: 'Launch provider', year: 2023, status: 'Completed', note: 'Launched 27 hours after the call-up order, a US responsive-launch record.' },
      { name: 'SciTec missile warning & tracking', customer: 'US Space Force', role: 'Software & data processing', status: 'Operational', note: 'Acquired business that processes missile-warning sensor data for the Space Force.' }
    ]
  });

  DTM.add({
    id: 'stoke-space', name: 'Stoke Space', short: 'Stoke', domain: 'stokespace.com', status: 'private', stage: 'Series E',
    hq: 'Kent, WA', country: 'US', founded: 2019,
    subsegments: ['space.launch'],
    oneLiner: 'Fully reusable medium-lift rocket, Nova, with a reusable upper stage; NSSL Lane 1 on-ramp.',
    description: [
      'Stoke Space is building Nova, a medium-lift launch vehicle designed to be fully and rapidly reusable, including a novel upper stage with a regeneratively cooled heat shield.',
      'The Space Force added Stoke to its National Security Space Launch Phase 3 Lane 1 pool in 2025. In 2026 it raised about $1B to fund Nova into service.'
    ],
    leadership: [['Andy Lapsa', 'Co-founder & CEO'], ['Tom Feldman', 'Co-founder & CTO']],
    products: ['Nova', 'Andromeda upper stage', 'Zenith engine'],
    funding: {
      totalUsdM: 2300, asOf: '2026-09',
      rounds: [
        { date: '2025-10', type: 'Series D', amountUsdM: 510 },
        { date: '2026-09', type: 'Series E', amountUsdM: 1000, postUsdM: 10000 }
      ],
      investors: ['Industrious Ventures', 'Breakthrough Energy Ventures'],
      note: 'Bloomberg reported the 2026 round at about $9B pre-money; post-money shown is that figure plus the new capital.',
      src: [S('Bloomberg, Aug 2026', 'https://news.bgov.com/private-equity/stoke-space-is-raising-1-billion-to-fund-flagship-nova-rocket'), S('Parsers, Sep 2026', 'https://parsers.vc/news/260910-stoke-space-secures-1-billion-for-fully/')]
    },
    programs: [
      { name: 'NSSL Phase 3 Lane 1', ref: 'nssl', customer: 'US Space Force', role: 'On-ramped provider', year: 2025, status: 'Pending first flight', note: 'Eligible to compete for national security launch task orders.' }
    ]
  });

  DTM.add({
    id: 'relativity', name: 'Relativity Space', short: 'Relativity', domain: 'relativityspace.com', status: 'private', stage: 'Founder-controlled',
    hq: 'Long Beach, CA', country: 'US', founded: 2015,
    subsegments: ['space.launch', 'industrial.manufacturing'],
    oneLiner: 'Terran R medium-lift reusable rocket, controlled and funded by Eric Schmidt since 2025.',
    description: [
      'Relativity pioneered large-scale additive manufacturing for rockets, then retired its 3D-printed Terran 1 after a 2023 test flight to focus on the larger, reusable Terran R.',
      'Former Google CEO Eric Schmidt took control and became CEO in March 2025 after the company\'s previous fundraising dried up. Terran R carries a reported ~$3B launch backlog and is targeting a first launch in late 2026.'
    ],
    leadership: [['Eric Schmidt', 'CEO & controlling owner']],
    products: ['Terran R', 'Aeon R engine'],
    funding: {
      totalUsdM: 1335, asOf: '2025-03',
      rounds: [
        { date: '2020-11', type: 'Series D', amountUsdM: 500 },
        { date: '2021-06', type: 'Series E', amountUsdM: 650, postUsdM: 4200, leads: ['Fidelity'] }
      ],
      investors: ['Fidelity', 'Tiger Global', 'BlackRock', 'Bond', 'Eric Schmidt'],
      note: 'Total shows venture capital through 2021. Eric Schmidt\'s investment since 2024 is undisclosed and not included.',
      src: [S('Wikipedia: Relativity Space', 'https://en.wikipedia.org/wiki/Relativity_Space'), S('BNN Bloomberg, Jan 2025', 'https://bnnbloomberg.ca/business/company-news/2025/01/09/ex-google-ceo-eric-schmidt-said-to-be-relativity-space-investor')]
    },
    programs: []
  });

  DTM.add({
    id: 'blue-origin', name: 'Blue Origin', domain: 'blueorigin.com', status: 'private', stage: 'Founder-funded',
    hq: 'Kent, WA', country: 'US', founded: 2000,
    subsegments: ['space.launch'],
    oneLiner: 'New Glenn heavy launcher and BE-4 engines; certified for national security heavy launch.',
    description: [
      'Blue Origin, funded by Jeff Bezos, flies the New Glenn heavy-lift rocket and builds the BE-4 engine that also powers ULA\'s Vulcan. It is developing the Blue Moon lunar lander for NASA.',
      'New Glenn won a share of the Space Force\'s NSSL Phase 3 Lane 2 heavy launch contract in 2025, making Blue Origin the third certified heavy national security launch provider.'
    ],
    leadership: [['Dave Limp', 'CEO'], ['Jeff Bezos', 'Founder & owner']],
    products: ['New Glenn', 'New Shepard', 'BE-4', 'Blue Moon'],
    funding: { totalUsdM: null, label: 'Founder-funded', asOf: '2026-10', note: 'Funded by Jeff Bezos; no outside venture rounds.', src: S('Company background') },
    programs: [
      { name: 'NSSL Phase 3 Lane 2', ref: 'nssl', customer: 'US Space Force', role: 'Prime', value: '$2.4B', year: 2025, status: 'Awarded', note: 'Seven heavy national security missions on New Glenn.' }
    ]
  });

  DTM.add({
    id: 'isar-aerospace', name: 'Isar Aerospace', short: 'Isar', domain: 'isaraerospace.com', status: 'private', stage: 'Series D',
    hq: 'Munich', country: 'DE', founded: 2018,
    subsegments: ['space.launch'],
    oneLiner: 'Spectrum small launcher; Europe\'s best-funded new launch company and a sovereign-access hedge.',
    description: [
      'Isar Aerospace builds the two-stage Spectrum rocket, launched from Andøya Spaceport in Norway. Its first flight in March 2025 ended shortly after liftoff, and its second qualification flight was delayed repeatedly in 2026.',
      'European governments see Isar as part of a sovereign answer to reliance on SpaceX. It was selected for ESA\'s European Launcher Challenge.'
    ],
    leadership: [['Daniel Metzler', 'Co-founder & CEO']],
    products: ['Spectrum'],
    funding: {
      totalUsdM: 1010, asOf: '2026-06',
      rounds: [
        { date: '2025-07', type: 'Convertible', amountUsdM: 175, leads: ['Eldridge Industries'] },
        { date: '2026-06', type: 'Series D', amountUsdM: 315, leads: ['Island Green Capital', 'Molten Ventures'] }
      ],
      investors: ['Eldridge Industries', 'HV Capital', 'Lakestar', 'Porsche SE', 'KfW Capital', 'UVC Partners'],
      note: 'Company reports roughly €870M raised in total; converted to USD at about 1.16. The €270M Series D did not disclose a valuation.',
      src: S('European Spaceflight, Jun 2026', 'https://europeanspaceflight.com/isar-aerospace-announces-new-launch-date-alongside-series-d-funding/')
    },
    programs: [
      { name: 'ESA European Launcher Challenge', customer: 'European Space Agency', role: 'Selected provider', year: 2025, status: 'Development' }
    ]
  });

  /* ---------------- Satellites & buses ---------------- */
  DTM.add({
    id: 'york-space', name: 'York Space Systems', short: 'York Space', domain: 'yorkspacesystems.com', status: 'public', ticker: 'YSS', exchange: 'NYSE',
    hq: 'Denver, CO', country: 'US', founded: 2012,
    subsegments: ['space.buses'],
    oneLiner: 'High-rate satellite bus maker and a core SDA constellation supplier; IPO January 2026.',
    description: [
      'York builds standardized small satellite buses at high rates and integrates complete spacecraft for the Space Development Agency\'s proliferated constellations and other government customers.',
      'York listed on the NYSE in January 2026, raising $629M at $34 per share, the top of its range, for a $4.3B valuation at pricing.'
    ],
    products: ['S-CLASS bus', 'LX-CLASS bus'],
    marketCap: { usdM: 3800, asOf: '2026-06-07', src: S('American Companies (SEC data)', 'https://americancompanies.com/company/york-space-systems-inc/') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [
        { label: 'FY2024', revenue: 253.5, netIncome: -98.9 },
        { label: 'TTM Q1 26', revenue: 404.6 }
      ],
      notes: 'Revenue for the nine months to September 2025 was $280.9M. Q1 2026 revenue was $116.3M.',
      asOf: '2026-06-07', src: [S('Hoodline, IPO coverage', 'https://hoodline.com/2026/01/mile-high-space-maker-rockets-to-629-million-ipo-payday/'), S('Motley Fool quote page', 'https://www.fool.com/quote/nyse/yss')]
    },
    valuation: { evSales: null, note: 'Roughly 9× trailing revenue on market cap at the June 2026 snapshot.', asOf: '2026-06-07', src: S('American Companies (SEC data)', 'https://americancompanies.com/company/york-space-systems-inc/') },
    programs: [
      { name: 'SDA Transport & Tracking Layers', ref: 'pwsa', customer: 'Space Development Agency', role: 'Prime', status: 'Production', note: 'Builds satellites across multiple PWSA tranches.' }
    ]
  });

  DTM.add({
    id: 'apex', name: 'Apex', domain: 'apexspace.com', status: 'private', stage: 'Growth',
    hq: 'Los Angeles, CA', country: 'US', founded: 2022,
    subsegments: ['space.buses'],
    oneLiner: 'Productized satellite buses (Aries, Nova, Comet) built on an assembly line for defense and commercial missions.',
    description: [
      'Apex sells standardized satellite buses off a production line, cutting the time from order to orbit to months. Its Aries bus first flew in 2024.',
      'In June 2026 Apex raised $200M at a $2.3B valuation, more than doubling its value in under a year as defense demand for proliferated constellations grew.'
    ],
    leadership: [['Ian Cinnamon', 'Co-founder & CEO'], ['Max Benassi', 'Co-founder & President']],
    products: ['Aries', 'Nova', 'Comet'],
    funding: {
      totalUsdM: 718, asOf: '2026-06',
      rounds: [
        { date: '2025-04', type: 'Series C', amountUsdM: 200, postUsdM: 1000, leads: ['Point72 Ventures', '8VC'] },
        { date: '2025-09', type: 'Series D', amountUsdM: 200, postUsdM: 1000, leads: ['Interlagos'] },
        { date: '2026-06', type: 'Growth', amountUsdM: 200, postUsdM: 2300, leads: ['Glade Brook', 'Washington Harbour Partners'] }
      ],
      investors: ['Andreessen Horowitz', 'Point72 Ventures', '8VC', 'StepStone'],
      note: 'The September 2025 round was reported at "more than $1B".',
      src: [S('Payload, Jun 2026', 'https://payloadspace.com/apex-raises-200m-at-2-3b-valuation'), S('Satellite Today, Jun 2026', 'https://satellitetoday.com/manufacturing/2026/06/05/apex-hits-2-3b-valuation-with-latest-funding-raise/')]
    },
    programs: []
  });

  DTM.add({
    id: 'k2-space', name: 'K2 Space', domain: 'k2space.com', status: 'private', stage: 'Series D',
    hq: 'Torrance, CA', country: 'US', founded: 2022,
    subsegments: ['space.buses'],
    oneLiner: 'Large, high-power satellite buses at low cost, designed for Starship-era launch economics.',
    description: [
      'K2 builds large satellites: its Mega Class bus generates about 20 kW at a cost the company puts near $15M per spacecraft. Its first production satellite, Gravitas, launched in March 2026 with 12 payloads under a $60M Space Force contract.',
      'K2 is part of Anduril\'s Golden Dome team and holds orders for 30 satellites for SES\'s meoSphere network. It plans to reach 100 satellites per year.'
    ],
    leadership: [['Karan Kunjur', 'Co-founder & CEO'], ['Neel Kunjur', 'Co-founder & CTO']],
    products: ['Mega Class bus', 'Giga Class (2028)'],
    funding: {
      totalUsdM: 1000, asOf: '2026-07',
      rounds: [
        { date: '2025-12', type: 'Series C', amountUsdM: 250, postUsdM: 3000, leads: ['Redpoint'] },
        { date: '2026-07', type: 'Series D', amountUsdM: 500, postUsdM: 6800, leads: ['Kleiner Perkins', 'ICONIQ'] }
      ],
      investors: ['Kleiner Perkins', 'ICONIQ', 'Redpoint', 'CapitalG', 'Lightspeed', 'Altimeter', 'ARK Invest'],
      note: 'GeekWire reports more than $1B raised in total. Contract backlog is about $1B.',
      src: [S('GeekWire, Jul 2026', 'https://geekwire.com/2026/k2-space-raises-500m-big-satellites/'), S('Washington Technology', 'https://washingtontechnology.com/contracts/2026/07/k2-space-fetches-500m-its-move-mass-production/415145/')]
    },
    programs: [
      { name: 'Gravitas mission', customer: 'US Space Force', role: 'Prime', value: '$60M', year: 2025, status: 'On orbit', note: 'First production satellite carrying 12 DoD and commercial payloads.' },
      { name: 'Golden Dome (Anduril team)', ref: 'golden-dome', customer: 'DoD', role: 'Teammate', status: 'Development' }
    ]
  });

  DTM.add({
    id: 'astranis', name: 'Astranis', domain: 'astranis.com', status: 'private', stage: 'Series E',
    hq: 'San Francisco, CA', country: 'US', founded: 2015,
    subsegments: ['space.buses', 'space.sda'],
    oneLiner: 'Small geostationary (MicroGEO) satellites with software-defined payloads for dedicated and military satcom.',
    description: [
      'Astranis builds ~400 kg geostationary satellites, about a twentieth the mass of a traditional GEO satellite, with a software-defined radio that can be reprogrammed in orbit.',
      'It is scaling production for US military satellite procurements and unveiled Perceptor, a GEO space domain awareness platform built on the MicroGEO line.'
    ],
    leadership: [['John Gedmark', 'Co-founder & CEO']],
    employees: '~535',
    products: ['MicroGEO', 'Perceptor'],
    funding: {
      totalUsdM: 1200, asOf: '2026-05',
      rounds: [
        { date: '2024-07', type: 'Series D', amountUsdM: 200 },
        { date: '2026-05', type: 'Series E', amountUsdM: 300, postUsdM: 2800, leads: ['Snowpoint Ventures', 'Franklin Templeton'] }
      ],
      investors: ['Andreessen Horowitz', 'BlackRock', 'Fidelity', 'Founders Fund', 'Franklin Templeton'],
      note: 'The Series E came with a credit facility of up to $155M from Trinity Capital.',
      src: S('Payload, May 2026', 'https://payloadspace.com/astranis-raises-300m-series-e/')
    },
    programs: []
  });

  DTM.add({
    id: 'muon-space', name: 'Muon Space', short: 'Muon', domain: 'muonspace.com', status: 'private', stage: 'Series C',
    hq: 'Mountain View, CA', country: 'US', founded: 2021,
    subsegments: ['space.buses', 'space.isr'],
    oneLiner: 'Full-stack constellation builder for Earth sensing, scaling to 500 satellites a year.',
    description: [
      'Muon designs and operates satellite constellations for Earth observation, including the FireSat wildfire-detection constellation, and sells its Halo bus to other operators.',
      'Its August 2026 Series C funds a San Jose factory designed to produce up to 500 satellites a year by 2027.'
    ],
    leadership: [['Jonny Dyer', 'Co-founder & CEO']],
    products: ['Halo bus', 'FireSat'],
    funding: {
      totalUsdM: 386, asOf: '2026-08',
      rounds: [{ date: '2026-08', type: 'Series C', amountUsdM: 250, postUsdM: 1500, leads: ['Eclipse'] }],
      investors: ['Eclipse', 'Google', 'Salesforce Ventures', 'Wellington Management', 'Activate Capital'],
      note: 'Valuation reported by Reuters from a person familiar with the matter.',
      src: [S('GovConWire, Aug 2026', 'https://www.govconwire.com/articles/muon-space-250m-series-c-eclipse'), S('SmallSat News', 'https://smallsatnews.com/2026/08/20/muon-space-reaches-1-5-billion-valuation-following-250-million-series-c-round/')]
    },
    programs: []
  });

  /* ---------------- Space domain awareness ---------------- */
  DTM.add({
    id: 'leolabs', name: 'LeoLabs', domain: 'leolabs.space', status: 'private', stage: 'Series B',
    hq: 'Menlo Park, CA', country: 'US', founded: 2016,
    subsegments: ['space.sda'],
    oneLiner: 'Global phased-array radar network tracking objects in low Earth orbit.',
    description: [
      'LeoLabs operates a commercial network of ground-based phased-array radars that track satellites and debris in low Earth orbit and sells the data and analytics to governments and operators.',
      'It is deploying containerized Scout radars, with a Hawaii site planned for early 2026, to augment US Space Force space domain awareness.'
    ],
    leadership: [['Tony Frazier', 'CEO']],
    products: ['Global Radar Network', 'Scout radar'],
    funding: {
      totalUsdM: 120, asOf: '2024-02',
      rounds: [{ date: '2024-02', type: 'Series B ext.', amountUsdM: 29 }],
      note: 'Totals vary by tracker ($111M–$120M). Recent growth has come from government contracts rather than equity.',
      src: S('Altaroc, Feb 2024', 'https://www.altaroc.pe/en/resources/news/innovative-company-leolabs-raises-29-million')
    },
    programs: [{ name: 'Space Force SDA radar services', customer: 'US Space Force', role: 'Data provider', status: 'Operational' }]
  });

  DTM.add({
    id: 'slingshot', name: 'Slingshot Aerospace', short: 'Slingshot', domain: 'slingshot.space', status: 'private', stage: 'Series A2',
    hq: 'Austin, TX', country: 'US', founded: 2017,
    subsegments: ['space.sda', 'software.engineering'],
    oneLiner: 'Optical telescope network, space traffic data and space warfighting simulation.',
    description: [
      'Slingshot runs a global network of optical sensors that track satellites, and pairs that data with analytics for space traffic coordination.',
      'Its Orbital Fight Club and digital twin tools train Space Force Guardians on space warfighting scenarios.'
    ],
    products: ['Slingshot Beacon', 'Global Sensor Network', 'Orbital Fight Club'],
    funding: {
      totalUsdM: 83, asOf: '2022-12',
      rounds: [{ date: '2022-12', type: 'Series A2', amountUsdM: 40.85, leads: ['Sway Ventures'] }],
      investors: ['Sway Ventures', 'Lockheed Martin Ventures', 'Draper Associates', 'ATX Venture Partners'],
      src: S('Slingshot press release, Dec 2022', 'https://www.slingshot.space/news/slingshot-aerospace-raises-40-million-in-oversubscribed-series-a2')
    },
    programs: []
  });

  DTM.add({
    id: 'kayhan', name: 'Kayhan Space', short: 'Kayhan', domain: 'kayhan.space', status: 'private', stage: 'Seed',
    hq: 'Boulder, CO', country: 'US', founded: 2019,
    subsegments: ['space.sda'],
    oneLiner: 'Autonomous space traffic coordination and collision avoidance software.',
    description: [
      'Kayhan builds Pathfinder, a space traffic coordination platform that screens conjunctions and coordinates maneuvers between operators, and Satcat, a public satellite catalog.'
    ],
    products: ['Pathfinder', 'Satcat'],
    funding: {
      totalUsdM: 10.7, asOf: '2023-09',
      rounds: [{ date: '2023-09', type: 'Seed ext.', amountUsdM: 7, leads: ['Space Capital', 'EVE Atlas'] }],
      src: S('Satellite Today, Sep 2023', 'https://www.satellitetoday.com/business/2023/09/19/kayhan-space-raises-a-7m-seed-expansion-round/')
    },
    programs: []
  });

  /* ---------------- Counterspace ---------------- */
  DTM.add({
    id: 'true-anomaly', name: 'True Anomaly', domain: 'trueanomaly.space', status: 'private', stage: 'Series D',
    hq: 'Denver, CO', country: 'US', founded: 2022,
    subsegments: ['space.counterspace', 'space.sda'],
    oneLiner: 'Jackal autonomous orbital vehicles for inspection, space control and Golden Dome interception.',
    description: [
      'True Anomaly builds Jackal, a fridge-sized maneuvering spacecraft for rendezvous and proximity operations, together with the Mosaic software that plans and runs those missions.',
      'In April 2026 it was one of 12 companies picked for Golden Dome space-based interceptor prototypes and raised a $650M Series D. It plans to grow to over 500 staff by end-2026 and build 50 Jackals a year.'
    ],
    leadership: [['Even Rogers', 'Co-founder & CEO']],
    employees: '~250 (early 2026)',
    products: ['Jackal', 'Mosaic'],
    funding: {
      totalUsdM: 1000, asOf: '2026-04',
      rounds: [
        { date: '2023-12', type: 'Series B', amountUsdM: 100 },
        { date: '2025-04', type: 'Series C', amountUsdM: 260 },
        { date: '2026-04', type: 'Series D', amountUsdM: 650, postUsdM: 2200, leads: ['Eclipse', 'Riot Ventures'] }
      ],
      investors: ['Eclipse', 'Riot Ventures', 'Accel'],
      note: 'The Series D includes $50M of debt from Stifel Bank. Total reported as "more than $1B".',
      src: [S('SiliconANGLE, Apr 2026', 'https://siliconangle.com/2026/04/28/space-technology-startup-true-anomaly-raises-650m-2-2b-valuation/'), S('The Next Web', 'https://thenextweb.com/news/true-anomaly-650m-space-defense-golden-dome')]
    },
    programs: [
      { name: 'Golden Dome space-based interceptor prototype', ref: 'golden-dome', customer: 'US Space Force', role: '1 of 12 awardees', value: 'Up to $3.2B (pool)', year: 2026, status: 'Prototype' },
      { name: 'Andromeda GEO surveillance', customer: 'US Space Force', role: 'Selected vendor', value: '$1.8B (program)', year: 2026, status: 'Development' },
      { name: 'Victus Haze', ref: 'trs', customer: 'US Space Force', role: 'Spacecraft provider', year: 2023, status: 'Mission', note: 'Responsive rendezvous and proximity operations demonstration.' }
    ]
  });

  DTM.add({
    id: 'turion', name: 'Turion Space', short: 'Turion', domain: 'turionspace.com', status: 'private', stage: 'Series B',
    hq: 'Irvine, CA', country: 'US', founded: 2020,
    subsegments: ['space.counterspace', 'space.sda'],
    oneLiner: 'Droid spacecraft for non-Earth imaging and orbital intelligence.',
    description: [
      'Turion builds the DROID line of maneuverable spacecraft that image other objects in orbit, providing space domain awareness and characterization for defense customers.',
      'Its April 2026 Series B funds a ramp from about eight spacecraft a year to roughly 40.'
    ],
    leadership: [['Ryan Westerdahl', 'Co-founder & CEO']],
    products: ['DROID.001', 'DROID.002'],
    funding: {
      totalUsdM: 75, asOf: '2026-04',
      rounds: [{ date: '2026-04', type: 'Series B', amountUsdM: 75, leads: ['Washington Harbour Partners'] }],
      investors: ['Washington Harbour Partners', 'Aurelia Foundry', 'Magnetar', 'HOF Capital', 'Industrious Ventures'],
      note: 'Total shows the Series B only; earlier seed rounds are not included.',
      src: S('Pulse 2.0, Apr 2026', 'https://pulse2.com/turion-space-75-million-series-b-to-scale-space-infrastructure-and-advance-space-domain-awareness/')
    },
    programs: []
  });

  /* ---------------- Mobility & servicing ---------------- */
  DTM.add({
    id: 'impulse-space', name: 'Impulse Space', short: 'Impulse', domain: 'impulsespace.com', status: 'private', stage: 'Series D',
    hq: 'Redondo Beach, CA', country: 'US', founded: 2021,
    subsegments: ['space.mobility'],
    oneLiner: 'Mira and Helios orbital transfer vehicles that move payloads beyond the launcher\'s drop-off orbit.',
    description: [
      'Founded by SpaceX\'s first employee Tom Mueller, Impulse builds in-space transportation: the Mira vehicle, already flying, and the high-energy Helios kick stage, due to fly in 2027, which can carry payloads directly to GEO.',
      'Defense customers want Impulse vehicles for fast repositioning in orbit and responsive GEO missions.'
    ],
    leadership: [['Tom Mueller', 'Founder & CEO'], ['Eric Romo', 'President & COO']],
    products: ['Mira', 'Helios'],
    funding: {
      totalUsdM: 1000, asOf: '2026-06',
      rounds: [
        { date: '2025-06', type: 'Series C', amountUsdM: 300, leads: ['Founders Fund'] },
        { date: '2026-06', type: 'Series D', amountUsdM: 500, postUsdM: 4260, leads: ['137 Ventures', 'Banner VC'] }
      ],
      investors: ['Founders Fund', 'Lux Capital', 'RedPoint', '137 Ventures', 'Banner VC'],
      note: 'Valuation reported by Reuters from a person familiar with the matter. Company says lifetime funding exceeds $1B.',
      src: S('LA Business Journal, Jun 2026', 'https://labusinessjournal.com/featured/impulse-passes-1-billion-in-funding/')
    },
    programs: []
  });

  DTM.add({
    id: 'starfish-space', name: 'Starfish Space', short: 'Starfish', domain: 'starfishspace.com', status: 'private', stage: 'Series B',
    hq: 'Kent, WA', country: 'US', founded: 2019,
    subsegments: ['space.mobility', 'space.counterspace'],
    oneLiner: 'Otter servicing vehicles that dock with satellites to extend life, inspect or relocate them.',
    description: [
      'Starfish builds Otter, a satellite-servicing spacecraft that can dock with satellites that were never designed to be serviced, using its Nautilus capture mechanism and autonomous guidance software.',
      'Its first servicing missions are for the US Space Force and SES. The April 2026 Series B funds scaled Otter production.'
    ],
    leadership: [['Austin Link', 'Co-founder & CEO'], ['Trevor Bennett', 'Co-founder']],
    products: ['Otter', 'Otter Pup', 'CETACEAN', 'CEPHALOPOD'],
    funding: {
      totalUsdM: 150, asOf: '2026-04',
      rounds: [{ date: '2026-04', type: 'Series B', amountUsdM: 110, leads: ['Point72 Ventures'] }],
      investors: ['Point72 Ventures', 'Activate Capital', 'Shield Capital', 'Munich Re Ventures', 'NFX'],
      src: S('GeekWire, Apr 2026', 'https://www.geekwire.com/2026/starfish-space-raises-more-than-100m-to-scale-up-its-satellite-servicing-missions/')
    },
    programs: [
      { name: 'Otter GEO inspection & docking', customer: 'US Space Force', role: 'Prime', value: '$37.5M', status: 'Development' }
    ]
  });

  DTM.add({
    id: 'portal-space', name: 'Portal Space Systems', short: 'Portal Space', domain: 'portalspacesystems.com', status: 'private', stage: 'Series A',
    hq: 'Bothell, WA', country: 'US', founded: 2021,
    subsegments: ['space.mobility', 'space.counterspace'],
    oneLiner: 'Supernova solar-thermal spacecraft built for rapid, repeated maneuvers across orbits.',
    description: [
      'Portal is building Supernova, a highly maneuverable spacecraft that uses solar-thermal propulsion to change orbits quickly and repeatedly, for mobility, inspection and space control missions.',
      'The Space Force backed it with a $45M STRATFI award in 2025, and it closed a $50M Series A in April 2026.'
    ],
    leadership: [['Jeff Thornburg', 'Co-founder & CEO']],
    products: ['Supernova'],
    funding: {
      totalUsdM: 67.5, asOf: '2026-04',
      rounds: [
        { date: '2025-02', type: 'Seed', amountUsdM: 17.5 },
        { date: '2026-04', type: 'Series A', amountUsdM: 50, leads: ['Geodesic Capital', 'Mach33'] }
      ],
      investors: ['Geodesic Capital', 'Mach33', 'Booz Allen Ventures', 'ARK Invest', 'AlleyCorp'],
      note: 'Excludes about $48M of non-dilutive DoD and Space Force awards.',
      src: S('Pulse 2.0, Apr 2026', 'https://pulse2.com/portal-space-systems-50-million-raised-for-rapidly-maneuverable-spacecraft-development/')
    },
    programs: [{ name: 'Space Force STRATFI', customer: 'US Space Force', role: 'Prime', value: '$45M', year: 2025, status: 'Development' }]
  });

  DTM.add({
    id: 'orbit-fab', name: 'Orbit Fab', domain: 'orbitfab.com', status: 'private', stage: 'Series A',
    hq: 'Lafayette, CO', country: 'US', founded: 2018,
    subsegments: ['space.mobility'],
    oneLiner: 'In-orbit refueling: RAFTI fuel ports, tankers and fuel shuttles.',
    description: [
      'Orbit Fab is building "gas stations in space": standard RAFTI refueling ports for satellites, plus tankers and shuttles to deliver propellant so that defense satellites can maneuver without rationing fuel.'
    ],
    products: ['RAFTI', 'GRIP', 'Fuel shuttles'],
    funding: {
      totalUsdM: 42, asOf: '2023-04',
      rounds: [{ date: '2023-04', type: 'Series A', amountUsdM: 28.5, leads: ['8090 Industries'] }],
      investors: ['8090 Industries', 'Lockheed Martin Ventures', 'Stride Capital', 'Industrious Ventures'],
      src: S('Satellite Today, Apr 2023', 'https://www.satellitetoday.com/business/2023/04/17/orbit-fab-raises-28-5m-in-its-series-a-round/')
    },
    programs: []
  });

  /* ---------------- Space ISR ---------------- */
  DTM.add({
    id: 'planet', name: 'Planet Labs', short: 'Planet', domain: 'planet.com', status: 'public', ticker: 'PL', exchange: 'NYSE',
    hq: 'San Francisco, CA', country: 'US', founded: 2010,
    subsegments: ['space.isr'],
    oneLiner: 'Largest Earth-imaging constellation; daily global imagery and AI analytics for defense and intelligence.',
    description: [
      'Planet operates the largest fleet of Earth-imaging satellites, imaging the entire landmass daily with its Dove constellation and offering high-resolution tasking with Pelican.',
      'Defense and intelligence customers now drive growth, including multi-year sovereign deals with allied governments. Fiscal 2026 was the first year with positive adjusted EBITDA and free cash flow.'
    ],
    leadership: [['Will Marshall', 'Co-founder, CEO & Chair'], ['Ashley Johnson', 'President & CFO']],
    products: ['PlanetScope', 'Pelican', 'Tanager', 'Planet Insights Platform'],
    marketCap: { usdM: 7940, asOf: '2026-08-28', src: S('Simply Wall St', 'https://simplywall.st/stocks/us/commercial-services/nyse-pl/planet-labs-pbc/valuation') },
    financials: {
      cur: 'USD', fyEnd: 'Jan',
      periods: [
        { label: 'FY2024', revenue: 220.7 },
        { label: 'FY2025', revenue: 244.4 },
        { label: 'FY2026', revenue: 307.7, ebitda: 15.5, fcf: 52.9 }
      ],
      backlog: { valueM: 900, asOf: '2026-01-31', note: 'More than $900M, up 79%; RPO $852M' },
      asOf: '2026-03-19', src: S('Planet FY2026 results', 'https://www.businesswire.com/news/home/20260319782110/en/planet-reports-financial-results-for-fourth-quarter-and-full-fiscal-year-2026/')
    },
    valuation: { evSales: 23.7, basis: 'On FY2026 revenue, ex-cash', note: 'EV estimated as market cap less ~$640M of year-end cash.', asOf: '2026-08-28', src: S('Simply Wall St', 'https://simplywall.st/stocks/us/commercial-services/nyse-pl/planet-labs-pbc/valuation') },
    programs: [
      { name: 'NRO Electro-Optical Commercial Layer', ref: 'eocl', customer: 'NRO', role: 'Imagery provider', year: 2022, status: 'Operational' }
    ]
  });

  DTM.add({
    id: 'blacksky', name: 'BlackSky', domain: 'blacksky.com', status: 'public', ticker: 'BKSY', exchange: 'NYSE',
    hq: 'Herndon, VA', country: 'US', founded: 2014,
    subsegments: ['space.isr'],
    oneLiner: 'High-revisit imaging constellation with Gen-3 35 cm satellites and AI-driven tasking.',
    description: [
      'BlackSky operates a constellation of small imaging satellites optimized for rapid revisit, now upgrading to Gen-3 spacecraft with 35 cm resolution, and sells imagery and analytics through its Spectra platform.',
      'International defense customers drove most of its 2025 backlog growth.'
    ],
    leadership: [['Brian O\'Toole', 'CEO']],
    products: ['Gen-3', 'Spectra'],
    marketCap: { usdM: 880.7, asOf: '2026-09-18', src: S('Angel One', 'https://www.angelone.in/us-stocks/blacksky-technology-inc') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [{ label: 'FY2023', revenue: 94.5 }, { label: 'FY2024', revenue: 102.1 }, { label: 'FY2025', revenue: 107 }],
      backlog: { valueM: 345.3, asOf: '2025-12-31', note: 'Up 32%, mostly international' },
      notes: '2026 guidance (May 2026): revenue $130M–$150M, adjusted EBITDA $12M–$24M.',
      asOf: '2026-05-07', src: S('BlackSky FY2025 results', 'https://www.businesswire.com/news/home/20260226188003/en/BlackSky-Reports-Fourth-Quarter-and-Full-Year-2025-Results')
    },
    valuation: { evSales: 7.1, basis: 'On FY2025 revenue, ex-cash', note: 'EV estimated as market cap less ~$126M of year-end cash, before debt.', asOf: '2026-09-18', src: S('Angel One', 'https://www.angelone.in/us-stocks/blacksky-technology-inc') },
    programs: [{ name: 'NRO Electro-Optical Commercial Layer', ref: 'eocl', customer: 'NRO', role: 'Imagery provider', year: 2022, status: 'Operational' }]
  });

  DTM.add({
    id: 'hawkeye-360', name: 'HawkEye 360', domain: 'he360.com', status: 'public', ticker: 'HAWK', exchange: 'NYSE',
    hq: 'Herndon, VA', country: 'US', founded: 2015,
    subsegments: ['space.isr', 'sensors.ew'],
    oneLiner: 'Space-based RF geolocation: finds radars, radios and GPS jammers from orbit.',
    description: [
      'HawkEye 360 flies clusters of satellites that detect and geolocate radio-frequency emitters, such as ship radars, push-to-talk radios and GPS jammers, to support maritime domain awareness and signals intelligence.',
      'It listed on the NYSE in May 2026, raising $416M at $26 per share for a $2.4B valuation at pricing.'
    ],
    leadership: [['John Serafini', 'CEO']],
    products: ['RF constellation clusters', 'Mission Space analytics'],
    marketCap: { usdM: 1451, asOf: '2026-10-02', src: S('YCharts', 'https://ycharts.com/companies/HAWK/market_cap') },
    valuation: { note: 'IPO priced May 2026 at $26 per share, valuing the company at $2.4B.', asOf: '2026-10-02', src: S('Bloomberg, May 2026', 'https://www.bloomberg.com/news/articles/2026-05-07/surveillance-firm-hawkeye-360-raises-416-million-in-ipo') },
    programs: [{ name: 'Commercial RF data for the intelligence community', ref: 'eocl', customer: 'NRO / NGA', role: 'Data provider', status: 'Operational' }]
  });

  DTM.add({
    id: 'iceye', name: 'ICEYE', domain: 'iceye.com', status: 'private', stage: 'Series F',
    hq: 'Espoo', country: 'FI', founded: 2014,
    subsegments: ['space.isr'],
    oneLiner: 'Largest SAR satellite constellation; all-weather, day-night radar imaging for allied militaries.',
    description: [
      'ICEYE operates the world\'s largest synthetic aperture radar (SAR) constellation, with 64 satellites in orbit as of March 2026, imaging through cloud and darkness.',
      'European rearmament has made it a sovereign defense supplier: it is building SAR constellations for Germany with Rheinmetall and supplies Poland, Finland, the Netherlands and others. It reported over €250M of 2025 revenue and over €100M of EBITDA.'
    ],
    leadership: [['Rafał Modrzewski', 'Co-founder & CEO']],
    products: ['ICEYE SAR satellites', 'Dwell', 'Flood & insurance analytics'],
    funding: {
      totalUsdM: 1160, asOf: '2026-06',
      rounds: [
        { date: '2026-06', type: 'Series F', amountUsdM: 525, postUsdM: 11500, leads: ['General Atlantic'] }
      ],
      investors: ['General Atlantic', 'Solidium', 'Tesi', 'Nokia', 'Qatar Investment Authority', 'True Ventures'],
      note: 'The June 2026 round was €450M primary (≈$525M) plus a secondary, €1B in total, at a valuation above €10B. Expected to close in Q3 2026.',
      src: [S('Bloomberg, Jun 2026', 'https://news.bloomberglaw.com/private-equity/satellite-startup-iceye-valuation-tops-10-billion-on-new-funds'), S('StockAnalysis', 'https://stockanalysis.com/private/iceye/')]
    },
    revenue: { valueUsdM: 290, period: 'FY2025', kind: 'reported', note: 'Over €250M; EBITDA over €100M', src: S('bne IntelliNews', 'https://www.intellinews.com/funding-round-for-polish-led-space-tech-firm-iceye-values-it-at-10bn-447619/') },
    programs: [
      { name: 'German Bundeswehr SAR constellation (with Rheinmetall)', customer: 'German Armed Forces', role: 'Satellite supplier', value: '≈$1.9B', status: 'Production' },
      { name: 'Polish Armed Forces SAR satellites', customer: 'Poland MoD', role: 'Prime', value: '€200M', status: 'Delivering' }
    ]
  });

  DTM.add({
    id: 'umbra', name: 'Umbra', domain: 'umbra.space', status: 'private', stage: 'Series C',
    hq: 'Santa Barbara, CA', country: 'US', founded: 2015,
    subsegments: ['space.isr'],
    oneLiner: 'Very high-resolution commercial SAR satellites (down to 16 cm).',
    description: [
      'Umbra builds and operates SAR satellites with some of the highest commercial resolution available and sells the imagery openly and to defense customers.',
      'SpaceWERX selected it for a STRATFI program worth up to $60M to develop next-generation spacecraft, and it is developing maritime surveillance satellites for the US military.'
    ],
    leadership: [['Gabe Dominocielo', 'Co-founder & President']],
    products: ['Umbra SAR', 'Canopy'],
    funding: {
      totalUsdM: 120.5, asOf: '2026-02',
      rounds: [{ date: '2023-09', type: 'Series C', amountUsdM: 60, leads: ['Spark Capital'] }],
      investors: ['Spark Capital'],
      note: 'Reported totals range widely ($46M–$246M) across trackers; Caplight figure shown.',
      src: S('Caplight', 'https://www.caplight.com/company/umbra')
    },
    programs: [{ name: 'SpaceWERX STRATFI', customer: 'US Space Force', role: 'Prime', value: 'Up to $60M', year: 2025, status: 'Development', src: S('Umbra', 'https://umbra.space/blog/umbra-selected-as-participant-in-stratfi-program-to-develop-next-generation-spacecraft/') }]
  });

  DTM.add({
    id: 'albedo', name: 'Albedo', domain: 'albedo.com', status: 'private', stage: 'Series A-1',
    hq: 'Denver, CO', country: 'US', founded: 2020,
    subsegments: ['space.isr', 'space.buses'],
    oneLiner: 'Very-low-Earth-orbit satellites delivering 10 cm optical and thermal imagery.',
    description: [
      'Albedo flies satellites in very low Earth orbit (VLEO) to achieve aerial-grade resolution from space. In late 2025 it expanded into selling its VLEO satellites to defense customers.'
    ],
    leadership: [['Topher Haddad', 'Co-founder & CEO']],
    products: ['Clarity VLEO satellites'],
    funding: {
      totalUsdM: 97, asOf: '2024-01',
      rounds: [{ date: '2024-01', type: 'Series A-1', amountUsdM: 35, leads: ['Standard Investments'] }],
      investors: ['Standard Investments', 'Booz Allen Ventures'],
      src: S('Manufacturing.net', 'https://www.manufacturing.net/aerospace/news/22884809/albedo-raises-35m-to-commercialize-very-low-earth-orbit')
    },
    programs: []
  });

  DTM.add({
    id: 'vantor', name: 'Vantor', domain: 'vantor.com', status: 'private', stage: 'PE-owned',
    hq: 'Westminster, CO', country: 'US', founded: 1992,
    subsegments: ['space.isr', 'software.intel'],
    oneLiner: 'Formerly Maxar Intelligence: WorldView imagery, 3D terrain and geospatial AI for defense.',
    description: [
      'Vantor is the Maxar Intelligence business, renamed in October 2025 after Advent International split Maxar into Vantor (intelligence) and Lanteris (space systems). It operates the WorldView Legion constellation and provides 3D terrain, foundation maps and analytics.',
      'It is shifting from selling images to recurring software subscriptions, with heavy US government revenue concentration.'
    ],
    leadership: [['Dan Smoot', 'CEO']],
    products: ['WorldView Legion', 'Tensorglobe', 'Raptor', 'Sentry'],
    funding: { totalUsdM: null, label: 'PE-owned', asOf: '2025-10', note: 'Owned by Advent International, which took Maxar private for $6.4B in 2023.', src: S('Wikipedia: Vantor', 'https://en.wikipedia.org/wiki/Vantor_(company)') },
    revenue: { valueUsdM: 487.5, period: 'FY2025', kind: 'estimate', note: 'Unaudited, from secondary reporting', src: S('Robotics.press profile', 'https://www.robotics.press/news/vantor-company-profile-maxar-successor/') },
    programs: [
      { name: 'NRO EOCL & NGA Luno', ref: 'eocl', customer: 'NRO / NGA', role: 'Prime', status: 'Operational', note: 'Commercial imagery and analytics, including Luno A and Luno B awards in 2026.' }
    ]
  });

  /* ---------------- Public space suppliers ---------------- */
  DTM.add({
    id: 'redwire', name: 'Redwire', domain: 'redwirespace.com', status: 'public', ticker: 'RDW', exchange: 'NYSE',
    hq: 'Jacksonville, FL', country: 'US', founded: 2020,
    subsegments: ['space.buses', 'uas.tactical'],
    oneLiner: 'Space infrastructure components plus Edge Autonomy\'s Stalker and Penguin drones.',
    description: [
      'Redwire supplies spacecraft components such as roll-out solar arrays, sensors and docking systems, and builds complete spacecraft including very-low-Earth-orbit platforms.',
      'Its June 2025 acquisition of Edge Autonomy added the Stalker and Penguin uncrewed aircraft and fuel-cell power, turning Redwire into a multi-domain defense supplier.'
    ],
    leadership: [['Peter Cannito', 'Chairman & CEO']],
    products: ['ROSA solar arrays', 'Mason', 'Stalker UAS', 'Penguin UAS'],
    marketCap: { usdM: 2630, asOf: '2026-09-04', src: S('MarketChameleon', 'https://marketchameleon.com/Overview/RDW/') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [{ label: 'FY2023', revenue: 243.8 }, { label: 'FY2024', revenue: 304.1 }, { label: 'FY2025', revenue: 335.4 }],
      backlog: { valueM: 411.2, asOf: '2025-12-31', note: 'Record; book-to-bill 1.32' },
      notes: '2026 guidance is $450M–$500M of revenue. Q4 2025 included a $34.7M goodwill impairment.',
      asOf: '2026-02-25', src: S('Redwire FY2025 results', 'https://ir.rdw.com/sec-filings/all-sec-filings/content/0001819810-26-000019/exhibit991redwire12312025e.htm')
    },
    valuation: { evSales: null, note: 'Market cap is about 7.8× FY2025 revenue and about 5.5× the 2026 guidance midpoint.', asOf: '2026-09-04', src: S('MarketChameleon', 'https://marketchameleon.com/Overview/RDW/') },
    programs: [{ name: 'Army Long Range Reconnaissance (Stalker)', customer: 'US Army', role: 'Supplier', status: 'Fielding', note: 'More than 100 Stalker and Penguin UAS delivered to seven countries after the acquisition.' }]
  });

  DTM.add({
    id: 'voyager', name: 'Voyager Technologies', short: 'Voyager', domain: 'voyagertechnologies.com', status: 'public', ticker: 'VOYG', exchange: 'NYSE',
    hq: 'Denver, CO', country: 'US', founded: 2019,
    subsegments: ['space.mobility'],
    oneLiner: 'Defense and space technology group: national security systems plus the Starlab commercial space station.',
    description: [
      'Voyager combines a defense and national security business with commercial space ventures, most prominently the Starlab commercial space station being developed to succeed the International Space Station.',
      'It went public on the NYSE in June 2025 and raised its 2026 revenue guidance to $275M–$305M after a record Q2.'
    ],
    leadership: [['Dylan Taylor', 'Chairman & CEO']],
    products: ['Starlab', 'Defense & national security systems'],
    marketCap: { usdM: 2310, asOf: '2026-08-21', src: S('Equibles', 'https://equibles.com/stocks/VOYG') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [{ label: 'FY2024', revenue: 144.2 }, { label: 'FY2025', revenue: 166.4, netIncome: -104.8 }],
      notes: 'Q2 2026 revenue was a record $52.7M. 2026 revenue guidance raised to $275M–$305M.',
      asOf: '2026-08-21', src: S('Equibles', 'https://equibles.com/stocks/VOYG')
    },
    valuation: { note: 'Market cap is about 8× the 2026 revenue guidance midpoint.', asOf: '2026-08-21', src: S('Equibles', 'https://equibles.com/stocks/VOYG') },
    programs: []
  });
})();
