export function getTzOffsetMinutes(timezone) {
  try {
    const now = new Date();
    const utcStr = new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).format(now);
    const localStr = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).format(now);

    const [utcH, utcM] = utcStr.split(':').map(Number);
    const [locH, locM] = localStr.split(':').map(Number);

    let diff = (locH * 60 + locM) - (utcH * 60 + utcM);
    if (diff > 720) diff -= 1440;
    if (diff < -720) diff += 1440;
    return diff;
  } catch {
    return 0;
  }
}

export function getBestTime(timeObj) {
  if (!timeObj) return null;
  const raw = timeObj.actual || timeObj.estimated || timeObj.scheduled;
  if (!raw) return null;
  return new Date(raw);
}

export function getFlightDuration(depObj, arrObj, depTz, arrTz) {
  const depTime = getBestTime(depObj);
  const arrTime = getBestTime(arrObj);
  if (!depTime || !arrTime) return null;

  const depOffset = getTzOffsetMinutes(depTz);
  const arrOffset = getTzOffsetMinutes(arrTz);
  const totalMinutes = Math.round((arrTime - depTime) / 60000) - (arrOffset - depOffset);
  if (totalMinutes <= 0) return null;

  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const label = m > 0 ? `${h}h ${m}m` : `${h}h`;
  return { totalMinutes, label };
}

export function getLocalHour(date, timezone) {
  try {
    const hourStr = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false,
    }).format(date);
    return parseInt(hourStr, 10);
  } catch {
    return 12;
  }
}
