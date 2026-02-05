"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { LucideIcon, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import AnimatedCounter from "../ui/AnimatedCounter";

interface StatsCardProps {
    title: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    icon: LucideIcon;
    color?: string; // Tailwind class for text color
}

export function StatsCard({ title, value, trend, trendUp, icon: Icon, color = "text-forest-green" }: StatsCardProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const el = containerRef.current;
        const iconEl = iconRef.current;
        if (!el) return;

        const hover = gsap.to(el, {
            y: -8,
            scale: 1.02,
            boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.3)",
            paused: true,
            duration: 0.4,
            ease: "power2.out"
        });

        const iconGlow = gsap.to(iconEl, {
            boxShadow: "0 0 20px rgba(16, 185, 129, 0.6)",
            scale: 1.1,
            paused: true,
            duration: 0.3,
            ease: "power2.out"
        });

        el.addEventListener("mouseenter", () => {
            hover.play();
            iconGlow.play();
        });
        
        el.addEventListener("mouseleave", () => {
            hover.reverse();
            iconGlow.reverse();
        });

        return () => {
            el.removeEventListener("mouseenter", () => hover.play());
            el.removeEventListener("mouseleave", () => hover.reverse());
        };
    }, { scope: containerRef });

    // Extract numeric value for counter animation
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    const suffix = value.replace(/[0-9.]/g, '');

    return (
        <div
            ref={containerRef}
            className="stats-card card-premium p-6 flex flex-col justify-between h-full transition-all cursor-pointer group relative overflow-hidden"
        >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start">
                    <div 
                        ref={iconRef}
                        className={`p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 ${color} transition-all duration-300 group-hover:from-emerald-500/20 group-hover:to-teal-500/20`}
                    >
                        <Icon className="w-6 h-6" />
                    </div>
                    {trend && (
                        <div className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm border ${
                            trendUp 
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
                        }`}>
                            {trendUp ? <TrendingUp className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {trend}
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">{title}</h3>
                    <h2 className="text-3xl font-black text-gradient-emerald mt-2">
                        {!isNaN(numericValue) ? (
                            <AnimatedCounter value={numericValue} suffix={suffix} duration={2} />
                        ) : (
                            value
                        )}
                    </h2>
                </div>
            </div>
        </div>
    );
}

