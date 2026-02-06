"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, Leaf, ArrowRight, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "@/components/mode-toggle";
import AuthNotification from "@/components/auth/AuthNotification";
import PasswordStrengthIndicator from "@/components/auth/PasswordStrengthIndicator";
import { validatePasswordStrength, checkPasswordMatch } from "@/lib/auth/validation";
import { resetPassword } from "@/lib/auth/authApi";

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [success, setSuccess] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
    
    const [notification, setNotification] = useState<{
        type: 'success' | 'error' | 'info';
        message: string;
        isVisible: boolean;
    }>({ type: 'info', message: '', isVisible: false });

    // Validate token on mount
    useEffect(() => {
        const validateToken = async () => {
            // For now, we'll just check if token exists
            // In production, you'd verify with the backend
            if (resolvedParams.token && resolvedParams.token.length > 10) {
                setTokenValid(true);
            } else {
                setTokenValid(false);
            }
            setIsValidating(false);
        };

        validateToken();
    }, [resolvedParams.token]);

    // Real-time password match validation
    useEffect(() => {
        if (confirmPassword.length > 0) {
            setPasswordMatch(checkPasswordMatch(password, confirmPassword));
        } else {
            setPasswordMatch(null);
        }
    }, [password, confirmPassword]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const passwordValidation = validatePasswordStrength(password);
        if (!passwordValidation.isValid) {
            setNotification({
                type: 'error',
                message: "Password does not meet strength requirements",
                isVisible: true,
            });
            return;
        }

        if (!checkPasswordMatch(password, confirmPassword)) {
            setNotification({
                type: 'error',
                message: "Passwords do not match",
                isVisible: true,
            });
            return;
        }

        setIsLoading(true);

        try {
            const result = await resetPassword(resolvedParams.token, password);
            
            if (result.success) {
                setSuccess(true);
                setNotification({
                    type: 'success',
                    message: "Password reset successfully! Redirecting to login...",
                    isVisible: true,
                });
                
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                setNotification({
                    type: 'error',
                    message: result.error || result.message || "Failed to reset password. The link may have expired.",
                    isVisible: true,
                });
            }
        } catch (error) {
            setNotification({
                type: 'error',
                message: "An unexpected error occurred. Please try again.",
                isVisible: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Loading state while validating token
    if (isValidating) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center p-4 transition-colors duration-500">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mx-auto mb-4" />
                    <p className="text-neutral-600 dark:text-neutral-400">Validating reset link...</p>
                </div>
            </div>
        );
    }

    // Invalid token state
    if (!tokenValid) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center p-4 transition-colors duration-500">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-neutral-800 text-center max-w-md w-full"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-950/50 rounded-full mb-6">
                        <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-3">Invalid or Expired Link</h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                        This password reset link is invalid or has expired. Please request a new one.
                    </p>
                    <Link
                        href="/forgot-password"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg transition-all"
                    >
                        Request New Link
                        <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </div>
        );
    }

    // Success state
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
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-3">Password Reset!</h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                        Your password has been successfully reset.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Redirecting to login...</span>
                    </div>
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
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Reset Password</h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Choose a strong password for your account.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-neutral-800 transition-colors duration-500">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm"
                                    placeholder="Enter new password"
                                    required
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            
                            {/* Password Strength Indicator */}
                            <PasswordStrengthIndicator password={password} show={password.length > 0} />
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border ${
                                        passwordMatch === false
                                            ? 'border-red-500 focus:ring-red-500/50'
                                            : passwordMatch === true
                                            ? 'border-emerald-500 focus:ring-emerald-500/50'
                                            : 'border-gray-200 dark:border-neutral-800 focus:ring-emerald-500/50'
                                    } rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:border-emerald-500 transition-all shadow-sm`}
                                    placeholder="Confirm new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {passwordMatch === false && confirmPassword.length > 0 && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs text-red-600 dark:text-red-400"
                                >
                                    Passwords do not match
                                </motion.p>
                            )}
                            {passwordMatch === true && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs text-emerald-600 dark:text-emerald-400"
                                >
                                    Passwords match ✓
                                </motion.p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Reset Password
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Back to Login */}
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
