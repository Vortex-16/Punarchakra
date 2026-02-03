"use client";
import React from "react";

import { motion } from "framer-motion";
import { Smartphone, MapPin, Scan, Trophy } from "lucide-react";

const steps = [
    {
        number: "01",
        icon: Smartphone,
        title: "Choose Your E-Waste",
        description: "Select what you want to recycle—phones, laptops, cables, or batteries",
    },
    {
        number: "02",
        icon: MapPin,
        title: "Find Nearest Smart Bin",
        description: "Locate the closest bin using our interactive map",
    },
    {
        number: "03",
        icon: Scan,
        title: "AI Detects Your Item",
        description: "Drop your item and let AI instantly identify and value it",
    },
    {
        number: "04",
        icon: Trophy,
        title: "Earn Rewards & Track Impact",
        description: "Get points, rewards, and see your environmental contribution",
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="landing-section px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
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
                        How It Works
                    </h2>
                    <p className="text-lg text-text-secondary dark:text-gray-300 max-w-2xl mx-auto">
                        Four simple steps to turn your e-waste into rewards and environmental impact
                    </p>
                </motion.div>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative"
                        >
                            {/* Connecting Line (Desktop) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-forest-green/30 to-transparent dark:from-neon-lime/20"></div>
                            )}

                            {/* Card */}
                            <div className="relative bg-gradient-to-br from-white to-light-grey dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 hover-lift border border-gray-100 dark:border-gray-700 h-full">
                                {/* Number Badge */}
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-forest-green dark:bg-neon-lime rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-white dark:text-forest-green font-black text-lg">
                                        {step.number}
                                    </span>
                                </div>

                                {/* Icon */}
                                <div className="w-16 h-16 bg-forest-green/10 dark:bg-neon-lime/10 rounded-xl flex items-center justify-center mb-4">
                                    <step.icon className="w-8 h-8 text-forest-green dark:text-neon-lime" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-forest-green dark:text-white mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-text-secondary dark:text-gray-400 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 text-center"
                >
                    <p className="text-text-muted dark:text-gray-400 mb-4">
                        Ready to get started?
                    </p>
                    <a
                        href="/map"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-forest-green hover:bg-forest-green/90 text-white rounded-lg font-semibold transition-all hover-scale shadow-lg shadow-forest-green/20"
                    >
                        <MapPin className="w-5 h-5" />
                        Find Your Nearest Bin
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
