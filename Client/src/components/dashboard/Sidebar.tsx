"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Map, Scan, LogOut, Award } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/home" },
    { icon: Scan, label: "AI Waste Scanner", href: "/scan" },
    { icon: Map, label: "Bin Map", href: "/map" },
    { icon: Award, label: "Rewards", href: "/rewards" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="h-screen w-20 md:w-56 bg-forest-green text-white fixed left-0 top-0 hidden md:flex flex-col justify-between py-6 z-50 shadow-xl"
        >
            {/* Logo */}
            <Link href="/home" className="px-6 flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-neon-lime flex items-center justify-center shrink-0">
                    <span className="text-forest-green font-bold text-lg">P</span>
                </div>
                <span className="font-bold text-xl hidden md:block text-white tracking-wide">
                    Punarchakra
                </span>
            </Link>

            {/* Navigation */}
            <nav className="flex-1 mt-10 px-4 space-y-2">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                                isActive
                                    ? "bg-white/10 text-white font-semibold"
                                    : "text-white/70 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-fresh-green" : "text-white/70 group-hover:text-white")} />
                            <span className="hidden md:block text-sm">{item.label}</span>

                            {isActive && (
                                <div className="absolute left-0 w-1 h-6 bg-fresh-green rounded-r-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="px-4 space-y-4">
                <button className="flex items-center gap-4 px-3 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white w-full transition-colors group">
                    <LogOut className="w-5 h-5" />
                    <span className="hidden md:block text-sm font-medium">Logout</span>
                </button>

                <div className="flex items-center gap-3 px-3 pt-4 border-t border-white/10">
                    <div className="w-10 h-10 rounded-full bg-white/10 p-0.5">
                        <div className="w-full h-full rounded-full bg-forest-green flex items-center justify-center overflow-hidden border border-white/20">
                            <span className="text-xs font-bold text-white">AD</span>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-semibold text-white">Admin User</p>
                        <p className="text-xs text-white/50">admin@punarchakra.com</p>
                    </div>
                </div>
            </div>
        </motion.aside>
    );
}
