"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

interface BinSearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function BinSearchBar({ value, onChange, placeholder = "Search by name or address..." }: BinSearchBarProps) {
    return (
        <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-forest-green dark:focus:border-forest-green focus:ring-2 focus:ring-forest-green/20 outline-none transition-all"
            />
            {value && (
                <button
                    onClick={() => onChange("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}
