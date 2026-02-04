"use client";

import { useSession, signOut } from "next-auth/react";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function UserMenu() {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (status === "loading") {
        return (
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        );
    }

    if (!session) {
        return (
            <Link
                href="/login"
                className="px-4 py-2 bg-forest-green text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
            >
                Sign In
            </Link>
        );
    }

    return (
        <div ref={menuRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white font-bold text-sm">
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
                    {session.user?.name || "User"}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {session.user?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {session.user?.email}
                        </p>
                    </div>

                    <div className="py-2">
                        <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <User className="w-4 h-4" />
                            My Profile
                        </Link>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
