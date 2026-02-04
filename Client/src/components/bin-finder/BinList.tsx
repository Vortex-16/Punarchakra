"use client";

import { Bin, calculateDistance, formatDistance, estimateTravelTime, getBinStatusColor } from "@/lib/bin-data";
import { Navigation, MapPin, Clock, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/contexts/FavoritesContext";
import BinQRCode from "./BinQRCode";

interface BinListProps {
  bins: Bin[];
  userLocation: { lat: number; lng: number } | null;
  onNavigate: (bin: Bin) => void;
  onSelectBin: (bin: Bin) => void;
}

export default function BinList({ bins, userLocation, onNavigate, onSelectBin }: BinListProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

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
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <MapPin className="w-10 h-10 text-gray-400 dark:text-gray-500" />
        </div>
        <p className="text-gray-900 dark:text-white font-semibold mb-2">No bins found</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Try selecting a different waste type or clear filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
      {sortedBins.map((bin) => {
        const distance = userLocation
          ? calculateDistance(userLocation.lat, userLocation.lng, bin.location.lat, bin.location.lng)
          : null;

        const statusColors = getBinStatusColor(bin);

        return (
          <div
            key={bin.id}
            onClick={() => onSelectBin(bin)}
            className="group relative flex flex-col gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-forest-green dark:hover:border-forest-green hover:shadow-lg transition-all cursor-pointer"
          >
            {/* Favorite Badge */}
            {isFavorite(bin.id) && (
              <div className="absolute top-2 right-2 z-10 bg-red-500 text-white p-1 rounded-full">
                <Heart className="w-3 h-3 fill-current" />
              </div>
            )}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{bin.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> {bin.location.address}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-1 rounded-full",
                    statusColors.bg,
                    statusColors.text
                  )}
                >
                  {bin.status}
                </span>
                {distance !== null && (
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                    {formatDistance(distance)}
                  </span>
                )}
              </div>
            </div>

            {/* Accepted Waste Types */}
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 flex-wrap">
              {bin.acceptedTypes.map((type) => (
                <span
                  key={type}
                  className="bg-forest-green/10 text-forest-green dark:bg-forest-green/20 px-2 py-0.5 rounded border border-forest-green/30 dark:border-forest-green/40 font-medium"
                >
                  {type}
                </span>
              ))}
            </div>

            {/* Fill Level Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Capacity</span>
                <span className={cn(
                  "font-bold",
                  bin.fillLevel > 80 ? "text-red-500" :
                    bin.fillLevel > 50 ? "text-amber-500" :
                      "text-green-500"
                )}>
                  {bin.fillLevel}% Full
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all rounded-full",
                    bin.fillLevel > 80 ? "bg-red-500" :
                      bin.fillLevel > 50 ? "bg-amber-500" :
                        "bg-green-500"
                  )}
                  style={{ width: `${bin.fillLevel}%` }}
                />
              </div>
            </div>

            {/* Footer with Actions */}
            <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-200 dark:border-gray-700 gap-2">
              <div className="flex items-center gap-2">
                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(bin.id);
                  }}
                  className={cn(
                    "p-1.5 rounded-lg transition-all",
                    isFavorite(bin.id)
                      ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      : "text-gray-400 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                  title={isFavorite(bin.id) ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={cn("w-4 h-4", isFavorite(bin.id) && "fill-current")} />
                </button>

                {/* QR Code */}
                <div onClick={(e) => e.stopPropagation()}>
                  <BinQRCode bin={bin} />
                </div>

                {distance !== null && (
                  <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{estimateTravelTime(distance)}</span>
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(bin);
                }}
                className="flex items-center gap-1 text-sm font-semibold text-forest-green hover:text-forest-green/80 hover:underline z-10 transition-all"
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

