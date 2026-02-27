import React, { useState, useEffect, useRef } from 'react';
import { Plane, QrCode } from 'lucide-react';
import clsx from 'clsx';
import { FastAverageColor } from 'fast-average-color';
import { useLanguage } from '../i18n/LanguageContext';

import { FlappyPlane } from './FlappyPlane';

// Extract HH:mm directly from ISO string to avoid timezone conversion
function extractTime(isoStr) {
    if (!isoStr) return null;
    return isoStr.slice(11, 16);
}

// Extract dd MMM from ISO string
function extractDate(isoStr) {
    if (!isoStr) return null;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = isoStr.slice(8, 10);
    const month = months[parseInt(isoStr.slice(5, 7), 10) - 1];
    return `${day} ${month}`;
}

function bestTime(...times) {
    return times.find(t => t) || null;
}

// API returns local airport times tagged as UTC — correct to real UTC
function toRealUtc(isoStr, timezone) {
    if (!isoStr || !timezone) return new Date(isoStr);
    const fakeUtc = new Date(isoStr);
    // Get the timezone's UTC offset in minutes
    const utcStr = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', hour: 'numeric', minute: 'numeric', hour12: false }).format(fakeUtc);
    const locStr = new Intl.DateTimeFormat('en-US', { timeZone: timezone, hour: 'numeric', minute: 'numeric', hour12: false }).format(fakeUtc);
    const [uH, uM] = utcStr.split(':').map(Number);
    const [lH, lM] = locStr.split(':').map(Number);
    let offset = (lH * 60 + lM) - (uH * 60 + uM);
    if (offset > 720) offset -= 1440;
    if (offset < -720) offset += 1440;
    // fakeUtc has local time at UTC position, so subtract offset to get real UTC
    return new Date(fakeUtc.getTime() - offset * 60000);
}

// Create a simple seeded pseudo-random number generator
function seededRandom(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function randomClassAndSeat(flightData) {
    if (!flightData) return { cls: 'economy', seat: 'TBD' };

    // Create a predictable seed from flight number + departure date
    // This ensures reloading the page for the same flight yields the same seat
    let seedStr = flightData.flightNumber;
    if (flightData.departure?.scheduled) {
        seedStr += flightData.departure.scheduled.split('T')[0];
    }

    // Convert string to numeric seed
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) {
        seed = ((seed << 5) - seed) + seedStr.charCodeAt(i);
        seed |= 0;
    }

    const roll = seededRandom(seed);
    if (roll < 0.05) {
        // 5% First — rows 1–2, seats A/K (window)
        const row = Math.floor(seededRandom(seed + 1) * 2) + 1;
        const letter = seededRandom(seed + 2) < 0.5 ? 'A' : 'K';
        return { cls: 'first', seat: `${row}${letter}` };
    }
    if (roll < 0.20) {
        // 15% Business — rows 3–7, seats A–D
        const row = Math.floor(seededRandom(seed + 1) * 5) + 3;
        const letter = 'ABCD'[Math.floor(seededRandom(seed + 2) * 4)];
        return { cls: 'business', seat: `${row}${letter}` };
    }
    // 80% Economy — rows 10–38, seats A–F
    const row = Math.floor(seededRandom(seed + 1) * 29) + 10;
    const letter = 'ABCDEF'[Math.floor(seededRandom(seed + 2) * 6)];
    return { cls: 'economy', seat: `${row}${letter}` };
}

