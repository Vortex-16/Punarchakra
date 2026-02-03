"use client";

import { WASTE_TYPES, WasteType } from "@/lib/bin-data";
import { cn } from "@/lib/utils";

interface WasteTypeSelectorProps {
  selectedType: WasteType | null;
  onSelect: (type: WasteType) => void;
}

export default function WasteTypeSelector({ selectedType, onSelect }: WasteTypeSelectorProps) {
  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex gap-3 md:grid md:grid-cols-6 min-w-max md:min-w-0">
        {WASTE_TYPES.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedType === item.type;

          return (
            <button
              key={item.type}
              onClick={() => onSelect(item.type)}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 min-w-[110px]",
                isSelected
                  ? "bg-forest-green text-white border-forest-green shadow-xl shadow-forest-green/30 scale-105"
                  : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-forest-green dark:hover:border-forest-green hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
            >
              <Icon className={cn("w-8 h-8 mb-2", isSelected ? "animate-pulse" : "")} />
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
