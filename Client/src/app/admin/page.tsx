"use client";

import { useEffect, useState } from "react";
import { AdminStatsCard } from "@/components/admin/AdminStatsCard";
import {
    Trash2, Truck, AlertTriangle, Activity,
    MapPin, ArrowRight, DollarSign, Users, Battery, Settings
} from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { binsApi, BinStats } from "@/lib/bins-api";

// Mock Data for Charts (Replace with real API data later if possible)
const usageData = [
    { name: 'Mon', active: 45, full: 5 },
    { name: 'Tue', active: 52, full: 8 },
    { name: 'Wed', active: 48, full: 12 },
    { name: 'Thu', active: 61, full: 7 },
    { name: 'Fri', active: 55, full: 15 },
    { name: 'Sat', active: 67, full: 20 },
    { name: 'Sun', active: 70, full: 18 },
];

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<BinStats>({
        totalBins: 0,
        activeBins: 0,
        fullBins: 0,
        maintenanceBins: 0,
        criticalBins: [],
        avgFillLevel: 0,
        totalWasteKg: 0,
        totalEstimatedValue: 0,
        activeUserCount: 0
    });
    const [usageData, setUsageData] = useState([
        { name: 'Mon', active: 45, full: 5 },
        { name: 'Tue', active: 52, full: 8 },
        { name: 'Wed', active: 48, full: 12 },
        { name: 'Thu', active: 61, full: 7 },
        { name: 'Fri', active: 55, full: 15 },
        { name: 'Sat', active: 67, full: 20 },
        { name: 'Sun', active: 70, full: 18 },
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await binsApi.getStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchAnalytics = async () => {
            try {
                const data = await binsApi.getAnalytics();
                if (data && data.length > 0) {
                    setUsageData(data);
                }
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            }
        };

        fetchStats();
        fetchAnalytics();
        const interval = setInterval(() => {
            fetchStats();
            fetchAnalytics();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 pb-2">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Mission Control</h1>
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium">Real-time overview of city-wide waste management.</p>
                </div>
                <div className="flex gap-4 items-center self-start md:self-auto">
                    <Link href="/admin/map" className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 text-sm shadow-md">
                        <MapPin className="w-4 h-4" /> Live Map View
                    </Link>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminStatsCard
                    title="Economic Impact"
                    value={loading ? "..." : `₹${stats.totalEstimatedValue?.toLocaleString() || 0}`}
                    trend="+₹2.4k today"
                    trendUp={true}
                    icon={DollarSign}
                    color="green"
                />
                <AdminStatsCard
                    title="User Engagement"
                    value={loading ? "..." : `${stats.activeUserCount?.toLocaleString() || 0}`}
                    trend="Active 30d"
                    trendUp={true}
                    icon={Users}
                    color="blue"
                />
                <AdminStatsCard
                    title="Total Waste Recovery"
                    value={loading ? "..." : `${stats.totalWasteKg?.toLocaleString() || 0} kg`}
                    trend="Target: 5k"
                    trendUp={true}
                    icon={Trash2}
                    color="orange"
                />
                <AdminStatsCard
                    title="System Health"
                    value={loading ? "..." : `${stats.activeBins} / ${stats.totalBins}`}
                    trend={stats.criticalBins?.length > 0 ? `${stats.criticalBins.length} Alerts` : "Optimal"}
                    trendUp={stats.criticalBins?.length === 0}
                    icon={Activity}
                    color={stats.criticalBins?.length > 0 ? "red" : "green"}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white dark:bg-[#111] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Weekly Collection Activity</h2>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={usageData}>
                                <defs>
                                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="active" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Critical Alerts List */}
                <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Critical Bins</h2>
                        <Link href="/admin/alerts" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <p className="text-center text-gray-500 py-4">Loading insights...</p>
                        ) : stats.criticalBins?.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Activity className="w-6 h-6 text-green-500" />
                                </div>
                                <p>All systems normal</p>
                            </div>
                        ) : (
                            stats.criticalBins?.map((bin: any, index: number) => (
                                <div key={bin._id} className="flex items-center gap-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center shrink-0 font-bold text-sm">
                                        {bin.fillLevel}%
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 dark:text-white truncate">Bin #{bin._id.slice(-4)}</p>
                                        <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                                            {bin.fillLevel >= 90 ? 'Critically Full' :
                                                bin.batteryLevel < 20 ? 'Battery Critical' :
                                                    bin.sensorStatus === 'malfunction' ? 'Sensor Malfunction' : 'High Usage'}
                                        </p>
                                    </div>
                                    <Link href={`/admin/map?focus=${bin._id}`} className="p-2 hover:bg-white dark:hover:bg-black/20 rounded-lg transition-colors">
                                        <ArrowRight className="w-4 h-4 text-gray-400" />
                                    </Link>
                                </div>
                            ))
                        )}

                        {/* Mock data backup if empty for demo feeling */}
                        {!loading && stats.criticalBins?.length === 0 && (
                            <div className="flex items-center gap-4 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 opacity-60">
                                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center shrink-0 font-bold text-sm">
                                    85%
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 dark:text-white truncate">Bin #Demo-12</p>
                                    <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">High Usage Detected</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="w-full mt-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                        <Truck className="w-4 h-4" /> Dispatch Collection
                    </button>
                </div>
            </div>
        </div>
    );
}
