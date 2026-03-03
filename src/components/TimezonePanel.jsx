import React, { useEffect, useState } from 'react';
import { Clock, Plane, Sun, Moon, Zap, Lightbulb } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../ThemeContext';
import { getTzOffsetMinutes, getBestTime, getFlightDuration, getLocalHour } from '../utils/timeUtils';

function formatTime(timezone) {
  try {
    return new Intl.DateTimeFormat('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone,
      hour12: false,
    }).format(new Date());
  } catch {
    return '--:--';
  }
}

function formatDate(timezone, locale) {
  try {
    return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      timeZone: timezone,
    }).format(new Date());
  } catch {
    return '--';
  }
}

function getUtcOffset(timezone) {
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

    const hours = Math.floor(Math.abs(diff) / 60);
    const mins = Math.abs(diff) % 60;
    const sign = diff >= 0 ? '+' : '-';
    return `UTC${sign}${hours}${mins ? `:${String(mins).padStart(2, '0')}` : ''}`;
  } catch {
    return 'UTC';
  }
}

function getTimezoneAbbr(timezone) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    }).formatToParts(new Date());
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    return tzPart?.value || '';
  } catch {
    return '';
  }
}


function getTimeDifference(tz1, tz2, t) {
  const diff = getTzOffsetMinutes(tz2) - getTzOffsetMinutes(tz1);
  const hours = Math.round(diff / 60);
  if (hours === 0) return t('sameTimezone') || 'Same timezone';
  const abs = Math.abs(hours);
  const sign = hours > 0 ? '+' : '-';
  return `${sign}${abs}h`;
}


function getJetlagLevel(absHours) {
  if (absHours <= 3) return 'low';
  if (absHours <= 7) return 'medium';
  return 'high';
}


