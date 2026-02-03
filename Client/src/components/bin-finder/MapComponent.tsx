"use client";

import dynamic from "next/dynamic";
import { Bin } from "@/lib/bin-data";

const MapInner = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center animate-pulse">
      <span className="text-gray-500 dark:text-gray-400 font-medium">Loading Map...</span>
    </div>
  ),
});

interface MapComponentProps {
  userLocation: { lat: number; lng: number } | null;
  bins: Bin[];
  selectedBin: Bin | null;
  onSelectBin: (bin: Bin) => void;
}

export default function MapComponent(props: MapComponentProps) {
  return <MapInner {...props} />;
}
