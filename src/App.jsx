import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { FlightTicket } from './components/FlightTicket';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { searchFlight } from './services/flightService';
import { Plane, AlertCircle } from 'lucide-react';

function AppContent() {
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const { t } = useLanguage();

  const handleSearch = async (flightNumber) => {
    setLoading(true);
    setError(null);
    setFlight(null);
    setHasSearched(true);

    try {
      const result = await searchFlight(flightNumber);
      if (result) {
        setFlight(result);
      } else {
        setError(t('flightNotFound')(flightNumber));
      }
    } catch (err) {
      if (err.message === 'MISSING_API_KEY') {
        setError(
          <span>
            {t('missingApiKey')} <code className="bg-red-100 px-1 rounded">{t('missingApiKeyFile')}</code> {t('missingApiKeyWith')}
            <code className="bg-red-100 px-1 rounded ml-1">VITE_AVIATION_STACK_KEY=your_api_key_here</code>
          </span>
        );
      } else {
        setError(`${t('errorPrefix')} ${err.message}. ${t('errorSuffix')}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500 selection:text-white">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-900 to-slate-950 -z-10" />

      <LanguageSwitcher />

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 backdrop-blur-md rounded-2xl mb-6 shadow-xl ring-1 ring-white/10">
            <Plane className="h-8 w-8 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-sm">
            {t('appTitle')}
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-lg mx-auto">
            {t('appSubtitle')}
          </p>
        </div>

        <div className="relative z-10">
          <SearchBar onSearch={handleSearch} isLoading={loading} />

          {error && (
            <div className="mt-8 max-w-md mx-auto p-4 bg-red-900/20 border border-red-900/50 rounded-2xl flex items-start gap-3 text-red-400 animate-fade-in">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {flight && <FlightTicket flight={flight} />}

          {!hasSearched && !loading && (
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center opacity-60">
              <div className="p-6">
                <div className="text-4xl font-bold text-slate-700 mb-2">01</div>
                <h3 className="font-bold text-slate-200 mb-1">{t('step1Title')}</h3>
                <p className="text-sm text-slate-500">{t('step1Desc')}</p>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-slate-700 mb-2">02</div>
                <h3 className="font-bold text-slate-200 mb-1">{t('step2Title')}</h3>
                <p className="text-sm text-slate-500">{t('step2Desc')}</p>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-slate-700 mb-2">03</div>
                <h3 className="font-bold text-slate-200 mb-1">{t('step3Title')}</h3>
                <p className="text-sm text-slate-500">{t('step3Desc')}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
