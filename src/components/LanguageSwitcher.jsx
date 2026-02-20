import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className="flex bg-white/10 backdrop-blur-md rounded-xl ring-1 ring-white/10 shadow-lg overflow-hidden">
                <button
                    onClick={() => setLanguage('en')}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold transition-all cursor-pointer ${language === 'en'
                            ? 'bg-white/20 text-white'
                            : 'text-white/50 hover:text-white/80'
                        }`}
                    aria-label="English"
                >
                    <span className="text-base">🇬🇧</span>
                    <span className="hidden sm:inline">EN</span>
                </button>
                <button
                    onClick={() => setLanguage('de')}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold transition-all cursor-pointer ${language === 'de'
                            ? 'bg-white/20 text-white'
                            : 'text-white/50 hover:text-white/80'
                        }`}
                    aria-label="Deutsch"
                >
                    <span className="text-base">🇩🇪</span>
                    <span className="hidden sm:inline">DE</span>
                </button>
            </div>
        </div>
    );
}
