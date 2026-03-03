// API returns local airport times tagged as UTC — correct to real UTC
export function toRealUtc(isoStr, timezone) {
  if (!isoStr || !timezone) return new Date(isoStr);
  const fakeUtc = new Date(isoStr);
  const utcStr = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', hour: 'numeric', minute: 'numeric', hour12: false }).format(fakeUtc);
  const locStr = new Intl.DateTimeFormat('en-US', { timeZone: timezone, hour: 'numeric', minute: 'numeric', hour12: false }).format(fakeUtc);
  const [uH, uM] = utcStr.split(':').map(Number);
  const [lH, lM] = locStr.split(':').map(Number);
  let offset = (lH * 60 + lM) - (uH * 60 + uM);
  if (offset > 720) offset -= 1440;
  if (offset < -720) offset += 1440;
  return new Date(fakeUtc.getTime() - offset * 60000);
}

// Calculate flight progress as 0–100 percentage
export function getFlightProgress(flight) {
  const now = new Date();
  const departureTime = toRealUtc(
    flight.departure.actual || flight.departure.estimated || flight.departure.scheduled,
    flight.origin.timezone
  );
  const arrivalTime = toRealUtc(
    flight.arrival.actual || flight.arrival.estimated || flight.arrival.scheduled,
    flight.destination.timezone
  );
  const totalDuration = arrivalTime - departureTime;

  if (flight.status === 'Arrived') return 100;
  if (flight.status === 'Cancelled') return 0;
  if (flight.status === 'On Time' && now < departureTime) return 0;
  if (totalDuration <= 0) return 0;

  const elapsed = now - departureTime;
  return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
}
