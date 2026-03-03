import React, { useEffect, useState } from 'react';
import { Timer, Moon, Globe, Eye, Trophy, PlaneTakeoff, Sunrise, CircleCheck, Zap, AlarmClock, ArrowUpDown, Star, Ban, Crown, Orbit } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

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

const BADGE_COLORS = {
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

export function BadgeNotification({ badge, onDismiss }) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 400);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!badge) return null;

  const Icon = BADGE_ICONS[badge.id] || Trophy;
  const gradient = BADGE_COLORS[badge.id] || 'from-sand-500 to-sand-600';
  const nameKey = `badge${badge.id.charAt(0).toUpperCase() + badge.id.slice(1)}`;
  const descKey = `${nameKey}Desc`;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-400 ${
        visible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-4 scale-95'
      }`}
    >
      <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl rounded-2xl p-4 pr-5 shadow-2xl ring-1 ring-stone-200/50 dark:ring-white/10 flex items-center gap-3.5 max-w-xs">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 animate-badge-pop shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>

        <div className="min-w-0">
          <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-sand-500 dark:text-sand-400 mb-0.5">
            {t('badgeNewUnlock')}
          </div>
          <div className="text-sm font-display font-700 text-stone-900 dark:text-white truncate">
            {t(nameKey)}
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug mt-0.5">
            {t(descKey)}
          </div>
        </div>
      </div>
    </div>
  );
}
