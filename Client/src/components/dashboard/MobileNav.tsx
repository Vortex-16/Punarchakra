"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Map, BarChart3, Users, Settings, Award } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
    { icon: LayoutDashboard, label: "Home", href: "/" },
    { icon: Map, label: "Map", href: "/map" },
    { icon: Award, label: "Rewards", href: "/rewards" },
    { icon: BarChart3, label: "Stats", href: "/analytics" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden flex justify-center">
            <motion.nav
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-forest-green/80 backdrop-blur-md border border-white/20 text-white rounded-2xl shadow-xl shadow-forest-green/20 px-6 py-3 flex items-center justify-between gap-6 max-w-sm w-full"
            >
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative flex flex-col items-center justify-center gap-1 group"
                        >
                            <div className={cn(
                                "p-2 rounded-xl transition-all duration-300",
                                isActive ? "bg-white text-forest-green shadow-sm translate-y-[-4px]" : "text-white/70 group-hover:text-white"
                            )}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            {isActive && (
                                <motion.div
                                    layoutId="mobile-active-dot"
                                    className="absolute -bottom-1 w-1 h-1 bg-neon-lime rounded-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </motion.nav>
        </div>
    );
}
