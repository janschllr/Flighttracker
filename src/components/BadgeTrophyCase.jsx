import React from 'react';
import { Timer, Moon, Globe, Eye, Lock, X, PlaneTakeoff, Sunrise, CircleCheck, Zap, AlarmClock, ArrowUpDown, Star, Ban, Crown, Orbit } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { BADGE_DEFINITIONS } from '../services/badgeService';

const BADGE_ICONS = {
  firstFlight: PlaneTakeoff,
  earlyBird: Sunrise,
  smoothLanding: CircleCheck,
  shortHop: Zap,
  nightOwl: Moon,
  redEye: Eye,
  delaySurvivor: AlarmClock,
  equatorCrosser: ArrowUpDown,
  frequentFlyer: Star,
  longHaul: Timer,
  globeTrotter: Globe,
  ghostFlight: Ban,
  jumboJet: Crown,
  antipodean: Orbit,
};

const BADGE_GRADIENTS = {
  firstFlight: 'from-sky-400 to-blue-500',
  earlyBird: 'from-amber-400 to-yellow-500',
  smoothLanding: 'from-emerald-400 to-green-500',
  shortHop: 'from-cyan-400 to-teal-500',
  nightOwl: 'from-indigo-500 to-purple-600',
  redEye: 'from-red-500 to-rose-600',
  delaySurvivor: 'from-orange-500 to-amber-600',
  equatorCrosser: 'from-lime-500 to-emerald-600',
  frequentFlyer: 'from-yellow-400 to-amber-500',
  longHaul: 'from-amber-500 to-orange-600',
  globeTrotter: 'from-emerald-500 to-teal-600',
  ghostFlight: 'from-slate-500 to-gray-700',
  jumboJet: 'from-violet-500 to-purple-700',
  antipodean: 'from-rose-500 to-pink-700',
};

const DIFFICULTY_LABELS = {
  easy: { en: 'Easy', de: 'Einfach', color: 'text-emerald-500' },
  medium: { en: 'Medium', de: 'Mittel', color: 'text-amber-500' },
  hard: { en: 'Hard', de: 'Schwer', color: 'text-red-500' },
};

export function BadgeTrophyCase({ badges, onClose }) {
  const { t, language } = useLanguage();
  const earnedMap = Object.fromEntries(badges.map(b => [b.id, b]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[85vh] shadow-2xl ring-1 ring-stone-200/50 dark:ring-white/10 animate-badge-pop flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4 text-stone-400" />
        </button>

        {/* Header */}
        <div className="text-center mb-5 shrink-0">
          <h2 className="font-display font-800 text-xl text-stone-900 dark:text-white tracking-tight">
            {t('badgeTrophyCase')}
          </h2>
          <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1 font-mono tracking-wide">
            {badges.length}/{BADGE_DEFINITIONS.length} {t('badgeEarned')?.toLowerCase()}
          </p>
        </div>

        {/* Scrollable badge grid */}
        <div className="overflow-y-auto overscroll-contain -mx-2 px-2">
          {['easy', 'medium', 'hard'].map((difficulty) => {
            const group = BADGE_DEFINITIONS.filter(d => d.difficulty === difficulty);
            const diffLabel = DIFFICULTY_LABELS[difficulty];
            return (
              <div key={difficulty} className="mb-4 last:mb-0">
                {/* Difficulty header */}
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className={`text-[10px] uppercase font-bold tracking-[0.2em] ${diffLabel.color}`}>
                    {language === 'de' ? diffLabel.de : diffLabel.en}
                  </span>
                  <div className="flex-1 h-px bg-stone-200/50 dark:bg-white/5" />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {group.map((def) => {
                    const earned = earnedMap[def.id];
                    const Icon = BADGE_ICONS[def.id];
                    const gradient = BADGE_GRADIENTS[def.id];
                    const nameKey = `badge${def.id.charAt(0).toUpperCase() + def.id.slice(1)}`;
                    const descKey = `${nameKey}Desc`;

                    return (
                      <div
                        key={def.id}
                        className={`rounded-2xl p-3.5 ring-1 transition-all duration-300 ${
                          earned
                            ? 'bg-white/80 dark:bg-white/[0.06] ring-stone-200/50 dark:ring-white/10'
                            : 'bg-stone-50/50 dark:bg-white/[0.02] ring-stone-200/30 dark:ring-white/5 opacity-45'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            earned
                              ? `bg-gradient-to-br ${gradient} shadow-md`
                              : 'bg-stone-200 dark:bg-stone-700'
                          }`}>
                            {earned
                              ? <Icon className="h-4.5 w-4.5 text-white" />
                              : <Lock className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
                            }
                          </div>

                          {/* Text */}
                          <div className="min-w-0 flex-1">
                            <div className="text-[13px] font-display font-700 text-stone-900 dark:text-white leading-tight">
                              {t(nameKey)}
                            </div>
                            <div className="text-[10px] text-stone-400 dark:text-stone-500 leading-snug mt-0.5">
                              {t(descKey)}
                            </div>
                            {earned && (
                              <div className="mt-1 text-[9px] font-mono text-sand-500 dark:text-sand-400 tracking-wide">
                                {t('badgeEarnedOn')(earned.flightNumber)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
