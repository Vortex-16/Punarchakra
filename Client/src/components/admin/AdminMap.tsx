"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, DivIcon } from "leaflet";
import { useEffect, useState } from "react";
import { Navigation, Trash2, Battery, Activity, AlertTriangle, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper to update map view
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
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

export default function AdminMap({ bins, onBinClick }: AdminMapProps) {
    // Default to London or existing data center, assumes data has lat/lng
    const center: [number, number] = bins.length > 0 ? [bins[0].location.lat, bins[0].location.lng] : [22.5726, 88.3639]; // Default Kolkata / Demo

    return (
        <div className="h-full w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm relative z-0">
            <MapContainer center={center} zoom={14} style={{ height: "100%", width: "100%" }}>
                <ChangeView center={center} zoom={14} />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    className="dark:invert dark:grayscale dark:contrast-75" // Dark mode map hack
                />

                {bins.map((bin) => (
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

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur p-3 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800 text-xs z-[1000]">
                <div className="font-bold mb-2 text-gray-900 dark:text-white">Bin Status</div>
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Active</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div> Filling Up</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div> Critical / Full</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Maintenance</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-500"></div> Offline</div>
                </div>
            </div>
        </div>
    );
}
