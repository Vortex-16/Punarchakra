"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link"; // Link fixed

import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "@/components/mode-toggle";

export default function NavigationHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-forest-green rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-forest-green/20">
                            <span className="text-white font-black text-xl">P</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Punarchakra
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-2">
                        {navLinks.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => scrollToSection(link.id)}
                                className="cursor-pointer px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-forest-green/10 hover:text-forest-green dark:hover:text-green-400 transition-all duration-300"
                            >
                                {link.label}
                            </button>
                        ))}
                    </nav>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <ModeToggle />
                        <Link
                            href="/home"
                            className="px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-forest-green dark:hover:text-green-400 transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            href="/home"
                            className="px-5 py-2.5 bg-forest-green hover:bg-[#0a3f30] text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-forest-green/20 hover:shadow-xl hover:-translate-y-0.5"
                        >
                            Sign Up
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} // Fixed toggle
                        className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-forest-green transition-colors"
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800"
                    >
                        <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => scrollToSection(link.id)}
                                    className="block w-full text-left py-3 text-base font-medium text-gray-900 dark:text-white hover:text-forest-green dark:hover:text-green-400 border-b border-gray-50 dark:border-gray-800"
                                >
                                    {link.label}
                                </button>
                            ))}
                            <div className="pt-4 space-y-3">
                                <Link
                                    href="/home"
                                    className="block w-full text-center py-3 text-gray-700 dark:text-gray-300 font-bold hover:text-forest-green"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/home"
                                    className="block w-full text-center py-3 bg-forest-green text-white rounded-xl font-bold shadow-lg"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
