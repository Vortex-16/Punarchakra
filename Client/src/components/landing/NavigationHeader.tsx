"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { useSession } from "@/hooks/useSession";
import { LayoutDashboard } from "lucide-react";

export default function NavigationHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, isAuthenticated, isAdmin } = useSession();

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Add a small hysteresis to avoid rapid toggling
                    const scrollY = window.scrollY;
                    if (scrollY > 20) {
                        setIsScrolled(true);
                    } else if (scrollY < 15) {
                        setIsScrolled(false);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setIsMobileMenuOpen(false);
        }
    };

    const navLinks = [
        { label: "Features", id: "features" },
        { label: "How It Works", id: "how-it-works" },
        { label: "Impact", id: "impact" },
    ];

    return (
        <header
            className={`fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isScrolled
                ? "top-6 w-[90%] md:w-[85%] max-w-6xl rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-lg shadow-black/5 border border-white/20 dark:border-white/10"
                : "top-0 w-full bg-transparent py-4 border-b border-transparent"
                }`}
        >
            <div className={`px-6 sm:px-8 transition-all duration-500 ${isScrolled ? "py-0" : ""}`}>
                <div className={`relative flex items-center justify-between transition-all duration-500 ${isScrolled ? "h-16" : "h-20"} md:grid md:grid-cols-3 md:items-center`}>



                    {/* 1. Logo Section (Left) */}
                    <Link href="/" className="flex items-center gap-3 group relative w-fit justify-self-start">
                        <div className="relative h-12 w-12 group-hover:scale-110 transition-transform duration-300">
                            <Image
                                src="/logo.svg"
                                alt="Punarchakra"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-forest-green bg-clip-text text-transparent hidden sm:block">
                            Punarchakra
                        </span>
                    </Link>

                    {/* 2. Navigation Links (Center) - Only visible on Desktop */}
                    <nav className="hidden md:flex justify-self-center items-center p-1 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md rounded-full border border-gray-200/50 dark:border-white/5 shadow-sm">
                        {navLinks.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => scrollToSection(link.id)}
                                className="cursor-pointer relative px-5 py-2 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-forest-green dark:hover:text-emerald-400 transition-colors duration-300 overflow-hidden group"
                            >
                                <span className="relative z-10">{link.label}</span>
                                <span className="absolute inset-0 bg-forest-green/10 dark:bg-emerald-500/10 scale-0 group-hover:scale-100 rounded-full transition-transform duration-300 origin-center" />
                            </button>
                        ))}
                    </nav>

                    {/* 3. Auth & Theme (Right) */}
                    <div className="hidden md:flex items-center gap-5 justify-self-end">
                        <ThemeToggle />

                        <div className="flex items-center gap-4 pl-5 border-l border-gray-200 dark:border-white/10 h-8">
                            {isAuthenticated ? (
                                <>
                                    {isAdmin && (
                                        <Link
                                            href="/admin"
                                            className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1.5"
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            Admin Panel
                                        </Link>
                                    )}
                                    <Link
                                        href="/dashboard"
                                        className="relative px-5 py-2.5 bg-forest-green text-white rounded-xl text-sm font-bold shadow-lg shadow-forest-green/25 hover:shadow-forest-green/40 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group"
                                    >
                                        <span className="relative z-10">Dashboard</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-forest-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-forest-green dark:hover:text-emerald-400 transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/dashboard"
                                        className="relative px-5 py-2.5 bg-forest-green text-white rounded-xl text-sm font-bold shadow-lg shadow-forest-green/25 hover:shadow-forest-green/40 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group"
                                    >
                                        <span className="relative z-10">Sign Up</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-forest-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button (Right on Mobile) */}
                    <div className="flex items-center gap-4 md:hidden">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-gray-700 dark:text-gray-300 hover:text-forest-green transition-colors"
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-7 h-7" />
                            ) : (
                                <Menu className="w-7 h-7" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:hidden bg-white/95 dark:bg-neutral-950/95 backdrop-blur-3xl border-t border-gray-100 dark:border-gray-800 overflow-hidden absolute top-full left-0 right-0 mx-4 mt-2 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10"
                    >
                        <div className="px-6 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => scrollToSection(link.id)}
                                    className="block w-full text-left py-3 text-lg font-bold text-gray-900 dark:text-white hover:text-forest-green dark:hover:text-emerald-400 border-b border-gray-100 dark:border-white/5 last:border-0"
                                >
                                    {link.label}
                                </button>
                            ))}
                            <div className="pt-4 grid grid-cols-2 gap-4">
                                {isAuthenticated ? (
                                    <Link
                                        href="/dashboard"
                                        className="col-span-2 flex items-center justify-center py-3 bg-forest-green text-white rounded-xl font-bold shadow-lg shadow-forest-green/20"
                                    >
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center justify-center py-3 text-gray-700 dark:text-gray-300 font-bold hover:text-forest-green bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center justify-center py-3 bg-forest-green text-white rounded-xl font-bold shadow-lg shadow-forest-green/20"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
