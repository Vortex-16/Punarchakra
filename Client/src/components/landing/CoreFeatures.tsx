"use client";
import React from "react";

import { motion } from "framer-motion";
import { MapPin, Brain, Gift, Leaf } from "lucide-react";

const features = [
    {
        icon: MapPin,
        title: "Smart Bin Finder",
        description: "Locate nearby bins by waste type with real-time availability",
        color: "from-forest-green to-success-green",
    },
    {
        icon: Brain,
        title: "AI Waste Detection",
        description: "Instant item recognition with confidence scores and value calculation",
        color: "from-success-green to-soft-teal",
    },
    {
        icon: Gift,
        title: "Rewards & Points",
        description: "Earn while making an impact—every item counts",
        color: "from-soft-teal to-forest-green",
    },
    {
        icon: Leaf,
        title: "Environmental Tracking",
        description: "See your CO₂ savings and resource conservation in real-time",
        color: "from-forest-green to-success-green",
    },
];

export default function CoreFeatures() {
    return (
        <section id="features" className="landing-section px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-light-grey to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl sm:text-5xl font-black text-forest-green dark:text-white mb-4">
                        Core Features
                    </h2>
                    <p className="text-lg text-text-secondary dark:text-gray-300 max-w-2xl mx-auto">
                        Everything you need for smart, rewarding e-waste recycling
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative"
                        >
                            {/* Card */}
                            <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 h-full border border-gray-100 dark:border-gray-800 hover-lift overflow-hidden">
                                {/* Gradient Overlay on Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300`}></div>

                                {/* Icon Container */}
                                <div className="relative mb-4">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-0.5`}>
                                        <div className="w-full h-full bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center">
                                            <feature.icon className="w-7 h-7 text-forest-green dark:text-neon-lime" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-forest-green dark:text-white mb-3 group-hover:text-success-green dark:group-hover:text-neon-lime transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-text-secondary dark:text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Decorative Element */}
                                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-forest-green/5 to-transparent dark:from-neon-lime/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-forest-green/5 dark:bg-neon-lime/5 rounded-full border border-forest-green/10 dark:border-neon-lime/10">
                        <svg className="w-5 h-5 text-success-green" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-semibold text-forest-green dark:text-neon-lime">
                            All features designed for everyone—simple, intuitive, accessible
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
