import React, { useState } from 'react';
import { Search, Plane } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export function SearchBar({ onSearch, isLoading, initialValue = '' }) {
    const [query, setQuery] = useState(initialValue);
    const { t } = useLanguage();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Plane className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-11 pr-12 py-4 bg-white border-none rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-lg font-medium"
                    placeholder={t('searchPlaceholder')}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    className="absolute inset-y-2 right-2 flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Search className="h-5 w-5" />
                    )}
                </button>
            </form>
        </div>
    );
}
