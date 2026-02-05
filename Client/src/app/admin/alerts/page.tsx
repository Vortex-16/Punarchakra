"use client";

import { useEffect, useState } from "react";
import {
    AlertTriangle, CheckCircle, Clock, Filter,
    MoreHorizontal, Search, Trash2, XCircle, Activity as ActivityIcon,
    ShieldAlert, Zap, BatteryLow, WifiOff, MapPin, ChevronRight,
    ArrowUpRight, AlertCircle, RefreshCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/useSession";
import { motion, AnimatePresence } from "framer-motion";

interface Alert {
    _id: string;
    binId: {
        _id: string;
        location: { address: string };
    };
    type: 'full' | 'battery_low' | 'sensor_error' | 'maintenance' | 'network_failure';
    priority: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    status: 'open' | 'resolved' | 'ignored';
    createdAt: string;
    resolvedBy?: { name: string };
}

export default function AlertsPage() {
    const { session, isAuthenticated } = useSession();
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('open');
    const [searchQuery, setSearchQuery] = useState("");

    const fetchAlerts = async () => {
        if (!session?.accessToken) return;

        try {
            setLoading(true);
            const query = filter === 'all' ? '' : `?status=${filter}`;
            const res = await fetch(`http://localhost:5000/api/alerts${query}`, {
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`
                }
            });
            const data = await res.json();

            if (Array.isArray(data)) {
                setAlerts(data);
            } else {
                setAlerts([]);
            }
        } catch (error) {
            console.error("Failed to fetch alerts", error);
            setAlerts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchAlerts();
        }
    }, [filter, isAuthenticated, session?.accessToken]);

    const handleResolve = async (id: string) => {
        if (!session?.accessToken) return;

        try {
            await fetch(`http://localhost:5000/api/alerts/${id}/resolve`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`
                }
            });
            setAlerts(prev => prev.map(a => a._id === id ? { ...a, status: 'resolved' as const } : a));
        } catch (error) {
            console.error("Failed to resolve alert", error);
        }
    };

    const getPriorityStyles = (priority: string) => {
        switch (priority) {
            case 'critical': return 'bg-red-500/10 text-red-600 border-red-200 dark:border-red-900/50 dark:text-red-400';
            case 'high': return 'bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-900/50 dark:text-orange-400';
            case 'medium': return 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900/50 dark:text-amber-400';
            default: return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900/50 dark:text-blue-400';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'full': return <AlertTriangle className="w-4 h-4" />;
            case 'battery_low': return <BatteryLow className="w-4 h-4" />;
            case 'sensor_error': return <ActivityIcon className="w-4 h-4" />;
            case 'network_failure': return <WifiOff className="w-4 h-4" />;
            default: return <Settings className="w-4 h-4" />;
        }
    };

    const filteredAlerts = alerts.filter(alert =>
        alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.binId?.location.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        total: alerts.length,
        critical: alerts.filter(a => a.priority === 'critical' && a.status === 'open').length,
        high: alerts.filter(a => a.priority === 'high' && a.status === 'open').length,
        resolved: alerts.filter(a => a.status === 'resolved').length
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Incident Reports</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-emerald-500" />
                        System Integrity & Operational Alerts
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search incidents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl w-full sm:w-64 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm font-medium"
                        />
                    </div>
                    <button
                        onClick={fetchAlerts}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold text-sm shadow-xl shadow-gray-900/10 hover:-translate-y-0.5 transition-all"
                    >
                        <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
                        Refresh Logs
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Active Alerts', value: stats.total - stats.resolved, icon: AlertCircle, color: 'emerald', trend: 'Live' },
                    { label: 'Critical Priority', value: stats.critical, icon: Zap, color: 'red', trend: stats.critical > 0 ? '+ Emergency' : 'Cleared' },
                    { label: 'High Priority', value: stats.high, icon: ArrowUpRight, color: 'orange', trend: 'Needs Attention' },
                    { label: 'Resolved Today', value: stats.resolved, icon: CheckCircle, color: 'blue', trend: 'Completed' }
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-[#111] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("p-3 rounded-2xl", {
                                'bg-emerald-500/10 text-emerald-500': stat.color === 'emerald',
                                'bg-red-500/10 text-red-500': stat.color === 'red',
                                'bg-orange-500/10 text-orange-500': stat.color === 'orange',
                                'bg-blue-500/10 text-blue-500': stat.color === 'blue',
                            })}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:bg-emerald-500 group-hover:text-white transition-all")}>
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 lowercase">{stat.label}</h3>
                        <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Filters Toggles */}
            <div className="flex items-center gap-2 bg-gray-100/50 dark:bg-white/5 p-1.5 rounded-2xl w-fit border border-gray-200/50 dark:border-white/5">
                {[
                    { id: 'open', label: 'Active Logs', icon: ActivityIcon },
                    { id: 'resolved', label: 'Resolved Cases', icon: CheckCircle },
                    { id: 'all', label: 'Complete Archive', icon: Filter }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id as any)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                            filter === tab.id
                                ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-lg"
                                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Alerts List */}
            <div className="bg-white dark:bg-[#111] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden relative min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Incident Details</th>
                                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Node Identifier</th>
                                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Severity</th>
                                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
                                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Operational Flow</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/5 text-sm">
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Retrieving encrypted logs...</p>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ) : filteredAlerts.length === 0 ? (
                                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <td colSpan={5} className="px-8 py-32 text-center text-gray-500">
                                            <div className="max-w-xs mx-auto flex flex-col items-center">
                                                <div className="w-20 h-20 bg-emerald-500/5 rounded-full flex items-center justify-center mb-6">
                                                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                                                </div>
                                                <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tight line-clamp-1 truncate">Status: Nominal</h4>
                                                <p className="text-sm font-medium text-gray-500">No active incidents detected in this operational sector. System integrity is 100%.</p>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ) : (
                                    filteredAlerts.map((alert, i) => (
                                        <motion.tr
                                            key={alert._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all group cursor-default"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-start gap-4">
                                                    <div className={cn("mt-1 p-2.5 rounded-2xl shrink-0 transition-transform group-hover:scale-110",
                                                        alert.priority === 'critical' ? "bg-red-500 text-white shadow-xl shadow-red-500/20" :
                                                            alert.priority === 'high' ? "bg-orange-500 text-white shadow-xl shadow-orange-500/20" :
                                                                "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300"
                                                    )}>
                                                        {getTypeIcon(alert.type)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-gray-900 dark:text-white leading-tight mb-1 group-hover:text-emerald-500 transition-colors">{alert.message}</p>
                                                        <p className="text-[10px] font-bold text-gray-400 flex items-center gap-2 uppercase tracking-wider">
                                                            <Clock className="w-3 h-3" /> {new Date(alert.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                                        <MapPin className="w-4 h-4 text-emerald-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-white text-xs">{alert.binId?.location.address.split(',')[0]}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium truncate max-w-[120px]">{alert.binId?.location.address.split(',')[1] || 'Bangalore'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={cn("px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all", getPriorityStyles(alert.priority))}>
                                                    {alert.priority}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn("w-2 h-2 rounded-full animate-pulse", alert.status === 'open' ? "bg-emerald-500" : "bg-gray-400")} />
                                                    <span className={cn("text-xs font-bold", alert.status === 'open' ? "text-emerald-600" : "text-gray-400 uppercase tracking-tighter")}>
                                                        {alert.status === 'open' ? 'Live Track' : 'Concluded'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {alert.status === 'open' ? (
                                                    <button
                                                        onClick={() => handleResolve(alert._id)}
                                                        className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-2xl shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 ml-auto"
                                                    >
                                                        Resolve Task <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <div className="flex flex-col items-end opacity-40">
                                                        <span className="text-[10px] font-black uppercase text-gray-400">Handled by Ops</span>
                                                        <span className="text-[10px] font-medium text-gray-400">Incident Closed</span>
                                                    </div>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const Settings = ({ className }: { className?: string }) => <ActivityIcon className={className} />;
