import React, { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { FlightTicket } from './components/FlightTicket';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { ThemeProvider } from './ThemeContext';
import { FlightMapContainer } from './components/FlightMapContainer';
import { TimezonePanel } from './components/TimezonePanel';
import { FlightInfo } from './components/FlightInfo';
import { searchFlight } from './services/flightService';
import { loadBadges, saveBadges, checkBadges, incrementSearchCount } from './services/badgeService';
import { BadgeNotification } from './components/BadgeNotification';
import { BadgeTrophyCase } from './components/BadgeTrophyCase';
import { AlertCircle, Search, MapPin, Route, Trophy, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

const CACHE_KEY = 'flighttracker-flight';
const CACHE_VERSION = 2; // bump to invalidate old cache
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const RECENT_KEY = 'flighttracker-recent';

function loadRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) ?? [];
  } catch {
    return [];
  }
}

function addToRecent(flightNumber, current) {
  const upper = flightNumber.toUpperCase();
  const updated = [upper, ...current.filter(f => f !== upper)].slice(0, 5);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  return updated;
}

function saveToCache(flightNumber, data) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    flightNumber: flightNumber.toUpperCase(),
    data,
    timestamp: Date.now(),
    version: CACHE_VERSION,
  }));
}

function loadFromCache(flightNumber) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { flightNumber: cached, data, timestamp, version } = JSON.parse(raw);
    if (version !== CACHE_VERSION) return null;
    if (cached !== flightNumber.toUpperCase()) return null;
    if (Date.now() - timestamp > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

const stepIcons = [Search, MapPin, Route];

function AppContent() {
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentFlights, setRecentFlights] = useState(loadRecent);
  const [brandColor, setBrandColor] = useState(null);
  const [badges, setBadges] = useState(loadBadges);
  const [newBadge, setNewBadge] = useState(null);
  const [showTrophyCase, setShowTrophyCase] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const ticketRef = React.useRef(null);
  const { t } = useLanguage();

  const initialFlight = new URLSearchParams(window.location.search).get('flight') ?? '';

  const handleDownload = async () => {
    if (!ticketRef.current || !flight) return;
    setIsGenerating(true);
    setIsCapturing(true);

    // Wait one frame for React to re-render with isCapturing=true
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    try {
      const el = ticketRef.current;
      const canvas = await html2canvas(el, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
        logging: false,
        allowTaint: false,
      });
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `boarding-pass-${flight.flightNumber}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (err) {
      console.error('Failed to generate boarding pass:', err);
    } finally {
      setIsCapturing(false);
      setIsGenerating(false);
    }
  };

  const handleSearch = async (flightNumber) => {
    setLoading(true);
    setError(null);
    setFlight(null);
    setHasSearched(true);
    setBrandColor(null);

    try {
      const result = await searchFlight(flightNumber);
      if (result) {
        setFlight(result);
        const url = new URL(window.location);
        url.searchParams.set('flight', flightNumber.toUpperCase());
        history.pushState({}, '', url);
        saveToCache(flightNumber, result);
        setRecentFlights(prev => addToRecent(flightNumber, prev));
        // Check for new badges
        const searchCount = incrementSearchCount();
        const currentBadges = loadBadges();
        const earned = checkBadges(result, currentBadges, searchCount);
        if (earned.length > 0) {
          const updated = [...currentBadges, ...earned];
          saveBadges(updated);
          setBadges(updated);
          setNewBadge(earned[0]);
        }
      } else {
        setError(t('flightNotFound')(flightNumber));
      }
    } catch (err) {
      if (err.message === 'MISSING_API_KEY') {
        setError(
          <span>
            {t('missingApiKey')} <code className="bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded font-mono text-sm">{t('missingApiKeyFile')}</code> {t('missingApiKeyWith')}
            <code className="bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded font-mono text-sm ml-1">VITE_AVIATION_STACK_KEY=your_api_key_here</code>
          </span>
        );
      } else {
        setError(`${t('errorPrefix')} ${err.message}. ${t('errorSuffix')}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialFlight) return;
    const cached = loadFromCache(initialFlight);
    if (cached) {
      setFlight(cached);
      setHasSearched(true);
    } else {
      handleSearch(initialFlight);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="grain min-h-screen bg-sand-50 dark:bg-[#1a1816] text-stone-800 dark:text-stone-200 font-body">
      {/* Mesh gradient background */}
      <div className="fixed inset-0 mesh-gradient -z-10" />

      {/* Floating decorative orbs */}
      <div className="fixed top-20 left-[10%] w-72 h-72 bg-sand-400/10 dark:bg-sand-400/5 rounded-full blur-3xl animate-pulse-soft -z-10" />
      <div className="fixed top-40 right-[15%] w-96 h-96 bg-blue-400/5 dark:bg-blue-400/3 rounded-full blur-3xl animate-pulse-soft -z-10" style={{ animationDelay: '1.5s' }} />

      <LanguageSwitcher />

      {/* Download pass button — fixed below language switcher */}
      {flight && (
        <div className="fixed top-16 right-4 z-50">
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/60 dark:bg-white/[0.06] backdrop-blur-md rounded-xl ring-1 ring-stone-200/50 dark:ring-white/10 shadow-lg hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-200 group disabled:opacity-50"
          >
            <Download className="h-4 w-4 text-stone-500 dark:text-stone-400 group-hover:text-sand-500 transition-colors" />
            <span className="hidden sm:inline text-xs font-medium text-stone-500 dark:text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors">
              {isGenerating ? t('generating') : t('downloadPass')}
            </span>
          </button>
        </div>
      )}

      {/* Trophy button */}
      <button
        onClick={() => setShowTrophyCase(true)}
        className="fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-white/60 dark:bg-white/[0.06] backdrop-blur-md ring-1 ring-stone-200/50 dark:ring-white/10 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-200 group"
      >
        <Trophy className="h-4 w-4 text-stone-500 dark:text-stone-400 group-hover:text-sand-500 transition-colors" />
        {badges.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sand-500 text-white text-[9px] font-bold flex items-center justify-center">
            {badges.length}
          </span>
        )}
      </button>

      <main className="container mx-auto px-4 pt-10 pb-8 md:pt-14 md:pb-10 max-w-5xl">
        {/* Header — compact, no icon */}
        <div className="text-center mb-8 md:mb-10 animate-fade-in" style={{ opacity: 0 }}>
          <h1 className="font-display text-4xl md:text-5xl lg:text-5xl font-800 tracking-tight mb-3 text-balance">
            <span className="text-stone-900 dark:text-white">{t('appTitle').split(' ')[0]} </span>
            <span
              className={brandColor ? "transition-colors duration-1000" : "text-sand-500 dark:text-sand-400"}
              style={brandColor ? { color: brandColor.hex } : {}}
            >
              {t('appTitle').split(' ').slice(1).join(' ')}
            </span>
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-lg md:text-xl font-body max-w-lg mx-auto leading-relaxed text-balance">
            {t('appSubtitle')}
          </p>
        </div>

        <div className="relative z-10">
          <div>
            <SearchBar
              onSearch={handleSearch}
              isLoading={loading}
              initialValue={initialFlight}
              recentFlights={recentFlights}
              brandColor={brandColor}
            />
          </div>

          {error && (
            <div className="mt-6 max-w-md mx-auto p-4 bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/30 rounded-2xl flex items-start gap-3 text-red-600 dark:text-red-400 animate-fade-in-up" style={{ opacity: 0 }}>
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="font-medium text-sm">{error}</p>
            </div>
          )}

          {flight && (
            <>
              <div ref={ticketRef}>
                <FlightTicket flight={flight} onBrandColorChange={setBrandColor} isCapturing={isCapturing} />
              </div>
              <div className="flex flex-col lg:flex-row gap-4 mt-4 max-w-5xl mx-auto px-4">
                <div className="flex-1 min-w-0">
                  <FlightMapContainer flight={flight} />
                </div>
                {(flight.origin.timezone && flight.destination.timezone) && (
                  <div
                    className="w-full lg:w-80 shrink-0 animate-fade-in-up stagger-4 lg:h-[480px]"
                    style={{ opacity: 0 }}
                  >
                    <TimezonePanel origin={flight.origin} destination={flight.destination} departure={flight.departure} arrival={flight.arrival} />
                  </div>
                )}
              </div>
              <FlightInfo flight={flight} />
            </>
          )}

          {!hasSearched && !loading && (
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {[
                { icon: stepIcons[0], num: '01', title: t('step1Title'), desc: t('step1Desc') },
                { icon: stepIcons[1], num: '02', title: t('step2Title'), desc: t('step2Desc') },
                { icon: stepIcons[2], num: '03', title: t('step3Title'), desc: t('step3Desc') },
              ].map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.num}
                    className={`group p-6 md:p-8 rounded-2xl bg-white/40 dark:bg-white/[0.03] backdrop-blur-sm border border-stone-200/50 dark:border-white/5 hover:bg-white/70 dark:hover:bg-white/[0.06] transition-all duration-300 animate-fade-in-up`}
                    style={{ opacity: 0, animationDelay: `${0.3 + i * 0.15}s` }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sand-100 dark:bg-sand-950/50 text-sand-600 dark:text-sand-400 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-mono text-stone-300 dark:text-stone-700 font-medium">{step.num}</span>
                    </div>
                    <h3 className="font-display font-700 text-stone-800 dark:text-stone-100 text-lg mb-1.5">{step.title}</h3>
                    <p className="text-sm text-stone-500 dark:text-stone-500 leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-6 text-sm text-stone-400 dark:text-stone-600">
        follow <a href="https://github.com/janschllr" target="_blank" rel="noopener noreferrer" className="text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors">@janschllr</a> on GitHub &lt;3
      </footer>

      {/* Bottom fade for polish */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sand-50 dark:from-[#1a1816] to-transparent pointer-events-none -z-5" />

      {/* Badge notification */}
      {newBadge && (
        <BadgeNotification badge={newBadge} onDismiss={() => setNewBadge(null)} />
      )}

      {/* Trophy case modal */}
      {showTrophyCase && (
        <BadgeTrophyCase badges={badges} onClose={() => setShowTrophyCase(false)} />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
