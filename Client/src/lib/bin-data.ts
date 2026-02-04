import { Battery, Smartphone, Laptop, Cable, Monitor, Printer } from "lucide-react";

export type WasteType = "Battery" | "Phone" | "Laptop" | "Cable" | "Monitor" | "Printer" | "Other";

export interface Bin {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  acceptedTypes: WasteType[];
  status: "Open" | "Full" | "Closed";
  fillLevel: number; // 0-100%
}

export const WASTE_TYPES: { type: WasteType; icon: React.ElementType; label: string }[] = [
  { type: "Battery", icon: Battery, label: "Batteries" },
  { type: "Phone", icon: Smartphone, label: "Phones" },
  { type: "Laptop", icon: Laptop, label: "Laptops" },
  { type: "Cable", icon: Cable, label: "Cables" },
  { type: "Monitor", icon: Monitor, label: "Monitors" },
  { type: "Printer", icon: Printer, label: "Printers" },
];

// Helper to get random coord around center
function getRandomLocation(center: { lat: number; lng: number }, radiusKm: number) {
  const y0 = center.lat;
  const x0 = center.lng;
  const rd = radiusKm / 111300; // about 111300 meters in one degree

  const u = Math.random();
  const v = Math.random();
  const w = rd * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);

  const newLat = y + y0;
  const newLng = x + x0;

  return { lat: newLat, lng: newLng };
}

export function generateMockBins(center: { lat: number; lng: number }): Bin[] {
  const newBins: Bin[] = [];
  const count = 5 + Math.floor(Math.random() * 5); // 5 to 10 bins

  for (let i = 0; i < count; i++) {
    const loc = getRandomLocation(center, 3000); // 3km radius
    const types: WasteType[] = [];
    // Random types
    const numTypes = 1 + Math.floor(Math.random() * 4);
    for (let j = 0; j < numTypes; j++) {
      const randomType = WASTE_TYPES[Math.floor(Math.random() * WASTE_TYPES.length)].type;
      if (!types.includes(randomType)) types.push(randomType);
    }

    newBins.push({
      id: `dynamic-${i}`,
      name: `E-Waste Point #${i + 1}`,
      location: {
        lat: loc.lat,
        lng: loc.lng,
        address: `${(Math.random() * 2).toFixed(1)}km away`, // simplified address
      },
      acceptedTypes: types,
      status: Math.random() > 0.8 ? "Full" : (Math.random() > 0.9 ? "Closed" : "Open"),
      fillLevel: Math.floor(Math.random() * 100),
    });
  }
  return newBins;
}

export const MOCK_BINS: Bin[] = [
  {
    id: "1",
    name: "City Centre E-Waste Point",
    location: { lat: 12.9716, lng: 77.5946, address: "MG Road, Bengaluru" },
    acceptedTypes: ["Battery", "Phone", "Laptop", "Cable"],
    status: "Open",
    fillLevel: 45,
  },
];

// Haversine formula to calculate distance in km
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Number(d.toFixed(1));
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

// Format distance for display (meters vs kilometers)
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
}

// Calculate estimated travel time (walking at ~5km/h)
export function estimateTravelTime(distanceKm: number): string {
  const walkingSpeedKmH = 5;
  const timeHours = distanceKm / walkingSpeedKmH;
  const timeMinutes = Math.round(timeHours * 60);

  if (timeMinutes < 60) {
    return `${timeMinutes} min walk`;
  }
  const hours = Math.floor(timeMinutes / 60);
  const mins = timeMinutes % 60;
  return mins > 0 ? `${hours}h ${mins}m walk` : `${hours}h walk`;
}

// Get status color based on bin properties
export function getBinStatusColor(bin: Bin): { bg: string; text: string; border: string } {
  if (bin.status === "Closed") {
    return {
      bg: "bg-gray-100 dark:bg-gray-800",
      text: "text-gray-700 dark:text-gray-300",
      border: "border-gray-300 dark:border-gray-600"
    };
  }
  if (bin.status === "Full" || bin.fillLevel > 80) {
    return {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-400",
      border: "border-red-300 dark:border-red-700"
    };
  }
  if (bin.fillLevel > 50) {
    return {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-300 dark:border-amber-700"
    };
  }
  return {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-400",
    border: "border-green-300 dark:border-green-700"
  };
}

