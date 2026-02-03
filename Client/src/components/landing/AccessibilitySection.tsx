"use client";
import React from "react";

import { motion } from "framer-motion";
import { Heart, Globe, Sparkles, Users2 } from "lucide-react";

const accessibilityPoints = [
    {
        icon: Heart,
        title: "Easy for Everyone",
        description: "Large buttons, clear text, and simple navigation—designed with seniors in mind",
    },
    {
        icon: Globe,
        title: "Multilingual Support",
        description: "Available in multiple languages so everyone can participate",
    },
    {
        icon: Sparkles,
        title: "Simple Interface",
        description: "No technical knowledge needed—if you can use a phone, you can recycle with us",
    },
    {
        icon: Users2,
        title: "Designed for All Ages",
        description: "From children to grandparents, everyone can make an impact",
    },
];

export default function AccessibilitySection() {
    return (
        <section className="landing-section px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-off-white to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-soft-teal/10 dark:bg-soft-teal/20 rounded-full mb-4">
                        <Heart className="w-4 h-4 text-soft-teal" />
                        <span className="text-sm font-semibold text-soft-teal">
                            Inclusive by Design
                        </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black text-forest-green dark:text-white mb-4">
                        Built for Everyone
                    </h2>
                    <p className="text-lg text-text-secondary dark:text-gray-300 max-w-2xl mx-auto">
                        We believe sustainability should be accessible to all. That's why we've designed our platform with inclusivity at its core.
                    </p>
                </motion.div>

                {/* Points Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {accessibilityPoints.map((point, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-center"
                        >
                            {/* Icon */}
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-soft-teal to-success-green p-0.5 rounded-2xl mb-4">
                                <div className="w-full h-full bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center">
                                    <point.icon className="w-8 h-8 text-soft-teal" />
                                </div>
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-bold text-forest-green dark:text-white mb-2">
                                {point.title}
                            </h3>
                            <p className="text-text-secondary dark:text-gray-400 leading-relaxed">
                                {point.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Testimonial-style Quote */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="bg-gradient-to-br from-white to-light-grey dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 md:p-12 border border-gray-100 dark:border-gray-700 text-center shadow-xl">
                        <div className="w-16 h-16 mx-auto bg-soft-teal/10 dark:bg-soft-teal/20 rounded-full flex items-center justify-center mb-6">
                            <Users2 className="w-8 h-8 text-soft-teal" />
                        </div>
                        <p className="text-xl md:text-2xl font-bold text-forest-green dark:text-white mb-4">
                            "Technology should empower, not exclude"
                        </p>
                        <p className="text-text-secondary dark:text-gray-400 leading-relaxed">
                            Whether you're 8 or 80, tech-savvy or just getting started, our platform welcomes you. We've removed the barriers so everyone can contribute to a cleaner, greener planet.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
