import React, { useState, useRef } from 'react';
import { Search, Plane, ArrowRight, Clock } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export function SearchBar({ onSearch, isLoading, initialValue = '', recentFlights = [], brandColor }) {
    const [query, setQuery] = useState(initialValue);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const { t } = useLanguage();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
            inputRef.current?.blur();
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            {/* Search container */}
            <form onSubmit={handleSubmit} className="relative group">
                {/* Ambient glow behind input */}
                <div className={`absolute -inset-1 rounded-[20px] bg-gradient-to-r from-sand-400/20 via-sand-300/10 to-sand-400/20 blur-xl transition-opacity duration-500 ${isFocused ? 'opacity-100' : 'opacity-0'}`} />

                <div className="relative">
                    {/* Input field */}
                    <div className={`relative flex items-center rounded-2xl transition-all duration-300 ${isFocused
                        ? 'bg-white/[0.09] ring-1 ring-sand-400/30 shadow-[0_0_30px_-5px_rgba(196,168,130,0.15)]'
                        : 'bg-white/[0.05] ring-1 ring-white/[0.06] hover:ring-white/[0.12] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.3)]'
                        }`}>
                        {/* Left icon */}
                        <div className="pl-5 pr-1 flex items-center">
                            <Plane className={`h-[18px] w-[18px] transition-colors duration-300 ${isFocused && !brandColor ? 'text-sand-400' : 'text-stone-500'}`}
                                style={isFocused && brandColor ? { color: brandColor.hex } : {}}
                            />
                        </div>

                        <input
                            ref={inputRef}
                            type="text"
                            className="flex-1 bg-transparent py-4 px-3 text-[17px] font-medium text-stone-100 placeholder:text-stone-500 focus:outline-none tracking-wide"
                            placeholder={t('searchPlaceholder')}
                            value={query}
                            onChange={(e) => setQuery(e.target.value.toUpperCase())}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            disabled={isLoading}
                            spellCheck={false}
                            autoComplete="off"
                        />

                        {/* Submit button */}
                        <div className="pr-2 group/btn">
                            <button
                                type="submit"
                                disabled={isLoading || !query.trim()}
                                className={`flex items-center justify-center h-10 rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed ${query.trim()
                                    ? `shadow-lg px-5 gap-2 ${!brandColor ? 'bg-sand-400/90 hover:bg-sand-400 text-stone-900 shadow-sand-400/20' : (brandColor.isDark ? 'text-white' : 'text-stone-900') + ' hover:brightness-110'}`
                                    : 'bg-white/[0.06] text-stone-500 px-4 gap-2'
                                    }`}
                                style={query.trim() && brandColor ? { backgroundColor: brandColor.hex, boxShadow: `0 10px 15px -3px ${brandColor.hex}40` } : {}}
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-stone-900/20 border-t-stone-900 rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Search className="h-4 w-4" />
                                        <span className="text-sm font-bold tracking-wide">{t('searchButton')}</span>
                                        {query.trim() && (
                                            <ArrowRight className="h-3.5 w-3.5 -ml-0.5" />
                                        )}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Recent flights */}
            {recentFlights.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                    <Clock className="h-3 w-3 text-stone-600" />
                    {recentFlights.map((f) => (
                        <button
                            key={f}
                            onClick={() => onSearch(f)}
                            disabled={isLoading}
                            className="px-3 py-1 text-[13px] font-mono tracking-wider text-stone-400 hover:text-sand-400 bg-white/[0.03] hover:bg-white/[0.07] rounded-lg ring-1 ring-white/[0.04] hover:ring-sand-400/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {f}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
