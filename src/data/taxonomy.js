/* Segment → subsegment taxonomy. Columns render in this order.
   Subsegment ids are globally unique ("segment.sub") and are what companies reference. */
window.DTM = window.DTM || { companies: [], logos: {} };
DTM.add = function (c) { DTM.companies.push(c); };

DTM.meta = {
  title: 'Defense Tech Market Map',
  edition: 'Q4 2026',
  asOf: '2026-10-09',
  note: 'Curated snapshot compiled in October 2026. Every figure carries its own as-of date and source, and values a company has not disclosed are marked as such. Where a figure is our own calculation or a third-party estimate, the profile says so. Non-USD market caps are converted to USD at approximate 2026 exchange rates.'
};

DTM.segments = [
  {
    id: 'space', code: 'SPC', name: 'Space',
    blurb: 'Launch, spacecraft, and the sensing and maneuvering capabilities that make space a warfighting domain.',
    subsegments: [
      { id: 'space.launch', name: 'Launch', blurb: 'Small, medium and heavy lift, including responsive launch for national security payloads.' },
      { id: 'space.buses', name: 'Satellites & Buses', blurb: 'Spacecraft platforms and satellite manufacturing at constellation scale.' },
      { id: 'space.sda', name: 'Space Domain Awareness', blurb: 'Tracking and characterizing objects and threats in orbit.' },
      { id: 'space.counterspace', name: 'Orbital Intercept & Counterspace', blurb: 'Maneuverable spacecraft for rendezvous, inspection and space control.' },
      { id: 'space.mobility', name: 'In-Space Mobility & Servicing', blurb: 'Orbital transfer vehicles, refueling, docking and on-orbit servicing.' },
      { id: 'space.isr', name: 'Space ISR & Earth Observation', blurb: 'EO, SAR and RF sensing from orbit for intelligence and targeting.' }
    ]
  },
  {
    id: 'missiles', code: 'MSL', name: 'Missiles & Munitions',
    blurb: 'Affordable mass, long-range fires and the propulsion and energetics supply chain behind them.',
    subsegments: [
      { id: 'missiles.propulsion', name: 'Propulsion & Rocket Motors', blurb: 'Solid rocket motors and liquid engines for missiles and interceptors.' },
      { id: 'missiles.hypersonics', name: 'Hypersonics', blurb: 'Hypersonic weapons, test beds and high-speed aircraft.' },
      { id: 'missiles.strike', name: 'Low-Cost Strike & Cruise Missiles', blurb: 'Producible long-range munitions built for volume.' },
      { id: 'missiles.loitering', name: 'Loitering Munitions', blurb: 'One-way attack and loitering strike systems.' },
      { id: 'missiles.energetics', name: 'Energetics & Ordnance', blurb: 'Explosives, propellants and munitions production capacity.' }
    ]
  },
  {
    id: 'uas', code: 'UAS', name: 'Drones & Air Autonomy',
    blurb: 'Uncrewed aircraft from FPV quadcopters to collaborative combat aircraft, and the autonomy stacks that fly them.',
    subsegments: [
      { id: 'uas.small', name: 'Small UAS & FPV', blurb: 'Group 1–2 quadcopters, FPV and short-range reconnaissance drones.' },
      { id: 'uas.tactical', name: 'Tactical & Group 3 UAS', blurb: 'Fixed-wing and VTOL drones for brigade- and division-level ISR.' },
      { id: 'uas.cca', name: 'Collaborative Combat Aircraft', blurb: 'Group 4–5 jet-powered uncrewed aircraft that fly alongside crewed fighters.' },
      { id: 'uas.autonomy', name: 'Autonomy Software', blurb: 'AI pilots, mission autonomy and drone operating systems.' },
      { id: 'uas.components', name: 'Components & Supply Chain', blurb: 'Motors, flight controllers, cameras and NDAA-compliant parts.' }
    ]
  },
  {
    id: 'cuas', code: 'C-UAS', name: 'Counter-UAS & Air Defense',
    blurb: 'Detecting and defeating drones and missiles at a cost per shot that matches the threat.',
    subsegments: [
      { id: 'cuas.kinetic', name: 'Kinetic Interceptors', blurb: 'Hit-to-kill drones, low-cost interceptor missiles and gun-based defeat.' },
      { id: 'cuas.de', name: 'Directed Energy & HPM', blurb: 'High-energy lasers and high-power microwave systems.' },
      { id: 'cuas.sensing', name: 'Detection & Sensing', blurb: 'Radar, RF and acoustic sensing to find and track small drones.' },
      { id: 'cuas.ew', name: 'EW & Cyber Takeover', blurb: 'RF jamming, protocol takeover and other non-kinetic defeat.' }
    ]
  },
  {
    id: 'maritime', code: 'MAR', name: 'Maritime & Ground Robotics',
    blurb: 'Autonomous vessels, undersea systems, ground robots and a rebuilt naval industrial base.',
    subsegments: [
      { id: 'maritime.usv', name: 'Uncrewed Surface Vessels', blurb: 'Autonomous boats from expendable attack craft to ocean-going USVs.' },
      { id: 'maritime.uuv', name: 'Undersea & UUVs', blurb: 'Uncrewed undersea vehicles, seabed sensing and anti-submarine warfare.' },
      { id: 'maritime.ground', name: 'Ground Robotics', blurb: 'Uncrewed ground vehicles and off-road autonomy.' },
      { id: 'maritime.shipbuilding', name: 'Next-Gen Shipbuilding', blurb: 'New shipyards and production systems for naval and autonomous vessels.' }
    ]
  },
  {
    id: 'software', code: 'AI', name: 'Defense Software & AI',
    blurb: 'Command and control, intelligence analytics and the digital backbone of modern forces.',
    subsegments: [
      { id: 'software.c2', name: 'C2 & Battle Management', blurb: 'Command-and-control software that fuses sensors and shooters.' },
      { id: 'software.intel', name: 'Intelligence & Data Fusion', blurb: 'AI for OSINT, all-source analysis and decision support.' },
      { id: 'software.engineering', name: 'Digital Engineering & Simulation', blurb: 'Model-based engineering, test, simulation and wargaming.' },
      { id: 'software.logistics', name: 'Logistics & Readiness', blurb: 'Predictive logistics, supply chain visibility and acquisition analytics.' },
      { id: 'software.cyber', name: 'Cyber', blurb: 'Cyber defense for weapon systems, networks and operational technology.' }
    ]
  },
  {
    id: 'sensors', code: 'SNS', name: 'Sensors, EW & Comms',
    blurb: 'The sensing, spectrum and networking layer every other system depends on.',
    subsegments: [
      { id: 'sensors.radar', name: 'Radar', blurb: 'Software-defined, ESA and multistatic radar.' },
      { id: 'sensors.ew', name: 'Electronic Warfare & SIGINT', blurb: 'Spectrum sensing, jamming and signals intelligence.' },
      { id: 'sensors.comms', name: 'Tactical Comms & Networking', blurb: 'Mesh networking, laser and satellite links for contested environments.' },
      { id: 'sensors.pnt', name: 'PNT & Quantum Sensing', blurb: 'GPS-independent navigation, timing and quantum sensors.' }
    ]
  },
  {
    id: 'industrial', code: 'MFG', name: 'Manufacturing & Energy',
    blurb: 'Factories, materials and power that let the industrial base produce at wartime rates.',
    subsegments: [
      { id: 'industrial.manufacturing', name: 'Advanced Manufacturing', blurb: 'Automated machining, additive and software-defined factories.' },
      { id: 'industrial.materials', name: 'Materials & Critical Minerals', blurb: 'Rare-earth magnets, critical minerals and advanced materials.' },
      { id: 'industrial.nuclear', name: 'Nuclear & Microreactors', blurb: 'Microreactors and naval nuclear power for bases and the fleet.' },
      { id: 'industrial.power', name: 'Power & Batteries', blurb: 'Batteries, fuel cells and expeditionary power.' }
    ]
  },
  {
    id: 'primes', code: 'PRM', name: 'Primes & Mid-Tier',
    blurb: 'Established contractors that integrate the largest programs of record.',
    subsegments: [
      { id: 'primes.us', name: 'US Primes', blurb: 'The largest US defense prime contractors.' },
      { id: 'primes.midtier', name: 'US Mid-Tier & Integrators', blurb: 'Mid-tier hardware makers and government IT and services integrators.' },
      { id: 'primes.europe', name: 'European Primes', blurb: 'Leading UK and European defense groups.' },
      { id: 'primes.apac', name: 'Israel & Asia-Pacific', blurb: 'Major Israeli, Korean, Japanese and Australian defense groups.' }
    ]
  }
];

