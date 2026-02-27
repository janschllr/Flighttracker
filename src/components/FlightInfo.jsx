import React, { useState } from 'react';
import { Plane, Info } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

import { getAircraftName } from '../data/aircrafts';

export function FlightInfo({ flight }) {
  const { t } = useLanguage();
  const [logoError, setLogoError] = useState(false);

  if (!flight) return null;

  const aircraftCode = flight.aircraft;
  const aircraftLabel = getAircraftName(flight.aircraft);
  const logoUrl = flight.airlineIata
    ? `https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/${flight.airlineIata}.svg`
    : null;

  return (
    <div className="mt-4 max-w-5xl mx-auto px-4 animate-fade-in-up stagger-5" style={{ opacity: 0 }}>
      <div className="rounded-2xl ring-1 ring-stone-200/50 dark:ring-white/5 bg-white/50 dark:bg-white/[0.03] backdrop-blur-sm p-4 flex flex-col sm:flex-row items-center gap-4">
        {/* Airline Logo */}
        <div className="flex items-center justify-center w-20 h-14 rounded-xl bg-white dark:bg-white/10 ring-1 ring-stone-200/30 dark:ring-white/5 p-2 shrink-0">
          {logoUrl && !logoError ? (
            <img
              src={logoUrl}
              alt={flight.airline}
              className="max-w-full max-h-full object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <Plane className="h-6 w-6 text-stone-400" />
          )}
        </div>

        {/* Info Grid */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 flex-1 min-w-0">
          {/* Airline */}
          <div>
            <div className="text-[9px] uppercase font-bold tracking-[0.2em] text-stone-400 mb-0.5">
              {t('airline') || 'Airline'}
            </div>
            <div className="text-sm font-display font-700 text-stone-800 dark:text-stone-200">
              {flight.airline}
            </div>
          </div>

          {/* Flight Number */}
          <div>
            <div className="text-[9px] uppercase font-bold tracking-[0.2em] text-stone-400 mb-0.5">
              {t('flight')}
            </div>
            <div className="text-sm font-mono font-bold text-stone-800 dark:text-stone-200">
              {flight.flightNumber}
            </div>
          </div>

          {/* Aircraft */}
          {aircraftCode && (
            <div>
              <div className="text-[9px] uppercase font-bold tracking-[0.2em] text-stone-400 mb-0.5">
                {t('aircraft') || 'Aircraft'}
              </div>
              <div className="text-sm text-stone-800 dark:text-stone-200 flex items-baseline gap-1.5">
                <span className="font-mono font-bold">{aircraftCode}</span>
                {aircraftLabel !== aircraftCode && (
                  <span className="text-stone-400 dark:text-stone-500 text-xs">{aircraftLabel}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
