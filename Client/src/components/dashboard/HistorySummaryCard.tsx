"use client";

import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { motion } from 'framer-motion';
import { History, ArrowRight, Loader2, Package } from 'lucide-react';
import Link from 'next/link';

// Reuse interface or import shared type
interface ScanHistoryItem {
    _id: string;
    imageUrl: string;
    itemLabel: string;
    category: string;
    value: number;
    createdAt: string;
}

export function HistorySummaryCard() {
    const { user } = useSession();
    const [history, setHistory] = useState<ScanHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?._id) {
            // Ideally backend supports ?limit=5, but we can slice client side for prototype speed
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'}/history/${user._id}`)
                .then(res => res.json())
                .then(data => {
                    setHistory(data.slice(0, 5));
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch history", err);
                    setLoading(false);
                });
        }
    }, [user?._id]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 h-full flex flex-col"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <History className="w-5 h-5 text-emerald-500" /> Recent Scans
                </h2>
                <Link 
                    href="/dashboard/history" 
                    className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 transition-colors"
                >
                    View All <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500/50" />
                </div>
            ) : history.length > 0 ? (
                <div className="space-y-4">
                    {history.map((item) => (
                        <div key={item._id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-black/40 transition-colors group cursor-pointer">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0 border border-gray-100 dark:border-gray-700">
                                <img src={item.imageUrl} alt={item.itemLabel} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm truncate text-gray-900 dark:text-gray-100">{item.itemLabel}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{item.category}</p>
                            </div>
                            <div className="text-right">
                                <span className="font-bold text-emerald-600 dark:text-emerald-500 text-sm block">${item.value.toFixed(2)}</span>
                                <span className="text-[10px] text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-500 dark:text-gray-400">
                    <Package className="w-10 h-10 mb-3 opacity-20" />
                    <p className="text-sm">No scans yet.</p>
                    <Link href="/scan" className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold transition-colors">
                        Scan Item
                    </Link>
                </div>
            )}
        </motion.div>
    );
}
