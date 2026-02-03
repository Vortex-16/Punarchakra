"use client";
import React from "react";

import { motion } from "framer-motion";
import { Leaf, Droplet, Package, Users } from "lucide-react";

const impactStats = [
    {
        icon: Leaf,
        value: "850",
        unit: "tons",
        label: "CO₂ Offset",
        description: "Equivalent to planting 14,000 trees",
    },
    {
        icon: Droplet,
        value: "340K",
        unit: "liters",
        label: "Water Saved",
        description: "Enough to fill an Olympic pool",
    },
    {
        icon: Package,
        value: "12.5K",
        unit: "items",
        label: "Items Recycled",
        description: "And counting every single day",
    },
    {
        icon: Users,
        value: "8,200",
        unit: "members",
        label: "Community Members",
        description: "People making a difference together",
    },
];

export default function ImpactSection() {
    return (
        <section id="impact" className="landing-section px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-forest-green to-success-green dark:from-gray-900 dark:to-gray-950 text-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                        Our Collective Impact
                    </h2>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto">
                        Together, we're making a real difference. Here's the environmental impact our community has achieved.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {impactStats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative group"
                        >
                            {/* Card */}
                            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-white/10 hover:bg-white/15 dark:hover:bg-white/10 transition-all hover-lift">
                                {/* Icon */}
                                <div className="w-12 h-12 bg-white/20 dark:bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>

                                {/* Value */}
                                <div className="mb-2">
                                    <span className="text-4xl font-black text-white">
                                        {stat.value}
                                    </span>
                                    <span className="text-xl ml-1 text-white/80 font-semibold">
                                        {stat.unit}
                                    </span>
                                </div>

                                {/* Label */}
                                <h3 className="text-lg font-bold text-white mb-2">
                                    {stat.label}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-white/70">
                                    {stat.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Inspiring Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-16"
                >
                    <div className="max-w-3xl mx-auto bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-white/10">
                        <p className="text-2xl font-bold text-white mb-4">
                            Every item you recycle creates a ripple effect
                        </p>
                        <p className="text-white/80 leading-relaxed">
                            When you drop an old phone or laptop into a smart bin, you're not just disposing of waste—you're conserving resources, reducing pollution, and inspiring others to do the same. This is sustainability in action.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
