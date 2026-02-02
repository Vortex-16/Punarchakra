"use client";

import { motion } from "framer-motion";
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
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between h-full transition-colors"
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
        </motion.div>
    );
}
