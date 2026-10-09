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
      { name: 'Golden Dome space-based interceptor prototype', ref: 'golden-dome', customer: 'US Space Force', role: '1 of 12 awardees', value: 'Up to $3.2B (pool)', year: 2026, status: 'Prototype', note: 'Space Systems Command OTA agreements; prototypes to be demonstrated by 2028.', src: S('MeriTalk, Apr 2026', 'https://www.meritalk.com/articles/space-force-taps-12-companies-for-golden-dome-space-based-interceptor/') },
      { name: 'NSSL Phase 3 Lane 2', ref: 'nssl', customer: 'US Space Force', role: 'Prime', value: '$5.9B', year: 2025, status: 'Production', note: '28 heavy national security missions, the largest share of the Phase 3 Lane 2 award.' },
      { name: 'Starshield / NRO proliferated constellation', customer: 'NRO', role: 'Prime', status: 'Deploying', note: 'Hundreds of Starshield-based reconnaissance satellites launched for the National Reconnaissance Office.' },
      { name: 'SDA Tranche 1 Tracking Layer', ref: 'pwsa', customer: 'Space Development Agency', role: 'Prime', value: '$149M', year: 2022, status: 'On orbit', note: 'Four missile-warning tracking satellites.' }
    ]
  });

  DTM.add({
    id: 'rocket-lab', name: 'Rocket Lab', domain: 'rocketlabcorp.com', status: 'public', ticker: 'RKLB', exchange: 'NASDAQ',
    hq: 'Long Beach, CA', country: 'US', founded: 2006,
    subsegments: ['space.launch', 'space.buses', 'missiles.hypertest'],
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
      { name: 'Golden Dome space-based interceptor prototype', ref: 'golden-dome', customer: 'US Space Force', role: '1 of 12 awardees (via SciTec)', value: 'Up to $3.2B (pool)', year: 2026, status: 'Prototype', note: 'SciTec, the missile-warning software business Firefly agreed to acquire, is one of the 12 awardees.', src: S('MeriTalk, Apr 2026', 'https://www.meritalk.com/articles/space-force-taps-12-companies-for-golden-dome-space-based-interceptor/') },
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
    programs: [
      { name: 'Golden Dome interceptor buses (for Northrop Grumman)', ref: 'golden-dome', customer: 'Northrop Grumman', role: 'Bus supplier', year: 2026, status: 'Development', note: 'Supplies satellite platforms for Northrop\'s space-based interceptor demo planned for 2027.', src: S('The Defense Post, Jun 2026', 'https://thedefensepost.com/2026/06/05/northrup-apex-space-interceptor/amp/') }
    ]
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
    programs: [
      { name: 'Golden Dome space-based interceptor prototype', ref: 'golden-dome', customer: 'US Space Force', role: '1 of 12 awardees', value: 'Up to $3.2B (pool)', year: 2026, status: 'Prototype', note: 'Selected among 12 companies in April 2026.', src: S('MeriTalk, Apr 2026', 'https://www.meritalk.com/articles/space-force-taps-12-companies-for-golden-dome-space-based-interceptor/') }
    ]
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
    programs: [
      { name: 'Golden Dome space technology (with Anduril)', ref: 'golden-dome', customer: 'DoD', role: 'Partner', year: 2026, status: 'Development', src: S('Business Standard, Apr 2026', 'https://www.business-standard.com/world-news/impulse-space-anduril-building-technology-for-trump-s-golden-dome-126040500157_1.html') }
    ]
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

  /* ---------------- Added from the space and hypersonics funding tables provided for this map ---------------- */
  const TBL = S('Space funding table provided for this map (Oct 2026)');

  DTM.add({
    id: 'sierra-space', name: 'Sierra Space', domain: 'sierraspace.com', status: 'private', stage: 'Series C',
    hq: 'Louisville, CO', country: 'US', founded: 2021,
    subsegments: ['space.stations', 'space.buses', 'missiles.propulsion'],
    oneLiner: 'Dream Chaser spaceplane, LIFE habitat and a fast-growing defense business building SDA missile-tracking satellites.',
    description: [
      'Sierra Space, spun out of Sierra Nevada Corporation in 2021, is developing the Dream Chaser reusable spaceplane and the inflatable LIFE habitat. Dream Chaser\'s first flight was changed in 2025 to a free-flying demonstration.',
      'Its defense unit, formally established in 2025, holds a $740M Space Development Agency contract for 18 Tranche 2 missile-tracking satellites. A March 2026 Series C of $550M valued the company at about $8B.'
    ],
    products: ['Dream Chaser', 'LIFE habitat', 'Missile-tracking satellites', 'Propulsion & thermal protection'],
    funding: {
      totalUsdM: 2270.6, roundCount: 4, lastDate: '2026-03', asOf: '2026-03',
      rounds: [{ date: '2026-03', type: 'Series C', amountUsdM: 550, postUsdM: 8000, leads: ['LuminArx Capital Management'] }],
      src: [TBL, S('Techleap (SpaceNews)', 'https://finder.techleap.nl/news/feed/sierra-space-raises-550m-in-series-c-funding-at-8b-valuation')]
    },
    programs: [
      { name: 'SDA Tranche 2 Tracking Layer', ref: 'pwsa', customer: 'Space Development Agency', role: 'Prime', value: '$740M', status: 'Production', note: '18 missile-tracking satellites; first 9 structures delivered January 2026.' },
      { name: 'NASA Commercial Resupply (Dream Chaser)', customer: 'NASA', role: 'Prime', status: 'Development' }
    ]
  });

  DTM.add({
    id: 'axiom-space', name: 'Axiom Space', short: 'Axiom', domain: 'axiomspace.com', status: 'private', stage: 'Growth',
    hq: 'Houston, TX', country: 'US', founded: 2016,
    subsegments: ['space.stations', 'space.buses'],
    oneLiner: 'Commercial space station modules, private astronaut missions and NASA\'s Artemis lunar spacesuits.',
    description: [
      'Axiom Space runs private astronaut missions to the ISS and is building the first modules of a commercial space station, with the first module due to launch in 2028. It also builds the AxEMU spacesuits for NASA\'s Artemis lunar landings, with delivery planned for 2027.',
      'It raised $350M in February 2026 and extended the round to more than $525M in June 2026, with MUFG Bank joining as an investor.'
    ],
    products: ['Axiom Station', 'AxEMU spacesuit', 'Orbital data center nodes'],
    funding: {
      totalUsdM: 1112.7, roundCount: 18, lastDate: '2026-06', asOf: '2026-06',
      rounds: [{ date: '2026-02', type: 'Growth', amountUsdM: 350, leads: ['Type One Ventures', 'Qatar Investment Authority'] }, { date: '2026-06', type: 'Growth ext.', amountUsdM: 175, leads: ['MUFG Bank'] }],
      src: [TBL, S('Bloomberg Government, Jun 2026', 'https://news.bgov.com/private-equity/axiom-space-raises-525-million-with-mufg-bank-as-new-investor')]
    },
    programs: [{ name: 'Artemis AxEMU spacesuits', customer: 'NASA', role: 'Prime', status: 'Development' }]
  });

  DTM.add({
    id: 'varda', name: 'Varda Space Industries', short: 'Varda', domain: 'varda.com', status: 'private', stage: 'Series D',
    hq: 'El Segundo, CA', country: 'US', founded: 2020,
    subsegments: ['space.stations', 'missiles.hypertest'],
    oneLiner: 'Reentry capsules that double as Mach 25 hypersonic test beds for the Air Force.',
    description: [
      'Varda flies W-series capsules that manufacture pharmaceuticals in orbit and return them to Earth, re-entering at around Mach 25. That makes each return a hypersonic flight test, and AFRL\'s Prometheus program has flown thermal-protection, navigation and other payloads on W-5 through W-9.',
      'AFRL awarded a four-year, $48M reentry testing contract, following a $60M SpaceWERX STRATFI in 2023. Varda has more than a dozen launches booked through 2028.'
    ],
    leadership: [['Will Bruey', 'Co-founder & CEO']],
    products: ['W-series capsule'],
    funding: {
      totalUsdM: 579, roundCount: 9, lastDate: '2026-09', asOf: '2026-09',
      note: 'Includes a $251M Series D.',
      src: [TBL, S('Fierce Pharma', 'https://www.fiercepharma.com/pharma/varda-brings-home-251m-series-d-fuel-space-based-drug-manufacturing')]
    },
    programs: [
      { name: 'AFRL Prometheus reentry testing', ref: 'hypersonic-test', customer: 'AFRL', role: 'Prime', value: '$48M', year: 2024, status: 'Flying', src: S('AFWERX', 'https://afwerx.com/news/afwerx-spacewerx-sbir-sttr-program-revolutionizes-hypersonic-testing-with-commercial-re-entry-capsules/') },
      { name: 'SpaceWERX STRATFI', customer: 'US Space Force / AFRL', role: 'Prime', value: '$60M', year: 2023, status: 'Complete' }
    ]
  });

  DTM.add({
    id: 'loft-orbital', name: 'Loft Orbital', short: 'Loft', domain: 'loftorbital.com', status: 'private', stage: 'Series C',
    hq: 'San Francisco, CA', country: 'US', founded: 2017,
    subsegments: ['space.buses'],
    oneLiner: 'Space infrastructure as a service: hosts customer payloads and software on shared satellites.',
    description: [
      'Loft Orbital operates satellites that carry multiple customers\' sensors and software applications, so government and commercial users can fly missions without buying a dedicated spacecraft. It operates from San Francisco and Toulouse.'
    ],
    leadership: [['Pierre-Damien Vaujour', 'Co-founder & CEO']],
    products: ['Longbow', 'Cockpit mission software'],
    funding: { totalUsdM: 326.2, roundCount: 10, lastDate: '2026-06', asOf: '2026-06', src: TBL },
    programs: []
  });

  DTM.add({
    id: 'enduro-sat', name: 'EnduroSat', domain: 'endurosat.com', status: 'private', stage: 'Series B',
    hq: 'Sofia', country: 'BG', founded: 2015,
    subsegments: ['space.buses'],
    oneLiner: 'European small-satellite buses and shared satellite missions built at volume in Bulgaria.',
    description: [
      'EnduroSat builds modular small-satellite platforms and flies shared missions for commercial and government payloads from its factory in Sofia, Bulgaria.'
    ],
    leadership: [['Raycho Raychev', 'Founder & CEO']],
    funding: { totalUsdM: 187.3, roundCount: 10, lastDate: '2025-10', asOf: '2025-10', src: TBL },
    programs: []
  });

  DTM.add({
    id: 'ramon-space', name: 'Ramon.Space', domain: 'ramon.space', status: 'private', stage: 'Series B',
    hq: 'Tel Aviv', country: 'IL', founded: 2004,
    subsegments: ['space.buses'],
    oneLiner: 'Radiation-hardened space computers and processors for satellites.',
    description: [
      'Ramon.Space makes radiation-resilient computing systems that let satellites run AI and signal processing on board.'
    ],
    funding: { totalUsdM: 43.5, roundCount: 3, lastDate: '2023-06', asOf: '2023-06', src: TBL },
    programs: []
  });

  DTM.add({
    id: 'sophia-space', name: 'Sophia Space', status: 'private', stage: 'Seed',
    hq: 'Pasadena, CA', country: 'US', founded: 2024,
    subsegments: ['space.buses', 'sensors.comms'],
    oneLiner: 'Orbital edge computing: satellites built to process data in space.',
    description: [
      'Sophia Space builds compute-heavy satellites to process sensor data in orbit, with a demonstration mission on an Apex Nova bus planned for 2027. In September 2026 it announced a $300M non-binding leasing framework with SLI to finance a 10-satellite constellation.'
    ],
    leadership: [['Rob DeMillo', 'Co-founder & CEO'], ['Leon Alkalai', 'Founder & Chairman']],
    funding: {
      totalUsdM: 14.6, roundCount: 4, lastDate: '2026-08', asOf: '2026-08',
      note: 'Company announcements describe a $10M seed (March 2026) and a $7M SAFE (June 2026).',
      src: [TBL, S('Satellite Today, Jun 2026', 'https://www.satellitetoday.com/technology/2026/06/23/sophia-space-raises-7m-selects-apex-space-bus-for-orbital-compute-demo/')]
    },
    programs: []
  });

  DTM.add({
    id: 'digantara', name: 'Digantara', domain: 'digantara.co.in', status: 'private', stage: 'Series A',
    hq: 'Bengaluru', country: 'IN', founded: 2018,
    subsegments: ['space.sda'],
    oneLiner: 'Indian space surveillance company with its own SSA satellites and a US subsidiary.',
    description: [
      'Digantara builds space-based surveillance satellites and a space mission assurance platform that tracks objects in orbit, and has expanded into the US market.'
    ],
    leadership: [['Anirudh Sharma', 'Co-founder & CEO']],
    funding: { totalUsdM: 64.4, roundCount: 5, lastDate: '2025-12', asOf: '2025-12', src: TBL },
    programs: []
  });

  DTM.add({
    id: 'neuraspace', name: 'Neuraspace', domain: 'neuraspace.com', status: 'private', stage: 'Series A',
    hq: 'Coimbra', country: 'PT', founded: 2020,
    subsegments: ['space.sda'],
    oneLiner: 'AI space traffic management with its own optical sensor network.',
    description: [
      'Neuraspace provides AI-based collision avoidance and space traffic management, backed by a growing network of telescopes, for satellite operators in Europe and beyond.'
    ],
    leadership: [['Chiara Manfletti', 'CEO']],
    funding: { totalUsdM: 20.8, roundCount: 2, lastDate: '2026-08', asOf: '2026-08', src: TBL },
    programs: []
  });

  DTM.add({
    id: 'fortastra', name: 'Fortastra', status: 'private', stage: 'Seed',
    hq: '', country: 'US', founded: 2025,
    subsegments: ['space.counterspace'],
    oneLiner: 'Maneuverable bodyguard satellites that inspect and defend high-value spacecraft.',
    description: [
      'Fortastra builds intelligent, maneuverable spacecraft that use sensing, autonomy and defensive rendezvous and proximity operations to protect government and commercial satellites from threats such as co-orbital attackers.',
      'Its $8M seed, led by Upfront Ventures, was announced in December 2025.'
    ],
    leadership: [['Mike Smayda', 'Founder & CEO']],
    funding: {
      totalUsdM: 38, roundCount: 2, lastDate: '2026-10', asOf: '2026-10',
      rounds: [{ date: '2025-12', type: 'Seed', amountUsdM: 8, leads: ['Upfront Ventures'] }],
      investors: ['Upfront Ventures', 'Generational Partners', 'Forward Deployed VC', 'Bloomberg Beta'],
      src: [TBL, S('Payload', 'https://payloadspace.com/fortastra-lands-8m-seed-to-develop-orbital-defense-sats/')]
    },
    programs: []
  });

  DTM.add({
    id: 'd-orbit', name: 'D-Orbit', domain: 'dorbit.space', status: 'private', stage: 'Series C',
    hq: 'Fino Mornasco', country: 'IT', founded: 2011,
    subsegments: ['space.mobility'],
    oneLiner: 'ION orbital transfer vehicles delivering satellites to precise orbits; Europe\'s space logistics leader.',
    description: [
      'D-Orbit operates the ION Satellite Carrier, an orbital transfer vehicle that deploys satellites to custom orbits and hosts payloads, and is developing in-orbit servicing.'
    ],
    leadership: [['Luca Rossettini', 'Founder & CEO']],
    products: ['ION Satellite Carrier'],
    funding: { totalUsdM: 248.7, roundCount: 14, lastDate: '2026-01', asOf: '2026-01', src: TBL },
    programs: []
  });

  DTM.add({
    id: 'gitai', name: 'GITAI USA', domain: 'gitai.tech', status: 'private', stage: 'Subsidiary',
    hq: 'Torrance, CA', country: 'US', founded: 2016,
    subsegments: ['space.mobility', 'space.counterspace'],
    oneLiner: 'Space robotics for on-orbit servicing and assembly; a Golden Dome interceptor awardee.',
    description: [
      'GITAI USA is the US arm of Japan\'s GITAI, which develops robotic arms, inchworm robots and rovers for on-orbit servicing, assembly and lunar operations. The parent company is listed in Tokyo.',
      'It was one of 12 companies picked in April 2026 for Golden Dome space-based interceptor prototypes.'
    ],
    leadership: [['Sho Nakanose', 'Founder & CEO']],
    funding: { totalUsdM: 81.7, roundCount: 8, lastDate: '2024-11', asOf: '2024-11', note: 'Funding shown for GITAI USA; the Japanese parent is listed on the Tokyo Stock Exchange.', src: TBL },
    programs: [{ name: 'Golden Dome space-based interceptor prototype', ref: 'golden-dome', customer: 'US Space Force', role: '1 of 12 awardees', value: 'Up to $3.2B (pool)', year: 2026, status: 'Prototype', src: S('MeriTalk, Apr 2026', 'https://www.meritalk.com/articles/space-force-taps-12-companies-for-golden-dome-space-based-interceptor/') }]
  });

  DTM.add({
    id: 'benchmark-space', name: 'Benchmark Space Systems', short: 'Benchmark', domain: 'benchmarkspacesystems.com', status: 'private', stage: 'Series B',
    hq: 'South Burlington, VT', country: 'US', founded: 2017,
    subsegments: ['space.mobility'],
    oneLiner: 'In-space chemical and electric propulsion for maneuverable satellites.',
    description: [
      'Benchmark builds propulsion systems, from non-toxic chemical thrusters to electric propulsion, that let small and medium satellites maneuver, a requirement for dynamic space operations.'
    ],
    leadership: [['Ryan McDevitt', 'Co-founder & CEO']],
    products: ['Halcyon thrusters', 'Ocelot', 'Xantus'],
    funding: { totalUsdM: 45.5, roundCount: 7, lastDate: '2025-07', asOf: '2025-07', src: TBL },
    programs: []
  });

  DTM.add({
    id: 'katalyst', name: 'Katalyst Space Technologies', short: 'Katalyst', domain: 'katalystspace.com', status: 'private', stage: 'Seed',
    hq: 'Flagstaff, AZ', country: 'US', founded: 2020,
    subsegments: ['space.mobility'],
    oneLiner: 'Robotic servicing spacecraft; flew NASA\'s mission to reboost the Swift observatory.',
    description: [
      'Katalyst builds robotic servicing spacecraft that can capture satellites never designed for servicing. NASA awarded it a $30M contract to boost the Swift space telescope\'s orbit with its LINK spacecraft. Reports in 2026 described the spacecraft in a spin after reaction-wheel problems.'
    ],
    leadership: [['Ghonhee Lee', 'CEO']],
    products: ['LINK servicer'],
    funding: { totalUsdM: 12.9, roundCount: 2, lastDate: '2026-06', asOf: '2026-06', src: TBL },
    programs: [{ name: 'Swift observatory reboost', customer: 'NASA', role: 'Prime', value: '$30M', year: 2025, status: 'On orbit', src: S('KJZZ', 'https://www.kjzz.org/fronteras-desk/2025-10-27/flagstaff-based-company-wins-30m-contract-for-nasa-space-rescue-mission') }]
  });

  DTM.add({
    id: 'thinkorbital', name: 'ThinkOrbital', domain: 'thinkorbital.com', status: 'private', stage: 'Seed',
    hq: 'Lafayette, CO', country: 'US', founded: 2021,
    subsegments: ['space.mobility'],
    oneLiner: 'In-space welding, cutting and assembly of large orbital structures.',
    description: [
      'ThinkOrbital develops robotic tools for in-space fabrication, including electron-beam welding and cutting, to build and repair large structures in orbit.'
    ],
    leadership: [['Lee Rosen', 'Co-founder & CEO']],
    funding: { totalUsdM: null, label: 'Undisclosed', roundCount: 2, lastDate: '2026-01', asOf: '2026-01', src: TBL },
    programs: []
  });

  DTM.add({
    id: 'rogue-space', name: 'Rogue Space Systems', short: 'Rogue Space', domain: 'rogue.space', status: 'private', stage: 'Early',
    hq: 'Laconia, NH', country: 'US', founded: 2020,
    subsegments: ['space.mobility'],
    oneLiner: 'Small orbital robots ("orbots") for inspection, servicing and debris work.',
    description: [
      'Rogue Space Systems builds small, maneuverable orbital robots for satellite inspection, servicing and space situational awareness.'
    ],
    leadership: [['Brook Leonard', 'CEO'], ['Jeromy Grimmett', 'Founder']],
    funding: { totalUsdM: null, label: 'Undisclosed', asOf: '2026-10', src: TBL },
    programs: []
  });

  DTM.add({
    id: 'capella-space', name: 'Capella Space', short: 'Capella', domain: 'capellaspace.com', status: 'private', stage: 'Acquired (IonQ)',
    hq: 'San Francisco, CA', country: 'US', founded: 2016,
    subsegments: ['space.isr'],
    oneLiner: 'High-resolution SAR satellites; acquired by quantum computing company IonQ in 2025.',
    description: [
      'Capella operates a constellation of synthetic aperture radar satellites providing high-resolution, all-weather imaging to US and allied defense and intelligence customers.',
      'IonQ acquired Capella in 2025. The funding shown is what Capella raised before the acquisition.'
    ],
    funding: { totalUsdM: 234.3, roundCount: 11, lastDate: '2023-01', asOf: '2023-01', note: 'Raised before its 2025 acquisition by IonQ.', src: TBL },
    programs: [{ name: 'Commercial SAR for the intelligence community', ref: 'eocl', customer: 'NRO / NGA', role: 'Data provider', status: 'Operational' }]
  });

  DTM.add({
    id: 'northwood-space', name: 'Northwood Space', short: 'Northwood', domain: 'northwoodspace.io', status: 'private', stage: 'Series B',
    hq: 'El Segundo, CA', country: 'US', founded: 2024,
    subsegments: ['space.ground'],
    oneLiner: 'Mass-produced phased-array ground stations; modernizing the Space Force\'s Satellite Control Network.',
    description: [
      'Northwood builds phased-array ground stations designed to be mass-produced, providing ground-to-space data links as a service.',
      'In January 2026 it raised a $100M Series B led by Washington Harbour Partners and Andreessen Horowitz and won a $49.8M Space Force contract to modernize the Satellite Control Network.'
    ],
    leadership: [['Bridgit Mendler', 'Co-founder & CEO'], ['Griffin Cleverly', 'Co-founder']],
    products: ['Portal ground station'],
    funding: {
      totalUsdM: 136.3, roundCount: 4, lastDate: '2026-03', asOf: '2026-03',
      rounds: [{ date: '2026-01', type: 'Series B', amountUsdM: 100, leads: ['Washington Harbour Partners', 'Andreessen Horowitz'] }],
      src: [TBL, S('Forbes Colombia, Feb 2026', 'https://forbes.co/2026/02/06/negocios/bridgit-mendler-la-exactriz-de-disney-que-se-convirtio-en-ceo-de-una-empresa-espacial')]
    },
    programs: [{ name: 'Satellite Control Network modernization', customer: 'US Space Force', role: 'Prime', value: '$49.8M', year: 2026, status: 'Development' }]
  });

  DTM.add({
    id: 'antaris', name: 'Antaris', domain: 'antaris.space', status: 'private', stage: 'Series A',
    hq: 'Los Altos, CA', country: 'US', founded: 2021,
    subsegments: ['space.ground'],
    oneLiner: 'Cloud software to design, simulate and operate satellite missions.',
    description: [
      'Antaris provides an end-to-end software platform, including digital twins, for designing, testing and operating satellites, aimed at shortening mission timelines.'
    ],
    leadership: [['Tom Barton', 'Co-founder & CEO'], ['Karthik Govindhasamy', 'Co-founder & CTO']],
    funding: { totalUsdM: 35.7, roundCount: 5, lastDate: '2026-03', asOf: '2026-03', note: 'Includes a $28M Series A led by WestWave Capital (March 2026).', src: TBL },
    programs: []
  });

  DTM.add({
    id: 'quindar', name: 'Quindar', domain: 'quindar.space', status: 'private', stage: 'Series A',
    hq: 'Denver, CO', country: 'US', founded: 2021,
    subsegments: ['space.ground'],
    oneLiner: 'Cloud mission-control software for satellite fleets; a Golden Dome interceptor awardee.',
    description: [
      'Quindar builds cloud-native mission operations software that automates commanding and monitoring of satellite constellations. Its customers include the Air Force and NRO.',
      'It raised an $18M Series A led by Washington Harbour Partners in November 2025 and was one of 12 Golden Dome space-based interceptor awardees in April 2026.'
    ],
    leadership: [['Nate Hamet', 'Co-founder & CEO']],
    funding: { totalUsdM: 26.5, roundCount: 5, lastDate: '2026-06', asOf: '2026-06', src: TBL },
    programs: [{ name: 'Golden Dome space-based interceptor prototype', ref: 'golden-dome', customer: 'US Space Force', role: '1 of 12 awardees', value: 'Up to $3.2B (pool)', year: 2026, status: 'Prototype', src: S('MeriTalk, Apr 2026', 'https://www.meritalk.com/articles/space-force-taps-12-companies-for-golden-dome-space-based-interceptor/') }]
  });

  DTM.add({
    id: 'auria', name: 'Auria', domain: 'auriaspace.com', status: 'private', stage: 'PE-owned',
    hq: 'Colorado Springs, CO', country: 'US', founded: 2024,
    subsegments: ['space.ground'],
    oneLiner: 'Space Force ground systems, SATCOM and mission-planning software roll-up backed by Enlightenment Capital.',
    description: [
      'Auria was formed in 2024 when Enlightenment Capital combined Boecore, Ascension Engineering, Orbit Logic and La Jolla Logic. It provides ground systems, SATCOM, mission planning and DevSecOps for the Space Force, and bought BCubed Engineering in February 2026.'
    ],
    funding: { totalUsdM: null, label: 'PE-owned', asOf: '2026-02', note: 'Owned by Enlightenment Capital.', src: S('Business Wire, Feb 2026', 'https://www.businesswire.com/news/home/20260203910428/en/Auria-Announces-the-Acquisition-of-BCubed') },
    programs: []
  });

  DTM.add({
    id: 'sphinx-defense', name: 'Sphinx Defense', status: 'private', stage: 'Early',
    hq: 'Washington, DC', country: 'US', founded: 2020,
    subsegments: ['space.ground'],
    oneLiner: 'Vehicle-agnostic ground communications that let operators use many antenna networks.',
    description: [
      'Sphinx Defense builds national-security ground software that connects satellite operators to many antenna networks and moves data in near real time. It won a $9.5M Space Force prototype contract in 2025 and is on a $1B ground-software IDIQ.'
    ],
    funding: { totalUsdM: null, label: 'Undisclosed', asOf: '2026-10', src: TBL },
    programs: [{ name: 'Space Force ground communications prototype', customer: 'US Space Force', role: 'Prime', value: '$9.5M', year: 2025, status: 'Prototype' }]
  });
  /* ---------------- Added from the public names sheet provided for this map (undated) ---------------- */
  {
    const CSV = S('Public defense names sheet provided for this map (undated)');

    DTM.add({
      id: 'spire-global', name: 'Spire Global', short: 'Spire', domain: 'spire.com', status: 'public', ticker: 'SPIR', exchange: 'NYSE',
      hq: 'Vienna, VA', country: 'US', founded: 2012,
      subsegments: ['space.isr'],
      oneLiner: 'Nanosatellite constellation for weather, RF and space-based data; on MDA\'s SHIELD IDIQ after selling its maritime arm.',
      description: ['Spire operates a large constellation of nanosatellites that collect radio occultation weather data and RF signals, and builds and operates satellites for others. It sold its maritime data business to Kpler for about $239M in April 2025, so 2025 revenue fell to $71.6M from $110.5M. It was selected for the Missile Defense Agency\'s SHIELD IDIQ, won an $11.2M NOAA data contract and expects more than 30% growth in 2026 for its remaining business.'],
      marketCap: { usdM: 420, asOf: '2026', undated: true, src: CSV },
      financials: { cur: 'USD', fyEnd: 'Dec', periods: [{ label: 'FY2024', revenue: 110.5 }, { label: 'FY2025', revenue: 71.6 }], notes: 'FY2025 includes $21.0M from the maritime business sold in April 2025.', asOf: '2026-03', src: S('Spire FY2025 results', 'https://seekingalpha.com/pr/20442235') },
      valuation: { evSales: 5.18, basis: 'EV / Sales, current fiscal year (sheet)', note: 'From the public names sheet provided for this map (undated). EV / Sales on next fiscal year: 3.22×.', asOf: '2026', undated: true, ebitdaBasis: 'EV / EBITDA on the sheet (undated)', src: CSV },
      programs: [{ name: 'SHIELD IDIQ', ref: 'golden-dome', customer: 'Missile Defense Agency', role: 'Prime', status: 'Awarded', src: S('AeroMorning', 'https://aeromorning.com/en/spire-global-2025-results-a-transition-year-masks-early-signs-of-stabilization/') }]
    });

    DTM.add({
      id: 'mda-space', name: 'MDA Space', domain: 'mda.space', status: 'public', ticker: 'MDA', exchange: 'TSX',
      hq: 'Brampton, ON', country: 'CA', founded: 1969,
      subsegments: ['space.buses', 'space.isr'],
      oneLiner: 'Canadian satellite maker (Telesat Lightspeed, Globalstar), robotics and SAR; record C$1.6B revenue in 2025.',
      description: ['MDA Space builds satellites and constellations, space robotics such as Canadarm, and radar Earth observation. 2025 revenue rose 51% to a record C$1,633M, driven by Telesat Lightspeed and Globalstar satellite programs, with a backlog of about C$4B. It guides to C$1.7B–C$1.9B for 2026 and set up 49North, a dedicated defense subsidiary.'],
      marketCap: { usdM: 4569, local: { cur: 'CAD', valueM: 6346 }, asOf: '2026', undated: true, src: S('Public defense names sheet provided for this map (undated); CAD converted at about 0.72') },
      financials: { cur: 'CAD', fyEnd: 'Dec', periods: [{ label: 'FY2025', revenue: 1633, ebitda: 324 }], notes: 'Backlog about C$4B at end-2025; 2026 guidance C$1.7B–C$1.9B.', asOf: '2026-03-04', src: S('MDA Space FY2025 results', 'https://mda-en.investorroom.com/2026-03-04-MDA-SPACE-REPORTS-FOURTH-QUARTER-AND-FISCAL-2025-RESULTS') },
      valuation: { evSales: 3.38, evEbitda: 22.03, pe: 48.65, peBasis: 'P / E on the sheet (undated)', basis: 'EV / Sales, current fiscal year (sheet)', note: 'From the public names sheet provided for this map (undated). EV / Sales on next fiscal year: 2.31×.', asOf: '2026', undated: true, ebitdaBasis: 'EV / EBITDA on the sheet (undated)', src: CSV }
    });
  }
})();
