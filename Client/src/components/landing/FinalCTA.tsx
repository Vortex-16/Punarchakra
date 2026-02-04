"use client";
import React from "react";

import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

export default function FinalCTA() {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-950">
            <div className="max-w-7xl mx-auto">
                <div className="relative rounded-[3rem] overflow-hidden bg-forest-green px-6 py-20 sm:px-12 sm:py-24 text-center">
                    {/* Abstract Background */}
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

                    <div className="relative z-10 max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                                Ready to make a difference?
                            </h2>

                            <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                                Join thousands of eco-conscious users turning e-waste into value.
                                Start your journey today.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/signup"
                                    className="group px-8 py-4 bg-white text-forest-green rounded-2xl font-bold text-lg transition-all hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Get Started Free
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="/map"
                                    className="px-8 py-4 bg-forest-green border border-white/30 text-white rounded-2xl font-bold text-lg transition-all hover:bg-white/10 flex items-center justify-center gap-2"
                                >
                                    <MapPin className="w-5 h-5" />
                                    Find Nearest Bin
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
        <section className="landing-section px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-forest-green via-success-green to-forest-green dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-neon-lime rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-5xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        <span className="text-sm font-semibold text-white">
                            Join 8,200+ Community Members
                        </span>
                    </div>

                    {/* Headline */}
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                        Start Recycling
                        <br />
                        Smarter Today
                    </h2>

                    {/* Description */}
                    <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Turn your old electronics into environmental impact and rewards.
                        It's simple, it's smart, and it starts right now.
                    </p>

                    {/* Dual CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/dashboard"
                            className="group px-8 py-4 bg-white hover:bg-white/95 text-forest-green rounded-xl font-bold text-lg transition-all hover-scale shadow-2xl flex items-center justify-center gap-2"
                        >
                            Sign Up Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/map"
                            className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:border-white text-white rounded-xl font-bold text-lg transition-all hover-lift flex items-center justify-center gap-2"
                        >
                            <MapPin className="w-5 h-5" />
                            Find Nearest Bin
                        </Link>
                    </div>

                    {/* Bottom Trust Line */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 text-white/70 text-sm"
                    >
                        No credit card required • Free forever • Privacy guaranteed
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
}
