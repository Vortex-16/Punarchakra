"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Cloud, Star } from "lucide-react";
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
        return <div className="w-20 h-10 rounded-full bg-gray-200" />;
    }

    return (
        <button
            onClick={toggleTheme}
            className={`cursor-pointer relative w-24 h-11 rounded-full p-1 transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-forest-green/50 overflow-hidden shadow-inner ${isDark ? "shadow-black/50" : "shadow-blue-200"}`}
            aria-label="Toggle Theme"
        >
            {/* Dynamic Background */}
            <motion.div
                className="absolute inset-0"
                animate={{
                    backgroundColor: isDark ? "#0F172A" : "#60A5FA", // Dark Slate vs Sky Blue
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            {/* Scenery Container */}
            <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                {/* Clouds (Light Mode) */}
                <motion.div
                     animate={{ 
                         y: isDark ? 20 : 0,
                         opacity: isDark ? 0 : 1 
                     }}
                     transition={{ duration: 0.4 }}
                     className="absolute inset-0"
                >
                    <Cloud className="absolute top-1 left-2 w-4 h-4 text-white fill-white opacity-90" />
                    <Cloud className="absolute bottom-1 left-8 w-5 h-5 text-white fill-white opacity-80" />
                    <Cloud className="absolute top-2 right-4 w-3 h-3 text-white fill-white opacity-60" />
                </motion.div>

                {/* Stars (Dark Mode) */}
                 <motion.div
                     animate={{ 
                         y: isDark ? 0 : -20,
                         opacity: isDark ? 1 : 0 
                     }}
                     transition={{ duration: 0.4 }}
                     className="absolute inset-0"
                >
                    <Star className="absolute top-2 left-3 w-2 h-2 text-yellow-100 fill-yellow-100 opacity-80 animate-pulse" />
                    <Star className="absolute bottom-3 left-7 w-1.5 h-1.5 text-white fill-white opacity-60" />
                    <Star className="absolute top-1 right-8 w-2.5 h-2.5 text-yellow-100 fill-yellow-100 opacity-90 animate-pulse" style={{ animationDelay: "0.5s" }} /> 
                    <Star className="absolute bottom-2 right-3 w-1 h-1 text-white fill-white opacity-50" />
                </motion.div>
            </div>

            {/* Moving Circle (Sun <-> Moon) */}
            <motion.div
                layout
                animate={{
                    x: isDark ? 48 : 0,
                    // Rotation removed to emphasize the rising/setting vertical motion
                    rotate: isDark ? 0 : 0 
                }}
                transition={{
                    type: "spring",
                    stiffness: 700,
                    damping: 30
                }}
                className="relative w-9 h-9 rounded-full shadow-lg flex items-center justify-center z-10 bg-transparent overflow-hidden"
            >
                {/* Sun Face */}
                 <motion.div
                     // Sun sets (goes down) when dark, rises (comes up) when light
                     animate={{ opacity: isDark ? 0 : 1, y: isDark ? 20 : 0 }}
                     transition={{ duration: 0.3 }}
                     className="absolute inset-0 bg-yellow-400 rounded-full flex items-center justify-center"
                >
                   {/* Simple Sun Glow/Rays */}
                </motion.div>

                {/* Moon Face */}
                <motion.div
                     // Moon rises (comes up) when dark, sets (goes down) when light
                     animate={{ opacity: isDark ? 1 : 0, y: isDark ? 0 : 20 }}
                     transition={{ duration: 0.3 }}
                     className="absolute inset-0 bg-slate-200 rounded-full flex items-center justify-center"
                >
                     {/* Craters */}
                     <div className="absolute top-2 right-2 w-2 h-2 bg-slate-400/30 rounded-full" />
                     <div className="absolute bottom-2 left-3 w-1.5 h-1.5 bg-slate-400/30 rounded-full" />
                     <div className="absolute top-4 left-2 w-2.5 h-2.5 bg-slate-400/30 rounded-full" />
                </motion.div>
                
            </motion.div>

        </button>
    );
}
