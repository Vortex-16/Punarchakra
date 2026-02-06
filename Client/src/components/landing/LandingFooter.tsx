"use client";
import React from "react";
import Link from "next/link";
import { Twitter, Instagram, Linkedin, Github, Globe, Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";

export default function LandingFooter() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { label: "Smart Bins", href: "#" },
            { label: "AI Scanner", href: "#" },
            { label: "Rewards", href: "#" },
            { label: "Impact Tracker", href: "#" },
        ],
        company: [
            { label: "About Us", href: "#" },
            { label: "Careers", href: "#" },
            { label: "Sustainability", href: "#" },
            { label: "Press", href: "#" },
        ],
        support: [
            { label: "Help Center", href: "#" },
            { label: "API Docs", href: "#" },
            { label: "Security", href: "#" },
            { label: "Contact", href: "#" },
        ],
        legal: [
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" },
            { label: "Cookie Policy", href: "#" },
        ]
    };

    return (
        <footer className="relative bg-white dark:bg-[#080808] pt-32 pb-12 overflow-hidden border-t border-gray-100 dark:border-white/5">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-forest-green/50 to-transparent opacity-50" />
            <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-forest-green/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-16 mb-24">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-4 lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-8 group w-fit">
                            <div className="w-12 h-12 bg-forest-green rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-forest-green/20">
                                <span className="text-white font-black text-2xl">P</span>
                            </div>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-forest-green transition-colors">
                                Punarchakra
                            </span>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm leading-relaxed text-lg font-medium">
                            Empowering communities to build a circular economy through AI-driven e-waste recycling solutions.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { Icon: Twitter, href: "#" },
                                { Icon: Instagram, href: "#" },
                                { Icon: Linkedin, href: "https://www.linkedin.com/company/alpha4coders" },
                                { Icon: Github, href: "https://github.com/Vortex-16/Punarchakra" }
                            ].map(({ Icon, href }, i) => (
                                <Link
                                    key={i}
                                    href={href}
                                    target={href !== "#" ? "_blank" : undefined}
                                    rel={href !== "#" ? "noopener noreferrer" : undefined}
                                    className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-forest-green transition-all duration-300 group"
                                >
                                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-start-4">
                        <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-8">Product</h4>
                        <ul className="space-y-5">
                            {footerLinks.product.map((link, i) => (
                                <li key={i}>
                                    <Link href={link.href} className="text-gray-500 dark:text-gray-400 hover:text-forest-green dark:hover:text-emerald-400 transition-colors flex items-center gap-1 group">
                                        {link.label}
                                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-8">Company</h4>
                        <ul className="space-y-5">
                            {footerLinks.company.map((link, i) => (
                                <li key={i}>
                                    <Link href={link.href} className="text-gray-500 dark:text-gray-400 hover:text-forest-green dark:hover:text-emerald-400 transition-colors flex items-center gap-1 group">
                                        {link.label}
                                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-8">Usage</h4>
                        <ul className="space-y-5">
                            {footerLinks.support.map((link, i) => (
                                <li key={i}>
                                    <Link href={link.href} className="text-gray-500 dark:text-gray-400 hover:text-forest-green dark:hover:text-emerald-400 transition-colors" >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5">
                            <Mail className="w-4 h-4 text-forest-green" /> contact@punarchakra.com
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5">
                            <MapPin className="w-4 h-4 text-forest-green" /> Global HQ, India
                        </div>
                    </div>

                    <div className="text-center md:text-right">
                        <p className="text-sm text-gray-400 font-medium mb-2">
                            © {currentYear} Punarchakra.
                        </p>
                        <div className="text-xs text-gray-500 flex gap-4 justify-center md:justify-end">
                            <Link href="#" className="hover:text-forest-green">Privacy</Link>
                            <Link href="#" className="hover:text-forest-green">Terms</Link>
                            <Link href="#" className="hover:text-forest-green">Sitemap</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
