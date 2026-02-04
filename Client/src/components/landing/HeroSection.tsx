"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Recycle, Leaf, Sparkles, MapPin } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function HeroSection() {
    const containerRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const visualRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Initial Setups
        gsap.set([badgeRef.current, ...(textRef.current?.children || [])], { autoAlpha: 0, y: 30 });
        gsap.set(visualRef.current, { autoAlpha: 0, scale: 0.9 });

        // Animation Sequence
        tl.to(badgeRef.current, { autoAlpha: 1, y: 0, duration: 0.8 })
            .to(textRef.current?.children || [], {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1
            }, "-=0.4")
            .to(visualRef.current, {
                autoAlpha: 1,
                scale: 1,
                duration: 1,
                ease: "back.out(1.2)"
            }, "-=0.6");

        // Floating Animations
        gsap.to(".floating-card-1", {
            y: -10,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        gsap.to(".floating-card-2", {
            y: 10,
            duration: 2.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 0.5
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative min-h-[90vh] flex items-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white dark:bg-neutral-950">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-forest-green/10 dark:bg-forest-green/20 rounded-[100%] blur-[100px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-green-500/5 dark:bg-green-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Left Content */}
                <div className="text-center lg:text-left">
                    {/* Premium Badge */}
                    <div ref={badgeRef} className="invisible inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-green/5 dark:bg-white/10 border border-forest-green/10 dark:border-white/20 backdrop-blur-sm mb-8">
                        <span className="flex h-2 w-2 rounded-full bg-forest-green dark:bg-green-400 animate-pulse"></span>
                        <span className="text-sm font-bold text-forest-green dark:text-white tracking-wide uppercase">
                            Smart E-Waste Revolution
                        </span>
                    </div>

                    <div ref={textRef}>
                        {/* Headline */}
                        <h1 className="invisible text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-[1.1] tracking-tighter">
                            Recycle Smart. <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-green to-emerald-500 dark:from-green-400 dark:to-emerald-300">
                                Earn Rewards.
                            </span>
                        </h1>

                        <p className="invisible text-xl text-gray-500 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                            Transform your old electronics into value with our AI-powered smart bins.
                            Sustainable, simple, and instant.
                        </p>

                        {/* CTAs */}
                        <div className="invisible flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <Link
                                href="/dashboard"
                                className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-forest-green text-white rounded-2xl font-bold text-lg overflow-hidden transition-all hover:shadow-2xl hover:shadow-forest-green/30 hover:-translate-y-1"
                            >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                <span>Start Recycling</span>
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                href="#how-it-works"
                                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all hover:-translate-y-1"
                            >
                                <Sparkles className="mr-2 w-5 h-5 text-forest-green dark:text-green-400" />
                                How it Works
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="invisible mt-12 flex items-center justify-center lg:justify-start gap-8 text-sm font-semibold text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <Leaf className="w-3 h-3 text-forest-green dark:text-green-400" />
                                </div>
                                <span>Eco-Friendly</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <Recycle className="w-3 h-3 text-forest-green dark:text-green-400" />
                                </div>
                                <span>Instant Rewards</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Visual - Modern Glassmorphism Composition */}
                <div ref={visualRef} className="relative hidden lg:block invisible">
                    <div className="relative z-10 w-full aspect-square max-w-[600px] mx-auto">
                        {/* Main Glass Card */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-white/10 dark:to-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/50 dark:border-white/10 shadow-2xl overflow-hidden p-8 flex flex-col justify-between">
                            {/* Decorative Header */}
                            <div className="flex justify-between items-center mb-8">
                                <div className="h-2 w-20 bg-gray-200 dark:bg-white/20 rounded-full" />
                                <div className="h-8 w-8 rounded-full border border-gray-200 dark:border-white/20" />
                            </div>

                            {/* Central Visual (Abstract Bin/Scan) */}
                            <div className="flex-1 flex items-center justify-center relative">
                                <div className="w-64 h-64 bg-forest-green/5 dark:bg-green-500/10 rounded-full flex items-center justify-center relative">
                                    <div className="absolute inset-0 border border-forest-green/20 dark:border-green-500/20 rounded-full scale-110" />
                                    <div className="absolute inset-0 border border-forest-green/10 dark:border-green-500/10 rounded-full scale-125" />
                                    <Recycle className="w-24 h-24 text-forest-green dark:text-green-400" />
                                </div>

                                {/* Floating Stat Card 1 */}
                                <div className="floating-card-1 absolute top-10 right-0 bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800">
                                    <p className="text-xs text-gray-400 mb-1">Impact</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-forest-green dark:text-white">+ 450 pts</span>
                                    </div>
                                </div>

                                {/* Floating Stat Card 2 */}
                                <div className="floating-card-2 absolute bottom-10 left-0 bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                            <Leaf className="w-4 h-4 text-forest-green" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">Recycled</p>
                                            <p className="text-xs text-gray-500">Just now</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Background Decor Elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-300/30 rounded-full blur-2xl -z-10" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-forest-green/20 rounded-full blur-2xl -z-10" />
                    </div>

import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, PlayCircle } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-off-white to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center lg:text-left"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-forest-green/10 dark:bg-forest-green/20 rounded-full mb-6"
                        >
                            <span className="w-2 h-2 bg-success-green rounded-full animate-pulse"></span>
                            <span className="text-sm font-semibold text-forest-green dark:text-neon-lime">
                                AI-Powered Smart Recycling
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-forest-green dark:text-white leading-tight mb-6">
                            Smart E-Waste
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-green to-success-green dark:from-neon-lime dark:to-soft-teal">
                                Recycling Made Simple
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg sm:text-xl text-text-secondary dark:text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            Turn your old electronics into value. Find smart bins nearby, get
                            instant AI detection, earn rewards, and track your environmental
                            impact—all in one platform.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                href="/map"
                                className="group px-8 py-4 bg-forest-green hover:bg-forest-green/90 text-white rounded-xl font-bold text-lg transition-all hover-scale shadow-xl shadow-forest-green/25 flex items-center justify-center gap-2"
                            >
                                <MapPin className="w-5 h-5" />
                                Find a Bin Near Me
                                <span className="group-hover:translate-x-1 transition-transform inline-block">
                                    →
                                </span>
                            </Link>
                            <button
                                onClick={() => scrollToSection("how-it-works")}
                                className="px-8 py-4 bg-white dark:bg-gray-800 border-2 border-forest-green/20 dark:border-gray-700 hover:border-forest-green dark:hover:border-neon-lime text-forest-green dark:text-white rounded-xl font-bold text-lg transition-all hover-lift flex items-center justify-center gap-2"
                            >
                                <PlayCircle className="w-5 h-5" />
                                See How It Works
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-text-muted dark:text-gray-400"
                        >
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-success-green" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Free to Use</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-success-green" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">AI-Verified</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-success-green" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Privacy-First</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="relative"
                    >
                        <div className="relative w-full aspect-square max-w-xl mx-auto">
                            {/* Background Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-forest-green/20 via-success-green/10 to-transparent rounded-3xl blur-3xl"></div>

                            {/* Main Image placeholder for future use */}
                            <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-light-grey to-white dark:from-gray-800 dark:to-gray-900 p-8 flex items-center justify-center">
                                <div className="text-text-muted dark:text-gray-500 font-medium italic">
                                    Illustration placeholder
                                </div>
                            </div>

                            {/* Floating Stats Cards */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                                className="absolute -left-4 top-1/4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 border border-gray-100 dark:border-gray-700"
                            >
                                <p className="text-xs font-semibold text-text-muted dark:text-gray-400 mb-1">
                                    CO₂ Saved
                                </p>
                                <p className="text-2xl font-black text-forest-green dark:text-neon-lime">
                                    850<span className="text-sm ml-1">tons</span>
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1 }}
                                className="absolute -right-4 bottom-1/4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 border border-gray-100 dark:border-gray-700"
                            >
                                <p className="text-xs font-semibold text-text-muted dark:text-gray-400 mb-1">
                                    Items Recycled
                                </p>
                                <p className="text-2xl font-black text-forest-green dark:text-neon-lime">
                                    12.5<span className="text-sm ml-1">K</span>
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
