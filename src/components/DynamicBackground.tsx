"use client";

import { useEffect, useState } from "react";

// Simple moon phase calculation
function getMoonPhase(date: Date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 3) {
        year--;
        month += 12;
    }

    const c = 365.25 * year;
    const e = 30.6 * month;
    const jd = c + e + day - 694039.09; // Julian day offset
    const jd_normalized = jd / 29.53058867; // Lunar month
    const phase = jd_normalized - Math.floor(jd_normalized);

    // 0 = New Moon, 0.5 = Full Moon
    return phase;
}

export default function DynamicBackground() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const hour = time.getHours();
    // We want to normalize the hour for the path (sun rise at 6, set at 18)
    // Let's say: 6:00 to 18:00 is day
    const isDay = hour >= 6 && hour < 18;

    // Calculate position (0 to 1 progress across the path)
    let progress = 0;
    if (isDay) {
        progress = (hour - 6 + time.getMinutes() / 60) / 12;
    } else {
        // Night path
        const nightHour = hour < 6 ? hour + 6 : hour - 18;
        progress = (nightHour + time.getMinutes() / 60) / 12;
    }

    // Path mapping: x = progress, y = sin(progress * PI)
    const left = progress * 100;
    const bottom = Math.sin(progress * Math.PI) * 40 + 10; // Peak at 50% height

    const moonPhase = getMoonPhase(time);

    return (
        <div className={`absolute inset-0 transition-colors duration-1000 pointer-events-none ${isDay ? "bg-gradient-to-br from-sky-500/20 via-zinc-950 to-zinc-950" : "bg-gradient-to-br from-indigo-950/20 via-zinc-950 to-zinc-950"
            }`}>
            {/* Sun / Moon celestial body */}
            <div
                className="absolute transition-all duration-[60000ms] ease-linear overflow-hidden"
                style={{
                    left: `${left}%`,
                    bottom: `${bottom}%`,
                    transform: 'translateX(-50%)'
                }}
            >
                {isDay ? (
                    <div className="w-20 h-20 rounded-full bg-yellow-400 shadow-[0_0_60px_rgba(250,204,21,0.4)] flex items-center justify-center animate-pulse">
                        <div className="w-16 h-16 rounded-full bg-yellow-300" />
                    </div>
                ) : (
                    <div className="relative w-16 h-16">
                        {/* The base moon circle */}
                        <div className="absolute inset-0 rounded-full bg-zinc-100 shadow-[0_0_40px_rgba(255,255,255,0.2)]" />

                        {/* Moon shadow for phases */}
                        <div
                            className="absolute inset-0 bg-zinc-950 rounded-full transition-all duration-500"
                            style={{
                                left: moonPhase < 0.5 ? `${moonPhase * 200}%` : `${(1 - moonPhase) * 200}%`,
                                transform: moonPhase < 0.5 ? 'translateX(0%)' : 'translateX(-100%)',
                                opacity: (moonPhase > 0.45 && moonPhase < 0.55) ? 0 : 0.8
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Decorative Stars for Night */}
            {!isDay && (
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-white rounded-full animate-pulse"
                            style={{
                                width: Math.random() * 2 + 1 + 'px',
                                height: Math.random() * 2 + 1 + 'px',
                                top: Math.random() * 60 + '%',
                                left: Math.random() * 100 + '%',
                                animationDelay: Math.random() * 5 + 's',
                                opacity: Math.random() * 0.5 + 0.2
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
