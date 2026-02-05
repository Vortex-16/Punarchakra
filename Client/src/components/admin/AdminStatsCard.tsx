"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AdminStatsCardProps {
    title: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean;
    icon: LucideIcon;
    color?: "green" | "blue" | "orange" | "red";
    className?: string;
}

const colorStyles = {
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    red: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
};

export function AdminStatsCard({
    title,
    value,
    trend,
    trendUp,
    icon: Icon,
    color = "green",
    className
}: AdminStatsCardProps) {
    return (
        <div className={cn(
            "bg-white dark:bg-[#111] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow",
            className
        )}>
            <div className="flex justify-between items-start mb-4">
                <div className={cn("p-3 rounded-xl", colorStyles[color])}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <span className={cn(
                        "text-xs font-semibold px-2 py-1 rounded-full",
                        trendUp
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                        {trend}
                    </span>
                )}
            </div>

            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    );
}
