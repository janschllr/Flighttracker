// Major world airports: IATA → { lat, lng, timezone }
// timezone = IANA timezone string for Intl.DateTimeFormat
const airports = {
  // Germany
  FRA: { lat: 50.0379, lng: 8.5622, tz: 'Europe/Berlin' },
  MUC: { lat: 48.3538, lng: 11.7861, tz: 'Europe/Berlin' },
  BER: { lat: 52.3667, lng: 13.5033, tz: 'Europe/Berlin' },
  TXL: { lat: 52.5597, lng: 13.2877, tz: 'Europe/Berlin' },
  DUS: { lat: 51.2895, lng: 6.7668, tz: 'Europe/Berlin' },
  HAM: { lat: 53.6304, lng: 9.9882, tz: 'Europe/Berlin' },
  CGN: { lat: 50.8659, lng: 7.1427, tz: 'Europe/Berlin' },
  STR: { lat: 48.6899, lng: 9.2220, tz: 'Europe/Berlin' },
  HAJ: { lat: 52.4611, lng: 9.6850, tz: 'Europe/Berlin' },
  NUE: { lat: 49.4987, lng: 11.0669, tz: 'Europe/Berlin' },
  LEJ: { lat: 51.4324, lng: 12.2416, tz: 'Europe/Berlin' },
  DTM: { lat: 51.5183, lng: 7.6122, tz: 'Europe/Berlin' },

  // UK & Ireland
  LHR: { lat: 51.4700, lng: -0.4543, tz: 'Europe/London' },
  LGW: { lat: 51.1537, lng: -0.1821, tz: 'Europe/London' },
  STN: { lat: 51.8850, lng: 0.2350, tz: 'Europe/London' },
  LTN: { lat: 51.8747, lng: -0.3683, tz: 'Europe/London' },
  MAN: { lat: 53.3537, lng: -2.2750, tz: 'Europe/London' },
  EDI: { lat: 55.9500, lng: -3.3725, tz: 'Europe/London' },
  BHX: { lat: 52.4539, lng: -1.7480, tz: 'Europe/London' },
  DUB: { lat: 53.4213, lng: -6.2701, tz: 'Europe/Dublin' },

  // France
  CDG: { lat: 49.0097, lng: 2.5479, tz: 'Europe/Paris' },
  ORY: { lat: 48.7233, lng: 2.3794, tz: 'Europe/Paris' },
  NCE: { lat: 43.6584, lng: 7.2159, tz: 'Europe/Paris' },
  LYS: { lat: 45.7256, lng: 5.0811, tz: 'Europe/Paris' },
  MRS: { lat: 43.4393, lng: 5.2214, tz: 'Europe/Paris' },
  TLS: { lat: 43.6291, lng: 1.3638, tz: 'Europe/Paris' },

  // Spain & Portugal
  MAD: { lat: 40.4719, lng: -3.5626, tz: 'Europe/Madrid' },
  BCN: { lat: 41.2974, lng: 2.0833, tz: 'Europe/Madrid' },
  PMI: { lat: 39.5517, lng: 2.7388, tz: 'Europe/Madrid' },
  AGP: { lat: 36.6749, lng: -4.4991, tz: 'Europe/Madrid' },
  ALC: { lat: 38.2822, lng: -0.5582, tz: 'Europe/Madrid' },
  LIS: { lat: 38.7813, lng: -9.1359, tz: 'Europe/Lisbon' },
  OPO: { lat: 41.2481, lng: -8.6814, tz: 'Europe/Lisbon' },
  FAO: { lat: 37.0144, lng: -7.9659, tz: 'Europe/Lisbon' },

  // Italy
  FCO: { lat: 41.8003, lng: 12.2389, tz: 'Europe/Rome' },
  MXP: { lat: 45.6306, lng: 8.7281, tz: 'Europe/Rome' },
  LIN: { lat: 45.4451, lng: 9.2774, tz: 'Europe/Rome' },
  VCE: { lat: 45.5053, lng: 12.3519, tz: 'Europe/Rome' },
  NAP: { lat: 40.8860, lng: 14.2908, tz: 'Europe/Rome' },

  // Netherlands, Belgium, Luxembourg
  AMS: { lat: 52.3086, lng: 4.7639, tz: 'Europe/Amsterdam' },
  BRU: { lat: 50.9014, lng: 4.4844, tz: 'Europe/Brussels' },
  LUX: { lat: 49.6233, lng: 6.2044, tz: 'Europe/Luxembourg' },

  // Switzerland & Austria
  ZRH: { lat: 47.4647, lng: 8.5492, tz: 'Europe/Zurich' },
  GVA: { lat: 46.2381, lng: 6.1089, tz: 'Europe/Zurich' },
  VIE: { lat: 48.1103, lng: 16.5697, tz: 'Europe/Vienna' },

  // Scandinavia
  CPH: { lat: 55.6181, lng: 12.6561, tz: 'Europe/Copenhagen' },
  ARN: { lat: 59.6519, lng: 17.9186, tz: 'Europe/Stockholm' },
  OSL: { lat: 60.1939, lng: 11.1004, tz: 'Europe/Oslo' },
  HEL: { lat: 60.3172, lng: 24.9633, tz: 'Europe/Helsinki' },

  // Eastern Europe
  WAW: { lat: 52.1657, lng: 20.9671, tz: 'Europe/Warsaw' },
  PRG: { lat: 50.1008, lng: 14.2600, tz: 'Europe/Prague' },
  BUD: { lat: 47.4298, lng: 19.2611, tz: 'Europe/Budapest' },
  OTP: { lat: 44.5711, lng: 26.0850, tz: 'Europe/Bucharest' },

  // Greece & Turkey
  ATH: { lat: 37.9364, lng: 23.9445, tz: 'Europe/Athens' },
  SKG: { lat: 40.5197, lng: 22.9709, tz: 'Europe/Athens' },
  IST: { lat: 41.2753, lng: 28.7519, tz: 'Europe/Istanbul' },
  SAW: { lat: 40.8986, lng: 29.3092, tz: 'Europe/Istanbul' },
  AYT: { lat: 36.8987, lng: 30.8005, tz: 'Europe/Istanbul' },
  ADB: { lat: 38.2924, lng: 27.1570, tz: 'Europe/Istanbul' },

  // USA — East
  JFK: { lat: 40.6413, lng: -73.7781, tz: 'America/New_York' },
  EWR: { lat: 40.6895, lng: -74.1745, tz: 'America/New_York' },
  LGA: { lat: 40.7769, lng: -73.8740, tz: 'America/New_York' },
  BOS: { lat: 42.3656, lng: -71.0096, tz: 'America/New_York' },
  PHL: { lat: 39.8721, lng: -75.2411, tz: 'America/New_York' },
  IAD: { lat: 38.9531, lng: -77.4565, tz: 'America/New_York' },
  DCA: { lat: 38.8512, lng: -77.0402, tz: 'America/New_York' },
  ATL: { lat: 33.6407, lng: -84.4277, tz: 'America/New_York' },
  MIA: { lat: 25.7959, lng: -80.2870, tz: 'America/New_York' },
  FLL: { lat: 26.0726, lng: -80.1527, tz: 'America/New_York' },
  MCO: { lat: 28.4312, lng: -81.3081, tz: 'America/New_York' },
  CLT: { lat: 35.2140, lng: -80.9431, tz: 'America/New_York' },

  // USA — Central
  ORD: { lat: 41.9742, lng: -87.9073, tz: 'America/Chicago' },
  MDW: { lat: 41.7868, lng: -87.7522, tz: 'America/Chicago' },
  DFW: { lat: 32.8998, lng: -97.0403, tz: 'America/Chicago' },
  IAH: { lat: 29.9902, lng: -95.3368, tz: 'America/Chicago' },
  MSP: { lat: 44.8848, lng: -93.2223, tz: 'America/Chicago' },

  // USA — Mountain & West
  DEN: { lat: 39.8561, lng: -104.6737, tz: 'America/Denver' },
  PHX: { lat: 33.4373, lng: -112.0078, tz: 'America/Phoenix' },
  LAX: { lat: 33.9425, lng: -118.4081, tz: 'America/Los_Angeles' },
  SFO: { lat: 37.6213, lng: -122.3790, tz: 'America/Los_Angeles' },
  SJC: { lat: 37.3626, lng: -121.9290, tz: 'America/Los_Angeles' },
  SEA: { lat: 47.4502, lng: -122.3088, tz: 'America/Los_Angeles' },
  PDX: { lat: 45.5898, lng: -122.5951, tz: 'America/Los_Angeles' },
  LAS: { lat: 36.0840, lng: -115.1537, tz: 'America/Los_Angeles' },
  SAN: { lat: 32.7338, lng: -117.1933, tz: 'America/Los_Angeles' },
  HNL: { lat: 21.3187, lng: -157.9225, tz: 'Pacific/Honolulu' },

  // Canada
  YYZ: { lat: 43.6777, lng: -79.6248, tz: 'America/Toronto' },
  YVR: { lat: 49.1967, lng: -123.1815, tz: 'America/Vancouver' },
  YUL: { lat: 45.4706, lng: -73.7408, tz: 'America/Toronto' },
  YOW: { lat: 45.3225, lng: -75.6692, tz: 'America/Toronto' },
  YYC: { lat: 51.1215, lng: -114.0076, tz: 'America/Edmonton' },

  // Middle East
  DXB: { lat: 25.2532, lng: 55.3657, tz: 'Asia/Dubai' },
  AUH: { lat: 24.4330, lng: 54.6511, tz: 'Asia/Dubai' },
  DOH: { lat: 25.2731, lng: 51.6081, tz: 'Asia/Qatar' },
  RUH: { lat: 24.9576, lng: 46.6988, tz: 'Asia/Riyadh' },
  JED: { lat: 21.6796, lng: 39.1565, tz: 'Asia/Riyadh' },
  TLV: { lat: 32.0055, lng: 34.8854, tz: 'Asia/Jerusalem' },
  AMM: { lat: 31.7226, lng: 35.9932, tz: 'Asia/Amman' },

  // Asia
  HND: { lat: 35.5494, lng: 139.7798, tz: 'Asia/Tokyo' },
  NRT: { lat: 35.7647, lng: 140.3864, tz: 'Asia/Tokyo' },
  PEK: { lat: 40.0799, lng: 116.6031, tz: 'Asia/Shanghai' },
  PVG: { lat: 31.1443, lng: 121.8083, tz: 'Asia/Shanghai' },
  HKG: { lat: 22.3080, lng: 113.9185, tz: 'Asia/Hong_Kong' },
  ICN: { lat: 37.4602, lng: 126.4407, tz: 'Asia/Seoul' },
  SIN: { lat: 1.3644, lng: 103.9915, tz: 'Asia/Singapore' },
  BKK: { lat: 13.6900, lng: 100.7501, tz: 'Asia/Bangkok' },
  KUL: { lat: 2.7456, lng: 101.7099, tz: 'Asia/Kuala_Lumpur' },
  DEL: { lat: 28.5562, lng: 77.1000, tz: 'Asia/Kolkata' },
  BOM: { lat: 19.0896, lng: 72.8656, tz: 'Asia/Kolkata' },
  BLR: { lat: 13.1986, lng: 77.7066, tz: 'Asia/Kolkata' },
  CGK: { lat: -6.1256, lng: 106.6558, tz: 'Asia/Jakarta' },
  MNL: { lat: 14.5086, lng: 121.0198, tz: 'Asia/Manila' },
  TPE: { lat: 25.0797, lng: 121.2342, tz: 'Asia/Taipei' },

  // Oceania
  SYD: { lat: -33.9461, lng: 151.1772, tz: 'Australia/Sydney' },
  MEL: { lat: -37.6690, lng: 144.8410, tz: 'Australia/Melbourne' },
  BNE: { lat: -27.3842, lng: 153.1175, tz: 'Australia/Brisbane' },
  AKL: { lat: -37.0082, lng: 174.7850, tz: 'Pacific/Auckland' },

  // Africa
  JNB: { lat: -26.1392, lng: 28.2460, tz: 'Africa/Johannesburg' },
  CPT: { lat: -33.9715, lng: 18.6021, tz: 'Africa/Johannesburg' },
  CAI: { lat: 30.1219, lng: 31.4056, tz: 'Africa/Cairo' },
  CMN: { lat: 33.3675, lng: -7.5898, tz: 'Africa/Casablanca' },
  NBO: { lat: -1.3192, lng: 36.9278, tz: 'Africa/Nairobi' },
  LOS: { lat: 6.5774, lng: 3.3213, tz: 'Africa/Lagos' },
  ADD: { lat: 8.9779, lng: 38.7993, tz: 'Africa/Addis_Ababa' },

  // South America
  GRU: { lat: -23.4356, lng: -46.4731, tz: 'America/Sao_Paulo' },
  GIG: { lat: -22.8100, lng: -43.2506, tz: 'America/Sao_Paulo' },
  EZE: { lat: -34.8222, lng: -58.5358, tz: 'America/Argentina/Buenos_Aires' },
  SCL: { lat: -33.3930, lng: -70.7858, tz: 'America/Santiago' },
  BOG: { lat: 4.7016, lng: -74.1469, tz: 'America/Bogota' },
  LIM: { lat: -12.0219, lng: -77.1143, tz: 'America/Lima' },
  MEX: { lat: 19.4363, lng: -99.0721, tz: 'America/Mexico_City' },
  CUN: { lat: 21.0365, lng: -86.8771, tz: 'America/Cancun' },
  PTY: { lat: 9.0714, lng: -79.3835, tz: 'America/Panama' },
};

export function getAirportData(iataCode) {
  return airports[iataCode?.toUpperCase()] || null;
}

export default airports;
