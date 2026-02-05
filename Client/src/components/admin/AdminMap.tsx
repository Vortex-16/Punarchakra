"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, DivIcon } from "leaflet";
import { useEffect, useState } from "react";
import { Navigation, Trash2, Battery, Activity, AlertTriangle, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper to update map view
import { useTheme } from "next-themes";

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        const rafId = requestAnimationFrame(() => {
            map.setView(center, zoom);
        });
        return () => cancelAnimationFrame(rafId);
    }, [center, zoom, map]);
    return null;
}

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

interface AdminMapProps {
    bins: Bin[];
    onBinClick?: (bin: Bin) => void;
}

const createAdminBinIcon = (bin: Bin) => {
    let colorClass = "bg-emerald-500"; // Default Active
    let iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`;

    // Status Logic
    if (bin.status === 'maintenance') {
        colorClass = "bg-orange-500";
        iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pen-tool"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>`;
    } else if (bin.status === 'offline' || bin.sensorStatus === 'malfunction') {
        colorClass = "bg-gray-500";
        iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`;
    } else if (bin.fillLevel >= 90 || bin.status === 'full') {
        colorClass = "bg-red-600 animate-pulse";
    } else if (bin.fillLevel >= 50) {
        colorClass = "bg-yellow-500";
    }

    const html = `
        <div class="${colorClass} w-9 h-9 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white relative group">
            ${iconHtml}
             ${bin.fillLevel >= 80 ? '<span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>' : ''}
        </div>
    `;

    return new DivIcon({
        className: 'admin-bin-icon',
        html: html,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
    });
};



import { generateMockRecyclers, generateAdminMockBins, Recycler, AdminBin } from "@/lib/recycler-data";
import { Factory } from "lucide-react";

// ... (existing imports)

export default function AdminMap({ bins: initialBins, onBinClick }: AdminMapProps) {
    const { theme, resolvedTheme } = useTheme();
    const isDarkMode = theme === "dark" || resolvedTheme === "dark";
    const [adminLocation, setAdminLocation] = useState<[number, number] | null>(null);

    // Recycler & Mock Bin State
    const [recyclers, setRecyclers] = useState<Recycler[]>([]);
    const [showRecyclers, setShowRecyclers] = useState(false);
    const [mockBins, setMockBins] = useState<AdminBin[]>([]);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const loc: [number, number] = [position.coords.latitude, position.coords.longitude];
                    setAdminLocation(loc);

                    // Generate recyclers near admin
                    setRecyclers(generateMockRecyclers({ lat: loc[0], lng: loc[1] }));
                    // Generate mock bins near admin
                    setMockBins(generateAdminMockBins({ lat: loc[0], lng: loc[1] }, 8));
                },
                (error) => {
                    console.error("Error getting admin location:", error);
                    // Fallback generation if location fails
                    const fallbackLoc = { lat: 12.9716, lng: 77.5946 };
                    setRecyclers(generateMockRecyclers(fallbackLoc));
                    setMockBins(generateAdminMockBins(fallbackLoc, 8));
                }
            );
        } else {
            const fallbackLoc = { lat: 12.9716, lng: 77.5946 };
            setRecyclers(generateMockRecyclers(fallbackLoc));
            setMockBins(generateAdminMockBins(fallbackLoc, 8));
        }
    }, []);

    // Combine real bins from API and our generated mock bins
    // Cast initialBins to AdminBin[] if types slightly mismatch, or rely on compatibility
    const allBins = [...initialBins, ...mockBins] as unknown as AdminBin[];

    // Priority: Admin Live Location -> First Bin Location -> Default Bengaluru
    const center: [number, number] = adminLocation
        ? adminLocation
        : (initialBins.length > 0 ? [initialBins[0].location.lat, initialBins[0].location.lng] : [12.9716, 77.5946]);

    const recyclerIcon = new DivIcon({
        className: 'bg-transparent',
        html: `
            <div class="w-8 h-8 bg-purple-600 rounded-lg shadow-lg flex items-center justify-center text-white border-2 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7-5-7 5v12Z"/><path d="M17 18h2"/><path d="M12 18h1"/><path d="M17 14h2"/><path d="m17 10 2 1"/><path d="M12 14h1"/><path d="m12 10 1 1"/><path d="M7 14h1"/><path d="m7 10 1 1"/><path d="M7 18h2"/></svg>
            </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    return (
        <div className="h-full w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm relative z-0">
            <MapContainer
                key={`${isDarkMode ? 'dark' : 'light'}-map`}
                center={center}
                zoom={14}
                style={{ height: "100%", width: "100%" }}
            >
                <ChangeView center={center} zoom={14} />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url={isDarkMode
                        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    }
                />

                {/* Admin Live Location Marker */}
                {adminLocation && (
                    <Marker
                        position={adminLocation}
                        icon={new DivIcon({
                            className: "bg-transparent",
                            html: `
                                <div style="position: relative; width: 20px; height: 20px;">
                                    <div style="position: absolute; width: 20px; height: 20px; background: #3B82F6; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);"></div>
                                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
                                </div>
                            `,
                            iconSize: [20, 20],
                            iconAnchor: [10, 10]
                        })}
                    >
                        <Popup className="custom-popup">
                            <div className="font-bold text-xs">You (Admin HQ)</div>
                        </Popup>
                    </Marker>
                )}

                {/* Recyclers Markers */}
                {showRecyclers && recyclers.map((recycler) => (
                    <Marker
                        key={recycler.id}
                        position={[recycler.location.lat, recycler.location.lng]}
                        icon={recyclerIcon}
                    >
                        <Popup className="custom-popup">
                            <div className="p-2 min-w-[200px]">
                                <h3 className="font-bold text-purple-700 dark:text-purple-400 mb-1 flex items-center gap-1">
                                    <Factory className="w-3 h-3" /> {recycler.name}
                                </h3>
                                <p className="text-xs text-gray-500 mb-2">{recycler.location.address}</p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {recycler.types.map(t => (
                                        <span key={t} className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded border border-purple-100">{t}</span>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className={cn("font-bold", recycler.status === 'Open' ? "text-green-600" : "text-red-500")}>
                                        {recycler.status}
                                    </span>
                                    <a href={`tel:${recycler.contact}`} className="text-blue-500 hover:underline">{recycler.contact}</a>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {allBins.map((bin) => (
                    <Marker
                        key={bin._id}
                        position={[bin.location.lat, bin.location.lng]}
                        icon={createAdminBinIcon(bin)}
                        eventHandlers={{
                            click: () => onBinClick && onBinClick(bin),
                        }}
                    >
                        <Popup closeButton={false} className="custom-popup">
                            {/* Empty popup to handle click via marker, or minimal content if needed */}
                            <div className="font-bold text-center text-xs">{bin.location.address}</div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Controls Layer */}
            <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                <button
                    onClick={() => setShowRecyclers(!showRecyclers)}
                    className={cn(
                        "p-3 rounded-xl shadow-lg border transition-all flex items-center justify-center",
                        showRecyclers
                            ? "bg-purple-600 text-white border-purple-700"
                            : "bg-white dark:bg-black/90 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/10"
                    )}
                    title="Toggle Recycling Centers"
                >
                    <Factory className="w-5 h-5" />
                </button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur p-3 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800 text-xs z-[1000]">
                <div className="font-bold mb-2 text-gray-900 dark:text-white">Bin Status</div>
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Active</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div> Filling Up</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div> Critical / Full</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Maintenance</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-500"></div> Offline</div>
                    {showRecyclers && (
                        <div className="flex items-center gap-2 border-t pt-1.5 mt-1.5 border-gray-200 dark:border-gray-700">
                            <div className="w-3 h-3 rounded bg-purple-600 border border-white"></div> Recycler
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
