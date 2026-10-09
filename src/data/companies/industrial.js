/* Manufacturing & Energy segment. Relativity (space.js) and Firestorm (uas.js) also appear here. */
(function () {
  const S = (t, u) => (u ? { t, u } : { t });

  /* ---------------- Advanced manufacturing ---------------- */
  DTM.add({
    id: 'hadrian', name: 'Hadrian', domain: 'hadrian.co', status: 'private', stage: 'Series D',
    hq: 'Torrance, CA', country: 'US', founded: 2020,
    subsegments: ['industrial.manufacturing'],
    oneLiner: 'Highly automated precision-parts factories for defense and space, now expanding into munitions and ships.',
    description: [
      'Hadrian builds automated factories that machine precision components for defense and aerospace primes, using software and robotics to make up for the shortage of skilled machinists. It offers "Factories-as-a-Service" for munitions, shipbuilding and other priority programs.',
      'It raised a $1.37B Series D at $7.87B in August 2026, anchored by JPMorganChase\'s Strategic Investment Group. Its sites in California, Arizona and Alabama total nearly 3 million square feet, including a 2.2 million sq ft factory opened with the US Navy in March 2026.'
    ],
    leadership: [['Chris Power', 'Founder & CEO']],
    products: ['Automated precision machining', 'Factories-as-a-Service'],
    funding: {
      totalUsdM: 1900, asOf: '2026-08',
      rounds: [
        { date: '2024-01', type: 'Series B', amountUsdM: 117 },
        { date: '2025-07', type: 'Series C', amountUsdM: 260, postUsdM: 1600, leads: ['Founders Fund', 'Lux Capital'] },
        { date: '2026-08', type: 'Series D', amountUsdM: 1370, postUsdM: 7870, leads: ['JPMorganChase', 'WCM', 'Washington Harbour', 'Valor', '137 Ventures', 'Baillie Gifford'] }
      ],
      investors: ['Founders Fund', 'Lux Capital', 'Andreessen Horowitz', 'Valor Equity Partners', 'Baillie Gifford', 'T. Rowe Price', 'CapitalG'],
      note: 'Total is an approximate sum of disclosed rounds.',
      src: [S('Manufacturing Today, Aug 2026', 'https://manufacturing-today.com/news/hadrian-raises-1-37b-to-scale-us-defense-manufacturing/'), S('Bloomberg Law', 'https://news.bloomberglaw.com/private-equity/defense-startup-hadrian-valued-at-7-87-billion-in-new-round')]
    },
    programs: [{ name: 'Factory 4 with the US Navy (Alabama)', customer: 'US Navy', role: 'Partner', year: 2026, status: 'Operational', note: '2.2 million sq ft site for naval industrial base work.' }]
  });

  DTM.add({
    id: 'divergent', name: 'Divergent Technologies', short: 'Divergent', domain: 'divergent3d.com', status: 'private', stage: 'Series E',
    hq: 'Torrance, CA', country: 'US', founded: 2014,
    subsegments: ['industrial.manufacturing'],
    oneLiner: 'AI-designed, 3D-printed structures made on a flexible digital factory for missiles, drones and vehicles.',
    description: [
      'Divergent\'s Adaptive Production System combines generative design, metal additive manufacturing and robotic assembly to build complex structures, from car chassis to airframes for missiles and uncrewed aircraft, without dedicated tooling.',
      'It has become a manufacturing partner to defense primes and new entrants. Its September 2025 Series E raised $290M at $2.3B.'
    ],
    leadership: [['Kevin Czinger', 'Founder & CEO']],
    products: ['Divergent Adaptive Production System (DAPS)'],
    funding: {
      totalUsdM: 1000, asOf: '2025-09',
      rounds: [{ date: '2025-09', type: 'Series E', amountUsdM: 290, postUsdM: 2300, leads: ['Rochefort Asset Management'] }],
      note: 'Total is reported as "more than $1B". Trackers have listed higher 2026 valuations that are unverified.',
      src: [S('Komo', 'https://komo.ai/directory/divergent-technologies-funding'), S('Caplight', 'https://www.caplight.com/company/divergent')]
    },
    programs: [{ name: 'Airframe structures for defense primes', customer: 'Defense primes and new entrants', role: 'Manufacturing partner', status: 'Production' }]
  });

  DTM.add({
    id: 'machina-labs', name: 'Machina Labs', short: 'Machina', domain: 'machinalabs.ai', status: 'private', stage: 'Series C',
    hq: 'Chatsworth, CA', country: 'US', founded: 2019,
    subsegments: ['industrial.manufacturing'],
    oneLiner: 'Robotic sheet-metal forming that replaces hard tooling for aircraft and missile parts.',
    description: [
      'Machina Labs uses pairs of industrial robots guided by AI to form sheet metal into large, complex parts without dies, cutting lead times for aircraft, missile and spacecraft structures. It works with the US Air Force and defense primes.',
      'It raised a $124M Series C in February 2026.'
    ],
    leadership: [['Edward Mehr', 'Co-founder & CEO']],
    products: ['RoboForming', 'RoboCraftsman'],
    funding: {
      totalUsdM: 174, asOf: '2026-02',
      rounds: [{ date: '2026-02', type: 'Series C', amountUsdM: 124 }],
      investors: ['Woven Capital', 'Lockheed Martin Ventures', 'Balerion Space Ventures', 'Strategic Development Fund'],
      note: 'Trackers report $174M–$217M raised in total.',
      src: [S('Latham & Watkins', 'https://www.lw.com/en/news/2026/02/latham-advises-balerion-space-ventures-on-its-investment-in-machina-labs-series-c'), S('CB Insights', 'https://www.cbinsights.com/company/machina-labs/financials')]
    },
    programs: [{ name: 'Air Force rapid tooling-free manufacturing', customer: 'US Air Force', role: 'Prime', status: 'Development' }]
  });

  /* ---------------- Materials & critical minerals ---------------- */
  DTM.add({
    id: 'mp-materials', name: 'MP Materials', domain: 'mpmaterials.com', status: 'public', ticker: 'MP', exchange: 'NYSE',
    hq: 'Las Vegas, NV', country: 'US', founded: 2017,
    subsegments: ['industrial.materials'],
    oneLiner: 'The only scaled US rare-earth mine and refinery, now making magnets, with the Pentagon as top shareholder.',
    description: [
      'MP Materials owns the Mountain Pass rare-earth mine and processing facility in California and is building out magnet manufacturing in Fort Worth, Texas, to rebuild a domestic rare-earth magnet supply chain.',
      'In July 2025 the DoD invested $400M in convertible preferred stock, becoming the largest shareholder at about 15%, and set a $110/kg price floor for NdPr. A separate 10X magnet plant is backed by DoD offtake.'
    ],
    leadership: [['James Litinsky', 'Founder, Chairman & CEO']],
    products: ['NdPr oxide', 'NdFeB magnets'],
    marketCap: { usdM: 8400, asOf: '2026-09-18', src: S('TS2 (close of $47.26) and Google Finance share count', 'https://ts2.tech/en/mp-materials-stock-falls-4-3-china-report-reopens-the-shenghe-stake-question/') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [{ label: 'FY2023', revenue: 253.4 }, { label: 'FY2024', revenue: 203.9, netIncome: -65.4 }],
      notes: 'Q1 2026 revenue was $90.6M, up 49%. Operating losses for 11 consecutive quarters as the business shifts to separated products and magnets.',
      asOf: '2026-05-07', src: S('MP Materials FY2025 10-K', 'https://www.sec.gov/Archives/edgar/data/1801368/000180136826000008/mp-20251231.htm')
    },
    valuation: { note: 'Market cap is our estimate: $47.26 close on Sep 18, 2026 × ~177.7M shares (before DoD conversion shares).', asOf: '2026-09-18', src: S('TS2', 'https://ts2.tech/en/mp-materials-stock-falls-4-3-china-report-reopens-the-shenghe-stake-question/') },
    programs: [{ name: 'DoD rare-earth magnet partnership', customer: 'Department of Defense', role: 'Partner', value: '$400M equity + price floor', year: 2025, status: 'Active' }]
  });

  DTM.add({
    id: 'usa-rare-earth', name: 'USA Rare Earth', domain: 'usare.com', status: 'public', ticker: 'USAR', exchange: 'NASDAQ',
    hq: 'Stillwater, OK', country: 'US', founded: 2019,
    subsegments: ['industrial.materials'],
    oneLiner: 'Sintered neodymium magnet plant in Oklahoma plus the Round Top rare-earth deposit in Texas.',
    description: [
      'USA Rare Earth is commissioning a sintered NdFeB magnet manufacturing plant in Stillwater, Oklahoma, and owns the Round Top heavy rare-earth deposit in West Texas. It listed in 2025 through a SPAC merger and has little revenue so far.'
    ],
    leadership: [['Barbara Humpton', 'CEO']],
    products: ['NdFeB magnets'],
    marketCap: { usdM: 4190, asOf: '2026-08-20', src: S('Equibles', 'https://equibles.com/stocks/USAR') },
    valuation: { note: 'Pre-revenue; valuation reflects expected magnet production.', asOf: '2026-08-20', src: S('Equibles', 'https://equibles.com/stocks/USAR') },
    programs: []
  });

  DTM.add({
    id: 'vulcan-elements', name: 'Vulcan Elements', short: 'Vulcan', domain: 'vulcanelements.com', status: 'private', stage: 'Series A',
    hq: 'Durham, NC', country: 'US', founded: 2023,
    subsegments: ['industrial.materials'],
    oneLiner: 'US rare-earth magnet maker scaling to 10,000 tonnes a year with Pentagon and Commerce backing.',
    description: [
      'Vulcan Elements produces rare-earth permanent magnets in the US for defense and commercial uses, aiming to remove reliance on Chinese magnets.',
      'Its expansion to 10,000 tonnes of capacity is financed by a $620M Office of Strategic Capital loan, $50M of CHIPS incentives (with Commerce taking $50M of equity) and $550M of private capital.'
    ],
    leadership: [['John Maslin', 'Co-founder & CEO']],
    funding: {
      totalUsdM: 65, asOf: '2025-11',
      rounds: [{ date: '2025', type: 'Series A', amountUsdM: 65 }],
      note: 'Excludes the $620M OSC loan and $50M Commerce equity. A $550M round at about $2B was reported in talks in March 2026.',
      src: [S('Axios Pro, Mar 2026', 'https://www.axios.com/pro/climate-deals/2026/03/17/vulcan-elements-washington-harbour-rare-earth-magnet'), S('Bloomberg Government', 'https://news.bgov.com/bloomberg-government-news/rare-earth-magnet-maker-key-for-pentagon-policy-wins-new-funding')]
    },
    programs: [{ name: 'Office of Strategic Capital loan', customer: 'Department of War OSC', role: 'Borrower', value: '$620M', status: 'Awarded' }]
  });

  /* ---------------- Nuclear & microreactors ---------------- */
  DTM.add({
    id: 'bwxt', name: 'BWX Technologies', short: 'BWXT', domain: 'bwxt.com', status: 'public', ticker: 'BWXT', exchange: 'NYSE',
    hq: 'Lynchburg, VA', country: 'US', founded: 1867,
    subsegments: ['industrial.nuclear'],
    oneLiner: 'Sole supplier of US Navy nuclear reactors and builder of the Project Pele mobile microreactor.',
    description: [
      'BWXT manufactures the nuclear reactors and fuel for every US Navy submarine and aircraft carrier, and supplies special nuclear materials and commercial nuclear components. It built Project Pele, the DoD\'s prototype transportable microreactor.',
      'Backlog rose 50% to $7.3B in 2025 on naval propulsion, special materials and commercial nuclear awards.'
    ],
    leadership: [['Rex Geveden', 'President & CEO']],
    products: ['Naval nuclear reactors', 'Pele microreactor', 'TRISO fuel', 'Medical isotopes'],
    marketCap: { usdM: 15120, asOf: '2026-08-19', src: S('Equibles', 'https://equibles.com/stocks/BWXT') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [
        { label: 'FY2023', revenue: 2496 },
        { label: 'FY2024', revenue: 2704 },
        { label: 'FY2025', revenue: 3200, ebitda: 574.3, netIncome: 329.9 }
      ],
      backlog: { valueM: 7300, asOf: '2025-12-31', note: 'Up 50%' },
      notes: '2026 guidance: adjusted EBITDA $645M–$660M, free cash flow $305M–$320M.',
      asOf: '2026-02-24', src: S('BWXT FY2025 results', 'https://investors.bwxt.com/news-releases/news-release-details/bwx-technologies-reports-fourth-quarter-and-full-year-2025')
    },
    valuation: { evSales: 4.7, pe: 45.8, peBasis: 'FY2025 GAAP net income', basis: 'Market cap ÷ FY2025 revenue', note: 'EV not compiled; ratio shown uses market cap.', asOf: '2026-08-19', src: S('Equibles', 'https://equibles.com/stocks/BWXT') },
    programs: [
      { name: 'Naval nuclear propulsion', ref: 'aukus', customer: 'US Navy / Naval Reactors', role: 'Sole supplier', status: 'Production' },
      { name: 'Project Pele mobile microreactor', ref: 'microreactors', customer: 'DoD Strategic Capabilities Office', role: 'Prime', status: 'Prototype' }
    ]
  });

  DTM.add({
    id: 'oklo', name: 'Oklo', domain: 'oklo.com', status: 'public', ticker: 'OKLO', exchange: 'NYSE',
    hq: 'Santa Clara, CA', country: 'US', founded: 2013,
    subsegments: ['industrial.nuclear'],
    oneLiner: 'Aurora fast-reactor powerhouses for data centers and military bases, starting with Eielson AFB.',
    description: [
      'Oklo is developing the Aurora, a compact sodium-cooled fast reactor, and plans to sell power rather than reactors. It was selected to supply power to Eielson Air Force Base in Alaska.',
      'It is pre-revenue, holding about $3B of cash and securities in September 2026, with shares about 62% below their peak.'
    ],
    leadership: [['Jacob DeWitte', 'Co-founder & CEO']],
    products: ['Aurora powerhouse'],
    marketCap: { usdM: 6430, asOf: '2026-09-07', src: S('Capital.com', 'https://capital.com/en-ke/markets/shares/oklo-inc-share-price/market-cap') },
    valuation: { note: 'Pre-revenue. Roughly $3.0B of cash and marketable securities (TIKR, Sep 2026), so EV is about $3.4B–$4.4B.', asOf: '2026-09-03', src: S('TIKR', 'https://www.tikr.com/blog/oklo-is-down-62-from-its-peak-heres-what-the-bull-case-requires-you-to-believe') },
    programs: [{ name: 'Eielson AFB microreactor', ref: 'microreactors', customer: 'US Air Force / DLA', role: 'Selected provider', status: 'Licensing' }]
  });

  DTM.add({
    id: 'x-energy', name: 'X-energy', domain: 'x-energy.com', status: 'public', ticker: 'XE', exchange: 'NASDAQ',
    hq: 'Rockville, MD', country: 'US', founded: 2009,
    subsegments: ['industrial.nuclear'],
    oneLiner: 'Xe-100 high-temperature gas reactors and TRISO-X fuel; IPO April 2026.',
    description: [
      'X-energy develops the Xe-100 small modular high-temperature gas-cooled reactor and manufactures TRISO particle fuel through TRISO-X. Its first project is at Dow\'s Seadrift site in Texas, supported by up to $2.15B of DOE funding.',
      'It listed on Nasdaq in April 2026, raising about $1.1B of net proceeds.'
    ],
    leadership: [['Clay Sell', 'CEO']],
    products: ['Xe-100', 'TRISO-X fuel'],
    marketCap: { usdM: 6360, asOf: '2026-09-14', src: S('Macrotrends', 'https://www.macrotrends.net/stocks/charts/XE/x-energy/market-cap') },
    valuation: { note: 'Pre-revenue. Sources disagree on share count; other September estimates run to $7.6B.', asOf: '2026-09-14', src: S('Macrotrends', 'https://www.macrotrends.net/stocks/charts/XE/x-energy/market-cap') },
    programs: [{ name: 'DOE Advanced Reactor Demonstration (Dow Seadrift)', customer: 'Department of Energy', role: 'Prime', value: 'Up to $2.15B (federal)', status: 'Development', src: S('Oil & Gas 360', 'https://www.oilandgas360.com/u-s-backs-x-energy-reactor-with-up-to-2-15-billion/') }]
  });

  DTM.add({
    id: 'radiant', name: 'Radiant', domain: 'radiantnuclear.com', status: 'private', stage: 'Series D',
    hq: 'El Segundo, CA', country: 'US', founded: 2020,
    subsegments: ['industrial.nuclear'],
    oneLiner: 'Kaleidos, a factory-built portable microreactor that fits in a shipping container.',
    description: [
      'Radiant is building Kaleidos, a 1 MW high-temperature gas-cooled microreactor designed to be mass-produced and shipped by truck, aircraft or ship, for military bases and remote sites.',
      'Kaleidos is scheduled for the first test at Idaho National Laboratory\'s DOME facility in 2026. Radiant is building a factory in Oak Ridge, Tennessee.'
    ],
    leadership: [['Doug Bernauer', 'Founder & CEO']],
    products: ['Kaleidos'],
    funding: {
      totalUsdM: 625, asOf: '2025-12',
      rounds: [
        { date: '2024-11', type: 'Series C', amountUsdM: 100, leads: ['DCVC'] },
        { date: '2025-06', type: 'Growth', amountUsdM: 165 },
        { date: '2025-12', type: 'Series D', amountUsdM: 300, leads: ['Draper Associates', 'Boost VC'] }
      ],
      investors: ['DCVC', 'Draper Associates', 'Boost VC', 'Equinix'],
      note: 'Total is an approximate sum of disclosed rounds.',
      src: [S('DCD', 'https://www.datacenterdynamics.com/en/news/equinix-backed-microreactor-firm-radiant-raises-300m-in-latest-funding-round/'), S('Radiant', 'https://radiantnuclear.com/blog/series-c-announcement/')]
    },
    programs: [{ name: 'DOME microreactor test at INL', ref: 'microreactors', customer: 'DOE / DoD', role: 'Prime', year: 2026, status: 'Testing' }]
  });

  DTM.add({
    id: 'antares', name: 'Antares', status: 'private', stage: 'Series C',
    hq: '', country: 'US', founded: 2023,
    subsegments: ['industrial.nuclear'],
    oneLiner: 'Heat-pipe microreactors for military installations; Mark-0 reached criticality in June 2026.',
    description: [
      'Antares develops small heat-pipe-cooled nuclear microreactors for defense installations and other critical missions. Its Mark-0 reactor achieved criticality at Idaho National Laboratory in June 2026 under the DOE Reactor Pilot Program.',
      'It raised a $470M Series C ($370M equity, $100M debt) in July 2026 and plans first deployments to US military installations by 2028.'
    ],
    leadership: [['Jordan Bramble', 'Co-founder & CEO']],
    products: ['Mark-0', 'R1 microreactor'],
    funding: {
      totalUsdM: 600, asOf: '2026-07',
      rounds: [
        { date: '2025-12', type: 'Series B', amountUsdM: 96, leads: ['Shine Capital'] },
        { date: '2026-07', type: 'Series C', amountUsdM: 470, leads: ['Paradigm', 'Caffeinated Capital'] }
      ],
      investors: ['Paradigm', 'Caffeinated Capital', 'Shine Capital'],
      note: 'Company says it has more than $600M of funding, including debt.',
      src: [S('Las Vegas Sun (AP), Jul 2026', 'https://lasvegassun.com/news/2026/jul/27/antares-raises-470m-series-c-to-deploy-nuclear-mic/'), S('NucNet', 'https://www.nucnet.org/news/us-startup-raises-usd470-million-to-build-reactors-for-military-bases-7-2-2026')]
    },
    programs: [{ name: 'Military installation microreactors', ref: 'microreactors', customer: 'DoD', role: 'Prime', status: 'Development' }]
  });

  /* ---------------- Power & batteries ---------------- */
  DTM.add({
    id: 'amprius', name: 'Amprius Technologies', short: 'Amprius', domain: 'amprius.com', status: 'public', ticker: 'AMPX', exchange: 'NYSE',
    hq: 'Fremont, CA', country: 'US', founded: 2008,
    subsegments: ['industrial.power', 'uas.components'],
    oneLiner: 'Silicon-anode lithium-ion cells with record energy density for drones and high-altitude aircraft.',
    description: [
      'Amprius makes high-energy-density silicon-anode batteries used mainly in drones and high-altitude pseudo-satellites, where weight drives endurance. It holds an $18.1M DIU contract for NDAA-compliant drone batteries.',
      'Revenue roughly tripled to about $73M in 2025, and it raised its 2026 outlook to at least $130M.'
    ],
    leadership: [['Kang Sun', 'CEO']],
    products: ['SiCore cells', 'SiMaxx cells'],
    marketCap: { usdM: 1460, asOf: '2026-08-14', src: S('Webull', 'https://www.webull.ca/news-detail/15345485242459136') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [{ label: 'FY2024', revenue: 24.2 }, { label: 'FY2025', revenue: 73, netIncome: -44 }],
      notes: 'Q1 2026 revenue was $28.5M (2.5× year on year). 2026 outlook raised to at least $130M with a net loss under $8M.',
      asOf: '2026-05-07', src: S('Amprius Q1 2026 results', 'https://ir.amprius.com/news-events/press-releases/detail/165')
    },
    valuation: { evSales: 11.2, basis: 'Market cap ÷ 2026 revenue outlook', note: 'EV not compiled; ratio shown uses market cap.', asOf: '2026-08-14', src: S('Webull', 'https://www.webull.ca/news-detail/15345485242459136') },
    programs: [{ name: 'NDAA-compliant drone batteries', customer: 'Defense Innovation Unit', role: 'Prime', value: '$18.1M', status: 'Active' }]
  });
  /* ---------------- Added from the private names list provided for this map (Oct 2026) ---------------- */
  {
    DTM.add({
      id: 'vulcanforms', name: 'VulcanForms', status: 'private', stage: 'Series D', country: 'US', founded: null,
      subsegments: ['industrial.additive', 'industrial.manufacturing'],
      oneLiner: 'Digital metal factories pairing high-power laser powder-bed fusion with machining for aerospace and defense parts.',
      description: ['VulcanForms runs vertically integrated digital metal manufacturing: its own high-power laser powder-bed fusion systems plus machining and finishing, producing parts for aerospace, defense, medical and industrial customers. It closed an oversubscribed $220M Series D in February 2026, led by Eclipse and 1789 Capital, to expand US production, following a $355M round in 2022 that valued it above $1B.'],
      funding: {
        totalUsdM: 575, asOf: '2026-02',
        rounds: [{ date: '2022-07', type: 'Growth', amountUsdM: 355 }, { date: '2026-02', type: 'Series D', amountUsdM: 220, leads: ['Eclipse', '1789 Capital'] }],
        note: 'Secondary sources put total funding at about $575M across six rounds.',
        src: [S('3D Printing Industry, Feb 2026', 'https://3dprintingindustry.com/news/vulcanforms-secures-220m-to-expand-u-s-production-cut-reliance-on-foreign-supply-chains-248717/'), S('TCT Magazine, 2022', 'https://www.tctmagazine.com/metal-3d-printing-firm-vulcanforms-raises-355-million/')]
      }
    });

    DTM.add({
      id: 'sprintray', name: 'SprintRay', status: 'private', stage: 'Series D', hq: 'Los Angeles, CA', country: 'US', founded: null,
      subsegments: ['industrial.additive'],
      oneLiner: 'Dental 3D printers, resins and design software for chairside crowns and dentures; no defense business.',
      description: ['SprintRay makes 3D printers, resins and AI design software used by dental practices and labs to print crowns, dentures and models chairside. In 2025 it bought the EnvisionTEC dental portfolio. Its last reported round was a $100M Series D in October 2022; it has no disclosed defense work and is included because it appears on the list provided for this map.'],
      funding: {
        totalUsdM: 149.9, asOf: '2022-10',
        note: 'Caplight figure. Other trackers report up to $238M.',
        src: [S('Caplight', 'https://www.caplight.com/company/sprintray'), S('Preqin', 'https://preqin.com/data/profile/asset/sprintray-inc-/512464')]
      }
    });

    DTM.add({
      id: 'seurat', name: 'Seurat Technologies', short: 'Seurat', status: 'private', stage: 'Series B', country: 'US', founded: null,
      subsegments: ['industrial.additive'],
      oneLiner: 'Area Printing: laser-patterned metal powder-bed fusion aiming at casting-like cost and volume.',
      description: ['Seurat prints metal parts by projecting laser patterns across whole areas of the powder bed rather than scanning a single spot, aiming at production volumes and costs closer to casting and forging. In July 2026 it was selected for America Makes\' JAQS-SQ project call, funded by the Pentagon\'s Manufacturing Technology Office, to build the process controls and quality systems needed to qualify parts for the defense industrial base.'],
      funding: {
        totalUsdM: 79, asOf: '2022',
        note: 'Series B total, including a $21M extension with Xerox Ventures and Porsche SE; earlier rounds not compiled.',
        src: S('3D Printing Industry', 'https://3dprintingindustry.com/news/seurat-technologies-raises-21m-to-fast-track-the-commercialization-of-area-printing-technology-202850/')
      },
      programs: [{ name: 'America Makes JAQS-SQ qualification project', customer: 'DoD Manufacturing Technology Office (via America Makes / NCDMM)', role: 'Prime', year: 2026, status: 'Awarded', src: S('FinanzNachrichten, Jul 2026', 'https://www.finanznachrichten.de/nachrichten-2026-07/69147760-seurat-technologies-selected-for-america-makes-jaqs-sq-award-in-support-of-defense-additive-manufacturing-200.htm') }]
    });

    DTM.add({
      id: 'fabric8labs', name: 'Fabric8Labs', status: 'private', stage: 'Venture', hq: 'San Diego, CA', country: 'US', founded: null,
      subsegments: ['industrial.additive'],
      oneLiner: 'Room-temperature electrochemical metal printing (ECAM) for cold plates, RF parts and power electronics.',
      description: ['Fabric8Labs prints high-resolution copper and other metal parts at room temperature using electrochemical additive manufacturing (ECAM), based on electroplating, with little post-processing. It targets thermal management for AI and HPC hardware, RF components and power electronics. In November 2025 it raised $50M led by NEA and Intel Capital to expand US output from about 5 million to 22 million components a year.'],
      funding: {
        totalUsdM: 50, asOf: '2025-11',
        rounds: [{ date: '2025-11', type: 'Venture', amountUsdM: 50, leads: ['NEA', 'Intel Capital'] }],
        note: 'November 2025 round only; earlier rounds, including a reported $50M Series B, are not totaled here.',
        src: S('Intel Capital, Nov 2025', 'https://www.intelcapital.com/fabric8labs-secures-50m-to-expand-u-s-advanced-manufacturing-capacity/')
      }
    });

    DTM.add({
      id: 'freeform', name: 'Freeform', status: 'private', stage: 'Series B', hq: 'Los Angeles, CA', country: 'US', founded: null,
      subsegments: ['industrial.additive'],
      oneLiner: 'AI-controlled metal printing with 18-laser GoldenEye systems; demand exceeds its contract capacity.',
      description: ['Freeform runs an AI-native metal printing platform: its GoldenEye system fuses metal powder with 18 lasers under machine-learning process control, and its successor, Skyfall, targets more than 25 times the throughput. It raised a $67M Series B in February 2026 from investors including Founders Fund, NVIDIA\'s NVentures and Two Sigma Ventures, saying demand consistently exceeds its capacity.'],
      funding: {
        totalUsdM: 81, asOf: '2026-02',
        rounds: [{ date: '2026-02', type: 'Series B', amountUsdM: 67 }],
        note: 'Seedtable puts total funding at about $81M, including a $14M round in October 2024.',
        src: [S('TechCrunch, Feb 2026', 'https://techcrunch.com/2026/02/19/freeform-raises-67m-series-b-to-scale-up-laser-ai-manufacturing/'), S('Seedtable', 'https://seedtable.com/companies/freeform')]
      }
    });

    DTM.add({
      id: 'boston-micro-fabrication', name: 'Boston Micro Fabrication', short: 'BMF', domain: 'bmf3d.com', status: 'private', stage: 'Series D', country: 'US', founded: null,
      subsegments: ['industrial.additive'],
      oneLiner: 'Micro-precision resin printing (projection micro-stereolithography) for tiny medical, electronics and connector parts.',
      description: ['Boston Micro Fabrication makes printers that use projection micro-stereolithography to produce very small, high-precision parts for medical devices, electronics and connectors. Its last reported round was a $24M Series D in August 2023 led by Guotai Junan Securities, after a roughly $42M Series C led by Shenzhen Capital Group.'],
      funding: {
        totalUsdM: 80.1, asOf: '2023-08',
        note: 'Caplight total.',
        src: [S('Caplight', 'https://www.caplight.com/company/bmf3d'), S('Digital Engineering 24/7', 'https://www.digitalengineering247.com/article/boston-micro-fabrication-secures-24m-series-d-funding')]
      }
    });

    DTM.add({
      id: 'continuum-powders', name: 'Continuum Powders', short: 'Continuum', status: 'private', stage: 'Growth', hq: 'Houston, TX', country: 'US', founded: null,
      subsegments: ['industrial.additive', 'industrial.materials'],
      oneLiner: 'Turns nickel and titanium scrap into qualified metal powders for printing aerospace and defense parts.',
      description: ['Continuum Powders melts and atomizes scrap such as nickel superalloy turnings into spherical powders for additive manufacturing, qualified on machines including Renishaw\'s RenAM 500. It raised $36M led by Ara Partners in late 2022 and has won about $3.3M of DoD SBIR and R&D awards, including Air Force work on printed landing gear components.'],
      funding: {
        totalUsdM: 36, asOf: '2022-12',
        note: 'Latest disclosed round; earlier rounds not compiled.',
        src: S('Recycling Today', 'https://recyclingtoday.com/article/metal-recycler-continuum-raises-36-million-dollars-in-funding')
      },
      programs: [{ name: 'DoD SBIR and R&D awards (10)', customer: 'US DoD (incl. Air Force)', role: 'Prime', value: '~$3.27M', status: 'Awarded', note: 'June 2022 to June 2024.', src: S('GovCon in a Box', 'https://govconinabox.com/explore/contractors/profile/continuum-powders-corporation-u9c1dr') }]
    });

    DTM.add({
      id: 'alloy-enterprises', name: 'Alloy Enterprises', status: 'private', stage: 'Series A', hq: 'Burlington, MA', country: 'US', founded: null,
      subsegments: ['industrial.additive'],
      oneLiner: 'Powder-free aluminum additive manufacturing that laser-cuts and diffusion-bonds sheet into dense parts.',
      description: ['Alloy Enterprises builds aluminum parts without powder: it laser-cuts sheet stock and diffusion-bonds the layers into near-fully dense components, using feedstock already produced at scale. Its $26M Series A in 2023, led by Piva Capital, brought total funding to $37M.'],
      funding: { totalUsdM: 37, asOf: '2023-05', src: S('TCT Magazine', 'https://www.tctmagazine.com/alloy-enterprises-raises-26-million-as-it-prepares-to-ramp-u/') }
    });

    DTM.add({
      id: 'quantica', name: 'Quantica', status: 'private', stage: 'Series A', hq: 'Berlin', country: 'DE', founded: null,
      subsegments: ['industrial.additive'],
      oneLiner: 'NovoJet multi-material jetting of high-viscosity resins, with teams in Berlin, Barcelona and Cambridge.',
      description: ['Quantica develops NovoJet, a printhead that jets high-viscosity and particle-filled materials so several materials can be combined in one part. Its Series A, €14M in 2023 led by a dental-industry family office, was extended in 2024 to €19.7M with West Hill Capital.'],
      funding: { totalUsdM: 22.9, asOf: '2024', note: '€19.7M Series A converted at about 1.16 USD per EUR.', src: S('3D Printing Industry', 'https://3dprintingindustry.com/news/quantica-announces-an-increase-in-its-series-a-funding-round-230826/') }
    });

    DTM.add({
      id: 'inkbit', name: 'Inkbit', domain: 'inkbit3d.com', status: 'private', stage: 'Venture', country: 'US', founded: null,
      subsegments: ['industrial.additive'],
      oneLiner: 'Vision-controlled jetting that scans every layer to print multi-material parts; Air Force-funded systems.',
      description: ['Inkbit, an MIT spin-out, uses vision-controlled jetting (VCJ): a scanner checks each layer and corrects the next, allowing multi-material parts without rollers. The Air Force awarded a $1.7M SBIR in 2021 for three systems for Air Force bases, building on DARPA-funded work. Its latest round was $19M in 2024 led by Ingersoll Rand.'],
      funding: { totalUsdM: 19, asOf: '2024-05', note: 'Latest round only; earlier rounds not compiled.', src: S('Turbomachinery Magazine, May 2024', 'https://www.turbomachinerymag.com/view/ingersoll-rand-closes-on-19m-funding-round-for-inkbit-s-vision-controlled-jetting-system') },
      programs: [{ name: 'SBIR for three VCJ systems at Air Force bases', customer: 'US Air Force', role: 'Prime', value: '$1.7M', year: 2021, status: 'Awarded', src: S('Design World', 'https://www.designworldonline.com/inkbit-awarded-research-contract-from-the-united-states-air-force/') }]
    });

    DTM.add({
      id: 'azul-3d', name: 'Azul 3D', status: 'private', stage: 'Series A', hq: 'Chicago, IL', country: 'US', founded: null,
      subsegments: ['industrial.additive'],
      oneLiner: 'HARP high-area rapid resin printing for electronic components and custom devices, backed by DuPont.',
      description: ['Azul 3D develops High-Area Rapid Printing (HARP), a continuous vat-photopolymerization process for large, fast resin prints aimed at specialized electronic components and custom devices. DuPont, a partner since 2019, led its $15M Series A in October 2023, after a $12.5M seed in 2020.'],
      funding: { totalUsdM: 27.5, asOf: '2023-10', src: [S('Business Wire, Oct 2023', 'https://www.businesswire.com/news/home/20231010246552/en/Azul-3D-Closes-15-Million-in-Series-A-Funding'), S('Pulse 2.0, 2020', 'https://pulse2.com/azul3d-raises-12-5-million/')] }
    });

    DTM.add({
      id: 'caracol', name: 'Caracol', status: 'private', stage: 'Series B', hq: 'Milan', country: 'IT', founded: null,
      subsegments: ['industrial.additive'],
      oneLiner: 'Robotic large-format printing in metal (wire-arc) and polymer, targeting aerospace, defense and marine.',
      description: ['Caracol builds robotic large-format additive manufacturing systems, including the Vipra AM platform for wire-arc metal printing, with offices in Milan, Austin and Dubai. Its $40M Series B in October 2025, led by Omnes Capital and Move Capital, is aimed at scaling metal printing in aerospace and defense, energy and maritime.'],
      funding: { totalUsdM: 55.7, asOf: '2025-10', note: 'CB Insights total; Caplight lists $59.6M.', src: S('Metal AM, Oct 2025', 'https://www.metal-am.com/caracol-raises-40m-to-ramp-up-metal-am-and-global-expansion/') }
    });

    DTM.add({
      id: 'xolo', name: 'Xolo', status: 'private', stage: 'Series A', hq: 'Berlin', country: 'DE', founded: null,
      subsegments: ['industrial.additive'],
      oneLiner: 'Xolography: volumetric printing that cures whole parts inside a resin vat with intersecting light.',
      description: ['Xolo commercializes xolography, a volumetric process in which a light sheet and photoactive chemistry cure a part inside a resin cuvette rather than layer by layer, giving fast prints with very smooth surfaces. It raised an €8M Series A in February 2023 led by the DeepTech & Climate Fonds and HZG Group.'],
      funding: { totalUsdM: 9.3, asOf: '2023-02', note: '€8M converted at about 1.16 USD per EUR.', src: S('TCT Magazine', 'https://www.tctmagazine.com/eight-million-euros-raised-xolo-gmbh-hzg-group/') }
    });

    DTM.add({
      id: 'ai-build', name: 'Ai Build', domain: 'ai-build.com', status: 'private', stage: 'Seed', hq: 'London', country: 'UK', founded: null,
      subsegments: ['industrial.additive'],
      oneLiner: 'AiSync software that automates large-format robotic printing; works with Boeing, GKN Aerospace and Rolls-Royce.',
      description: ['Ai Build makes AiSync, software that plans and monitors large-format robotic and industrial printing, used by aerospace and automotive manufacturers. It joined the ATI Boeing Accelerator and has worked with GKN Aerospace and Rolls-Royce. It raised about $1M in 2021 and $3.2M in June 2022 led by ACT Venture Partners.'],
      funding: { totalUsdM: 4.2, asOf: '2022-06', src: S('Ai Build, Jun 2022', 'https://ai-build.com/resources/aibuild-secures-3-2m-investment-to-revolutionize-additive-manufacturing/') }
    });

    DTM.add({
      id: 'rapid-liquid-print', name: 'Rapid Liquid Print', short: 'RLP', status: 'private', stage: 'Series A', hq: 'Boston, MA', country: 'US', founded: null,
      subsegments: ['industrial.additive'],
      oneLiner: 'MIT spin-out printing silicone and foam parts inside a gel in minutes, with no support structures.',
      description: ['Rapid Liquid Print, an MIT spin-out, injects industrial silicones, rubbers and foams into a gel bath that holds the part as it cures, so prints take minutes and need no supports. It sells to medical, automotive and consumer goods customers and raised a $7M Series A led by HZG Group.'],
      funding: { totalUsdM: 7, asOf: '2024', src: S('3D Printing Industry', 'https://3dprintingindustry.com/news/rapid-liquid-print-raises-7-million-to-scale-its-support-free-gel-3d-printing-technology-230410/') }
    });

    DTM.add({
      id: 'axtra3d', name: 'Axtra3D', status: 'private', stage: 'Series A', country: 'US', founded: null,
      subsegments: ['industrial.additive'],
      oneLiner: 'Lumia resin printers using Hybrid PhotoSynthesis, combining laser and DLP light engines for speed and detail.',
      description: ['Axtra3D makes Lumia resin printers that use Hybrid PhotoSynthesis, combining a laser with DLP projection to print fine features faster than conventional stereolithography; it has a second site in Vicenza, Italy. HZG Group led its $4.5M Series A2 in November 2024, taking total funding to $9.75M.'],
      leadership: [['Gianni Zitelli', 'Founder & CEO']],
      funding: { totalUsdM: 9.75, asOf: '2024-11', src: S('VoxelMatters', 'https://www.voxelmatters.com/axtra3d-completes-its-9-75m-series-a-round-led-by-hzg-group/') }
    });

    DTM.add({
      id: 'fluent-metal', name: 'Fluent Metal', status: 'private', stage: 'Seed', hq: 'Cambridge, MA', country: 'US', founded: 2020,
      subsegments: ['industrial.additive'],
      oneLiner: 'Drop-on-demand liquid metal printing from wire feedstock, enabling multi-metal parts with no powder.',
      description: ['Fluent Metal, founded in 2020 by veterans of Desktop Metal, VulcanForms and the MIT Media Lab, prints by jetting droplets of already-molten metal fed from wire, avoiding powders and lasers and allowing multi-metal parts. It launched from stealth in March 2024 with $5.5M raised, led by E15 VC.'],
      leadership: [['Peter Schmitt', 'CEO']],
      funding: { totalUsdM: 5.5, asOf: '2024-03', src: S('Pulse 2.0, Mar 2024', 'https://pulse2.com/fluent-metal-launches-with-5-5-million-in-total-funding') }
    });

    DTM.add({
      id: 'wayland-additive', name: 'Wayland Additive', short: 'Wayland', status: 'private', stage: 'Venture', country: 'UK', founded: null,
      subsegments: ['industrial.additive'],
      oneLiner: 'Calibur3 electron-beam powder-bed printer with NeuBeam charge neutralization for crack-prone alloys.',
      description: ['Wayland Additive builds the Calibur3 electron-beam powder-bed fusion printer, whose NeuBeam process neutralizes charge build-up so a wider range of alloys can be printed, with in-situ monitoring. It closed a £4.6M round in 2023 with Metrea Discovery joining existing investors, after an earlier £3M.'],
      funding: { totalUsdM: 10.2, asOf: '2023', note: '£7.6M converted at about 1.34 USD per GBP.', src: S('Metal AM', 'https://www.metal-am.com/wayland-additive-closes-4-6m-funding-round/') }
    });

    DTM.add({
      id: 'triditive', name: 'Triditive', status: 'private', stage: 'Seed', hq: 'Gijón', country: 'ES', founded: null,
      subsegments: ['industrial.additive'],
      oneLiner: 'AMCELL automated print cells combining binder jetting and filament printing for on-demand parts.',
      description: ['Triditive builds AMCELL, an automated cell of eight robotic print modules that combines binder jetting and fused filament printing in polymers, composites and metals, with EVAM software for digital warehouses. It runs a 2,000 m² plant in Asturias.'],
      funding: { totalUsdM: 5.2, asOf: '2022-06', note: 'VCBacked total. Trade press also reports a €5M pre-Series A whose date could not be confirmed.', src: [S('VCBacked', 'https://www.vcbacked.co/company/triditive'), S('Metal AM', 'https://www.metal-am.com/triditive-closes-a-e5-million-preseries-a-investment-round/')] }
    });

    DTM.add({
      id: 'toffeeam', name: 'TOffeeAM', status: 'private', stage: 'Series A', hq: 'London', country: 'UK', founded: 2019,
      subsegments: ['industrial.additive', 'software.engineering'],
      oneLiner: 'Imperial College spin-out making topology-optimization software for printed heat exchangers and parts.',
      description: ['TOffeeAM, spun out of Imperial College London in 2019, sells topology-optimization software that designs printable parts such as heat exchangers and cold plates from physics simulations. It raised a £1M seed led by IQ Capital and a £5M Series A led by Presidio Ventures Europe and East Innovate, and holds an Innovate UK grant for next-generation heat exchangers.'],
      funding: { totalUsdM: 8, asOf: '2026-03', note: '£6M converted at about 1.34 USD per GBP; Series A date per a March 2026 trade report.', src: [S('Manufactur3D, Mar 2026', 'https://manufactur3dmag.com/toffeeam-ai-3d-printing-design-software/'), S('Metal AM', 'https://www.metal-am.com/?p=77346')] }
    });

    DTM.add({
      id: 'q5d', name: 'Q5D Technologies', short: 'Q5D', status: 'private', stage: 'Series A', country: 'UK', founded: null,
      subsegments: ['industrial.additive', 'industrial.manufacturing'],
      oneLiner: 'Robotic 5-axis printing of wiring harnesses and circuits into structures; Lockheed Martin Ventures backed.',
      description: ['Q5D builds the CU500, a 5-axis robotic system that prints structures with integrated wiring and circuit traces, aiming to automate wire-harness production for vehicles and aircraft; it runs a technical center in Bristol. Its Series A in June 2025, co-led by Lockheed Martin Ventures, Chrysalix and Maven, raised about £10M including a £2M Innovate UK grant.'],
      funding: { totalUsdM: 16, asOf: '2025-06', note: 'About $13.5M Series A (including the grant) plus a $2.5M seed.', src: [S('Maven, Jun 2025', 'https://www.mavencp.com/latest-news/swif-maven-equity-finance-backs-q5d-technologies-as-part-of-a-10m-fundraise'), S('EPDT', 'https://www.epdtonthenet.net/article/216036/-13-5-Million-Worth-of-Funding-Garnered-by-Q5D.aspx')] }
    });

    DTM.add({
      id: 'additive-assurance', name: 'Additive Assurance', status: 'private', stage: 'Seed', hq: 'Melbourne', country: 'AU', founded: 2019,
      subsegments: ['industrial.additive'],
      oneLiner: 'AMiRIS in-process quality assurance that flags defects in metal prints; sold a system to Australia\'s DST Group.',
      description: ['Additive Assurance, a 2019 Monash University spin-out, makes AMiRIS, which monitors metal laser powder-bed printing and alerts on defects as parts are built. It sold a pre-production system to Australia\'s Defence Science and Technology Group and raised A$4.1M in December 2022 led by Significant Capital Ventures, after an A$1.6M round led by IP Group.'],
      funding: { totalUsdM: 3.7, asOf: '2022-12', note: 'A$5.7M converted at about 0.65 USD per AUD.', src: S('Startup Daily, Dec 2022', 'https://archive.startupdaily.net/?p=107511') },
      programs: [{ name: 'AMiRIS pre-production system', customer: 'Defence Science and Technology Group (Australia)', role: 'Vendor', status: 'Delivered', src: S('Australian Manufacturing', 'https://www.australianmanufacturing.com.au/?p=127718') }]
    });

    DTM.add({
      id: 'syenta', name: 'Syenta', status: 'private', stage: 'Series A', hq: 'Sydney', country: 'AU', founded: null,
      subsegments: ['industrial.additive'],
      oneLiner: 'ANU spin-out that pivoted from 3D printers to electrochemical chip-packaging interconnects; In-Q-Tel backed.',
      description: ['Syenta, an Australian National University spin-out, began with fast multi-material 3D printers and now develops Localised Electrochemical Manufacturing, a lithography-free way to build high-density interconnects for advanced chip packaging, with production targeted for 2027. It raised a A$36M (US$26M) Series A led by Playground Global and Australia\'s National Reconstruction Fund; investors also include In-Q-Tel.'],
      funding: { totalUsdM: 34, asOf: '2026', note: 'Series A plus an A$8.8M pre-Series A and a 2022 seed of about A$3.7M, converted at about 0.65 USD per AUD.', src: S('SmartCompany', 'https://smartcompany.com.au/startupsmart/three-anz-startups-raised-61-4-million-this-week') }
    });

    DTM.add({
      id: 'fortius-metals', name: 'Fortius Metals', status: 'private', stage: 'Seed', country: 'US', founded: null,
      subsegments: ['industrial.additive', 'industrial.materials'],
      oneLiner: 'Wire feedstock for wire-arc and DED printing; Air Force SBIR to qualify hypersonic-grade nickel wire.',
      description: ['Fortius Metals, spun out of powder maker Elementum, produces alloy wire for wire-based additive manufacturing, prioritizing aerospace and defense. In March 2024 it won an Air Force SBIR to speed qualification of its IN625-RAM2 wire for hypersonic applications; customers include the US Army, Navy, Air Force and NASA. Its Seed+ round reached $5M in October 2024 with ArcelorMittal-backed Finindus.'],
      funding: { totalUsdM: 5, asOf: '2024-10', src: S('Metal AM', 'https://www.metal-am.com/fortius-metals-funding-round-totals-5-million-to-bring-next-gen-wire-to-market/') },
      programs: [{ name: 'SBIR: IN625-RAM2 wire for hypersonics', customer: 'US Air Force', role: 'Prime', year: 2024, status: 'Awarded', src: S('Metal AM', 'https://www.metal-am.com/fortius-metals-funding-round-totals-5-million-to-bring-next-gen-wire-to-market/') }]
    });

    DTM.add({
      id: 'zaxe', name: 'Zaxe', status: 'private', stage: 'Venture', hq: 'Istanbul', country: 'TR', founded: 2015,
      subsegments: ['industrial.additive'],
      oneLiner: 'Turkish maker of filament 3D printers, materials and slicer software sold in more than 15 countries.',
      description: ['Zaxe, founded in Istanbul in 2015 by Baki Gezgen, designs and builds filament 3D printers, materials and its own xDesktop slicer for education and industrial users in more than 15 countries. It raised $2M in 2023 led by a regional development fund under PCP Technology Opportunities Fund and the Türkiye Development Fund. It has no disclosed defense work.'],
      funding: { totalUsdM: 4.6, asOf: '2023', note: 'CB Insights total; other trackers list $2.2M–$3.3M.', src: S('3DPrint.com, 2023', 'https://3dprint.com/303278/turkeys-zaxe-secures-2m-investment-to-accelerate-global-3d-printing-expansion/amp/') }
    });

    DTM.add({
      id: 'vitro3d', name: 'Vitro3D', status: 'private', stage: 'Seed', hq: 'Boulder, CO', country: 'US', founded: null,
      subsegments: ['industrial.additive'],
      oneLiner: 'University of Colorado spin-out building cartridge-based volumetric resin printers for dental and bio uses.',
      description: ['Vitro3D, a University of Colorado spin-out, develops cartridge-based volumetric resin printers, initially for dental aligners and scaffolds for 3D cell culture. It raised a $1.3M seed in November 2022 led by Buff Gold Ventures.'],
      funding: { totalUsdM: 1.3, asOf: '2022-11', src: S('BizWest, Nov 2022', 'https://bizwest.com/2022/11/02/cu-spinout-vitro3d-raises-1-3m-to-develop-3d-printing-technology/') }
    });

    DTM.add({
      id: 'amfg', name: 'AMFG', status: 'private', stage: 'Venture', hq: 'London', country: 'UK', founded: null,
      subsegments: ['industrial.additive', 'software.engineering'],
      oneLiner: 'Manufacturing execution and workflow software that automates ordering, scheduling and production for 3D-print shops.',
      description: ['AMFG sells manufacturing execution and workflow automation software for additive manufacturing operations, from order intake and scheduling to post-processing and shipping. It has received Innovate UK funding, including a 2023 Knowledge Transfer Partnership with Imperial College London on autonomous manufacturing, and had about 79 employees in 2025.'],
      employees: '~79 (2025)',
      funding: { totalUsdM: null, label: 'Undisclosed', asOf: '2025', src: [S('PitchBook', 'https://www.pitchbook.com/profiles/company/100721-17'), S('Imperial College London', 'https://imperial.ac.uk/news/243291/imperial-amfg-innovate-uk-funding-deliver')] }
    });

    DTM.add({
      id: 'fortify', name: 'Fortify', status: 'private', stage: 'Series B', hq: 'Boston, MA', country: 'US', founded: null,
      subsegments: ['industrial.additive'],
      oneLiner: 'Flux-series DLP printers that magnetically align fibers in composite resins; In-Q-Tel investor.',
      description: ['Fortify\'s Digital Composite Manufacturing aligns fibers in resin with magnetic fields during DLP printing, producing stiff, heat-resistant parts on its Flux-series printers. It raised a $10M Series A led by Accel in 2019 and $20M led by Cota Capital in 2021, and took a strategic investment from In-Q-Tel in 2022.'],
      funding: { totalUsdM: 32.5, asOf: '2022', note: 'Seed, Series A and 2021 round; the In-Q-Tel amount was not disclosed.', src: [S('CompositesWorld, 2021', 'https://www.compositesworld.com/news/fortify-secures-20-million-funding-to-advance-3d-printing-composites'), S('AM Chronicle', 'https://amchronicle.com/news/fortify-announces-in-q-tel-investment-several-new-fluxprint-3d-printing-materials')] }
    });

    DTM.add({
      id: 'edgecloudlink', name: 'EdgeCloudLink', short: 'ECL', status: 'private', stage: 'Seed', hq: 'Mountain View, CA', country: 'US', founded: null,
      subsegments: ['industrial.power'],
      oneLiner: 'Hydrogen fuel-cell powered modular data centers; dropped its plan to 3D-print the buildings.',
      description: ['EdgeCloudLink builds modular data centers powered by hydrogen fuel cells on their own microgrids. It first planned to construction-print the buildings, but its 1 MW Mountain View site reused an existing warehouse instead, so it no longer does additive manufacturing. It raised a $7M seed from Hyperwise Ventures and Molex Ventures.'],
      funding: { totalUsdM: 7, asOf: '2023', src: S('3DAdept', 'https://3dadept.com/startup-area-what-happened-to-3d-printing-ventures-that-turned-stealth-mode-off-in-2023/') }
    });

    DTM.add({
      id: 'sila', name: 'Sila Nanotechnologies', short: 'Sila', status: 'private', stage: 'Series H', hq: 'Alameda, CA', country: 'US', founded: 2011,
      subsegments: ['industrial.materials', 'industrial.power'],
      oneLiner: 'Silicon-carbon battery anodes from Moses Lake, WA; conditional $1.4B Pentagon loan for anodes and drone cells.',
      description: ['Sila makes silicon-carbon anode material that raises lithium-ion energy density, produced at its Moses Lake, Washington plant (about 2 GWh a year). In July 2026 it raised a $300M Series H led by Atreides and Sutter Hill, and in August the Pentagon\'s Office of Strategic Capital committed a conditional $1.4B loan to expand anode output and build a cell plant whose first cells target industrial and military drones.'],
      funding: {
        totalUsdM: 1610, asOf: '2026-07',
        rounds: [{ date: '2026-07', type: 'Series H', amountUsdM: 300, leads: ['Atreides Management', 'Sutter Hill Ventures'] }],
        note: 'Total from a Hiive-sourced tracker, which also put the valuation at $2.33B. Excludes the conditional $1.4B loan and a $100M 2022 DOE grant.',
        src: [S('StockAnalysis (private)', 'https://stockanalysis.com/private/sila/'), S('electrive, Aug 2026', 'https://electrive.com/2026/08/11/us-government-offers-sila-up-to-1-4-billion-in-funding')]
      },
      programs: [{ name: 'Office of Strategic Capital loan (conditional)', customer: 'DoD Office of Strategic Capital', role: 'Borrower', value: 'Up to $1.4B', year: 2026, status: 'Conditional', note: 'Anode expansion and a lithium-ion cell plant at Moses Lake; not yet closed.', src: S('electrive, Aug 2026', 'https://electrive.com/2026/08/11/us-government-offers-sila-up-to-1-4-billion-in-funding') }]
    });

    DTM.add({
      id: 'chariot-defense', name: 'Chariot Defense', status: 'private', stage: 'Series A', country: 'US', founded: 2024,
      subsegments: ['industrial.power'],
      oneLiner: 'Amphora hybrid power systems that store, convert and route battlefield power for radios, drones and lasers.',
      description: ['Chariot Defense, founded in 2024, builds Amphora, a modular hybrid power system that integrates energy storage, conversion and distribution at the tactical edge for radios, drones, sensors and directed-energy weapons. After sales and contracts with the US Army and DIU\'s Project GI, it raised a $34M Series A led by Andreessen Horowitz in February 2026, bringing total funding to $41M.'],
      funding: {
        totalUsdM: 41, asOf: '2026-02',
        rounds: [{ date: '2025-07', type: 'Seed', amountUsdM: 8, leads: ['General Catalyst', 'XYZ Venture Capital'] }, { date: '2026-02', type: 'Series A', amountUsdM: 34, leads: ['Andreessen Horowitz'] }],
        src: S('Pulse 2.0, Feb 2026', 'https://pulse2.com/chariot-defense-34-million-series-a-raised-to-scale-battlefield-power-systems')
      },
      programs: [{ name: 'Army and DIU Project GI power systems', customer: 'US Army / DIU', role: 'Prime', status: 'Delivering', src: S('Pulse 2.0, Feb 2026', 'https://pulse2.com/chariot-defense-34-million-series-a-raised-to-scale-battlefield-power-systems') }]
    });
  }
  /* ---------------- Public names sheet provided for this map (undated): additive and industrial tech ---------------- */
  {
    const CSV = S('Public defense names sheet provided for this map (undated)');
    const sheetVal = (evSales, evSalesFy2, extra) => Object.assign({
      evSales, basis: 'EV / Sales, current fiscal year (sheet)',
      note: `From the public names sheet provided for this map (undated). EV / Sales on next fiscal year: ${evSalesFy2.toFixed(2)}×.`,
      asOf: '2026', undated: true, src: CSV, ebitdaBasis: 'EV / EBITDA on the sheet (undated)'
    }, extra || {});

    DTM.add({
      id: 'xometry', name: 'Xometry', domain: 'xometry.com', status: 'public', ticker: 'XMTR', exchange: 'NASDAQ',
      hq: 'North Bethesda, MD', country: 'US', founded: 2013,
      subsegments: ['industrial.additive', 'industrial.manufacturing'],
      oneLiner: 'AI-driven marketplace that quotes and routes CNC, 3D printing, sheet metal and molding jobs to a supplier network.',
      description: ['Xometry runs an online marketplace that instantly prices custom parts and routes the work, from CNC machining and 3D printing to sheet metal and injection molding, to a network of independent manufacturers. It serves engineers and buyers across industry, including aerospace and defense suppliers.'],
      marketCap: { usdM: 6101, asOf: '2026', undated: true, src: CSV },
      valuation: sheetVal(7.34, 5.33)
    });

    DTM.add({
      id: 'materialise', name: 'Materialise', domain: 'materialise.com', status: 'public', ticker: 'MTLS', exchange: 'NASDAQ',
      hq: 'Leuven', country: 'BE', founded: 1990,
      subsegments: ['industrial.additive', 'software.engineering'],
      oneLiner: '3D printing software (Magics, CO-AM), medical planning tools and industrial print services from Belgium.',
      description: ['Materialise sells software that prepares and manages 3D printing production, including Magics and the CO-AM platform, medical software and patient-specific devices, and contract manufacturing services. Its build-preparation software is widely used by aerospace and defense printing shops.'],
      marketCap: { usdM: 496, asOf: '2026', undated: true, src: CSV },
      valuation: sheetVal(1.28, 1.23, { evEbitda: 11.73, pe: 31.26, peBasis: 'P / E on the sheet (undated)' })
    });

    DTM.add({
      id: 'proto-labs', name: 'Proto Labs', domain: 'protolabs.com', status: 'public', ticker: 'PRLB', exchange: 'NYSE',
      hq: 'Maple Plain, MN', country: 'US', founded: 1999,
      subsegments: ['industrial.additive', 'industrial.manufacturing'],
      oneLiner: 'Digital factory for quick-turn injection molding, CNC machining, 3D printing and sheet metal parts.',
      description: ['Proto Labs runs automated factories and a partner network that turn uploaded CAD files into injection-molded, machined, printed and sheet metal parts in days, serving prototyping and low-volume production for industrial, medical and aerospace customers.'],
      marketCap: { usdM: 2202, asOf: '2026', undated: true, src: CSV },
      valuation: sheetVal(3.68, 3.29, { evEbitda: 27.94, pe: 74.53, peBasis: 'P / E on the sheet (undated)' })
    });

    DTM.add({
      id: '3d-systems', name: '3D Systems', domain: '3dsystems.com', status: 'public', ticker: 'DDD', exchange: 'NYSE',
      hq: 'Rock Hill, SC', country: 'US', founded: 1986,
      subsegments: ['industrial.additive'],
      oneLiner: 'Inventor of stereolithography; metal and polymer printers, materials and software for industrial and healthcare use.',
      description: ['3D Systems, founded by stereolithography inventor Chuck Hull, sells metal and polymer printers, materials, software and on-demand parts for aerospace and defense, industrial and healthcare customers.'],
      marketCap: { usdM: 547, asOf: '2026', undated: true, src: CSV },
      valuation: sheetVal(1.47, 1.39)
    });

    DTM.add({
      id: 'stratasys', name: 'Stratasys', domain: 'stratasys.com', status: 'public', ticker: 'SSYS', exchange: 'NASDAQ',
      hq: 'Eden Prairie, MN and Rehovot', country: 'US', founded: 1989,
      subsegments: ['industrial.additive'],
      oneLiner: 'FDM and PolyJet polymer printers, materials and software, widely used for aerospace and defense tooling and parts.',
      description: ['Stratasys, the company behind fused deposition modeling (FDM) and PolyJet, sells polymer 3D printers, certified materials and software, with dual headquarters in Minnesota and Israel. Its printers are used by aerospace and defense manufacturers for tooling, prototypes and flight-qualified parts.'],
      marketCap: { usdM: 709, asOf: '2026', undated: true, src: CSV },
      valuation: sheetVal(0.95, 0.89)
    });

    DTM.add({
      id: 'velo3d', name: 'Velo3D', domain: 'velo3d.com', status: 'public', ticker: 'VELO', exchange: 'NASDAQ',
      country: 'US', founded: null,
      subsegments: ['industrial.additive'],
      oneLiner: 'Sapphire metal printers and production services; DIU Project FORGE and DLA contracts for weapon-system parts.',
      description: ['Velo3D makes Sapphire laser powder-bed metal printers and now also produces parts for defense and space customers. 2025 revenue was $46M and it guides to $60M–$70M in 2026; Q1 2026 revenue rose 48% to $13.8M. Defense work includes a $32.6M DIU Project FORGE contract with the Navy to qualify printed weapon-system components, an $11.5M production contract from a defense prime and a $9.8M Defense Logistics Agency IDIQ.'],
      marketCap: { usdM: 285, asOf: '2026', undated: true, src: CSV },
      financials: {
        cur: 'USD', fyEnd: 'Dec',
        periods: [{ label: 'FY2025', revenue: 46 }],
        notes: 'Q1 2026 revenue $13.8M (+48%), 17.2% gross margin; 2026 guidance $60M–$70M.',
        asOf: '2026-05', src: [S('Velo3D FY2025 results, Barchart', 'https://www.barchart.com/story/news/928646/velo3d-announces-fourth-quarter-and-full-year-2025-financial-results-unveils-long-term-capacity-plan-envisioning-up-to-approximately-400-production-systems'), S('Velo3D 8-K, Mar 2026', 'https://www.sec.gov/Archives/edgar/data/1825079/000119312526121871/velo-ex99_1.htm')]
      },
      valuation: sheetVal(3.89, 2.43),
      programs: [
        { name: 'Project FORGE: printed weapon-system components', customer: 'DIU / US Navy', role: 'Prime', value: '$32.6M', year: 2026, status: 'Awarded', src: S('Velo3D 8-K, Mar 2026', 'https://www.sec.gov/Archives/edgar/data/1825079/000119312526121871/velo-ex99_1.htm') },
        { name: 'JAMA Pilot Parts Program IDIQ', customer: 'Defense Logistics Agency', role: 'Prime', value: '$9.8M', status: 'Awarded', src: S('Velo3D 8-K, Mar 2026', 'https://www.sec.gov/Archives/edgar/data/1825079/000119312526121871/velo-ex99_1.htm') }
      ]
    });

    DTM.add({
      id: 'symbotic', name: 'Symbotic', domain: 'symbotic.com', status: 'public', ticker: 'SYM', exchange: 'NASDAQ',
      hq: 'Wilmington, MA', country: 'US', founded: 2007,
      subsegments: ['industrial.manufacturing'],
      oneLiner: 'AI-driven robotic warehouse automation for retailers and distributors; Walmart is its largest customer.',
      description: ['Symbotic builds AI-controlled robotic systems that store, retrieve and palletize cases in distribution centers, with Walmart as its largest customer. It appears on the public names sheet as disruptive industrial technology; it has no disclosed defense programs.'],
      marketCap: { usdM: 25287, asOf: '2026', undated: true, src: CSV },
      valuation: sheetVal(1.56, 1.15, { evEbitda: 50.37, pe: 469.62, peBasis: 'P / E on the sheet (undated)' })
    });
  }
})();
