"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Map, Truck, Bell, Settings, LogOut,
    Menu, X, ChevronRight, Recycle
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "@/components/mode-toggle";
import { useSession } from "@/hooks/useSession"; // Assuming this exists or using next-auth
import { cn } from "@/lib/utils"; // Assuming utils exist

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/admin", color: "text-blue-500" },
    { icon: Map, label: "Live Map", href: "/admin/map", color: "text-emerald-500" },
    { icon: Truck, label: "Route Optimization", href: "/admin/routes", color: "text-orange-500" },
    { icon: Bell, label: "Alerts & Incidents", href: "/admin/alerts", color: "text-red-500" },
    { icon: Settings, label: "System Settings", href: "/admin/settings", color: "text-gray-500" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user } = useSession();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex font-sans transition-colors duration-300">
            {/* Sidebar */}
            <motion.aside
                initial={{ width: 280 }}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className={cn(
                    "fixed left-0 top-0 h-screen z-50 bg-forest-green border-r border-white/10 hidden md:flex flex-col shadow-2xl",
                    "transition-all duration-300 ease-in-out text-white"
                )}
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
                    <Link href="/dashboard" className={cn("flex items-center gap-3 overflow-hidden", !isSidebarOpen && "justify-center")}>
                        <div className="w-9 h-9 bg-fresh-green rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                            <Recycle className="w-5 h-5 text-forest-green" />
                        </div>
                        {isSidebarOpen && (
                            <span className="font-bold text-xl tracking-wide text-white whitespace-nowrap">
                                Eco<span className="text-fresh-green">Bin</span><span className="text-[10px] ml-1.5 px-1.5 py-0.5 bg-white/10 text-fresh-green rounded font-bold align-top">PRO</span>
                            </span>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-white/10 text-white font-semibold shadow-inner"
                                        : "text-white/70 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5 shrink-0 transition-colors", isActive ? "text-fresh-green" : "group-hover:text-white")} />

                                {isSidebarOpen && (
                                    <span className="truncate text-sm">{item.label}</span>
                                )}

                                {!isSidebarOpen && (
                                    <div className="absolute left-full ml-4 px-3 py-1.5 bg-forest-green border border-white/10 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl">
                                        {item.label}
                                    </div>
                                )}

                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="absolute left-0 w-1 h-6 bg-fresh-green rounded-r-full"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 mb-3">
                        <div className="w-10 h-10 rounded-full bg-fresh-green flex items-center justify-center shrink-0 shadow-inner">
                            <span className="font-bold text-sm text-forest-green">
                                {user?.name?.[0] || 'A'}
                            </span>
                        </div>
                        {isSidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
                                <p className="text-[10px] text-white/50 truncate font-medium uppercase tracking-wider">Master Control</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl hover:bg-white/10 transition-all text-white/70 hover:text-white group border border-transparent hover:border-white/10"
                    >
                        {isSidebarOpen ? (
                            <>
                                <X className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase">Minimize Menu</span>
                            </>
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                    </button>

                    <Link
                        href="/dashboard"
                        className="mt-2 w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white font-bold text-xs uppercase"
                    >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        User Portal
                    </Link>
                </div>
            </motion.aside>

            {/* Mobile Header (Visible only on small screens) */}
            <div className="md:hidden fixed top-0 w-full z-30 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 h-16 flex items-center justify-between">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                        <Recycle className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg text-gray-900 dark:text-white">EcoBin Admin</span>
                </Link>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-600 dark:text-gray-300">
                    {isSidebarOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Main Content Area */}
            <main
                className={cn(
                    "flex-1 min-h-screen transition-all duration-300 ease-in-out p-6 md:p-10",
                    isSidebarOpen ? "md:ml-[280px]" : "md:ml-[80px]",
                    "mt-16 md:mt-0 bg-transparent"
                )}
            >
                <div className="max-w-7xl mx-auto space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
