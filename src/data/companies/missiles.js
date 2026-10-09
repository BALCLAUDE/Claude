/* Missiles & Munitions segment. Anduril is defined in software.js and also appears here. */
(function () {
  const S = (t, u) => (u ? { t, u } : { t });

  /* ---------------- Hypersonics ---------------- */
  DTM.add({
    id: 'castelion', name: 'Castelion', domain: 'castelion.com', status: 'private', stage: 'Series C',
    hq: 'Torrance, CA', country: 'US', founded: 2022,
    subsegments: ['missiles.hypersonics', 'missiles.strike'],
    oneLiner: 'Low-cost hypersonic strike weapons built like consumer hardware; Blackbeard targets fielding in 2027.',
    description: [
      'Castelion applies rapid, iterative test-and-build methods to long-range hypersonic weapons. Its Blackbeard is a low-cost hypersonic missile designed to launch from existing platforms such as HIMARS and aircraft.',
      'In August 2026 it closed a $1B Series C (about $800M equity plus a $250M credit line) at a $13B valuation, to expand production at a 1,000-acre campus in Sandoval County, New Mexico. It reports more than $500M of US military contracts booked in 18 months.'
    ],
    leadership: [['Bryon Hargis', 'Co-founder & CEO']],
    products: ['Blackbeard', 'Blackbeard GL'],
    funding: {
      totalUsdM: 1250, asOf: '2026-08',
      rounds: [
        { date: '2025-12', type: 'Series B', amountUsdM: 350, postUsdM: 2800 },
        { date: '2026-08', type: 'Series C', amountUsdM: 800, postUsdM: 13000, leads: ['JPMorganChase', 'Andreessen Horowitz', 'Carlyle'] }
      ],
      investors: ['Andreessen Horowitz', 'Lightspeed', 'Altimeter', 'General Catalyst', 'Lavrock', 'Interlagos', 'T. Rowe Price'],
      note: 'Total is an approximate sum of disclosed equity; excludes the $250M revolving credit facility.',
      src: [S('The Next Web, Aug 2026', 'https://thenextweb.com/news/castelion-1bn-series-c-13bn-hypersonic-blackbeard'), S('Orrick', 'https://www.orrick.com/en/News/2026/08/Castelion-Raises-1B-Series-C-to-Scale-Production-of-Low-Cost-Hypersonic-Weapons')]
    },
    programs: [
      { name: 'Blackbeard pre-production prototypes', customer: 'US Navy', role: 'Prime', value: '$23.4M', year: 2026, status: 'Prototype', note: '50 pre-production missiles.' },
      { name: 'Blackbeard for Army long-range fires', customer: 'US Army', role: 'Prime', status: 'Development', note: 'Ground-launched variant integrated with HIMARS.' }
    ]
  });

  DTM.add({
    id: 'hermeus', name: 'Hermeus', domain: 'hermeus.com', status: 'private', stage: 'Series C',
    hq: 'Atlanta, GA', country: 'US', founded: 2018,
    subsegments: ['missiles.hypersonics', 'uas.cca'],
    oneLiner: 'Reusable high-Mach uncrewed aircraft (Quarterhorse) on a path to hypersonic flight.',
    description: [
      'Hermeus develops reusable high-speed aircraft, flying a series of Quarterhorse uncrewed test aircraft that step up in speed toward a turbine-based combined-cycle hypersonic vehicle.',
      'It closed a $350M Series C in April 2026 ($200M equity and $150M debt) at a $1B valuation to move from prototypes to mission-ready high-Mach platforms. A related DIU program ceiling was raised to $219M.'
    ],
    leadership: [['AJ Piplica', 'Co-founder & CEO']],
    products: ['Quarterhorse Mk 1', 'Quarterhorse Mk 2', 'Darkhorse'],
    funding: {
      totalUsdM: 500, asOf: '2026-04',
      rounds: [{ date: '2026-04', type: 'Series C', amountUsdM: 350, postUsdM: 1000, leads: ['Khosla Ventures'] }],
      investors: ['Khosla Ventures', 'Founders Fund', 'Canaan Partners', 'RTX Ventures', 'In-Q-Tel', 'Bling Capital'],
      note: 'Series C was $200M equity plus $150M debt. Total reported as "over $500M".',
      src: S('GlobalAir, Apr 2026', 'https://www.globalair.com/articles/hermeus-valued-at-1b-after-closing-350m-in-financing-round/12146')
    },
    programs: [{ name: 'Quarterhorse high-speed flight test', ref: 'hypersonic-test', customer: 'DIU / US Air Force', role: 'Prime', value: '$219M ceiling', year: 2026, status: 'Flight test', src: S('Sacra', 'https://sacra.com/c/hermeus/') }]
  });

  DTM.add({
    id: 'venus-aerospace', name: 'Venus Aerospace', short: 'Venus', domain: 'venusaero.com', status: 'private', stage: 'Series B',
    hq: 'Houston, TX', country: 'US', founded: 2020,
    subsegments: ['missiles.hypersonics', 'missiles.propulsion'],
    oneLiner: 'Rotating detonation rocket engines (RDRE) for hypersonic missiles and aircraft.',
    description: [
      'Venus Aerospace develops rotating detonation rocket engines, which burn propellant in a continuous detonation wave for higher efficiency than conventional rockets, plus air-breathing ramjet integration for hypersonic flight.',
      'It flew an RDRE-powered drone in 2025 and closed a $91M Series B in July 2026 to move the engine from demonstration to production.'
    ],
    leadership: [['Sassie Duggleby', 'Co-founder & CEO'], ['Andrew Duggleby', 'Co-founder & CTO']],
    products: ['RDRE', 'VDR2 ramjet'],
    funding: {
      totalUsdM: 115, asOf: '2026-07',
      rounds: [{ date: '2026-07', type: 'Series B', amountUsdM: 91, leads: ['Mercury Fund'] }],
      investors: ['Mercury Fund', 'Lockheed Martin Ventures', 'MESH', 'PEAK6', 'Draper Associates'],
      note: 'Total of about $115M is a third-party estimate.',
      src: S('TAMradar', 'https://www.tamradar.com/funding-rounds/venus-aerospace-series-b-91m')
    },
    programs: []
  });

  DTM.add({
    id: 'stratolaunch', name: 'Stratolaunch', domain: 'stratolaunch.com', status: 'private', stage: 'PE-owned',
    hq: 'Mojave, CA', country: 'US', founded: 2011,
    subsegments: ['missiles.hypertest'],
    oneLiner: 'Reusable Talon-A hypersonic test vehicles air-launched from the Roc carrier and a modified 747.',
    description: [
      'Stratolaunch provides hypersonic flight testing with Talon-A, an autonomous, reusable vehicle that flies above Mach 5 and lands on a runway. Talon-A is launched from Roc, the largest aircraft by wingspan, and now also from a modified Boeing 747.',
      'Cerberus Capital Management acquired the company in 2019 and refocused it on test services. Talon-A flew hypersonic missions in December 2024, March 2025 and March 2026, the last with the Missile Defense Agency.'
    ],
    leadership: [['Zachary Krevor', 'President & CEO']],
    products: ['Talon-A', 'Roc', 'Spirit of Mojave (747)'],
    funding: { totalUsdM: null, label: 'PE-owned', asOf: '2026-03', note: 'Owned by Cerberus Capital Management since 2019.', src: S('Interesting Engineering', 'https://interestingengineering.com/military/stratolaunch-hypersonic-test-flight-us-mda') },
    programs: [
      { name: 'MDA hypersonic test services', ref: 'hypersonic-test', customer: 'Missile Defense Agency', role: 'Prime', value: '$24.7M', year: 2025, status: 'Flying', note: 'Flew mission FEX-04 for MDA in March 2026.', src: S('Airforce Technology', 'https://www.airforce-technology.com/news/us-mda-awards-research-contract-to-stratolaunch/') },
      { name: 'MACH-TB test campaign', ref: 'hypersonic-test', customer: 'DoD Test Resource Management Center', role: 'Test provider', status: 'Flying' }
    ]
  });

  DTM.add({
    id: 'hypersonix', name: 'Hypersonix Launch Systems', short: 'Hypersonix', domain: 'hypersonix.com', status: 'private', stage: 'Series A',
    hq: 'Brisbane', country: 'AU', founded: 2019,
    subsegments: ['missiles.hypertest', 'missiles.hypersonics'],
    oneLiner: 'Hydrogen-fuelled SPARTAN scramjet; DART AE flew above Mach 5 for DIU in 2026.',
    description: [
      'Hypersonix develops reusable hypersonic vehicles powered by its hydrogen-fuelled SPARTAN scramjet. Its 3.5 m DART AE flew on February 27, 2026 on a Rocket Lab HASTE from Wallops Island and was reported to exceed Mach 5.',
      'It was the first prototype award under the Defense Innovation Unit\'s HyCAT program and is developing a larger second platform, VISR.'
    ],
    products: ['DART AE', 'VISR', 'SPARTAN scramjet'],
    funding: {
      totalUsdM: 30, asOf: '2025-03',
      rounds: [{ date: '2025-03', type: 'Series A', amountUsdM: 30, leads: ['High Tor Capital'] }],
      investors: ['High Tor Capital', 'National Reconstruction Fund Corporation', 'Queensland Investment Corporation', 'Saab', 'RKKVC'],
      note: 'Series A of A$46M, converted at about 0.65 USD per AUD.',
      src: S('SmartCompany', 'https://www.smartcompany.com.au/startupsmart/superfast-plane-startup-hypersonix-raises-46-million-federal-government-tipping-in/')
    },
    programs: [{ name: 'DIU HyCAT (DART AE flight)', ref: 'hypersonic-test', customer: 'Defense Innovation Unit', role: 'Prime', year: 2026, status: 'Flown', src: S('Hypersonix', 'https://hypersonix.com/resources/news/mission-success-australian-hypersonic-pioneer-achieves-first-flight') }]
  });

  DTM.add({
    id: 'kratos', name: 'Kratos Defense & Security', short: 'Kratos', domain: 'kratosdefense.com', status: 'public', ticker: 'KTOS', exchange: 'NASDAQ',
    hq: 'San Diego, CA', country: 'US', founded: 1994,
    subsegments: ['missiles.hypersonics', 'missiles.hypertest', 'uas.cca', 'missiles.propulsion'],
    oneLiner: 'Neo-prime for affordable systems: Valkyrie uncrewed jets, hypersonic test (MACH-TB), engines and rocket motors.',
    description: [
      'Kratos builds affordable, attritable systems at production rates: the XQ-58 Valkyrie uncrewed combat aircraft, target drones, small turbojet engines, solid rocket motors and hypersonic test vehicles. It leads the MACH-TB hypersonic test bed program.',
      'It also supplies satellite ground systems, C5ISR electronics and microwave products. Revenue reached a record $1.35B in 2025 with a record $1.57B backlog.'
    ],
    leadership: [['Eric DeMarco', 'President & CEO']],
    products: ['XQ-58 Valkyrie', 'Erinyes', 'Dark Fury', 'GEK800 engine', 'Zeus SRM'],
    marketCap: { usdM: 8630, asOf: '2026-07-17', src: S('Equibles', 'https://equibles.com/stocks/KTOS') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [
        { label: 'FY2023', revenue: 1037.1 },
        { label: 'FY2024', revenue: 1136.9 },
        { label: 'FY2025', revenue: 1347, opIncome: 25.6, ebitda: 119.9, netIncome: 22.0 }
      ],
      backlog: { valueM: 1573, asOf: '2025-12-31', note: 'Record; $1.23B funded, pipeline $13.7B' },
      notes: '2026 guidance: revenue $1.595B–$1.675B, adjusted EBITDA $157M–$167M.',
      asOf: '2026-02-26', src: S('Kratos FY2025 results', 'https://seekingalpha.com/pr/20409658')
    },
    valuation: { evSales: 6.4, basis: 'Market cap ÷ FY2025 revenue', note: 'EV not compiled; ratio shown uses market cap. Shares fell about two-thirds from their 52-week high by July 2026.', asOf: '2026-07-17', src: S('Equibles', 'https://equibles.com/stocks/KTOS') },
    programs: [
      { name: 'MACH-TB hypersonic test bed', ref: 'hypersonic-test', customer: 'DoD Test Resource Management Center', role: 'Prime', value: '$1.45B ceiling', year: 2024, status: 'Flying' },
      { name: 'XQ-58 Valkyrie', ref: 'cca', customer: 'USMC / USAF', role: 'Prime', status: 'Program of record transition', note: 'Marine Corps program for an uncrewed tactical aircraft.' }
    ]
  });

  /* ---------------- Propulsion & energetics ---------------- */
  DTM.add({
    id: 'ursa-major', name: 'Ursa Major', domain: 'ursamajor.com', status: 'private', stage: 'SPAC pending',
    hq: 'Berthoud, CO', country: 'US', founded: 2015,
    subsegments: ['missiles.propulsion'],
    oneLiner: 'Solid rocket motors and liquid engines built with additive manufacturing; going public via SPAC.',
    description: [
      'Ursa Major makes rocket propulsion at scale: 3D-printed solid rocket motors for tactical missiles and liquid engines (Hadley, Draper) for hypersonic and space applications.',
      'In 2026 it agreed to go public by merging with Bleichroeder Acquisition Corp. III at a $2.3B equity value, with at least $350M of PIPE commitments. Closing is expected in Q1 2027.'
    ],
    leadership: [['Dan Jablonsky', 'CEO']],
    products: ['Lynx SRMs', 'Hadley', 'Draper'],
    funding: {
      totalUsdM: 380, asOf: '2026-06',
      rounds: [{ date: '2025-11', type: 'Series E', amountUsdM: 100, leads: ['Eclipse'] }],
      investors: ['Eclipse', 'Explorer 1 Fund', 'XN', 'Harpoon Ventures'],
      note: 'Series E came with $50M of debt commitments. SPAC deal values the company at $2.3B post-transaction.',
      src: S('GovConWire', 'https://www.govconwire.com/articles/ursa-major-spac-merger-inflection-point-public-listing')
    },
    valuation: { postUsdM: 2300, date: '2026-06', type: 'SPAC (pending)', src: S('GovConWire', 'https://www.govconwire.com/articles/ursa-major-spac-merger-inflection-point-public-listing') },
    programs: [{ name: 'Navy and Army solid rocket motor development', ref: 'srm', customer: 'US Navy / US Army', role: 'Supplier', status: 'Development' }]
  });

  DTM.add({
    id: 'x-bow', name: 'X-Bow Systems', short: 'X-Bow', domain: 'xbowsystems.com', status: 'private', stage: 'Series B',
    hq: 'Houston, TX', country: 'US', founded: 2016,
    subsegments: ['missiles.propulsion', 'missiles.energetics'],
    oneLiner: 'New-entrant solid rocket motor and energetics maker, backed by Lockheed Martin.',
    description: [
      'X-Bow designs and produces solid rocket motors and the energetic materials inside them, aiming to add a third source to a US motor base long dominated by Northrop Grumman and L3Harris (Aerojet Rocketdyne).',
      'Lockheed Martin led the strategic portion of its $105M Series B and works with X-Bow as a second source for GMLRS motors. In 2026 it bought Evolution Space and Spencer Composites and won an $11M Missile Defense Agency motor contract.'
    ],
    leadership: [['Jason Hundley', 'CEO']],
    products: ['Solid rocket motors', 'Bolt sounding rocket', 'Energetics'],
    funding: {
      totalUsdM: 161, asOf: '2025-11',
      rounds: [{ date: '2025-05', type: 'Series B', amountUsdM: 105, leads: ['Lockheed Martin Ventures'] }],
      investors: ['Lockheed Martin Ventures', 'Crosslink Capital', 'Razor\'s Edge Ventures'],
      note: 'Trackers disagree on totals ($161M–$262M); CB Insights figure shown.',
      src: [S('VCA Online, May 2025', 'https://www.vcaonline.com/news/2025051201/x-bow-systems-announces-final-closing-of-over-105-million-series-b-funding-to-deliver-state-of-the-art-defense-technologies-at-speed-and-scale/'), S('CB Insights', 'https://www.cbinsights.com/company/x-bow-launch-systems/financials')]
    },
    programs: [
      { name: 'GMLRS rocket motor second source', ref: 'srm', customer: 'US Army (via Lockheed Martin)', role: 'Supplier', status: 'Qualification' },
      { name: 'MDA solid rocket motor development', ref: 'srm', customer: 'Missile Defense Agency', role: 'Prime', value: '$11M', year: 2026, status: 'Development', src: S('Defence Blog', 'https://defence-blog.com/x-bow-lands-11m-to-build-pentagons-next-rocket-motor/') }
    ]
  });

  DTM.add({
    id: 'firehawk', name: 'Firehawk Aerospace', short: 'Firehawk', domain: 'firehawkaerospace.com', status: 'private', stage: 'Series C-1',
    hq: 'Dallas, TX', country: 'US', founded: 2019,
    subsegments: ['missiles.energetics', 'missiles.propulsion'],
    oneLiner: '3D-printed solid propellant and hybrid rocket motors for missiles and munitions.',
    description: [
      'Firehawk 3D-prints propellant grains, which shortens solid rocket motor production from months to days, and builds hybrid rocket engines for tactical missiles.',
      'Hanwha Defense USA invested in 2025, and a September 2026 report said Firehawk was raising at about a $1.25B valuation, up from roughly $282M in early 2025.'
    ],
    leadership: [['Will Edwards', 'CEO']],
    products: ['3D-printed propellant', 'Hybrid rocket motors'],
    funding: {
      totalUsdM: 60, asOf: '2025-01',
      rounds: [{ date: '2025-01', type: 'Series C-1', amountUsdM: 60, postUsdM: 282 }],
      investors: ['Hanwha Defense USA', '1789 Capital', 'Rochefort Asset Management'],
      note: 'Total shows the 2025 round only. A new round at about $1.25B was reported in talks in September 2026 but is not confirmed.',
      src: [S('Metal AM', 'https://www.metal-am.com/firehawk-oversubscribes-60m-investment-round-and-gains-european-investor/'), S('Sacra', 'https://sacra.com/c/firehawk-aerospace')]
    },
    programs: [{ name: 'Air Force additive propulsion contract', customer: 'US Air Force', role: 'Prime', value: '$4M', status: 'Development', src: S('Dallas Innovates', 'https://dallasinnovates.com/firehawk-aerospace-lands-4m-air-force-contract-for-3d-printed-rocket-propulsion-tech/') }]
  });

  DTM.add({
    id: 'karman', name: 'Karman Space & Defense', short: 'Karman', status: 'public', ticker: 'KRMN', exchange: 'NYSE',
    hq: 'Huntington Beach, CA', country: 'US', founded: 1977,
    subsegments: ['missiles.propulsion', 'missiles.energetics'],
    oneLiner: 'Mission-critical subsystems for missiles, hypersonics and launch: payload protection, interstages, energetics.',
    description: [
      'Karman designs and builds subsystems that sit on almost every major US missile, interceptor and hypersonic program: payload fairings and protection, aerodynamic interstages, propulsion and launch components and energetics.',
      'It listed on the NYSE in February 2025 and has grown quickly with munitions demand. Q2 2026 revenue was a record $182M, up 58%.'
    ],
    leadership: [['Tony Koblinski', 'CEO']],
    products: ['Payload protection systems', 'Interstage systems', 'Propulsion & launch systems'],
    marketCap: { usdM: 6600, asOf: '2026-06-15', src: S('American Companies (SEC data)', 'https://americancompanies.com/company/karman-holdings-inc/') },
    financials: {
      cur: 'USD', fyEnd: 'Dec',
      periods: [{ label: 'FY2024', revenue: 345.3 }, { label: 'FY2025', revenue: 471.5, netIncome: 17.4 }],
      notes: 'Q1 2026 revenue $151.2M (+51%); Q2 2026 $182.1M (+58%). Management guides to about 54% growth in 2026.',
      asOf: '2026-08-06', src: [S('Karman Q2 2026 8-K', 'https://www.sec.gov/Archives/edgar/data/0002040127/000204012726000018/krmn-ex99_1.htm'), S('American Companies (SEC data)', 'https://americancompanies.com/company/karman-holdings-inc/')]
    },
    valuation: { evSales: 14, basis: 'Market cap ÷ FY2025 revenue', note: 'EV not compiled; ratio shown uses market cap.', asOf: '2026-06-15', src: S('American Companies (SEC data)', 'https://americancompanies.com/company/karman-holdings-inc/') },
    programs: [{ name: 'Missile, interceptor and hypersonic subsystems', customer: 'Primes / MDA / US Army / US Navy', role: 'Tier 2 supplier', status: 'Production', note: 'Content on programs such as GMLRS, PAC-3, SM-6 and hypersonic weapons.' }]
  });

  /* ---------------- Low-cost strike ---------------- */
  DTM.add({
    id: 'mach-industries', name: 'Mach Industries', short: 'Mach', status: 'private', stage: 'Series C',
    hq: 'Huntington Beach, CA', country: 'US', founded: 2023,
    subsegments: ['missiles.strike'],
    oneLiner: 'Viper, a jet-powered VTOL one-way strike vehicle, and a distributed manufacturing network (Forge).',
    description: [
      'Mach Industries builds low-cost strike systems, led by Viper, a jet-powered vertical-takeoff one-way strike vehicle targeted at under $100,000 per unit at scale. Its Forge network spreads production across many small factories.',
      'Founder Ethan Thornton started the company at 19. Its valuation rose about 4× in a year to $1.8B in June 2026.'
    ],
    leadership: [['Ethan Thornton', 'Founder & CEO']],
    products: ['Viper', 'Glide', 'Forge'],
    funding: {
      totalUsdM: 485, asOf: '2026-06',
      rounds: [
        { date: '2023-10', type: 'Series A', amountUsdM: 79, postUsdM: 335, leads: ['Bedrock'] },
        { date: '2025-06', type: 'Series B', amountUsdM: 100, postUsdM: 470, leads: ['Khosla Ventures', 'Bedrock'] },
        { date: '2026-06', type: 'Series C', amountUsdM: 300, postUsdM: 1800, leads: ['Infinite Capital', 'Ribbit Capital'] }
      ],
      investors: ['Sequoia', 'Bedrock', 'Khosla Ventures', 'Ribbit Capital', 'Infinite Capital'],
      src: [S('Pulse 2.0, Jun 2026', 'https://pulse2.com/mach-industries-raises-300-million-series-c-at-1-8-billion-valuation'), S('Sacra', 'https://sacra.com/c/mach-industries/')]
    },
    programs: [{ name: 'Low-cost one-way strike prototypes', ref: 'etv', customer: 'DoD', role: 'Prime', status: 'Prototype' }]
  });

  DTM.add({
    id: 'destinus', name: 'Destinus', status: 'private', stage: 'Pre-IPO',
    hq: 'Hoofddorp', country: 'NL', founded: 2021,
    subsegments: ['missiles.strike', 'uas.tactical'],
    oneLiner: 'European long-range strike: Ruta cruise missiles and Hornet drones, with a Rheinmetall joint venture.',
    description: [
      'Destinus started in hydrogen-powered hypersonic aircraft and pivoted to defense, building the Ruta family of low-cost cruise missiles and long-range attack drones that have been used in Ukraine.',
      'Rheinmetall Destinus Strike Systems, a 51/49 joint venture, targets about €1B of missile programs with production from late 2026. Destinus was reported in May 2026 to be seeking €200M ahead of an Amsterdam IPO at a valuation above €5B.'
    ],
    leadership: [['Mikhail Kokorich', 'Founder & CEO']],
    products: ['Ruta Block 2', 'Ruta Block 3', 'Hornet'],
    funding: {
      totalUsdM: 460, asOf: '2026-05',
      rounds: [{ date: '2026-02', type: 'Convertible notes', postUsdM: 1150 }],
      note: 'Company has raised nearly €400M (≈$460M). Early-2026 convertible notes were priced above a €1B valuation. A €200M pre-IPO round targeting more than €5B was reported in talks in May 2026.',
      src: [S('Bloomberg, May 2026', 'https://www.bloomberg.com/news/articles/2026-05-15/weapons-firm-destinus-seeks-200-million-in-pre-ipo-funding'), S('The Next Web', 'https://thenextweb.com/news/destinus-200-million-pre-ipo-cruise-missiles-drones')]
    },
    revenue: { valueUsdM: 575, period: '2026 forecast', kind: 'estimate', note: 'Company forecast of about €500M, as reported', src: S('Bloomberg, May 2026', 'https://www.bloomberg.com/news/articles/2026-05-15/weapons-firm-destinus-seeks-200-million-in-pre-ipo-funding') },
    programs: [
      { name: 'Rheinmetall Destinus Strike Systems (Ruta)', customer: 'European armed forces', role: 'JV partner (49%)', value: '≈€1B (target)', status: 'Pre-production' },
      { name: 'Long-range strike for Ukraine', ref: 'ukraine', customer: 'Ukraine', role: 'Supplier', status: 'Fielded' }
    ]
  });

  /* ---------------- Loitering munitions ---------------- */
  DTM.add({
    id: 'aerovironment', name: 'AeroVironment', short: 'AV', domain: 'avinc.com', status: 'public', ticker: 'AVAV', exchange: 'NASDAQ',
    hq: 'Arlington, VA', country: 'US', founded: 1971,
    subsegments: ['missiles.loitering', 'uas.small', 'cuas.de'],
    oneLiner: 'Switchblade loitering munitions and small UAS, plus BlueHalo\'s lasers, counter-drone and space systems.',
    description: [
      'AV makes the Switchblade loitering munitions and the Puma and Raven small drones used across the US Army and allied forces, including at scale in Ukraine.',
      'The May 2025 acquisition of BlueHalo added the LOCUST laser weapon, Titan counter-UAS, satellite communications and space systems, more than doubling revenue to nearly $2B in fiscal 2026.'
    ],
    leadership: [['Wahid Nawabi', 'Chairman, President & CEO']],
    products: ['Switchblade 300/600', 'Puma', 'JUMP 20', 'P550', 'LOCUST laser', 'Titan C-UAS'],
    marketCap: { usdM: 7412, asOf: '2026-08-28', src: S('Fintel', 'https://fintel.io/s/gb/0hal') },
    financials: {
      cur: 'USD', fyEnd: 'Apr',
      periods: [
        { label: 'FY2024', revenue: 716.7 },
        { label: 'FY2025', revenue: 820.6 },
        { label: 'FY2026', revenue: 1976.8, netIncome: -265.1 }
      ],
      backlog: { valueM: 1200, asOf: '2026-04-30', note: 'Funded backlog; $1.5B unfunded' },
      notes: 'Fiscal 2026 bookings were $2.7B (book-to-bill 1.4). Q1 fiscal 2027 revenue was a record $480.5M.',
      asOf: '2026-06-29', src: S('AV fiscal 2026 results (8-K)', 'https://www.sec.gov/Archives/edgar/data/0001368622/000110465926078824/avav-20260629xex99d1.htm')
    },
    valuation: { evSales: 3.7, basis: 'Market cap ÷ FY2026 revenue', note: 'EV not compiled; ratio shown uses market cap.', asOf: '2026-08-28', src: S('Fintel', 'https://fintel.io/s/gb/0hal') },
    programs: [
      { name: 'Switchblade loitering munitions', ref: 'replicator', customer: 'US Army / USMC / allies', role: 'Prime', status: 'Production', note: 'Switchblade 600 was among the first Replicator selections.' },
      { name: 'Switchblade and Puma in Ukraine', ref: 'ukraine', customer: 'Ukraine', role: 'Supplier', status: 'Fielded' },
      { name: 'LOCUST high-energy laser', customer: 'US Army', role: 'Prime', status: 'Prototype fielding' }
    ]
  });

  DTM.add({
    id: 'helsing', name: 'Helsing', domain: 'helsing.ai', status: 'private', stage: 'Series E',
    hq: 'Munich', country: 'DE', founded: 2021,
    subsegments: ['missiles.loitering', 'software.c2', 'uas.cca', 'maritime.uuv'],
    oneLiner: 'Europe\'s largest defense AI company: HX-2 strike drones, CA-1 Europa combat aircraft and AI for EW and C2.',
    description: [
      'Helsing began as an AI software company, building AI for electronic warfare, sensor fusion and targeting, and has become a hardware maker. It produces the HX-2 AI-enabled strike drone, the SG-1 Fathom underwater glider and the CA-1 Europa autonomous combat aircraft.',
      'Germany approved an initial €269M HX-2 contract in February 2026, with options up to €1.46B. Helsing raised a $1.8B Series E at $18B in July 2026 and is opening a US factory in West Virginia.'
    ],
    leadership: [['Torsten Reil', 'Co-founder & Co-CEO'], ['Gundbert Scherf', 'Co-founder & Co-CEO']],
    products: ['HX-2', 'CA-1 Europa', 'SG-1 Fathom', 'Altra', 'Cirra'],
    funding: {
      totalUsdM: 3300, asOf: '2026-07',
      rounds: [
        { date: '2024-07', type: 'Series C', amountUsdM: 487, postUsdM: 5000, leads: ['General Catalyst'] },
        { date: '2025-06', type: 'Series D', amountUsdM: 690, postUsdM: 13800, leads: ['Prima Materia'] },
        { date: '2026-07', type: 'Series E', amountUsdM: 1800, postUsdM: 18000, leads: ['Dragoneer', 'Lightspeed'] }
      ],
      investors: ['Prima Materia', 'General Catalyst', 'Lightspeed', 'Dragoneer', 'Accel', 'Saab', 'ICONIQ', 'Goldman Sachs Alternatives'],
      note: 'Total is an approximate sum of disclosed rounds. The 2025 round was €600M at roughly €12B.',
      src: [S('Grosswald, Jul 2026', 'https://www.grosswald.org/helsing-1-8-billion-series-e-18-billion-valuation-europe-largest-defence-tech-round/'), S('SiliconANGLE', 'https://siliconangle.com/2026/05/11/german-defense-tech-startup-helsing-talks-1-2b-funding-round')]
    },
    programs: [
      { name: 'HX-2 loitering munitions for the Bundeswehr', customer: 'German Armed Forces', role: 'Prime', value: '€269M (up to €1.46B)', year: 2026, status: 'Production' },
      { name: 'HX-2 for Ukraine', ref: 'ukraine', customer: 'Ukraine', role: 'Supplier', status: 'Fielded' }
    ]
  });
})();
