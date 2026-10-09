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
    id: 'havoc', name: 'Havoc', domain: 'havocai.com', status: 'private', stage: 'Series A',
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
})();
