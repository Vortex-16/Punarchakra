"use client";
import React, { useRef } from "react";
import { MapPin, Brain, Gift, Leaf, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);
import React from "react";

import { motion } from "framer-motion";
import { MapPin, Brain, Gift, Leaf } from "lucide-react";

const features = [
    {
        icon: MapPin,
        title: "Smart Bin Finder",
        description: "Locate nearby bins instantly. Filter by e-waste type and check real-time available capacity before you go.",
        color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
        description: "Locate nearby bins by waste type with real-time availability",
        color: "from-forest-green to-success-green",
    },
    {
        icon: Brain,
        title: "AI Waste Detection",
        description: "Scan any item with your camera. Our AI identifies it, checks recyclability, and estimates its value in seconds.",
        color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    },
    {
        icon: Gift,
        title: "Rewards & Impact",
        description: "Earn points for every recycle. Redeem them for coupons, products, or donate to environmental causes.",
        color: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    },
    {
        icon: Leaf,
        title: "Carbon Tracking",
        description: "Visualize your contribution. See exactly how much CO₂ you've saved and your personal environmental footprint.",
        color: "bg-green-50 text-forest-green dark:bg-green-900/20 dark:text-green-400",
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
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Animate Header
        gsap.fromTo(headerRef.current,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: headerRef.current,
                    start: "top 85%",
                }
            }
        );

        // Animate Grid Items
        gsap.fromTo(gridRef.current!.children,
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: "top 80%",
                }
            }
        );

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-950">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div ref={headerRef} className="text-center mb-16">
                    <span className="text-sm font-bold text-forest-green tracking-wider uppercase mb-2 block">Powerful Features</span>
                    <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                        Everything you need to <br /> recycle smarter.
                    </h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        We've built a complete ecosystem to make e-waste recycling effortless, rewarding, and transparent.
                    </p>
                </div>

                {/* Features Grid */}
                <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative"
                        >
                            {/* Card */}
                            <div className="bg-gray-50 dark:bg-neutral-900 rounded-[2rem] p-8 h-full border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/50 hover:-translate-y-2">

                                {/* Icon Container */}
                                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300`}>
                                    <feature.icon className="w-7 h-7" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm mb-6">
                                    {feature.description}
                                </p>

                                <div className="flex items-center text-sm font-bold text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300">
                                    Learn more <ArrowRight className="w-4 h-4 ml-2 text-forest-green" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
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
