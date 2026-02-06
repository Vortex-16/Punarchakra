"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Loader2, Leaf, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "@/components/mode-toggle";
import AuthNotification from "@/components/auth/AuthNotification";
import { validateEmail } from "@/lib/auth/validation";
import { requestPasswordReset } from "@/lib/auth/authApi";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [notification, setNotification] = useState<{
        type: 'success' | 'error' | 'info';
        message: string;
        isVisible: boolean;
    }>({ type: 'info', message: '', isVisible: false });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateEmail(email)) {
            setNotification({
                type: 'error',
                message: "Please enter a valid email address",
                isVisible: true,
            });
            return;
        }

        setIsLoading(true);

        try {
            const result = await requestPasswordReset(email);
            
            if (result.success) {
                setSuccess(true);
                setNotification({
                    type: 'success',
                    message: "Password reset link sent to your email!",
                    isVisible: true,
                });
            } else {
                setNotification({
                    type: 'error',
                    message: result.error || result.message || "Failed to send reset email. Please try again.",
                    isVisible: true,
                });
            }
        } catch (error) {
            setNotification({
                type: 'error',
                message: "An unexpected error occurred. Please try again later.",
                isVisible: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center p-4 transition-colors duration-500">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-neutral-800 text-center max-w-md w-full"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mb-6 shadow-lg shadow-emerald-500/30"
                    >
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-3">Check Your Email</h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                        We've sent a password reset link to <span className="font-semibold text-emerald-600 dark:text-emerald-400">{email}</span>
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-6">
                        The link will expire in 1 hour. If you don't see the email, check your spam folder.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors font-medium"
                    >
                        <ArrowLeft size={18} />
                        Back to Login
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center p-4 transition-colors duration-500">
            
            {/* Notification */}
            <AuthNotification
                type={notification.type}
                message={notification.message}
                isVisible={notification.isVisible}
                onClose={() => setNotification({ ...notification, isVisible: false })}
            />

            {/* Theme Toggle */}
            <div className="absolute top-6 right-6 z-50">
                <ModeToggle />
            </div>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mb-4">
                        <Leaf size={28} />
                    </div>
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Forgot Password?</h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        No worries! Enter your email and we'll send you a reset link.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-neutral-800 transition-colors duration-500">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm"
                                    placeholder="Enter your email"
                                    required
                                    autoComplete="email"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Send Reset Link
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        {/* Back to Login */}
                        <Link
                            href="/login"
                            className="flex items-center justify-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to Login
                        </Link>
                    </form>
                </div>

                {/* Help Text */}
                <p className="text-center text-sm text-neutral-500 dark:text-neutral-500 mt-6">
                    Remember your password?{" "}
                    <Link href="/login" className="text-emerald-600 dark:text-emerald-500 font-semibold hover:underline">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
