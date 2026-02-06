"use client";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Play, Shield, Zap, Globe, Recycle, Leaf } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AuroraBackground } from "../ui/AuroraBackground";
import { TextPlugin } from "gsap/TextPlugin";
import { useSession } from "@/hooks/useSession";

gsap.registerPlugin(TextPlugin);

export default function HeroSection() {
    const { isAuthenticated } = useSession();
    const [isMounted, setIsMounted] = React.useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const visualRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        // Initial set to ensure no flash (though CSS opacity-0 handles most)
        gsap.set(contentRef.current?.children || [], { y: 50, opacity: 0 });
        gsap.set(visualRef.current, { x: 50, opacity: 0, scale: 0.9 });

        // Scramble Text Animation
        gsap.to(".hero-scramble", {
            duration: 1.5,
            text: {
                value: "Turn Your Old Tech",
                delimiter: ""
            },
            ease: "none",
            delay: 0.5
        });

        gsap.to(".hero-scramble-2", {
            duration: 1.5,
            text: {
                value: "into New Possibilities.",
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
                    <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
                        {/* Content Left */}
                        <div ref={contentRef} className="text-left space-y-8">
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-forest-green/20 rounded-full shadow-sm hover:shadow-md transition-all cursor-default opacity-0">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-green opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-forest-green"></span>
                                </span>
                                <span className="text-xs font-bold text-forest-green tracking-wide uppercase">The Future of E-Waste Management</span>
                            </div>

                            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-[1.05] drop-shadow-sm min-h-[3.3em] lg:min-h-[2.2em] opacity-0">
                                <span className="hero-scramble block">Turn Your Old Tech</span>
                                <span className="hero-scramble-2 text-transparent bg-clip-text bg-gradient-to-r from-forest-green via-emerald-500 to-teal-500 animate-gradient-x block">
                                    into New Possibilities.
                                </span>
                            </h1>

                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed font-medium opacity-0">
                                Locate a smart bin, deposit e-waste with AI-powered ease, and earn real rewards. Simple. Secure. Sustainable.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 opacity-0">
                                <Link
                                    href={isMounted && isAuthenticated ? "/dashboard" : "/login"}
                                    className="w-full sm:w-auto px-8 py-4 bg-forest-green hover:bg-[#0a3f30] text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-forest-green/30 hover:shadow-2xl hover:shadow-forest-green/40 hover:-translate-y-1 group relative overflow-hidden"
                                >
                                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                                    <span className="relative z-10 flex items-center gap-2">
                                        {isMounted && isAuthenticated ? 'Open App' : 'Get Started For Free'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                                <Link
                                    href="https://drive.google.com/file/d/15WDSTvG2J9wDqfyYuSn_e6oG-zGXIeSZ/view?usp=drive_link"
                                    target="_blank"
                                    className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/5 text-gray-900 dark:text-white rounded-2xl font-bold flex items-center justify-center gap-2 border-2 border-transparent hover:border-gray-200 dark:hover:border-neutral-700 hover:bg-gray-50 dark:hover:bg-white/10 transition-all backdrop-blur-md"
                                >
                                    <Play className="w-4 h-4 fill-current" /> Watch Demo
                                </Link>
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
                        <div ref={visualRef} className="relative block perspective-1000 opacity-0 w-full max-w-[420px] mx-auto lg:mx-0">
                            <div className="relative z-10 w-full aspect-[4/5] group">
                                {/* Glow Effect */}
                                <div className="absolute -inset-4 bg-emerald-500/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent rounded-[2.5rem] -z-10" />

                                <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] group-hover:rotate-y-2">
                                    <img
                                        src="/assets/images/smart-bin-hero.png"
                                        alt="Smart Bin"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                </div>

                                {/* Floating Badge */}
                                <div className="absolute -bottom-6 -right-6 bg-white dark:bg-neutral-900 p-4 rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 flex items-center gap-3 floating-item z-20">
                                    <div className="w-10 h-10 rounded-xl bg-forest-green flex items-center justify-center text-white">
                                        <Zap className="w-5 h-5 fill-current" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-gray-400">Scan Speed</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Under 2 Sec</p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Floating Element */}
                            <div className="absolute top-10 -left-12 w-20 h-20 bg-emerald-500/10 backdrop-blur-3xl rounded-3xl flex items-center justify-center border border-white/20 floating-item z-20" style={{ animationDelay: "1.5s" }}>
                                <Leaf className="w-8 h-8 text-emerald-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </AuroraBackground>
        </section>
    );
}
