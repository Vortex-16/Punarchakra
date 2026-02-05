"use client";

import React from 'react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function OfflineBanner() {
    const isOffline = useOfflineStatus();

    return (
        <AnimatePresence>
            {isOffline && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 bg-neutral-900/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-neutral-900 rounded-full shadow-2xl border border-white/10"
                >
                    <WifiOff className="w-5 h-5 animate-pulse" />
                    <span className="font-semibold text-sm">You are currently offline</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
