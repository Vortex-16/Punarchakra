"use client";
import React, { useRef } from "react";
import { Leaf, Droplet, Package, Users } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const messageRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Background Parallax
        gsap.to(".bg-pattern", {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        // Header
        gsap.fromTo(headerRef.current,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 2.5,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: headerRef.current,
                    start: "top 90%",
                    end: "bottom 60%",
                    scrub: 1
                }
            }
        );

        // Stats Grid
        if (gridRef.current) {
            gsap.set(gridRef.current, { perspective: 1000 });
            
            gsap.fromTo(gridRef.current.children,
                { 
                    rotationX: 90, 
                    y: 50, 
                    opacity: 0,
                    transformOrigin: "center top",
                },
                {
                    rotationX: 0,
                    y: 0,
                    opacity: 1,
                    duration: 2.5,
                    stagger: 0.15,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: "top 85%",
                        end: "center center",
                        scrub: 1
                    }
                }
            );
        }

        // Message
        gsap.fromTo(messageRef.current,
            { y: 20, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                delay: 0.2,
                scrollTrigger: {
                    trigger: messageRef.current,
                    start: "top 90%",
                    end: "bottom 80%",
                    scrub: 1
                }
            }
        );

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} id="impact" className="py-24 px-4 sm:px-6 lg:px-8 bg-forest-green dark:bg-neutral-900 text-white overflow-hidden relative">
            {/* Background Pattern */}
            <div className="bg-pattern absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent -top-1/4 h-[150%] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <div ref={headerRef} className="text-center mb-20 opacity-0">
                    <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">
                        Our Collective Impact
                    </h2>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                        Together, we're making a real difference. Here's the environmental impact our community has achieved.
                    </p>
                </div>

                {/* Stats Grid */}
                <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {impactStats.map((stat, index) => (
                        <div key={index} className="relative group opacity-0">
                            {/* Card */}
                            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 hover:bg-white/20 hover:shadow-lg hover:shadow-black/10 transition-all duration-500 transform hover:-translate-y-2 group">
                                {/* Icon */}
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:bg-white/30 group-hover:animate-pulse">
                                    <stat.icon className="w-7 h-7 text-white" />
                                </div>

                                {/* Value */}
                                <div className="mb-2">
                                    <span className="text-5xl font-black text-white tracking-tighter">
                                        {stat.value}
                                    </span>
                                    <span className="text-sm ml-2 text-white/80 font-bold uppercase tracking-wider">
                                        {stat.unit}
                                    </span>
                                </div>

                                {/* Label */}
                                <h3 className="text-lg font-bold text-white mb-2">
                                    {stat.label}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-white/60 leading-relaxed max-w-[80%]">
                                    {stat.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Inspiring Message */}
                <div ref={messageRef} className="text-center opacity-0">
                    <div className="inline-block max-w-4xl mx-auto bg-white/5 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-white/10">
                        <p className="text-2xl sm:text-3xl font-bold text-white mb-6 leading-tight">
                            "Every item you recycle creates a ripple effect."
                        </p>
                        <p className="text-white/70 leading-relaxed text-lg">
                            When you drop an old phone or laptop into a smart bin, you're not just disposing of waste—you're conserving resources, reducing pollution, and inspiring others to do the same.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
