"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import { Bin } from "@/lib/bin-data";
import L from "leaflet";
import { useEffect } from "react";
import { Navigation, MapPin, Trash2 } from "lucide-react";
import MapControls from "./MapControls";

interface MapInnerProps {
  userLocation: { lat: number; lng: number } | null;
  bins: Bin[];
  selectedBin: Bin | null;
  onSelectBin: (bin: Bin) => void;
  onLocateUser?: () => void;
}

// Component to fly to selected bin or user location
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1 });
  }, [center, zoom, map]);
  return null;
}

// Create custom bin icon based on fill level and status
function createBinIcon(bin: Bin) {
  let bgColor = "#10B981"; // green
  let shadowColor = "rgba(16, 185, 129, 0.4)";

  if (bin.status === "Closed") {
    bgColor = "#6B7280"; // gray
    shadowColor = "rgba(107, 114, 128, 0.4)";
  } else if (bin.status === "Full" || bin.fillLevel > 80) {
    bgColor = "#EF4444"; // red
    shadowColor = "rgba(239, 68, 68, 0.4)";
  } else if (bin.fillLevel > 50) {
    bgColor = "#F59E0B"; // amber
    shadowColor = "rgba(245, 158, 11, 0.4)";
  }

  const html = `
    <div style="position: relative;">
      <div style="
        width: 36px;
        height: 36px;
        background: ${bgColor};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px ${shadowColor};
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"/>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          <line x1="10" x2="10" y1="11" y2="17"/>
          <line x1="14" x2="14" y1="11" y2="17"/>
        </svg>
      </div>
      <div style="
        position: absolute;
        bottom: -4px;
        right: -4px;
        background: white;
        border-radius: 50%;
        padding: 2px 6px;
        font-size: 9px;
        font-weight: bold;
        color: ${bgColor};
        border: 2px solid ${bgColor};
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      ">${bin.fillLevel}%</div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-bin-marker',
    html: html,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
}

export default function MapInner({ userLocation, bins, selectedBin, onSelectBin, onLocateUser }: MapInnerProps) {
  const defaultCenter: [number, number] = [12.9716, 77.5946]; // Bengaluru default
  const center = selectedBin
    ? [selectedBin.location.lat, selectedBin.location.lng] as [number, number]
    : userLocation
      ? [userLocation.lat, userLocation.lng] as [number, number]
      : defaultCenter;

  const zoom = selectedBin ? 15 : 12;

  // Custom user location icon with pulsing animation
  const userIcon = L.divIcon({
    className: "bg-transparent",
    html: `
      <div style="position: relative; width: 20px; height: 20px;">
        <div style="
          position: absolute;
          width: 20px;
          height: 20px;
          background: #3B82F6;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        "></div>
      </div>
      <style>
        @keyframes pulse-ring {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
        }
      </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  const handleNavigate = (bin: Bin) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${bin.location.lat},${bin.location.lng}`;
    window.open(url, "_blank");
  };

  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      className="w-full h-full rounded-2xl z-0"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController center={center} zoom={zoom} />

      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup className="custom-popup">
            <div className="p-2 min-w-[180px]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Your Location</h3>
              </div>
              <p className="text-xs text-gray-500">You are here</p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Cluster bins for better performance */}
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={60}
        spiderfyOnMaxZoom
        showCoverageOnHover={false}
      >
        {bins.map((bin) => (
          <Marker
            key={bin.id}
            position={[bin.location.lat, bin.location.lng]}
            icon={createBinIcon(bin)}
            eventHandlers={{
              click: () => onSelectBin(bin),
            }}
          >
            <Popup className="custom-popup" maxWidth={280}>
              <div className="p-3 min-w-[250px]">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-base mb-1">{bin.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {bin.location.address}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ml-2 ${bin.status === "Open"
                    ? "bg-green-100 text-green-700"
                    : bin.status === "Full"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                    }`}>
                    {bin.status}
                  </span>
                </div>

                {/* Accepted Types */}
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Accepts:</p>
                  <div className="flex flex-wrap gap-1">
                    {bin.acceptedTypes.map((type) => (
                      <span
                        key={type}
                        className="text-xs bg-forest-green/10 text-forest-green px-2 py-0.5 rounded-md border border-forest-green/20 font-medium"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Fill Level */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-600">Capacity</span>
                    <span className={`text-xs font-bold ${bin.fillLevel > 80 ? "text-red-600" :
                      bin.fillLevel > 50 ? "text-amber-600" :
                        "text-green-600"
                      }`}>
                      {bin.fillLevel}% Full
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all rounded-full ${bin.fillLevel > 80 ? "bg-red-500" :
                        bin.fillLevel > 50 ? "bg-amber-500" :
                          "bg-green-500"
                        }`}
                      style={{ width: `${bin.fillLevel}%` }}
                    />
                  </div>
                </div>

                {/* Navigate Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigate(bin);
                  }}
                  className="w-full py-2 bg-forest-green hover:bg-forest-green/90 text-white rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Navigation className="w-4 h-4" />
                  Navigate Here
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>

      {/* Map Controls */}
      <MapControls onLocateUser={onLocateUser} />
    </MapContainer>
  );
}
