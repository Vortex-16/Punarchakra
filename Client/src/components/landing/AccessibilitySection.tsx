"use client";
import React, { useRef } from "react";
import { Mic, Eye, Smartphone, Volume2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const accessibilityFeatures = [
    {
        icon: Mic,
        title: "Voice Commands",
        description: "Navigate entirely by voice. 'Where is the nearest bin?' works instantly.",
    },
    {
        icon: Eye,
        title: "High Contrast UI",
        description: "Designed for visibility with clear type, distinct colors, and screen reader support.",
    },
    {
        icon: Smartphone,
        title: "Dynamic Text Sizing",
        description: "Scale text up or down without breaking the layout. Read comfortably on any device.",
    },
    {
        icon: Volume2,
        title: "Audio Feedback",
        description: "Hear confirmation tones and spoken results for every scan and interaction.",
    },
];

export default function AccessibilitySection() {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const visualRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Animate Left Content Text
        gsap.fromTo(contentRef.current,
            { x: -50, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 2.5,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: contentRef.current,
                    start: "top 85%",
                    end: "bottom 60%",
                    scrub: 1
                }
            }
        );

        // Animate List Items Staggered
        if (listRef.current) {
            gsap.fromTo(listRef.current.children,
                { x: -50, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 2.5,
                    stagger: 0.1,
                    ease: "power4.out",
                    delay: 0.2, // Wait for header a bit
                    scrollTrigger: {
                        trigger: listRef.current,
                        start: "top 85%",
                        end: "bottom 60%",
                        scrub: 1
                    }
                }
            );
        }

        // Animate Right Visual
        gsap.fromTo(visualRef.current,
            { scale: 0.8, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 3.0,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: visualRef.current,
                    start: "top 85%",
                    end: "center center",
                    scrub: 1
                }
            }
        );

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div>
                        <div ref={contentRef} className="opacity-0">
                            <span className="text-sm font-bold text-forest-green tracking-wider uppercase mb-2 block">Inclusive Design</span>
                            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                                Technology that Includes Everyone.
                            </h2>
                            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                                We believe sustainability should be accessible to all. That's why we've built Punarchakra with accessibility at its core, not as an afterthought.
                            </p>
                        </div>

                        <div ref={listRef} className="space-y-6">
                            {accessibilityFeatures.map((feature, index) => (
                                <div key={index} className="flex gap-4 opacity-0 group transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/5 p-4 rounded-xl -mx-4 hover:translate-x-2 cursor-default">
                                    <div className="flex-shrink-0 w-12 h-12 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform duration-300">
                                        <feature.icon className="w-6 h-6 text-forest-green dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Visual */}
                    <div ref={visualRef} className="relative opacity-0">
                        <div className="relative aspect-square bg-white dark:bg-neutral-800 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden p-8 flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-900/10"></div>

                            <div className="relative z-10 text-center space-y-8">
                                <div className="inline-block p-4 bg-forest-green rounded-full shadow-lg shadow-forest-green/30 animate-pulse">
                                    <Mic className="w-12 h-12 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">"Find e-waste bins"</p>
                                    <p className="text-forest-green font-medium">Listening...</p>
                                </div>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 3, 2, 1].map((h, i) => (
                                        <div
                                            key={i}
                                            className="w-2 bg-gray-200 dark:bg-gray-700 rounded-full animate-bounce"
                                            style={{ height: h * 10, animationDelay: `${i * 0.1}s` }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
