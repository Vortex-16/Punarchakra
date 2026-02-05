"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Leaf, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import SmartBin3D from "@/components/3d/SmartBin3D";
import { ModeToggle } from "@/components/mode-toggle";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-white dark:bg-[#050505] overflow-x-hidden text-neutral-900 dark:text-white font-sans selection:bg-emerald-500/30 selection:text-emerald-500 transition-colors duration-500">

            {/* Theme Toggle (Absolute) */}
            <div className="absolute top-6 right-6 z-50">
                <ModeToggle />
            </div>

            {/* --- LEFT SIDE: 3D INTERACTIVE (Fixed, 50% width) --- */}
            <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center bg-gray-50 dark:bg-neutral-900 overflow-hidden transition-colors duration-500 h-screen sticky top-0">
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
                            Smart waste management for a sustainable cleaner future.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* --- RIGHT SIDE: Login Form (Fixed, 50% width on Desktop) --- */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 py-12 md:p-8 bg-white dark:bg-[#0a0a0a] relative transition-colors duration-500 min-h-screen">
                <div className="w-full max-w-[440px] space-y-8">

                    {/* Header */}
                    <div className="space-y-2">
                        <div className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 mb-2">
                            <Leaf size={20} />
                        </div>
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight transition-colors duration-300">Login Now</h2>
                        <p className="text-neutral-500 dark:text-neutral-400 transition-colors duration-300">Welcome back! Please enter your details.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors duration-300">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors duration-300">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-[#1a1a1a] text-emerald-500 focus:ring-emerald-500/50 focus:ring-offset-0" />
                                <span>Remember me</span>
                            </label>
                            <Link href="#" className="font-medium text-emerald-600 dark:text-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-3 pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                                className="w-full py-3.5 bg-white dark:bg-white text-gray-700 dark:text-gray-900 font-bold rounded-xl border border-gray-200 dark:border-transparent hover:bg-gray-50 dark:hover:bg-gray-100 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" style={{ fill: "#4285F4" }} />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" style={{ fill: "#34A853" }} />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" style={{ fill: "#FBBC05" }} />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" style={{ fill: "#EA4335" }} />
                                </svg>
                                Sign in with Google
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-neutral-500 dark:text-neutral-500 text-sm transition-colors duration-300">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-emerald-600 dark:text-emerald-500 font-semibold hover:text-emerald-500 dark:hover:text-emerald-400 hover:underline transition-colors">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
