"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
    Activity, ArrowRight, BarChart3, Calendar, DollarSign,
    LayoutDashboard, Map, Settings, Trash2, Users, AlertTriangle, Recycle, Truck, ExternalLink, Camera, Loader2,
    Laptop, Monitor, Cpu, Mouse, Keyboard, Smartphone, CircuitBoard, Battery, HardDrive, Printer, QrCode, Scan
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { ModeToggle } from "@/components/mode-toggle";
import { ImpactChart } from "@/components/dashboard/ImpactChart";
import Link from "next/link";
import { useBinStats, useBins } from "@/hooks/useBins";
import UserMenu from "@/components/UserMenu";
import { useSession } from "@/hooks/useSession";

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
    const { stats, loading } = useBinStats();
    const { bins = [] } = useBins();
    const { user } = useSession();

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

    const getUserGreeting = () => {
        if (user?.name) return user.name;
        if (user?.role) return user.role.charAt(0).toUpperCase() + user.role.slice(1);
        return "User";
    };

    // --- ADMIN DASHBOARD ---
    if (user?.role === 'admin') {
        return (
            <div className="space-y-8" ref={containerRef}>
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Admin Dashboard</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Welcome back, {getUserGreeting()}. System Overview.</p>
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
                        value={loading ? "..." : `${stats?.totalBins || 0}`}
                        trend={loading ? "" : `${stats?.activeBins || 0} Active`}
                        trendUp={true}
                        icon={Trash2}
                    />
                    <StatsCard
                        title="Avg Fill Level"
                        value={loading ? "..." : `${stats?.avgFillLevel || 0}%`}
                        trend={loading ? "" : `${stats?.fullBins || 0} Full`}
                        trendUp={stats?.avgFillLevel ? stats.avgFillLevel < 70 : true}
                        icon={DollarSign}
                    />
                    <StatsCard
                        title="Active Bins"
                        value={loading ? "..." : `${stats?.activeBins || 0}/${stats?.totalBins || 0}`}
                        trend={loading ? "" : `${stats?.maintenanceBins || 0} Maintenance`}
                        trendUp={(stats?.maintenanceBins || 0) === 0}
                        icon={Recycle}
                    />
                    <StatsCard
                        title="Critical Bins"
                        value={loading ? "..." : `${stats?.criticalBins?.length || 0}`}
                        trend="Need Collection"
                        trendUp={(stats?.criticalBins?.length || 0) === 0}
                        icon={AlertTriangle}
                    />
                </div>

                {/* Live Bin Status & Routes & Alerts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Route Optimization Card */}
                    <div className="bg-green-50 dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                        {/* ... Admin content for routes ... */}
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
                            {loading ? (
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

                    {/* Breakdown Chart */}
                    <motion.div
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
                    </motion.div>
                </div>
            </div>
        );
    }

    // --- USER DASHBOARD ---
    return (
        <div className="space-y-8" ref={containerRef}>
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">My Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Welcome back, {getUserGreeting()}. Keep recycling!</p>
                </div>
                <div className="flex gap-3 items-center">
                    <ModeToggle />
                    <UserMenu />
                </div>
            </div>

            {/* User Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Points Card */}
                <StatsCard
                    title="My Reward Points"
                    value={`${user?.points || 0}`}
                    trend="Redeem now"
                    trendUp={true}
                    icon={DollarSign}
                />

                {/* Scan Action */}
                <Link href="/scan" className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow col-span-1 lg:col-span-2">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 h-full text-white">
                        <div className="flex-1 text-center sm:text-left">
                            <h2 className="text-2xl font-bold mb-2">Scan & Check Credits Points</h2>
                            <p className="text-white/80 max-w-xl">
                                Detect e-waste instantly with AI and find the nearest bin to deposit.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                                <Camera className="w-8 h-8" />
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sustainability Impact Graph */}
                <div className="h-full min-h-[400px]">
                    <ImpactChart history={user?.history} />
                </div>

                {/* Recent Activity / Tips */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
                >
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
                    {user?.history && user.history.length > 0 ? (
                        <div className="space-y-4">
                            {user.history.slice(0, 5).map((item: any, i: number) => {
                                // Dynamic Icon Logic
                                let Icon = Recycle;
                                const lowerType = item.itemType.toLowerCase();
                                if (lowerType.includes('laptop')) Icon = Laptop;
                                else if (lowerType.includes('monitor') || lowerType.includes('display') || lowerType.includes('tv') || lowerType.includes('screen')) Icon = Monitor;
                                else if (lowerType.includes('cpu') || lowerType.includes('pc') || lowerType.includes('computer')) Icon = Cpu;
                                else if (lowerType.includes('mouse')) Icon = Mouse;
                                else if (lowerType.includes('keyboard')) Icon = Keyboard;
                                else if (lowerType.includes('phone') || lowerType.includes('mobile')) Icon = Smartphone;
                                else if (lowerType.includes('circuit') || lowerType.includes('pcb') || lowerType.includes('board')) Icon = CircuitBoard;
                                else if (lowerType.includes('battery')) Icon = Battery;
                                else if (lowerType.includes('hard drive') || lowerType.includes('hdd') || lowerType.includes('ssd')) Icon = HardDrive;
                                else if (lowerType.includes('printer')) Icon = Printer;

                                return (
                                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-black/40 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate text-gray-900 dark:text-gray-100">{item.itemType}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(item.date).toLocaleDateString()}</p>
                                        </div>
                                        <span className="font-bold text-emerald-600 dark:text-emerald-500 text-sm">+{item.pointsEarned} XP</span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            <Trash2 className="w-10 h-10 mx-auto mb-3 opacity-20" />
                            <p>No activity yet. Scan your first item!</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
