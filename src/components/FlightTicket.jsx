import React from 'react';
import { Plane, QrCode } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';
import { useLanguage } from '../i18n/LanguageContext';

import { FlappyPlane } from './FlappyPlane';

export function FlightTicket({ flight }) {
    const { t, language } = useLanguage();

    if (!flight) return null;

    const now = new Date();
    const departureTime = new Date(flight.departure.scheduled);
    const arrivalTime = new Date(flight.arrival.scheduled);
    const totalDuration = arrivalTime - departureTime;
    const elapsed = now - departureTime;
    const progress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));

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

    const handleTear = () => {
        setIsTorn(true);
    };

    return (
        <>
            {showGame && <FlappyPlane onClose={() => setShowGame(false)} />}

            <div className="w-full max-w-5xl mx-auto mt-12 animate-fade-in px-4">
                <div className="flex flex-col md:flex-row relative overflow-hidden md:overflow-visible">

                    {/* Left Side (Main Ticket) */}
                    <div className="flex-1 p-8 relative border-r-2 border-dashed border-slate-300/50 z-10 bg-[#f4f1ea] rounded-3xl md:rounded-r-none md:rounded-l-3xl shadow-2xl">
                        {/* Cutout circles for perforation effect */}
                        <div className="absolute -right-4 top-0 w-8 h-8 bg-slate-950 rounded-full translate-y-[-50%]" />
                        <div className="absolute -right-4 bottom-0 w-8 h-8 bg-slate-950 rounded-full translate-y-[50%]" />

                        {/* Perforation Holes */}
                        <div className="absolute right-[-5px] top-4 bottom-4 flex flex-col justify-between items-center z-10 pointer-events-none">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="w-2 h-2 rounded-full bg-slate-950" />
                            ))}
                        </div>

                        {/* Header */}
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-900/5 rounded-lg text-slate-900">
                                    <Plane className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">{flight.airline}</h2>
                                    <p className="text-slate-500 text-sm font-mono">{t('boardingPass')}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-slate-400 uppercase tracking-wider font-bold">{t('class')}</div>
                                <div className="text-xl font-black text-slate-900">{t('economy')}</div>
                            </div>
                        </div>

                        {/* Flight Route */}
                        <div className="flex justify-between items-center mb-12">
                            <div>
                                <div className="text-5xl font-black text-slate-900 tracking-tighter">{flight.origin.code}</div>
                                <div className="text-slate-500 font-medium">{flight.origin.city}</div>
                            </div>

                            <div className="flex-1 px-8 flex flex-col items-center">
                                <div className="w-full flex items-center gap-2 relative">
                                    <div className="h-2 w-2 rounded-full bg-slate-400" />

                                    {/* Progress Bar Container */}
                                    <div className="h-0.5 flex-1 bg-slate-300 relative">
                                        {/* Completed Progress */}
                                        <div
                                            className="absolute top-0 left-0 h-full bg-slate-900 transition-all duration-1000 ease-out"
                                            style={{ width: `${progress}%` }}
                                        />

                                        {/* Plane Icon */}
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-1000 ease-out z-10 group cursor-pointer"
                                            style={{ left: `${progress}%` }}
                                        >
                                            <Plane className="h-5 w-5 text-slate-900 fill-slate-900 rotate-90" />

                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
                                                {Math.round(progress)}%
                                                {/* Arrow */}
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-2 w-2 rounded-full bg-slate-400" />
                                </div>
                                <div className={clsx(
                                    "mt-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border",
                                    ["On Time", "In Air", "Arrived"].includes(flight.status)
                                        ? "bg-green-100 text-green-700 border-green-200"
                                        : "bg-red-100 text-red-700 border-red-200"
                                )}>
                                    {translatedStatus}
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-5xl font-black text-slate-900 tracking-tighter">{flight.destination.code}</div>
                                <div className="text-slate-500 font-medium">{flight.destination.city}</div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-4 gap-8">
                            <div>
                                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">{t('flight')}</div>
                                <div className="text-xl font-black text-slate-900 font-mono">{flight.flightNumber}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">{t('date')}</div>
                                <div className="text-xl font-black text-slate-900">
                                    {format(new Date(flight.departure.scheduled), 'dd MMM')}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">{t('time')}</div>
                                <div className="text-xl font-black text-slate-900">
                                    {format(new Date(flight.departure.scheduled), 'HH:mm')}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">{t('gate')}</div>
                                <div className="text-xl font-black text-slate-900">{flight.departure.gate}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">{t('seat')}</div>
                                <div className="text-xl font-black text-slate-900">14A</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">{t('boarding')}</div>
                                <div className="text-xl font-black text-slate-900">
                                    {format(new Date(new Date(flight.departure.scheduled).getTime() - 45 * 60000), 'HH:mm')}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">{t('eta')}</div>
                                <div className="text-xl font-black text-slate-900">
                                    {flight.arrival.estimated ? format(new Date(flight.arrival.estimated), 'HH:mm') : '--:--'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side (Stub) - Hidden on mobile, visible on desktop */}
                    <div
                        onClick={handleTear}
                        className={clsx(
                            "hidden md:flex w-80 bg-[#f4f1ea] p-8 flex-col justify-between relative transition-all duration-700 ease-in-out transform origin-left cursor-pointer hover:brightness-95 rounded-r-3xl shadow-2xl",
                            isTorn ? "translate-x-12 translate-y-2 rotate-6 shadow-xl" : "hover:rotate-1"
                        )}
                    >
                        {/* Tear hint */}
                        {!isTorn && (
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 -rotate-90 text-slate-400 text-[10px] font-mono tracking-widest opacity-50 pointer-events-none">
                                {t('tearHere')}
                            </div>
                        )}
                        {/* Cutout circles for perforation effect */}
                        <div className="absolute -left-4 top-0 w-8 h-8 bg-slate-950 rounded-full translate-y-[-50%]" />
                        <div className="absolute -left-4 bottom-0 w-8 h-8 bg-slate-950 rounded-full translate-y-[50%]" />

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-wider">{t('passengerTicket')}</h3>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-slate-400 text-sm font-medium">{t('flight')}</span>
                                    <span className="text-slate-900 font-bold font-mono">{flight.flightNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400 text-sm font-medium">{t('date')}</span>
                                    <span className="text-slate-900 font-bold">{format(new Date(flight.departure.scheduled), 'dd MMM')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400 text-sm font-medium">{t('gate')}</span>
                                    <span className="text-slate-900 font-bold">{flight.departure.gate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400 text-sm font-medium">{t('seat')}</span>
                                    <span className="text-slate-900 font-bold">14A</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t-2 border-dashed border-slate-300/50">
                            <div className="flex justify-between items-end">
                                <div className="text-left">
                                    <div className="text-3xl font-black text-slate-900">{flight.origin.code}</div>
                                    <div className="text-slate-400 text-xs font-bold">{t('origin')}</div>
                                </div>
                                <Plane className="h-5 w-5 text-slate-300 mb-2" />
                                <div className="text-right">
                                    <div className="text-3xl font-black text-slate-900">{flight.destination.code}</div>
                                    <div className="text-slate-400 text-xs font-bold">{t('dest')}</div>
                                </div>
                            </div>
                        </div>

                        {/* Barcode Simulation */}
                        <div
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent tearing when clicking barcode
                                setShowGame(true);
                            }}
                            className="mt-6 h-12 bg-slate-900 w-full rounded flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group"
                        >
                            <div className="flex gap-1 h-full w-full px-2 items-center justify-center opacity-50 group-hover:opacity-70 transition-opacity">
                                {[...Array(40)].map((_, i) => (
                                    <div key={i} className="bg-[#f4f1ea] h-full" style={{ width: Math.random() > 0.5 ? 2 : 4, opacity: Math.random() > 0.3 ? 1 : 0.5 }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
