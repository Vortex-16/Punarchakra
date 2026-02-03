"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Battery, Smartphone, Laptop, Zap, Cable, Search, Navigation, Filter, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Dynamically import Map to avoid SSR issues
// Loading component to show while map loads
const BinMap = dynamic(() => import("@/components/map/BinMap"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 animate-pulse">
            Loading Map...
        </div>
    )
});

const wasteTypes = [
    { id: "all", label: "All Items", icon: Filter },
    { id: "battery", label: "Batteries", icon: Battery },
    { id: "phone", label: "Phones", icon: Smartphone },
    { id: "laptop", label: "Laptops", icon: Laptop },
    { id: "charger", label: "Chargers", icon: Zap },
    { id: "cable", label: "Cables", icon: Cable },
];

const mockBins = [
    { id: 1, lat: 51.505, lng: -0.09, type: ["battery", "phone"], address: "123 Green St, Central", fillLevel: 45 },
    { id: 2, lat: 51.51, lng: -0.1, type: ["laptop", "cable"], address: "45 Tech Ave, North", fillLevel: 80 },
    { id: 3, lat: 51.49, lng: -0.08, type: ["battery", "charger"], address: "78 Eco Rd, South", fillLevel: 20 },
    { id: 4, lat: 51.515, lng: -0.09, type: ["phone", "laptop", "cable"], address: "Community Center", fillLevel: 10 },
    { id: 5, lat: 51.50, lng: -0.12, type: ["battery", "cable", "charger"], address: "Westside Recycling", fillLevel: 95 },
    { id: 6, lat: 51.503, lng: -0.06, type: ["phone", "battery"], address: "East Point Hub", fillLevel: 60 },
];

// Haversine formula for distance
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
};

export default function BinFinderPage() {
    const [selectedType, setSelectedType] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    // Mock user location: London center
    const [userLocation] = useState<{ lat: number; lng: number }>({ lat: 51.505, lng: -0.11 });

    const filteredBins = useMemo(() => {
        let bins = mockBins;

        // Filter by type
        if (selectedType !== "all") {
            bins = bins.filter(bin => bin.type.includes(selectedType));
        }

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            bins = bins.filter(bin =>
                bin.address.toLowerCase().includes(query) ||
                bin.type.some(t => t.includes(query))
            );
        }

        // Calculate distance and sort
        return bins.map(bin => ({
            ...bin,
            distance: calculateDistance(userLocation.lat, userLocation.lng, bin.lat, bin.lng)
        })).sort((a, b) => a.distance - b.distance);
    }, [selectedType, searchQuery, userLocation]);

    return (
        <div className="h-full flex flex-col space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bin Finder</h1>
                    <p className="text-gray-500 dark:text-gray-400">Locate the nearest e-waste recycling point</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by location or waste type..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-forest-green/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <h2 className="text-sm font-semibold text-gray-500 mb-3 px-1">SELECT WASTE TYPE</h2>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                    {wasteTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all font-medium text-sm ${selectedType === type.id
                                ? 'bg-forest-green text-neon-lime shadow-lg shadow-forest-green/20 translate-y-[-2px]'
                                : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:translate-y-[-1px]'
                                }`}
                        >
                            <type.icon className="w-4 h-4" />
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Map Container */}
                <div className="lg:col-span-2 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden relative shadow-inner border border-gray-200 dark:border-gray-700 h-full min-h-[400px]">
                    <BinMap bins={filteredBins} userLocation={userLocation} />

                    {/* Floating Legend */}
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-3 rounded-lg text-xs shadow-lg space-y-2 border border-gray-100 z-[1000]">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
                            <span>Low (&lt;50%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
                            <span>Medium (&lt;80%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                            <span>High (&gt;80%)</span>
                        </div>
                    </div>
                </div>

                {/* List View */}
                <div className="flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden h-full">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                        <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-forest-green" />
                            Nearest Bins ({filteredBins.length})
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {filteredBins.length > 0 ? (
                            filteredBins.map(bin => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={bin.id}
                                    className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-forest-green/30 cursor-pointer transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-forest-green to-neon-lime opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{bin.address}</h3>
                                        <span className="text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full whitespace-nowrap">
                                            {bin.distance.toFixed(1)} km
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {bin.type.slice(0, 3).map(t => (
                                            <span key={t} className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">
                                                {t}
                                            </span>
                                        ))}
                                        {bin.type.length > 3 && (
                                            <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">+{bin.type.length - 3}</span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50 dark:border-gray-700">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-gray-200 overflow-hidden">
                                                <div className={`h-full w-full ${bin.fillLevel > 80 ? 'bg-red-500' : 'bg-forest-green'}`}></div>
                                            </div>
                                            <span className="text-xs text-gray-500">{bin.fillLevel}% Full</span>
                                        </div>
                                        <button className="text-forest-green hover:text-forest-green/80 transition-colors">
                                            <ArrowRight className="w-4 h-4 bg-forest-green/10 p-0.5 rounded-full" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-400">
                                <MapPin className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                <p>No bins found matching your criteria</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
