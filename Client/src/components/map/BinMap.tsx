"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, DivIcon } from "leaflet";
import { useEffect } from "react";
import { Navigation } from "lucide-react";

// Helper to update map view when center changes
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface Bin {
  id: number;
  lat: number;
  lng: number;
  type: string[];
  address: string;
  fillLevel: number;
  distance?: number;
}

interface BinMapProps {
  bins: Bin[];
  userLocation: { lat: number; lng: number } | null;
}

const createBinIcon = (fillLevel: number) => {
    // Color code based on fill level
    let colorClass = "bg-[#10B981]"; // Green
    if (fillLevel > 50) colorClass = "bg-[#F59E0B]"; // Yellow
    if (fillLevel > 80) colorClass = "bg-[#EF4444]"; // Red

    const html = `
        <div class="${colorClass} w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
        </div>
    `;

    return new DivIcon({
        className: 'custom-bin-icon',
        html: html,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
};

const userIcon = new DivIcon({
    className: 'user-icon',
    html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

export default function BinMap({ bins, userLocation }: BinMapProps) {
  const center: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : [51.505, -0.09];

  return (
    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%", zIndex: 0 }}>
      {/* ChangeView helper to react to prop changes */}
      <ChangeView center={center} zoom={13} />
      
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
           <Popup>You are here</Popup>
        </Marker>
      )}
      
      {bins.map((bin) => (
        <Marker key={bin.id} position={[bin.lat, bin.lng]} icon={createBinIcon(bin.fillLevel)}>
          <Popup className="custom-popup">
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-gray-900 mb-1">{bin.address}</h3>
              <div className="flex flex-wrap gap-1 mb-2">
                  {bin.type.map(t => (
                      <span key={t} className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">{t}</span>
                  ))}
              </div>
              <div className="flex justify-between items-center text-sm mb-3">
                  <span className="text-gray-500">Fill Status:</span>
                  <span className={`font-bold ${bin.fillLevel > 80 ? 'text-red-500' : 'text-forest-green'}`}>{bin.fillLevel}%</span>
              </div>
              <button className="w-full py-1.5 bg-forest-green text-neon-lime rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <Navigation className="w-3 h-3" /> Navigate
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
