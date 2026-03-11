"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const IMAGES = [
    { url: "/images/hr/office1.png", title: "Modern Collaboration", desc: "Empowering teams through unified systems." },
    { url: "/images/hr/workspace1.png", title: "Focused Productivity", desc: "A seamless interface for your daily workflow." },
    { url: "/images/hr/team1.png", title: "Diverse Culture", desc: "Connecting employees across all departments." },
];

export default function LoginCarousel() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="absolute inset-0 z-0">
            {IMAGES.map((img, i) => (
                <div
                    key={img.url}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === index ? "opacity-40" : "opacity-0"
                        }`}
                >
                    <Image
                        src={img.url}
                        alt=""
                        fill
                        className="object-cover"
                        priority={i === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                </div>
            ))}

            <div className="absolute bottom-20 left-12 right-12 z-10">
                <div className="space-y-2">
                    {IMAGES.map((img, i) => (
                        <div
                            key={i}
                            className={`transition-all duration-700 transform ${i === index ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 absolute"
                                }`}
                        >
                            <h3 className="text-xl font-bold text-white">{img.title}</h3>
                            <p className="text-sm text-zinc-400 font-light max-w-xs">{img.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="flex gap-1.5 mt-6">
                    {IMAGES.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-emerald-500" : "w-2 bg-zinc-700"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
