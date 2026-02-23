import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../ThemeContext';

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className="flex bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-xl ring-1 ring-slate-900/10 dark:ring-white/10 shadow-lg overflow-hidden">
                <button
                    onClick={toggleTheme}
                    className="flex items-center px-3 py-2 text-sm transition-all cursor-pointer border-r border-slate-900/10 dark:border-white/10 text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white"
                    aria-label="Toggle theme"
                >
                    {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <button
                    onClick={() => setLanguage('en')}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold transition-all cursor-pointer ${language === 'en'
                            ? 'bg-slate-900/15 dark:bg-white/20 text-slate-900 dark:text-white'
                            : 'text-slate-500 hover:text-slate-800 dark:text-white/50 dark:hover:text-white/80'
                        }`}
                    aria-label="English"
                >
                    <span className="text-base">🇬🇧</span>
                    <span className="hidden sm:inline">EN</span>
                </button>
                <button
                    onClick={() => setLanguage('de')}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold transition-all cursor-pointer ${language === 'de'
                            ? 'bg-slate-900/15 dark:bg-white/20 text-slate-900 dark:text-white'
                            : 'text-slate-500 hover:text-slate-800 dark:text-white/50 dark:hover:text-white/80'
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
