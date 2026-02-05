"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function FinalCTA() {
    const containerRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        gsap.fromTo(".cta-content > *",
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            }
        );
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="relative overflow-hidden bg-forest-green dark:bg-neutral-900 rounded-[3rem] p-8 sm:p-16 lg:p-24 text-center">
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />

                    <div className="cta-content relative z-10 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-8 border border-white/20">
                            <Sparkles className="w-4 h-4 text-emerald-300" />
                            <span className="text-xs font-bold text-white uppercase tracking-widest">Ready to join us?</span>
                        </div>

                        <h2 className="text-4xl sm:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">
                            Start Your Sustainable <br /> Journey Today.
                        </h2>

                        <p className="text-xl text-white/70 mb-12 leading-relaxed">
                            Join thousands of others who are already making a difference. Get rewarded for your e-waste and help build a greener future.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link
                                href="/dashboard"
                                className="w-full sm:w-auto px-10 py-5 bg-white text-forest-green hover:bg-emerald-50 rounded-2xl font-black text-lg transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                Get Started Free <ArrowRight className="w-6 h-6" />
                            </Link>
                            <button className="w-full sm:w-auto px-10 py-5 border-2 border-white/20 hover:bg-white/10 text-white rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2">
                                Contact Sales
                            </button>
                        </div>

                        {/* Final Reassurances */}
                        <div className="mt-16 flex flex-wrap justify-center gap-8 grayscale opacity-50">
                            <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-white" />
                                <span className="text-sm font-bold text-white">Instant Valuation</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-white" />
                                <span className="text-sm font-bold text-white">Verified Recycling</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
