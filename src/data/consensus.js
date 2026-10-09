/* Street estimates from the public comps sheet the user provided (undated). Values in $M as shown on
   the sheet. Columns: price, mktCap, netCash, ev, sales [CY25E, CY26E], growth % [CY25E, CY26E],
   ebitdaMargin % [CY25E, CY26E], evSales x [CY25E, CY26E], evEbitda x [CY25E, CY26E]. null = NA on the sheet. */
(function () {
  const src = { t: 'Public comps sheet you provided (undated)' };
  const groups = {
    unmanned: { name: 'Unmanned Defense Ecosystem', avg: { growth: [151, 89], evSales: [20.5, 10.5], evEbitda: [51.3, 141.9] } },
    traditional: { name: 'Traditional Defense Tech' }
  };
  const rows = [
    // id, group, ticker on sheet, price, mktCap, netCash, ev, s25, s26, g25, g26, m25, m26, evs25, evs26, eve25, eve26
    ['palladyne-ai', 'unmanned', 'PDYN', 7.96, 379, 20, 359, 6, 12, -20, 94, null, null, 57.5, 29.7, null, null],
    ['nextvision', 'unmanned', 'NXSN-TAE', 64.55, 6114, 74, 6040, 166, 220, 45, 32, 64, 62, 36.3, 27.4, 57.2, 44.4],
    ['ondas', 'unmanned', 'ONDS', 9.02, 3310, 700, 2610, 36, 118, 402, 227, null, null, 72.3, 22.1, null, null],
    ['amprius', 'unmanned', 'AMPX', 11.80, 1791, 17, 1773, 72, 123, 199, 71, null, 5, 24.5, 14.4, null, 270.4],
    ['elsight', 'unmanned', 'ELS-AU', 1.93, 468, 1, 468, 24, 45, 1083, 85, 40, 40, 19.5, 10.5, 48.2, 26.3],
    ['unusual-machines', 'unmanned', 'UMAC', 11.09, 333, 81, 252, 10, 25, 77, 154, null, null, 25.5, 10.1, null, null],
    ['kraken-robotics', 'unmanned', 'PNG-TSX', 4.11, 1299, 50, 1249, 89, 132, 33, 49, 24, 25, 14.1, 9.5, 59.1, 37.9],
    ['mobilicom', 'unmanned', 'MOB', 9.84, 98, 8, 89, 5, 10, 56, 100, null, 2, 17.9, 8.9, null, 449.9],
    ['kratos', 'unmanned', 'KTOS', 77.03, 13290, 47, 13243, 1327, 1587, 17, 20, 9, 10, 10.0, 8.3, 111.8, 82.6],
    ['volatus', 'unmanned', 'FLT-CA', 0.41, 276, -15, 292, 26, 40, 33, 52, null, 1, 11.1, 7.3, null, 746.3],
    ['draganfly', 'unmanned', 'DPRO', 7.52, 155, 50, 105, 6, 15, 29, 148, null, null, 17.0, 6.9, null, null],
    ['eos', 'unmanned', 'EOS-AU', 4.81, 980, -15, 996, 81, 165, -31, 105, null, 11, 12.4, 6.0, null, 54.8],
    ['aerovironment', 'unmanned', 'AVAV', 282.47, 13276, -54, 13330, 1611, 2217, 115, 38, 16, 17, 8.3, 6.0, 51.4, 36.2],
    ['droneshield', 'unmanned', 'DRSHF', 1.28, 1214, 33, 1181, 141, 199, 272, 41, 23, 28, 8.4, 5.9, 35.9, 21.3],
    ['red-cat', 'unmanned', 'RCAT', 8.27, 976, 193, 783, 35, 140, 387, 296, null, null, 22.1, 5.6, null, null],
    ['teledyne', 'unmanned', 'TDY', 513.73, 24421, -2139, 26560, 6074, 6370, 7, 5, 24, 25, 4.4, 4.2, 18.0, 16.6],
    ['redwire', 'unmanned', 'RDW', 7.02, 1186, -233, 1419, 329, 465, 8, 41, null, 8, 4.3, 3.1, null, 36.1],
    ['airo-group', 'unmanned', 'AIRO', 9.71, 308, -28, 336, 95, 134, 9, 41, 12, 11, 3.5, 2.5, 29.0, 21.9],
    ['rtx', 'traditional', 'RTX', 171.52, 234320, -37682, 272002, 86949, 92344, 8, 6, 15, 17, 3.1, 2.9, 20.3, 17.7],
    ['l3harris', 'traditional', 'LHX', 281.65, 53351, -12365, 65716, 21967, 23303, 3, 6, 18, 19, 3.0, 2.8, 16.4, 15.1],
    ['elbit', 'traditional', 'ESLT', 485.24, 23661, -1105, 24766, 7929, 8811, 16, 11, 11, 12, 3.1, 2.8, 28.3, 23.1],
    ['northrop-grumman', 'traditional', 'NOC', 553.56, 79374, -14043, 93417, 41900, 44291, 2, 6, 14, 14, 2.2, 2.1, 15.8, 14.7],
    ['general-dynamics', 'traditional', 'GD', 336.01, 92514, -8979, 101493, 51896, 54323, 9, 5, 12, 13, 2.0, 1.9, 16.2, 14.9],
    ['lockheed-martin', 'traditional', 'LMT', 465.38, 108238, -18935, 127173, 74577, 77882, 5, 4, 12, 14, 1.7, 1.6, 13.7, 11.6],
    ['hii', 'traditional', 'HII', 322.63, 12874, -2628, 15502, 12060, 12684, 5, 5, 8, 9, 1.3, 1.2, 15.8, 14.2]
  ];
  DTM.consensusGroups = groups;
  DTM.consensus = {};
  rows.forEach(([id, group, ticker, price, mktCap, netCash, ev, s25, s26, g25, g26, m25, m26, evs25, evs26, eve25, eve26]) => {
    DTM.consensus[id] = {
      group, ticker, price, mktCap, netCash, ev, undated: true, src,
      sales: [s25, s26], growth: [g25, g26], ebitdaMargin: [m25, m26], evSales: [evs25, evs26], evEbitda: [eve25, eve26]
    };
  });
})();
