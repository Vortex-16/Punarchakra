"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import { Bin } from "@/lib/bin-data";
import L from "leaflet";
import { useEffect } from "react";
import { Navigation, MapPin, Trash2 } from "lucide-react";
import MapControls from "./MapControls";
import { useTheme } from "next-themes";

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
  const isCritical = bin.status === "Full" || bin.fillLevel > 80;
  const isAmber = !isCritical && bin.fillLevel > 50;
  const isClosed = bin.status === "Closed";

  let mainColor = "#10B981"; // green
  if (isClosed) mainColor = "#6B7280";
  if (isCritical) mainColor = "#EF4444";
  if (isAmber) mainColor = "#F59E0B";

  const glowClass = isCritical ? "critical-glow" : (isAmber ? "amber-glow" : "");

  const html = `
    <div class="bin-marker-wrapper ${glowClass}">
      <div class="bin-3d">
        <div class="bin-head"></div>
        <div class="bin-body">
          <div class="bin-label">${bin.fillLevel}%</div>
        </div>
        <div class="bin-side"></div>
      </div>
      <style>
        .bin-marker-wrapper {
          position: relative;
          width: 40px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        @keyframes glow-pulse {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.5); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.6; }
        }

        .critical-glow::before {
          content: '';
          position: absolute;
          width: 60px;
          height: 60px;
          background: radial-gradient(circle, rgba(239, 68, 68, 0.8) 0%, rgba(239, 68, 68, 0) 70%);
          border-radius: 50%;
          z-index: -1;
          animation: glow-pulse 2s infinite ease-in-out;
        }

        .amber-glow::before {
          content: '';
          position: absolute;
          width: 50px;
          height: 50px;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.6) 0%, rgba(245, 158, 11, 0) 70%);
          border-radius: 50%;
          z-index: -1;
        }

        .bin-3d {
          position: relative;
          width: 24px;
          height: 36px;
          background: #f3f4f6;
          border-radius: 4px;
          box-shadow: inset -4px 0 0 rgba(0,0,0,0.1), 2px 4px 8px rgba(0,0,0,0.2);
          border: 1px solid rgba(0,0,0,0.1);
        }

        .bin-head {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 8px;
          background: #1f2937;
          border-radius: 3px 3px 0 0;
        }

        .bin-body {
           height: 100%;
           display: flex;
           align-items: flex-end;
           justify-content: center;
           padding-bottom: 4px;
        }

        .bin-label {
          font-size: 8px;
          font-weight: 900;
          color: ${mainColor};
          background: white;
          padding: 1px 3px;
          border-radius: 2px;
          border: 1px solid ${mainColor}44;
        }

        .bin-side {
          position: absolute;
          right: -2px;
          top: 4px;
          width: 4px;
          height: 28px;
          background: #374151;
          border-radius: 0 2px 2px 0;
          transform: skewY(5deg);
        }
      </style>
    </div>
  `;

  return L.divIcon({
    className: 'custom-bin-marker-v2',
    html: html,
    iconSize: [40, 50],
    iconAnchor: [20, 45],
    popupAnchor: [0, -45]
  });
}

export default function MapInner({ userLocation, bins, selectedBin, onSelectBin, onLocateUser }: MapInnerProps) {
  const { theme, resolvedTheme } = useTheme();
  const isDarkMode = theme === "dark" || resolvedTheme === "dark";
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
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url={isDarkMode
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        }
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
