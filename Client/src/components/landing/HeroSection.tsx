"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, PlayCircle } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-off-white to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center lg:text-left"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-forest-green/10 dark:bg-forest-green/20 rounded-full mb-6"
                        >
                            <span className="w-2 h-2 bg-success-green rounded-full animate-pulse"></span>
                            <span className="text-sm font-semibold text-forest-green dark:text-neon-lime">
                                AI-Powered Smart Recycling
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-forest-green dark:text-white leading-tight mb-6">
                            Smart E-Waste
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-green to-success-green dark:from-neon-lime dark:to-soft-teal">
                                Recycling Made Simple
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg sm:text-xl text-text-secondary dark:text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            Turn your old electronics into value. Find smart bins nearby, get
                            instant AI detection, earn rewards, and track your environmental
                            impact—all in one platform.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                href="/map"
                                className="group px-8 py-4 bg-forest-green hover:bg-forest-green/90 text-white rounded-xl font-bold text-lg transition-all hover-scale shadow-xl shadow-forest-green/25 flex items-center justify-center gap-2"
                            >
                                <MapPin className="w-5 h-5" />
                                Find a Bin Near Me
                                <span className="group-hover:translate-x-1 transition-transform inline-block">
                                    →
                                </span>
                            </Link>
                            <button
                                onClick={() => scrollToSection("how-it-works")}
                                className="px-8 py-4 bg-white dark:bg-gray-800 border-2 border-forest-green/20 dark:border-gray-700 hover:border-forest-green dark:hover:border-neon-lime text-forest-green dark:text-white rounded-xl font-bold text-lg transition-all hover-lift flex items-center justify-center gap-2"
                            >
                                <PlayCircle className="w-5 h-5" />
                                See How It Works
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-text-muted dark:text-gray-400"
                        >
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-success-green" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Free to Use</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-success-green" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">AI-Verified</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-success-green" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Privacy-First</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="relative"
                    >
                        <div className="relative w-full aspect-square max-w-xl mx-auto">
                            {/* Background Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-forest-green/20 via-success-green/10 to-transparent rounded-3xl blur-3xl"></div>

                            {/* Main Image placeholder for future use */}
                            <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-light-grey to-white dark:from-gray-800 dark:to-gray-900 p-8 flex items-center justify-center">
                                <div className="text-text-muted dark:text-gray-500 font-medium italic">
                                    Illustration placeholder
                                </div>
                            </div>

                            {/* Floating Stats Cards */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                                className="absolute -left-4 top-1/4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 border border-gray-100 dark:border-gray-700"
                            >
                                <p className="text-xs font-semibold text-text-muted dark:text-gray-400 mb-1">
                                    CO₂ Saved
                                </p>
                                <p className="text-2xl font-black text-forest-green dark:text-neon-lime">
                                    850<span className="text-sm ml-1">tons</span>
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1 }}
                                className="absolute -right-4 bottom-1/4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 border border-gray-100 dark:border-gray-700"
                            >
                                <p className="text-xs font-semibold text-text-muted dark:text-gray-400 mb-1">
                                    Items Recycled
                                </p>
                                <p className="text-2xl font-black text-forest-green dark:text-neon-lime">
                                    12.5<span className="text-sm ml-1">K</span>
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
