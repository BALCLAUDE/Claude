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
  /* ---- b3: DJI plus small UAS, FPV components, hybrid and tethered drones ---- */
  {
    const DRN = S('Drone funding table provided for this map (data through Jun 2025)');

    DTM.add({
      id: 'dji', name: 'DJI (Da-Jiang Innovations)', short: 'DJI', domain: 'dji.com', status: 'private', stage: 'Late stage',
      hq: 'Shenzhen', country: 'CN', founded: 2006,
      subsegments: ['uas.small', 'uas.commercial'],
      flag: 'China-based, non-allied: on the Pentagon\'s Section 1260H "Chinese military company" list since Oct 2022 (still listed after an Aug 2026 D.C. Circuit remand), barred from DoD procurement by the NDAA, and on the FCC Covered List since Dec 2025, which blocks US authorization of new models.',
      flagShort: 'CN',
      oneLiner: 'Chinese maker of Mavic, Mini, Matrice and Agras drones; on the Pentagon 1260H list and blocked from new US FCC authorizations.',
      description: [
        'DJI, founded in Shenzhen in 2006 by Frank Wang, makes consumer camera drones (Mini, Air, Mavic, Avata), Matrice enterprise drones used for public safety and inspection, and Agras crop-spraying drones. It also makes gimbals and the flight-control software and components behind its drones.',
        'The Pentagon has listed DJI as a Chinese military company since October 2022 and republished the listing with new rationale in June 2026. On August 14, 2026 the D.C. Circuit sent one part of DJI\'s challenge back for review of classified evidence but left the listing in place. Since December 2025, new DJI models without prior FCC authorization cannot be imported or sold in the US; DJI has appealed.'
      ],
      leadership: [['Frank Wang (Wang Tao)', 'Founder & CEO']],
      products: ['Mini', 'Air', 'Mavic', 'Avata', 'Matrice', 'Agras'],
      funding: {
        totalUsdM: 1168.7, roundCount: 7, lastDate: '2018-04', asOf: '2018-04',
        src: DRN
      },
      programs: [
        { name: 'Barred from DoD procurement (FY2020 NDAA §848)', customer: 'US DoD', role: 'Vendor', year: 2019, status: 'Banned', note: 'Federal agencies were later barred from buying Chinese-made drones under the American Security Drone Act.' },
        { name: 'Section 1260H Chinese military company list', customer: 'US DoD', role: 'Vendor', year: 2022, status: 'Listed', note: 'Upheld in district court Sep 2025; re-listed Jun 10, 2026; D.C. Circuit partly reversed and remanded Aug 14, 2026 without delisting.', src: S('DroneLife, Aug 2026', 'https://dronelife.com/2026/08/18/dji-pentagon-designation-ruling-partially-reversed/') },
        { name: 'FCC Covered List (foreign-made drones)', customer: 'FCC', role: 'Vendor', year: 2025, status: 'Restricted', note: 'Models without FCC authorization before Dec 22, 2025 cannot be imported or sold; earlier models remain legal and can receive updates.', src: S('UAV Coach', 'https://uavcoach.com/dji-ban/') }
      ]
    });

    DTM.add({
      id: 'vantage-robotics', name: 'Vantage Robotics', short: 'Vantage', domain: 'vantagerobotics.com', status: 'private', stage: 'Venture',
      hq: 'San Leandro, CA', country: 'US', founded: 2013,
      subsegments: ['uas.small'],
      oneLiner: 'Vesper small reconnaissance quadcopter; Army CHS-6 vehicle and an SRR finalist advancing to manufacturing readiness.',
      description: [
        'Vantage Robotics, co-founded in 2013 by CEO Tobin Fisher and Joe van Niekerk, builds the Vesper, a compact, NDAA-compliant reconnaissance quadcopter for military, border and public safety users. US Customs and Border Protection bought Vesper systems under a five-year blanket purchase agreement in 2022, and the Singapore Army has also procured it.',
        'The Army added Vesper to its Common Hardware Systems-6 contract in May 2024, giving units a fast procurement route. In September 2026 the Army\'s UAS project office picked Vantage as one of five vendors to advance to the Manufacturing Readiness Assessment phase of the Short Range Reconnaissance program, after flight demonstrations at Clarke Range, Alabama in June.'
      ],
      leadership: [['Tobin Fisher', 'Co-founder & CEO']],
      products: ['Vesper'],
      funding: {
        totalUsdM: 40.8, roundCount: 18, lastDate: '2025-02', asOf: '2025-02',
        note: 'Table total; no later round found.',
        src: DRN
      },
      programs: [
        { name: 'Short Range Reconnaissance: Manufacturing Readiness Assessment', ref: 'srr', customer: 'US Army', role: 'Prime', year: 2026, status: 'Selected', note: 'One of five vendors advanced after June 2026 flight demonstrations.', src: S('Unmanned Systems Technology, Sep 2026', 'https://www.unmannedsystemstechnology.com/2026/09/u-s-army-advances-platoon-reconnaissance-program-selects-five-small-drone-vendors/') },
        { name: 'Common Hardware Systems-6 (CHS-6)', customer: 'US Army', role: 'Supplier', year: 2024, status: 'On contract', src: S('Unmanned Systems Technology, May 2024', 'https://www.unmannedsystemstechnology.com/2024/05/vantage-vesper-suas-included-in-common-hardware-systems-6-contract/') },
        { name: 'CBP small UAS blanket purchase agreement', customer: 'US Customs and Border Protection', role: 'Vendor', year: 2022, status: 'Delivering', note: 'Five vendors share a BPA estimated at $90M over five years.', src: S('DroneLife, Dec 2022', 'https://dronelife.com/2022/12/22/customs-and-border-protection-makes-major-drone-purchases/') }
      ]
    });

    DTM.add({
      id: 'orqa', name: 'Orqa', domain: 'orqafpv.com', status: 'private', stage: 'Series A',
      hq: 'Osijek', country: 'HR', founded: 2018,
      subsegments: ['uas.components', 'uas.small'],
      oneLiner: 'Croatian maker of NDAA-compliant FPV drones, goggles and flight controllers, built on a European supply chain.',
      description: [
        'Orqa, founded in Osijek, Croatia by CEO Srdjan Kovacevic, Ivan Jelusic and Vlatko Matijevic, makes first-person-view (FPV) drones, video goggles and flight controllers with a European rather than Chinese supply chain. It says its Osijek plant can build up to 280,000 NDAA-compliant drones a year, and its Global Manufacturing Partnership Program aims to take output above one million a year through licensed partners.',
        'Orqa closed a €12.7M Series A in March 2026 led by Expeditions, with Lightspeed Venture Partners, Taiwania Capital, Radius Capital and AYMO Ventures, to expand production in Europe and the US. That followed a €5.8M round in late 2024.'
      ],
      leadership: [['Srdjan Kovacevic', 'Co-founder & CEO']],
      products: ['FPV drones', 'FPV goggles', 'Flight controllers'],
      funding: {
        totalUsdM: 23.6, roundCount: 7, lastDate: '2026-03', asOf: '2026-03',
        rounds: [{ date: '2026-03', type: 'Series A', amountUsdM: 14.7, leads: ['Expeditions'] }],
        investors: ['Expeditions', 'Lightspeed Venture Partners', 'Taiwania Capital', 'Radius Capital', 'AYMO Ventures'],
        note: 'Table total of $8.9M through Dec 2024, plus the €12.7M Series A (about $14.7M at 1.16 USD per EUR) in Mar 2026. Some trackers put pre-Series A funding near €20M.',
        src: [DRN, S('Vestbee, Mar 2026', 'https://vestbee.com/insights/articles/orqa-closes-12-7-series-a'), S('Raising.fi, Mar 2026', 'https://raising.fi/news/orqa-series-a-march-2026')]
      },
      programs: [
        { name: 'NDAA-compliant FPV production in Osijek', customer: 'European and allied defense users', role: 'Prime', status: 'Production', note: 'Company-stated capacity of up to 280,000 drones a year.', src: S('Vestbee, Mar 2026', 'https://vestbee.com/insights/articles/orqa-closes-12-7-series-a') }
      ]
    });

    DTM.add({
      id: 'skyfront', name: 'Skyfront', domain: 'skyfront.com', status: 'private', stage: 'Venture',
      hq: 'Redwood City, CA', country: 'US', founded: 2014,
      subsegments: ['uas.tactical'],
      oneLiner: 'Perimeter 8 hybrid gas-electric multirotor: multi-hour endurance and heavy lift, on the Blue UAS list since 2025.',
      description: [
        'Skyfront builds hybrid gas-electric multirotor drones that fly several times longer than battery-only quadcopters while keeping vertical takeoff and hover. Its Perimeter 8 carries ISR payloads and the MagniPhy airborne magnetometer used for surveying and detecting buried objects. The Perimeter 8 was added to the Blue UAS list in April 2025.',
        'In May 2026 the US Army contracted Skyfront to field the Perimeter 8 with Army units, integrate it into tactical networks and provide operator training and sustainment; the first phase was a three-week deployment in Colorado with partner AeroIntel Systems. Value and term were not disclosed.'
      ],
      leadership: [['Troy Mestler', 'CEO']],
      products: ['Perimeter 8', 'MagniPhy'],
      funding: {
        totalUsdM: 8.6, roundCount: 7, lastDate: '2021-04', asOf: '2021-04',
        note: 'Table total; no later round found.',
        src: DRN
      },
      programs: [
        { name: 'Perimeter 8 fielding, integration and training', customer: 'US Army', role: 'Prime', year: 2026, status: 'Fielding', src: S('Unmanned Systems Technology, Jun 2026', 'https://www.unmannedsystemstechnology.com/2026/06/u-s-army-awards-contract-for-perimeter-8-drone-integration-training/') },
        { name: 'Blue UAS list', customer: 'Defense Innovation Unit / DCMA', role: 'Vendor', year: 2025, status: 'Listed', src: S('Frontier Precision, May 2025', 'https://frontierprecision.com/news/frontier-precision-unmanned-announces-strategic-partnership-with-skyfront') }
      ]
    });

    DTM.add({
      id: 'hoverfly', name: 'Hoverfly Technologies', short: 'Hoverfly', domain: 'hoverflytech.com', status: 'private', stage: 'Series B',
      hq: 'Sanford, FL', country: 'US', founded: 2010,
      subsegments: ['uas.tactical'],
      oneLiner: 'Tethered drones (Sentry, Spectre, LiveSky) for persistent overwatch; Leonardo DRS invests, builds and resells them.',
      description: [
        'Hoverfly Technologies makes tethered drones that draw power and data through a cable from the ground, giving round-the-clock overhead surveillance without battery swaps. It says it is the only tethered drone on the Defense Innovation Unit\'s Blue UAS list. A US government customer awarded it a sole-source contract with a $10M initial ceiling for LiveSky systems in 2019.',
        'In October 2025 Hoverfly raised a $20M Series B, its largest round: $15M from Leonardo DRS and $5M from Korea Robot Manufacturing. DRS agreed to expand Sentry production and open a Spectre production line, and both investors act as resellers and integrators.'
      ],
      leadership: [['Steve Walters', 'CEO']],
      products: ['Sentry', 'Spectre', 'LiveSky'],
      funding: {
        totalUsdM: 34.4, roundCount: 7, lastDate: '2025-10', asOf: '2025-10',
        rounds: [{ date: '2025-10', type: 'Series B', amountUsdM: 20, leads: ['Leonardo DRS'] }],
        investors: ['Leonardo DRS', 'Korea Robot Manufacturing'],
        note: 'Table total of $14.4M through Sep 2022, plus the $20M Series B in Oct 2025.',
        src: [DRN, S('Pulse 2.0, Oct 2025', 'https://pulse2.com/hoverfly-technologies-20-million-series-b/')]
      },
      programs: [
        { name: 'Sentry and Spectre production and resale', customer: 'Leonardo DRS', role: 'Partner', year: 2025, status: 'Production', src: S('Leonardo DRS', 'https://www.leonardodrs.com/hoverfly-technologies/') },
        { name: 'LiveSky tethered UAS (sole source)', customer: 'US government', role: 'Prime', value: '$10M ceiling', year: 2019, status: 'Delivered', src: S('Unmanned Aerial', 'https://unmanned-aerial.com/hoverfly-wins-10m-government-contract-for-tethered-drones') }
      ]
    });
  }
  /* ---- b4: commercial, delivery & public-safety drones ---- */
  {
    const DRN = S('Drone funding table provided for this map (data through Jun 2025)');

    DTM.add({
      id: 'zipline', name: 'Zipline', domain: 'flyzipline.com', status: 'private', stage: 'Series H',
      hq: 'South San Francisco, CA', country: 'US', founded: 2014,
      subsegments: ['uas.commercial'],
      oneLiner: 'Autonomous delivery drones for Walmart and health systems; prototyped battlefield blood resupply with DIU.',
      description: [
        'Zipline builds and operates autonomous delivery drones, from catapult-launched fixed-wing aircraft that carry medical supplies to its Platform 2 home-delivery system, first deployed at Walmart stores in Mesquite and Waxahachie, Texas, in early 2025. The Defense Innovation Unit has worked with Zipline since 2018 on battlefield medical resupply, and in 2019 its drones made more than 400 deliveries, including mock blood resupply, in military exercises in Australia.',
        'Zipline raised more than $600M at a $7.6B valuation in January 2026, led by Valor Equity Partners, and added $200M in March 2026 with Paradigm joining, taking its Series H to $800M. The money funds launches in Houston, Phoenix and Seattle. In September 2026 Bloomberg reported early talks to raise about $1B at roughly $20B.'
      ],
      leadership: [['Keller Rinaudo Cliffton', 'Co-founder & CEO']],
      products: ['Platform 1', 'Platform 2'],
      funding: {
        totalUsdM: 1647, roundCount: 23, lastDate: '2026-03', asOf: '2026-03',
        rounds: [
          { date: '2026-01', type: 'Series H', amountUsdM: 600, postUsdM: 7600, leads: ['Valor Equity Partners'] },
          { date: '2026-03', type: 'Series H (extension)', amountUsdM: 200 }
        ],
        investors: ['Valor Equity Partners', 'Tiger Global', 'Fidelity', 'Baillie Gifford', 'Paradigm'],
        note: 'Table total of $847.0M through May 2023, plus the $600M Series H (Jan 2026) and its $200M extension (Mar 2026). Reported Sep 2026 talks to raise about $1B at roughly $20B had not closed.',
        src: [
          DRN,
          S('DroneXL, Jan 2026', 'https://dronexl.co/2026/01/20/zipline-reaches-7-6-billion-valuation-drone'),
          S('TechCrunch, Mar 2026', 'https://techcrunch.com/2026/03/23/zipline-snaps-up-another-200m-to-fuel-its-drone-delivery-expansion/'),
          S('STAT Times, Sep 2026', 'https://www.stattimes.com/amp/aviation/zipline-in-talks-to-raise-1billion-at-a-20billion-valuation-1360718')
        ]
      },
      programs: [
        { name: 'DIU battlefield medical resupply prototype (OTA)', customer: 'DoD / Defense Innovation Unit', role: 'Prime', year: 2018, status: 'Prototype', note: 'In 2019 Zipline flew more than 400 deliveries in exercises in Australia with the Naval Medical Research Center.', src: S('ExecutiveBiz', 'https://www.executivebiz.com/articles/zipline-partners-with-dod-for-medical-supply-drone-prototyping') },
        { name: 'Walmart drone delivery, Dallas-Fort Worth', customer: 'Walmart', role: 'Vendor', year: 2025, status: 'Delivering', note: 'Flown under FAA beyond-visual-line-of-sight approval.', src: S('FreightWaves', 'https://www.freightwaves.com/news/walmart-adds-1-8m-homes-to-dallas-fort-worth-drone-delivery-service') }
      ]
    });

    DTM.add({
      id: 'wingcopter', name: 'Wingcopter', domain: 'wingcopter.com', status: 'private', stage: 'Series B',
      hq: 'Weiterstadt', country: 'DE', founded: 2017,
      subsegments: ['uas.commercial'],
      oneLiner: 'Tilt-rotor eVTOL delivery drones; launched the Wingcopter 262 reconnaissance drone for defense users in Sep 2026.',
      description: [
        'Wingcopter builds battery-powered tilt-rotor eVTOL drones that take off vertically and cruise like fixed-wing aircraft, used for medical and parcel delivery and LiDAR infrastructure surveying. It is working toward type certification of its delivery drone in the US, Brazil and Japan. A new Wingcopter Security & Defence unit adds ISR and military cargo work.',
        'In February 2026 Wingcopter signed an MoU with Ukraine\'s TAF Industries at the Munich Security Conference to build TAF reconnaissance drones in Germany under the Build with Ukraine framework. On September 14, 2026 it unveiled the Wingcopter 262, an electric reconnaissance VTOL rated for six hours and 150 km. Its June 2025 round, from Nordic Secondary Fund, existing shareholders and the EIB, was undisclosed.'
      ],
      leadership: [['Tom Plümmer', 'Co-CEO'], ['Bernhard Klumpp', 'Co-CEO & Chief Product Officer'], ['Jonathan Hesselbarth', 'CTO']],
      products: ['Wingcopter 198', 'Wingcopter 262'],
      funding: {
        totalUsdM: 73.5, roundCount: 11, lastDate: '2025-06', asOf: '2025-06',
        rounds: [{ date: '2025-06', type: 'Series B', leads: ['Nordic Secondary Fund'] }],
        investors: ['Nordic Secondary Fund', 'European Investment Bank'],
        note: 'Table total of $73.5M through Dec 2024, plus a June 2025 round of undisclosed size (CB Insights classes it as a Series B). CB Insights lists about $108M raised in total.',
        src: [DRN, S('STAT Times, Jun 2025', 'https://www.stattimes.com/drones/wingcopter-secures-fresh-funding-strengthens-leadership-1355683')]
      },
      programs: [
        { name: 'TAF Industries joint drone production (Build with Ukraine)', customer: 'TAF Industries / Ukraine', role: 'Partner', year: 2026, status: 'MoU', note: 'MoU signed Feb 13, 2026 to build TAF reconnaissance drones in Germany.', src: S('Militarnyi', 'https://militarnyi.com/en/news/taf-industries-wingcopter-drones-production/') },
        { name: 'Wingcopter 262 tactical reconnaissance eVTOL', customer: 'Defense users', role: 'Prime', year: 2026, status: 'Unveiled', src: S('DroneLife, Sep 2026', 'https://dronelife.com/2026/09/14/wingcopter-262-debuts-as-all-electric-tactical-reconnaissance-evtol-for-defense-users/') }
      ]
    });

    DTM.add({
      id: 'matternet', name: 'Matternet', domain: 'matternet.com', status: 'public', ticker: 'MTTN', exchange: 'OTCQB',
      hq: 'Mountain View, CA', country: 'US', founded: 2011,
      subsegments: ['uas.commercial'],
      oneLiner: 'M2 delivery drone, the first US type-certificated unmanned aircraft; hospital, food and retail drone delivery.',
      description: [
        'Matternet builds drone delivery systems for hospitals, food and retail. Its M2 quadcopter carries up to 2 kg over 20 km and became the first non-military unmanned aircraft to receive FAA type certification (September 2022) and production certification (November 2022). It ran the first US revenue drone deliveries with UPS in 2019 and unveiled a next-generation M3 platform in September 2026.',
        'Matternet went public in May 2026 through a reverse merger with the shell Los Altos Ventures Corp., alongside a private placement of about $33M. Its shares began trading on the OTCQB under MTTN on September 21, 2026. Revenue for the nine months to June 2026 was $0.26M, with a net loss of $15.1M.'
      ],
      products: ['M2', 'M3'],
      marketCap: { usdM: 230, asOf: '2026-10-06', src: [S('PitchBook (share price $4.80, Oct 6 2026)', 'https://pitchbook.com/profiles/company/58370-32'), S('Matternet 8-K (47.97M shares outstanding, May 2026)', 'https://investor.matternet.com/sec-filings/all-sec-filings/content/0001213900-26-062961/ea0292214-8k_matternet.htm')] },
      financials: {
        cur: 'USD', fyEnd: 'Sep',
        periods: [
          { label: '9M to Jun 2025', revenue: 0.262, netIncome: -6.9 },
          { label: '9M to Jun 2026', revenue: 0.256, netIncome: -15.1 }
        ],
        notes: 'Market cap is computed: $4.80 share price times the 47.97M shares outstanding after the May 2026 merger; later share issuance would raise it. The wider loss reflects $5.0M of non-cash interest and higher G&A.',
        asOf: '2026-06-30',
        src: [S('Matternet 10-Q, quarter ended Jun 2026', 'https://www.sec.gov/Archives/edgar/data/0002075109/000121390026091658/ea0301940-10q_matternet.htm')]
      },
      programs: [
        { name: 'FAA type certificate for the M2', customer: 'FAA', role: 'Prime', year: 2022, status: 'Certified', note: 'First non-military UAS type certificate in the US; production certificate followed in Nov 2022.', src: S('Matternet', 'https://investor.matternet.com/news-events/press-releases/detail/100/matternet-m2-drone-delivery-system-first-to-achieve-faa-type-certification') }
      ]
    });

    DTM.add({
      id: 'flytrex', name: 'Flytrex', domain: 'flytrex.com', status: 'private', stage: 'Series C',
      hq: 'Tel Aviv', country: 'IL', founded: 2013,
      subsegments: ['uas.commercial'],
      oneLiner: 'Suburban drone delivery in Texas and North Carolina for DoorDash and Uber Eats; builds Sky2 drones in Texas.',
      description: [
        'Flytrex runs on-demand drone delivery from restaurants and stores to suburban homes in the Dallas-Fort Worth area, Granbury, Texas, and North Carolina, including deliveries for DoorDash. It has completed more than 200,000 US deliveries. Flytrex and Alphabet\'s Wing were the first US drone delivery operators to share airspace, as part of an FAA study of drone traffic management.',
        'Uber made its first drone delivery investment in Flytrex in September 2025, on undisclosed terms, to launch Uber Eats pilots. In May 2026 Flytrex opened a manufacturing and maintenance site in Pilot Point, Texas, with capacity for about 1,000 Sky2 drones a year, and set a target of 60 delivery sites across Dallas-Fort Worth by mid-2027.'
      ],
      leadership: [['Yariv Bash', 'Co-founder & CEO']],
      products: ['Sky2'],
      funding: {
        totalUsdM: 61.3, roundCount: 8, lastDate: '2025-09', asOf: '2025-09',
        rounds: [{ date: '2025-09', type: 'Strategic', leads: ['Uber'] }],
        investors: ['Uber', 'BRM Group', 'OurCrowd'],
        note: 'Table total of $61.3M through Jan 2022 (including a $40M Series C led by BRM Group), plus Uber\'s September 2025 strategic investment, whose amount was not disclosed.',
        src: [DRN, S('Spectrum News, Sep 2025', 'https://spectrumlocalnews.com/us/snplus/business/2025/09/19/uber-eats-drone-delivery-flytrex')]
      },
      programs: [
        { name: 'Uber Eats drone delivery pilots', customer: 'Uber', role: 'Partner', year: 2025, status: 'Pilot', src: S('KSAT, Sep 2025', 'https://www.ksat.com/news/2025/09/18/uber-eats-will-soon-launch-us-drone-delivery-in-partnership-with-flytrex/') },
        { name: 'Shared-airspace drone traffic management study', customer: 'FAA', role: 'Partner', status: 'Operating', note: 'Flown alongside Wing in Dallas-Fort Worth.', src: S('Flying', 'https://www.flyingmag.com/uber-eats-flytrex-drone-delivery') },
        { name: 'Pilot Point drone factory', customer: 'Flytrex (DFW network)', role: 'Prime', year: 2026, status: 'Production', note: 'Supports a planned 60 delivery sites by mid-2027.', src: S('Business Wire, May 2026', 'https://secure.businesswire.com/news/home/20260521856849/en/Flytrex-Opens-Drone-Manufacturing-Facility-in-Dallas-as-Company-Eyes-60-New-Delivery-Sites-by-Mid-2027') }
      ]
    });

    DTM.add({
      id: 'percepto', name: 'Percepto', domain: 'percepto.co', status: 'private', stage: 'Series C',
      hq: 'Modi\'in', country: 'IL', founded: 2014,
      subsegments: ['uas.commercial'],
      oneLiner: 'Drone-in-a-box systems and AIM software for autonomous inspection of utilities, refineries and other critical sites.',
      description: [
        'Percepto makes autonomous drone-in-a-box systems (Air Max, Air Max OGI for gas imaging, Air Mobile) and AIM, a platform that runs inspection missions and analyzes the imagery for power, oil and gas and mining sites. Florida Power & Light deployed it at substations statewide in 2022, and Koch companies use it. The Israeli company also has a US headquarters in Austin, Texas.',
        'In November 2022 the FAA granted Percepto a nationwide waiver for shielded beyond-visual-line-of-sight flights at critical-infrastructure sites, later extended to let one pilot run up to 30 drones. In June 2023 it raised a Series C of about $67M led by Koch Disruptive Technologies, roughly $50M in equity and the rest debt from Kreos Capital. No later round has been reported.'
      ],
      products: ['Percepto Air Max', 'Percepto Air Max OGI', 'Percepto Air Mobile', 'AIM'],
      funding: {
        totalUsdM: 122.5, roundCount: 8, lastDate: '2023-06', asOf: '2023-06',
        rounds: [{ date: '2023-06', type: 'Series C', amountUsdM: 67, leads: ['Koch Disruptive Technologies'] }],
        investors: ['Koch Disruptive Technologies', 'U.S. Venture Partners', 'Zimmer Partners', 'Delek US Holdings', 'Spider Capital', 'Arkin Holdings'],
        note: 'Table baseline; no later round found. The Series C combined about $50M of equity with venture debt from Kreos Capital.',
        src: [DRN, S('Calcalist, Jun 2023', 'https://www.calcalistech.com/ctechnews/article/bk13dovw2'), S('DroneLife, Jun 2023', 'https://dronelife.com/?p=95943')]
      },
      programs: [
        { name: 'FAA nationwide BVLOS waiver', customer: 'FAA', role: 'Prime', year: 2022, status: 'Approved', note: 'Shielded BVLOS at critical-infrastructure sites without site-specific approval; later extended to one pilot flying up to 30 drones.', src: S('The Robot Report', 'https://www.therobotreport.com/percepto-drones-get-nationwide-waiver-for-bvlos-flights/') },
        { name: 'Statewide substation and grid monitoring', customer: 'Florida Power & Light', role: 'Vendor', year: 2022, status: 'Deployed', src: S('PR Newswire', 'https://www.prnewswire.com/il/news-releases/percepto-unveils-world-s-largest-autonomous-commercial-drone-deployment-at-leading-us-electric-utility-863612448.html') }
      ]
    });

    DTM.add({
      id: 'brinc', name: 'BRINC Drones', short: 'BRINC', domain: 'brincdrones.com', status: 'private', stage: 'Growth',
      hq: 'Seattle, WA', country: 'US', founded: 2017,
      subsegments: ['uas.commercial'],
      oneLiner: '911-response drones (Responder, Guardian) for police and fire agencies, sold in North America through Motorola Solutions.',
      description: [
        'BRINC builds drones for police, fire and SWAT teams: the Responder, which it calls the first purpose-built 911 response drone, and the Starlink-connected Guardian, launched in March 2026, which can auto-launch on a 911 call and docks in a battery-swapping Guardian Station. It reports more than 900 public safety agency customers, including the Los Angeles Fire Department and St. Louis Police Department.',
        'Motorola Solutions invested in April 2025, when BRINC raised $75M led by Index Ventures, and linked BRINC drones to its 911 dispatch and CommandCentral software; it is now the exclusive North American reseller. Motorola led a $125M round in July 2026. BRINC says it tripled revenue in 2025, and it is moving to a Seattle factory with three times the space.'
      ],
      leadership: [['Blake Resnick', 'Founder & CEO']],
      products: ['Responder', 'Guardian', 'Guardian Station'],
      employees: '~187',
      funding: {
        totalUsdM: 257.3, roundCount: 6, lastDate: '2026-07', asOf: '2026-07',
        rounds: [
          { date: '2025-04', type: 'Venture', amountUsdM: 75, leads: ['Index Ventures'] },
          { date: '2026-07', type: 'Growth', amountUsdM: 125, leads: ['Motorola Solutions'] }
        ],
        investors: ['Motorola Solutions', 'Index Ventures', 'Sam Altman', 'Dylan Field'],
        note: 'Table total of $132.3M through Apr 2025, plus a $125M round in Jul 2026. BRINC puts its total above $280M; it did not disclose a valuation but said it nearly doubled from $480M a year earlier.',
        src: [
          DRN,
          S('GeekWire, Jul 2026', 'https://www.geekwire.com/2026/motorola-leads-125m-round-for-brinc-fueling-911-drone-expansion-amid-u-s-import-crackdown'),
          S('DroneXL, Jul 2026', 'https://dronexl.co/2026/07/14/brinc-motorola-911-drone-police/')
        ]
      },
      programs: [
        { name: 'Drone as First Responder alliance and Guardian resale', customer: 'Motorola Solutions', role: 'Partner', year: 2025, status: 'Selling', note: 'Integrated with CommandCentral, VESTA 911 and APX radios; Motorola is exclusive North American reseller.', src: S('Motorola Solutions', 'https://www.motorolasolutions.com/newsroom/press-releases/motorola-solutions-strategic-alliances-with-brinc-and-skysafe.html') },
        { name: 'Drone as First Responder program', customer: 'Newport Beach Police Department', role: 'Prime', value: '$2.2M (5 years)', year: 2025, status: 'Awarded', note: 'Seven drones, six of them Responders.', src: S('DroneXL, Mar 2025', 'https://dronexl.co/2025/03/03/newport-2m-brinc-drone-program-police-response/') },
        { name: 'Drone as First Responder program', customer: 'St. Louis Police Department', role: 'Prime', year: 2026, status: 'Approved', note: 'Six drones approved in May 2026.', src: S('DroneXL, Jul 2026', 'https://dronexl.co/2026/07/14/brinc-motorola-911-drone-police/') }
      ]
    });
  }
  /* ---- b5: UTM / airspace, drone autonomy and drone components ---- */
  {
    const DRN = S('Drone funding table provided for this map (data through Jun 2025)');

    DTM.add({
      id: 'airspace-link', name: 'Airspace Link', domain: 'airspacelink.com', status: 'private', stage: 'Series B',
      hq: 'Detroit, MI', country: 'US', founded: 2018,
      subsegments: ['uas.airspace'],
      oneLiner: 'AirHub drone operations platform; FAA LAANC and B4UFLY supplier with airspace awareness work at Joint Base Charleston.',
      description: [
        'Airspace Link builds AirHub Portal, a drone operations management system that combines flight planning, fleet management, B4UFLY safety checks, LAANC authorization and BVLOS strategic deconfliction. It is an FAA-approved UAS Service Supplier and sells to state and local governments, airports and commercial operators. It also supports the Air Force\'s sUAS program office at Joint Base Charleston with airspace awareness and drone detection.',
        'On September 23, 2025 the FAA issued Airspace Link a Letter of Acceptance under its Near-Term Approval Process for UTM strategic deconfliction, which BVLOS operators can cite in waiver requests. The company raised a $23.1M Series B led by Avanta Ventures in June 2022; the funding table shows its latest round in March 2025.'
      ],
      leadership: [['Michael Healander', 'Co-founder, President & CEO']],
      products: ['AirHub Portal'],
      funding: {
        totalUsdM: 45.0, roundCount: 7, lastDate: '2025-03', asOf: '2025-03',
        rounds: [{ date: '2022-06', type: 'Series B', amountUsdM: 23.1, leads: ['Avanta Ventures'] }],
        investors: ['Avanta Ventures', 'Altos Ventures', 'Thales', 'Indicator Ventures', '2048 Ventures', 'Detroit Venture Partners', 'Techstars'],
        note: 'No round after the table\'s March 2025 entry was found.',
        src: [DRN, S('DBusiness', 'https://www.dbusiness.com/daily-news/detroits-airspace-link-announces-23-1m-series-b-investment/')]
      },
      programs: [
        { name: 'FAA NTAP approval for UTM strategic deconfliction', customer: 'FAA', role: 'Prime', year: 2025, status: 'Approved', note: 'Letter of Acceptance dated September 23, 2025.', src: S('Unmanned Airspace', 'https://www.unmannedairspace.info/uncategorized/airspace-link-receives-faa-approval-for-utm-service-provision/') },
        { name: 'Joint Base Charleston sUAS Program Office', customer: 'US Air Force', role: 'Sub', year: 2025, status: 'Active', note: 'Supports Tepa, LLC with program architecture, drone detection and airspace awareness; company-reported.', src: S('Airspace Link', 'https://airspacelink.com/blog/airspace-link-supports-air-force-contract-to-establish-safe-and-secure-suas-program-enabling-installation-operations') },
        { name: 'LAANC and B4UFLY service supplier', customer: 'FAA', role: 'Vendor', status: 'Operational' }
      ]
    });

    DTM.add({
      id: 'altitude-angel', name: 'Altitude Angel', domain: 'altitudeangel.com', status: 'private', stage: 'Acquired (Indra)',
      hq: 'Reading', country: 'UK', founded: 2014,
      subsegments: ['uas.airspace'],
      oneLiner: 'GuardianUTM drone traffic platform and Drone Assist app; entered administration in 2025 and its platform was sold to Indra.',
      description: [
        'Altitude Angel built GuardianUTM, a cloud platform for drone flight planning, approvals and conflict resolution, and the Drone Assist app that UK pilots used to request flights in airport restriction zones. With BT it developed Arrow, a network of mast-mounted sensors meant to track drones along Project Skyway, a planned 165-mile corridor from Reading to Rugby.',
        'BT invested £5M in January 2023. The company, with about 50 staff, entered administration on October 7, 2025. In January 2026 Indra Group bought the GuardianUTM platform and related assets, then used by 64 airports and over 350,000 direct users.'
      ],
      leadership: [['Richard Parker', 'Founder']],
      products: ['GuardianUTM', 'Drone Assist', 'Arrow'],
      funding: {
        totalUsdM: 15.2, roundCount: 4, lastDate: '2023-01', asOf: '2023-01',
        investors: ['BT Group'],
        note: 'Raised before Altitude Angel Ltd entered administration in October 2025 (FRP Advisory). Indra bought the GuardianUTM platform and related assets in January 2026; price undisclosed.',
        src: [DRN, S('Aerospace Testing International', 'https://www.aerospacetestinginternational.com/news/unmanned-traffic-management-provider-altitude-angel-enters-administration.html'), S('Indra Group, Jan 2026', 'https://www.indragroup.com/en/news/indra-group-acquires-altitude-angels-guardianutm-platform-to-strengthen-its-leadership-in-drone-traffic-management-while-increasing-its-presence-in-the-united-kingdom')]
      },
      programs: [
        { name: 'GuardianUTM and Drone Assist at UK airports', customer: 'UK airports', role: 'Vendor', status: 'Transferred to Indra', note: '64 airports and over 350,000 direct users at the time of sale.', src: S('Unmanned Airspace', 'https://www.unmannedairspace.info/uncategorized/indra-group-acquires-guardianutm-business-portfolio-from-altitude-angel/') },
        { name: 'Project Skyway drone corridor (with BT)', customer: 'UK government-backed consortium', role: 'Partner', year: 2023, status: 'Planned', note: '165-mile corridor linking Reading, Oxford, Milton Keynes, Cambridge, Coventry and Rugby.', src: S('Unmanned Systems Technology, Jan 2023', 'https://www.unmannedsystemstechnology.com/2023/01/altitude-angel-receives-funding-for-uk-drone-superhighway-development/') }
      ]
    });

    DTM.add({
      id: 'unifly', name: 'Unifly', domain: 'unifly.aero', status: 'private', stage: 'Acquired (Terra Drone)',
      hq: 'Antwerp', country: 'BE', founded: 2015,
      subsegments: ['uas.airspace'],
      oneLiner: 'UTM and U-space software for air navigation providers, including skeyes\' DroneGuide; majority-owned by Terra Drone.',
      description: [
        'Unifly sells UTM and U-space software to air navigation service providers and airspace managers. It runs DroneGuide for skeyes, Belgium\'s air navigation provider, and the DronePortal for the Port of Antwerp-Bruges with SkeyDrone. Japan\'s Terra Drone raised its stake to 51% in August 2023, making Unifly a consolidated subsidiary.',
        'Unifly bought regulatory consultancy EuroUSC Italia in May 2025, completed the three-year Belgian-Dutch BURDI U-space project in October 2025, and launched a rebuilt DroneGuide for skeyes in November 2025. That month it also signed an MoU with India\'s CorePeelers to demonstrate drone traffic management in India.'
      ],
      leadership: [['Andres Van Swalm', 'Co-founder & CEO']],
      products: ['Unifly UTM platform', 'DroneGuide (skeyes)', 'DronePortal'],
      funding: {
        totalUsdM: 36.1, roundCount: 5, lastDate: '2022-05', asOf: '2022-05',
        investors: ['Terra Drone', 'DFS', 'FPIM', 'PMV', 'Qbic', 'JOIN'],
        note: 'Terra Drone, an investor since the 2016 Series A, raised its stake to 51% in August 2023; price undisclosed. Unifly says it raised EUR 37M in total.',
        src: [DRN, S('Terra Drone, Aug 2023', 'https://terra-drone.net/global/2023/08/22/terra-drone-acquires-a-majority-share-of-unifly-the-worlds-leading-provider-of-unmanned-aircraft-system-traffic-management-utm-technology-with-a-strategic-aim-to-enhance-global-drone-and-urban-a/')]
      },
      programs: [
        { name: 'DroneGuide platform for skeyes', customer: 'skeyes (Belgian ANSP)', role: 'Vendor', year: 2025, status: 'Operational', src: S('sUAS News, Nov 2025', 'https://www.suasnews.com/2025/11/unifly-launches-next-generation-droneguide-platform-for-skeyes/') },
        { name: 'Port of Antwerp-Bruges DronePortal', customer: 'Port of Antwerp-Bruges / SkeyDrone', role: 'Vendor', year: 2024, status: 'Operational', src: S('Terra Drone, Feb 2024', 'https://terra-drone.net/global/2024/02/05/terra-drones-group-company-uniflys-next-gen-utm-system-upgrades-the-antwerp-bruges-port-area-together-with-skeydrone/') },
        { name: 'BURDI U-space reference implementation', customer: 'Belgium / Netherlands', role: 'Partner', year: 2025, status: 'Complete', src: S('Terra Drone, Oct 2025', 'https://terra-drone.net/global/2025/10/24/terra-drones-group-company-unifly-concludes-three-year-burdi-project/') }
      ]
    });

    DTM.add({
      id: 'anra', name: 'ANRA Technologies', short: 'ANRA', domain: 'anratechnologies.com', status: 'private', stage: 'Series A',
      hq: 'Chantilly, VA', country: 'US', founded: 2015,
      subsegments: ['uas.airspace'],
      oneLiner: 'SmartSkies UTM software; FAA-approved deconfliction for NY Power Authority, Dubai\'s national UTM and Finland\'s U-space.',
      description: [
        'ANRA Technologies builds SmartSkies, a drone operations and UAS traffic management platform, and ANRA Noon for European U-space services. It has run FAA research contracts on UTM scalability and Remote ID, and Raytheon picked SmartSkies for drone integration work at the Virginia Tech UAS test site.',
        'In November 2024 the FAA granted ANRA a Letter of Acceptance under its Near Term Approval Process for BVLOS deconfliction supporting New York Power Authority drone operations. It won Finland\'s U-space services tender from VTT in February 2025 and, in September 2025, a Dubai contract to design and deploy the emirate\'s UTM platform.'
      ],
      leadership: [['Amit Ganjoo', 'Founder & CEO']],
      products: ['SmartSkies', 'ANRA Noon'],
      funding: {
        totalUsdM: 5.7, roundCount: 3, lastDate: '2021-12', asOf: '2021-12',
        note: 'No round after December 2021 was found.',
        src: DRN
      },
      programs: [
        { name: 'Dubai national UTM platform', customer: 'Dubai Aviation Engineering Projects / Dubai Air Navigation Services', role: 'Prime', year: 2025, status: 'Awarded', src: S('Vertical', 'https://verticalmag.com/press-releases/anra-technologies-appointed-to-develop-landmark-utm-system-in-dubai/') },
        { name: 'Finland U-space services', customer: 'VTT Technical Research Centre of Finland', role: 'Prime', year: 2025, status: 'Awarded', src: S('sUAS News, Feb 2025', 'https://www.suasnews.com/2025/02/anra-technologies-to-power-finlands-u-space-with-advanced-utm-solutions/') },
        { name: 'FAA NTAP approval for NYPA BVLOS operations', customer: 'FAA / New York Power Authority', role: 'Prime', year: 2024, status: 'Approved', src: S('DroneXL, Nov 2024', 'https://dronexl.co/2024/11/08/faa-airspace-management-approval-anra-ny-power-authority-drone-ops') },
        { name: 'FAA Remote ID collection and dissemination', customer: 'FAA', role: 'Prime', year: 2022, status: 'Complete', src: S('sUAS News, Nov 2022', 'https://www.suasnews.com/2022/11/anra-technologies-wins-faa-contract-for-broadcast-remote-id-collection-correlation-and-network-dissemination/') }
      ]
    });

    DTM.add({
      id: 'aloft', name: 'Aloft Technologies', short: 'Aloft', formerly: 'Kittyhawk', domain: 'aloft.ai', status: 'private', stage: 'Acquired (Versaterm)',
      hq: 'Silver Spring, MD', country: 'US', founded: 2015,
      subsegments: ['uas.airspace'],
      oneLiner: 'LAANC airspace authorizations and Air Control fleet software; now part of Versaterm\'s DroneSense public safety platform.',
      description: [
        'Aloft, renamed from Kittyhawk in 2021, is an FAA-approved UAS Service Supplier that handles most US LAANC airspace authorizations: more than 1.6 million in total and 400,000 in 2024. Its Air Control software manages drone fleets, pilots and compliance, and Aloft Geo lets public safety agencies publish airspace advisories.',
        'Terra Drone became its largest shareholder in March 2024. Unusual Machines agreed to buy Aloft for $14.5M in stock in February 2025 but ended the deal in June 2025. Versaterm acquired Aloft in February 2026 to build authorizations into DroneSense, its public safety drone platform; price undisclosed.'
      ],
      leadership: [['Jon Hegranes', 'Co-founder'], ['Joshua Ziering', 'Co-founder']],
      products: ['Air Control', 'Aloft Geo', 'LAANC authorizations'],
      funding: {
        totalUsdM: 9.5, roundCount: 8, lastDate: '2024-03', asOf: '2024-03',
        investors: ['Terra Drone'],
        note: 'Raised before Versaterm\'s February 2026 acquisition (price undisclosed). A $14.5M all-stock sale to Unusual Machines was signed in February 2025 and terminated in June 2025.',
        src: [DRN, S('DroneLife, Feb 2026', 'https://dronelife.com/2026/02/19/versaterm-acquires-aloft-to-expand-drone-capabilities-for-public-safety'), S('Unusual Machines (SEC), Jun 2025', 'https://www.sec.gov/Archives/edgar/data/1956955/000168316825004460/umac_ex9901.htm')]
      },
      programs: [
        { name: 'LAANC UAS Service Supplier', customer: 'FAA', role: 'Vendor', status: 'Operational', note: 'More than 1.6 million authorizations in total, 400,000 in 2024.', src: S('FinanzNachrichten, Feb 2025', 'https://www.finanznachrichten.de/nachrichten-2025-02/64450370-unusual-machines-enters-into-a-definive-agreement-to-acquire-drone-software-company-aloft-technologies-to-grow-the-american-drone-ecosystem-200.htm') },
        { name: 'Airspace authorization in DroneSense', customer: 'Public safety agencies (via Versaterm)', role: 'Vendor', year: 2026, status: 'Integrating', src: S('DroneDJ, Feb 2026', 'https://dronedj.com/2026/02/19/versaterm-aloft-dronesense-acquisition-faa/') }
      ]
    });

    DTM.add({
      id: 'darkhive', name: 'Darkhive', domain: 'darkhive.com', status: 'private', stage: 'Series B',
      hq: 'San Antonio, TX', country: 'US', founded: 2021,
      subsegments: ['uas.autonomy', 'uas.small'],
      oneLiner: 'Autonomy software and small ISR drones (Yellowjacket, Obelisk); $49.7M Army APFIT award and RTX-led Series B.',
      description: [
        'Darkhive builds autonomy software and US-made small drones for defense and public safety. Its products include the Yellowjacket indoor/outdoor ISR quadcopter, the foldable Obelisk drone, Broodbox control software and FleetForge for software delivery to uncrewed systems. AFWERX raised its Autonomy Prime Phase III SBIR ceiling to $100M in January 2024.',
        'Darkhive won a $49.7M Army APFIT award in December 2025, the largest APFIT award to date, and disclosed it in March 2026. It closed a $30M Series B led by RTX Ventures on May 7, 2026, following a $21M Series A led by Ten Eleven Ventures in September 2024.'
      ],
      leadership: [['John Goodson', 'Co-founder & CEO']],
      products: ['Yellowjacket', 'Obelisk', 'Broodbox', 'FleetForge'],
      funding: {
        totalUsdM: 56.0, roundCount: 4, lastDate: '2026-05', asOf: '2026-05',
        rounds: [{ date: '2026-05', type: 'Series B', amountUsdM: 30, leads: ['RTX Ventures'] }],
        investors: ['RTX Ventures', 'Ten Eleven Ventures', 'Draper Associates', 'Bison Capital', 'Crosslink Capital', 'Stellar Ventures', 'Alamo Angels'],
        note: 'Table total of $26.0M through Sep 2024, plus a $30M Series B in May 2026. Tectonic Defense puts the total at about $55M.',
        src: [DRN, S('EIN Presswire, May 2026', 'https://www.einpresswire.com/article/911067593/darkhive-announces-close-of-30-million-series-b-funding-round-led-by-rtx-ventures'), S('Tectonic Defense', 'https://www.tectonicdefense.com/darkhive-secures-30m-in-series-b-funding/')]
      },
      programs: [
        { name: 'APFIT tactical-edge command and control', customer: 'US Army', role: 'Prime', value: '$49.7M', year: 2025, status: 'Awarded', note: 'Largest APFIT award to date; disclosed by Darkhive in March 2026.', src: S('Tectonic Defense', 'https://www.tectonicdefense.com/darkhive-secures-30m-in-series-b-funding/') },
        { name: 'AFWERX Autonomy Prime Phase III SBIR', customer: 'US Air Force (AFWERX)', role: 'Prime', value: 'Up to $100M', year: 2024, status: 'Awarded', note: 'Ceiling raised from about $5M; ordering period extended to five years.', src: S('DroneXL, Jan 2024', 'https://dronexl.co/2024/01/07/darkhive-100-million-federal-contract-drone/') }
      ]
    });

    DTM.add({
      id: 'uavionix', name: 'uAvionix', domain: 'uavionix.com', status: 'private', stage: 'Acquired (DC Capital Partners)',
      hq: 'Bigfork, MT', country: 'US', founded: 2015,
      subsegments: ['uas.components', 'uas.airspace'],
      oneLiner: 'ADS-B, micro-IFF transponders, muLTElink C2 radios and Casia detect-and-avoid for military and civil drones.',
      description: [
        'uAvionix makes communications, navigation and surveillance avionics for drones and light aircraft: ping ADS-B receivers, RT-2087/ZPX Mode 5 micro-IFF transponders, muLTElink C2 radios managed through its SkyLine service, and Casia optical detect-and-avoid from its October 2023 purchase of Iris Automation. Its transponders fly on the Navy and Marine Corps Tactical Resupply UAS.',
        'Private equity firm DC Capital Partners acquired uAvionix in March 2022. The ZPX-1 earned DoD AIMS certification in 2024, and the FAA funded C2 link and C-band spectrum work the same year. uAvionix upgraded muLTElink in May 2025 and added its ADS-B data to VOTIX in August 2025.'
      ],
      leadership: [['Jon Damush', 'CEO']],
      products: ['ping ADS-B', 'RT-2087/ZPX micro-IFF', 'muLTElink', 'SkyLine', 'Casia'],
      funding: {
        totalUsdM: 10.0, roundCount: 2, lastDate: '2017-11', asOf: '2017-11',
        investors: ['Airbus Ventures', 'Playground Global', 'Redpoint Ventures'],
        note: 'Raised before DC Capital Partners acquired the company in March 2022; terms undisclosed.',
        src: [DRN, S('AOPA, Mar 2022', 'https://www.aopa.org/news-and-media/all-news/2022/march/14/uavionix-acquired-by-dc-capital-partners')]
      },
      programs: [
        { name: 'Tactical Resupply UAS transponders', customer: 'US Navy / USMC', role: 'Supplier', year: 2023, status: 'Production', note: 'Part of SURVICE Engineering\'s TRUAS production contract.', src: S('Military Embedded Systems', 'https://militaryembedded.com/avionics/computers/uas-transponder-from-uavionix-part-of-navy-marine-corps-contract') },
        { name: 'RT-2087/ZPX-1 Mode 5 micro-IFF certification', customer: 'DoD AIMS Program Office', role: 'Supplier', year: 2024, status: 'Certified', note: 'Company says it meets Army FTUAS Increment 2 requirements.', src: S('uAvionix', 'https://uavionix.com/press/uavionix-achieves-aims-certification-of-worlds-first-mode-5-micro-iff-combined-transponder-receiver-ctr/') },
        { name: 'FAA BVLOS C2 link research', customer: 'FAA', role: 'Prime', year: 2024, status: 'Development', note: 'Multi-link C2 along an Alaskan pipeline with the University of Alaska Fairbanks.', src: S('DroneLife, Mar 2024', 'https://dronelife.com/2024/03/26/uavionix-secures-faa-contract-to-enhance-bvlos-communications-for-uas/amp') }
      ]
    });

    DTM.add({
      id: 'vertiq', name: 'Vertiq', domain: 'vertiq.co', status: 'private', stage: 'Seed',
      hq: 'Philadelphia, PA', country: 'US', founded: 2017,
      subsegments: ['uas.components'],
      oneLiner: 'Integrated motor and ESC modules for drones; its 81-08 G2 was the first motor-ESC pair on DIU\'s Blue UAS Framework.',
      description: [
        'Vertiq makes compact brushless motors with built-in speed controllers and position sensors for commercial and defense drones, working with PX4 and ArduPilot flight controllers. It came out of the University of Pennsylvania robotics lab, builds NDAA-compliant parts and has an AFWERX SBIR Phase I for an underactuated propulsion system.',
        'In January 2025 its 81-08 G2 module was added to the Defense Innovation Unit\'s Blue UAS Framework, which the company says made it the first motor and ESC combination approved. Its last confirmed equity round was a seed round in 2022.'
      ],
      leadership: [['Jon Broome', 'Co-founder & CEO']],
      products: ['81-08 G2', '81-17', '40-14', '23-06'],
      funding: {
        totalUsdM: 3.2, roundCount: 6, lastDate: '2022-05', asOf: '2022-05',
        investors: ['SOSV (HAX)', 'Monozukuri Ventures', 'Robin Hood Ventures', 'Alumni Ventures'],
        note: 'CB Insights lists a November 2025 round with no amount; not confirmed by the company.',
        src: DRN
      },
      programs: [
        { name: 'Blue UAS Framework: 81-08 G2 motor/ESC', customer: 'Defense Innovation Unit', role: 'Supplier', year: 2025, status: 'Approved', src: S('Unmanned Systems Technology, Feb 2025', 'https://www.unmannedsystemstechnology.com/2025/02/vertiqs-81-08-g2-module-added-to-dius-blue-uas-framework/') },
        { name: 'AFWERX SBIR Phase I: underactuated propulsion', customer: 'US Air Force (AFWERX)', role: 'Prime', status: 'Awarded' }
      ]
    });
  }
  /* ---- b6: public UAS comps (Palladyne AI, NextVision, Elsight, Mobilicom, Volatus, Draganfly, AIRO) ---- */
  {
    const SHEET = S('Public comps sheet provided for this map (undated)');

    DTM.add({
      id: 'palladyne-ai', name: 'Palladyne AI', domain: 'palladyneai.com', status: 'public', ticker: 'PDYN', exchange: 'NASDAQ',
      formerly: 'Sarcos',
      hq: 'Salt Lake City, UT', country: 'US', founded: 1983,
      subsegments: ['uas.autonomy'],
      oneLiner: 'SwarmOS autonomy software that lets one operator fly mixed drone fleets, plus GuideTech avionics and the Gremlin-X mini-bomber.',
      description: [
        'Palladyne AI, formerly Sarcos Technology and Robotics, sells SwarmOS, autonomy software that lets one operator control drones from different makers. In November 2025 it bought GuideTech (BRAIN avionics, FLEX flight software) and two Michigan machine shops, Warnke Precision Machining and MKR Fabricators, to form Palladyne Defense, which builds UAV and loitering-munition components and the Gremlin-X mini-bomber.',
        'Q2 2026 revenue rose 470% to $5.8M, with $13.0M of new awards and a $24.6M backlog at June 30; 2026 guidance is $24M–$27M. In July 2026 it executed a $4.2M AFRL contract (HANGTIME) to network satellite, aerial and ground systems, and SwarmOS flew in the 4th Infantry Division\'s Ivy Mass exercise under the Army\'s Disruptive Applications program.'
      ],
      leadership: [['Ben Wolff', 'CEO']],
      products: ['SwarmOS', 'IntelliSwarm', 'BRAIN X2 flight module', 'FLEX flight software', 'Gremlin-X'],
      marketCap: { usdM: 260, asOf: '2026-10', src: S('CompaniesMarketCap, early Oct 2026', 'https://companiesmarketcap.com/palladyne-ai/marketcap/') },
      financials: {
        cur: 'USD', fyEnd: 'Dec',
        periods: [
          { label: 'FY2024', revenue: 7.8, opIncome: -26.9, netIncome: -72.6 },
          { label: 'FY2025', revenue: 5.2, opIncome: -32.4, netIncome: 10.0 },
          { label: 'Q2 2026', revenue: 5.8 }
        ],
        notes: 'FY2025 GAAP net income reflects a $37.7M gain on warrant liabilities; the non-GAAP net loss was $25.2M. 2026 revenue guidance is $24M–$27M; cash was $47.0M at end-2025.',
        asOf: '2026-08-06',
        src: [
          S('Palladyne AI FY2025 results, Business Wire', 'https://www.businesswire.com/news/home/20260305148397/en/Palladyne-AI-Reports-Fourth-Quarter-and-Full-Year-2025-Results-and-Reiterates-2026-Revenue-Guidance-of-24-to-27-Million/'),
          S('Palladyne AI Q2 2026 results, Business Wire', 'https://www.businesswire.com/news/home/20260806302133/en/Palladyne-AI-Reports-Second-Quarter-2026-Results')
        ]
      },
      valuation: { evSales: 50.0, basis: 'Market cap ÷ FY2025 revenue', note: 'EV not compiled; ratio shown uses market cap. On the 2026 guidance midpoint ($25.5M) it is about 10.2x.', asOf: '2026-10', src: S('CompaniesMarketCap', 'https://companiesmarketcap.com/palladyne-ai/marketcap/') },
      programs: [
        { name: 'AFRL HANGTIME swarming contract', customer: 'AFRL', role: 'Prime', value: '$4.2M', year: 2026, status: 'In progress', src: S('Business Wire, Jan 2026', 'https://www.businesswire.com/news/home/20260128851511/en/Palladyne-AI-Awarded-U.S.-Air-Force-Contract-to-Advance-Swarming-Capabilities-for-Integrated-Cross-Domain-Operations') },
        { name: 'Army Disruptive Applications exercises (Ivy Mass)', customer: 'US Army 4th Infantry Division', role: 'Vendor', year: 2026, status: 'Exercise', src: S('Business Wire, Aug 2026', 'https://www.businesswire.com/news/home/20260806302133/en/Palladyne-AI-Reports-Second-Quarter-2026-Results') }
      ]
    });

    DTM.add({
      id: 'nextvision', name: 'NextVision Stabilized Systems', short: 'NextVision', domain: 'nextvision-sys.com', status: 'public', ticker: 'NXSN', exchange: 'TASE',
      hq: 'Ra\'anana', country: 'IL', founded: 2009,
      subsegments: ['uas.components'],
      oneLiner: 'Small stabilized EO/IR gimbal cameras, such as the 125-gram DragonEye2, for micro and mini drones, ground vehicles and boats.',
      description: [
        'NextVision designs compact stabilized gimbal cameras with dual EO/IR sensors and high optical zoom for micro and mini drones, ground vehicles and maritime systems; its DragonEye2 weighs 125 grams. It sells to drone makers, and Europe supplied 58.1% of first-half 2026 revenue as defense demand there rose. It has traded on the Tel Aviv Stock Exchange since June 2021.',
        '2025 revenue rose 46% to $168.4M with $103.6M of net income. Q2 2026 revenue rose 138% to $88.2M as monthly production capacity doubled to more than 3,000 units, and in August 2026 the board raised its 2026 revenue target for the second time, to $355M. Three orders totaling about $108.5M for 2026 delivery were reported at the start of 2026.'
      ],
      leadership: [['Chen Golan', 'Co-founder & Chairman']],
      products: ['DragonEye2'],
      marketCap: { usdM: 6021, local: { cur: 'ILS', valueM: 20070 }, asOf: '2026-08-24', src: S('HALO Technologies', 'https://www.halo-technologies.com/markets/shares/tae/nxsn/') },
      financials: {
        cur: 'USD', fyEnd: 'Dec',
        periods: [
          { label: 'FY2024', revenue: 114.9, opIncome: 73.0, netIncome: 66.4 },
          { label: 'FY2025', revenue: 168.4, grossMargin: 69.8, opIncome: 101.5, netIncome: 103.6 },
          { label: 'H1 2026', revenue: 155.5, opIncome: 90.2, netIncome: 91.9 }
        ],
        notes: 'Q2 2026 revenue was $88.2M at a 65.2% gross margin. The board\'s 2026 revenue target is $355M, raised from $275M in January and $315M in May.',
        asOf: '2026-08-10',
        src: [
          S('NextVision FY2025 results', 'https://aijourn.com/nextvision-reports-record-results-exceeding-board-targets-for-the-fifth-consecutive-year/'),
          S('NextVision Q2 2026 results, PR Newswire', 'https://www.prnewswire.com/il/news-releases/nextvision-announces-record-second-quarter-2026-results-302847022.html'),
          S('Quartr Q2 2026 summary', 'https://quartr.com/events/nextvision-stabilized-systems-ltd-nxsn-q2-2026_FVwrBFJo'),
          S('Stock Titan', 'https://www.stocktitan.net/news/NXSNF/')
        ]
      },
      valuation: { evSales: 35.8, basis: 'Market cap ÷ FY2025 revenue', note: 'EV not compiled; ratio shown uses market cap. ILS converted at about 0.30. On the $355M 2026 target it is about 17.0x.', asOf: '2026-08-24', src: S('HALO Technologies', 'https://www.halo-technologies.com/markets/shares/tae/nxsn/') },
      programs: [
        { name: 'Camera orders for 2026 delivery (three orders)', customer: 'Undisclosed', role: 'Supplier', value: '~$108.5M', year: 2026, status: 'Delivering', src: S('Stock Titan', 'https://www.stocktitan.net/news/NXSNF') },
        { name: 'Camera orders over $2M each (25 orders)', customer: 'Undisclosed', role: 'Supplier', value: '~$223.1M', year: 2025, status: 'Ordered' }
      ]
    });

    DTM.add({
      id: 'elsight', name: 'Elsight', domain: 'elsight.com', status: 'public', ticker: 'ELS', exchange: 'ASX',
      hq: 'Or Yehuda', country: 'IL', founded: 2009,
      subsegments: ['uas.components', 'sensors.comms'],
      oneLiner: 'Halo modules that bond cellular, satellite and RF links so drones can fly beyond line of sight; on the Blue UAS list.',
      description: [
        'Elsight, based in Or Yehuda, Israel and listed on the ASX since 2017, makes Halo, a module that bonds LTE/5G, satellite and RF links into one connection so drones and ground robots can operate beyond visual and radio line of sight. It sells mainly to drone and robotics makers, including a European OEM that ordered US$21.2M of units for delivery in January–April 2026.',
        'Revenue rose elevenfold to US$22.8M in 2025, its first profitable year (US$7.5M). H1 2026 revenue was US$23.4M. DCMA added Halo to the Blue UAS Cleared List in May 2026, the US Army signed a Basic Ordering Agreement in September 2026, and Halo was listed on the Army\'s UAS Marketplace on September 15, 2026.'
      ],
      leadership: [['Yoav Amitai', 'CEO']],
      products: ['Halo'],
      marketCap: { usdM: 837, local: { cur: 'AUD', valueM: 1288 }, asOf: '2026-08-03', src: S('InvestSMART', 'https://www.investsmart.com.au/security/asx/els/elsight-limited') },
      financials: {
        cur: 'USD', fyEnd: 'Dec',
        periods: [
          { label: 'FY2024', revenue: 2.03, netIncome: -3.87 },
          { label: 'FY2025', revenue: 22.8, netIncome: 7.48 },
          { label: 'H1 2026', revenue: 23.4 }
        ],
        notes: 'Q2 2026 revenue was US$11.83M, a sixth straight record quarter; the company expects unaudited H1 2026 non-GAAP net profit above US$10M.',
        asOf: '2026-07',
        src: [
          S('Elsight Appendix 4E, Feb 2026', 'https://bulletin.webull.com/qbd/announcement/20260225/499502625/28965f2ced1d82736a6a1fd942298c8b.pdf'),
          S('Kalkine Media, H1 2026 revenue', 'https://kalkinemedia.com/au/news/announcements/elsight-reports-record-h1-2026-revenue-of-us234-million-driven-by-defence-contracts-and-global-expansion')
        ]
      },
      valuation: { evSales: 36.7, basis: 'Market cap ÷ FY2025 revenue', note: 'EV not compiled; ratio shown uses market cap. AUD converted at about 0.65.', asOf: '2026-08-03', src: S('InvestSMART', 'https://www.investsmart.com.au/security/asx/els/elsight-limited') },
      programs: [
        { name: 'US Army Basic Ordering Agreement', customer: 'US Army', role: 'Supplier', year: 2026, status: 'Awarded', src: S('PR Newswire, Sep 2026', 'https://www.prnewswire.com/il/news-releases/us-army-signs-basic-ordering-agreement-with-elsight-for-uncrewed-systems-connectivity-302867507.html') },
        { name: 'Blue UAS Cleared List (Halo)', customer: 'DCMA', role: 'Supplier', year: 2026, status: 'Listed', src: S('Ynet, Sep 2026', 'https://www.ynetnews.com/tech-and-digital/article/b1i7sbpugg') },
        { name: 'Halo order from European OEM', customer: 'European drone OEM', role: 'Supplier', value: 'US$21.2M', year: 2026, status: 'Delivering', src: S('Grafa', 'https://grafa.com/en/news/australia/elsight-wins-us-21-2m-contract-boosting-growth-and-defence-connectivity') }
      ]
    });

    DTM.add({
      id: 'mobilicom', name: 'Mobilicom', domain: 'mobilicom.com', status: 'public', ticker: 'MOB', exchange: 'NASDAQ',
      hq: 'Palo Alto, CA', country: 'US', founded: 2006,
      subsegments: ['uas.components', 'sensors.comms'],
      oneLiner: 'SkyHopper datalinks, ground control stations and ICE cybersecurity software for small military drones and robots.',
      description: [
        'Mobilicom supplies SkyHopper datalinks, mobile ground control stations and the ICE cybersecurity suite to makers of small drones and robots. Founded in Shoham, Israel in 2006 by Oren Elkayam and Yossi Segal, it now gives Palo Alto, California as its headquarters. Named customers have included Airbus, Lockheed Martin and the Israel Ministry of Defense.',
        'In Q1 2026 it booked $2.2M of orders from a large US maker of small loitering-munition drones under the OPF-L program. H1 2026 revenue rose 19% to $1.7M, with one customer at 82% of income, and the net loss widened to about $6.7M. In September 2026 an Asia-based robotics conglomerate placed a follow-on ground control station order.'
      ],
      leadership: [['Oren Elkayam', 'Founder & CEO']],
      products: ['SkyHopper PRO', 'ICE cybersecurity suite', 'Mobile Ground Control Station', 'OS3', 'CONTROLit'],
      marketCap: { usdM: 36.8, asOf: '2026-09-09', src: S('YCharts', 'https://ycharts.com/companies/MOB/market_cap') },
      financials: {
        cur: 'USD', fyEnd: 'Dec',
        periods: [
          { label: 'FY2024', revenue: 3.18, ebitda: -3.19, netIncome: -8.01 },
          { label: 'FY2025', revenue: 3.36, ebitda: -3.98, netIncome: -23.72 },
          { label: 'H1 2026', revenue: 1.7, netIncome: -6.7 }
        ],
        notes: 'The 2025 net loss includes $13.7M of net financial expenses; hardware gross margin was 53%. The H1 2026 net loss is from a third-party analysis; cash was about $15.2M at June 30, 2026.',
        asOf: '2026-08-13',
        src: [
          S('Stock Titan, 6-K summary', 'https://www.stocktitan.net/sec-filings/MOB/6-k-mobilicom-ltd-current-report-foreign-issuer-257066a022e8.html'),
          S('Stock Titan, 2025 year-end release', 'https://www.stocktitan.net/news/MOB/mobilicom-reports-2025-year-end-financial-7yhvn5f7pg5h.html'),
          S('Panabee, Aug 2026', 'https://www.panabee.com/news/mobilicom-earnings-q2-2026')
        ]
      },
      valuation: { evSales: 11.0, basis: 'Market cap ÷ FY2025 revenue', note: 'EV not compiled; ratio shown uses market cap.', asOf: '2026-09-09', src: S('YCharts', 'https://ycharts.com/companies/MOB/market_cap') },
      programs: [
        { name: 'OPF-L loitering munition datalink orders', customer: 'US small-drone manufacturer', role: 'Supplier', value: '$2.2M', year: 2026, status: 'Production', src: S('StreetInsider, Q1 2026 update', 'https://www.streetinsider.com/Press+Releases/Mobilicom+Provides+First+Quarter+2026+Financial+Highlights+%26+Business+Update/26557564.html') },
        { name: 'Ground control station follow-on order', customer: 'Asia-based robotics conglomerate', role: 'Supplier', year: 2026, status: 'Production', src: S('Finviz, Sep 2026', 'https://finviz.com/news/391703/mobilicom-receives-follow-on-ground-control-station-order-from-asian-customer') }
      ]
    });

    DTM.add({
      id: 'volatus', name: 'Volatus Aerospace', short: 'Volatus', domain: 'volatusaerospace.com', status: 'public', ticker: 'FLT', exchange: 'TSX',
      country: 'CA', founded: 2019,
      subsegments: ['uas.tactical', 'uas.commercial'],
      oneLiner: 'Canadian drone maker and operator: tactical ISR drones for NATO customers, drone docks and aerial services.',
      description: [
        'Volatus Aerospace builds and operates drones for defense and commercial customers, selling tactical ISR drone systems to NATO members alongside aerial services. In June 2026 it opened a 53,000-square-foot manufacturing and integration facility at Montreal-Mirabel airport, where drone docking stations are in production and V-Series aircraft are next. It bought remotely piloted aircraft designs from UK firm Caliburn.',
        'Fiscal 2025 revenue rose 26% to C$34.2M, with defense and equipment sales up 106%, and the net loss was C$22.0M. A NATO training-system contract worth up to C$9M followed in December 2025. Q2 2026 revenue was C$8.4M after a C$2.6M defense delivery slipped; it held C$59.2M of cash at June 30 after a C$34.5M share offering that month.'
      ],
      leadership: [['Glen Lynch', 'CEO']],
      products: ['V-Series', 'Drone docking stations'],
      marketCap: { usdM: 282, local: { cur: 'CAD', valueM: 392 }, asOf: '2026-08-11', src: S('Stockwatch / Google Finance, Aug 2026', 'https://www.google.com/finance/quote/FLT:TSE') },
      financials: {
        cur: 'CAD', fyEnd: 'Dec',
        periods: [
          { label: 'FY2024', revenue: 27.0 },
          { label: 'FY2025', revenue: 34.2, grossMargin: 32, opIncome: -14.9, netIncome: -22.0 },
          { label: 'Q2 2026', revenue: 8.4, grossMargin: 29.3 }
        ],
        notes: 'Q2 2026 adjusted EBITDA loss was C$4.35M. An earnings summary cites 2026 revenue guidance of C$50.6M, weighted to the second half.',
        asOf: '2026-08',
        src: [
          S('Volatus FY2025 results, Barchart', 'https://www.barchart.com/story/news/1062777/volatus-aerospace-reports-fiscal-year-2025-financial-results'),
          S('Volatus Q2 2026 results, Barchart', 'https://www.barchart.com/story/news/3839853/volatus-aerospace-releases-q2-2026-financial-results'),
          S('Quartr Q2 2026 summary', 'https://quartr.com/events/volatus-aerospace-inc-flt-q2-2026_F4iyNGi3')
        ]
      },
      valuation: { evSales: 11.5, basis: 'Market cap ÷ FY2025 revenue', note: 'EV not compiled; ratio shown uses market cap. CAD converted at about 0.72.', asOf: '2026-08-11', src: S('Stockwatch / Google Finance', 'https://www.google.com/finance/quote/FLT:TSE') },
      programs: [
        { name: 'NATO interim ISR training system', customer: 'NATO-allied organization', role: 'Prime', value: 'up to C$9M', year: 2025, status: 'Delivering', src: S('BNN Bloomberg, Mar 2026', 'https://www.bnnbloomberg.ca/press-releases/2026/03/31/volatus-aerospace-reports-fiscal-year-2025-financial-results') },
        { name: 'Tactical ISR drone systems', customer: 'NATO member countries', role: 'Prime', status: 'Delivering' }
      ]
    });

    DTM.add({
      id: 'draganfly', name: 'Draganfly', domain: 'draganfly.com', status: 'public', ticker: 'DPRO', exchange: 'NASDAQ',
      hq: 'Saskatoon', country: 'CA', founded: 1998,
      subsegments: ['uas.small'],
      oneLiner: 'Flex FPV drones for the US Army and AFSOC plus public safety drones; now mostly a defense business.',
      description: [
        'Draganfly, based in Saskatoon and listed on Nasdaq and the Canadian Securities Exchange, builds small drones and provides drone services. Its defense pivot centers on the Flex FPV, a modular first-person-view drone; the US Army selected it in September 2025, with an initial order that also set up Flex FPV manufacturing at overseas US forces facilities.',
        'FY2025 revenue rose 17.8% to C$7.7M, though gross margin fell to 17.1%. It added a contract with Air Force Special Operations Command units through DelMar Aerospace and further Flex FPV selections in Q2 2026, when revenue grew 26% to C$2.7M. Equity raises lifted cash to C$131.9M by June 30, 2026.'
      ],
      products: ['Flex FPV', 'Commander 3XL', 'Apex'],
      marketCap: { usdM: 235, local: { cur: 'CAD', valueM: 326 }, asOf: '2026-09', src: S('Digrin ($6.20 Nasdaq price, Sep 2026; CAD value converted at ~0.72)', 'https://www.digrin.com/stocks/detail/DPRO/financials') },
      financials: {
        cur: 'CAD', fyEnd: 'Dec',
        periods: [
          { label: 'FY2024', revenue: 6.56, grossMargin: 21.3 },
          { label: 'FY2025', revenue: 7.73, grossMargin: 17.1 }
        ],
        notes: 'Q2 2026 revenue was C$2.66M (+26% year on year) with a C$11.8M comprehensive loss. Cash was C$131.9M at June 30, 2026, so enterprise value is well below market cap.',
        asOf: '2026-08-10',
        src: [S('Draganfly FY2025 results, Mar 2026', 'https://draganfly.com/press-release/draganfly-reports-record-q4-and-year-end-results/'), S('TipRanks, Q2 2026', 'https://www.tipranks.com/news/company-announcements/draganfly-posts-record-q2-revenue-as-defense-focused-drone-strategy-accelerates')]
      },
      valuation: { evSales: 42.2, basis: 'Market cap ÷ FY2025 revenue', note: 'EV not compiled; ratio shown uses market cap and CAD revenue converted at about 0.72. Net cash of roughly $95M would cut the EV-based multiple sharply.', asOf: '2026-09', src: S('Digrin', 'https://www.digrin.com/stocks/detail/DPRO/financials') },
      programs: [
        { name: 'Flex FPV drones and forward manufacturing', ref: 'pbas', customer: 'US Army', role: 'Prime', year: 2025, status: 'Delivering', src: S('Stockwatch, 2026', 'https://www.stockwatch.com/News/Item/Z-C!DPRO-3736704/C/DPRO') },
        { name: 'Flex FPV for AFSOC units (with DelMar Aerospace)', customer: 'Air Force Special Operations Command', role: 'Sub', year: 2026, status: 'Awarded', src: S('Draganfly FY2025 results, Mar 2026', 'https://draganfly.com/press-release/draganfly-reports-record-q4-and-year-end-results/') }
      ]
    });

    DTM.add({
      id: 'airo-group', name: 'AIRO Group Holdings', short: 'AIRO', status: 'public', ticker: 'AIRO', exchange: 'NASDAQ',
      hq: 'McLean, VA', country: 'US', founded: 2021,
      subsegments: ['uas.tactical', 'uas.components'],
      oneLiner: 'RQ-35 Heidrun ISR drones (Sky-Watch), avionics, pilot training and eVTOL; Blue UAS listed and flown in Ukraine.',
      description: [
        'AIRO Group Holdings runs four segments: drones, avionics, training and electric air mobility. Its drone business is built on Denmark\'s Sky-Watch, acquired in 2022, maker of the RQ-35 Heidrun small ISR drone, which Ukraine has flown on more than 500 missions and the Dutch Ministry of Defence selected in June 2026. AIRO listed on Nasdaq through a June 2025 IPO.',
        'In July 2026 the RQ-35 was added to the Blue UAS list, and AIRO finished its first US-built RQ-35s in Phoenix, Arizona, fitted with the new Zentra camera suite. FY2025 revenue was $90.9M, up from $86.9M, with an operating loss of $28.8M; management guided to 15–25% revenue growth in 2026.'
      ],
      leadership: [['Joseph D. Burns', 'CEO & Director']],
      products: ['RQ-35 Heidrun', 'Zentra camera suite', 'Avionics', 'Pilot training'],
      marketCap: { usdM: 245, asOf: '2026-10', src: S('StockAnalysis', 'https://stockanalysis.com/stocks/AIRO') },
      financials: {
        cur: 'USD', fyEnd: 'Dec',
        periods: [
          { label: 'FY2024', revenue: 86.9, opIncome: -17.4 },
          { label: 'FY2025', revenue: 90.9, opIncome: -28.8, netIncome: -4.1 }
        ],
        notes: '2026 guidance: 15–25% revenue growth. A third-party summary of the Q2 2026 call cites 76% revenue growth and $163M of backlog; not checked against the filing.',
        asOf: '2026-03-31',
        src: [S('AIRO FY2025 results, Mar 2026', 'https://s205.q4cdn.com/848594466/files/doc_news/AIRO-Reports-Fourth-Quarter-and-Full-Year-2025-Results-2026.pdf')]
      },
      valuation: { evSales: 2.7, basis: 'Market cap ÷ FY2025 revenue', note: 'EV not compiled; ratio shown uses market cap.', asOf: '2026-10', src: S('StockAnalysis', 'https://stockanalysis.com/stocks/AIRO') },
      programs: [
        { name: 'RQ-35 Heidrun in Ukraine', ref: 'ukraine', customer: 'Ukraine', role: 'Prime', status: 'Fielded', note: 'More than 500 missions flown, per Sky-Watch.', src: S('Sky-Watch', 'https://sky-watch.com/who-we-are') },
        { name: 'RQ-35 Heidrun ISR drones', customer: 'Netherlands Ministry of Defence', role: 'Prime', year: 2026, status: 'Selected', src: S('AeroMorning', 'https://aeromorning.com/en/sky-watch-rq-35-heidrun-wins-dutch-ministry-of-defence-bid/') },
        { name: 'Blue UAS listing for RQ-35', customer: 'DCMA / US DoD', role: 'Vendor', year: 2026, status: 'Listed', src: S('Business Wire, Jul 2026', 'https://www.businesswire.com/news/home/20260714120148/en/AIROs-RQ-35-Heidrun-ISR-Drone-Added-To-U.S.-Blue-UAS-List') }
      ]
    });
  }
  /* ---- b7: remaining commercial drone names from the drone funding table ---- */
  {
    const DRN = S('Drone funding table provided for this map (data through Jun 2025)');

    DTM.add({
      id: 'dronedeploy', name: 'DroneDeploy', domain: 'dronedeploy.com', status: 'private', stage: 'Late stage',
      hq: 'San Francisco, CA', country: 'US', founded: 2013,
      subsegments: ['uas.commercial', 'uas.autonomy'],
      oneLiner: 'Reality-capture software that turns drone, 360° camera and ground-robot data into maps, models and progress reports.',
      description: [
        'DroneDeploy, founded in 2013 by Mike Winn, Jono Millin and Nicholas Pilkington, sells software that plans drone flights and turns aerial, 360° walkthrough and ground-robot data into maps, 3D models and inspections for construction, energy and agriculture. Its acquisition of Rocos added autonomous ground-robot operations.',
        'In September 2025 it said it had reached break-even and raised $15M of strategic funding to build Progress AI, which writes construction progress reports from site imagery, and to expand robotics. Its last priced round was a $50M Series E in February 2021 led by Energize Ventures and AirTree.'
      ],
      leadership: [['Mike Winn', 'Co-founder & CEO']],
      products: ['DroneDeploy platform', 'Progress AI', 'Ground Pro'],
      funding: {
        totalUsdM: 159.6, roundCount: 13, lastDate: '2025-09', asOf: '2025-09',
        rounds: [
          { date: '2021-02', type: 'Series E', amountUsdM: 50, leads: ['Energize Ventures', 'AirTree'] },
          { date: '2025-09', type: 'Strategic', amountUsdM: 15 }
        ],
        investors: ['Energize Ventures', 'AirTree', 'Bessemer Venture Partners', 'Scale Venture Partners'],
        note: 'Table total of $144.6M through Jun 2022, plus $15M of strategic funding in Sep 2025.',
        src: [DRN, S('CO/AI, Sep 2025', 'https://getcoai.com/news/dronedeploy-reaches-break-even-raises-15m-for-autonomous-job-sites/'), S('Drone Intelligence', 'https://droneintelligence.ai/companies/dronedeploy')]
      },
      programs: [
        { name: 'Ground Pro 3D site scanning', customer: 'Cairn Homes', role: 'Vendor', year: 2026, status: 'Deployed', src: S('Caplight', 'https://www.caplight.com/company/dronedeploy') },
        { name: 'Drone conservation playbook', customer: 'The Nature Conservancy', role: 'Partner', year: 2026, status: 'Launched', src: S('Caplight', 'https://www.caplight.com/company/dronedeploy') }
      ]
    });

    DTM.add({
      id: 'wingtra', name: 'Wingtra', domain: 'wingtra.com', status: 'private', stage: 'Series B',
      hq: 'Zurich', country: 'CH', founded: 2016,
      subsegments: ['uas.commercial'],
      oneLiner: 'VTOL fixed-wing mapping drones (WingtraOne, WingtraRAY) for surveying, mining and construction.',
      description: [
        'Wingtra grew out of ETH Zurich\'s Autonomous Systems Lab, where its tail-sitter VTOL design began as a research thesis. Co-founder and CEO Maximilian Boosfeld leads the company, which makes vertical-takeoff, fixed-wing drones that carry survey-grade cameras and lidar for mapping in surveying, mining, construction and government. It has about 125 staff, with engineering and manufacturing in Zurich.',
        'Wingtra raised a $22M Series B in March 2023 and a €23M Series B1 led by family office RKKVC in August 2024. In February 2026 its WingtraRAY platform earned EASA C3 and C6 class certification, widening where surveyors can fly it in Europe.'
      ],
      leadership: [['Maximilian Boosfeld', 'Co-founder & CEO']],
      products: ['WingtraOne GEN II', 'WingtraRAY'],
      employees: '~125',
      funding: {
        totalUsdM: 40.9, roundCount: 6, lastDate: '2024-08', asOf: '2024-08',
        rounds: [{ date: '2023-03', type: 'Series B', amountUsdM: 22 }, { date: '2024-08', type: 'Series B1', leads: ['RKKVC'] }],
        note: 'Table total; no later round found. Other trackers put total funding between $44M and $63M. The founding year varies by source (2014–2017); 2016 is used here.',
        src: [DRN, S('DroneXL, Aug 2024', 'https://dronexl.co/2024/08/19/swiss-drone-startup-wingtra-secures-23-million'), S('TechCrunch, Mar 2023', 'https://techcrunch.com/2023/03/21/wingtra/')]
      },
      programs: [
        { name: 'EASA C3 and C6 class certification (WingtraRAY)', customer: 'EASA', role: 'Prime', year: 2026, status: 'Certified' }
      ]
    });

    DTM.add({
      id: 'cyberhawk', name: 'Cyberhawk', status: 'private', stage: 'Acquired (Ondas)',
      hq: 'Livingston', country: 'UK', founded: 2008,
      subsegments: ['uas.commercial'],
      oneLiner: 'Drone inspection and iHawk asset-data software for power grids and offshore wind; acquired by Ondas in Aug 2026.',
      description: [
        'Cyberhawk, founded in Scotland in 2008 by former North Sea rope-access engineer Malcolm Connolly, inspects and surveys power lines, substations, wind turbines and oil and gas sites with drones, and sells iHawk software to manage the imagery and asset data, with an AI module added in 2024. It holds an FAA nationwide beyond-visual-line-of-sight waiver for its US work.',
        'Ondas Holdings agreed in June 2026 to buy Cyberhawk for about $125M and closed on August 10, 2026, paying $118.2M in cash plus 581,732 shares. In September 2026 SSE awarded Cyberhawk a three-year inspection agreement, with a two-year extension option, across its UK networks, plus a lot for offshore wind turbine inspection.'
      ],
      products: ['iHawk', 'Visualive', 'Drone inspection services'],
      funding: {
        totalUsdM: 4.8, roundCount: 4, lastDate: '2016-03', asOf: '2016-03',
        note: 'Table total through Mar 2016. Ondas acquired the company in Aug 2026 for $118.2M in cash plus 581,732 Ondas shares (about $125M as announced).',
        src: [DRN, S('Ondas 10-Q, quarter ended Jun 2026', 'https://www.sec.gov/Archives/edgar/data/0001646188/000119312526349288/onds-20260630.htm'), S('Inside Unmanned Systems', 'https://insideunmannedsystems.com/ondas-to-acquire-cyberhawk-in-125-million-critical-infrastructure-push/')]
      },
      programs: [
        { name: 'SSE networks inspection and offshore wind (Lot 2)', customer: 'SSE (SSEN Transmission / Distribution)', role: 'Prime', year: 2026, status: 'Awarded', note: 'Third consecutive long-term award from SSE; 3 years plus a 2-year option.', src: S('Ondas, Sep 2026', 'https://ir.ondas.com/press-releases/detail/330/ondas-cyberhawktm-secures-multi-year-agreement-for-sse') }
      ]
    });

    DTM.add({
      id: 'easy-aerial', name: 'Easy Aerial', domain: 'easyaerial.com', status: 'private', stage: 'Series A',
      hq: 'Brooklyn, NY', country: 'US', founded: 2015,
      subsegments: ['uas.commercial', 'uas.tactical'],
      oneLiner: 'NDAA-compliant drone-in-a-box and tethered drones (SAMS, SAMS-T) for base security, border and perimeter monitoring.',
      description: [
        'Easy Aerial makes autonomous drone-in-a-box systems and tethered drones for military base security, border protection and critical infrastructure. Its tethered SAMS-T stays aloft for up to 24 hours with power and data running through the tether. The US Air Force declared initial operating capability for its system at Travis Air Force Base in December 2020 after nine months of testing under an SBIR Phase II.',
        'Federal records show 25 US awards worth about $3.69M between August 2022 and July 2025. In December 2025 Canada awarded it a non-competitive C$1.38M contract for Heavy-T uncrewed aircraft systems, running to May 2026.'
      ],
      products: ['SAMS', 'SAMS-T', 'Heavy-T'],
      funding: {
        totalUsdM: 6.2, roundCount: 6, lastDate: '2020-08', asOf: '2020-08',
        note: 'Table total, including a $6.15M Series A announced in 2020; no later round found.',
        src: [DRN, S('Commercial UAV News', 'https://commercialuavnews.com/security/easy-aerial-comes-out-of-stealth-with-a-line-of-autonomous-free-flight-and-tethered-drone-in-a-box-systems')]
      },
      programs: [
        { name: 'Smart Air Force Monitoring System at Travis AFB', customer: 'US Air Force', role: 'Prime', year: 2020, status: 'Fielded', note: 'Initial operational capability declared under an SBIR Phase II.', src: S('Unmanned Airspace', 'https://www.unmannedairspace.info/counter-uas-systems-and-policies/us-air-force-deploys-easy-aerial-airborne-detection-system-at-travis-air-force-base/') },
        { name: 'Heavy-T uncrewed aircraft systems', customer: 'Government of Canada', role: 'Prime', value: 'C$1.38M', year: 2025, status: 'Delivering', src: S('CanadaBuys', 'https://canadabuys.canada.ca/en/tender-opportunities/award-notice/cw2429626') },
        { name: 'US federal awards (25)', customer: 'US DoD and federal agencies', role: 'Prime', value: '~$3.69M', status: 'Awarded', note: 'August 2022 to July 2025.', src: S('HigherGov', 'https://www.highergov.com/awardee/easy-aerial-inc-10045120') }
      ]
    });
  }
})();
