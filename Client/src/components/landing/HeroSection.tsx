"use client";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Play, Shield, Zap, Globe, Recycle, Leaf } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AuroraBackground } from "../ui/AuroraBackground";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const visualRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        // Initial set to ensure no flash (though CSS opacity-0 handles most)
        gsap.set(contentRef.current?.children || [], { y: 50, opacity: 0 });
        gsap.set(visualRef.current, { x: 50, opacity: 0, scale: 0.9 });

        // Scramble Text Animation
        gsap.to(".hero-scramble", {
            duration: 1.5,
            text: {
                value: "Recycle Smarter,",
                delimiter: ""
            },
            ease: "none",
            delay: 0.5
        });
        
         gsap.to(".hero-scramble-2", {
            duration: 1.5,
            text: {
                value: "Live Greener.",
                delimiter: ""
            },
            ease: "none",
            delay: 1.5
        });


        tl.to(contentRef.current?.children || [],
            { y: 0, opacity: 1, duration: 1, stagger: 0.1, delay: 0.2 }
        );

        tl.to(visualRef.current,
            { x: 0, opacity: 1, scale: 1, duration: 1.2, ease: "expo.out" },
            "-=0.8"
        );

        // Continuous floating animation
        gsap.to(".floating-item", {
            y: -20,
            rotate: 5,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: {
                each: 0.5,
                from: "random"
            }
        });

    }, { scope: containerRef });

    return (
        <section className="relative w-full overflow-hidden bg-white dark:bg-[#050505]">
             <AuroraBackground className="h-full pt-20 pb-12 lg:pt-32 lg:pb-24">
                <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
                        {/* Content Left */}
                        <div ref={contentRef} className="text-left space-y-8">
                             <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-forest-green/20 rounded-full shadow-sm hover:shadow-md transition-all cursor-default opacity-0">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-green opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-forest-green"></span>
                                </span>
                                <span className="text-xs font-bold text-forest-green tracking-wide uppercase">The Future of E-Waste Management</span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-[1.05] drop-shadow-sm min-h-[3.3em] lg:min-h-[2.2em] opacity-0">
                                <span className="hero-scramble block">R3cycl3 Sm4rt3r,</span>
                                <span className="hero-scramble-2 text-transparent bg-clip-text bg-gradient-to-r from-forest-green via-emerald-500 to-teal-500 animate-gradient-x block">
                                    L1ve Gr33n3r.
                                </span>
                            </h1>

                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed font-medium opacity-0">
                                Transform your e-waste into rewards with our AI-powered disposal system. Join the revolution for a cleaner planet.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 opacity-0">
                                <Link
                                    href="/dashboard"
                                    className="w-full sm:w-auto px-8 py-4 bg-forest-green hover:bg-[#0a3f30] text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-forest-green/30 hover:shadow-2xl hover:shadow-forest-green/40 hover:-translate-y-1 group relative overflow-hidden"
                                >
                                     <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                                    <span className="relative z-10 flex items-center gap-2">Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                                </Link>
                                <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/5 text-gray-900 dark:text-white rounded-2xl font-bold flex items-center justify-center gap-2 border-2 border-transparent hover:border-gray-200 dark:hover:border-neutral-700 hover:bg-gray-50 dark:hover:bg-white/10 transition-all backdrop-blur-md">
                                    <Play className="w-4 h-4 fill-current" /> Watch Demo
                                </button>
                            </div>

                            {/* Stats / Trust */}
                            <div className="pt-8 flex items-center gap-10 border-t border-gray-200 dark:border-white/10 opacity-0">
                                <div>
                                    <h4 className="text-3xl font-black text-gray-900 dark:text-white">50K+</h4>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Active Users</p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-black text-gray-900 dark:text-white">120K</h4>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Kg Recycled</p>
                                </div>
                            </div>
                        </div>

                        {/* Visual Right */}
                        <div ref={visualRef} className="relative hidden lg:block perspective-1000 opacity-0">
                             <div className="relative z-10 w-full aspect-square max-w-[480px] mx-auto">
                                {/* Glass Card Stack */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 dark:from-white/5 dark:to-transparent backdrop-blur-2xl rounded-[2.5rem] border border-white/20 dark:border-white/10 shadow-2xl transform rotate-[-6deg] translate-y-4"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 dark:from-white/5 dark:to-transparent backdrop-blur-2xl rounded-[2.5rem] border border-white/20 dark:border-white/10 shadow-2xl transform rotate-[-3deg] translate-y-2"></div>
                                
                                <div className="relative h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-900 rounded-[2.5rem] p-2 shadow-2xl overflow-hidden group transform transition-transform duration-700 hover:rotate-y-6 hover:rotate-x-6 border border-white/50 dark:border-white/10">
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1597423244036-ef5020e83f3c?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-90 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-75" />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

                                    <div className="relative h-full flex flex-col justify-end p-8">
                                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 rounded-2xl bg-forest-green flex items-center justify-center text-white shadow-lg shadow-forest-green/30">
                                                    <Recycle className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-bold text-lg leading-tight">Smart Recycling</h3>
                                                    <p className="text-gray-300 text-xs font-medium">AI-Powered Detection</p>
                                                </div>
                                            </div>
                                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                                <div className="h-full w-[75%] bg-forest-green rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             </div>

                            {/* Floating Elements */}
                            <div className="absolute top-10 -left-8 w-24 h-24 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-center border border-white/50 dark:border-white/10 floating-item z-20">
                                <Leaf className="w-10 h-10 text-emerald-500 drop-shadow-lg" />
                            </div>
                            <div className="absolute bottom-24 -right-8 w-20 h-20 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-center border border-white/50 dark:border-white/10 floating-item z-20" style={{ animationDelay: "1s" }}>
                                <Zap className="w-8 h-8 text-yellow-500 drop-shadow-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </AuroraBackground>
        </section>
    );
}
