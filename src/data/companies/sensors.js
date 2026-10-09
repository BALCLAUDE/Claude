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
  /* ---- Batch b1: satcom, PNT and tactical comms additions ---- */
  {
    const TBL = S('Space funding table provided for this map (Oct 2026)');
    const DRN = S('Drone funding table provided for this map (data through Jun 2025)');

    DTM.add({
      id: 'kymeta', name: 'Kymeta', domain: 'kymetacorp.com', status: 'private', stage: 'Late stage',
      hq: 'Redmond, WA', country: 'US', founded: 2012,
      subsegments: ['sensors.comms', 'space.ground'],
      oneLiner: 'Osprey u8 flat-panel satcom terminals with multi-orbit GEO and LEO service for Defense Department users.',
      description: [
        'Kymeta, based in Redmond, Washington, makes flat-panel satellite terminals, led by the Osprey u8, and sells multi-orbit GEO and LEO connectivity through its Kymeta Broadband network. Its terminals switch between TRANSEC and non-TRANSEC networks, and in 2025 the Army chose Kymeta as the multi-orbit satcom provider for its Next Generation Command and Control pilot.',
        'Manny Mora became CEO in 2025, replacing Rick Bergman. In September 2026 an unnamed DoD branch ordered more than 100 Osprey u8 terminals with connectivity for $20M, taking that customer\'s 2026 purchases above $30M. The last disclosed raise, about $84M in March 2022, was led by Bill Gates with Hanwha Systems.'
      ],
      leadership: [['Manny Mora', 'President & CEO']],
      products: ['Osprey u8', 'Kymeta Broadband (KBB)'],
      funding: {
        totalUsdM: 607.5, roundCount: 11, lastDate: '2022-03', asOf: '2022-03',
        rounds: [{ date: '2022-03', type: 'Equity', amountUsdM: 84, leads: ['Bill Gates'] }],
        investors: ['Bill Gates', 'Hanwha Systems'],
        note: 'Table total. GeekWire put total funding at nearly $400M in 2025, so reported totals differ.',
        src: [TBL, S('Business Wire, Mar 2022', 'https://www.businesswire.com/news/home/20220315005023/en'), S('GeekWire, 2025', 'https://www.geekwire.com/2025/satellite-communication-company-kymeta-names-new-ceo-as-it-ramps-up-defense-operations/')]
      },
      programs: [
        { name: 'Osprey u8 terminals and multi-orbit service', customer: 'US DoD (branch undisclosed)', role: 'Prime', value: '$20M', year: 2026, status: 'Delivering', note: 'More than 100 terminals; over $30M delivered to this branch in 2026.', src: S('Via Satellite, Sep 2026', 'https://www.satellitetoday.com/technology/2026/09/01/kymeta-lands-20m-dod-order-for-osprey-u8-satcom-terminals/') },
        { name: 'Army NGC2 pilot multi-orbit satcom', ref: 'ngc2', customer: 'US Army', role: 'Vendor', year: 2025, status: 'Pilot', src: S('GeekWire, 2025', 'https://www.geekwire.com/2025/satellite-communication-company-kymeta-names-new-ceo-as-it-ramps-up-defense-operations/') }
      ]
    });

    DTM.add({
      id: 'xona', name: 'Xona Space Systems', short: 'Xona', domain: 'xonaspace.com', status: 'private', stage: 'Series C',
      hq: 'Burlingame, CA', country: 'US', founded: 2019,
      subsegments: ['sensors.pnt', 'space.buses'],
      oneLiner: 'Pulsar, a planned ~258-satellite LEO constellation broadcasting GPS-compatible navigation and timing signals.',
      description: [
        'Xona Space Systems, founded in 2019 by Stanford and SpaceX alumni, is building Pulsar, a low-Earth-orbit constellation that broadcasts positioning, navigation and timing signals as a backup and complement to GPS. A move from C-band to L-band lets Pulsar work with existing GPS receivers, which matters for military users facing jamming and spoofing.',
        'Xona closed a $170M Series C in late March 2026, with Craft Ventures, ICONIQ, Woven Capital, NGP Capital, Samsung Next and Hexagon participating, to scale satellite production in Burlingame. The first US-built production satellites are due to launch later in 2026, with early service targeted for 2027.'
      ],
      leadership: [['Brian Manning', 'Co-founder & CEO'], ['Tyler Reid', 'Co-founder & CTO']],
      products: ['Pulsar'],
      funding: {
        totalUsdM: 295, roundCount: 7, lastDate: '2026-03', asOf: '2026-03',
        rounds: [{ date: '2026-03', type: 'Series C', amountUsdM: 170 }],
        investors: ['Craft Ventures', 'ICONIQ', 'Woven Capital', 'NGP Capital', 'Samsung Next', 'Hexagon'],
        note: 'Table total, which includes the $170M Series C. Other trackers list totals from $270M to $336M.',
        src: [TBL, S('Raising.fi, Mar 2026', 'https://raising.fi/news/xona-space-systems-series-c-march-2026-1')]
      },
      programs: [
        { name: 'Pulsar LEO PNT constellation', customer: 'Military and commercial PNT users', role: 'Prime', status: 'Deploying', note: 'First production satellites due to launch in 2026; early service targeted for 2027.', src: S('EBSCO / Xona Series C coverage', 'https://www.ebsco.com/articles/engineering/29593a98-34d2-5ddc-9c99-199557b6e9c6/xona-closes-170m-series-c-to-lead-next-era-of-global-navigation/') }
      ]
    });

    DTM.add({
      id: 'somewear', name: 'Somewear Labs', short: 'Somewear', domain: 'somewearlabs.com', status: 'private', stage: 'Series A',
      hq: 'San Francisco, CA', country: 'US', founded: 2017,
      subsegments: ['sensors.comms'],
      oneLiner: 'Satellite and mesh hotspots with Grid software that keep tactical teams messaging and tracked beyond cell coverage.',
      description: [
        'Somewear Labs, founded in 2017 by former Tesla, Apple and Intuit engineers, builds pocket-sized satellite and mesh networking hotspots and the Grid software that manages them, so small units can message and share locations without cellular coverage.',
        'Under Defense Innovation Unit sponsorship it holds a US Marine Corps contract to develop a modular, resilient tactical network for INDOPACOM, with Grid managing and configuring the network. Its last disclosed round was a $13.7M Series A in September 2022, backed by angel investors including former AT&T CEO David Dorman and Cisco CEO Chuck Robbins.'
      ],
      products: ['Satellite/mesh hotspot', 'Grid'],
      funding: {
        totalUsdM: 13.7, roundCount: 3, lastDate: '2022-09', asOf: '2022-09',
        rounds: [{ date: '2022-09', type: 'Series A', amountUsdM: 13.7 }],
        investors: ['David Dorman', 'Chuck Robbins'],
        note: 'Table total; no later round found.',
        src: [DRN, S('Built In SF, Sep 2022', 'https://www.builtinsf.com/articles/somewear-labs-raises-13m-tesla-founders')]
      },
      programs: [
        { name: 'Resilient tactical network for INDOPACOM (DIU-sponsored)', customer: 'US Marine Corps', role: 'Prime', status: 'Development', src: S('Defence Industry Europe', 'https://defence-industry.eu/somewear-labs-secures-contract-to-develop-advanced-tactical-communications-for-u-s-marine-corps/') }
      ]
    });
  }
  /* ---------------- Added from the private names list and public names sheet provided for this map (Oct 2026) ---------------- */
  {
    const CSV = S('Public defense names sheet provided for this map (undated)');

    DTM.add({
      id: 'matrixspace', name: 'MatrixSpace', status: 'private', stage: 'Series B', country: 'US', founded: null,
      subsegments: ['sensors.radar', 'cuas.sensing'],
      oneLiner: 'Portable low-power AI radar for detecting and classifying drones; L3Harris is a strategic investor.',
      description: ['MatrixSpace builds compact, ultra-low-power radar with onboard AI for persistent detection and classification of drones and other targets, for defense, security and airspace users. It closed a $20M Series B in October 2025, co-led by The Raptor Group and OTB Ventures with L3Harris as a new strategic investor, bringing total funding to $58M.'],
      funding: { totalUsdM: 58, asOf: '2025-10', rounds: [{ date: '2025-10', type: 'Series B', amountUsdM: 20, leads: ['The Raptor Group', 'OTB Ventures'] }], src: S('Security Systems News', 'https://www.securitysystemsnews.com/article/matrixspace-completes-20m-series-b-funding') }
    });

    DTM.add({
      id: 'iridium', name: 'Iridium Communications', short: 'Iridium', domain: 'iridium.com', status: 'public', ticker: 'IRDM', exchange: 'NASDAQ',
      hq: 'McLean, VA', country: 'US', founded: 2000,
      subsegments: ['sensors.comms', 'sensors.pnt'],
      oneLiner: 'LEO satellite voice and data network; the Pentagon\'s EMSS service and a growing GPS-backup PNT business.',
      description: ['Iridium operates a 66-satellite low-Earth-orbit network for global voice and data. Its Enhanced Mobile Satellite Services contract with the US government pays a fixed $110.5M a year and expires in September 2026, with a renewal under discussion. Through its Satelles acquisition it sells satellite-based positioning, navigation and timing as a GPS backup, targeting $100M of PNT revenue by 2030, and does engineering work for the Space Development Agency.'],
      marketCap: { usdM: 5037, asOf: '2026', undated: true, src: CSV },
      valuation: { evSales: 7.48, evEbitda: 15.62, pe: 53.91, peBasis: 'P / E on the sheet (undated)', basis: 'EV / Sales, current fiscal year (sheet)', note: 'From the public names sheet provided for this map (undated). EV / Sales on next fiscal year: 6.89×.', asOf: '2026', undated: true, ebitdaBasis: 'EV / EBITDA on the sheet (undated)', src: CSV },
      programs: [{ name: 'Enhanced Mobile Satellite Services (EMSS)', customer: 'US government (DoD)', role: 'Prime', value: '$110.5M a year', status: 'Renewal pending', note: 'Expires September 2026, with an optional six-month extension.', src: S('Iridium 10-K FY2025', 'https://www.sec.gov/Archives/edgar/data/1418819/000141881926000009/irdm-20251231.htm') }]
    });

    DTM.add({
      id: 'viasat', name: 'Viasat', domain: 'viasat.com', status: 'public', ticker: 'VSAT', exchange: 'NASDAQ',
      hq: 'Carlsbad, CA', country: 'US', founded: 1986,
      subsegments: ['sensors.comms', 'software.cyber'],
      oneLiner: 'Satellite broadband operator whose $1.3B defense segment sells encryption, tactical datalinks and space systems.',
      description: ['Viasat operates satellite broadband networks, including Inmarsat, and runs a Defense and Advanced Technologies segment that sells information security and cyber defense products, tactical networking and space and mission systems. In fiscal 2026 (ended March) total revenue reached a record $4.6B and the defense segment grew 10% to $1,340.6M, with record backlog.'],
      marketCap: { usdM: 9283, asOf: '2026', undated: true, src: CSV },
      financials: { cur: 'USD', fyEnd: 'Mar', periods: [{ label: 'FY2026', revenue: 4600 }], notes: 'Defense and Advanced Technologies segment revenue was $1,340.6M in FY2026, up from $1,221.1M.', asOf: '2026-05', src: S('Viasat 10-K FY2026', 'https://www.sec.gov/Archives/edgar/data/0000797721/000119312526248290/vsat-20260331.htm') },
      valuation: { evSales: 3.15, evEbitda: 10.13, basis: 'EV / Sales, current fiscal year (sheet)', note: 'From the public names sheet provided for this map (undated). EV / Sales on next fiscal year: 2.87×.', asOf: '2026', undated: true, ebitdaBasis: 'EV / EBITDA on the sheet (undated)', src: CSV }
    });
  }
})();
