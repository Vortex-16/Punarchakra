"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const steps = [
    {
        image: "/assets/images/step1-locate.png",
        title: "Locate",
        description: "Find a bin near you with our app",
        color: "bg-emerald-500/10",
        hoverBorder: "group-hover:border-emerald-500",
    },
    {
        image: "/assets/images/step2-scan.png",
        title: "Scan & Drop",
        description: "Scan the bin & Deposit Your Item",
        color: "bg-emerald-500/10",
        hoverBorder: "group-hover:border-emerald-500",
    },
    {
        image: "/assets/images/step3-verify.png",
        title: "AI Verification",
        description: "Our Secure AI Instantly Identify and values your item",
        color: "bg-emerald-500/10",
        hoverBorder: "group-hover:border-emerald-500",
    },
    {
        image: "/assets/images/step4-earn.png",
        title: "Earn",
        description: "Receive Points Instantly to redeem your rewards",
        color: "bg-emerald-500/10",
        hoverBorder: "group-hover:border-emerald-500",
    },
];

export default function HowItWorks() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const stepsRef = useRef<HTMLDivElement>(null);

    const beamRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Animate Header
        if (headerRef.current) {
            gsap.fromTo(headerRef.current,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    scrollTrigger: {
                        trigger: headerRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        // Animate Steps
        if (stepsRef.current) {
            const stepItems = gsap.utils.toArray<HTMLElement>(".step-item");

            stepItems.forEach((step, index) => {
                const slideFromRight = index % 2 !== 0;

                gsap.set(step, {
                    clipPath: slideFromRight ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
                    webkitClipPath: slideFromRight ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
                    x: slideFromRight ? 50 : -50,
                    opacity: 0
                });

                gsap.to(step, {
                    clipPath: "inset(0 0% 0 0)",
                    webkitClipPath: "inset(0 0% 0 0)",
                    x: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: step,
                        start: "top 75%",
                        end: "bottom 25%",
                        toggleActions: "play none none reverse"
                    }
                });
            });

            // Animate Vertical Line Beam
            if (beamRef.current) {
                gsap.fromTo(beamRef.current,
                    { height: "0%" },
                    {
                        height: "100%",
                        ease: "none",
                        scrollTrigger: {
                            trigger: stepsRef.current,
                            start: "top center",
                            end: "bottom center",
                            scrub: true
                        }
                    }
                );
            }
        }
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-neutral-900/50 overflow-hidden">
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
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800 -translate-x-1/2">
                        <div
                            ref={beamRef}
                            className="absolute top-0 left-0 w-full bg-gradient-to-b from-transparent via-green-400 to-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]"
                        >
                            {/* Glowing Head */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_25px_rgba(255,255,255,1)] z-20" />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-8 bg-green-500/40 rounded-full blur-md z-10" />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-12 bg-green-400/20 rounded-full blur-lg z-0" />
                        </div>
                    </div>

                    <div className="space-y-12 lg:space-y-0">
                        {steps.map((step, index) => (
                            <div key={index} className="step-item relative flex justify-center opacity-0 w-full">
                                <div className="w-full max-w-4xl relative">
                                    {/* Central Node for Desktop (Optional visual anchor) */}
                                    <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-forest-green border-[4px] border-white dark:border-neutral-950 shadow-lg z-20" />

                                    {/* Alternating Layout: Row for Even, Row-Reverse for Odd */}
                                    <div className={`relative overflow-hidden bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-lg border border-gray-100 dark:border-gray-800 ${step.hoverBorder} hover:shadow-2xl transition-all duration-500 group flex flex-col md:flex-row ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>

                                        {/* Content Side */}
                                        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative z-10">
                                            <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-forest-green/10 text-forest-green font-black text-lg shadow-inner">
                                                {index + 1}
                                            </div>
                                            <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-6 tracking-tight group-hover:text-forest-green transition-colors">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg font-medium">
                                                {step.description}
                                            </p>
                                        </div>

                                        {/* Image Side */}
                                        <div className={`flex-1 relative min-h-[300px] md:min-h-[400px] overflow-hidden ${step.color}`}>
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-50" />
                                            <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl" />

                                            <img
                                                src={step.image}
                                                alt={step.title}
                                                className="absolute inset-0 w-full h-full object-contain p-12 transform group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-700 ease-out drop-shadow-2xl"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
