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
    <div className="space-y-4 md:space-y-8 pb-6">
      {/* Header - Fixed at top on mobile */}
      <div className="fixed md:relative top-0 left-0 right-0 z-40 bg-white dark:bg-gray-950 pb-4 md:pb-0 px-6 md:px-0 pt-6 md:pt-0 shadow-sm md:shadow-none">
        <div className="flex items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-forest-green flex items-center justify-center shadow-lg shadow-forest-green/20 shrink-0">
              <MapPin className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white truncate">Bin Finder</h1>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1 truncate">Locate nearest e-waste collection points</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">

            <ModeToggle />
          </div>
        </div>
      </div>

      {/* Add top padding on mobile to account for fixed header */}
      <div className="h-20 md:h-0"></div>

      {/* Statistics Cards */}
      <BinStats bins={filteredBins} userLocation={userLocation} />

      {/* Waste Type Selection */}
      <section className="space-y-3 md:space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-forest-green text-white font-bold text-xs md:text-sm">
              1
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Select Waste Type</h2>
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium text-forest-green hover:bg-forest-green/10 dark:hover:bg-forest-green/20 transition-colors"
            >
              <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Clear Filters ({activeFiltersCount})</span>
              <span className="sm:hidden">Clear ({activeFiltersCount})</span>
            </button>
          )}
        </div>
        <WasteTypeSelector
          selectedType={selectedWasteType}
          onSelect={setSelectedWasteType}
        />
      </section>

      {/* Search Bar */}
      <section className="space-y-3 md:space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-forest-green text-white font-bold text-xs md:text-sm">
            2
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Search Bins</h2>
        </div>
        <BinSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name or address..."
        />
      </section>

      {/* Map and List Grid - Mobile First, Tablet Side-by-Side */}
      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-5 lg:grid-cols-3 md:gap-4 lg:gap-6">
        {/* Bin List - Full width on mobile, 2/5 on tablet, 1/3 on desktop */}
        <div className="md:col-span-2 lg:col-span-1 flex flex-col h-[500px] md:h-[700px] lg:h-[600px] border-2 border-green-100 dark:border-neutral-700 rounded-2xl overflow-hidden bg-green-50 dark:bg-neutral-900 shadow-lg">
          <div className="p-3 md:p-4 border-b-2 border-green-100 dark:border-neutral-700 bg-green-100/50 dark:bg-neutral-800">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-forest-green text-white font-bold text-xs md:text-sm">
                  3
                </div>
                <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Nearest Bins</h2>
              </div>
              <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
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
          <div className="flex-1 overflow-hidden p-3 md:p-4">
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

        {/* Map - Full width on mobile, 3/5 on tablet, 2/3 on desktop */}
        <div className="md:col-span-3 lg:col-span-2 h-[400px] md:h-[700px] lg:h-[600px] rounded-2xl overflow-hidden border-2 border-green-100 dark:border-neutral-700 shadow-lg relative">
          <MapComponent
            userLocation={userLocation}
            bins={filteredBins}
            selectedBin={selectedBin}
            onSelectBin={setSelectedBin}
            onLocateUser={handleLocateUser}
          />
          {!userLocation && !isLoadingLocation && (
            <div className="absolute top-3 md:top-4 right-3 md:right-4 bg-white dark:bg-gray-900 p-2.5 md:p-3 rounded-xl text-xs md:text-sm shadow-xl z-1000 border-2 border-gray-200 dark:border-gray-700 flex items-center gap-2 max-w-[200px] md:max-w-xs">
              <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-forest-green flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">Enable location for personalized results</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

