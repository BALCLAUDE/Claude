/* Maritime & Ground Robotics segment. Anduril, Helsing, Applied Intuition and Scout AI also appear here. */
(function () {
  const S = (t, u) => (u ? { t, u } : { t });

  /* ---------------- Uncrewed surface vessels ---------------- */
  DTM.add({
    id: 'saronic', name: 'Saronic', domain: 'saronic.com', status: 'private', stage: 'Series D',
    hq: 'Austin, TX', country: 'US', founded: 2022,
    subsegments: ['maritime.usv', 'maritime.shipbuilding'],
    oneLiner: 'Autonomous surface vessels from 6 to 150+ feet, and Port Alpha, a $3B+ shipyard for building them.',
    description: [
      'Saronic builds autonomous surface vessels, from the small Spyglass and Corsair to the much larger Marauder, along with the autonomy software that lets them operate in fleets.',
      'It raised $1.75B at $9.25B in March 2026 and is building Port Alpha, a planned $3B+ shipyard in Brownsville, Texas, with first operations expected in 2028. One report put 2025 revenue at just over $200M with 1,300+ employees.'
    ],
    leadership: [['Dino Mavrookas', 'Co-founder & CEO']],
    employees: '1,300+',
    products: ['Corsair', 'Cutlass', 'Marauder', 'Spyglass', 'Port Alpha'],
    funding: {
      totalUsdM: 2600, asOf: '2026-03',
      rounds: [
        { date: '2024-07', type: 'Series B', amountUsdM: 175, postUsdM: 1000 },
        { date: '2025-02', type: 'Series C', amountUsdM: 600, postUsdM: 4000, leads: ['Elad Gil'] },
        { date: '2026-03', type: 'Series D', amountUsdM: 1750, postUsdM: 9250, leads: ['Kleiner Perkins'] }
      ],
      investors: ['Kleiner Perkins', 'Andreessen Horowitz', 'General Catalyst', '8VC', 'Elad Gil', 'Caffeinated Capital'],
      note: 'Total is an approximate sum of disclosed rounds. A secondary-market tracker implied about $15B in July 2026.',
      src: [S('Saronic press release, Mar 2026', 'https://www.aap.com.au/aapreleases/cision20260331ae21888/'), S('StockAnalysis', 'https://stockanalysis.com/private/saronic/')]
    },
    revenue: { valueUsdM: 200, period: 'FY2025', kind: 'estimate', note: 'Single press report', src: S('StockAnalysis / press reports', 'https://stockanalysis.com/private/saronic/') },
    programs: [
      { name: 'Navy autonomous surface vessel prototypes', ref: 'usv-navy', customer: 'US Navy', role: 'Prime', status: 'Production' },
      { name: 'Port Alpha shipyard', customer: 'Company investment (Texas incentive $80M)', role: 'Owner', value: '$3B+', year: 2026, status: 'Construction' }
    ]
  });

  DTM.add({
    id: 'blue-water-autonomy', name: 'Blue Water Autonomy', short: 'Blue Water', domain: 'bluewaterautonomy.com', status: 'private', stage: 'Series A',
    hq: 'Boston, MA', country: 'US', founded: 2024,
    subsegments: ['maritime.usv', 'maritime.shipbuilding'],
    oneLiner: 'Large, ocean-going uncrewed ships designed from the keel up to sail for months without crew.',
    description: [
      'Blue Water Autonomy is designing ship-sized autonomous vessels for long-endurance naval missions, built for reliability without crews aboard rather than converted from crewed designs.',
      'Its first vessel is expected to launch and deliver to the US Navy in the second half of 2026. It raised a $50M Series A led by GV.'
    ],
    leadership: [['Rylan Hamilton', 'Co-founder & CEO']],
    funding: {
      totalUsdM: 64, asOf: '2025-09',
      rounds: [
        { date: '2025-04', type: 'Seed', amountUsdM: 14 },
        { date: '2025-09', type: 'Series A', amountUsdM: 50, leads: ['GV'] }
      ],
      investors: ['GV'],
      src: S('The Robot Report', 'https://www.therobotreport.com/blue-water-autonomy-nets-50m-to-build-autonomous-ships/')
    },
    programs: [{ name: 'First autonomous ship delivery', ref: 'usv-navy', customer: 'US Navy', role: 'Prime', status: 'Building' }]
  });

  DTM.add({
    id: 'saildrone', name: 'Saildrone', domain: 'saildrone.com', status: 'private', stage: 'Series D',
    hq: 'Alameda, CA', country: 'US', founded: 2012,
    subsegments: ['maritime.usv'],
    oneLiner: 'Wind- and solar-powered ocean drones for persistent maritime domain awareness.',
    description: [
      'Saildrone operates long-endurance wind- and solar-powered uncrewed surface vessels that patrol for months, carrying radar, cameras and acoustic sensors for maritime domain awareness and ocean mapping.',
      'Lockheed Martin made a $50M strategic investment to integrate defense payloads.'
    ],
    leadership: [['Richard Jenkins', 'Founder & CEO']],
    products: ['Explorer', 'Voyager', 'Surveyor'],
    funding: {
      totalUsdM: 325, asOf: '2025-10',
      rounds: [{ date: '2025-10', type: 'Strategic', amountUsdM: 50, leads: ['Lockheed Martin'] }],
      investors: ['Lockheed Martin', 'Social Capital', 'Tiger Global', 'Capricorn Investment Group'],
      note: 'Totals vary ($290M–$325M) by tracker. Trackers estimated a valuation near $650M in late 2025.',
      src: [S('Komo', 'https://komo.ai/directory/saildrone-funding'), S('StockAnalysis', 'https://stockanalysis.com/private/saildrone/')]
    },
    programs: [{ name: 'US Navy 5th Fleet unmanned operations', ref: 'usv-navy', customer: 'US Navy', role: 'Service provider', status: 'Operational' }]
  });

  DTM.add({
    id: 'havoc', name: 'Havoc', tags: ['HavocAI'], domain: 'havocai.com', status: 'private', stage: 'Series A',
    hq: 'Providence, RI', country: 'US', founded: 2023,
    subsegments: ['maritime.usv', 'uas.autonomy'],
    oneLiner: 'Collaborative autonomy for swarms of uncrewed boats, expanding to all domains.',
    description: [
      'Havoc (formerly HavocAI) builds autonomy software and low-cost uncrewed boats that operate as coordinated swarms, and is extending its software to air and ground vehicles.',
      'It raised $85M in October 2025 at a $500M valuation, then $100M in May 2026, bringing total capital to about $200M.'
    ],
    leadership: [['Paul Lwin', 'Co-founder & CEO']],
    funding: {
      totalUsdM: 200, asOf: '2026-05',
      rounds: [
        { date: '2025-10', type: 'Series B', amountUsdM: 85, postUsdM: 500, leads: ['B Capital'] },
        { date: '2026-05', type: 'Growth', amountUsdM: 100 }
      ],
      investors: ['B Capital', 'In-Q-Tel', 'Lockheed Martin Ventures', 'Outlander VC', 'Scout VC'],
      note: 'The company labeled its May 2026 round a Series A.',
      src: S('VCA Online, May 2026', 'https://www.vcaonline.com/news/2026051210/havoc-raises-100m-series-a-to-power-the-future-of-all-domain-collaborative-autonomy/')
    },
    programs: []
  });

  /* ---------------- Undersea ---------------- */
  DTM.add({
    id: 'kraken-robotics', name: 'Kraken Robotics', short: 'Kraken', domain: 'krakenrobotics.com', status: 'public', ticker: 'PNG', exchange: 'TSX-V',
    hq: 'St. John\'s, NL', country: 'CA', founded: 2012,
    subsegments: ['maritime.uuv'],
    oneLiner: 'Synthetic aperture sonar, subsea batteries and seabed services for navies and offshore energy.',
    description: [
      'Kraken makes synthetic aperture sonar (SAS) and towed sonar systems for mine countermeasures and seabed warfare, SeaPower subsea batteries for UUVs, and provides subsea survey services.',
      'It agreed to buy Covelya Group for C$615M, with closing expected in Q2 2026, adding scale in underwater sensing.'
    ],
    leadership: [['Greg Reid', 'President & CEO']],
    products: ['KATFISH', 'AquaPix SAS', 'SeaPower batteries'],
    marketCap: { usdM: 1310, local: { cur: 'CAD', valueM: 1800 }, asOf: '2026-09-15', src: S('MarketScreener valuation table', 'https://www.marketscreener.com/quote/stock/KRAKEN-ROBOTICS-INC-111965906/valuation/') },
    financials: {
      cur: 'CAD', fyEnd: 'Dec',
      periods: [{ label: 'FY2023', revenue: 68.5 }, { label: 'FY2024', revenue: 91.0 }, { label: 'FY2025', revenue: 102.2, ebitda: 25.0 }],
      notes: 'A third-party summary of the earnings call cites 2026 revenue guidance of C$165M–$175M.',
      asOf: '2026-03-31', src: S('Kraken 2025 results', 'https://investingnews.com/kraken-robotics-reports-2025-financial-results/')
    },
    valuation: { evSales: 17.6, basis: 'Market cap ÷ FY2025 revenue', note: 'EV not compiled. Market cap is a September 2026 analyst-table estimate; CAD converted at about 0.73.', asOf: '2026-09-15', src: S('MarketScreener', 'https://www.marketscreener.com/quote/stock/KRAKEN-ROBOTICS-INC-111965906/valuation/') },
    programs: [{ name: 'Mine countermeasure sonar for NATO navies', customer: 'NATO navies', role: 'Supplier', status: 'Production' }]
  });

  /* ---------------- Ground robotics ---------------- */
  DTM.add({
    id: 'overland-ai', name: 'Overland AI', domain: 'overland.ai', status: 'private', stage: 'Series B',
    hq: 'Seattle, WA', country: 'US', founded: 2022,
    subsegments: ['maritime.ground'],
    oneLiner: 'Off-road ground autonomy for military vehicles, born from DARPA\'s RACER program.',
    description: [
      'Overland AI builds autonomy for uncrewed ground vehicles in complex off-road terrain, offering the ULTRA autonomous vehicle and the OverDrive kit that adds autonomy to existing vehicles.',
      'Its technology came out of DARPA\'s RACER program. It raised $100M in February 2026, led by 8VC, to double manufacturing capacity.'
    ],
    leadership: [['Byron Boots', 'Co-founder & CEO']],
    products: ['ULTRA', 'OverDrive'],
    funding: {
      totalUsdM: 142, asOf: '2026-02',
      rounds: [
        { date: '2024-09', type: 'Series A', amountUsdM: 32 },
        { date: '2026-02', type: 'Series B', amountUsdM: 100, leads: ['8VC'] }
      ],
      investors: ['8VC', 'Point72 Ventures', 'Ascend VC', 'Shasta Ventures', 'Overmatch Ventures'],
      note: 'The February 2026 round includes a $20M venture debt facility from TriplePoint Capital.',
      src: S('Bloomberg Government', 'https://news.bgov.com/private-equity/overland-ai-raises-100-million-to-help-boost-military-robot-use')
    },
    programs: [{ name: 'DARPA RACER and Army/USMC ground autonomy', customer: 'DARPA / US Army / USMC', role: 'Prime', status: 'Fielding' }]
  });

  DTM.add({
    id: 'forterra', name: 'Forterra', domain: 'forterra.com', status: 'private', stage: 'Series C',
    hq: 'Clarksburg, MD', country: 'US', founded: 2002,
    subsegments: ['maritime.ground', 'uas.autonomy'],
    oneLiner: 'AutoDrive autonomy for military trucks and ROGUE-Fires launchers, plus mesh networking.',
    description: [
      'Forterra, formerly Robotic Research, supplies the AutoDrive autonomy kit used on Army and Marine Corps logistics vehicles and the uncrewed ROGUE-Fires missile launcher, and builds resilient mesh networking for autonomous systems.',
      'It raised a $238M Series C in equity and debt in November 2025, led by Moore Strategic Ventures, and won a Marine Corps award in June 2026.'
    ],
    leadership: [['Josh Araujo', 'CEO']],
    products: ['AutoDrive', 'RemoteDrive'],
    funding: {
      totalUsdM: 238, asOf: '2025-11',
      rounds: [{ date: '2025-11', type: 'Series C', amountUsdM: 238, leads: ['Moore Strategic Ventures'] }],
      investors: ['Moore Strategic Ventures', 'Glynn Capital'],
      note: 'Total shows the Series C (equity and debt) only.',
      src: S('GovConWire', 'https://www.govconwire.com/articles/forterra-raises-238m-series-c-fund-autonomy')
    },
    programs: [
      { name: 'ROGUE-Fires autonomy (with Oshkosh)', customer: 'USMC', role: 'Autonomy provider', status: 'Production' },
      { name: 'Army autonomous transport vehicles', customer: 'US Army', role: 'Autonomy provider', status: 'Development' }
    ]
  });

  DTM.add({
    id: 'arx-robotics', name: 'ARX Robotics', domain: 'arx-robotics.com', status: 'private', stage: 'Series A',
    hq: 'Munich', country: 'DE', founded: 2022,
    subsegments: ['maritime.ground'],
    oneLiner: 'Modular ground robots and the Mithra OS that retrofits autonomy to legacy military vehicles.',
    description: [
      'ARX Robotics builds the modular Gereon ground robots and Mithra OS software, which networks and partially automates existing military vehicle fleets.',
      'In June 2026 it formed a joint venture, ARX Industries, with Ukraine\'s Roboneers to mass-produce the Rys Pro ground robot.'
    ],
    leadership: [['Marc Wietfeld', 'Co-founder & CEO']],
    products: ['Gereon RCS', 'Mithra OS'],
    funding: {
      totalUsdM: 49, asOf: '2025-07',
      rounds: [
        { date: '2025-04', type: 'Series A', amountUsdM: 36, leads: ['HV Capital', 'NATO Innovation Fund'] },
        { date: '2025-07', type: 'Series A ext.', amountUsdM: 13, leads: ['Speedinvest'] }
      ],
      investors: ['HV Capital', 'NATO Innovation Fund', 'Speedinvest'],
      note: '€42M raised in total, converted at about 1.16.',
      src: S('Vestbee', 'https://vestbee.com/blog/articles/arx-robotics-raises-11-m')
    },
    programs: [{ name: 'ARX Industries JV (Rys Pro UGV)', ref: 'ukraine', customer: 'Ukraine', role: 'JV partner', year: 2026, status: 'Production' }]
  });

  /* ---------------- Shipbuilding ---------------- */
  DTM.add({
    id: 'austal', name: 'Austal', domain: 'austal.com', status: 'public', ticker: 'ASB', exchange: 'ASX',
    hq: 'Henderson, WA', country: 'AU', founded: 1988,
    subsegments: ['maritime.shipbuilding'],
    oneLiner: 'Australian shipbuilder with a major US Navy yard in Alabama building cutters, auxiliaries and submarine modules.',
    description: [
      'Austal builds aluminium and steel naval vessels in Australia and, through Austal USA in Mobile, Alabama, for the US Navy and Coast Guard, including Offshore Patrol Cutters, T-AGOS surveillance ships and submarine modules.',
      'Fiscal 2026 revenue topped A$2B, but an onerous-contract provision on US programs pushed the group to an EBIT loss. A bidder made a non-binding US$1.05B–$1.2B offer for the US operations in August 2026.'
    ],
    leadership: [['Paddy Gregg', 'CEO']],
    products: ['Offshore Patrol Cutter', 'T-AGOS', 'Expeditionary Medical Ship', 'Submarine modules'],
    marketCap: { usdM: 1170, local: { cur: 'AUD', valueM: 1806 }, asOf: '2026-08-26', src: S('InvestSMART', 'https://www.investsmart.com.au/security/asx/asb/austal-limited') },
    financials: {
      cur: 'AUD', fyEnd: 'Jun',
      periods: [
        { label: 'FY2024', revenue: 1469.4 },
        { label: 'FY2025', revenue: 1823.3, opIncome: 113.4 },
        { label: 'FY2026', revenue: 2028.9, opIncome: -125.2 }
      ],
      notes: 'Operating income shown is EBIT. Australasian revenue rose 49% to A$650.7M with record EBIT of A$85.3M.',
      asOf: '2026-08-25', src: S('Australian Manufacturing, Aug 2026', 'https://www.australianmanufacturing.com.au/austal-revenue-tops-2b-as-australasian-earnings-reach-record-high/')
    },
    valuation: { evSales: 0.9, basis: 'Market cap ÷ FY2026 revenue', note: 'EV not compiled; ratio shown uses market cap.', asOf: '2026-08-26', src: S('InvestSMART', 'https://www.investsmart.com.au/security/asx/asb/austal-limited') },
    programs: [
      { name: 'Submarine module production', ref: 'aukus', customer: 'US Navy', role: 'Supplier', status: 'Production' },
      { name: 'Offshore Patrol Cutter', customer: 'US Coast Guard', role: 'Prime', status: 'Production' }
    ]
  });
  /* ---------------- Added from the private names list provided for this map (Oct 2026) ---------------- */
  {
    DTM.add({
      id: 'xocean', name: 'XOCEAN', status: 'private', stage: 'Growth', hq: 'Greenore, Co. Louth', country: 'IE', founded: null,
      subsegments: ['maritime.usv'],
      oneLiner: 'Fleet of small uncrewed surface vessels selling ocean survey data for offshore energy and hydrography.',
      description: ['XOCEAN operates a fleet of small uncrewed surface vessels, controlled remotely from shore, that collect seabed and ocean data for offshore wind, oil and gas, hydrography and government customers. It raised €115M in January 2025 from investors including S2G Ventures, Climate Investment and Morgan Stanley\'s 1GT fund, after €30M in June 2024 that included €20M of EIB venture debt.'],
      funding: {
        totalUsdM: 173.7, asOf: '2025-01',
        rounds: [{ date: '2025-01', type: 'Growth', amountUsdM: 118 }],
        note: 'CB Insights total, which includes venture debt.',
        src: [S('ESG Today, Jan 2025', 'https://www.esgtoday.com/xocean-raises-118-million-to-meet-growing-demand-for-blue-economy-data'), S('CB Insights', 'https://www.cbinsights.com/company/xocean')]
      }
    });

    DTM.add({
      id: 'thayermahan', name: 'ThayerMahan', status: 'private', stage: 'Privately held', hq: 'Groton, CT', country: 'US', founded: 2016,
      subsegments: ['maritime.uuv'],
      oneLiner: 'Autonomous maritime sensing for undersea and seabed warfare; $19.3M ONR development contract.',
      description: ['ThayerMahan, founded in Groton, Connecticut in 2016 by Mike Connor and others, builds long-endurance autonomous platforms, acoustic sensors and AI signal processing for maritime surveillance, anti-submarine and seabed warfare, and offers sensing as a service. The Office of Naval Research awarded it a $19.3M contract in October 2023 to develop autonomous mobile maritime systems through October 2027.'],
      leadership: [['Mike Connor', 'Founder']],
      funding: { totalUsdM: null, label: 'Undisclosed', asOf: '2026', src: S('Hartford Business Journal', 'https://hartfordbusiness.com/article/thayermahan-receives-19m-defense-contract-for-maritime-sensing-technology/') },
      programs: [{ name: 'Autonomous Mobile Maritime Systems for tactical surveillance and seabed warfare', customer: 'Office of Naval Research', role: 'Prime', value: '$19.3M', year: 2023, status: 'Development', src: S('Defense Daily', 'https://defensedaily.com/contract-awards/contract-award-thayermahan-inc-groton-connecticut-19296073') }]
    });

    DTM.add({
      id: 'vatn-systems', name: 'Vatn Systems', short: 'Vatn', status: 'private', stage: 'Series A', hq: 'Portsmouth, RI', country: 'US', founded: 2023,
      subsegments: ['maritime.uuv'],
      oneLiner: 'Skelmir modular AUVs and underwater effectors with GPS-free INStinct navigation, built in Rhode Island.',
      description: ['Vatn Systems builds the Skelmir S6 modular underwater effector and the larger Skelmir S12, which combines survey AUV functions with lightweight-torpedo maneuverability, both using its INStinct inertial navigation. It sells to the US Navy and Marine Corps and allies, with Singapore its first international customer. It raised a $60M Series A in December 2025 led by BVVC, bringing total funding to $76.5M.'],
      leadership: [['Nelson Mills', 'CEO']],
      funding: { totalUsdM: 76.5, asOf: '2025-12', rounds: [{ date: '2025-12', type: 'Series A', amountUsdM: 60, leads: ['Bravo Victor Venture Capital'] }], src: S('Pulse 2.0, Dec 2025', 'https://pulse2.com/vatn-systems-60-million-series-a/') }
    });

    DTM.add({
      id: 'bedrock-ocean', name: 'Bedrock Ocean Exploration', short: 'Bedrock', status: 'private', stage: 'Series A', country: 'US', founded: 2020,
      subsegments: ['maritime.uuv'],
      oneLiner: 'Self-built AUVs and a cloud platform for seafloor mapping, starting with offshore wind sites.',
      description: ['Bedrock, founded in 2020 by Anthony DiMare and Charles Chiau, designs its own autonomous underwater vehicles, each costing under $1M, that map the seafloor with sonar and magnetometers for 12-hour missions, and delivers the data through a cloud platform. It focused first on offshore wind. A $25M Series A-2 in June 2025, led by Primary and Northzone, followed a $25.5M Series A in 2023.'],
      leadership: [['Anthony DiMare', 'Co-founder & CEO']],
      funding: { totalUsdM: 60.5, asOf: '2025-06', src: [S('TechCrunch, Jun 2025', 'https://techcrunch.com/2025/06/10/bedrock-ocean-dredges-up-25m-to-map-the-seafloor-with-robots'), S('Robotics 24/7', 'https://robotics247.com/article/bedrock_raises_25.5m_series_a_robots_data_seafloor_exploration_offshore_wind_energy')] }
    });

    DTM.add({
      id: 'sea-machines', name: 'Sea Machines Robotics', short: 'Sea Machines', status: 'private', stage: 'Venture', hq: 'Boston, MA', country: 'US', founded: 2015,
      subsegments: ['maritime.usv'],
      oneLiner: 'Autonomy kits for vessels and STEAMRACER attack craft in the final round of the Navy\'s MASC program.',
      description: ['Sea Machines Robotics makes autonomy and remote-command systems that turn crewed vessels into autonomous or optionally crewed boats, and has turned toward defense since CEO Chip Wasson joined in late 2024. In February 2026 it advanced to the final competitive evaluation for the Navy\'s Modular Attack Surface Craft program with its STEAMRACER-class vessel. Investors include Toyota, Brunswick and Huntington Ingalls Industries.'],
      funding: { totalUsdM: 57.3, asOf: '2024-02', note: 'CB Insights total; other trackers range from $44M to $57M.', src: S('CB Insights', 'https://www.cbinsights.com/investor/sea-machine-robotics') },
      programs: [{ name: 'Modular Attack Surface Craft (final evaluation)', ref: 'usv-navy', customer: 'US Navy', role: 'Prime', year: 2026, status: 'Competing', src: S('Wikipedia: Sea Machines Robotics', 'https://en.wikipedia.org/wiki/Sea_Machines_Robotics') }]
    });

    DTM.add({
      id: 'flux-marine', name: 'Flux Marine', status: 'private', stage: 'Series B', hq: 'Bristol, RI', country: 'US', founded: null,
      subsegments: ['maritime.usv', 'industrial.power'],
      oneLiner: 'High-voltage electric outboards and powertrains, now also sold for uncrewed boats and aerospace.',
      description: ['Flux Marine builds high-voltage electric outboard motors and powertrains, which began as a Princeton engineering project supported by NSF, Air Force and Massachusetts grants. In November 2025 it raised $15M, with Collide Capital joining existing investors, to ramp production and expand technology sales into uncrewed platforms and aerospace; total funding exceeds $30M.'],
      funding: { totalUsdM: 30, asOf: '2025-11', note: 'Company says total funding exceeds $30M since 2020.', src: S('ACCESS Newswire, Nov 2025', 'https://www.accessnewswire.com/newsroom/en/clean-technology/flux-marines-15m-infusion-fuels-production-ramp-to-meet-expanding-order-book-1103879') }
    });

    DTM.add({
      id: 'terradepth', name: 'Terradepth', status: 'private', stage: 'Series A', hq: 'Cedar Park, TX', country: 'US', founded: 2018,
      subsegments: ['maritime.uuv'],
      oneLiner: 'Ocean data platform and AUVs from former Navy SEALs; on a Navy rapid-buy pathway since April 2026.',
      description: ['Terradepth, founded in 2018 by former Navy SEALs Joe Wolfel and Judson Kauffman, combines autonomous underwater vehicles with Absolute Ocean, a cloud platform for subsea data. In April 2026 Absolute Ocean was placed in the Rapid Capabilities Cell Hopper at Naval Information Warfare Center Atlantic, letting a Navy sponsor buy it directly under an OTA for up to 24 months.'],
      funding: { totalUsdM: 28, asOf: '2022', note: '$8M seed (2019) plus a $20M Series A.', src: S('Robotics 24/7', 'https://www.robotics247.com/article/terradepth_raises_series_a_funding_toward_ocean_mapping_service') },
      programs: [{ name: 'NIWC Atlantic Rapid Capabilities Cell Hopper', customer: 'US Navy (NIWC Atlantic)', role: 'Prime', year: 2026, status: 'Eligible', src: S('Defense Forum (Substack)', 'https://defenseforum.substack.com/p/terradepth-at-sea-air-space-2026?open=false') }]
    });

    DTM.add({
      id: 'seasats', name: 'Seasats', domain: 'seasats.com', status: 'private', stage: 'Series A', hq: 'San Diego, CA', country: 'US', founded: 2020,
      subsegments: ['maritime.usv'],
      oneLiner: 'Lightfish solar-powered small autonomous surface vessels; $24M APFIT award to scale production.',
      description: ['Seasats, founded in San Diego in 2020, builds the Lightfish, an 11-foot solar-powered autonomous surface vessel for maritime surveillance, border protection and subsea mapping, which completed a 7,500-mile trans-Pacific mission in 2025. It won a $24M APFIT award on Navy and Marine Corps recommendation in December 2025 and raised a $20M Series A led by Konvoy Ventures in February 2026.'],
      funding: { totalUsdM: 40, asOf: '2026-02', note: 'Pulse 2.0 reports more than $40M raised; the APFIT award is non-dilutive and not included.', src: [S('Pulse 2.0, Feb 2026', 'https://pulse2.com/seasats-20-million-series-a-closed-for-scaling-small-uncrewed-surface-vehicles'), S('Axios, Feb 2025', 'https://www.axios.com/2025/02/05/seasats-lightfish-drones-funding-japan')] },
      programs: [{ name: 'APFIT production award', customer: 'DoD (Navy / Marine Corps recommendation)', role: 'Prime', value: '$24M', year: 2025, status: 'Awarded', src: S('WorkBoat', 'https://www.workboat.com/department-of-war-awards-24-million-to-scale-autonomous-vessels') }]
    });

    DTM.add({
      id: 'maritime-robotics', name: 'Maritime Robotics', status: 'private', stage: 'Growth', hq: 'Trondheim', country: 'NO', founded: null,
      subsegments: ['maritime.usv'],
      oneLiner: 'Norwegian maker of Otter and Mariner uncrewed surface vessels; supplied survey USVs to Ukraine\'s navy.',
      description: ['Maritime Robotics builds uncrewed surface vessels, from the small Otter survey boat to larger platforms, plus autonomy and control systems for civil and defense users. With Teledyne Marine it delivered USVs to Ukraine\'s navy in 2023. Revenue rose 72% to NOK 258.8M in 2025, and in June 2026 it announced a €28M growth investment led by MS+Partners, after $12M in September 2024.'],
      revenue: { valueUsdM: 24.6, period: 'FY2025', kind: 'reported', note: 'NOK 258.8M at about 0.095 USD per NOK', src: S('Baird Maritime', 'https://www.bairdmaritime.com/amp/story/unmanned/unmanned-survey/omnes-capital-maritime-robotics-expansion') },
      funding: { totalUsdM: 44.5, asOf: '2026-06', note: '$12M (Sep 2024) plus €28M (Jun 2026, about $32.5M); earlier funding not compiled.', src: [S('Baird Maritime', 'https://www.bairdmaritime.com/amp/story/unmanned/unmanned-survey/norwegian-unmanned-vehicle-manufacturer-secures-us12-million-capital-for-international-expansion'), S('Baird Maritime', 'https://www.bairdmaritime.com/amp/story/unmanned/unmanned-survey/omnes-capital-maritime-robotics-expansion')] },
      programs: [{ name: 'USVs for Ukraine\'s navy (with Teledyne Marine)', ref: 'ukraine', customer: 'Ukrainian Navy', role: 'Prime', year: 2023, status: 'Delivered', src: S('GPS World', 'https://www.gpsworld.com/maritime-robotics-teledyne-marine-deliver-usvs-to-ukraine') }]
    });

    DTM.add({
      id: 'albacore', name: 'Albacore', status: 'private', stage: 'Seed', hq: 'Philadelphia, PA', country: 'US', founded: 2025,
      subsegments: ['maritime.uuv'],
      oneLiner: 'Ghostfin long-range UUV (about 1,000 nm, 30 days) carrying kinetic payloads; first Navy order in 2026.',
      description: ['Albacore, a 2025 Y Combinator company founded by John Huddleston and Dante Vaisbort, builds Ghostfin, a roughly 8-foot, 425-pound uncrewed underwater vehicle that can stay out for about 30 days and carry a kinetic payload. It raised a $6.5M seed in October 2025 led by Outlander VC, and the US Navy contracted it to buy Ghostfins in August 2026.'],
      funding: { totalUsdM: 6.5, asOf: '2025-10', src: S('Tectonic Defense', 'https://www.tectonicdefense.com/exclusive-yc-backed-albacore-swims-into-6-5m-seed-round/') },
      programs: [{ name: 'Ghostfin procurement', customer: 'US Navy', role: 'Prime', year: 2026, status: 'Awarded', src: S('The Defense Post, Aug 2026', 'https://thedefensepost.com/2026/08/27/us-subsea-drones-albacore/') }]
    });

    DTM.add({
      id: 'ocean-aero', name: 'Ocean Aero', status: 'private', stage: 'Venture', hq: 'Gulfport, MS', country: 'US', founded: 2012,
      subsegments: ['maritime.usv', 'maritime.uuv'],
      oneLiner: 'Triton wind- and solar-powered vessel that sails on the surface and dives; four transferred to the Philippine Navy.',
      description: ['Ocean Aero, founded by US Navy veterans in 2012 and based at the Port of Gulfport, builds Triton, an autonomous vessel powered by wind and sun that sails on the surface and submerges for subsea work. Teledyne and Lockheed Martin are investors. In June 2026 four Tritons, funded by the US, were handed to the Philippine Navy\'s Unmanned Surface Vessel Unit One.'],
      leadership: [['Kevin Decker', 'CEO']],
      funding: { totalUsdM: null, label: 'Undisclosed', asOf: '2022', note: 'A 2022 report cites a $14M investment round; total funding is not disclosed.', src: S('Marine Technology News', 'https://www.marinetechnologynews.com/news/autonomy-subsea-holiday-hybrid-617791') },
      programs: [{ name: 'Tritons for Philippine Navy USV Unit One', customer: 'Philippine Navy (US-funded)', role: 'Prime', year: 2026, status: 'Delivered', src: S('Naval News, Jun 2026', 'https://www.navalnews.com/naval-news/2026/06/u-s-transfers-ocean-aero-tritons-to-philippine-navy-usv-unit/') }]
    });

    DTM.add({
      id: 'kraken-technology', name: 'Kraken Technology Group', short: 'Kraken Technology', status: 'private', stage: 'Series B', hq: 'London', country: 'UK', founded: 2020,
      subsegments: ['maritime.usv'],
      oneLiner: 'K3 Scout high-speed uncrewed boats, 8 m to 18.6 m; a $1B defense unicorn backed by Rheinmetall and NATO.',
      description: ['Kraken Technology Group, founded in 2020 by former powerboat racer Mal Crease, builds the K3 Scout family of high-speed uncrewed surface vessels, from the 8 m Medium (600 kg payload, 55 knots) to the 18.6 m Max with a 2,000 nm range; K3 Scouts have run on NATO exercises. It raised a $175M Series B at a $1B valuation in July 2026 led by DTCP, with Rheinmetall, the NATO Innovation Fund and the British Business Bank.'],
      leadership: [['Mal Crease', 'Founder & CEO']],
      funding: { totalUsdM: 175, asOf: '2026-07', rounds: [{ date: '2026-07', type: 'Series B', amountUsdM: 175, postUsdM: 1000, leads: ['DTCP'] }], note: 'Series B only; a June 2025 strategic round from the NATO Innovation Fund and NSSIF was undisclosed.', src: [S('Tech.eu, Jul 2026', 'https://tech.eu/2026/07/09/maritime-defence-startup-kraken-technology-hits-unicorn-status/'), S('European Security & Defence, Jun 2025', 'https://euro-sd.com/2025/06/major-news/45125/kraken-secures-major-funding/')] }
    });

    DTM.add({
      id: 'blacksea', name: 'BlackSea Technologies', short: 'BlackSea', status: 'private', stage: 'Acquired (AEVEX)', hq: 'Baltimore, MD', country: 'US', founded: 2022,
      subsegments: ['maritime.usv', 'maritime.uuv'],
      oneLiner: 'GARC drone boats for the Navy and underwater fuel systems; acquired by AEVEX for up to $650M in 2026.',
      description: ['BlackSea builds the 16-foot Global Autonomous Reconnaissance Craft (GARC), operated by the Navy\'s Unmanned Surface Vessel Squadron 3 under a contract worth up to $213M, and won a five-year, $256M Navy contract in 2026 for five Seabased Petroleum Distribution Systems built in Baltimore. AEVEX agreed in August 2026 to buy it for up to $650M ($250M cash, $350M stock and a $50M earnout); it is now AEVEX\'s Maritime Division.'],
      leadership: [['Bob Pudney', 'President, AEVEX Maritime']],
      funding: { totalUsdM: null, label: 'Undisclosed', asOf: '2026-08', note: 'Acquired by AEVEX; deal valued at up to $650M.', src: S('Breaking Defense, Aug 2026', 'https://breakingdefense.com/2026/08/aevex-to-acquire-blacksea-technologies-for-up-to-650m/') },
      programs: [
        { name: 'GARC uncrewed surface vessels', ref: 'usv-navy', customer: 'US Navy', role: 'Prime', value: 'Up to $213M', status: 'Production', src: S('The Baltimore Banner', 'https://www.thebanner.com/economy/blacksea-technologies-drone-boats-baltimore-navy-W3UK2NTVKNA7BCT4N7UGYY5QME/') },
        { name: 'Seabased Petroleum Distribution System', customer: 'US Navy', role: 'Prime', value: '$256M', year: 2026, status: 'Awarded', src: S('Tectonic Defense', 'https://www.tectonicdefense.com/blacksea-scores-256m-navy-contract-for-spds/') }
      ]
    });

    DTM.add({
      id: 'martac', name: 'Maritime Tactical Systems', short: 'MARTAC', domain: 'martacsystems.com', status: 'private', stage: 'Privately held', hq: 'Melbourne, FL', country: 'US', founded: 2012,
      subsegments: ['maritime.usv'],
      oneLiner: 'Mantas T-12 and Devil Ray T38 high-speed USVs for the Navy and allies; projects 500% revenue growth in 2026.',
      description: ['MARTAC, founded in 2012 by brothers Bruce and Tom Hanson, builds the Mantas T-12 and Devil Ray T38 high-speed uncrewed surface vessels; a Devil Ray completed a 192-hour autonomous mission for the Naval Air Warfare Center Weapons Division, and Mantas boats have been supplied to the Philippine Navy. It reported record first-half 2026 results, projects 500% revenue growth for 2026, and added production capacity with SŌLACE in September 2026.'],
      funding: { totalUsdM: null, label: 'Undisclosed', asOf: '2026-08', note: 'An aggregator lists about $10M of disclosed funding; not confirmed by the company.', src: S('MARTAC, Aug 2026', 'https://martacsystems.com/2026/08/04/') },
      programs: [{ name: 'Devil Ray T38 autonomous endurance mission', ref: 'usv-navy', customer: 'Naval Air Warfare Center Weapons Division', role: 'Prime', status: 'Complete', src: S('Seapower, Aug 2026', 'https://seapowermagazine.org/27585-2/') }]
    });

    DTM.add({
      id: 'ocean-infinity', name: 'Ocean Infinity', status: 'private', stage: 'Privately held', country: 'UK', founded: null,
      subsegments: ['maritime.uuv', 'maritime.usv'],
      oneLiner: 'Armada fleet of remotely operated robotic ships and AUVs; frontrunner for the UK\'s Atlantic Net ASW service.',
      description: ['Ocean Infinity operates the Armada fleet of 14 remotely operated robotic vessels, completed in December 2025, which deploy AUVs for seabed survey and offshore work. In January 2026 it ordered four more multi-purpose robotic vessels from Vard for over €200M. Janes reports it leads the consortium the UK MoD picked as preferred partner for Atlantic Net, a contractor-run anti-submarine surveillance service in the Greenland-Iceland-UK gap.'],
      funding: { totalUsdM: null, label: 'Undisclosed', asOf: '2026', note: 'Aggregators cite $50M–$69M of disclosed funding; no audited figures are published.', src: S('Janes', 'https://www.janes.com/defence-intelligence-insights/defence-news/defence/ocean-infinity-in-frame-as-uks-atlantic-net-mission-partner') },
      programs: [{ name: 'Atlantic Net undersea surveillance service', customer: 'UK Ministry of Defence / Royal Navy', role: 'Prime', year: 2026, status: 'Preferred bidder', note: 'Contract not yet signed as of the latest reports.', src: S('Janes', 'https://www.janes.com/defence-intelligence-insights/defence-news/defence/ocean-infinity-in-frame-as-uks-atlantic-net-mission-partner') }]
    });

    DTM.add({
      id: 'valstad', name: 'Valstad Shipworks', short: 'Valstad', status: 'private', stage: 'Pre-seed', hq: 'Austin, TX', country: 'US', founded: 2025,
      subsegments: ['maritime.shipbuilding'],
      oneLiner: 'Robotic shipbuilding cells that turn CAD models into welded ship panels and structures automatically.',
      description: ['Valstad Shipworks, founded in 2025, is building robotic factories that combine industrial robots, automated material handling, welding and AI planning software to produce ship panels and structural assemblies directly from CAD models. It is starting by building structures for customers from its Austin facility and raised a $2.6M pre-seed round.'],
      funding: { totalUsdM: 2.6, asOf: '2025', src: S('Signalbase', 'https://www.trysignalbase.com/news/funding/valstad-shipworks-secures-26m-pre-seed-funding-to-revolutionize-shipbuilding-and-maritime-sustainability') }
    });
  }
})();
