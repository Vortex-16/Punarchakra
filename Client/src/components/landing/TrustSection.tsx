"use client";
import React, { useRef } from "react";
import { Shield, Eye, CheckCircle, Lock } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo(headerRef.current,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: headerRef.current,
                    start: "top 90%",
                }
            }
        );

        if (gridRef.current) {
            gsap.fromTo(gridRef.current.children,
                { x: -20, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: "top 85%",
                    }
                }
            );
        }

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-950">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div ref={headerRef} className="text-center mb-16 opacity-0">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full mb-6">
                        <Shield className="w-4 h-4 text-forest-green" />
                        <span className="text-sm font-bold text-forest-green dark:text-green-400">
                            Built on Trust
                        </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                        Transparent & Secure
                    </h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        We believe in clarity and security. Here's how we ensure you can trust every step of the process.
                    </p>
                </div>

                {/* Trust Points Grid */}
                <div ref={gridRef} className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {trustPoints.map((point, index) => (
                        <div
                            key={index}
                            className="flex gap-6 p-8 bg-gray-50 dark:bg-neutral-900 rounded-[2rem] border border-gray-100 dark:border-neutral-800 transition-all hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/50 hover:-translate-y-1 opacity-0"
                        >
                            {/* Icon */}
                            <div className="flex-shrink-0 w-14 h-14 bg-white dark:bg-neutral-800 rounded-2xl flex items-center justify-center shadow-sm">
                                <point.icon className="w-7 h-7 text-forest-green dark:text-green-400" />
                            </div>

                            {/* Content */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    {point.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {point.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Assurance */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="mt-20 text-center"
                >
                    <p className="text-gray-400 dark:text-gray-500 italic font-medium max-w-lg mx-auto leading-relaxed">
                        "Your trust is our priority. Every decision we make puts transparency and security at the center of the experience."
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
