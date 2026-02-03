"use client";
import React, { useRef } from "react";
import { MapPin, Brain, Gift, Leaf, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const features = [
    {
        icon: MapPin,
        title: "Smart Bin Finder",
        description: "Locate nearby bins instantly. Filter by e-waste type and check real-time available capacity before you go.",
        color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
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
    },
];

export default function CoreFeatures() {
    const sectionRef = useRef<HTMLSectionElement>(null);
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
            </div>
        </section>
    );
}
