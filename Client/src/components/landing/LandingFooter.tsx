"use client";
import React from "react";

import Link from "next/link";
import { Recycle, Mail, Twitter, Linkedin, Github } from "lucide-react";

const footerLinks = {
    product: [
        { label: "Features", href: "#features" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Impact", href: "#impact" },
        { label: "Find a Bin", href: "/map" },
    ],
    company: [
        { label: "About Us", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#" },
    ],
    legal: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
    ],
};

const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Mail, href: "#", label: "Email" },
];

export default function LandingFooter() {
    const scrollToSection = (href: string) => {
        if (href.startsWith("#")) {
            const element = document.getElementById(href.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <footer className="bg-white dark:bg-neutral-950 border-t border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Top Section */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-forest-green rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                P
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                Punarchakra
                            </span>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm leading-relaxed text-sm">
                            Smart e-waste recycling made simple. Turn your old electronics into rewards and environmental impact.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-10 h-10 bg-gray-100 dark:bg-neutral-900 hover:bg-forest-green dark:hover:bg-forest-green rounded-lg flex items-center justify-center transition-all group"
                                >
                                    <social.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6">
                            Product
                        </h3>
                        <ul className="space-y-4">
                            {footerLinks.product.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-500 dark:text-gray-400 hover:text-forest-green dark:hover:text-green-400 transition-colors text-sm font-medium"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6">
                            Company
                        </h3>
                        <ul className="space-y-4">
                            {footerLinks.company.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-500 dark:text-gray-400 hover:text-forest-green dark:hover:text-green-400 transition-colors text-sm font-medium"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6">
                            Legal
                        </h3>
                        <ul className="space-y-4">
                            {footerLinks.legal.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-500 dark:text-gray-400 hover:text-forest-green dark:hover:text-green-400 transition-colors text-sm font-medium"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        © {new Date().getFullYear()} Punarchakra. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                        <Recycle className="w-4 h-4 text-forest-green" />
                        <span>Built with sustainability in mind</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
