"use client";

import { Bin, formatDistance } from "@/lib/bin-data";
import { MapPin, Trash2, TrendingUp, Package } from "lucide-react";

interface BinStatsProps {
    bins: Bin[];
    userLocation: { lat: number; lng: number } | null;
}

export default function BinStats({ bins, userLocation }: BinStatsProps) {
    const totalBins = bins.length;
    const openBins = bins.filter(b => b.status === "Open").length;
    const avgFillLevel = bins.length > 0
        ? Math.round(bins.reduce((sum, b) => sum + b.fillLevel, 0) / bins.length)
        : 0;

    // Calculate unique waste types accepted
    const allTypes = new Set<string>();
    bins.forEach(bin => bin.acceptedTypes.forEach(type => allTypes.add(type)));
    const uniqueTypes = allTypes.size;

    const stats = [
        {
            icon: MapPin,
            label: "Bins Found",
            value: totalBins.toString(),
            subtext: `${openBins} open`,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20"
        },
        {
            icon: Package,
            label: "Waste Types",
            value: uniqueTypes.toString(),
            subtext: "categories",
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-50 dark:bg-purple-900/20"
        },
        {
            icon: TrendingUp,
            label: "Avg Capacity",
            value: `${avgFillLevel}%`,
            subtext: "filled",
            color: avgFillLevel > 80 ? "text-red-600 dark:text-red-400" :
                avgFillLevel > 50 ? "text-amber-600 dark:text-amber-400" :
                    "text-green-600 dark:text-green-400",
            bg: avgFillLevel > 80 ? "bg-red-50 dark:bg-red-900/20" :
                avgFillLevel > 50 ? "bg-amber-50 dark:bg-amber-900/20" :
                    "bg-green-50 dark:bg-green-900/20"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-lg transition-all"
                >
                    <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center flex-shrink-0`}>
                        <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {stat.label} <span className="text-xs">• {stat.subtext}</span>
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
