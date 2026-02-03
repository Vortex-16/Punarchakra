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
            </div>
        </section>
    );
}
