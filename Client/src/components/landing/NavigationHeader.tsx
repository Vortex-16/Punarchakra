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
                ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/home" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-forest-green rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                            <span className="text-neon-lime font-black text-xl">P</span>
                        </div>
                        <span className="text-xl font-bold text-forest-green dark:text-white">
                            Punarchakra
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => scrollToSection(link.id)}
                                className="text-gray-700 dark:text-gray-300 hover:text-forest-green dark:hover:text-neon-lime font-medium transition-colors"
                            >
                                {link.label}
                            </button>
                        ))}
                    </nav>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <ModeToggle />
                        <Link
                            href="/"
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-forest-green dark:hover:text-neon-lime font-medium transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            href="/"
                            className="px-6 py-2.5 bg-forest-green hover:bg-forest-green/90 text-white rounded-lg font-semibold transition-all hover-scale shadow-lg shadow-forest-green/20"
                        >
                            Sign Up
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
                        className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
                    >
                        <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => scrollToSection(link.id)}
                                    className="block w-full text-left py-2 text-gray-700 dark:text-gray-300 hover:text-forest-green dark:hover:text-neon-lime font-medium transition-colors"
                                >
                                    {link.label}
                                </button>
                            ))}
                            <div className="pt-4 space-y-3 border-t border-gray-100 dark:border-gray-800">
                                <Link
                                    href="/dashboard"
                                    className="block w-full text-center py-2.5 text-gray-700 dark:text-gray-300 hover:text-forest-green dark:hover:text-neon-lime font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="block w-full text-center py-3 bg-forest-green hover:bg-forest-green/90 text-white rounded-lg font-semibold transition-all shadow-lg shadow-forest-green/20"
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
