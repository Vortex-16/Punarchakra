"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Play, Shield, Zap, Globe } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const visualRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.fromTo(contentRef.current?.children || [],
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.1, delay: 0.5 }
        );

        tl.fromTo(visualRef.current,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.5, ease: "elastic.out(1, 0.75)" },
            "-=0.8"
        );

        // Floating animation for visual items
        gsap.to(".floating-item", {
            y: -20,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: 0.2
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white dark:bg-neutral-950">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-forest-green/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Content Left */}
                    <div ref={contentRef} className="text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-forest-green/10 rounded-full mb-8">
                            <Zap className="w-4 h-4 text-forest-green" />
                            <span className="text-sm font-bold text-forest-green uppercase tracking-wider">The Future of E-Waste</span>
                        </div>

                        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter leading-[0.9]">
                            Recycle <span className="text-forest-green">Smarter</span>, Live Greener.
                        </h1>

                        <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-lg leading-relaxed font-medium">
                            Punarchakra leverages AI to make e-waste disposal rewarding. Find bins, scan items, and earn rewards while saving the planet.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="w-full sm:w-auto px-8 py-4 bg-forest-green hover:bg-[#0a3f30] text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-2xl shadow-forest-green/20 hover:shadow-forest-green/40 hover:-translate-y-1 group"
                            >
                                Get Started Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white rounded-2xl font-bold flex items-center justify-center gap-2 border border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all">
                                <Play className="w-5 h-5 fill-current" /> Watch Demo
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-12 pt-12 border-t border-gray-100 dark:border-neutral-800 flex flex-wrap gap-8">
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-forest-green" />
                                <span className="text-sm font-bold text-gray-500">Secure Deposits</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="w-5 h-5 text-forest-green" />
                                <span className="text-sm font-bold text-gray-500">Eco-Friendly</span>
                            </div>
                        </div>
                    </div>

                    {/* Visual Right */}
                    <div ref={visualRef} className="relative hidden lg:block opacity-0">
                        <div className="relative z-10 w-full aspect-square rounded-[3rem] bg-gradient-to-br from-forest-green to-emerald-600 p-1 shadow-2xl overflow-hidden group">
                            <div className="w-full h-full rounded-[2.8rem] bg-white dark:bg-neutral-900 flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-forest-green/5 group-hover:bg-transparent transition-colors duration-700" />
                                {/* Placeholder for a 3D-like icon or Illustration */}
                                <div className="relative text-forest-green floating-item">
                                    <Zap className="w-48 h-48 animate-pulse" strokeWidth={1} />
                                </div>
                            </div>
                        </div>

                        {/* Floating Decorative Items */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white dark:bg-neutral-800 rounded-3xl shadow-xl flex items-center justify-center border border-gray-100 dark:border-neutral-700 floating-item">
                            <Shield className="w-12 h-12 text-forest-green" />
                        </div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-forest-green text-white rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center p-6 floating-item" style={{ animationDelay: "0.5s" }}>
                            <span className="text-4xl font-black">98%</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Recycle Rate</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
