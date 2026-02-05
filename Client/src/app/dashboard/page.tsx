"use client";

import { useRef, useState, useEffect } from "react";
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
import { FactsQuizCard } from "@/components/dashboard/FactsQuizCard";
import { AchievementsHub } from "@/components/dashboard/AchievementsHub";
import { CommunityChallenges } from "@/components/dashboard/CommunityChallenges";
import { HistorySummaryCard } from "@/components/dashboard/HistorySummaryCard";
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
    const { user: sessionUser, isAuthenticated, isLoading: sessionLoading, session } = useSession();
    const [userData, setUserData] = useState<any>(null);

    // Fetch fresh user data on mount
    useEffect(() => {
        const fetchUserData = async () => {
            if (session?.accessToken) {
                try {
                    // Import api dynamically or use fetch if api helper isn't available in this file yet
                    // checking imports... needs api import
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/me`, {
                        headers: { Authorization: `Bearer ${session.accessToken}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setUserData(data);
                    }
                } catch (error) {
                    console.error("Failed to fetch user data", error);
                }
            }
        };

        if (session?.accessToken) {
            fetchUserData();
        }
    }, [session]);

    // Use userData if available, otherwise fall back to sessionUser
    const user = userData || sessionUser;

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

    // --- USER DASHBOARD ---
    return (
        <div className="space-y-8" ref={containerRef}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors">
                        My Dashboard
                    </h1>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">
                        Welcome back, <span className="text-emerald-600 dark:text-emerald-400 font-bold">{getUserGreeting()}</span>. Keep recycling!
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3">
                        {isAuthenticated && user?.role === 'admin' && (
                            <div className="flex gap-2">
                                <Link href="/admin" className="p-2 sm:px-4 sm:py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center gap-2 group">
                                    <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span className="hidden xs:block">Admin</span>
                                </Link>
                                <Link href="/analytics" className="p-2 sm:px-4 sm:py-2 bg-purple-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20 hover:bg-purple-700 transition-all flex items-center gap-2 group">
                                    <BarChart3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span className="hidden xs:block">Analytics</span>
                                </Link>
                            </div>
                        )}
                        <ModeToggle />
                    </div>

                    <div className="flex items-center gap-3 pl-4 border-l border-gray-100 dark:border-white/10 shrink-0">
                        <UserMenu />
                    </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-4">
                {/* Sustainability Impact Graph */}
                <div className="h-full min-h-[400px]">
                    <ImpactChart history={user?.history} />
                </div>

                {/* Recent Activity / Tips */}
                <div className="h-full">
                    <CommunityChallenges />
                </div>
            </div>

            {/* Educational & Achievements Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FactsQuizCard />
                <AchievementsHub />
            </div>

            {/* Scan History & Recent Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                <HistorySummaryCard />

                {/* Recent Activity (Moved) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
                >
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Deposited Items</h2>
                    {user?.history && user.history.length > 0 ? (
                        <div className="space-y-4">
                            {user.history.slice(0, 5).map((item: any, i: number) => {
                                // Dynamic Icon Logic
                                let Icon = Recycle;
                                const lowerType = item.itemType ? item.itemType.toLowerCase() : '';
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
