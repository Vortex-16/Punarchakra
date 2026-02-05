"use client";

import React, { useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Leaf, TrendingUp, Info } from 'lucide-react';

interface HistoryItem {
    itemType: string;
    pointsEarned: number;
    date: string | Date;
}

interface ImpactChartProps {
    history?: HistoryItem[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-gray-950 border border-emerald-100 dark:border-emerald-900/30 p-3 rounded-xl shadow-2xl backdrop-blur-md bg-opacity-90">
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-widest">{label}</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <p className="text-sm font-black text-gray-900 dark:text-white">
                        {payload[0].value.toFixed(1)}kg CO2 Saved
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export function ImpactChart({ history = [] }: ImpactChartProps) {
    const chartData = useMemo(() => {
        if (!history || history.length === 0) {
            // Meaningful placeholder data for new users
            return [
                { name: 'Day 1', co2: 0 },
                { name: 'Day 2', co2: 0.5 },
                { name: 'Day 3', co2: 0.3 },
                { name: 'Day 4', co2: 0.8 },
                { name: 'Day 5', co2: 1.2 },
                { name: 'Day 6', co2: 1.0 },
                { name: 'Day 7', co2: 2.1 },
            ];
        }

        // Group by date and calculate CO2 (approx 0.5kg per item)
        const grouped: Record<string, number> = {};

        // Get last 7 days range
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toLocaleDateString('en-US', { weekday: 'short' });
        });

        // Initialize with 0
        last7Days.forEach(day => grouped[day] = 0);

        history.forEach(item => {
            const date = new Date(item.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            if (grouped[dayName] !== undefined) {
                grouped[dayName] += 0.5; // Estimated impact
            }
        });

        return last7Days.map(day => ({
            name: day,
            co2: grouped[day]
        }));
    }, [history]);

    const totalImpact = useMemo(() => {
        if (history.length === 0) return "0.0";
        return (history.length * 0.5).toFixed(1);
    }, [history]);

    const hasData = history.length > 0;

    return (
        <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-[2rem] shadow-sm border border-emerald-500/5 dark:border-emerald-500/10 h-full flex flex-col relative overflow-hidden group">
            {/* Background Decorative Gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[64px] rounded-full -mr-16 -mt-16 pointer-events-none" />

            <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                            <Leaf className="w-4 h-4 text-emerald-500" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                            Impact Analytics
                        </h2>
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] font-black italic">Environmental Contribution</p>
                </div>

                {hasData && (
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-full">
                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">+12%</span>
                        </div>
                        <span className="text-[9px] text-gray-400 uppercase font-bold mt-1 tracking-tighter cursor-help flex items-center gap-1">
                            Active Streak <Info className="w-2.5 h-2.5 opacity-50" />
                        </span>
                    </div>
                )}
            </div>

            <div className="flex-1 min-h-[200px] w-full relative z-10 mt-2">
                {!hasData && (
                    <div className="absolute inset-x-0 top-0 flex flex-col items-center justify-center z-20 pointer-events-none transition-opacity group-hover:opacity-20">
                        <p className="text-xs font-bold text-emerald-500/60 uppercase tracking-widest bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/10 backdrop-blur-sm">
                            Starting Your Eco Journey
                        </p>
                    </div>
                )}

                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="currentColor"
                            className="text-gray-100/50 dark:text-gray-900/50"
                        />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Area
                            type="monotone"
                            dataKey="co2"
                            stroke="#10b981"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorCo2)"
                            animationDuration={1500}
                            baseValue={0}
                            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/5 flex justify-between items-center relative z-10">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-1">Lifetime Impact</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-gray-900 dark:text-white transition-all group-hover:text-emerald-500">{totalImpact}</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase">kg CO2</span>
                    </div>
                </div>
                <button className="px-4 py-2 bg-gray-50 dark:bg-emerald-500/5 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 text-gray-400 dark:text-emerald-500/80 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-transparent hover:border-emerald-500/20 shadow-sm active:scale-95">
                    Get Details
                </button>
            </div>
        </div>
    );
}
