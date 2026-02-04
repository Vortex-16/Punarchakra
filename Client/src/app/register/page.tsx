"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Loader2, Leaf, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

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
            <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 text-center max-w-md w-full">
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
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl shadow-lg mb-4">
                        <Leaf className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-emerald-200">Join the green revolution</p>
                </div>

                {/* Register Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-emerald-100">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-300" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-emerald-100">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-300" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-emerald-100">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-300" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                                    placeholder="Create a password"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-500/20 border border-red-400/30 rounded-xl text-red-200 text-sm text-center">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center">
                        <div className="flex-1 border-t border-white/20"></div>
                        <span className="px-4 text-emerald-200 text-sm">or</span>
                        <div className="flex-1 border-t border-white/20"></div>
                    </div>

                    {/* Login Link */}
                    <p className="text-center text-emerald-200">
                        Already have an account?{" "}
                        <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>

                {/* Footer */}
                <p className="text-center text-emerald-300/50 text-sm mt-6">
                    Powered by Punarchakra • Smart E-Waste Recycling
                </p>
            </div>
        </div>
    );
}
