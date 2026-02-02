"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Map, BarChart3, Users, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Map, label: "Bin Map", href: "/map" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Users, label: "Users", href: "/users" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="h-screen w-20 md:w-64 bg-forest-green text-white fixed left-0 top-0 flex flex-col justify-between py-6 z-50 shadow-xl"
        >
            {/* Logo */}
            <div className="px-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neon-lime flex items-center justify-center shrink-0">
                    <span className="text-forest-green font-bold text-lg">E</span>
                </div>
                <span className="font-bold text-xl hidden md:block text-white tracking-wide">
                    E-Bin
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 mt-10 px-4 space-y-2">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 group",
                                isActive
                                    ? "bg-white/10 text-neon-lime shadow-lg backdrop-blur-sm"
                                    : "text-white/70 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-6 h-6", isActive && "text-neon-lime")} />
                            <span className="hidden md:block font-medium">{item.label}</span>

                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute left-0 w-1 h-8 bg-neon-lime rounded-r-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="px-4 space-y-4">
                <button className="flex items-center gap-4 px-3 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white w-full transition-colors">
                    <LogOut className="w-6 h-6" />
                    <span className="hidden md:block font-medium">Logout</span>
                </button>

                <div className="flex items-center gap-3 px-3 pt-4 border-t border-white/10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neon-lime to-emerald-500 p-0.5">
                        <div className="w-full h-full rounded-full bg-forest-green flex items-center justify-center overflow-hidden">
                            <span className="text-xs font-bold text-neon-lime">AD</span>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-semibold text-white">Admin User</p>
                        <p className="text-xs text-white/50">admin@ebin.com</p>
                    </div>
                </div>
            </div>
        </motion.aside>
    );
}
