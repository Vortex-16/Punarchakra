"use client";

import { useState } from "react";
import { Truck, MapPin, Navigation, ArrowRight, Play, CheckCircle } from "lucide-react";
import dynamic from 'next/dynamic';
import { cn } from "@/lib/utils";

// Reuse AdminMap for route visualization (could add polyline support later)
const AdminMap = dynamic(() => import('@/components/admin/AdminMap'), { ssr: false });

export default function RoutesPage() {
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [routeGenerated, setRouteGenerated] = useState(false);

    // Mock data for Route Optimization
    const criticalBins = [
        { _id: '1', location: { address: '123 Main St', lat: 22.5726, lng: 88.3639 }, fillLevel: 95, status: 'full' },
        { _id: '2', location: { address: '45 Park Ave', lat: 22.56, lng: 88.35 }, fillLevel: 88, status: 'active' },
        { _id: '3', location: { address: 'Sector V', lat: 22.58, lng: 88.42 }, fillLevel: 92, status: 'full' },
    ];

    const generateRoute = () => {
        setIsOptimizing(true);
        // Simulate algorithm delay
        setTimeout(() => {
            setIsOptimizing(false);
            setRouteGenerated(true);
        }, 2000);
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-6">
            {/* Sidebar Controls */}
            <div className="w-full lg:w-96 h-[45%] lg:h-auto bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col shadow-sm">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Truck className="w-6 h-6 text-emerald-600" /> Route Optimizer
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        AI-powered route generation based on fill levels and traffic data.
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">3</div>
                            <div className="text-xs text-gray-500 font-semibold uppercase">Trucks Available</div>
                        </div>
                        <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl">
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{criticalBins.length}</div>
                            <div className="text-xs text-gray-500 font-semibold uppercase">Critical Stops</div>
                        </div>
                    </div>

                    {/* Pending Collections List */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Pending Collections</h3>
                        <div className="space-y-3">
                            {criticalBins.map((bin, i) => (
                                <div key={bin._id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0 text-xs font-bold">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate text-gray-900 dark:text-white">{bin.location.address}</p>
                                        <p className="text-xs text-red-500 font-medium">{bin.fillLevel}% Full</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                    {!routeGenerated ? (
                        <button
                            onClick={generateRoute}
                            disabled={isOptimizing}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isOptimizing ? (
                                <>Processing Algorithm...</>
                            ) : (
                                <><Play className="w-5 h-5 fill-current" /> Generate Optimized Route</>
                            )}
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm text-center font-medium border border-green-200 dark:border-green-800">
                                Route Verified & Ready
                            </div>
                            <button className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                <Navigation className="w-4 h-4" /> Dispatch to Drivers
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 bg-gray-100 dark:bg-neutral-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 relative">
                {/* Reuse AdminMap but pass critical bins only */}
                {/* For MVP we are not drawing polyline but we could if we had a routing engine */}
                {/* Currently passing 'any' casted bins to match interface roughly for visual check */}
                <div className="absolute inset-0 z-0">
                    <AdminMap bins={criticalBins as any} />
                </div>

                {routeGenerated && (
                    <div className="absolute top-4 left-4 z-[1000] bg-white/90 dark:bg-black/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg border-l-4 border-emerald-500">
                        <p className="text-xs font-bold text-gray-500 uppercase">Total Efficiency</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">12.4 km • 45 mins</p>
                    </div>
                )}
            </div>
        </div>
    );
}
