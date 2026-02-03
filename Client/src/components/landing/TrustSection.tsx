"use client";
import React from "react";

import { motion } from "framer-motion";
import { Shield, Eye, CheckCircle, Lock } from "lucide-react";

function Brain(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
        </svg>
    );
}

const trustPoints = [
    {
        icon: Brain,
        title: "AI Detection with Confidence",
        description: "Every item is scanned with AI that shows you exactly how confident it is in the detection",
    },
    {
        icon: Eye,
        title: "Transparent Value Calculation",
        description: "See exactly how we calculate the value of your e-waste—no hidden formulas",
    },
    {
        icon: CheckCircle,
        title: "Manual Verification Available",
        description: "If you're unsure about the AI's detection, request manual verification anytime",
    },
    {
        icon: Lock,
        title: "Privacy-First System",
        description: "Your data is secure, encrypted, and never shared without your permission",
    },
];

export default function TrustSection() {
    return (
        <section className="landing-section px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-success-green/10 dark:bg-success-green/20 rounded-full mb-4">
                        <Shield className="w-4 h-4 text-success-green" />
                        <span className="text-sm font-semibold text-success-green">
                            Built on Trust
                        </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black text-forest-green dark:text-white mb-4">
                        Transparent & Secure
                    </h2>
                    <p className="text-lg text-text-secondary dark:text-gray-300 max-w-2xl mx-auto">
                        We believe in clarity and security. Here's how we ensure you can trust every step of the process.
                    </p>
                </motion.div>

                {/* Trust Points Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {trustPoints.map((point, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="flex gap-4 p-6 bg-gradient-to-br from-white to-light-grey dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover-lift"
                        >
                            {/* Icon */}
                            <div className="flex-shrink-0 w-12 h-12 bg-success-green/10 dark:bg-success-green/20 rounded-xl flex items-center justify-center">
                                <point.icon className="w-6 h-6 text-success-green dark:text-neon-lime" />
                            </div>

                            {/* Content */}
                            <div>
                                <h3 className="text-lg font-bold text-forest-green dark:text-white mb-2">
                                    {point.title}
                                </h3>
                                <p className="text-text-secondary dark:text-gray-400 leading-relaxed">
                                    {point.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Assurance */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 text-center"
                >
                    <p className="text-text-muted dark:text-gray-400 italic">
                        "Your trust is our priority. Every decision we make puts transparency and security first."
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
