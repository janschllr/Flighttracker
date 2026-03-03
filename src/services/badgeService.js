import { getTzOffsetMinutes, getFlightDuration } from '../utils/timeUtils';

const BADGES_KEY = 'flighttracker-badges';
const SEARCH_COUNT_KEY = 'flighttracker-search-count';

// Difficulty: 'easy' | 'medium' | 'hard'
export const BADGE_DEFINITIONS = [
  // --- Easy ---
  { id: 'firstFlight', difficulty: 'easy' },
  { id: 'earlyBird', difficulty: 'easy' },
  { id: 'smoothLanding', difficulty: 'easy' },
  { id: 'shortHop', difficulty: 'easy' },
  // --- Medium ---
  { id: 'nightOwl', difficulty: 'medium' },
  { id: 'redEye', difficulty: 'medium' },
  { id: 'delaySurvivor', difficulty: 'medium' },
  { id: 'equatorCrosser', difficulty: 'medium' },
  { id: 'frequentFlyer', difficulty: 'medium' },
  // --- Hard ---
  { id: 'longHaul', difficulty: 'hard' },
  { id: 'globeTrotter', difficulty: 'hard' },
  { id: 'ghostFlight', difficulty: 'hard' },
  { id: 'jumboJet', difficulty: 'hard' },
  { id: 'antipodean', difficulty: 'hard' },
];

export function loadBadges() {
  try {
    return JSON.parse(localStorage.getItem(BADGES_KEY)) ?? [];
  } catch {
    return [];
  }
}

export function saveBadges(badges) {
  localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
}

export function getSearchCount() {
  try {
    return parseInt(localStorage.getItem(SEARCH_COUNT_KEY) || '0', 10);
  } catch {
    return 0;
  }
}

export function incrementSearchCount() {
  const count = getSearchCount() + 1;
  localStorage.setItem(SEARCH_COUNT_KEY, String(count));
  return count;
}

function getDepHour(flight) {
  const iso = flight.departure?.actual || flight.departure?.estimated || flight.departure?.scheduled;
  if (!iso) return null;
  return parseInt(iso.slice(11, 13), 10);
}

function getArrHour(flight) {
  const iso = flight.arrival?.actual || flight.arrival?.estimated || flight.arrival?.scheduled;
  if (!iso) return null;
  return parseInt(iso.slice(11, 13), 10);
}

// Haversine angular distance in degrees
function angularDistance(lat1, lng1, lat2, lng2) {
  const toRad = (d) => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  let dLng = lng2 - lng1;
  if (dLng > 180) dLng -= 360;
  if (dLng < -180) dLng += 360;
  dLng = toRad(dLng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 180 / Math.PI;
}

const JUMBO_CODES = ['A388', 'B744', 'B748', 'A380', '380', '747'];

export function checkBadges(flight, existingBadges, searchCount) {
  const newBadges = [];
  const earnedIds = new Set(existingBadges.map(b => b.id));

  function earn(id) {
    newBadges.push({ id, flightNumber: flight.flightNumber, earnedAt: new Date().toISOString() });
  }

  const depHour = getDepHour(flight);
  const arrHour = getArrHour(flight);
  const hasTz = flight.origin?.timezone && flight.destination?.timezone;
  const hasCoords = flight.origin?.lat != null && flight.destination?.lat != null;

  // --- Easy ---

  // First Flight: any successful search
  if (!earnedIds.has('firstFlight')) {
    earn('firstFlight');
  }

  // Early Bird: departure 05:00-07:00
  if (!earnedIds.has('earlyBird') && depHour !== null && depHour >= 5 && depHour < 7) {
    earn('earlyBird');
  }

  // Smooth Landing: status is "Arrived"
  if (!earnedIds.has('smoothLanding') && flight.status === 'Arrived') {
    earn('smoothLanding');
  }

  // Short Hop: flight duration < 2 hours (120 min)
  if (!earnedIds.has('shortHop') && hasTz) {
    const duration = getFlightDuration(flight.departure, flight.arrival, flight.origin.timezone, flight.destination.timezone);
    if (duration && duration.totalMinutes > 0 && duration.totalMinutes < 120) {
      earn('shortHop');
    }
  }

  // --- Medium ---

  // Night Owl: departure between 00:00-05:00
  if (!earnedIds.has('nightOwl') && depHour !== null && depHour >= 0 && depHour < 5) {
    earn('nightOwl');
  }

  // Red Eye: departure evening/night (20:00+ or <=02:00), arrival early morning (04:00-08:00)
  if (!earnedIds.has('redEye') && depHour !== null && arrHour !== null) {
    const isNightDep = depHour >= 20 || depHour <= 2;
    const isEarlyArr = arrHour >= 4 && arrHour <= 8;
    if (isNightDep && isEarlyArr) {
      earn('redEye');
    }
  }

  // Delay Survivor: flight is delayed
  if (!earnedIds.has('delaySurvivor') && flight.status === 'Delayed') {
    earn('delaySurvivor');
  }

  // Equator Crosser: origin and destination on opposite sides of equator
  if (!earnedIds.has('equatorCrosser') && hasCoords) {
    if ((flight.origin.lat > 0 && flight.destination.lat < 0) || (flight.origin.lat < 0 && flight.destination.lat > 0)) {
      earn('equatorCrosser');
    }
  }

  // Frequent Flyer: 10 searches
  if (!earnedIds.has('frequentFlyer') && searchCount >= 10) {
    earn('frequentFlyer');
  }

  // --- Hard ---

  // Long Haul Survivor: duration > 12h (720 min)
  if (!earnedIds.has('longHaul') && hasTz) {
    const duration = getFlightDuration(flight.departure, flight.arrival, flight.origin.timezone, flight.destination.timezone);
    if (duration && duration.totalMinutes > 720) {
      earn('longHaul');
    }
  }

  // Globe Trotter: timezone difference > 6 hours
  if (!earnedIds.has('globeTrotter') && hasTz) {
    const depOffset = getTzOffsetMinutes(flight.origin.timezone);
    const arrOffset = getTzOffsetMinutes(flight.destination.timezone);
    if (Math.abs(arrOffset - depOffset) > 360) {
      earn('globeTrotter');
    }
  }

  // Ghost Flight: cancelled flight
  if (!earnedIds.has('ghostFlight') && flight.status === 'Cancelled') {
    earn('ghostFlight');
  }

  // Jumbo Jet: flight on A380 or B747
  if (!earnedIds.has('jumboJet') && flight.aircraft) {
    const code = flight.aircraft.toUpperCase();
    if (JUMBO_CODES.some(j => code.includes(j))) {
      earn('jumboJet');
    }
  }

  // Antipodean: origin and destination > 140° angular distance apart
  if (!earnedIds.has('antipodean') && hasCoords) {
    const dist = angularDistance(flight.origin.lat, flight.origin.lng, flight.destination.lat, flight.destination.lng);
    if (dist > 140) {
      earn('antipodean');
    }
  }

  return newBadges;
}
