"use client";

import React from 'react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import { WifiOff, RotateCw, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function OfflineBanner() {
    const isOffline = useOfflineStatus();
    const { queueLength, isSyncing, manualSync } = useOfflineQueue();
    
    const showBanner = isOffline || queueLength > 0;

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 bg-neutral-900/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-neutral-900 rounded-full shadow-2xl border border-white/10"
                >
                    {isOffline ? (
                        <>
                            <WifiOff className="w-5 h-5 animate-pulse" />
                            <span className="font-semibold text-sm">You are currently offline</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="font-semibold text-sm">Back online</span>
                        </>
                    )}
                    
                    {queueLength > 0 && (
                        <button
                            onClick={manualSync}
                            disabled={isSyncing}
                            className="flex items-center gap-2 ml-2 pl-2 border-l border-white/20 text-xs opacity-80 hover:opacity-100 transition-opacity disabled:opacity-50"
                        >
                            <RotateCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                            <span>{queueLength} pending</span>
                        </button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
