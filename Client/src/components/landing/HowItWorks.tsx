"use client";
import React, { useRef } from "react";
import { Smartphone, MapPin, Scan, Trophy, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const steps = [
    {
        number: "01",
        icon: Smartphone,
        title: "Choose Your E-Waste",
        description: "Select what you want to recycle—phones, laptops, cables, or batteries.",
    },
    {
        number: "02",
        icon: MapPin,
        title: "Find Nearest Bin",
        description: "Locate the closest smart collection bin using our interactive map instantly.",
    },
    {
        number: "03",
        icon: Scan,
        title: "AI Detects Item",
        description: "Simply drop your item. Our AI camera instantly identifies and values it.",
    },
    {
        number: "04",
        icon: Trophy,
        title: "Collect Rewards",
        description: "Get instant points credited to your wallet and see your impact on the planet.",
    },
];

export default function HowItWorks() {
    const containerRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const stepsRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Header Animation
        gsap.from(headerRef.current, {
            scrollTrigger: {
                trigger: headerRef.current,
                start: "top 80%",
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });

        // Steps Animation
        const stepElements = stepsRef.current!.children;

        // Connecting Line Animation (Desktop)
        gsap.from(".connecting-line", {
            scrollTrigger: {
                trigger: stepsRef.current,
                start: "top 70%",
            },
            width: 0,
            duration: 1.5,
            ease: "power2.inOut"
        });

        // Steps Stagger
        gsap.from(stepElements, {
            scrollTrigger: {
                trigger: stepsRef.current,
                start: "top 70%",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)"
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-neutral-900 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div ref={headerRef} className="text-center mb-20">
                    <span className="text-sm font-bold text-forest-green tracking-wider uppercase mb-2 block">Simple Process</span>
                    <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                        How It Works
                    </h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Four simple steps to turn your e-waste into rewards and environmental impact.
                    </p>
                </div>

                {/* Steps Grid */}
                <div ref={stepsRef} className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Connecting Line (Desktop) - Behind text */}
                    <div className="hidden lg:block absolute top-[60px] left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-800 z-0">
                        <div className="connecting-line absolute top-0 left-0 h-full bg-forest-green/30 w-full origin-left"></div>
                    </div>

                    {steps.map((step, index) => (
                        <div key={index} className="relative z-10 group">
                            <div className="flex flex-col items-center text-center">
                                {/* Number Circle */}
                                <div className="w-32 h-32 bg-white dark:bg-neutral-800 rounded-full border-4 border-gray-50 dark:border-gray-800 flex items-center justify-center shadow-lg relative mb-8 group-hover:scale-110 transition-transform duration-300">
                                    <div className="absolute inset-0 bg-forest-green/5 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                    <step.icon className="w-10 h-10 text-forest-green transition-transform duration-300" />
                                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-forest-green text-white rounded-full flex items-center justify-center font-bold text-sm border-2 border-white dark:border-neutral-900">
                                        {step.number}
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-20 text-center">
                    <Link
                        href="/map"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-forest-green text-white rounded-2xl font-bold text-lg hover:bg-[#0a3f30] transition-all shadow-lg hover:shadow-forest-green/20 hover:-translate-y-1"
                    >
                        <MapPin className="w-5 h-5" />
                        Find Your Nearest Bin
                    </Link>
                </div>
            </div>
        </section>
    );
}