function isTimeDaytime(date, timezone) {
  const hour = getLocalHour(date, timezone);
  return hour >= 6 && hour < 18;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getSleepTip(depTime, arrTime, depTz, arrTz, jetlag, t) {
  if (!depTime || !arrTime) return null;

  const depHour = getLocalHour(depTime, depTz);
  const arrHour = getLocalHour(arrTime, arrTz);
  const isNightDep = depHour >= 21 || depHour < 5;
  const isEveningArr = arrHour >= 18 && arrHour < 23;
  const isMorningArr = arrHour >= 5 && arrHour < 10;
  const isNightArr = arrHour >= 23 || arrHour < 5;
  const isAfternoonArr = arrHour >= 12 && arrHour < 18;
  const flyingEast = jetlag > 0;

  if (isNightDep && isMorningArr) return pickRandom([t('tipNightMorning1'), t('tipNightMorning2'), t('tipNightMorning3')]);
  if (isNightDep) return pickRandom([t('tipNightFlight1'), t('tipNightFlight2'), t('tipNightFlight3')]);
  if (isNightArr) return pickRandom([t('tipArriveNight1'), t('tipArriveNight2'), t('tipArriveNight3')]);
  if (isEveningArr) return pickRandom([t('tipArriveEvening1'), t('tipArriveEvening2'), t('tipArriveEvening3')]);
  if (isMorningArr && flyingEast) return pickRandom([t('tipMorningEast1'), t('tipMorningEast2'), t('tipMorningEast3')]);
  if (isAfternoonArr && !flyingEast) return pickRandom([t('tipAfternoonWest1'), t('tipAfternoonWest2'), t('tipAfternoonWest3')]);
  if (isMorningArr) return pickRandom([t('tipMorningArr1'), t('tipMorningArr2'), t('tipMorningArr3')]);
  return pickRandom([t('tipDay1'), t('tipDay2'), t('tipDay3')]);
}

export function TimezonePanel({ origin, destination, departure, arrival }) {
  const { t, language } = useLanguage();
  const { isDark } = useTheme();
  const [, setTick] = useState(0);

  const hasTz = origin.timezone && destination.timezone;

  useEffect(() => {
    if (!hasTz) return;
    const id = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(id);
  }, [hasTz]);

  if (!hasTz) return null;

  const diff = getTimeDifference(origin.timezone, destination.timezone, t);
  const duration = getFlightDuration(departure, arrival, origin.timezone, destination.timezone);

  const depOffsetMin = getTzOffsetMinutes(origin.timezone);
  const arrOffsetMin = getTzOffsetMinutes(destination.timezone);
  const tzDiffMinutes = arrOffsetMin - depOffsetMin;
  const tzDiffHours = Math.round(Math.abs(tzDiffMinutes) / 60);

  const jetlagLevel = getJetlagLevel(tzDiffHours);

  const depTime = getBestTime(departure);
  const arrTime = getBestTime(arrival);
  const depIsDaytime = depTime ? isTimeDaytime(depTime, origin.timezone) : true;
  const arrIsDaytime = arrTime ? isTimeDaytime(arrTime, destination.timezone) : true;

  const jetlagColors = {
    low: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
    medium: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
    high: 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400',
  };

  const jetlagLabels = {
    low: t('jetlagLow') || 'Low',
    medium: t('jetlagMedium') || 'Medium',
    high: t('jetlagHigh') || 'High',
  };

  const sleepTip = getSleepTip(depTime, arrTime, origin.timezone, destination.timezone, tzDiffMinutes, t);

  const dayColor = isDark ? '#fbbf24' : '#c4a882'; // amber-400 (dark) / sand warm (light)
  const nightColor = isDark ? '#0f172a' : '#1e293b'; // slate-900 / slate-800

  return (
    <div className="rounded-2xl ring-1 ring-stone-200/50 dark:ring-white/5 bg-white/50 dark:bg-white/[0.03] backdrop-blur-sm p-3 flex flex-col gap-2.5 timezone-panel h-full">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Clock className="h-3.5 w-3.5 text-sand-500 dark:text-sand-400" />
        <span className="text-[11px] font-medium text-stone-600 dark:text-stone-400 tracking-wide">
          {t('localTimes') || 'Local Times'}
        </span>
        {diff && (
          <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500 ml-auto">{diff}</span>
        )}
      </div>

      {/* Times side by side */}
      <div className="flex gap-2">
        {/* Origin */}
        <div className="flex-1 rounded-xl bg-sand-50/80 dark:bg-white/[0.04] p-2.5 ring-1 ring-stone-200/30 dark:ring-white/5 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-stone-800 dark:bg-stone-300" />
            <span className="text-[9px] uppercase font-medium tracking-[0.2em] text-stone-500">{t('tzOrigin') || 'Origin'}</span>
          </div>
          <div className="text-base font-semibold text-stone-900 dark:text-white tracking-tight tabular-nums">
            {formatTime(origin.timezone)}
          </div>
          <div className="text-xs font-medium text-stone-700 dark:text-stone-300 mt-1">{origin.code}</div>
          <div className="text-[10px] font-mono text-stone-400 dark:text-stone-500 mt-0.5">
            {getTimezoneAbbr(origin.timezone)} ({getUtcOffset(origin.timezone)})
          </div>
          <div className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5">{formatDate(origin.timezone, language)}</div>
        </div>

        {/* Destination */}
        <div className="flex-1 rounded-xl bg-sand-50/80 dark:bg-white/[0.04] p-2.5 ring-1 ring-stone-200/30 dark:ring-white/5 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-sand-500" />
            <span className="text-[9px] uppercase font-medium tracking-[0.2em] text-stone-500">{t('tzDest') || 'Dest'}</span>
          </div>
          <div className="text-base font-semibold text-stone-900 dark:text-white tracking-tight tabular-nums">
            {formatTime(destination.timezone)}
          </div>
          <div className="text-xs font-medium text-stone-700 dark:text-stone-300 mt-1">{destination.code}</div>
          <div className="text-[10px] font-mono text-stone-400 dark:text-stone-500 mt-0.5">
            {getTimezoneAbbr(destination.timezone)} ({getUtcOffset(destination.timezone)})
          </div>
          <div className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5">{formatDate(destination.timezone, language)}</div>
        </div>
      </div>

      {/* Flight Duration */}
      {duration && (
        <div className="flex items-center gap-2 px-1">
          <Plane className="h-3.5 w-3.5 text-sand-500 dark:text-sand-400" />
          <span className="text-[11px] font-medium text-stone-600 dark:text-stone-400">
            {t('flightDuration') || 'Flight Duration'}
          </span>
          <span className="text-xs font-mono text-stone-500 dark:text-stone-400 ml-auto">{duration.label}</span>
        </div>
      )}

      {/* Timezone Math */}
      {duration && (
        <div className="rounded-xl bg-sand-50/80 dark:bg-white/[0.04] p-2.5 ring-1 ring-stone-200/30 dark:ring-white/5">
          <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
            {tzDiffMinutes === 0
              ? (t('noTzChange') || 'No timezone change')
              : (t('tzMathExplain') || ((change) => `Set your watch ${change} on arrival`))(
                  `${tzDiffMinutes > 0 ? '+' : ''}${Math.round(tzDiffMinutes / 60)}h`
                )
            }
          </p>
        </div>
      )}

      {/* Jetlag Indicator */}
      <div className="flex items-center gap-2 px-1">
        <Zap className="h-3.5 w-3.5 text-sand-500 dark:text-sand-400" />
        <span className="text-[11px] font-medium text-stone-600 dark:text-stone-400">
          {t('jetlag') || 'Jetlag'}
        </span>
        <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${jetlagColors[jetlagLevel]}`}>
          {jetlagLabels[jetlagLevel]}
        </span>
      </div>

      {/* Sleep Tip */}
      {sleepTip && (
        <div className="rounded-xl bg-sand-50/80 dark:bg-white/[0.04] p-2.5 ring-1 ring-stone-200/30 dark:ring-white/5">
          <div className="flex items-center gap-1.5 mb-1">
            <Lightbulb className="h-3 w-3 text-sand-500 dark:text-sand-400" />
            <span className="text-[9px] uppercase font-medium tracking-[0.2em] text-stone-500">
              {t('sleepTip') || 'Pro Tip'}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
            {sleepTip}
          </p>
        </div>
      )}

      {/* Day/Night Arrival */}
      {arrTime && (
        <div className="flex items-center gap-2 px-1">
          {arrIsDaytime
            ? <Sun className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
            : <Moon className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
          }
          <span className="text-[11px] font-medium text-stone-600 dark:text-stone-400">
            {arrIsDaytime
              ? (t('dayArrival') || 'Day arrival')
              : (t('nightArrival') || 'Night arrival')
            }
          </span>
        </div>
      )}

      {/* Day/Night Timeline Bar */}
      {depTime && arrTime && (
        <div className="px-1">
          <div className="flex items-center justify-between text-[9px] uppercase font-medium tracking-[0.15em] text-stone-500 mb-1">
            <span>{t('tzOrigin') || 'Origin'}</span>
            <span>{t('tzDest') || 'Dest'}</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden ring-1 ring-stone-200/30 dark:ring-white/5"
            style={{
              background: `linear-gradient(to right, ${depIsDaytime ? dayColor : nightColor}, ${arrIsDaytime ? dayColor : nightColor})`,
            }}
          />
          <div className="flex items-center justify-between text-[9px] text-stone-400 dark:text-stone-500 mt-1">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: depIsDaytime ? dayColor : nightColor }} />
              {depIsDaytime ? (t('day') || 'Day') : (t('night') || 'Night')}
            </span>
            <span className="flex items-center gap-1">
              {arrIsDaytime ? (t('day') || 'Day') : (t('night') || 'Night')}
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: arrIsDaytime ? dayColor : nightColor }} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
