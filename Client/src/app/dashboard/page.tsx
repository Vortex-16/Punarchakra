"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Trash2, Recycle, DollarSign, Trees, TrendingUp, Map, ExternalLink, Camera, ArrowRight, Truck, AlertTriangle, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { useBinStats, useBins } from "@/hooks/useBins";
import UserMenu from "@/components/UserMenu";

const data = [
    { name: 'Mon', waste: 400, value: 240 },
    { name: 'Tue', waste: 300, value: 139 },
    { name: 'Wed', waste: 200, value: 980 },
    { name: 'Thu', waste: 278, value: 390 },
    { name: 'Fri', waste: 189, value: 480 },
    { name: 'Sat', waste: 239, value: 380 },
    { name: 'Sun', waste: 349, value: 430 },
];

const compositionData = [
    { name: 'Batteries', value: 400, color: '#0F4C3A' },
    { name: 'Phones', value: 300, color: '#22c55e' },
    { name: 'Cables', value: 300, color: '#10B981' },
    { name: 'Laptops', value: 200, color: '#059669' },
];

export default function DashboardPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(".stats-card", {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            clearProps: "all"
        });
    }, { scope: containerRef });

    return (
        <div className="space-y-8" ref={containerRef}>
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
                </div>
                <div className="flex gap-3 items-center">
                    <ModeToggle />
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-200 transition-colors">
                        Download Report
                    </button>
                    <UserMenu />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Bins"
                    value={statsLoading ? "..." : `${stats?.totalBins || 0}`}
                    trend={statsLoading ? "" : `${stats?.activeBins || 0} Active`}
                    trendUp={true}
                    icon={Trash2}
                />
                <StatsCard
                    title="Avg Fill Level"
                    value={statsLoading ? "..." : `${stats?.avgFillLevel || 0}%`}
                    trend={statsLoading ? "" : `${stats?.fullBins || 0} Full`}
                    trendUp={stats?.avgFillLevel ? stats.avgFillLevel < 70 : true}
                    icon={DollarSign}
                />
                <StatsCard
                    title="Active Bins"
                    value={statsLoading ? "..." : `${stats?.activeBins || 0}/${stats?.totalBins || 0}`}
                    trend={statsLoading ? "" : `${stats?.maintenanceBins || 0} Maintenance`}
                    trendUp={(stats?.maintenanceBins || 0) === 0}
                    icon={Recycle}
                />
                <StatsCard
                    title="Critical Bins"
                    value={statsLoading ? "..." : `${stats?.criticalBins?.length || 0}`}
                    trend="Need Collection"
                    trendUp={(stats?.criticalBins?.length || 0) === 0}
                    icon={AlertTriangle}
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1">
                <Link href="/scan" className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
                    <div className="bg-green-50 dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 h-full">
                        <div className="flex-1 text-center sm:text-left">
                            <div className="inline-flex items-center justify-center p-2 bg-forest-green/10 rounded-lg text-forest-green mb-3">
                                <Camera className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Identify E-Waste Instantly
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
                                Use our powerful AI scanner to detect items, estimate their value, and ensure proper recycling. Just point and scan!
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="px-6 py-3 bg-forest-green text-white rounded-xl font-bold text-sm shadow-sm flex items-center gap-2 group-hover:bg-forest-green/90 transition-colors">
                                Start Scanning <ArrowRight className="w-5 h-5" />
                            </span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-2 bg-green-50 dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">Collection Trends</h2>
                        <div className="flex gap-2">
                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-600 dark:text-gray-300 transition-colors">Weekly</span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0F4C3A" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0F4C3A" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" strokeOpacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ color: '#0F4C3A' }}
                                    labelStyle={{ color: '#374151' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="waste"
                                    stroke="#0F4C3A"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorWaste)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Breakdown Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-green-50 dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors"
                >
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 transition-colors">Waste Composition</h2>
                    <div className="h-[200px] w-full mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={compositionData} layout="vertical" barSize={20}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {compositionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                        {compositionData.map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-gray-600 dark:text-gray-300 transition-colors">{item.name}</span>
                                </div>
                                <span className="font-semibold dark:text-gray-200 transition-colors">{item.value} kg</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Live Bin Status & Routes & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Full Map Card */}
                <div className="bg-green-50 dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors overflow-hidden flex flex-col h-full min-h-[400px]">
                    <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">Live Bin Status</h2>
                        <Link href="/map" className="text-xs font-semibold text-forest-green hover:underline flex items-center gap-1">
                            View Full Map <ExternalLink className="w-3 h-3" />
                        </Link>
                    </div>
                    <Link href="/map" className="flex-1 relative group cursor-pointer block">
                        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <div className="absolute inset-0 bg-[url('/map-placeholder.png')] bg-cover opacity-20 dark:opacity-10 mix-blend-multiply dark:mix-blend-normal"></div>
                            <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2 group-hover:text-forest-green transition-colors z-10">
                                <Map className="w-5 h-5" /> Interactive Map Component
                            </p>
                            {/* Real Bin Pins from API */}
                            {bins.slice(0, 3).map((bin, idx) => (
                                <div
                                    key={bin._id}
                                    className={`absolute w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 shadow-lg ${bin.fillLevel > 80 ? 'bg-red-500' : 'bg-forest-green'} ${bin.fillLevel > 80 ? '' : 'animate-pulse'}`}
                                    style={{
                                        top: `${20 + idx * 25}%`,
                                        left: `${20 + idx * 20}%`
                                    }}
                                />
                            ))}
                        </div>

                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                            <span className="bg-white/90 dark:bg-gray-900/90 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur text-gray-900 dark:text-white">Click to Explore</span>
                        </div>
                    </Link>
                </div>

                <div className="space-y-6">
                    {/* Route Optimization Card */}
                    <div className="bg-green-50 dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors flex items-center gap-2">
                                <Truck className="w-5 h-5 text-forest-green" /> Route Optimization
                            </h2>
                            <span className="text-xs font-semibold px-2 py-1 bg-green-100 dark:bg-green-900/30 text-forest-green dark:text-green-400 rounded-md">
                                Optimized
                            </span>
                        </div>
                        <div className="space-y-4">
                            {/* Show critical bins from API */}
                            {statsLoading ? (
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="w-6 h-6 animate-spin text-forest-green" />
                                </div>
                            ) : stats?.criticalBins?.slice(0, 2).map((bin, idx) => (
                                <div key={bin._id} className="flex items-center gap-4 relative">
                                    {idx === 0 && <div className="absolute left-[19px] top-8 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 -z-10" />}
                                    <div className="flex items-center gap-3 w-full">
                                        <div className={`w-10 h-10 rounded-full ${idx === 0 ? 'bg-forest-green text-white' : 'bg-white dark:bg-gray-800 text-gray-400 border-2 border-gray-200 dark:border-gray-700'} flex items-center justify-center shrink-0 z-10 ${idx === 0 ? 'border-4 border-white dark:border-gray-900' : ''}`}>
                                            <span className="text-xs font-bold">{idx + 1}</span>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl flex-1 border border-gray-100 dark:border-gray-800/50">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{bin.location.address}</p>
                                            <p className={`text-xs font-medium ${bin.fillLevel >= 90 ? 'text-red-500' : 'text-orange-500'}`}>
                                                {bin.fillLevel}% Full • {bin.fillLevel >= 90 ? 'Critical' : 'High Priority'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button className="w-full mt-2 py-2.5 bg-forest-green text-white rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                <Truck className="w-4 h-4" /> Dispatch Collection Truck
                            </button>
                        </div>
                    </div>

                    {/* System Alerts */}
                    <div className="bg-green-50 dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 transition-colors flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" /> System Alerts
                        </h2>
                        <div className="space-y-3">
                            {/* Show bins in maintenance */}
                            {bins.filter(b => b.status === 'maintenance' || b.status === 'full').slice(0, 2).map((bin, i) => (
                                <div key={bin._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${bin.status === 'maintenance' ? 'bg-orange-500' : 'bg-red-500'} animate-pulse`} />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {bin.status === 'maintenance' ? 'Maintenance Required' : 'Bin Full'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{bin.location.address}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-gray-400">{bin.fillLevel}%</span>
                                </div>
                            ))}
                            {bins.filter(b => b.status === 'maintenance' || b.status === 'full').length === 0 && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">No active alerts</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
