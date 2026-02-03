"use client";
import React from "react";
import { motion } from "framer-motion";
import { Mic, Eye, Smartphone, Volume2 } from "lucide-react";

const accessibilityFeatures = [
    {
        icon: Mic,
        title: "Voice Commands",
        description: "Navigate entirely by voice. 'Where is the nearest bin?' works instantly.",
    },
    {
        icon: Eye,
        title: "High Contrast UI",
        description: "Designed for visibility with clear type, distinct colors, and screen reader support.",
    },
    {
        icon: Smartphone,
        title: "Dynamic Text Sizing",
        description: "Scale text up or down without breaking the layout. Read comfortably on any device.",
    },
    {
        icon: Volume2,
        title: "Audio Feedback",
        description: "Hear confirmation tones and spoken results for every scan and interaction.",
    },
];

export default function AccessibilitySection() {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-sm font-bold text-forest-green tracking-wider uppercase mb-2 block">Inclusive Design</span>
                        <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                            Technology that Includes Everyone.
                        </h2>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                            We believe sustainability should be accessible to all. That's why we've built Punarchakra with accessibility at its core, not as an afterthought.
                        </p>

                        <div className="space-y-6">
                            {accessibilityFeatures.map((feature, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center shadow-sm">
                                        <feature.icon className="w-6 h-6 text-forest-green dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative aspect-square bg-white dark:bg-neutral-800 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden p-8 flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-900/10"></div>

                            <div className="relative z-10 text-center space-y-8">
                                <div className="inline-block p-4 bg-forest-green rounded-full shadow-lg shadow-forest-green/30 animate-pulse">
                                    <Mic className="w-12 h-12 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">"Find e-waste bins"</p>
                                    <p className="text-forest-green font-medium">Listening...</p>
                                </div>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 3, 2, 1].map((h, i) => (
                                        <div
                                            key={i}
                                            className="w-2 bg-gray-200 dark:bg-gray-700 rounded-full animate-bounce"
                                            style={{ height: h * 10, animationDelay: `${i * 0.1}s` }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
