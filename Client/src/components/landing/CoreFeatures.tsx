"use client";
import React, { useRef, useState } from "react";
import { MapPin, Brain, Gift, Leaf, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const features = [
    {
        icon: MapPin,
        title: "Smart Bin Finder",
        description: "Locate nearby bins instantly. Filter by e-waste type and check real-time available capacity before you go.",
        color: "bg-blue-50 text-blue-600 dark:bg-blue-900/10 dark:text-blue-400 border-blue-100 dark:border-blue-900/20",
        accent: "text-blue-600"
    },
    {
        icon: Brain,
        title: "AI Waste Detection",
        description: "Scan any item with your camera. Our AI identifies it, checks recyclability, and estimates its value in seconds.",
        color: "bg-purple-50 text-purple-600 dark:bg-purple-900/10 dark:text-purple-400 border-purple-100 dark:border-purple-900/20",
        accent: "text-purple-600"
    },
    {
        icon: Gift,
        title: "Rewards & Impact",
        description: "Earn points for every recycle. Redeem them for coupons, products, or donate to environmental causes.",
        color: "bg-orange-50 text-orange-600 dark:bg-orange-900/10 dark:text-orange-400 border-orange-100 dark:border-orange-900/20",
        accent: "text-orange-600"
    },
    {
        icon: Leaf,
        title: "Carbon Tracking",
        description: "Visualize your contribution. See exactly how much CO₂ you've saved and your personal environmental footprint.",
        color: "bg-green-50 text-emerald-600 dark:bg-green-900/10 dark:text-emerald-400 border-green-100 dark:border-green-900/20",
        accent: "text-emerald-600"
    }
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
                ease: "power3.out",
                scrollTrigger: {
                    trigger: headerRef.current,
                    start: "top 85%",
                    end: "bottom 60%",
                    scrub: 1
                }
            }
        );

        // Animate Grid Items
        if (gridRef.current) {
            gsap.fromTo(gridRef.current.children,
                { 
                    scale: 0.8,
                    rotation: 5,
                    opacity: 0,
                    y: 50 
                },
                {
                    scale: 1,
                    rotation: 0,
                    opacity: 1,
                    y: 0,
                    stagger: 0.1,
                    ease: "linear",
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: "top 80%",
                        end: "bottom 60%",
                        scrub: 1
                    }
                }
            );
        }

    }, { scope: sectionRef });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
         const card = e.currentTarget;
         const rect = card.getBoundingClientRect();
         const x = e.clientX - rect.left;
         const y = e.clientY - rect.top;

         card.style.setProperty("--mouse-x", `${x}px`);
         card.style.setProperty("--mouse-y", `${y}px`);
    };

    return (
        <section ref={sectionRef} id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
             {/* Ambient Background Glow */}
             <div className="absolute top-1/4 left-0 w-full h-[500px] bg-forest-green/5 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <div ref={headerRef} className="text-center mb-20">
                    <span className="text-sm font-bold text-forest-green tracking-wider uppercase mb-3 block">Powerful Features</span>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
                        Everything you need to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-500">recycle smarter.</span>
                    </h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
                        We've built a complete ecosystem to make e-waste recycling effortless, rewarding, and transparent.
                    </p>
                </div>

                {/* Features Grid */}
                <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            onMouseMove={(e) => handleMouseMove(e, index)}
                            className="group relative h-full rounded-[2rem] border border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-900 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-forest-green/10"
                            style={{
                                // @ts-ignore
                                "--mouse-x": "0px",
                                "--mouse-y": "0px"
                            }}
                        >
                            {/* Spotlight Effect Layer */}
                            <div 
                                className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100"
                                style={{
                                    background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(16, 185, 129, 0.15), transparent 40%)`
                                }}
                            />
                            
                            {/* Spotlight Border Layer */}
                             <div 
                                className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100"
                                style={{
                                    background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(16, 185, 129, 0.6), transparent 40%)`,
                                    maskImage: "linear-gradient(black, black), linear-gradient(black, black)",
                                    maskClip: "content-box, border-box",
                                    maskComposite: "exclude",
                                    WebkitMaskComposite: "xor",
                                    padding: "1px",
                                }}
                            />

                            {/* Main Card Content */}
                            <div className="relative p-8 h-full flex flex-col z-10">
                                {/* Icon Container */}
                                <div className={`w-14 h-14 rounded-2xl ${feature.color} border flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500`}>
                                    <feature.icon className="w-7 h-7" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm mb-8 flex-1 font-medium">
                                    {feature.description}
                                </p>

                                <div className="flex items-center text-sm font-extrabold text-foreground transition-all duration-300 group/link">
                                    <span className="mr-2 group-hover:mr-3 transition-all">Learn more</span>
                                    <ArrowRight className="w-4 h-4 text-forest-green" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Trust Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="mt-20 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/50 dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-2 h-2 rounded-full bg-forest-green animate-pulse" />
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                            Built for impact • Designed for everyone
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
