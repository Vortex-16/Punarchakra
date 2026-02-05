"use client";

import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { motion } from 'framer-motion';
import { Calendar, Package, TrendingUp, AlertCircle, Search, Filter } from 'lucide-react';

interface ScanHistoryItem {
    _id: string;
    imageUrl: string;
    itemLabel: string;
    category: string;
    confidence: number;
    value: number;
    weight?: string;
    size?: string;
    createdAt: string;
}

export default function HistoryPage() {
    const { user } = useSession();
    const [history, setHistory] = useState<ScanHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user?._id) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'}/history/${user._id}`)
                .then(res => res.json())
                .then(data => {
                    setHistory(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch history", err);
                    setLoading(false);
                });
        }
    }, [user?._id]);

    const filteredHistory = history.filter(item => 
        item.itemLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-6 md:p-10 space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                   <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                       <TrendingUp className="w-8 h-8 text-emerald-500" />
                       Scan History
                   </h1>
                   <p className="text-gray-500 dark:text-gray-400 mt-1">
                       Track your recycling impact and earnings over time.
                   </p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                       type="text" 
                       placeholder="Search history..." 
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-full md:w-64"
                    />
                </div>
            </header>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                </div>
            ) : filteredHistory.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">No history found</h3>
                    <p className="text-gray-500 text-sm mt-1">Start scanning items to see them here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHistory.map((item, index) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow group"
                        >
                            <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <img 
                                   src={item.imageUrl} 
                                   alt={item.itemLabel} 
                                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-xs font-bold text-white flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">{item.itemLabel}</h3>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide ${item.category === 'electronic' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>
                                        {item.category}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                     <div className="flex items-center justify-between text-sm">
                                         <span className="text-gray-500 dark:text-gray-400">Est. Value</span>
                                         <span className="font-bold text-emerald-600 dark:text-emerald-400">${item.value.toFixed(2)}</span>
                                     </div>
                                     <div className="flex items-center justify-between text-sm">
                                         <span className="text-gray-500 dark:text-gray-400">Verification</span>
                                         {item.confidence > 0.6 ? (
                                             <span className="text-emerald-500 font-bold text-xs flex items-center gap-1">Verified</span>
                                         ) : (
                                             <span className="text-amber-500 font-bold text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Review Needed</span>
                                         )}
                                     </div>
                                     {(item.weight || item.size) && (
                                         <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-800 flex gap-3 text-xs text-gray-400">
                                             {item.weight && <span>{item.weight}kg</span>}
                                             {item.size && <span>{item.size}</span>}
                                         </div>
                                     )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
