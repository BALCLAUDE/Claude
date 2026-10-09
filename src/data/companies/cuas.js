/* Counter-UAS & Air Defense segment. Anduril, Neros, Ondas and AeroVironment also appear here. */
(function () {
  const S = (t, u) => (u ? { t, u } : { t });

  /* ---------------- Kinetic interceptors ---------------- */
  DTM.add({
    id: 'cambridge-aerospace', name: 'Cambridge Aerospace', status: 'private', stage: 'Series C',
    hq: 'Cambridge', country: 'UK', founded: 2024,
    subsegments: ['cuas.kinetic'],
    oneLiner: 'Skyhammer low-cost interceptors for drones and cruise missiles, scaling to thousands a month.',
    description: [
      'Cambridge Aerospace builds Skyhammer, a jet-powered interceptor designed to bring down attack drones and cruise missiles at a fraction of the cost of a traditional air defense missile. Skyhammer is in production, with a target of 2,500 a month by early 2027.',
      'Founded in September 2024, it has raised more than $630M. In August 2026 it closed a $300M Series C at $3.4B, after winning several UK Ministry of Defence contracts.'
    ],
    leadership: [['Steven Barrett', 'Co-founder & CEO']],
    products: ['Skyhammer'],
    funding: {
      totalUsdM: 636, asOf: '2026-08',
      rounds: [
        { date: '2026-04', type: 'Series B', amountUsdM: 200, postUsdM: 1300 },
        { date: '2026-08', type: 'Series C', amountUsdM: 300, postUsdM: 3400, leads: ['DFJ Growth'] }
      ],
      investors: ['DFJ Growth', 'Lux Capital', 'Accel', 'Lakestar', 'Elad Gil'],
      src: [S('Aerospace Testing International', 'https://www.aerospacetestinginternational.com/news/cambridge-aerospace-raises-300m-in-series-c-funding-round.html'), S('Grosswald', 'https://www.grosswald.org/cambridge-aerospace-300-million-series-c-3-4-billion-valuation-dfj-growth-skyhammer-nightstar-norfolk/')]
    },
    programs: [{ name: 'Skyhammer interceptors', customer: 'UK Ministry of Defence', role: 'Prime', year: 2026, status: 'Production' }]
  });

  DTM.add({
    id: 'allen-control', name: 'Allen Control Systems', short: 'Allen Control', domain: 'allencontrolsystems.com', status: 'private', stage: 'Series B',
    hq: 'Austin, TX', country: 'US', founded: 2022,
    subsegments: ['cuas.kinetic'],
    oneLiner: 'Bullfrog, an AI-enabled robotic gun turret that shoots down small drones.',
    description: [
      'Allen Control Systems builds Bullfrog, an autonomous weapon station that uses computer vision to aim a standard machine gun at small drones, offering a cheap shot compared with interceptor missiles.',
      'Bullfrog is deployed with the US Army and Navy and works with Joint Interagency Task Force 401. The company raised a $200M Series B at $2.2B in June 2026.'
    ],
    leadership: [['Steve Simoni', 'Co-founder & CEO']],
    products: ['Bullfrog'],
    funding: {
      totalUsdM: 200, asOf: '2026-06',
      rounds: [{ date: '2026-06', type: 'Series B', amountUsdM: 200, postUsdM: 2200, leads: ['Smash Capital'] }],
      investors: ['Smash Capital', 'Craft Ventures', 'Rally Ventures', 'Inspired Capital'],
      note: 'Total shows the Series B only; earlier rounds not included.',
      src: S('Business Wire, Jun 2026', 'https://www.businesswire.com/news/home/20260526638233/en/Allen-Control-Systems-Raises-%24200-Million-Series-B-at-%242.2-Billion-Post-Money-Valuation-to-Scale-Manufacturing-and-Accelerate-Deployment-of-Bullfrog')
    },
    programs: [{ name: 'Bullfrog counter-drone deployments', ref: 'cuas-army', customer: 'US Army / US Navy / JIATF-401', role: 'Prime', status: 'Deployed' }]
  });

  DTM.add({
    id: 'frankenburg', name: 'Frankenburg Technologies', short: 'Frankenburg', status: 'private', stage: 'Series A',
    hq: 'Tallinn', country: 'EE', founded: 2024,
    subsegments: ['cuas.kinetic'],
    oneLiner: 'Mass-producible mini-missiles to shoot down drones at drone-like prices.',
    description: [
      'Frankenburg, founded by former Estonian defense official Kusti Salm, is building small, low-cost guided missiles to counter drones, designed for production in the tens of thousands per year.'
    ],
    leadership: [['Kusti Salm', 'Co-founder & CEO']],
    products: ['Mark I'],
    funding: {
      totalUsdM: 46, asOf: '2026-02',
      rounds: [{ date: '2026-01', type: 'Series A', amountUsdM: 50, postUsdM: 400 }],
      note: 'A $50M round at $400M was reported in January 2026 by foreign media but not confirmed by the company. Trackers list $40M–$46M raised.',
      src: [S('Techleap', 'https://finder.techleap.nl/news/feed/frankenburg-raises-50m-at-400m-valuation-kusti-salm-yet-to-comment-1'), S('Tech.eu', 'https://funding.tech.eu/companies/27E46464-927B-4615-BF20-549E56AFD0A4')]
    },
    programs: []
  });

  DTM.add({
    id: 'tytan', name: 'Tytan Technologies', short: 'Tytan', status: 'private', stage: 'Series A',
    hq: 'Munich', country: 'DE', founded: 2023,
    subsegments: ['cuas.kinetic'],
    oneLiner: 'AI-guided interceptor drones for European air defense, backed by the NATO Innovation Fund.',
    description: [
      'Tytan builds autonomous interceptor drones that use onboard AI to find and ram hostile drones. It is scaling manufacturing in Germany and Ukraine, with a target of about 3,000 interceptors a month by the end of 2026.'
    ],
    products: ['Tytan interceptor'],
    funding: {
      totalUsdM: 53, asOf: '2026-02',
      rounds: [{ date: '2026-02', type: 'Series A', amountUsdM: 35, postUsdM: 175, leads: ['NATO Innovation Fund', 'Armira'] }],
      investors: ['NATO Innovation Fund', 'Armira'],
      note: '€30M Series A; about €46M raised in total. Valuation of just above €150M per Seedtable.',
      src: [S('NATO Innovation Fund', 'https://www.nif.fund/news/the-nato-innovation-fund-co-leads-e30m-series-a-for-tytan-to-build-europes-next-generation-air-defence/'), S('Munich Startup', 'https://www.munich-startup.de/en/news/30-million-euros-for-tytan')]
    },
    programs: [{ name: 'Interceptors for Ukraine', ref: 'ukraine', customer: 'Ukraine', role: 'Supplier', status: 'Fielded' }]
  });

  /* ---------------- Directed energy & HPM ---------------- */
  DTM.add({
    id: 'epirus', name: 'Epirus', domain: 'epirusinc.com', status: 'private', stage: 'Series D',
    hq: 'Torrance, CA', country: 'US', founded: 2018,
    subsegments: ['cuas.de'],
    oneLiner: 'Leonidas solid-state high-power microwave that disables drone swarms in one shot.',
    description: [
      'Epirus builds Leonidas, a software-defined high-power microwave system using gallium nitride amplifiers. It can disable many drones at once and costs very little per shot.',
      'The Army\'s IFPC-HPM program bought four prototypes, and a Generation II contract followed in 2025. Epirus raised a $250M Series D in March 2025 to scale production.'
    ],
    leadership: [['Andy Lowery', 'CEO']],
    products: ['Leonidas', 'Leonidas Expeditionary', 'Leonidas Pod'],
    funding: {
      totalUsdM: 550, asOf: '2025-03',
      rounds: [
        { date: '2022-02', type: 'Series C', amountUsdM: 200, postUsdM: 1350 },
        { date: '2025-03', type: 'Series D', amountUsdM: 250, leads: ['8VC', 'Washington Harbour Partners'] }
      ],
      investors: ['8VC', 'Washington Harbour Partners', 'General Dynamics Land Systems', 'Bedrock'],
      note: 'The Series D valuation was not disclosed.',
      src: S('Washington Technology, Mar 2025', 'https://washingtontechnology.com/companies/2025/03/epirus-collects-250m-series-d-capital-scale-production/403490/')
    },
    programs: [
      { name: 'IFPC-HPM prototypes', ref: 'cuas-army', customer: 'US Army RCCTO', role: 'Prime', value: '$66.1M', year: 2023, status: 'Delivered', note: 'Four Leonidas prototypes delivered by March 2024.' },
      { name: 'IFPC-HPM Generation II', ref: 'cuas-army', customer: 'US Army RCCTO', role: 'Prime', value: '$43.6M', year: 2025, status: 'Development', src: S('Epirus', 'https://www.epirusinc.com/press-releases/epirus-receives-43-million-contract-from-u-s-army-for-ifpc-hpm-generation-ii-systems') }
    ]
  });

  DTM.add({
    id: 'nlight', name: 'nLight', domain: 'nlight.net', status: 'public', ticker: 'LASR', exchange: 'NASDAQ',
    hq: 'Camas, WA', country: 'US', founded: 2000,
    subsegments: ['cuas.de'],
    oneLiner: 'Semiconductor and fiber lasers; now mostly a high-energy laser weapons supplier.',
    description: [
      'nLight makes semiconductor and fiber lasers and has become a key supplier of high-energy laser sources and beam control for US Army and Navy directed-energy weapons.',
      'Aerospace and defense was 67% of 2025 revenue. Defense product revenue nearly doubled year on year in Q1 2026, with a defense backlog near $110M.'
    ],
    leadership: [['Scott Keeney', 'Founder, Chairman & CEO']],
    products: ['High-energy laser sources', 'Beam directors', 'Fiber lasers'],
    marketCap: { usdM: 2720, asOf: '2026-08-20', src: S('Motley Fool', 'https://www.fool.com/quote/nasdaq/nlight-inc/lasr/') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [
        { label: 'FY2023', revenue: 209.9 },
        { label: 'FY2024', revenue: 198.5, netIncome: -74.2 },
        { label: 'FY2025', revenue: 261.3, netIncome: -23.5 }
      ],
      defenseMix: '67%',
      notes: 'Q1 2026 revenue was about $80M, up ~55%, with record aerospace and defense product revenue of about $33M.',
      asOf: '2026-05-07', src: [S('Simply Wall St', 'https://simplywall.st/stocks/us/tech/nasdaq-lasr/nlight/past'), S('Walnut Invest', 'https://walnutinvest.com/stocks/lasr/is-it-a-buy-or-sell')]
    },
    valuation: { evSales: 10.4, basis: 'Market cap ÷ FY2025 revenue', note: 'EV not compiled; ratio shown uses market cap.', asOf: '2026-08-20', src: S('Motley Fool', 'https://www.fool.com/quote/nasdaq/nlight-inc/lasr/') },
    programs: [{ name: 'Army and Navy high-energy laser programs', customer: 'US Army / US Navy', role: 'Laser supplier', status: 'Production' }]
  });

  DTM.add({
    id: 'eos', name: 'Electro Optic Systems', short: 'EOS', domain: 'eos-aus.com', status: 'public', ticker: 'EOS', exchange: 'ASX',
    hq: 'Canberra', country: 'AU', founded: 1983,
    subsegments: ['cuas.de', 'cuas.kinetic'],
    oneLiner: 'Remote weapon stations and the Apollo high-energy laser for counter-drone defense.',
    description: [
      'EOS builds remote weapon systems, including the R400 and Slinger counter-drone stations, and the Apollo high-energy laser weapon, alongside space tracking technology.',
      'Defense orders have surged: first-half 2026 revenue rose 283% to A$168.8M. It acquired UK counter-drone firm MARSS in May 2026 and guides to A$360M–$400M for the full year.'
    ],
    leadership: [['Andreas Schwer', 'CEO']],
    products: ['R400 RWS', 'Slinger', 'Apollo laser'],
    marketCap: { usdM: 1610, local: { cur: 'AUD', valueM: 2478 }, asOf: '2026-09-29', src: S('InvestSMART', 'https://www.investsmart.com.au/security/asx/eos/about:blank') },
    financials: {
      cur: 'AUD', fyEnd: 'Dec',
      periods: [{ label: 'H1 2026', revenue: 168.8 }],
      notes: 'Full-year 2026 revenue guidance is A$360M–$400M including MARSS. H1 2026 pre-tax loss of A$28.9M included a A$34M non-cash MARSS fair value loss.',
      asOf: '2026-08-25', src: S('EOS half-year report', 'https://stocklight.com/stocks/au/asx-eos/electro-optic-systems-holdings/announcements/2026-08-25-appendix-4d-half-year-financial-report-and-revenue-update')
    },
    valuation: { evSales: 6.5, basis: 'Market cap ÷ 2026 guidance midpoint', note: 'EV not compiled; ratio shown uses market cap. AUD converted at about 0.65.', asOf: '2026-09-29', src: S('InvestSMART', 'https://www.investsmart.com.au/security/asx/eos/about:blank') },
    programs: [
      { name: 'Remote weapon station order', customer: 'Undisclosed', role: 'Prime', value: 'US$124M', year: 2026, status: 'Production' },
      { name: 'Apollo high-energy laser', customer: 'European NATO member / UAE JV', role: 'Prime', status: 'Contracted' }
    ]
  });

  /* ---------------- Detection & sensing ---------------- */
  DTM.add({
    id: 'droneshield', name: 'DroneShield', domain: 'droneshield.com', status: 'public', ticker: 'DRO', exchange: 'ASX',
    hq: 'Sydney', country: 'AU', founded: 2014,
    subsegments: ['cuas.sensing', 'cuas.ew'],
    oneLiner: 'Counter-drone detection and RF defeat: handheld jammers, vehicle and fixed systems and C2 software.',
    description: [
      'DroneShield sells RF detection and electronic defeat systems, from handheld DroneGun jammers to vehicle-mounted and fixed-site systems, tied together by its DroneSentry-C2 software, which also integrates partner radars.',
      'Revenue nearly quadrupled in 2025 to about A$217M. Its pipeline was A$2.09B in January 2026, led by Europe.'
    ],
    leadership: [['Oleg Vornik', 'CEO']],
    products: ['DroneGun', 'RfPatrol', 'DroneSentry', 'DroneSentry-C2'],
    marketCap: { usdM: 2330, local: { cur: 'AUD', valueM: 3580 }, asOf: '2026-03-30', src: S('Simply Wall St', 'https://www.simplywall.st/stocks/au/capital-goods/asx-dro/droneshield-shares') },
    financials: {
      cur: 'AUD', fyEnd: 'Dec',
      periods: [{ label: 'FY2023', revenue: 55.1 }, { label: 'FY2024', revenue: 57.5 }, { label: 'FY2025', revenue: 216.8 }],
      notes: 'SaaS revenue was A$11.6M in 2025, up from A$2.8M. Unweighted sales pipeline A$2.09B (Jan 2026).',
      asOf: '2026-03-30', src: [S('Simply Wall St', 'https://www.simplywall.st/stocks/au/capital-goods/asx-dro/droneshield-shares'), S('Kalkine', 'https://kalkine.com.au/news/technology/is-droneshield-asxdro-entering-a-new-growth-phase-after-its-fy2025-revenue-surge')]
    },
    valuation: { evSales: 16.5, basis: 'Market cap ÷ FY2025 revenue', note: 'EV not compiled; ratio shown uses market cap.', asOf: '2026-03-30', src: S('Simply Wall St', 'https://www.simplywall.st/stocks/au/capital-goods/asx-dro/droneshield-shares') },
    programs: [{ name: 'US and European counter-drone orders', ref: 'cuas-army', customer: 'US DoD / European MoDs', role: 'Prime', status: 'Delivering' }]
  });

  DTM.add({
    id: 'hidden-level', name: 'Hidden Level', domain: 'hiddenlevel.com', status: 'private', stage: 'Series C',
    hq: 'Syracuse, NY', country: 'US', founded: 2016,
    subsegments: ['cuas.sensing'],
    oneLiner: 'Passive radar network that detects drones, including "dark" drones that emit no signal.',
    description: [
      'Hidden Level uses passive radar, listening to existing radio signals in the environment, to detect and track drones and other low-altitude aircraft without transmitting, including drones that emit no RF signal.'
    ],
    products: ['Passive RF sensing network'],
    funding: {
      totalUsdM: 120, asOf: '2025-02',
      rounds: [{ date: '2025-02', type: 'Series C', amountUsdM: 65, leads: ['DFJ Growth'] }],
      investors: ['DFJ Growth', 'Booz Allen Ventures', 'Revolution Growth', 'Costanoa Ventures', 'Founders Circle'],
      note: 'Totals vary ($93M–$120M) by tracker.',
      src: S('The Robot Report', 'https://www.therobotreport.com/hidden-level-raises-65m-for-drone-detection-system/')
    },
    programs: [{ name: 'APFIT tactical passive C-UAS radar', ref: 'cuas-army', customer: 'DoD', role: 'Prime', value: '$10M', year: 2023, status: 'Fielding' }]
  });

  DTM.add({
    id: 'robin-radar', name: 'Robin Radar Systems', short: 'Robin Radar', domain: 'robinradar.com', status: 'private', stage: 'PE-backed',
    hq: 'Delft', country: 'NL', founded: 2010,
    subsegments: ['cuas.sensing', 'sensors.radar'],
    oneLiner: '3D radars purpose-built to tell drones from birds; reportedly up for sale at about €2B.',
    description: [
      'Robin Radar builds radars specialized for drones and birds, including the IRIS counter-drone radar and ELVIRA, used by militaries, airports and critical infrastructure.',
      'Reuters reported in 2026 that owner Parcom is preparing a sale that could value the company at about €2B, with BAE Systems, CVC, Blackstone, Advent and EQT named as possible bidders.'
    ],
    products: ['IRIS', 'ELVIRA', 'MAX'],
    funding: { totalUsdM: null, label: 'PE-backed', asOf: '2026-08', note: 'Backed by Dutch investor Parcom; about $26M of venture funding raised earlier.', src: S('Realtid (Reuters)', 'https://www.realtid.se/bors-finans/eqt-kan-slass-om-dronarradarn-som-skyddade-os-vard-22-miljarder/') },
    valuation: { postUsdM: 2300, date: '2026-08', type: 'Reported sale target', note: 'Possible sale at about €2B, per Reuters. Not a priced round.', src: S('Realtid (Reuters)', 'https://www.realtid.se/bors-finans/eqt-kan-slass-om-dronarradarn-som-skyddade-os-vard-22-miljarder/') },
    programs: []
  });

  /* ---------------- EW & cyber takeover ---------------- */
  DTM.add({
    id: 'd-fend', name: 'D-Fend Solutions', short: 'D-Fend', domain: 'd-fendsolutions.com', status: 'private', stage: 'Growth',
    hq: 'Ra\'anana', country: 'IL', founded: 2017,
    subsegments: ['cuas.ew'],
    oneLiner: 'EnforceAir cyber takeover that seizes control of rogue drones and lands them safely.',
    description: [
      'D-Fend takes over hostile drones by exploiting their communication protocols, then lands them in a safe zone. This avoids jamming and kinetic fire, which matters in cities and near airports.'
    ],
    leadership: [['Zohar Halachmi', 'CEO']],
    products: ['EnforceAir2'],
    funding: {
      totalUsdM: 67, asOf: '2024-12',
      rounds: [{ date: '2024-12', type: 'Growth', amountUsdM: 31, leads: ['Israel Growth Partners'] }],
      investors: ['Israel Growth Partners', 'Vertex Ventures', 'Vertex Growth'],
      src: S('Security Systems News', 'https://securitysystemsnews.com/article/d-fend-solutions-raises-31m')
    },
    programs: []
  });
  /* ---- Batch b1: missile defense, directed energy and kinetic counter-drone additions ---- */
  {
    const TBL = S('Space funding table provided for this map (Oct 2026)');
    const DRN = S('Drone funding table provided for this map (data through Jun 2025)');

    DTM.add({
      id: 'long-wall', name: 'Long Wall', formerly: 'ABL Space Systems', domain: 'lwall.com', status: 'private', stage: 'Late stage',
      hq: 'Long Beach, CA', country: 'US', founded: 2017,
      subsegments: ['cuas.missiledefense', 'missiles.hypertest'],
      oneLiner: 'Former ABL Space Systems, now building the Cyclops midcourse interceptor and RSX threat-replication boosters.',
      description: [
        'Long Wall, formerly ABL Space Systems, left commercial launch in November 2024 after RS1 setbacks in 2023 and 2024, and rebranded in February 2025. It is developing Cyclops, a surface-launched exoatmospheric kill vehicle for midcourse defense against threats from MRBMs to ICBMs and hypersonic glide vehicles, which it says can be mass-produced for far less than the Navy\'s SM-3. RS1 became RSX, a booster for flight testing and threat replication, and GS0 became the Ironwood ground system.',
        'Long Wall unveiled Cyclops in December 2025 with a launcher that fits in a standard shipping container; no flight test had been reported. As ABL it won a $60M SpaceWERX STRATFI award in March 2023 for responsive launch. The funding table shows $519.7M raised over six rounds, the last in December 2023.'
      ],
      leadership: [['Dan Piemont', 'Co-founder & CEO']],
      products: ['Cyclops', 'RSX', 'Ironwood'],
      employees: '~50',
      funding: {
        totalUsdM: 519.7, roundCount: 6, lastDate: '2023-12', asOf: '2023-12',
        note: 'Raised as ABL Space Systems; no round found since the February 2025 rebrand.',
        src: [TBL, S('Wikipedia: Long Wall', 'https://en.wikipedia.org/wiki/Long_Wall_(aerospace_company)')]
      },
      programs: [
        { name: 'Cyclops midcourse interceptor', customer: 'US and allied missile defense', role: 'Prime', year: 2025, status: 'Development', note: 'Unveiled December 2025; launcher test unit built, no flight test reported.', src: S('The Defense Post, Dec 2025', 'https://thedefensepost.com/2025/12/17/cyclops-missile-hunter/') },
        { name: 'SpaceWERX STRATFI (responsive launch)', customer: 'US Space Force / Air Force', role: 'Prime', value: '$60M', year: 2023, status: 'Awarded', src: S('Wikipedia: Long Wall', 'https://en.wikipedia.org/wiki/Long_Wall_(aerospace_company)') }
      ]
    });

    DTM.add({
      id: 'aurelius-systems', name: 'Aurelius Systems', short: 'Aurelius', status: 'private', stage: 'Series A',
      hq: 'San Francisco, CA', country: 'US', founded: 2024,
      subsegments: ['cuas.de'],
      oneLiner: 'Archimedes, an autonomous laser turret for vehicles or fixed sites that destroys small drones beyond one kilometer.',
      description: [
        'Aurelius Systems builds Archimedes, an autonomous high-energy laser turret that detects, tracks and destroys drones at more than a kilometer. It is built from commercially available components so it can be mass-produced and repaired in the field, and mounts on vehicles or fixed sites. In April 2026 the company opened a US manufacturing line for high-power fiber lasers.',
        'It raised a $10M seed round in September 2025 and a $40M Series A in August 2026 led by Draper Associates and KAS Venture Partners. Archimedes downed more than 20 quadcopters at the DoD\'s T-REX 26-2 event and is being integrated on American Rheinmetall\'s Ox robotic vehicle for the Army\'s GOAT program. It had 19 employees in August 2026.'
      ],
      leadership: [['Michael LaFramboise', 'Co-founder & CEO'], ['John Marmaduke', 'Co-founder & CTO']],
      products: ['Archimedes'],
      employees: '~19',
      funding: {
        totalUsdM: 50, roundCount: 3, lastDate: '2026-08', asOf: '2026-08',
        rounds: [
          { date: '2025-09', type: 'Seed', amountUsdM: 10 },
          { date: '2026-08', type: 'Series A', amountUsdM: 40, leads: ['Draper Associates', 'KAS Venture Partners'] }
        ],
        investors: ['Draper Associates', 'KAS Venture Partners', 'General Catalyst', 'Hanwha Asset Management', 'Outlander', 'Alumni Ventures', 'Bravo Victor', 'Detroit Venture Partners'],
        src: [TBL, S('Business Wire, Aug 2026', 'https://www.businesswire.com/news/home/20260805445217/en/CORRECTING-and-REPLACING-Aurelius-Systems-Secures-%2440M-Series-A-to-Meet-Growing-Demand-for-Counter-Drone-Systems'), S('Axios, Sep 2025', 'https://www.axios.com/2025/09/03/aurelius-lasers-cuas-seed-money')]
      },
      programs: [
        { name: 'Archimedes on Ox UGV (Army GOAT bid)', customer: 'American Rheinmetall / US Army', role: 'Partner', status: 'Development', src: S('Tectonic Defense', 'https://www.tectonicdefense.com/exclusive-aurelius-takes-its-drone-downing-lasers-mobile-with-rheinmetall/') },
        { name: 'T-REX 26-2 experimentation', customer: 'DoD', role: 'Prime', year: 2026, status: 'Demonstrated', note: 'Downed more than 20 quadcopters and more than five Army-supplied drones at Camp Atterbury.', src: S('Business Wire, Aug 2026', 'https://www.businesswire.com/news/home/20260805445217/en/CORRECTING-and-REPLACING-Aurelius-Systems-Secures-%2440M-Series-A-to-Meet-Growing-Demand-for-Counter-Drone-Systems') },
        { name: 'Army xTechDisrupt FUZE competition', customer: 'US Army', role: 'Prime', status: 'Winner', note: 'Won the Army\'s first FUZE competition, held at AUSA.' }
      ]
    });

    DTM.add({
      id: 'attalon', name: 'Attalon', status: 'private', stage: 'PE-owned (Advent)',
      hq: 'Philadelphia, PA', country: 'US', founded: 2026,
      subsegments: ['cuas.de'],
      oneLiner: 'Valaris beam-combined high-energy lasers, precision optics and coatings, carved out of Coherent by Advent in 2026.',
      description: [
        'Attalon is Coherent\'s former aerospace and defense business, which launched as a standalone company in January 2026 after Advent International bought it. It makes directed energy lasers, precision optics and coatings for guided munitions and satellites. Its Valaris platform, launched in August 2026, spans about 10 kW to 50 kW, with the coherently combined Valaris X designed to scale beyond 300 kW.',
        'A $17.1M Office of Naval Research modification in 2026 funds a 400 kW-class laser subsystem under the SONGBOW program. In September 2026 AeroVironment signed a long-term agreement to use Valaris lasers in its LOCUST system, Attalon committed $15M to expand laser production, and it shipped its first Valaris subsystem for an international defense program.'
      ],
      leadership: [['John Bergeron', 'President & CEO']],
      products: ['Valaris X', 'Valaris S', 'Valaris D', 'kWIC Disconnect', 'Precision optics', 'Precision coatings'],
      employees: '~550',
      funding: {
        totalUsdM: null, label: 'Undisclosed', asOf: '2026-01',
        note: 'Coherent agreed in August 2025 to sell the business to Advent International for $400M; Attalon launched as a standalone company on 13 January 2026. No venture rounds disclosed.',
        src: [TBL, S('Pulse 2.0, Aug 2025', 'https://pulse2.com/advent-400-million-deal-for-coherents-aerospace-and-defense-business'), S('Barchart (Business Wire), Jan 2026', 'https://www.barchart.com/story/news/37023005/attalon-launches-as-independent-defense-technology-leader-appoints-john-bergeron-as-ceo-to-strengthen-leadership-in-precision-optics-and-directed-energy')]
      },
      programs: [
        { name: 'ONR SONGBOW high-energy laser', customer: 'Office of Naval Research', role: 'Prime', value: '$17.1M', year: 2026, status: 'Development', note: 'Contract modification to integrate a 50 kW laser with a beam control assembly into a 400 kW-class subsystem; the original award went to Coherent in June 2025.', src: S('Naval Technology', 'https://www.naval-technology.com/news/attalon-us-navy-songbow/') },
        { name: 'AeroVironment LOCUST laser supply', ref: 'cuas-army', customer: 'AeroVironment', role: 'Supplier', year: 2026, status: 'Production', note: 'Long-term agreement to supply Valaris lasers for LOCUST and AV\'s wider laser line.', src: S('The Defense Post, Sep 2026', 'https://thedefensepost.com/2026/09/16/av-attalon-laser-subsystems/') },
        { name: 'First Valaris subsystem, international program', customer: 'US customer for an international defense program', role: 'Supplier', year: 2026, status: 'Delivering', src: S('MyChesCo', 'https://www.mychesco.com/a/news/regional/attalon-ships-first-valaris-laser-for-international-program/') }
      ]
    });

    DTM.add({
      id: 'fibertek', name: 'Fibertek', domain: 'fibertek.com', status: 'private', stage: 'Privately held',
      hq: 'Herndon, VA', country: 'US', founded: 1985,
      subsegments: ['sensors.comms', 'cuas.de'],
      oneLiner: 'Solid-state and fiber lasers, space lidar and laser communications for the Defense Department and NASA.',
      description: [
        'Fibertek, a privately held laser maker in Herndon, Virginia, builds diode-pumped solid-state and fiber lasers, lidar, laser communication and electro-optical sensor systems for the Defense Department and NASA. It built the lasers for NASA\'s CALIPSO and ICESat-2 missions, and its engineering services arm has supported the Army\'s Night Vision and Electronic Sensors Directorate at Fort Belvoir since 1996.',
        'The ATLAS laser Fibertek built for ICESat-2 fired its two trillionth shot in March 2025. NASA awarded Fibertek an SBIR Phase III contract worth up to $3.2M in April 2025 for an Er:YAG laser transmitter. Contract databases list more than 580 federal awards worth about $251M in total.'
      ],
      products: ['Space lidar lasers', 'Fiber lasers', 'Laser communication systems', 'Electro-optical sensors'],
      funding: {
        totalUsdM: null, label: 'Undisclosed', asOf: '2026-10',
        note: 'Privately held; no disclosed outside funding. The company gives 1985 as its founding year; some databases list 1983.',
        src: [TBL, S('Craft.co', 'https://craft.co/fibertek')]
      },
      programs: [
        { name: 'ICESat-2 ATLAS laser', customer: 'NASA', role: 'Supplier', status: 'Operating', note: 'Two trillionth laser shot in March 2025.', src: S('NASA ICESat-2 blog, Mar 2025', 'https://science.nasa.gov/blogs/icesat-2/2025/03/14/icesat-2s-laser-fires-2-trillionth-shot-spots-clouds/') },
        { name: 'SBIR Phase III Er:YAG laser transmitter', customer: 'NASA', role: 'Prime', value: 'Up to $3.2M', year: 2025, status: 'Awarded', src: S('HigherGov', 'https://www.highergov.com/contract/80NSSC25CA055') },
        { name: 'Night Vision and Electronic Sensors Directorate support', customer: 'US Army', role: 'Prime', status: 'Ongoing', note: 'Engineering support at Fort Belvoir since 1996.' }
      ]
    });

    DTM.add({
      id: 'fortem', name: 'Fortem Technologies', short: 'Fortem', domain: 'fortemtech.com', status: 'private', stage: 'Series B',
      hq: 'Lindon, UT', country: 'US', founded: 2016,
      subsegments: ['cuas.kinetic', 'cuas.sensing'],
      oneLiner: 'DroneHunter net-firing interceptor drones and TrueView radar, bought by JIATF-401, the Army and DHS.',
      description: [
        'Fortem Technologies builds DroneHunter, an autonomous interceptor drone that captures hostile drones with nets, and TrueView radar, which it combines with command-and-control software in its SkyDome system. DroneHunter has been used operationally in Ukraine, the Middle East and East Asia, and Fortem says it is the only company authorized to fly a drone-on-drone kinetic interceptor in US airspace.',
        'In January 2026 JIATF-401 made DroneHunter F700 the first Replicator 2 purchase, and deliveries of DroneHunter 5.0 began. In February the Army awarded a three-year, $18M contract and DHS ordered systems to protect 2026 FIFA World Cup venues. Lockheed Martin led a $50M Series B, investing $25M in April and closing the round in September 2026.'
      ],
      leadership: [['Jon Gruen', 'CEO']],
      products: ['DroneHunter F700', 'DroneHunter 5.0', 'TrueView radar', 'SkyDome'],
      funding: {
        totalUsdM: 113.3, roundCount: 8, lastDate: '2026-09', asOf: '2026-09',
        rounds: [{ date: '2026-09', type: 'Series B', amountUsdM: 50, leads: ['Lockheed Martin'] }],
        investors: ['Lockheed Martin', 'Unusual Machines', 'Hanwha Aerospace', 'DCVC', 'AIM13 | Crumpton'],
        note: 'Drone table total of $63.3M through Nov 2024, plus a $50M Series B led by Lockheed Martin ($25M first tranche in April 2026, closed September 2026). Fortem said the round valued it at under $1B.',
        src: [DRN, S('DroneLife, Sep 2026', 'https://dronelife.com/2026/09/30/fortem-technologies-funding-50m-series-b/'), S('Washington Technology, Apr 2026', 'https://washingtontechnology.com/companies/2026/04/fortem-receives-new-lockheed-backing-reliable-robotics-completes-series-b-raise/413037/'), S('Tectonic Defense', 'https://tectonicdefense.com/exclusive-counter-drone-startup-fortem-raises-50m-series-b')]
      },
      programs: [
        { name: 'JIATF-401 Replicator 2 first purchase', ref: 'replicator', customer: 'JIATF-401', role: 'Prime', year: 2026, status: 'Delivering', note: 'Two sets of DroneHunter F700 interceptors, delivery by April 2026.', src: S('Business Wire, Jan 2026', 'https://www.businesswire.com/news/home/20260114545608/en/Fortem-Technologies-Welcomes-JIATF-401s-Selection-of-DroneHunter-as-First-Replicator-2-Purchase') },
        { name: 'Army counter-drone equipment and support', ref: 'cuas-army', customer: 'US Army', role: 'Prime', value: '$18M', year: 2026, status: 'Awarded', note: 'Three-year contract; first order nearly $4M.', src: S('DroneXL, Feb 2026', 'https://dronexl.co/2026/02/27/fortem-18m-army-counter-drone') },
        { name: '2026 FIFA World Cup venue protection', customer: 'DHS', role: 'Prime', year: 2026, status: 'Complete', src: S('Business Wire, Feb 2026', 'https://secure.businesswire.com/news/home/20260212003799/en/Fortem-Receives-Multimillion-dollar-Order-to-Defend-2026-FIFA-World-Cup-Venues-From-Drone-Threats') },
        { name: 'DroneHunter in Ukraine', ref: 'ukraine', customer: 'Ukraine', role: 'Vendor', status: 'Fielded', src: S('DCVC', 'https://www.dcvc.com/news-insights/neutralizing-the-swarm-fortem-cements-its-position-as-the-go-to-for-drone-defense') },
        { name: 'Lockheed Martin critical infrastructure C-UAS', customer: 'Lockheed Martin', role: 'Partner', year: 2026, status: 'Selected', src: S('Business Wire, Mar 2026', 'https://www.businesswire.com/news/home/20260319309623/en/Lockheed-Martin-Selects-Fortem-Technologies-to-Protect-Critical-Infrastructure-from-Drones') }
      ]
    });
  }
})();
