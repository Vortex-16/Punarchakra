"use client";

import { ArrowUpDown, MapPin, Battery, SortAsc } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type SortOption = "distance" | "capacity" | "name";

interface BinSortMenuProps {
    currentSort: SortOption;
    onSortChange: (sort: SortOption) => void;
    disabled?: boolean;
}

export default function BinSortMenu({ currentSort, onSortChange, disabled }: BinSortMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    const sortOptions: { value: SortOption; label: string; icon: typeof MapPin }[] = [
        { value: "distance", label: "Distance", icon: MapPin },
        { value: "capacity", label: "Capacity", icon: Battery },
        { value: "name", label: "Name", icon: SortAsc },
    ];

    const currentOption = sortOptions.find((opt) => opt.value === currentSort);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-forest-green dark:hover:border-forest-green transition-all text-sm font-medium text-gray-700 dark:text-gray-300",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
            >
                <ArrowUpDown className="w-4 h-4" />
                Sort: {currentOption?.label}
            </button>

            {isOpen && !disabled && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full mt-2 right-0 w-48 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden">
                        {sortOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        onSortChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left",
                                        currentSort === option.value && "bg-forest-green/10 dark:bg-forest-green/20"
                                    )}
                                >
                                    <Icon className={cn(
                                        "w-4 h-4",
                                        currentSort === option.value ? "text-forest-green" : "text-gray-500 dark:text-gray-400"
                                    )} />
                                    <span className={cn(
                                        "text-sm font-medium",
                                        currentSort === option.value ? "text-forest-green" : "text-gray-700 dark:text-gray-300"
                                    )}>
                                        {option.label}
                                    </span>
                                    {currentSort === option.value && (
                                        <span className="ml-auto text-forest-green">✓</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
