"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Loader2, Leaf, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import SmartBin3D from "@/components/3d/SmartBin3D";
import { ModeToggle } from "@/components/mode-toggle";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
                <div className="bg-neutral-800 rounded-3xl p-8 shadow-2xl border border-neutral-700 text-center max-w-md w-full">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full mb-4">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
                    <p className="text-emerald-200">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex bg-white dark:bg-[#050505] overflow-hidden text-neutral-900 dark:text-white font-sans selection:bg-emerald-500/30 selection:text-emerald-500 transition-colors duration-500">

            {/* Theme Toggle (Absolute) */}
            <div className="absolute top-6 right-6 z-50">
                <ModeToggle />
            </div>

            {/* --- LEFT SIDE: 3D INTERACTIVE (Fixed, 50% width) --- */}
            <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center bg-gray-50 dark:bg-neutral-900 overflow-hidden transition-colors duration-500">
                {/* 3D Canvas Container */}
                <div className="absolute inset-0 z-0">
                    <SmartBin3D />

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent pointer-events-none dark:from-black/90" />
                </div>

                {/* Floating Brand Text */}
                <div className="relative z-10 mt-auto mb-20 text-center px-8 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 backdrop-blur-md border border-emerald-500/20 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 mb-6 box-shadow-glow">
                            <Leaf size={32} />
                        </div>
                        <h1 className="text-5xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight drop-shadow-sm dark:drop-shadow-lg transition-colors duration-300">
                            Punarchakra
                        </h1>
                        <p className="text-lg text-neutral-600 dark:text-white/80 max-w-md mx-auto leading-relaxed font-light transition-colors duration-300">
                            Join the green revolution.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* --- RIGHT SIDE: Register Form (Fixed, 50% width) --- */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-[#0a0a0a] relative transition-colors duration-500">
                <div className="w-full max-w-[440px] space-y-8">

                    {/* Header */}
                    <div className="space-y-2">
                        <div className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 mb-2">
                            <Leaf size={20} />
                        </div>
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight transition-colors duration-300">Create Account</h2>
                        <p className="text-neutral-500 dark:text-neutral-400 transition-colors duration-300">Start your sustainable journey today.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors duration-300">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors duration-300">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors duration-300">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm"
                                    placeholder="Create a password"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-100 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-200 text-sm text-center font-medium">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-neutral-500 dark:text-neutral-500 text-sm transition-colors duration-300">
                        Already have an account?{" "}
                        <Link href="/login" className="text-emerald-600 dark:text-emerald-500 font-semibold hover:text-emerald-500 dark:hover:text-emerald-400 hover:underline transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
