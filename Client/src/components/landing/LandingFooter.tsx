"use client";
import React from "react";
import Link from "next/link";
import { Twitter, Instagram, Linkedin, Github, Globe, Mail, MapPin, Phone } from "lucide-react";

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
        <footer className="bg-white dark:bg-neutral-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 border-t border-gray-100 dark:border-neutral-900">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
                    {/* Brand Column */}
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-8 group">
                            <div className="w-10 h-10 bg-forest-green rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                                <span className="text-white font-black text-xl">P</span>
                            </div>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Punarchakra
                            </span>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm leading-relaxed">
                            Empowering communities to build a circular economy through AI-driven e-waste recycling solutions.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-neutral-900 flex items-center justify-center text-gray-400 hover:text-forest-green hover:bg-forest-green/10 transition-all"
                                >
                                    <Icon className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6">Product</h4>
                        <ul className="space-y-4">
                            {footerLinks.product.map((link, i) => (
                                <li key={i}>
                                    <Link href={link.href} className="text-gray-500 dark:text-gray-400 hover:text-forest-green transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6">Company</h4>
                        <ul className="space-y-4">
                            {footerLinks.company.map((link, i) => (
                                <li key={i}>
                                    <Link href={link.href} className="text-gray-500 dark:text-gray-400 hover:text-forest-green transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6">Legal</h4>
                        <ul className="space-y-4">
                            {footerLinks.legal.map((link, i) => (
                                <li key={i}>
                                    <Link href={link.href} className="text-gray-500 dark:text-gray-400 hover:text-forest-green transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6">Support</h4>
                        <ul className="space-y-4">
                            {footerLinks.support.map((link, i) => (
                                <li key={i}>
                                    <Link href={link.href} className="text-gray-500 dark:text-gray-400 hover:text-forest-green transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-gray-100 dark:border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-gray-400">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" /> srinjoyee@eco-bin.com
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Global Headquarters
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" /> +1 (555) 000-0000
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 font-medium">
                        © {currentYear} Punarchakra. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
