"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Bin } from "@/lib/bin-data";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default marker icon in Leaflet with Webpack/Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapInnerProps {
  userLocation: { lat: number; lng: number } | null;
  bins: Bin[];
  selectedBin: Bin | null;
  onSelectBin: (bin: Bin) => void;
}

// Component to fly to selected bin or user location
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapInner({ userLocation, bins, selectedBin, onSelectBin }: MapInnerProps) {
  const defaultCenter: [number, number] = [12.9716, 77.5946]; // Bengaluru default
  const center = selectedBin
    ? [selectedBin.location.lat, selectedBin.location.lng] as [number, number]
    : userLocation
    ? [userLocation.lat, userLocation.lng] as [number, number]
    : defaultCenter;

  const zoom = selectedBin ? 15 : 12;

  // Custom user location icon
  const userIcon = L.divIcon({
    className: "bg-transparent",
    html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg pulse-ring"></div>`,
  });

  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      className="w-full h-full rounded-2xl z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController center={center} zoom={zoom} />

      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {bins.map((bin) => (
        <Marker
          key={bin.id}
          position={[bin.location.lat, bin.location.lng]}
          eventHandlers={{
            click: () => onSelectBin(bin),
          }}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-bold">{bin.name}</h3>
              <p className="text-xs text-muted-foreground">{bin.location.address}</p>
              <div className="flex gap-1 mt-1 flex-wrap">
                {bin.acceptedTypes.slice(0, 3).map(t => (
                  <span key={t} className="text-[10px] bg-gray-100 px-1 rounded">{t}</span>
                ))}
                {bin.acceptedTypes.length > 3 && <span className="text-[10px] text-gray-400">+{bin.acceptedTypes.length - 3}</span>}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
