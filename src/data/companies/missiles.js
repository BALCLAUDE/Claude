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
  /* ---- b2: hypersonics, reentry and hypersonic test (from the hypersonics funding table) ---- */
  {
    const TBL = S('Hypersonics funding table provided for this map (Oct 2026)');

    DTM.add({
      id: 'inversion-space', name: 'Inversion Space', short: 'Inversion', domain: 'inversionspace.com', status: 'private', stage: 'Series A',
      hq: 'Los Angeles, CA', country: 'US', founded: 2021,
      subsegments: ['missiles.hypertest', 'space.stations'],
      oneLiner: 'Arc maneuverable reentry vehicle for cargo delivery from orbit in under an hour and Mach 20+ hypersonic testing.',
      description: [
        'Inversion builds maneuverable reentry spacecraft. Arc, unveiled in October 2025, is a reusable lifting-body vehicle that carries about 500 lb of cargo, has more than 1,000 km of reentry cross-range and targets landings within 50 feet, aiming to deliver supplies anywhere on Earth in under an hour. It can also fly hypersonic test payloads above Mach 20. A subscale demonstrator, Ray, reached orbit on SpaceX Transporter-12 in January 2025 but failed to deorbit.',
        'Inversion raised a $44M Series A in November 2024, co-led by Spark Capital and Adjacent, bringing total funding to $54M, and won a $71M SpaceWERX STRATFI agreement in 2024. In March 2026 AFRL awarded a STRATFI contract for Arc worth up to $38.5M for development, test and demonstration through June 2028. Arc\'s first mission is targeted for 2026.'
      ],
      leadership: [['Justin Fiaschetti', 'Co-founder & CEO'], ['Austin Briggs', 'Co-founder & CTO']],
      products: ['Arc', 'Ray'],
      funding: {
        totalUsdM: 54, roundCount: 7, lastDate: '2025-01', asOf: '2025-01',
        rounds: [{ date: '2024-11', type: 'Series A', amountUsdM: 44, leads: ['Spark Capital', 'Adjacent'] }],
        investors: ['Spark Capital', 'Adjacent', 'Lockheed Martin Ventures', 'Kindred Ventures', 'Y Combinator'],
        note: 'Table total; matches the $54M reported after the $44M Series A and a $10M seed in 2021. Excludes the $71M STRATFI.',
        src: [TBL, S('Boston University Innovate', 'https://www.bu.edu/innovate/inversion-space-founded-by-bu-alums-secures-44m-series-a-to-revolutionize-cargo-delivery')]
      },
      programs: [
        { name: 'Arc STRATFI (point-to-point transportation)', customer: 'AFRL', role: 'Prime', value: 'Up to $38.5M', year: 2026, status: 'Development', note: 'Development, test and demonstration of Arc for in-space and point-to-point operations through June 2028.', src: S('HigherGov', 'https://www.highergov.com/contract/FA238526CB001/') },
        { name: 'SpaceWERX STRATFI', customer: 'US Space Force (SpaceWERX)', role: 'Prime', value: '$71M', year: 2024, status: 'Awarded', note: 'Mix of SpaceWERX, government end-user and private matching funds.', src: S('TechCrunch, Sep 2024', 'https://techcrunch.com/2024/09/10/inversion-space-accelerates-orbital-reentry-vehicle-tech-with-71m-space-force-contract') }
      ]
    });

    DTM.add({
      id: 'hypersonica', name: 'Hypersonica', status: 'private', stage: 'Series A',
      hq: 'Munich', country: 'DE', founded: 2023,
      subsegments: ['missiles.hypersonics'],
      oneLiner: 'German-British startup building hypersonic strike missiles for Europe; its HS1 prototype flew above Mach 6 in Feb 2026.',
      description: [
        'Hypersonica develops hypersonic strike missiles to give European NATO members a sovereign deep precision strike capability. Founded in December 2023 by Oxford doctoral graduates Philipp Kerth and Marc Ewenz, it is based near Munich with a London subsidiary and about 50 staff. It plans short-range systems from 2027 and full glide vehicles by 2029.',
        'On February 3, 2026 its HS1 prototype, flown without a warhead from Andøya Space in Norway, exceeded Mach 6 and 300 km of range, about nine months after the project began. On February 10, 2026 it announced a €23.3M Series A led by Plural, with SPRIND, General Catalyst and 201 Ventures; General Catalyst led its earlier €2.5M seed.'
      ],
      leadership: [['Philipp Kerth', 'Co-founder & CEO'], ['Marc Ewenz', 'Co-founder & CTO']],
      products: ['HS1 prototype'],
      employees: '~50',
      funding: {
        totalUsdM: 30.5, roundCount: 2, lastDate: '2026-02-10', asOf: '2026-02',
        rounds: [{ date: '2026-02', type: 'Series A', amountUsdM: 27, leads: ['Plural'] }],
        investors: ['Plural', 'SPRIND', 'General Catalyst', '201 Ventures'],
        note: 'Table total: a €2.5M seed plus the €23.3M Series A (about $27M at 1.16 USD per EUR).',
        src: [TBL, S('Resilience Media, Feb 2026', 'https://resiliencemedia.co/hypersonica-raises-e23-3m-to-develop-hypersonic-missiles-for-europe')]
      },
      programs: [
        { name: 'HS1 hypersonic flight test', customer: 'Company-funded', role: 'Prime', year: 2026, status: 'Flight test', note: 'Launched from Andøya Space, Norway; exceeded Mach 6 and 300 km.', src: S('Defense News, Feb 2026', 'https://www.defensenews.com/global/europe/2026/02/10/german-startup-aims-to-deliver-european-hypersonic-strike-by-2029/') }
      ]
    });

    DTM.add({
      id: 'longshot-space', name: 'Longshot Space', short: 'Longshot', status: 'private', stage: 'Early',
      hq: 'Alameda, CA', country: 'US', founded: 2020,
      subsegments: ['missiles.hypertest'],
      oneLiner: 'Compressed-gas kinetic launcher offering low-cost hypersonic test shots, with a gun-launched path to orbit as the goal.',
      description: [
        'Longshot builds multi-injection gas guns that accelerate payloads without rockets. Its 120-foot accelerator at a former US Navy cannon facility at Alameda Point is sized for 100 kg payloads at Mach 5 and has made more than 100 shots above Mach 4. Its near-term business is hypersonic testing, which it says it can offer for $150,000 to $250,000 a shot; it is also developing Glowrider, a waverider glide vehicle.',
        'Longshot leased the Alameda site in September 2025 and joined the Air Force\'s AEDC Velocity Alliance test-infrastructure consortium in July 2026. In June 2026 it announced a $5M investment from South Park Commons, which the company says brings total funding to $20M. Longer-range firings in Tonopah, Nevada are planned by the end of 2026.'
      ],
      leadership: [['Mike Grace', 'Co-founder & CEO']],
      products: ['Multi-injection gas gun', 'Glowrider'],
      funding: {
        totalUsdM: 11.5, roundCount: 5, lastDate: '2026-06-23', asOf: '2026-06',
        rounds: [
          { date: '2023-04', type: 'Pre-seed', amountUsdM: 1.5 },
          { date: '2026-06', type: 'Venture', amountUsdM: 5, leads: ['South Park Commons'] }
        ],
        investors: ['South Park Commons'],
        note: 'Table total. The company states total funding of $20M after the June 2026 South Park Commons investment; the difference is not explained.',
        src: [TBL, S('VC Access Online, Jun 2026', 'https://www.vcaonline.com/news/2026062317/longshot-secures-5-million-investment-from-south-park-commons-bringing-total-funding-to-20-million/')]
      },
      programs: [
        { name: 'Air Force TACFI (hypersonic test launcher)', ref: 'hypersonic-test', customer: 'US Air Force', role: 'Prime', year: 2024, status: 'Awarded', note: 'Non-dilutive award that followed earlier Air Force SBIRs.', src: S('TechCrunch, Sep 2024', 'https://techcrunch.com/2024/09/25/longshot-space-closes-over-5m-in-new-funding-to-build-space-gun-in-the-desert') },
        { name: 'AEDC Velocity Alliance', customer: 'US Air Force (Arnold Engineering Development Complex)', role: 'Partner', year: 2026, status: 'Member', src: S('Military & Aerospace Electronics', 'https://www.militaryaerospace.com/home/article/55390092/longshot-joins-usafs-aedc-velocity-alliance-consortium') }
      ]
    });

    DTM.add({
      id: 'specter-aerospace', name: 'Specter Aerospace', short: 'Specter', domain: 'specteraerospace.com', status: 'private', stage: 'Early',
      hq: 'Peabody, MA', country: 'US', founded: 2013,
      subsegments: ['missiles.propulsion', 'missiles.hypersonics'],
      oneLiner: 'Plasma-assisted combustion for ramjet and scramjet engines in hypersonic missiles and supersonic launched effects.',
      description: [
        'Specter, formerly FGC Plasma Solutions, commercializes plasma-assisted combustion, which uses plasma to ignite and stabilize combustion in jet engines. It develops ramjet and scramjet propulsion, vehicle designs and avionics, including a hypersonic demonstrator with a turbine-based combined-cycle engine. Research partners include AFRL, the Army Research Laboratory and MIT.',
        'In June 2023 it disclosed $9.5M of venture and DoD funding, with equity from CS Ventures and Mandala Ventures. In January 2026 AFRL awarded a TACFI contract worth up to $2.0M for concept development and rocket flight tests of a long-range airbreathing effector. In February 2026 it signed an MOU with SNC to develop supersonic aerial launched effects, with flight tests planned for Q3 2026.'
      ],
      leadership: [['Felipe Gomez del Campo', 'Founder & CEO']],
      products: ['Plasma-assisted combustion', 'Supersonic aerial launched effects (with SNC)'],
      funding: {
        totalUsdM: 9.5, roundCount: 2, lastDate: '2023-06-13', asOf: '2023-06',
        investors: ['CS Ventures', 'Mandala Ventures', 'Kairos Ventures'],
        note: 'Table total; matches the $9.5M of venture and DoD funding disclosed in June 2023.',
        src: [TBL, S('Pulse 2.0, Jun 2023', 'https://pulse2.com/specter-aerospace-9-5-million-in-funding/')]
      },
      programs: [
        { name: 'AFRL TACFI long-range airbreathing effector', customer: 'AFRL', role: 'Prime', value: 'Up to $2.0M', year: 2026, status: 'Development', note: 'Concept development, risk reduction and rocket flight tests.', src: S('HigherGov', 'https://www.highergov.com/contract/FA869026CB003/') },
        { name: 'Supersonic aerial launched effects', customer: 'SNC', role: 'Partner', year: 2026, status: 'Development', note: 'MOU signed Feb 2026; Specter supplies ramjet and scramjet propulsion, vehicle design and avionics.', src: S('SNC', 'https://www.sncorp.com/news-archive/snc-specter-aerospace-announce-mou-on-next-gen-supersonic-aerial-launched-effects/') }
      ]
    });

    DTM.add({
      id: 'polaris-spaceplanes', name: 'POLARIS Spaceplanes', short: 'POLARIS', domain: 'polaris-raumflugzeuge.de', status: 'private', stage: 'Seed',
      hq: 'Bremen', country: 'DE', founded: 2019,
      subsegments: ['missiles.hypertest'],
      oneLiner: 'Aerospike-powered spaceplane demonstrators; building the reusable HYTEV hypersonic test vehicle for the Bundeswehr.',
      description: [
        'POLARIS (POLARIS Raumflugzeuge), a 2019 spin-off from the German Aerospace Center (DLR) founded by Alexander Kopp, develops horizontal-takeoff spaceplanes powered by its own linear aerospike rocket engines. In late 2024 it ignited its AS-1 aerospike engine in flight on the MIRA II demonstrator. Its planned AURORA spaceplane targets hypersonic transport and launching up to 1,000 kg to low Earth orbit.',
        'Germany\'s procurement office BAAINBw funded aerospike engine work in April 2023 and the design of HYTEV, a two-stage, fully reusable hypersonic test vehicle, in February 2025. In January 2026 it contracted POLARIS to build and flight-test HYTEV, which must be flight-ready by the end of 2027. A €5.4M seed top-up in June 2025 brought total funding to €12.4M.'
      ],
      leadership: [['Alexander Kopp', 'Founder']],
      products: ['MIRA II', 'AS-1 aerospike engine', 'HYTEV', 'AURORA'],
      funding: {
        totalUsdM: 6.1, roundCount: 5, lastDate: '2025-06-12', asOf: '2025-06',
        rounds: [{ date: '2025-06', type: 'Seed extension', amountUsdM: 6.3, leads: ['Capnamic Ventures', 'Spacewalk VC'] }],
        investors: ['Capnamic Ventures', 'Spacewalk VC', 'Dienes Holding', 'E2MC Ventures', 'MBB Bremen'],
        note: 'Table total. European Spaceflight reports €12.4M (about $14.4M at 1.16 USD per EUR) raised in total after the €5.4M June 2025 top-up, so the table may count only that round.',
        src: [TBL, S('European Spaceflight, Jun 2025', 'https://europeanspaceflight.com/?p=4764')]
      },
      programs: [
        { name: 'HYTEV build and flight test', customer: 'BAAINBw (German Bundeswehr)', role: 'Prime', year: 2026, status: 'Development', note: 'Must be flight-ready by end of 2027; value not disclosed.', src: S('The Aviationist, Jan 2026', 'https://theaviationist.com/2026/01/29/germany-reusable-hypersonic-vehicle-polaris/') },
        { name: 'HYTEV design', customer: 'BAAINBw (German Bundeswehr)', role: 'Prime', year: 2025, status: 'Awarded' },
        { name: 'Linear aerospike engine development', customer: 'BAAINBw (German Bundeswehr)', role: 'Prime', year: 2023, status: 'Awarded' }
      ]
    });

    DTM.add({
      id: 'canopy-aerospace', name: 'Canopy Aerospace & Defense', short: 'Canopy', status: 'private', stage: 'Acquired (Trive Capital)',
      hq: 'Littleton, CO', country: 'US', founded: 2021,
      subsegments: ['missiles.energetics', 'missiles.hypertest'],
      oneLiner: 'Ceramic tiles and transpiration-cooled thermal protection for reentry and hypersonic vehicles; now owned by Trive Capital.',
      description: [
        'Canopy Aerospace was founded in 2021 in Littleton, Colorado, to make thermal protection systems for spacecraft and hypersonic vehicles. Under a Space Act Agreement with NASA Ames it learned to manufacture Shuttle-era ceramic tiles (AETB) and black glass coating (RCG), and it is developing additively manufactured, transpiration-cooled silicon carbide TPS with embedded sensors.',
        'The Air Force awarded it $2.8M of TPS contracts in 2024. In September 2025 Dallas private equity firm Trive Capital combined Canopy with Hera Technologies and MSM Industries of Los Angeles to form Canopy Aerospace & Defense, led by CEO Marco Villa, a former SpaceX mission operations director. It has since acquired Aviotec and Tods Technology.'
      ],
      leadership: [['Marco Villa', 'CEO']],
      products: ['AETB ceramic tiles', 'RCG coating', 'Transpiration-cooled TPS'],
      funding: {
        totalUsdM: 3.6, roundCount: 5, lastDate: '2022-09-12', asOf: '2022-09',
        note: 'Table total through Sep 2022. In Sep 2025 Trive Capital combined Canopy with Hera Technologies and MSM Industries to form Canopy Aerospace & Defense; terms were not disclosed.',
        src: [TBL, S('Dallas Innovates, Sep 2025', 'https://dallasinnovates.com/dallas-trive-capital-forms-canopy-aerospace-defense-out-of-3-companies-in-greater-l-a-and-denver/')]
      },
      programs: [
        { name: 'Air Force TPS development contracts', customer: 'US Air Force / AFRL', role: 'Prime', value: '$2.8M', year: 2024, status: 'Development', note: 'Includes transpiration-cooled TPS and reentry health-monitoring work.', src: S('Payload', 'https://payloadspace.com/air-force-invests-in-canopys-thermal-protection-tech') },
        { name: 'Shuttle tile technology transfer (Space Act Agreement)', customer: 'NASA Ames Research Center', role: 'Partner', status: 'Active', src: S('NASA Spinoff', 'https://spinoff.nasa.gov/node/11542') }
      ]
    });

    DTM.add({
      id: 'new-frontier-aerospace', name: 'New Frontier Aerospace', short: 'New Frontier', domain: 'nfaero.com', status: 'private', stage: 'Early',
      hq: 'Kent, WA', country: 'US', founded: 2020,
      subsegments: ['missiles.propulsion', 'missiles.hypersonics'],
      oneLiner: '3D-printed methane Mjölnir engine to power Pathfinder, a hypersonic drone for weapons testing and point-to-point cargo.',
      description: [
        'New Frontier Aerospace, founded in 2020 by former NASA official Bill Bruner with ex-Blue Origin BE-3 lead David Gregory and former DARPA spaceplane manager Jess Sponable, develops Mjölnir, a 3D-printed full-flow staged-combustion engine burning liquid oxygen and liquefied natural gas. It will power Pathfinder, an uncrewed hypersonic VTOL aircraft for weapons testing and later point-to-point cargo, and the Bifröst orbital transfer vehicle.',
        'Mjölnir first fired on July 18, 2024, followed by hot-fire campaigns in 2025 backed by the Defense Innovation Unit\'s National Security Innovation Capital program and NASA. The company won a $3M Direct-to-Phase-II SBIR in 2025 and now also sells the engine on its own. Pathfinder hover tests are planned for 2026 and a Bifröst flight no earlier than 2027.'
      ],
      leadership: [['Bill Bruner', 'Co-founder & CEO'], ['Alex Tai', 'Chairman']],
      products: ['Mjölnir engine', 'Pathfinder', 'Bifröst'],
      funding: {
        totalUsdM: null, label: 'Undisclosed', roundCount: 1, lastDate: '2024-10-07', asOf: '2024-10',
        note: 'Table lists one round (Oct 2024) with no disclosed amount. Government support includes DIU National Security Innovation Capital funding and a $3M SBIR.',
        src: [TBL, S('GeekWire, Jun 2025', 'https://www.geekwire.com/2025/new-frontier-aerospace-tests-3d-printed-rocket-engine/')]
      },
      programs: [
        { name: 'Mjölnir engine (DIU National Security Innovation Capital)', customer: 'Defense Innovation Unit', role: 'Prime', status: 'Hot-fire testing', src: S('The Defense Post, Jun 2025', 'https://thedefensepost.com/2025/06/25/us-3d-printed-hypersonic-engine/amp/') },
        { name: 'Direct-to-Phase-II SBIR', customer: 'US DoD', role: 'Prime', value: '$3M', year: 2025, status: 'Awarded', src: S('Aerospace America', 'https://aerospaceamerica.aiaa.org/new-frontier-aerospace-plans-sales-of-3d-printed-hypersonic-rocket-engine/') }
      ]
    });

    DTM.add({
      id: 'gohypersonic', name: 'GoHypersonic', domain: 'gohypersonic.com', status: 'private', stage: 'Privately held',
      hq: 'Dayton, OH', country: 'US', founded: 2006,
      subsegments: ['missiles.hypertest', 'missiles.propulsion'],
      oneLiner: 'Scramjet engines and hypersonic propulsion-airframe integration for flight-test vehicles, near AFRL in Dayton.',
      description: [
        'GoHypersonic Inc. develops scramjet engines and hypersonic propulsion-airframe integration, describing itself as a vertically integrated developer of hypersonic technologies and advanced military systems that works with aerospace R&D labs, prime contractors and the Defense Department. It is based in Dayton, Ohio, home of the Air Force Research Laboratory, with offices in Minneapolis and Virginia.',
        'It was one of the companies that pitched at the Air Force\'s first Hypersonics Pitch Day in November 2019. It has not disclosed any outside funding.'
      ],
      products: ['Scramjet engines', 'Hypersonic flight-test vehicles'],
      funding: { totalUsdM: null, label: 'Undisclosed', asOf: '2026-10', note: 'The table lists no rounds, and none have been disclosed. The founding year comes from a business-data profile.', src: [TBL, S('GoHypersonic', 'https://gohypersonic.com/')] },
      programs: [
        { name: 'Air Force Hypersonics Pitch Day', customer: 'US Air Force', role: 'Prime', year: 2019, status: 'Pitched', src: S('Janes, Nov 2019', 'https://www.janes.com/defence-news/news-detail/seven-companies-receive-us-air-force-hypersonics-pitch-day-contracts') }
      ]
    });

    DTM.add({
      id: 'space-engine-systems', name: 'Space Engine Systems', short: 'SES', status: 'private', stage: 'Self-funded',
      hq: 'Edmonton', country: 'CA', founded: 2012,
      subsegments: ['missiles.hypertest', 'missiles.propulsion'],
      oneLiner: 'DASS GNX multi-fuel turbo-ramjet and the Hello-1X Mach 5 demonstrator, a reusable hypersonic test aircraft.',
      description: [
        'Space Engine Systems, founded in Edmonton in 2012 by president and CTO Pradeep Dass, develops the DASS GNX, an air-breathing turbo-ramjet that runs on jet fuel, methane or blends of up to 100% hydrogen. It powers the Hello series of reusable, horizontal take-off Mach 5 spaceplanes, starting with the Hello-1X, a piloted demonstrator with an uncrewed option designed to reach Mach 5 at 32 km.',
        'In 2023 the company said it was integrating the first DASS GNX into a completed Hello-1X airframe and was funding the program itself; the first flight has since slipped. It has facilities in Alberta, the US and Cornwall, UK.'
      ],
      leadership: [['Pradeep Dass', 'Founder, President & CTO']],
      products: ['DASS GNX engine', 'Hello-1X', 'Hello series spaceplanes'],
      funding: {
        totalUsdM: null, label: 'Undisclosed', asOf: '2026-10',
        note: 'The table lists no rounds; the company has described the Hello-1X program as self-funded.',
        src: [TBL, S('Aviation Week, Paris Air Show 2023', 'https://ngtest.aviationweek.com/shownews/paris-air-show/canadian-firm-built-hypersonic-vehicle-scraps-sexbomb-name')]
      },
      programs: [
        { name: 'Hello-1X Mach 5 demonstrator', customer: 'Company-funded', role: 'Prime', status: 'Development', note: 'First DASS GNX engine being integrated into the Hello-1X airframe as of 2023.', src: S('Interesting Engineering, 2023', 'https://interestingengineering.com/innovation/ses-hello-spaceplanes-drops-sexbomb') }
      ]
    });
  }
  /* ---- b3: loitering munitions, small turbojets, low-cost missiles ---- */
  {
    const MSL = S('Missile funding table provided for this map (data through Nov 2025)');

    DTM.add({
      id: 'uvision', name: 'UVision Air', short: 'UVision', domain: 'uvisionuav.com', status: 'private', stage: 'Owner-controlled',
      hq: 'Emek Hefer', country: 'IL', founded: 2011,
      subsegments: ['missiles.loitering'],
      oneLiner: 'Hero loitering munitions; Hero-120 is built in the US with Mistral Inc. for the Army\'s up-to-$982M Lethal Unmanned Systems IDIQ.',
      description: [
        'UVision designs the Hero family of canister-launched loitering munitions, which Globes reports are sold to more than 30 armies. In the US it works through Mistral Inc. as prime contractor, with Hero-120 production at UVision USA\'s Virginia site and a SAIC plant. In November 2025 it acquired SpearUAV, maker of the Viper encapsulated loitering systems.',
        'In September 2025 the US Army awarded Mistral a sole-source, five-year IDIQ worth up to $982M for Hero-120, and in August 2026 placed a follow-on delivery order of more than $50M after the first lot acceptance tests. Owner Aaron Frenkel was reported in June 2026 to be preparing a Nasdaq IPO at about $3.5B; it had not listed as of late-August reports.'
      ],
      leadership: [['Ran Gozali', 'CEO']],
      products: ['Hero-120', 'Hero-120SF', 'Hero-90', 'SpearUAV Viper'],
      employees: '250+',
      funding: {
        totalUsdM: null, label: 'Undisclosed', asOf: '2026-08',
        investors: ['Aaron Frenkel (owner)'],
        note: 'No outside rounds disclosed. Aaron Frenkel bought the company in 2011 for an estimated $110M and funded it with shareholder loans; a planned Nasdaq IPO led by JPMorgan targeted $500M–$1B at about $3.5B pre-money, per Israeli press.',
        src: [MSL, S('Globes', 'https://en.globes.co.il/en/article-1001546503'), S('Calcalist', 'https://www.calcalistech.com/ctechnews/article/s13czwrzfe'), S('Global Defense Corp, Jun 2026', 'https://www.globaldefensecorp.com/2026/06/24/israeli-suicide-drone-maker-uvision-targets-3-5-billion-nasdaq-listing/')]
      },
      programs: [
        { name: 'Hero-120 for Army Lethal Unmanned Systems', customer: 'US Army', role: 'Sub', value: 'Up to $982M (5-yr IDIQ)', year: 2025, status: 'Production', note: 'Mistral Inc. is prime; UVision is design authority. Systems are built in the US.', src: S('EDR Magazine', 'https://www.edrmagazine.eu/mistral-inc-and-uvision-inc-secure-a-982-million-multi-year-idiq-contract-with-the-u-s-army-for-hero-120-loitering-munition-system') },
        { name: 'Hero-120 follow-on delivery order', customer: 'US Army', role: 'Sub', value: '>$50M', year: 2026, status: 'Awarded', note: 'Placed in Aug 2026, a day after the first lot acceptance tests.', src: S('Soldier Systems Daily, Aug 2026', 'https://soldiersystems.net/2026/08/06/mistral-inc-and-uvision-receive-an-additional-order-under-us-army-lethal-unmanned-systems-program/') },
        { name: 'Hero-120SF for special operations', customer: 'USSOCOM', role: 'Sub', value: '$73.5M', year: 2024, status: 'Production', note: 'Mistral is prime; work runs to 2029.', src: S('The Defense Post, Jun 2024', 'https://www.thedefensepost.com/2024/06/06/us-hero-loitering-munitions/') },
        { name: 'Organic Precision Fires-Mounted (OPF-M)', customer: 'USMC', role: 'Sub', year: 2021, status: 'Awarded', note: 'Hero-120 supplied via Mistral for LAV, JLTV and LRUSV integration.', src: S('Janes', 'https://www.janes.com/defence-intelligence-insights/defence-news/hero-120-loitering-munition-selected-for-usmc-opf-m-system-requirement') }
      ]
    });

    DTM.add({
      id: 'beehive-industries', name: 'Beehive Industries', short: 'Beehive', domain: 'beehive-industries.com', status: 'private', stage: 'Privately held',
      hq: 'Denver, CO', country: 'US', founded: 2020,
      subsegments: ['missiles.propulsion', 'uas.components'],
      oneLiner: '3D-printed Frenzy turbojets for low-cost cruise missiles and drones, funded by the Air Force\'s affordable mass munitions effort.',
      description: [
        'Beehive designs and additively manufactures small jet engines for cruise missiles and uncrewed aircraft. Its lead product is the 200 lbf Frenzy 8 turbojet, with a 100 lbf Frenzy 6 in development and a roughly 1,000 lbf Rampart turbofan aimed at uncrewed combat aircraft. It prints engines at facilities in Colorado and Knoxville, Tennessee.',
        'The Air Force awarded $12.46M in October 2024 for Frenzy testing and $29.7M in April 2026 to integrate, flight test and qualify Frenzy 8 under the Small Expendable Turbine effort of the Family of Affordable Mass Munitions. In June 2026 Beehive ordered 30 more EOS metal printers (over $50M), and in July 2026 it announced a $70M, 200-job expansion in southwest Ohio.'
      ],
      leadership: [['Gordie Follin', 'Chief Product Officer'], ['David Kimball', 'Chief Technology Officer']],
      products: ['Frenzy 8', 'Frenzy 6', 'Rampart'],
      funding: {
        totalUsdM: null, label: 'Undisclosed', asOf: '2026-07',
        note: 'No equity round has been publicly disclosed. Caplight lists about $42M raised, with the US Air Force (grants and contracts) as the only listed investor.',
        src: [MSL, S('Caplight', 'https://www.caplight.com/company/beehive-industries')]
      },
      programs: [
        { name: 'Small Expendable Turbine (FAMM): Frenzy 8 qualification', ref: 'etv', customer: 'USAF (AFLCMC)', role: 'Prime', value: '$29.7M', year: 2026, status: 'Development', note: 'Also funds a first Frenzy 6 test engine, with flight demonstration options.', src: S('Air & Space Forces Magazine', 'https://www.airandspaceforces.com/air-force-contract-beehive-small-disposable-jet-engines/') },
        { name: 'Frenzy engine test contract', customer: 'US Air Force', role: 'Prime', value: '$12.46M', year: 2024, status: 'Tested', note: 'Four Frenzy engines tested by Sep 2025; high-altitude tests completed Dec 2025.', src: S('Janes', 'https://www.janes.com/defence-intelligence-insights/defence-news/defence/afa-2025-beehive-industries-brings-3d-printed-engines-to-missile-uav-market') }
      ]
    });

    DTM.add({
      id: 'aeon-industries', name: 'Aeon Industrial', short: 'Aeon', domain: 'aeonindustrial.com', status: 'private', stage: 'Seed',
      hq: 'Austin, TX', country: 'US', founded: 2023,
      subsegments: ['missiles.strike'],
      oneLiner: 'Zeus, a ~$50K guided mini-missile for shoulder or vehicle launch, built in Austin with in-house motors and propellant.',
      description: [
        'Aeon builds Zeus, a modular, software-defined guided mini-missile of about 20 lb that can be shoulder-fired, vehicle-mounted or launched in salvos, paired with its ODIN targeting software. The company mixes its own propellant and makes its own rocket motors, fuzes and flight computers, prices Zeus at about $50,000 and targets more than 10,000 units a year.',
        'In April 2025 the Army Applications Laboratory and T2COM contracted Aeon for a Zeus modular payload and electronic safe-and-arm device; it later completed all-up live-fire tests. It has teamed with GTS on warheads and cruise missile co-production and with X-Bow on missiles and rocket motors (September 2025). In September 2026 its low-cost interceptor bid with Destinus was named an Army xTech|Apex Intercept finalist.'
      ],
      leadership: [['Naweed Tahmas', 'Co-founder & CEO']],
      products: ['Zeus', 'ODIN'],
      funding: {
        totalUsdM: 18.6, asOf: '2026-04',
        rounds: [{ date: '2025-03', type: 'Seed', amountUsdM: 12 }],
        investors: ['Quiet Capital', 'Silent Ventures', '1789 Capital'],
        note: 'Table lists NA. Trade press in April 2026 reported $18.6M raised in total; a VC database lists a $12M seed in March 2025.',
        src: [MSL, S('World Defense News, Apr 2026', 'https://www.thedefensenews.com/Aeon-Unveils-50000-Zeus-Modular-Guided-Missile-System-as-Low-Cost-Tactical-Precision-Weapon/'), S('VC Backed', 'https://www.vcbacked.co/company/aeon')]
      },
      programs: [
        { name: 'Zeus modular payload and safe-and-arm device', customer: 'US Army (AAL / T2COM)', role: 'Prime', year: 2025, status: 'Live-fire tested', src: S('Axios, Apr 2025', 'https://www.axios.com/2025/04/30/aeon-army-rocket-launcher-black-flag/') },
        { name: 'xTech|Apex Intercept low-cost interceptor (with Destinus)', customer: 'US Army', role: 'Prime', year: 2026, status: 'Finalist', note: 'One of 10 Topic 1 finalists; finalist status is not a procurement award.', src: S('Defence Industry Europe, Sep 2026', 'https://defence-industry.eu/destinus-says-joint-aeon-proposal-reaches-u-s-army-low-cost-interceptor-finals-to-augment-patriot-air-and-missile-defense-missions/') },
        { name: 'Warheads and low-cost cruise missile co-production', customer: 'Global Technical Systems', role: 'Partner', status: 'Partnership', src: S('Tectonic', 'https://www.tectonicdefense.com/exclusive-aeon-teams-up-with-gts-on-new-warheads-and-missiles/') },
        { name: 'Tactical missiles and solid rocket motors', customer: 'X-Bow Systems', role: 'Partner', year: 2025, status: 'MOU', src: S('Axios, Sep 2025', 'https://www.axios.com/2025/09/09/aeon-xbow-missile-partnership-texas/') }
      ]
    });
  }
})();
