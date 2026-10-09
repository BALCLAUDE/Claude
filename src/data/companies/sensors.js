/* Sensors, EW & Comms segment. HawkEye 360 (space.js) and Robin Radar (cuas.js) also appear here. */
(function () {
  const S = (t, u) => (u ? { t, u } : { t });

  /* ---------------- Radar ---------------- */
  DTM.add({
    id: 'chaos-industries', name: 'Chaos Industries', short: 'Chaos', status: 'private', stage: 'Series D',
    hq: 'Los Angeles, CA', country: 'US', founded: 2022,
    subsegments: ['sensors.radar', 'cuas.sensing'],
    oneLiner: 'Vanquish distributed early-warning radar, built expeditionary and relocatable, for drones and missiles.',
    description: [
      'Chaos builds software-defined, distributed radar systems. Its flagship Vanquish is an expeditionary early-warning radar marketed to track threats out to 250 km, and its Astria radar targets air and missile defense.',
      'It raised a $510M Series D at $4.5B in November 2025, four months after a $275M Series C, taking total funding above $1B in three years.'
    ],
    leadership: [['John Tenet', 'Co-founder & CEO']],
    products: ['Vanquish', 'Astria'],
    funding: {
      totalUsdM: 1000, asOf: '2025-11',
      rounds: [
        { date: '2025-07', type: 'Series C', amountUsdM: 275, postUsdM: 2000 },
        { date: '2025-11', type: 'Series D', amountUsdM: 510, postUsdM: 4500, leads: ['Valor Equity Partners'] }
      ],
      investors: ['Valor Equity Partners', '8VC', 'Accel'],
      note: 'Company reports more than $1B raised since founding.',
      src: S('Business Wire, Nov 2025', 'https://www.businesswire.com/news/home/20251113579391/en/CHAOS-Industries-Raises-%24510-Million-Led-by-Valor-Equity-Partners-to-Accelerate-Next-Generation-Defense-Systems')
    },
    programs: [{ name: 'Astria instrumentation radar', customer: 'US Air Force', role: 'Prime', value: '$1.9M', status: 'Development' }]
  });

  DTM.add({
    id: 'echodyne', name: 'Echodyne', domain: 'echodyne.com', status: 'private', stage: 'Growth',
    hq: 'Kirkland, WA', country: 'US', founded: 2014,
    subsegments: ['sensors.radar', 'cuas.sensing'],
    oneLiner: 'Metamaterial ESA radars (EchoGuard, EchoShield) that are a default sensor in counter-drone systems.',
    description: [
      'Echodyne makes compact electronically scanned array radars based on metamaterials, widely integrated into counter-drone, border security and vehicle protection systems.',
      'In 2026 it is opening an 86,350 sq ft factory in Kirkland designed for more than 30,000 radars a year. EchoShield is the radar inside the Air Force\'s SUADS counter-drone IDIQ (Trust Automation, $490M ceiling).'
    ],
    leadership: [['Eben Frankenberg', 'CEO']],
    products: ['EchoGuard', 'EchoShield', 'EchoFlight'],
    funding: {
      totalUsdM: 202, asOf: '2022-06',
      rounds: [{ date: '2022-06', type: 'Growth', amountUsdM: 135, leads: ['Baillie Gifford'] }],
      investors: ['Baillie Gifford', 'Bill Gates', 'NEA', 'Madrona'],
      note: 'Tracxn reports $202M across six rounds; the company has cited a smaller figure.',
      src: [S('ExecutiveBiz', 'https://executivebiz.com/tag/nea/'), S('Robotics.press', 'https://www.robotics.press/news/echodyne-company-profile/')]
    },
    programs: [
      { name: 'Air Force SUADS counter-drone (EchoShield)', ref: 'cuas-army', customer: 'US Air Force (via Trust Automation)', role: 'Subsystem supplier', value: '$490M ceiling (IDIQ)', status: 'Active' },
      { name: 'Radars for Kyiv', ref: 'ukraine', customer: 'US State Department', role: 'Prime', value: '$15M', year: 2026, status: 'Delivering' }
    ]
  });

  /* ---------------- EW & SIGINT ---------------- */
  DTM.add({
    id: 'cx2', name: 'CX2', status: 'private', stage: 'Series A',
    hq: 'Los Angeles, CA', country: 'US', founded: 2023,
    subsegments: ['sensors.ew', 'cuas.ew'],
    oneLiner: 'Software-defined electronic warfare for the tactical edge: sensing, jamming and spectrum maneuver.',
    description: [
      'CX2 builds intelligent, multi-domain electronic warfare systems that sense, classify and jam signals, designed to be cheap and quick to update as the spectrum fight changes, a lesson from Ukraine.'
    ],
    leadership: [['Nathan Mintz', 'Co-founder & CEO']],
    funding: {
      totalUsdM: 46, asOf: '2025-05',
      rounds: [
        { date: '2024', type: 'Seed', amountUsdM: 15 },
        { date: '2025-05', type: 'Series A', amountUsdM: 31, leads: ['Point72 Ventures'] }
      ],
      investors: ['Point72 Ventures', 'Andreessen Horowitz', '8VC', 'Upfront Ventures'],
      src: S('Gunderson Dettmer', 'https://www.gunder.com/en/news-insights/client-news/point72-leads-dollar31m-series-a-of-defense-tech-cx2')
    },
    programs: []
  });

  /* ---------------- Comms & networking ---------------- */
  DTM.add({
    id: 'aalyria', name: 'Aalyria', domain: 'aalyria.com', status: 'private', stage: 'Series B',
    hq: 'Livermore, CA', country: 'US', founded: 2022,
    subsegments: ['sensors.comms'],
    oneLiner: 'Google spinout: Spacetime network orchestration and Tightbeam laser links across air, sea and space.',
    description: [
      'Aalyria spun out of Google with two technologies: Spacetime, software that orchestrates networks of satellites, aircraft and ground stations in real time, and Tightbeam, free-space optical communications.',
      'It raised a $100M Series B at $1.3B in February 2026.'
    ],
    leadership: [['Chris Taylor', 'CEO']],
    products: ['Spacetime', 'Tightbeam'],
    funding: {
      totalUsdM: 100, asOf: '2026-02',
      rounds: [{ date: '2026-02', type: 'Series B', amountUsdM: 100, postUsdM: 1300, leads: ['Battery Ventures', 'J2 Ventures'] }],
      investors: ['Battery Ventures', 'J2 Ventures', 'DYNE'],
      note: 'Total shows the Series B only; earlier funding not included.',
      src: S('Satellite Today, Feb 2026', 'https://www.satellitetoday.com/finance/2026/02/23/aalyria-posts-100m-series-b-funding-round/')
    },
    programs: []
  });

  DTM.add({
    id: 'cesiumastro', name: 'CesiumAstro', domain: 'cesiumastro.com', status: 'private', stage: 'Series C',
    hq: 'Austin, TX', country: 'US', founded: 2017,
    subsegments: ['sensors.comms', 'space.buses'],
    oneLiner: 'Software-defined phased-array antennas and payloads for satellites, aircraft and drones.',
    description: [
      'CesiumAstro builds active phased-array communications payloads and terminals for satellites, aircraft and uncrewed systems, plus multi-mission software-defined radios.',
      'In February 2026 it closed $470M of growth capital: $270M equity led by Trousdale Ventures plus a $200M EXIM and J.P. Morgan financing package.'
    ],
    leadership: [['Shey Sabripour', 'Founder & CEO']],
    products: ['Nightingale', 'Vireo'],
    funding: {
      totalUsdM: 270, asOf: '2026-02',
      rounds: [{ date: '2026-02', type: 'Series C', amountUsdM: 270, leads: ['Trousdale Ventures'] }],
      investors: ['Trousdale Ventures', 'Airbus Ventures', 'Janus Henderson', 'Woven Capital', 'MESH'],
      note: 'Total shows Series C equity only; excludes the $200M EXIM/J.P. Morgan financing and earlier rounds.',
      src: S('CesiumAstro', 'https://cesiumastro.com/press-release/cesiumastro-closes-470m-series-c')
    },
    programs: []
  });

  DTM.add({
    id: 'persistent-systems', name: 'Persistent Systems', short: 'Persistent', domain: 'persistentsystems.com', status: 'private', stage: 'Privately held',
    hq: 'New York, NY', country: 'US', founded: 2007,
    subsegments: ['sensors.comms'],
    oneLiner: 'Wave Relay MANET radios (MPU5) that network soldiers, drones and robots.',
    description: [
      'Persistent Systems makes the MPU5 and related mobile ad hoc network (MANET) radios using its Wave Relay protocol, a standard data link for special operations, robots and drones.',
      'Its radios form the transport layer for the Army\'s Next Generation Command and Control prototype.'
    ],
    products: ['MPU5', 'Wave Relay', 'Embedded Module'],
    funding: { totalUsdM: null, label: 'Privately held', asOf: '2026-10', note: 'No disclosed venture funding.', src: S('Military Embedded Systems', 'https://militaryembedded.com/company/persistent-systems?page=1') },
    programs: [{ name: 'MANET radios for NGC2', ref: 'ngc2', customer: 'US Army', role: 'Supplier', value: '$87.5M (second order)', status: 'Delivering', src: S('MEXC News', 'https://www.mexc.com/news/637734') }]
  });

  /* ---------------- PNT & quantum ---------------- */
  DTM.add({
    id: 'sandboxaq', name: 'SandboxAQ', domain: 'sandboxaq.com', status: 'private', stage: 'Series E',
    hq: 'Palo Alto, CA', country: 'US', founded: 2022,
    subsegments: ['sensors.pnt', 'software.cyber'],
    oneLiner: 'Alphabet spinout: AQNav magnetic navigation without GPS, plus post-quantum cryptography.',
    description: [
      'SandboxAQ combines AI and quantum technology. For defense its main products are AQNav, which navigates aircraft by reading the Earth\'s magnetic field and is unaffected by GPS jamming, and AQtive Guard for post-quantum cryptographic security.',
      'Its December 2024 round valued it at $5.3B. A 2026 Series F at a higher valuation has been reported by trackers but not confirmed.'
    ],
    leadership: [['Jack Hidary', 'CEO']],
    products: ['AQNav', 'AQtive Guard', 'AQBioSim'],
    funding: {
      totalUsdM: 1450, asOf: '2025-04',
      rounds: [
        { date: '2023-02', type: 'Series D', amountUsdM: 500 },
        { date: '2024-12', type: 'Series E', amountUsdM: 300, postUsdM: 5600 }
      ],
      investors: ['Eric Schmidt', 'NVIDIA', 'Google', 'T. Rowe Price', 'Fred Alger'],
      note: 'The Series E was later extended to about $950M. A reported 2026 Series F ($500M at ~$9.8B) is not confirmed. Total is approximate.',
      src: [S('SecurityWeek', 'https://www.securityweek.com/sandboxaq-raises-300-million-at-5-3-billion-valuation/'), S('DefiLlama', 'https://defillama.com/pre-ipo/sandbox-aq')]
    },
    programs: [{ name: 'AQNav flight trials', customer: 'US Air Force', role: 'Prime', status: 'Testing' }]
  });

  DTM.add({
    id: 'q-ctrl', name: 'Q-CTRL', domain: 'q-ctrl.com', status: 'private', stage: 'Series B',
    hq: 'Sydney', country: 'AU', founded: 2017,
    subsegments: ['sensors.pnt'],
    oneLiner: 'Ironstone Opal quantum navigation that keeps working when GPS is jammed.',
    description: [
      'Q-CTRL develops quantum control software and quantum sensors. Its Ironstone Opal system uses quantum magnetometers and AI to navigate without GPS, and it has been flight-tested with defense partners.',
      'DARPA awarded it US$24.4M in 2025 under the Robust Quantum Sensors program.'
    ],
    leadership: [['Michael Biercuk', 'Founder & CEO']],
    products: ['Ironstone Opal', 'Fire Opal', 'Boulder Opal'],
    funding: {
      totalUsdM: 132, asOf: '2025-08',
      note: 'Total from CB Insights; round details not compiled.',
      src: S('CB Insights', 'https://www.cbinsights.com/investor/q-ctrl')
    },
    programs: [{ name: 'DARPA Robust Quantum Sensors', customer: 'DARPA', role: 'Prime', value: 'US$24.4M', year: 2025, status: 'Development', src: S('Q-CTRL', 'https://q-ctrl.com/blog/darpa-selects-q-ctrl-to-develop-next-generation-quantum-sensors-for-navigation-on-advanced-defense-platforms?') }]
  });

  DTM.add({
    id: 'infleqtion', name: 'Infleqtion', domain: 'infleqtion.com', status: 'public', ticker: 'INFQ', exchange: 'NYSE',
    hq: 'Boulder, CO', country: 'US', founded: 2007,
    subsegments: ['sensors.pnt'],
    oneLiner: 'Neutral-atom quantum company selling atomic clocks, quantum RF sensors and quantum computers.',
    description: [
      'Infleqtion, formerly ColdQuanta, builds quantum hardware based on cold neutral atoms: compact atomic clocks for resilient timing, quantum RF receivers, inertial sensors and the Sqorpius quantum computer.',
      'It listed on the NYSE in 2026 through a SPAC merger.'
    ],
    leadership: [['Matthew Kinsella', 'CEO']],
    products: ['Tiqker clock', 'Quantum RF', 'Sqorpius'],
    marketCap: { usdM: 2820, asOf: '2026-08-20', src: S('Equibles', 'https://equibles.com/stocks/INFQ') },
    valuation: { note: 'Shares have been highly volatile (12-month volatility ~124% per Trefis).', asOf: '2026-08-20', src: S('Trefis', 'https://www.trefis.com/data/companies/infq') },
    programs: [{ name: 'Quantum timing and sensing for DoD', customer: 'DoD / DIU', role: 'Prime', status: 'Prototype' }]
  });
})();
