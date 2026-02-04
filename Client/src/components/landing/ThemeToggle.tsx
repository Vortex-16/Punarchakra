"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Cloud } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark");
    };

    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-20 h-10 rounded-full bg-gray-200" />; // Placeholder to avoid layout shift
    }

    return (
        <button
            onClick={toggleTheme}
            className={`cursor-pointer relative w-20 h-10 rounded-full p-1 transition-colors duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-forest-green/50 ${isDark ? "bg-[#0f172a]" : "bg-[#87CEEB]"
                }`}
            aria-label="Toggle Theme"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
                {/* Clouds for Light Mode */}
                <motion.div
                    animate={{ opacity: isDark ? 0 : 1, x: isDark ? 20 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <Cloud className="absolute top-2 left-8 w-4 h-4 text-white opacity-80" />
                    <Cloud className="absolute bottom-1 left-4 w-3 h-3 text-white opacity-60" />
                    <Cloud className="absolute top-1 right-3 w-5 h-5 text-white opacity-90" />
                </motion.div>

                {/* Stars for Dark Mode */}
                <motion.div
                    animate={{ opacity: isDark ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <div className="absolute top-2 left-3 w-1 h-1 bg-white rounded-full opacity-80" />
                    <div className="absolute bottom-3 left-6 w-0.5 h-0.5 bg-white rounded-full opacity-60" />
                    <div className="absolute top-3 right-8 w-1 h-1 bg-white rounded-full opacity-70" />
                    <div className="absolute bottom-2 right-4 w-0.5 h-0.5 bg-white rounded-full opacity-50" />
                </motion.div>
            </div>

            {/* The Toggle Circle (Sun/Moon) */}
            <motion.div
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                className={`relative w-8 h-8 rounded-full shadow-lg flex items-center justify-center z-10 ${isDark ? "bg-slate-200 translate-x-10" : "bg-yellow-400 translate-x-0"
                    }`}
            >
                <motion.div
                    initial={false}
                    animate={{ opacity: isDark ? 0 : 1, scale: isDark ? 0 : 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <Sun className="w-5 h-5 text-yellow-100" />
                </motion.div>

                <motion.div
                    initial={false}
                    animate={{ opacity: isDark ? 1 : 0, scale: isDark ? 1 : 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    {/* Craters for Moon */}
                    <div className="w-1.5 h-1.5 bg-slate-400/30 rounded-full absolute top-2 right-2" />
                    <div className="w-1 h-1 bg-slate-400/30 rounded-full absolute bottom-2 left-3" />
                    <div className="w-2 h-2 bg-slate-400/30 rounded-full absolute top-4 left-2" />
                </motion.div>
            </motion.div>
        </button>
    );
}
