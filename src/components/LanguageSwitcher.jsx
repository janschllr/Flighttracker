import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="fixed top-4 right-4 z-50">
            <button
                onClick={() => setLanguage(language === 'en' ? 'de' : 'en')}
                className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md rounded-xl text-sm font-bold text-white hover:bg-white/20 transition-all ring-1 ring-white/10 shadow-lg cursor-pointer"
                aria-label="Switch language"
            >
                <span className="text-lg">{language === 'en' ? '🇩🇪' : '🇬🇧'}</span>
                <span className="hidden sm:inline">{language === 'en' ? 'Deutsch' : 'English'}</span>
            </button>
        </div>
    );
}
