import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../ThemeContext';

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className="flex bg-white/60 dark:bg-white/[0.06] backdrop-blur-md rounded-xl ring-1 ring-stone-200/50 dark:ring-white/10 shadow-lg overflow-hidden">
                <button
                    onClick={toggleTheme}
                    className="flex items-center px-3 py-2 text-sm transition-all cursor-pointer border-r border-stone-200/50 dark:border-white/10 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-white"
                    aria-label="Toggle theme"
                >
                    {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <button
                    onClick={() => setLanguage('en')}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold transition-all cursor-pointer ${language === 'en'
                            ? 'bg-stone-900/10 dark:bg-white/15 text-stone-900 dark:text-white'
                            : 'text-stone-400 hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-300'
                        }`}
                    aria-label="English"
                >
                    <span className="text-base">🇬🇧</span>
                    <span className="hidden sm:inline">EN</span>
                </button>
                <button
                    onClick={() => setLanguage('de')}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold transition-all cursor-pointer ${language === 'de'
                            ? 'bg-stone-900/10 dark:bg-white/15 text-stone-900 dark:text-white'
                            : 'text-stone-400 hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-300'
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
