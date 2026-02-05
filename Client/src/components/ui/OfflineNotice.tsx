"use client";

import React from 'react';
import { CloudOff, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfflineNoticeProps {
  message?: string;
  variant?: 'info' | 'warning';
  showSync?: boolean;
  syncCount?: number;
}

export function OfflineNotice({ 
  message = 'Viewing cached data (offline)', 
  variant = 'info',
  showSync = false,
  syncCount = 0 
}: OfflineNoticeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm",
        variant === 'info' && "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300",
        variant === 'warning' && "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
      )}
    >
      <CloudOff className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1">{message}</span>
      
      {showSync && syncCount > 0 && (
        <div className="flex items-center gap-1 text-xs px-2 py-1 bg-white/50 dark:bg-black/20 rounded-md">
          <RotateCw className="w-3 h-3" />
          <span>{syncCount} pending</span>
        </div>
      )}
    </div>
  );
}
