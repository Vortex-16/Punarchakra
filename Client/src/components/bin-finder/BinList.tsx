"use client";

import { Bin, calculateDistance } from "@/lib/bin-data";
import { Navigation, MapPin, Battery } from "lucide-react";
import { cn } from "@/lib/utils";

interface BinListProps {
  bins: Bin[];
  userLocation: { lat: number; lng: number } | null;
  onNavigate: (bin: Bin) => void;
  onSelectBin: (bin: Bin) => void;
}

export default function BinList({ bins, userLocation, onNavigate, onSelectBin }: BinListProps) {
  // Sort bins by distance if user location is available
  const sortedBins = userLocation
    ? [...bins].sort((a, b) => {
        const distA = calculateDistance(userLocation.lat, userLocation.lng, a.location.lat, a.location.lng);
        const distB = calculateDistance(userLocation.lat, userLocation.lng, b.location.lat, b.location.lng);
        return distA - distB;
      })
    : bins;

  if (sortedBins.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500 dark:text-gray-400">
        <p>No bins found for the selected waste type.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 h-[500px] overflow-y-auto pr-2">
      {sortedBins.map((bin) => {
        const distance = userLocation
          ? calculateDistance(userLocation.lat, userLocation.lng, bin.location.lat, bin.location.lng)
          : null;

        return (
          <div
            key={bin.id}
            onClick={() => onSelectBin(bin)}
            className="group relative flex flex-col gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-forest-green dark:hover:border-forest-green hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{bin.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> {bin.location.address}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-1 rounded-full",
                    bin.status === "Open"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  )}
                >
                  {bin.status}
                </span>
                {distance !== null && (
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{distance} km</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 flex-wrap">
              {bin.acceptedTypes.map((type) => (
                <span key={type} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                  {type}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Battery className={cn("w-4 h-4", bin.fillLevel > 80 ? "text-red-500" : "text-green-500")} />
                <span>{bin.fillLevel}% Full</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(bin);
                }}
                className="flex items-center gap-1 text-sm font-semibold text-forest-green hover:text-forest-green/80 hover:underline z-10"
              >
                <Navigation className="w-4 h-4" /> Navigate
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
