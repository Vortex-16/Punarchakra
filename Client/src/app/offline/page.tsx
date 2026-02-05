"use client";

import { WifiOff, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function OfflineFallback() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-4">
            <div className="text-center space-y-6 max-w-md">

                {/* Animated Icon */}
                <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                    <div className="absolute inset-0 bg-red-100 dark:bg-red-900/20 rounded-full animate-pulse" />
                    <WifiOff className="w-12 h-12 text-red-500 relative z-10" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        You are Offline
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        It looks like you've lost your internet connection.
                        Check your network and try again.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Try Reconnecting
                    </button>

                    <Link
                        href="/"
                        className="px-6 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                </div>

            </div>
        </div>
    );
}