export function FlightTicket({ flight, onBrandColorChange }) {
    const { t } = useLanguage();
    const [{ cls, seat }] = React.useState(() => randomClassAndSeat(flight));
    const [logoColor, setLogoColor] = useState('#292524'); // default stone-800
    const imgRef = useRef(null);

    if (!flight) return null;

    // Calculate flight progress using real UTC times
    const now = new Date();
    const departureTime = toRealUtc(flight.departure.actual || flight.departure.estimated || flight.departure.scheduled, flight.origin.timezone);
    const arrivalTime = toRealUtc(flight.arrival.actual || flight.arrival.estimated || flight.arrival.scheduled, flight.destination.timezone);
    const totalDuration = arrivalTime - departureTime;

    let progress;
    if (flight.status === 'Arrived') {
        progress = 100;
    } else if (flight.status === 'On Time' && now < departureTime) {
        progress = 0;
    } else if (totalDuration <= 0) {
        progress = 0;
    } else {
        const elapsed = now - departureTime;
        progress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
    }

    const [isTorn, setIsTorn] = React.useState(false);
    const [showGame, setShowGame] = React.useState(false);

    // Map API status to translated status
    const statusMap = {
        'On Time': t('statusOnTime'),
        'In Air': t('statusInAir'),
        'Arrived': t('statusArrived'),
        'Cancelled': t('statusCancelled'),
        'Delayed': t('statusDelayed'),
        'Diverted': t('statusDiverted'),
        'Unknown': t('statusUnknown'),
    };
    const translatedStatus = statusMap[flight.status] || flight.status;

    const isPositiveStatus = ['On Time', 'In Air', 'Arrived'].includes(flight.status);

    const handleTear = () => {
        setIsTorn(true);
    };

    const handleImageLoad = () => {
        if (imgRef.current) {
            const fac = new FastAverageColor();
            try {
                const color = fac.getColor(imgRef.current);
                setLogoColor(color.hex);
                if (onBrandColorChange) {
                    onBrandColorChange(color);
                }
            } catch (e) {
                console.error("Could not extract color", e);
            }
        }
    };

    return (
        <>
            {showGame && <FlappyPlane onClose={() => setShowGame(false)} />}

            <div className="w-full max-w-5xl mx-auto mt-8 animate-slide-up px-4" style={{ opacity: 0 }}>
                <div className="flex flex-col md:flex-row relative overflow-hidden md:overflow-visible">

                    {/* Left Side (Main Ticket) */}
                    <div className="flex-1 p-6 md:p-8 relative border-r-2 border-dashed border-stone-300/40 z-10 ticket-paper rounded-3xl md:rounded-r-none md:rounded-l-3xl shadow-[0_25px_60px_-12px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.4)]">

                        {/* BOTTOM COLOR BAR */}
                        <div
                            className="absolute bottom-0 left-0 right-[-2px] h-3 rounded-bl-3xl transition-colors duration-1000 border-t border-black/5 dark:border-white/5"
                            style={{ backgroundColor: logoColor }}
                        />

                        {/* Cutout circles for perforation effect */}
                        <div className="absolute -right-4 top-0 w-8 h-8 bg-sand-50 dark:bg-[#1a1816] rounded-full translate-y-[-50%]" />
                        <div className="absolute -right-4 bottom-0 w-8 h-8 bg-sand-50 dark:bg-[#1a1816] rounded-full translate-y-[50%]" />

                        {/* Perforation Holes */}
                        <div className="absolute right-[-5px] top-4 bottom-4 flex flex-col justify-between items-center z-10 pointer-events-none">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="w-2 h-2 rounded-full bg-sand-50 dark:bg-[#1a1816]" />
                            ))}
                        </div>

                        {/* Header */}
                        <div className="flex justify-between items-start mb-7 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-stone-900/5 flex items-center justify-center overflow-hidden">
                                    {flight.airlineIata ? (
                                        <img
                                            ref={imgRef}
                                            src={`https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${flight.airlineIata}.svg`}
                                            alt={flight.airline}
                                            className="w-6 h-6 object-contain"
                                            crossOrigin="anonymous"
                                            onLoad={handleImageLoad}
                                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                                        />
                                    ) : null}
                                    <Plane className="h-4.5 w-4.5 text-stone-800" style={{ display: flight.airlineIata ? 'none' : 'block' }} />
                                </div>
                                <div>
                                    <h2 className="text-sm font-display font-700 text-stone-900 uppercase tracking-[0.15em]">{flight.airline}</h2>
                                    <p className="text-stone-400 text-[11px] font-mono tracking-wider mt-0.5">{t('boardingPass')}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] text-stone-400 uppercase tracking-[0.2em] font-bold mb-1">{t('class')}</div>
                                <div className="text-base md:text-lg font-mono font-bold text-stone-900">{t(cls)}</div>
                            </div>
                        </div>

                        {/* Flight Route */}
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <div className="text-4xl md:text-5xl font-display font-800 text-stone-900 tracking-tighter leading-none">{flight.origin.code}</div>
                                <div className="text-stone-500 font-medium text-sm mt-1">{flight.origin.city}</div>
                            </div>

                            <div className="flex-1 px-5 md:px-8 flex flex-col items-center">
                                <div className="w-full flex items-center gap-2 relative">
                                    <div className="h-2.5 w-2.5 rounded-full bg-stone-400 ring-2 ring-stone-200" />

                                    {/* Progress Bar Container */}
                                    <div className="h-[2px] flex-1 bg-stone-200 relative">
                                        {/* Completed Progress */}
                                        <div
                                            className="absolute top-0 left-0 h-full bg-stone-800 transition-all duration-1000 ease-out"
                                            style={{ width: `${progress}%` }}
                                        />

                                        {/* Plane Icon */}
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-1000 ease-out z-10 group cursor-pointer"
                                            style={{ left: `${progress}%` }}
                                        >
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-sand-400/30 rounded-full blur-md scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                <Plane className="h-5 w-5 text-stone-900 fill-stone-900 rotate-90 relative" />
                                            </div>

                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-stone-900 text-white text-xs font-mono font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:-translate-y-0.5 whitespace-nowrap pointer-events-none shadow-xl">
                                                {Math.round(progress)}%
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-900" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-2.5 w-2.5 rounded-full bg-stone-400 ring-2 ring-stone-200" />
                                </div>
                                <div className={clsx(
                                    "mt-4 px-4 py-1.5 rounded-full text-[11px] font-display font-700 uppercase tracking-[0.15em] border",
                                    isPositiveStatus
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                                        : "bg-red-50 text-red-700 border-red-200/60"
                                )}>
                                    {translatedStatus}
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-4xl md:text-5xl font-display font-800 text-stone-900 tracking-tighter leading-none">{flight.destination.code}</div>
                                <div className="text-stone-500 font-medium text-sm mt-1">{flight.destination.city}</div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-4 gap-4 md:gap-6">
                            {[
                                {
                                    label: t('flight'),
                                    value: flight.flightNumber,
                                    mono: true
                                },
                                { label: t('date'), value: extractDate(flight.departure.scheduled) },
                                { label: t('time'), value: extractTime(bestTime(flight.departure.actual, flight.departure.estimated, flight.departure.scheduled)) },
                                { label: t('gate'), value: flight.departure.gate },
                                { label: t('seat'), value: seat },
                                { label: t('boarding'), value: (() => { const [h, m] = (extractTime(flight.departure.scheduled) || '').split(':').map(Number); if (isNaN(h)) return '--:--'; const total = h * 60 + m - 45; const bh = Math.floor(((total % 1440) + 1440) % 1440 / 60); const bm = ((total % 1440) + 1440) % 1440 % 60; return `${String(bh).padStart(2, '0')}:${String(bm).padStart(2, '0')}`; })() },
                                { label: t('eta'), value: extractTime(bestTime(flight.arrival.actual, flight.arrival.estimated, flight.arrival.scheduled)) || '--:--' },
                            ].map((item) => (
                                <div key={item.label}>
                                    <div className="text-[10px] text-stone-400 uppercase font-bold tracking-[0.2em] mb-1">{item.label}</div>
                                    <div className="text-base md:text-lg font-mono font-bold text-stone-900">
                                        {item.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Local time hint */}
                        <div className="mt-4 text-[9px] text-stone-400 font-mono tracking-wide">
                            {t('localTimeHint') || 'All times shown in local airport time'}
                        </div>
                    </div>

                    {/* Right Side (Stub) - Hidden on mobile, visible on desktop */}
                    <div
                        onClick={handleTear}
                        className={clsx(
                            "hidden md:flex w-72 ticket-paper p-6 flex-col justify-between relative transition-all duration-700 ease-in-out transform origin-left cursor-pointer rounded-r-3xl",
                            isTorn ? "translate-x-14 translate-y-3 rotate-6 shadow-xl opacity-90" : "hover:rotate-[0.5deg] hover:translate-x-0.5 hover:shadow-[25px_25px_60px_-12px_rgba(0,0,0,0.12)] dark:hover:shadow-[25px_25px_60px_-12px_rgba(0,0,0,0.4)]"
                        )}
                    >
                        {/* BOTTOM COLOR BAR */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-3 rounded-br-3xl transition-colors duration-1000 border-t border-black/5 dark:border-white/5"
                            style={{ backgroundColor: logoColor }}
                        />

                        {/* Tear hint */}
                        {!isTorn && (
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 -rotate-90 text-stone-400 text-[9px] font-mono tracking-[0.3em] opacity-40 pointer-events-none z-10">
                                {t('tearHere')}
                            </div>
                        )}
                        {/* Cutout circle for perforation effect (top & bottom) */}
                        <div className="absolute -left-4 top-0 w-8 h-8 bg-sand-50 dark:bg-[#1a1816] rounded-full translate-y-[-50%] z-10" />
                        <div className="absolute -left-4 bottom-0 w-8 h-8 bg-sand-50 dark:bg-[#1a1816] rounded-full translate-y-[50%] z-10" />

                        {/* Perforation Holes on Stub edge */}
                        <div className="absolute left-[-5px] top-4 bottom-4 flex flex-col justify-between items-center z-10 pointer-events-none">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="w-2 h-2 rounded-full bg-sand-50 dark:bg-[#1a1816]" />
                            ))}
                        </div>

                        <div>
                            <h3 className="text-xs font-display font-700 text-stone-900 mb-5 uppercase tracking-[0.2em]">{t('passengerTicket')}</h3>

                            <div className="space-y-3">
                                {[
                                    { label: t('flight'), value: flight.flightNumber, mono: true },
                                    { label: t('date'), value: extractDate(flight.departure.scheduled) },
                                    { label: t('gate'), value: flight.departure.gate },
                                    { label: t('seat'), value: seat },
                                ].map((item) => (
                                    <div key={item.label} className="flex justify-between items-baseline">
                                        <span className="text-stone-400 text-xs font-medium tracking-wide">{item.label}</span>
                                        <span className={clsx(
                                            "text-stone-900 font-bold text-sm",
                                            item.mono && "font-mono"
                                        )}>
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t-2 border-dashed border-stone-300/40">
                            <div className="flex justify-between items-end">
                                <div className="text-left">
                                    <div className="text-xl font-display font-800 text-stone-900">{flight.origin.code}</div>
                                    <div className="text-stone-400 text-[10px] font-bold tracking-[0.15em] mt-0.5">{t('origin')}</div>
                                </div>
                                <Plane className="h-3.5 w-3.5 text-stone-300 mb-2" />
                                <div className="text-right">
                                    <div className="text-xl font-display font-800 text-stone-900">{flight.destination.code}</div>
                                    <div className="text-stone-400 text-[10px] font-bold tracking-[0.15em] mt-0.5">{t('dest')}</div>
                                </div>
                            </div>
                        </div>

                        {/* Barcode Simulation */}
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowGame(true);
                            }}
                            className="mt-5 h-12 bg-stone-900 w-full rounded-lg flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-all duration-200 group active:scale-[0.99]"
                        >
                            <div className="flex gap-[2px] h-full w-full px-3 items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                                {[...Array(45)].map((_, i) => (
                                    <div key={i} className="bg-white/80 h-full" style={{ width: Math.random() > 0.5 ? 1.5 : 3.5, opacity: Math.random() > 0.3 ? 1 : 0.6 }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
