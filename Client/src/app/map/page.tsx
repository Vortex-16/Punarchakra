"use client";

import { useEffect, useState } from "react";
import { Bin, MOCK_BINS, WasteType, generateMockBins, calculateDistance } from "@/lib/bin-data";
import WasteTypeSelector from "@/components/bin-finder/WasteTypeSelector";
import BinList from "@/components/bin-finder/BinList";
import MapComponent from "@/components/bin-finder/MapComponent";
import BinSearchBar from "@/components/bin-finder/BinSearchBar";
import BinStats from "@/components/bin-finder/BinStats";
import BinSortMenu, { SortOption } from "@/components/bin-finder/BinSortMenu";
import { MapPin, Sparkles, X, Loader2, Smartphone } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useToast } from "@/components/ui/toast";
import Link from "next/link";

export default function BinFinderPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedWasteType, setSelectedWasteType] = useState<WasteType | null>(null);
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const [allBins, setAllBins] = useState<Bin[]>(MOCK_BINS);
  const [filteredBins, setFilteredBins] = useState<Bin[]>(MOCK_BINS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("distance");
  const { showToast } = useToast();

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
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Geolocation Error Detail:", {
            code: error.code,
            message: error.message,
          });
          setIsLoadingLocation(false);
        }
      );
    } else {
      setIsLoadingLocation(false);
    }
  }, []);

  // Filter and sort bins
  useEffect(() => {
    let filtered = allBins;

    // Filter by waste type
    if (selectedWasteType) {
      filtered = filtered.filter((bin) =>
        bin.acceptedTypes.includes(selectedWasteType)
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (bin) =>
          bin.name.toLowerCase().includes(query) ||
          bin.location.address.toLowerCase().includes(query)
      );
    }

    // Sort bins
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "distance" && userLocation) {
        const distA = calculateDistance(userLocation.lat, userLocation.lng, a.location.lat, a.location.lng);
        const distB = calculateDistance(userLocation.lat, userLocation.lng, b.location.lat, b.location.lng);
        return distA - distB;
      } else if (sortBy === "capacity") {
        return a.fillLevel - b.fillLevel; // Lower fill level first
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    setFilteredBins(sorted);
    setSelectedBin(null);
  }, [selectedWasteType, searchQuery, allBins, sortBy, userLocation]);

  const handleNavigate = (bin: Bin) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${bin.location.lat},${bin.location.lng}`;
    window.open(url, "_blank");
  };

  const handleClearFilters = () => {
    setSelectedWasteType(null);
    setSearchQuery("");
  };

  const handleLocateUser = () => {
    if ("geolocation" in navigator) {
      showToast("info", "Locating...", "Getting your current location");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);
          const dynamicBins = generateMockBins(loc);
          setAllBins(dynamicBins);
          showToast("success", "Location updated", "Found your current position");
        },
        (error) => {
          console.error("Geolocation Manual Locate Error:", {
            code: error.code,
            message: error.message,
          });

          let errorMsg = "Could not get your location";
          if (error.code === error.PERMISSION_DENIED) {
            errorMsg = "Location permission denied. Please enable it in browser settings.";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMsg = "Location information is unavailable.";
          } else if (error.code === error.TIMEOUT) {
            errorMsg = "Location request timed out.";
          }

          showToast("error", "Location error", errorMsg);
        }
      );
    } else {
      showToast("warning", "Not supported", "Geolocation is not available");
    }
  };

  const activeFiltersCount = (selectedWasteType ? 1 : 0) + (searchQuery ? 1 : 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-forest-green flex items-center justify-center shadow-lg shadow-forest-green/20">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bin Finder</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Locate nearest e-waste collection points</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/smart-bin"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-forest-green text-white hover:bg-forest-green/90 transition-colors font-semibold"
          >
            <Smartphone className="w-4 h-4" />
            Smart Bin
          </Link>
          <ModeToggle />
        </div>
      </div>

      {/* Statistics Cards */}
      <BinStats bins={filteredBins} userLocation={userLocation} />

      {/* Waste Type Selection */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-forest-green text-white font-bold text-sm">
              1
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Select Waste Type</h2>
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-forest-green hover:bg-forest-green/10 dark:hover:bg-forest-green/20 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear Filters ({activeFiltersCount})
            </button>
          )}
        </div>
        <WasteTypeSelector
          selectedType={selectedWasteType}
          onSelect={setSelectedWasteType}
        />
      </section>

      {/* Search Bar */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-forest-green text-white font-bold text-sm">
            2
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Search Bins</h2>
        </div>
        <BinSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name or address..."
        />
      </section>

      {/* Map and List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bin List */}
        <div className="lg:col-span-1 flex flex-col h-[600px] border-2 border-green-100 dark:border-neutral-700 rounded-2xl overflow-hidden bg-green-50 dark:bg-neutral-900 shadow-lg">
          <div className="p-4 border-b-2 border-green-100 dark:border-neutral-700 bg-green-100/50 dark:bg-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-forest-green text-white font-bold text-sm">
                  3
                </div>
                <h2 className="font-semibold text-gray-900 dark:text-white">Nearest Bins</h2>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {filteredBins.length} found
              </span>
            </div>
            <BinSortMenu
              currentSort={sortBy}
              onSortChange={(sort) => {
                setSortBy(sort);
                showToast("success", "Sorted", `Bins sorted by ${sort}`);
              }}
              disabled={filteredBins.length === 0}
            />
          </div>
          <div className="flex-1 overflow-hidden p-4">
            {isLoadingLocation ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-forest-green animate-spin mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading nearby bins...</p>
              </div>
            ) : (
              <BinList
                bins={filteredBins}
                userLocation={userLocation}
                onNavigate={handleNavigate}
                onSelectBin={setSelectedBin}
              />
            )}
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-2 h-[600px] rounded-2xl overflow-hidden border-2 border-green-100 dark:border-neutral-700 shadow-lg relative">
          <MapComponent
            userLocation={userLocation}
            bins={filteredBins}
            selectedBin={selectedBin}
            onSelectBin={setSelectedBin}
            onLocateUser={handleLocateUser}
          />
          {!userLocation && !isLoadingLocation && (
            <div className="absolute top-4 right-4 bg-white dark:bg-gray-900 p-3 rounded-xl text-sm shadow-xl z-1000 border-2 border-gray-200 dark:border-gray-700 flex items-center gap-2 max-w-xs">
              <Sparkles className="w-4 h-4 text-forest-green flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">Enable location for personalized results</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

