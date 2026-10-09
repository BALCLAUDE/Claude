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
})();
