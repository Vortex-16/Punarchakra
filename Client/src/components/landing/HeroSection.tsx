"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Play, Shield, Zap, Globe, Recycle, Leaf } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const visualRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.fromTo(contentRef.current?.children || [],
            { y: 100, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.15, delay: 0.2 }
        );

        tl.fromTo(visualRef.current,
            { x: 100, opacity: 0, rotate: 10 },
            { x: 0, opacity: 1, rotate: 0, duration: 1.5, ease: "expo.out" },
            "-=1"
        );

        // Continuous floating animation
        gsap.to(".floating-item", {
            y: -25,
            rotate: 5,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: {
                each: 0.5,
                from: "random"
            }
        });

        // Mouse Move Parallax
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 20; // range -10 to 10
            const y = (clientY / window.innerHeight - 0.5) * 20;

            gsap.to(".bg-blob", {
                x: (i) => x * (i + 1) * 2, // different speed for each blob
                y: (i) => y * (i + 1) * 2,
                duration: 2,
                ease: "power2.out"
            });

            gsap.to(visualRef.current, {
                rotateY: x * 0.5,
                rotateX: -y * 0.5,
                duration: 1,
                ease: "power2.out",
                transformPerspective: 1000
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative pt-24 pb-12 lg:pt-36 lg:pb-24 overflow-hidden bg-gray-50 dark:bg-[#050505]">
            {/* Premium Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-forest-green/20 to-emerald-500/20 blur-[150px] rounded-full bg-blob opacity-60 dark:opacity-40" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/20 to-teal-500/20 blur-[130px] rounded-full bg-blob opacity-60 dark:opacity-40" />
                <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-lime-400/10 blur-[100px] rounded-full bg-blob" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
                    {/* Content Left */}
                    <div ref={contentRef} className="text-left space-y-6">
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-forest-green/20 rounded-full shadow-sm hover:shadow-md transition-all cursor-default">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-green opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-forest-green"></span>
                            </span>
                            <span className="text-xs font-bold text-forest-green tracking-wide uppercase">The Future of E-Waste Management</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-[0.95] drop-shadow-sm">
                            Recycle <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-green via-emerald-500 to-teal-500 animate-gradient-x">Smarter</span>, <br />
                            Live Greener.
                        </h1>

                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed font-medium">
                            Transform your e-waste into rewards with our AI-powered disposal system. Join the revolution for a cleaner planet.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                            <Link
                                href="/dashboard"
                                className="w-full sm:w-auto px-8 py-3.5 bg-forest-green hover:bg-[#0a3f30] text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-forest-green/30 hover:shadow-2xl hover:shadow-forest-green/40 hover:-translate-y-1 group"
                            >
                                Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-white/5 text-gray-900 dark:text-white rounded-2xl font-bold flex items-center justify-center gap-2 border-2 border-transparent hover:border-gray-200 dark:hover:border-neutral-700 hover:bg-gray-50 dark:hover:bg-white/10 transition-all backdrop-blur-md">
                                <Play className="w-4 h-4 fill-current" /> Watch Demo
                            </button>
                        </div>

                        {/* Stats / Trust */}
                        <div className="pt-6 flex items-center gap-10 border-t border-gray-200 dark:border-white/10">
                            <div>
                                <h4 className="text-2xl font-black text-gray-900 dark:text-white">50K+</h4>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Active Users</p>
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-gray-900 dark:text-white">120K</h4>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Kg Recycled</p>
                            </div>
                        </div>
                    </div>

                    {/* Visual Right */}
                    <div ref={visualRef} className="relative hidden lg:block perspective-1000">
                        <div className="relative z-10 w-full aspect-square max-w-[420px] mx-auto rounded-[2rem] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-900 p-2 shadow-2xl overflow-hidden group transform transition-transform duration-700 hover:rotate-y-6 hover:rotate-x-6">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1597423244036-ef5020e83f3c?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-90 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-75" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

                            <div className="relative h-full flex flex-col justify-end p-8">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-forest-green flex items-center justify-center text-white">
                                            <Recycle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-base">Smart Recycling</h3>
                                            <p className="text-gray-300 text-xs">AI-Powered Detection</p>
                                        </div>
                                    </div>
                                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full w-[75%] bg-forest-green rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute top-20 -left-16 w-24 h-24 bg-white dark:bg-neutral-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-center border border-gray-100 dark:border-neutral-700 floating-item z-20">
                            <Leaf className="w-10 h-10 text-emerald-500" />
                        </div>
                        <div className="absolute bottom-40 -right-12 w-20 h-20 bg-white dark:bg-neutral-800 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-center border border-gray-100 dark:border-neutral-700 floating-item z-20" style={{ animationDelay: "1s" }}>
                            <Zap className="w-8 h-8 text-yellow-500" />
                        </div>

                        {/* Circle Decor */}
                        <div className="absolute -top-10 -right-20 w-64 h-64 bg-forest-green/20 rounded-full blur-3xl -z-10 animate-pulse" />
                    </div>
                </div>
            </div>
        </section>
    );
}