/* Country → region used by the country filter. */
DTM.regions = [
  { id: 'us', name: 'United States', countries: ['US'] },
  { id: 'uk', name: 'United Kingdom', countries: ['UK'] },
  { id: 'eu', name: 'Europe', countries: ['DE', 'FR', 'IT', 'SE', 'NO', 'FI', 'EE', 'PL', 'NL', 'ES', 'PT', 'DK', 'CH', 'LT', 'UA', 'CZ', 'BE', 'AT'] },
  { id: 'il', name: 'Israel', countries: ['IL'] },
  { id: 'apac', name: 'Asia-Pacific', countries: ['AU', 'NZ', 'JP', 'KR', 'TW', 'SG', 'IN'] },
  { id: 'other', name: 'Canada & other', countries: ['CA'] }
];

DTM.countryNames = {
  US: 'United States', UK: 'United Kingdom', DE: 'Germany', FR: 'France', IT: 'Italy', SE: 'Sweden',
  NO: 'Norway', FI: 'Finland', EE: 'Estonia', PL: 'Poland', NL: 'Netherlands', ES: 'Spain', PT: 'Portugal',
  DK: 'Denmark', CH: 'Switzerland', LT: 'Lithuania', UA: 'Ukraine', CZ: 'Czechia', BE: 'Belgium', AT: 'Austria',
  IL: 'Israel', AU: 'Australia', NZ: 'New Zealand', JP: 'Japan', KR: 'South Korea', TW: 'Taiwan',
  SG: 'Singapore', IN: 'India', CA: 'Canada'
};
