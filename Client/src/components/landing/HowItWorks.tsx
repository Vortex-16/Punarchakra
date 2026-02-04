"use client";
import React, { useRef } from "react";
import { Search, Camera, CreditCard, Recycle } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const steps = [
    {
        icon: Search,
        title: "Find a Bin",
        description: "Use the interactive map to find the nearest Punarchakra smart bin in your area.",
        color: "bg-blue-500",
    },
    {
        icon: Camera,
        title: "Scan Item",
        description: "Open the scanner at the bin and point your camera at the e-waste item for instant AI identification.",
        color: "bg-purple-500",
    },
    {
        icon: CreditCard,
        title: "Get Value",
        description: "The AI calculates the recyclable value. Confirm the deposit and see your rewards instantly.",
        color: "bg-orange-500",
    },
    {
        icon: Recycle,
        title: "Impact Made",
        description: "Track your CO2 savings and earn points for your contribution to a circular economy.",
        color: "bg-green-500",
    },
];

export default function HowItWorks() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const stepsRef = useRef<HTMLDivElement>(null);

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

        // Animate Steps
        if (stepsRef.current) {
            const stepItems = stepsRef.current.querySelectorAll(".step-item");
            stepItems.forEach((step, index) => {
                gsap.fromTo(step,
                    { x: index % 2 === 0 ? -30 : 30, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: step,
                            start: "top 85%",
                        }
                    }
                );
            });
        }
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-neutral-900/50">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div ref={headerRef} className="text-center mb-20 opacity-0">
                    <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                        How it Works
                    </h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Recycling your electronics has never been this easy. Follow these four simple steps to make an impact.
                    </p>
                </div>

                {/* Steps Timeline */}
                <div ref={stepsRef} className="relative">
                    {/* Vertical Line for Desktop */}
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800 -translate-x-1/2" />

                    <div className="space-y-12 lg:space-y-0">
                        {steps.map((step, index) => (
                            <div key={index} className="step-item relative flex flex-col lg:flex-row items-center opacity-0">
                                {/* Desktop Indexing */}
                                <div className={`flex-1 w-full lg:w-1/2 ${index % 2 === 0 ? "lg:text-right lg:pr-16" : "lg:order-last lg:pl-16"}`}>
                                    <div className={`p-8 bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow duration-500`}>
                                        <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg ${index % 2 === 0 ? "lg:ml-auto" : ""}`}>
                                            <step.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Center Dot */}
                                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white dark:bg-neutral-950 border-4 border-forest-green shadow-lg z-10 items-center justify-center">
                                    <span className="text-xs font-black text-forest-green">{index + 1}</span>
                                </div>

                                <div className="hidden lg:block flex-1" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
