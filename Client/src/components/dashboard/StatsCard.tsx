"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

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

    useGSAP(() => {
        const el = containerRef.current;
        if (!el) return;

        const hover = gsap.to(el, {
            y: -5,
            scale: 1.02,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            paused: true,
            duration: 0.3,
            ease: "power2.out"
        });

        el.addEventListener("mouseenter", () => hover.play());
        el.addEventListener("mouseleave", () => hover.reverse());

        return () => {
             el.removeEventListener("mouseenter", () => hover.play());
             el.removeEventListener("mouseleave", () => hover.reverse());
        };
    }, { scope: containerRef }); // Scope is good practice with @gsap/react

    return (
        <div
            ref={containerRef}
            className="stats-card bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between h-full transition-colors cursor-pointer"
        >
            <div className="flex justify-between items-start">
                <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-800 ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${trendUp ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {trend}
                    </div>
                )}
            </div>

            <div className="mt-3">
                <h3 className="text-gray-500 dark:text-gray-400 text-xs font-medium">{title}</h3>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{value}</h2>
            </div>
        </div>
    );
}
