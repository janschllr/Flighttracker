import React, { useState, Suspense } from 'react';
import { Map, Globe } from 'lucide-react';
import { FlightMap } from './FlightMap';
import { useLanguage } from '../i18n/LanguageContext';

const GlobeMap = React.lazy(() => import('./GlobeMap'));

export function FlightMapContainer({ flight }) {
  const { origin, destination } = flight;
  const [is3D, setIs3D] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="relative w-full animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
      {/* Toggle switch — placed OUTSIDE overflow-hidden so it's always visible */}
      <div className="absolute top-3 right-3 z-[1100] flex items-center bg-white/80 dark:bg-stone-900/80 backdrop-blur-md rounded-xl ring-1 ring-stone-200/60 dark:ring-white/15 p-0.5 shadow-lg">
        <button
          onClick={() => setIs3D(false)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 ${
            !is3D
              ? 'bg-white dark:bg-white/15 text-stone-900 dark:text-white shadow-sm'
              : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300'
          }`}
        >
          <Map className="h-3 w-3" />
          {t('mapView2D')}
        </button>
        <button
          onClick={() => setIs3D(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 ${
            is3D
              ? 'bg-white dark:bg-white/15 text-stone-900 dark:text-white shadow-sm'
              : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300'
          }`}
        >
          <Globe className="h-3 w-3" />
          {t('mapView3D')}
        </button>
      </div>

      {/* Map content */}
      <div className="relative rounded-2xl overflow-hidden shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.4)] ring-1 ring-stone-200/50 dark:ring-white/5" style={{ height: '480px' }}>
        {is3D ? (
          <Suspense
            fallback={
              <div className="w-full h-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center">
                <Globe className="h-8 w-8 text-stone-300 dark:text-stone-700 animate-pulse" />
              </div>
            }
          >
            <GlobeMap flight={flight} />
          </Suspense>
        ) : (
          <FlightMap flight={flight} />
        )}
      </div>
    </div>
  );
}
