"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import { Loader2, X, Battery, Signal, Zap, History, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamically import Map with no SSR
const AdminMap = dynamic(() => import('@/components/admin/AdminMap'), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-[#111] animate-pulse rounded-2xl"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
});

interface Bin {
    _id: string;
    location: {
        address: string;
        lat: number;
        lng: number;
    };
    type: string[];
    fillLevel: number;
    batteryLevel?: number;
    sensorStatus?: 'ok' | 'malfunction';
    status: 'active' | 'full' | 'maintenance' | 'offline';
    lastCollection?: string;
}

export default function AdminMapPage() {
    const [bins, setBins] = useState<Bin[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBin, setSelectedBin] = useState<Bin | null>(null);

    useEffect(() => {
        const fetchBins = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/bins');
                const data = await res.json();
                setBins(data);
            } catch (error) {
                console.error("Failed to fetch bins", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBins();
    }, []);

    return (
        <div className="flex h-[calc(100vh-64px)] md:h-[calc(100vh-100px)] gap-6 relative">
            <div className="flex-1 h-full w-full">
                <AdminMap bins={bins} onBinClick={setSelectedBin} />
            </div>

            {/* Slide-over Detailed Panel */}
            <div className={cn(
                "fixed sm:absolute inset-x-0 bottom-0 sm:inset-y-4 sm:right-4 w-full sm:w-96 h-[70vh] sm:h-auto bg-white dark:bg-[#111] rounded-t-3xl sm:rounded-2xl shadow-2xl border-t sm:border border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out z-[1001] flex flex-col overflow-hidden",
                selectedBin ? "translate-y-0 sm:translate-x-0" : "translate-y-full sm:translate-x-[110%]"
            )}>
                {selectedBin && (
                    <>
                        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start bg-gray-50 dark:bg-white/5">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedBin.location.address}</h2>
                                <p className="text-xs text-gray-500 font-mono mt-1">ID: {selectedBin._id}</p>
                            </div>
                            <button onClick={() => setSelectedBin(null)} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 space-y-6">
                            {/* Status Cards */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-2 mb-2 text-gray-500 text-xs font-semibold uppercase">
                                        <Battery className="w-3 h-3" /> Battery
                                    </div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                                        {selectedBin.batteryLevel || 100}%
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-2 mb-2 text-gray-500 text-xs font-semibold uppercase">
                                        <Signal className="w-3 h-3" /> Sensor
                                    </div>
                                    <div className={cn("text-lg font-bold", selectedBin.sensorStatus === 'malfunction' ? "text-red-500" : "text-emerald-500")}>
                                        {selectedBin.sensorStatus === 'malfunction' ? 'Error' : 'Healthy'}
                                    </div>
                                </div>
                            </div>

                            {/* Fill Level Big Indicator */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Real-time Fill Level</h3>
                                <div className="relative h-40 bg-gray-100 dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                                    <div
                                        className={cn(
                                            "absolute bottom-0 left-0 right-0 transition-all duration-1000",
                                            selectedBin.fillLevel > 80 ? "bg-red-500" : "bg-emerald-500"
                                        )}
                                        style={{ height: `${selectedBin.fillLevel}%` }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                        <span className="text-4xl font-bold text-gray-900 dark:text-white mix-blend-difference">{selectedBin.fillLevel}%</span>
                                    </div>

                                    {/* Grid Lines */}
                                    <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-20 pointer-events-none">
                                        <div className="border-b border-black dark:border-white w-full"></div>
                                        <div className="border-b border-black dark:border-white w-full"></div>
                                        <div className="border-b border-black dark:border-white w-full"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Waste Types */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Accepted Waste</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedBin.type.map(t => (
                                        <span key={t} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold uppercase border border-emerald-100 dark:border-emerald-900/30">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 space-y-3">
                                <button className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                    <Truck className="w-4 h-4" /> Dispatch Collection
                                </button>
                                <button className="w-full py-3 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                                    <Zap className="w-4 h-4" /> Run Diagnostics
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
