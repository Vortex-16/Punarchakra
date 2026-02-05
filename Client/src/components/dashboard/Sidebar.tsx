"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Map, Scan, LogOut, Award, Smartphone, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/useSession";
import { signOut } from "next-auth/react";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Smartphone, label: "Smart Bin", href: "/smartBin" },
    { icon: Scan, label: "AI Waste Scanner", href: "/scan" },
    { icon: Map, label: "Bin Map", href: "/map" },
    { icon: Award, label: "Rewards", href: "/rewards" },
];

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const { user, isAuthenticated } = useSession();

    // Filter items based on role
    const filteredItems = sidebarItems;

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    // Get user initials for avatar
    const getInitials = (name?: string, email?: string) => {
        if (name) {
            return name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
        }
        if (email) {
            return email.slice(0, 2).toUpperCase();
        }
        return "U";
    };

    // Get role display name
    const getRoleDisplay = (role?: string) => {
        if (!role) return "User";
        return role.charAt(0).toUpperCase() + role.slice(1);
    };

    return (
        <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={cn("h-screen w-20 md:w-56 bg-forest-green text-white fixed left-0 top-0 flex-col justify-between py-6 z-50 shadow-xl", className)}
        >
            {/* Logo */}
            <Link href="/" className="px-6 flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-fresh-green flex items-center justify-center shrink-0">
                    <span className="text-forest-green font-bold text-lg">P</span>
                </div>
                <span className="font-bold text-xl hidden md:block text-white tracking-wide">
                    Punarchakra
                </span>
            </Link>

            {/* Navigation */}
            <nav className="flex-1 mt-10 px-4 space-y-2">
                {filteredItems.map((item) => {
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
            <div className="px-4 pb-4 space-y-2 mt-auto">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-3 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white w-full transition-colors group"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden md:block text-sm font-medium">Logout</span>
                </button>

                <div className="flex items-center gap-3 px-3 pt-3 border-t border-white/10 shrink-0">
                    <div className="w-8 h-8 rounded-full bg-white/10 p-0.5">
                        <div className="w-full h-full rounded-full bg-forest-green flex items-center justify-center overflow-hidden border border-white/20">
                            <span className="text-[10px] font-bold text-white uppercase">
                                {getInitials(user?.name, user?.email)}
                            </span>
                        </div>
                    </div>
                    <div className="hidden md:block min-w-0">
                        <p className="text-xs font-semibold text-white truncate">
                            {user?.name || getRoleDisplay(user?.role)}
                        </p>
                        <p className="text-[10px] text-white/50 truncate">
                            {user?.email || "user@punarchakra.com"}
                        </p>
                    </div>
                </div>
            </div>
        </motion.aside>
    );
}
