"use client";

import { useEffect, useState } from "react";
import { Bin, MOCK_BINS, WasteType, generateMockBins } from "@/lib/bin-data";
import WasteTypeSelector from "@/components/bin-finder/WasteTypeSelector";
import BinList from "@/components/bin-finder/BinList";
import MapComponent from "@/components/bin-finder/MapComponent";
import { MapPin, Sparkles } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function BinFinderPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedWasteType, setSelectedWasteType] = useState<WasteType | null>(null);
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const [allBins, setAllBins] = useState<Bin[]>(MOCK_BINS);
  const [filteredBins, setFilteredBins] = useState<Bin[]>(MOCK_BINS);

  // Get user location on mount and generate bins
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);

          // Generate dynamic bins around user
          const dynamicBins = generateMockBins(loc);
          setAllBins(dynamicBins);
          setFilteredBins(dynamicBins);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Filter bins when waste type changes
  useEffect(() => {
    if (selectedWasteType) {
      const type = selectedWasteType;
      const filtered = allBins.filter((bin) =>
        bin.acceptedTypes.includes(type)
      );
      setFilteredBins(filtered);
    } else {
      setFilteredBins(allBins);
    }
    setSelectedBin(null);
  }, [selectedWasteType, allBins]);

  const handleNavigate = (bin: Bin) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${bin.location.lat},${bin.location.lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-forest-green flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bin Finder</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Locate nearest e-waste collection points</p>
          </div>
        </div>
        <ModeToggle />
      </div>

      {/* Waste Type Selection */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-forest-green text-white font-bold text-sm">
            1
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Select Waste Type</h2>
        </div>
        <WasteTypeSelector
          selectedType={selectedWasteType}
          onSelect={setSelectedWasteType}
        />
      </section>

      {/* Map and List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bin List */}
        <div className="lg:col-span-1 flex flex-col h-150 border-2 border-green-100 dark:border-neutral-700 rounded-2xl overflow-hidden bg-green-50 dark:bg-neutral-900 shadow-lg">
          <div className="p-4 border-b-2 border-green-100 dark:border-neutral-700 bg-green-100/50 dark:bg-neutral-800">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-forest-green text-white font-bold text-sm">
                2
              </div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Nearest Bins</h2>
            </div>
          </div>
          <div className="flex-1 overflow-hidden p-4">
            <BinList
              bins={filteredBins}
              userLocation={userLocation}
              onNavigate={handleNavigate}
              onSelectBin={setSelectedBin}
            />
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-2 h-150 rounded-2xl overflow-hidden border-2 border-green-100 dark:border-neutral-700 shadow-lg relative">
          <MapComponent
            userLocation={userLocation}
            bins={filteredBins}
            selectedBin={selectedBin}
            onSelectBin={setSelectedBin}
          />
          {!userLocation && (
            <div className="absolute top-4 right-4 bg-white dark:bg-gray-900 p-3 rounded-xl text-sm shadow-xl z-1000 border-2 border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-forest-green" />
              <span className="text-gray-700 dark:text-gray-300">Enable location for better results</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
