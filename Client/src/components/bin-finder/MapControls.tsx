"use client";

import { MapPin, Plus, Minus, Navigation as NavigationIcon } from "lucide-react";
import { useMap } from "react-leaflet";

interface MapControlsProps {
    onLocateUser?: () => void;
}

export default function MapControls({ onLocateUser }: MapControlsProps) {
    const map = useMap();

    const handleZoomIn = () => {
        map.zoomIn();
    };

    const handleZoomOut = () => {
        map.zoomOut();
    };

    const handleLocate = () => {
        if (onLocateUser) {
            onLocateUser();
        }
    };

    return (
        <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-2">
            {/* Locate Me Button */}
            {onLocateUser && (
                <button
                    onClick={handleLocate}
                    className="w-10 h-10 rounded-lg bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center group"
                    title="Find my location"
                >
                    <NavigationIcon className="w-5 h-5 text-forest-green group-hover:scale-110 transition-transform" />
                </button>
            )}

            {/* Zoom Controls */}
            <div className="flex flex-col rounded-lg bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 shadow-lg overflow-hidden">
                <button
                    onClick={handleZoomIn}
                    className="w-10 h-10 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center border-b border-gray-300 dark:border-gray-700"
                    title="Zoom in"
                >
                    <Plus className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
                <button
                    onClick={handleZoomOut}
                    className="w-10 h-10 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
                    title="Zoom out"
                >
                    <Minus className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
            </div>
        </div>
    );
}
