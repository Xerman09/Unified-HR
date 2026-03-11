"use client";

import { useEffect, useState, useMemo } from "react";

// Simple moon phase calculation
function getMoonPhase(date: Date) {
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1;
    let day = date.getUTCDate();

    if (month < 3) {
        year--;
        month += 12;
    }

    const c = 365.25 * year;
    const e = 30.6 * month;
    const jd = c + e + day - 694039.09; // Julian day offset
    const jd_normalized = jd / 29.53058867; // Lunar month
    const phase = jd_normalized - Math.floor(jd_normalized);

    return phase;
}

type Season = "hot_dry" | "rainy" | "cool_dry";

export default function DynamicBackground() {
    // Standardize to Philippines Time (UTC+8)
    const [time, setTime] = useState(() => {
        const d = new Date();
        const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        return new Date(utc + (3600000 * 8));
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const d = new Date();
            const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
            setTime(new Date(utc + (3600000 * 8)));
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const hour = time.getHours();
    const month = time.getMonth(); // 0-indexed

    // Seasons in Philippines:
    // Hot Dry: March (2) - May (4)
    // Rainy: June (5) - November (10)
    // Cool Dry: December (11) - February (1)
    const season: Season = useMemo(() => {
        if (month >= 2 && month <= 4) return "hot_dry";
        if (month >= 5 && month <= 10) return "rainy";
        return "cool_dry";
    }, [month]);

    const isDay = hour >= 6 && hour < 18;

    // Celestial movement
    let progress = 0;
    if (isDay) {
        progress = (hour - 6 + time.getMinutes() / 60) / 12;
    } else {
        const nightHour = hour < 6 ? hour + 6 : hour - 18;
        progress = (nightHour + time.getMinutes() / 60) / 12;
    }

    const left = progress * 100;
    const bottom = Math.sin(progress * Math.PI) * 40 + 10;
    const moonPhase = getMoonPhase(time);

    // Dynamic Gradients based on Time and Season
    const getGradient = () => {
        if (!isDay) return "from-zinc-950 via-zinc-950 to-indigo-950/20";

        if (season === "rainy") return "from-slate-700/30 via-zinc-950 to-zinc-950";
        if (season === "hot_dry") return "from-amber-500/10 via-sky-500/20 to-zinc-950";
        return "from-sky-500/20 via-zinc-950 to-zinc-950";
    };

    return (
        <div className={`absolute inset-0 transition-colors duration-1000 pointer-events-none bg-zinc-950 overflow-hidden`}>
            {/* Base Gradient Layer */}
            <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-1000 ${getGradient()}`} />

            {/* Atmosphere Effects */}
            {season === "hot_dry" && isDay && (
                <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(circle_at_50%_50%,_transparent_0%,_rgba(251,191,36,0.1)_100%)] animate-pulse" />
            )}

            {/* Rain Effect */}
            {season === "rainy" && (
                <div className="absolute inset-0 opacity-20">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-white/40 w-[1px] h-8 animate-rain"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${0.5 + Math.random() * 0.5}s`
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Celestial Body */}
            <div
                className="absolute transition-all duration-[60000ms] ease-linear overflow-hidden z-10"
                style={{
                    left: `${left}%`,
                    bottom: `${bottom}%`,
                    transform: 'translateX(-50%)'
                }}
            >
                {isDay ? (
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-yellow-400 blur-xl opacity-20 animate-pulse" />
                        <div className="absolute inset-0 w-20 h-20 m-auto rounded-full bg-yellow-400 shadow-[0_0_100px_rgba(250,204,21,0.6)] flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white opacity-80" />
                        </div>
                    </div>
                ) : (
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full bg-zinc-100 shadow-[0_0_40px_rgba(255,255,255,0.3)] z-0" />
                        <div
                            className="absolute inset-0 bg-zinc-950 rounded-full transition-all duration-500 z-10"
                            style={{
                                left: moonPhase < 0.5 ? `${moonPhase * 200}%` : `${(1 - moonPhase) * 200}%`,
                                transform: moonPhase < 0.5 ? 'translateX(0%)' : 'translateX(-100%)',
                                opacity: (moonPhase > 0.45 && moonPhase < 0.55) ? 0 : 0.9
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Morning/Evening Haze */}
            {isDay && (hour < 8 || hour > 16) && (
                <div className={`absolute inset-0 transition-opacity duration-1000 ${hour < 8 ? "bg-gradient-to-t from-orange-500/10 to-transparent" : "bg-gradient-to-t from-purple-500/10 to-transparent"
                    }`} />
            )}

            {/* Stars for Night or Cool Dry Nights */}
            {(!isDay || (season === "cool_dry" && hour > 17)) && (
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(60)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-white rounded-full animate-pulse z-0"
                            style={{
                                width: Math.random() * 2 + 1 + 'px',
                                height: Math.random() * 2 + 1 + 'px',
                                top: Math.random() * 80 + '%',
                                left: Math.random() * 100 + '%',
                                animationDelay: Math.random() * 5 + 's',
                                opacity: Math.random() * 0.4 + 0.1
                            }}
                        />
                    ))}
                </div>
            )}

            <style jsx>{`
                @keyframes rain {
                    0% { transform: translateY(-100%) rotate(15deg); }
                    100% { transform: translateY(100vh) rotate(15deg); }
                }
                .animate-rain {
                    animation: rain linear infinite;
                }
            `}</style>
        </div>
    );
}

