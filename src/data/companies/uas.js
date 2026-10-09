/* Drones & Air Autonomy segment. Anduril (software.js), Kratos and AeroVironment (missiles.js),
   Redwire (space.js) and Helsing (missiles.js) also appear here. */
(function () {
  const S = (t, u) => (u ? { t, u } : { t });

  /* ---------------- Small UAS & FPV ---------------- */
  DTM.add({
    id: 'skydio', name: 'Skydio', domain: 'skydio.com', status: 'private', stage: 'Series F',
    hq: 'San Mateo, CA', country: 'US', founded: 2014,
    subsegments: ['uas.small', 'uas.autonomy'],
    oneLiner: 'Largest US drone maker; autonomous X10D quadcopters for the Army and docks for public safety.',
    description: [
      'Skydio builds autonomous quadcopters that use onboard computer vision to fly in GPS-denied and cluttered environments. The X10D is a program-of-record drone for the US Army, and the company has shipped more than 60,000 drones to over 3,800 customers.',
      'In March 2026 the Army ordered about 3,000 X10Ds ($52M), described as the largest single-vendor small UAS buy in US military history. Skydio raised a deliberately small $110M Series F at $4.4B in April 2026.'
    ],
    leadership: [['Adam Bry', 'Co-founder & CEO']],
    products: ['X10D', 'X10', 'R10', 'Skydio Dock'],
    funding: {
      totalUsdM: 951, asOf: '2026-04',
      rounds: [
        { date: '2023-02', type: 'Series E', amountUsdM: 230, postUsdM: 2200, leads: ['Linse Capital'] },
        { date: '2026-04', type: 'Series F', amountUsdM: 110, postUsdM: 4400 }
      ],
      investors: ['Andreessen Horowitz', 'Linse Capital', 'Next47', 'NVIDIA'],
      note: 'Total is a third-party estimate. A June 2026 secondary-market listing implied about $5.3B.',
      src: [S('DroneXL, Apr 2026', 'https://dronexl.co/2026/04/23/skydio-110m-series-f-44-billion-valuation/'), S('StockAnalysis', 'https://stockanalysis.com/private/skydio/')]
    },
    revenue: { valueUsdM: 180, period: 'FY2024', kind: 'estimate', note: 'Third-party estimate at the Series E extension', src: S('Multiples.vc', 'https://multiples.vc/private-comps/skydio') },
    programs: [
      { name: 'X10D Short Range Reconnaissance', ref: 'srr', customer: 'US Army', role: 'Prime', value: '$52M', year: 2026, status: 'Production', note: 'Order for about 2,500–3,000 X10D drones.', src: S('Tectonic Defense', 'https://www.tectonicdefense.com/skydio-raises-110m-at-4-4b-valuation/') },
      { name: 'Skydio drones in Ukraine', ref: 'ukraine', customer: 'Ukraine', role: 'Supplier', status: 'Fielded' }
    ]
  });

  DTM.add({
    id: 'neros', name: 'Neros', domain: 'neros.tech', status: 'private', stage: 'Series C',
    hq: 'El Segundo, CA', country: 'US', founded: 2023,
    subsegments: ['uas.small', 'cuas.kinetic'],
    oneLiner: 'Mass-produced FPV strike drones (Archer) and interceptor drones (Bandit) at Ukraine-war volumes.',
    description: [
      'Neros builds low-cost first-person-view drones with a domestic, non-Chinese supply chain. Its Archer FPV has been supplied to Ukraine and US forces, and it was producing about 1,200 drones a week by mid-2026, with a target of one million a year by 2028.',
      'The Army awarded an IDIQ worth up to $500M for Archer under the Purpose-Built Attritable Systems effort. Its $250M Series C in August 2026 funds Archer AI terminal guidance and the Bandit counter-drone interceptor.'
    ],
    leadership: [['Soren Monroe-Anderson', 'Co-founder & CEO']],
    products: ['Archer', 'Archer AI', 'Bandit'],
    funding: {
      totalUsdM: 371, asOf: '2026-08',
      rounds: [
        { date: '2025-11', type: 'Series B', amountUsdM: 75 },
        { date: '2026-08', type: 'Series C', amountUsdM: 250, postUsdM: 2500, leads: ['Sequoia', 'American Strategic Technology Fund'] }
      ],
      investors: ['Sequoia', 'Interlagos', 'Valor Equity Partners', 'Thiel Capital', 'Spark Capital', 'Allen & Company'],
      src: [S('The Robot Report, Aug 2026', 'https://www.therobotreport.com/neros-technologies-raises-250m-to-deploy-its-defense-drones-by-the-end-of-2026/'), S('StockAnalysis', 'https://stockanalysis.com/private/neros/')]
    },
    programs: [
      { name: 'Archer FPV (Purpose-Built Attritable Systems)', ref: 'pbas', customer: 'US Army', role: 'Prime', value: 'Up to $500M (IDIQ)', status: 'Production' },
      { name: 'FPV drones for the Marine Corps', customer: 'USMC', role: 'Prime', status: 'Delivering', note: 'Reported order for roughly 8,000 FPV drones in 2025.' },
      { name: 'Archer for Ukraine', ref: 'ukraine', customer: 'Ukraine', role: 'Supplier', status: 'Fielded' }
    ]
  });

  DTM.add({
    id: 'red-cat', name: 'Red Cat', domain: 'redcat.red', status: 'public', ticker: 'RCAT', exchange: 'NASDAQ',
    hq: 'San Juan, PR', country: 'US', founded: 2016,
    subsegments: ['uas.small'],
    oneLiner: 'Teal Black Widow quadcopter, the Army\'s Short Range Reconnaissance program-of-record winner.',
    description: [
      'Red Cat owns Teal Drones, maker of the Black Widow small UAS, which won the Army\'s Short Range Reconnaissance Tranche 2 program in 2024, plus FlightWave fixed-wing drones and an uncrewed surface vessel line.',
      'Revenue more than doubled in 2025 as SRR deliveries ramped, and Q2 2026 revenue rose about 520% year on year.'
    ],
    leadership: [['Jeff Thompson', 'CEO']],
    products: ['Black Widow', 'Edge 130', 'FANG FPV', 'Blue Ops USVs'],
    marketCap: { usdM: 969, asOf: '2026-10-05', src: S('Google Finance', 'https://www.google.com/finance/labs/quote/RCAT:NASDAQ') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [{ label: 'FY2024', revenue: 15.6 }, { label: 'FY2025', revenue: 37.2 }],
      notes: 'Q1 2026 revenue $15.5M; Q2 2026 $20.2M. Company preliminary 2025 revenue was $38M–$41M.',
      asOf: '2026-08-14', src: [S('Red Cat preliminary FY2025 revenue', 'https://ir.redcatholdings.com/news-events/press-releases/detail/208'), S('Ladenburg Thalmann', 'https://www.ladenburg.com/redcat')]
    },
    valuation: { evSales: 26, basis: 'Market cap ÷ FY2025 revenue', note: 'EV not compiled; ratio shown uses market cap.', asOf: '2026-10-05', src: S('Google Finance', 'https://www.google.com/finance/labs/quote/RCAT:NASDAQ') },
    programs: [{ name: 'Short Range Reconnaissance Tranche 2', ref: 'srr', customer: 'US Army', role: 'Prime', year: 2024, status: 'Production', note: 'Black Widow selected as the Army program of record.' }]
  });

  DTM.add({
    id: 'pdw', name: 'Performance Drone Works', short: 'PDW', domain: 'pdw.ai', status: 'private', stage: 'Series B',
    hq: 'Huntsville, AL', country: 'US', founded: 2017,
    subsegments: ['uas.small'],
    oneLiner: 'C100 modular, NDAA-compliant tactical quadcopter for Army and special operations units.',
    description: [
      'Performance Drone Works makes the C100, a rugged, modular small UAS with swappable payloads for reconnaissance and delivery. It builds in Huntsville with an NDAA-compliant supply chain, and its drones are in service with US Army and special operations units.'
    ],
    products: ['C100'],
    funding: {
      totalUsdM: null, label: 'Undisclosed', asOf: '2026-03',
      note: 'One aggregator lists a $110M Series B in March 2026 with Lux Capital and Ondas among investors; not confirmed by the company.',
      src: S('VCBacked', 'https://vcbacked.co/company/performance-drone-works')
    },
    programs: [{ name: 'Army company-level small UAS', customer: 'US Army', role: 'Supplier', status: 'Fielding' }]
  });

  DTM.add({
    id: 'ondas', name: 'Ondas Holdings', short: 'Ondas', domain: 'ondas.com', status: 'public', ticker: 'ONDS', exchange: 'NASDAQ',
    hq: 'Boston, MA', country: 'US', founded: 2006,
    subsegments: ['uas.small', 'cuas.kinetic'],
    oneLiner: 'Optimus drone-in-a-box and Iron Drone Raider interceptors; a fast-growing autonomous systems roll-up.',
    description: [
      'Ondas Autonomous Systems sells the Optimus autonomous drone-in-a-box system and the Iron Drone Raider counter-drone interceptor, mainly to Israeli and allied defense and security customers. It has also invested in or acquired a string of drone and defense companies.',
      'Revenue grew about 7× to $50.7M in 2025, and in March 2026 the company raised its 2026 target to at least $375M.'
    ],
    leadership: [['Eric Brock', 'Chairman & CEO']],
    products: ['Optimus', 'Iron Drone Raider'],
    marketCap: { usdM: 4640, asOf: '2026-03-25', src: S('MEXC News, Mar 2026', 'https://www.mexc.com/news/977389') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [{ label: 'FY2024', revenue: 7.2 }, { label: 'FY2025', revenue: 50.7 }],
      notes: '2026 revenue target raised to at least $375M (March 2026). Q2 2026 gross margin fell to 43.1%.',
      asOf: '2026-08-14', src: [S('MEXC News, Mar 2026', 'https://www.mexc.com/news/977389'), S('Eastern Progress (Zacks)', 'https://www.easternprogress.com/ondas-posts-wider-than-expected-q2-loss-delivers-solid-revenue-growth/article_ed5987a1-c8cf-57c0-8705-6017b738cbb1.html')]
    },
    valuation: { evSales: 12.4, basis: 'Market cap ÷ 2026 revenue target', note: 'EV not compiled. Trades near 92× FY2025 revenue.', asOf: '2026-03-25', src: S('MEXC News', 'https://www.mexc.com/news/977389') },
    programs: [{ name: 'Optimus order from a major defense customer', customer: 'Undisclosed defense customer', role: 'Prime', value: '$14.3M', year: 2025, status: 'Delivering', src: S('Ondas IR', 'https://ir.ondas.com/press-releases/detail/224/') }]
  });

  /* ---------------- Tactical & Group 3 ---------------- */
  DTM.add({
    id: 'shield-ai', name: 'Shield AI', domain: 'shield.ai', status: 'private', stage: 'Series G',
    hq: 'San Diego, CA', country: 'US', founded: 2015,
    subsegments: ['uas.tactical', 'uas.autonomy', 'uas.cca'],
    oneLiner: 'Hivemind AI pilot, V-BAT VTOL drones and the X-BAT autonomous VTOL fighter.',
    description: [
      'Shield AI builds Hivemind, an AI pilot that flies aircraft without GPS or communications, and the V-BAT, a tail-sitting VTOL drone used by the US Coast Guard, Navy, Army and allies, including in Ukraine. In October 2025 it unveiled X-BAT, an autonomous VTOL fighter with a first flight targeted for late 2026.',
      'A $2B raise in March 2026 ($1.5B Series G equity plus $500M preferred from Blackstone) valued it at $12.7B and funds the acquisition of simulation company Aechelon. Reuters reported a run of V-BAT crashes in 2026, which the company disputes stemmed from product defects.'
    ],
    leadership: [['Gary Steele', 'CEO'], ['Brandon Tseng', 'Co-founder & President']],
    products: ['Hivemind', 'V-BAT', 'X-BAT', 'Hivemind Enterprise'],
    funding: {
      totalUsdM: 3000, asOf: '2026-03',
      rounds: [
        { date: '2025-03', type: 'Series F-1', amountUsdM: 240, postUsdM: 5300 },
        { date: '2026-03', type: 'Series G', amountUsdM: 2000, postUsdM: 12700, leads: ['Advent International', 'JPMorganChase'] }
      ],
      investors: ['Advent International', 'JPMorganChase', 'Blackstone', 'Andreessen Horowitz', 'L3Harris', 'Hanwha Aerospace'],
      note: 'Series G was $1.5B of equity plus $500M of Blackstone preferred. Total is approximate.',
      src: [S('Fortune, Mar 2026', 'https://fortune.com/2026/03/26/shield-ai-revenue-series-g-funding-12-billion-valuation'), S('Bloomberg Law', 'https://news.bloomberglaw.com/private-equity/defense-startup-shield-ai-nabs-2-billion-at-12-7-billion-value')]
    },
    revenue: { valueUsdM: 300, period: 'FY2025', kind: 'estimate', note: 'Implied by company guidance of 80%+ growth to $540M+ in 2026', src: S('Fortune, Mar 2026', 'https://fortune.com/2026/03/26/shield-ai-revenue-series-g-funding-12-billion-valuation') },
    programs: [
      { name: 'V-BAT for the US Coast Guard', customer: 'US Coast Guard', role: 'Prime', value: '$198M', year: 2024, status: 'Fielding' },
      { name: 'Hivemind for CCA autonomy prototyping', ref: 'cca', customer: 'US Air Force', role: 'Autonomy provider', year: 2026, status: 'Prototype' },
      { name: 'V-BAT in Ukraine', ref: 'ukraine', customer: 'Ukraine', role: 'Supplier', status: 'Fielded' }
    ]
  });

  DTM.add({
    id: 'quantum-systems', name: 'Quantum Systems', domain: 'quantum-systems.com', status: 'private', stage: 'Series D',
    hq: 'Gilching', country: 'DE', founded: 2015,
    subsegments: ['uas.tactical', 'uas.small'],
    oneLiner: 'Vector and Twister eVTOL reconnaissance drones, combat-proven at scale in Ukraine; profitable.',
    description: [
      'Quantum Systems builds electric VTOL fixed-wing reconnaissance drones, notably the Vector, used in large numbers by Ukraine, as well as the Twister and Trinity families, with production in Germany, Ukraine, Australia and the US.',
      'It raised $1.2B at about $8B in July 2026, more than doubling its valuation in eight months. The round reshaped the shareholder base so it can develop armed systems, and the board is preparing for an IPO no earlier than the first half of 2027.'
    ],
    leadership: [['Florian Seibel', 'Co-founder & Co-CEO']],
    products: ['Vector', 'Twister', 'Trinity'],
    funding: {
      totalUsdM: 1700, asOf: '2026-07',
      rounds: [
        { date: '2025-05', type: 'Series C', amountUsdM: 180 },
        { date: '2025-11', type: 'Series C ext.', amountUsdM: 210, postUsdM: 3500 },
        { date: '2026-07', type: 'Series D', amountUsdM: 1200, postUsdM: 8000, leads: ['Blackstone', 'Noteus', 'Airbus', 'Advent'] }
      ],
      investors: ['Blackstone', 'Airbus', 'Advent', 'Balderton', 'Bullhound Capital', 'Peter Thiel'],
      note: 'Total is an approximate sum of disclosed rounds. The company says it is profitable.',
      src: [S('Pulse 2.0, Jul 2026', 'https://pulse2.com/quantum-systems-raises-1-2-billion-series-d-at-8-billion-valuation/amp/'), S('Grosswald', 'https://www.grosswald.org/quantum-systems-1-2-billion-series-d-8-billion-valuation-armed-drones/')]
    },
    programs: [
      { name: 'Vector reconnaissance drones for Ukraine', ref: 'ukraine', customer: 'Ukraine', role: 'Supplier', status: 'Fielded' },
      { name: 'Bundeswehr reconnaissance UAS', customer: 'German Armed Forces', role: 'Supplier', status: 'Fielded' }
    ]
  });

  DTM.add({
    id: 'tekever', name: 'Tekever', domain: 'tekever.com', status: 'private', stage: 'Growth',
    hq: 'Lisbon', country: 'PT', founded: 2001,
    subsegments: ['uas.tactical'],
    oneLiner: 'AR3 and AR5 long-endurance surveillance drones with onboard AI; Portugal\'s defense unicorn.',
    description: [
      'Tekever builds long-endurance fixed-wing drones with onboard AI and maritime surveillance payloads, including the AR3 used extensively by Ukraine and the larger AR5 used for European border and maritime patrol.',
      'A May 2025 raise valued it above £1B, making it Europe\'s newest defense unicorn at the time.'
    ],
    leadership: [['Ricardo Mendes', 'Co-founder & CEO']],
    products: ['AR3', 'AR5', 'Atlas'],
    funding: {
      totalUsdM: null, label: 'Undisclosed', asOf: '2025-05',
      rounds: [{ date: '2025-05', type: 'Growth', postUsdM: 1300 }],
      note: 'Valuation above £1B (about $1.3B) at the May 2025 raise; amounts not disclosed.',
      src: S('Portugal Global, May 2025', 'https://portugalglobal.pt/en/news/2025/may/tekever-becomes-europe-s-newest-defence-technology-unicorn')
    },
    programs: [{ name: 'AR3 for Ukraine', ref: 'ukraine', customer: 'Ukraine', role: 'Supplier', status: 'Fielded' }]
  });

  DTM.add({
    id: 'stark', name: 'Stark', status: 'private', stage: 'Series C',
    hq: 'Berlin', country: 'DE', founded: 2024,
    subsegments: ['missiles.loitering', 'uas.small'],
    oneLiner: 'Virtus VTOL loitering munition; Bundeswehr contract and a Sequoia and Founders Fund backed €500M round.',
    description: [
      'Stark builds the Virtus, an electric VTOL loitering munition designed for mass production, tested in Ukraine and bought by the German Bundeswehr.',
      'Germany awarded Stark a contract of about €269M in February 2026. In June 2026 it raised €500M at a valuation above €3.5B, putting over 80% into manufacturing and R&D.'
    ],
    products: ['Virtus'],
    funding: {
      totalUsdM: 580, asOf: '2026-06',
      rounds: [{ date: '2026-06', type: 'Series C', amountUsdM: 580, postUsdM: 4060, leads: ['Sequoia', 'Founders Fund'] }],
      investors: ['Sequoia', 'Founders Fund', 'Thiel Capital'],
      note: '€500M round at €3.5B+ converted at about 1.16. Earlier rounds not included in the total.',
      src: [S('Grosswald, Jun 2026', 'https://www.grosswald.org/stark-defence-500-million-series-c-sequoia-founders-fund-loitering-munition/'), S('DroneXL', 'https://dronexl.co/2026/06/24/thiel-sequoia-570m-german-drones/')]
    },
    programs: [
      { name: 'Bundeswehr loitering munitions', customer: 'German Armed Forces', role: 'Prime', value: '≈€269M', year: 2026, status: 'Production' },
      { name: 'Virtus in Ukraine', ref: 'ukraine', customer: 'Ukraine', role: 'Supplier', status: 'Testing' }
    ]
  });

  /* ---------------- CCA ---------------- */
  DTM.add({
    id: 'general-atomics', name: 'General Atomics', domain: 'ga.com', status: 'private', stage: 'Family-owned',
    hq: 'San Diego, CA', country: 'US', founded: 1955,
    subsegments: ['uas.cca', 'uas.tactical'],
    oneLiner: 'MQ-9 Reaper maker and CCA Increment 1 competitor (YFQ-42A); largest privately held US defense prime.',
    description: [
      'General Atomics Aeronautical Systems builds the MQ-9 Reaper and MQ-1C Gray Eagle and is competing for the Air Force\'s Collaborative Combat Aircraft with the YFQ-42A, which entered a runoff against Anduril\'s YFQ-44A, with a decision expected by the end of 2026.',
      'The broader group, owned by Neal and Linden Blue, also works on electromagnetic launch, nuclear fuel and fusion. In September 2025 the Air Force awarded a $14.1B sole-source contract to support the MQ-9 fleet through the late 2030s.'
    ],
    leadership: [['Neal Blue', 'Chairman & CEO'], ['David Alexander', 'President, GA-ASI']],
    products: ['MQ-9B', 'MQ-1C Gray Eagle', 'YFQ-42A', 'Gambit'],
    funding: { totalUsdM: null, label: 'Family-owned', asOf: '2026-10', note: 'Owned by Neal and Linden Blue since 1986; no outside equity.', src: S('Robotics.press profile', 'https://www.robotics.press/news/general-atomics-company-profile/') },
    revenue: { valueUsdM: 3000, period: 'Recent year', kind: 'estimate', note: 'Commonly cited estimate; federal obligations were ~$820M in 2024', src: S('AviationOutlook', 'https://www.aviationoutlook.com/p/general-atomics-company-analysis-outlook-report') },
    programs: [
      { name: 'CCA Increment 1 (YFQ-42A)', ref: 'cca', customer: 'US Air Force', role: 'Prime', status: 'Flight test', note: 'Competing against Anduril for production.' },
      { name: 'MQ-9 fleet sustainment', customer: 'US Air Force', role: 'Prime', value: '$14.1B', year: 2025, status: 'Awarded' }
    ]
  });

  /* ---------------- Autonomy software ---------------- */
  DTM.add({
    id: 'applied-intuition', name: 'Applied Intuition', short: 'Applied', domain: 'appliedintuition.com', status: 'private', stage: 'Series F',
    hq: 'Mountain View, CA', country: 'US', founded: 2017,
    subsegments: ['uas.autonomy', 'software.engineering', 'maritime.ground'],
    oneLiner: 'Vehicle autonomy and simulation software for automakers and, increasingly, military vehicles across domains.',
    description: [
      'Applied Intuition sells simulation, autonomy and vehicle operating system software to 18 of the top 20 automakers and has expanded into defense, building autonomy for ground, air and maritime platforms. It acquired EpiSci, an aircraft-autonomy specialist, in 2025.',
      'Its June 2025 Series F valued it at $15B. It says it is profitable and had 1,638 employees in September 2026.'
    ],
    leadership: [['Qasar Younis', 'Co-founder & CEO'], ['Peter Ludwig', 'Co-founder & CTO']],
    employees: '1,638',
    products: ['Simian', 'Vehicle OS', 'EpiSci tactical autonomy'],
    funding: {
      totalUsdM: 1450, asOf: '2025-06',
      rounds: [
        { date: '2024-03', type: 'Series E', amountUsdM: 250, postUsdM: 6000 },
        { date: '2025-06', type: 'Series F', amountUsdM: 600, postUsdM: 15000, leads: ['BlackRock', 'Kleiner Perkins'] }
      ],
      investors: ['Andreessen Horowitz', 'Kleiner Perkins', 'BlackRock', 'General Catalyst', 'Lux Capital'],
      note: 'The Series F included a tender offer. Total is approximate.',
      src: [S('Munich Startup', 'https://insights.munich-startup.de/news/note/applied-intuition-ceo-cto-on-building-the-15b-physical-ai-infrastructure-company'), S('DefiLlama', 'https://defillama.com/pre-ipo/applied-intuition')]
    },
    programs: [{ name: 'Autonomy for Army and Navy programs', customer: 'US Army / US Navy', role: 'Software provider', status: 'Deploying' }]
  });

  DTM.add({
    id: 'auterion', name: 'Auterion', domain: 'auterion.com', status: 'private', stage: 'Series B',
    hq: 'Arlington, VA', country: 'US', founded: 2017,
    subsegments: ['uas.autonomy', 'uas.components'],
    oneLiner: 'AuterionOS and Skynode: an open operating system and strike autonomy kit for drones from many makers.',
    description: [
      'Auterion makes AuterionOS, a drone operating system built on open-source PX4, and the Skynode computers that give drones from many manufacturers terminal guidance and swarming. Tens of thousands of its strike kits have gone to Ukraine.',
      'It raised $130M in September 2025 at a valuation "north of" $600M and says it is close to $100M of revenue and cash-flow positive. A 2026 round at about $1.2B has been reported but not confirmed.'
    ],
    leadership: [['Lorenz Meier', 'Co-founder & CEO']],
    products: ['AuterionOS', 'Skynode S', 'Nemyx swarm engine'],
    funding: {
      totalUsdM: 160, asOf: '2025-09',
      rounds: [{ date: '2025-09', type: 'Series B', amountUsdM: 130, postUsdM: 600 }],
      note: 'Valuation shown is the CEO\'s "north of $600M". Total is approximate. A $200M round at $1.2B (March 2026) is listed by one tracker but unconfirmed.',
      src: [S('Bloomberg Law', 'https://news.bloomberglaw.com/ip-law/auterion-raises-130-million-aims-to-be-microsoft-for-drones'), S('Resilience Media', 'https://resiliencemedia.co/auterion-the-drone-software-startup-plans-to-raise-200m-at-a-1-2b-valuation/')]
    },
    revenue: { valueUsdM: 100, period: '2026 run-rate', kind: 'reported', note: 'CEO: "close to $100M"', src: S('Resilience Media', 'https://resiliencemedia.co/auterion-the-drone-software-startup-plans-to-raise-200m-at-a-1-2b-valuation/') },
    programs: [
      { name: 'Low-cost long-range strike prototyping', ref: 'etv', customer: 'DoD', role: 'Prime (with Ukrainian partner)', value: '$50M', status: 'Prototype' },
      { name: 'Skynode strike kits for Ukraine', ref: 'ukraine', customer: 'Ukraine', role: 'Supplier', status: 'Fielded' }
    ]
  });

  DTM.add({
    id: 'merlin', name: 'Merlin', domain: 'merlinlabs.com', status: 'public', ticker: 'MRLN', exchange: 'NASDAQ',
    hq: 'Boston, MA', country: 'US', founded: 2018,
    subsegments: ['uas.autonomy'],
    oneLiner: 'Merlin Pilot autonomy for existing military aircraft, starting with the KC-135 and C-130J.',
    description: [
      'Merlin builds an AI-enabled autonomous flight system that can be retrofitted to existing aircraft, with Air Force programs to bring reduced-crew and autonomous operations to tankers and transports.',
      'It listed on Nasdaq in March 2026 through a SPAC merger. The shares have fallen sharply since, leaving a micro-cap valuation.'
    ],
    leadership: [['Matt George', 'Founder & CEO']],
    products: ['Merlin Pilot'],
    marketCap: { usdM: 188, asOf: '2026-09-21', src: S('MarketChameleon', 'https://marketchameleon.com/Overview/MRLN/Summary/') },
    valuation: { note: 'Listed via SPAC in March 2026; closed its first day at $9.03.', asOf: '2026-09-21', src: S('Hoodline, Mar 2026', 'https://hoodline.com/2026/03/merlin-s-nasdaq-liftoff-ends-boston-tech-ipo-dry-spell/') },
    programs: [{ name: 'KC-135 autonomy', customer: 'US Air Force', role: 'Prime', status: 'Development' }]
  });

  DTM.add({
    id: 'scout-ai', name: 'Scout AI', status: 'private', stage: 'Series A',
    hq: 'Sunnyvale, CA', country: 'US', founded: 2024,
    subsegments: ['uas.autonomy', 'maritime.ground'],
    oneLiner: 'Fury, a foundation model for controlling uncrewed vehicles across domains.',
    description: [
      'Scout AI is training Fury, a vision-language-action foundation model meant to act as the "AI brain" for uncrewed ground and air vehicles, taking mission orders in natural language.',
      'It booked $11M of Department of War contracts in its first year and raised a $100M Series A in April 2026.'
    ],
    leadership: [['Colby Adcock', 'Co-founder & CEO'], ['Collin Otis', 'Co-founder & CTO']],
    products: ['Fury'],
    funding: {
      totalUsdM: 115, asOf: '2026-04',
      rounds: [
        { date: '2025-04', type: 'Seed', amountUsdM: 15 },
        { date: '2026-04', type: 'Series A', amountUsdM: 100, leads: ['Align Ventures', 'Draper Associates'] }
      ],
      investors: ['Align Ventures', 'Draper Associates', 'Decisive Point', 'Booz Allen Ventures'],
      src: S('AI Business, Apr 2026', 'https://aibusiness.com/robotics/scout-ai-raises-100m-build-ai-brain-autonomous-warfare')
    },
    programs: []
  });

  /* ---------------- Components & supply chain ---------------- */
  DTM.add({
    id: 'unusual-machines', name: 'Unusual Machines', domain: 'unusualmachines.com', status: 'public', ticker: 'UMAC', exchange: 'NYSE American',
    hq: 'Orlando, FL', country: 'US', founded: 2019,
    subsegments: ['uas.components'],
    oneLiner: 'NDAA-compliant drone components: motors, flight controllers and FPV goggles made in the US.',
    description: [
      'Unusual Machines makes components for small drones, including motors, flight controllers, cameras and Fat Shark goggles, to replace Chinese parts in NDAA-compliant drones. It also owns the Rotor Riot retail brand.',
      'Revenue jumped about 7× year on year in Q2 2026 as drone makers scaled. It raised about $150M in a March 2026 offering.'
    ],
    leadership: [['Allan Evans', 'CEO']],
    products: ['Motors', 'Flight controllers', 'Fat Shark', 'Rotor Riot'],
    marketCap: { usdM: 1380, asOf: '2026-08-21', src: S('Benzinga', 'https://www.benzinga.com/stock/UMAC') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [{ label: 'FY2024', revenue: 5.6 }, { label: 'FY2025', revenue: 11.2 }],
      notes: 'Q2 2026 revenue was about $16.7M, up 687%. Management targets $12M–$14M for Q3 2026.',
      asOf: '2026-08-14', src: S('American Companies (SEC data)', 'https://americancompanies.com/company/unusual-machines-inc/')
    },
    valuation: { note: 'Trades above 100× FY2025 revenue; the market is pricing in rapid component demand growth.', asOf: '2026-08-21', src: S('Benzinga', 'https://www.benzinga.com/stock/UMAC') },
    programs: []
  });

  DTM.add({
    id: 'firestorm', name: 'Firestorm Labs', short: 'Firestorm', domain: 'firestormlabs.com', status: 'private', stage: 'Series B',
    hq: 'San Diego, CA', country: 'US', founded: 2022,
    subsegments: ['uas.components', 'industrial.manufacturing'],
    oneLiner: 'xCell expeditionary microfactories that 3D-print drones near the front line.',
    description: [
      'Firestorm builds modular drones that can be 3D-printed on demand in containerized xCell factories, so units can produce and adapt aircraft in the field.',
      'It received a $30M DoD APFIT award and raised an $82M Series B in April 2026, bringing equity raised to $153M.'
    ],
    leadership: [['Dan Magy', 'Co-founder & CEO']],
    products: ['xCell', 'Tempest', 'El Niño'],
    funding: {
      totalUsdM: 153, asOf: '2026-04',
      rounds: [
        { date: '2024-09', type: 'Seed', amountUsdM: 12.5 },
        { date: '2026-04', type: 'Series B', amountUsdM: 82, leads: ['Washington Harbour Partners'] }
      ],
      investors: ['Washington Harbour Partners', 'NEA', 'In-Q-Tel', 'Lockheed Martin Ventures', 'Booz Allen Ventures', 'Ondas'],
      src: S('Pulse 2.0, Apr 2026', 'https://pulse2.com/firestorm-labs-raises-82-million-series-b-to-scale-expeditionary-defense-manufacturing-platform/amp/')
    },
    programs: [{ name: 'APFIT expeditionary manufacturing', customer: 'DoD', role: 'Prime', value: '$30M', status: 'Production' }]
  });
})();
