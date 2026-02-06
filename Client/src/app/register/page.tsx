"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Loader2, Leaf, ArrowRight, CheckCircle2, Eye, EyeOff, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SmartBin3D from "@/components/3d/SmartBin3D";
import { ModeToggle } from "@/components/mode-toggle";
import PasswordStrengthIndicator from "@/components/auth/PasswordStrengthIndicator";
import AuthNotification from "@/components/auth/AuthNotification";
import { validateEmail, validatePasswordStrength, checkPasswordMatch, validateName } from "@/lib/auth/validation";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    // Validation states
    const [emailValid, setEmailValid] = useState<boolean | null>(null);
    const [nameValid, setNameValid] = useState<boolean | null>(null);
    const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
    
    // Notification state
    const [notification, setNotification] = useState<{
        type: 'success' | 'error' | 'info';
        message: string;
        isVisible: boolean;
    }>({ type: 'info', message: '', isVisible: false });

    // Real-time email validation
    useEffect(() => {
        if (email.length > 0) {
            setEmailValid(validateEmail(email));
        } else {
            setEmailValid(null);
        }
    }, [email]);

    // Real-time name validation
    useEffect(() => {
        if (name.length > 0) {
            setNameValid(validateName(name));
        } else {
            setNameValid(null);
        }
    }, [name]);

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
        setIsLoading(true);
        setError("");

        // Validate all fields
        if (!validateName(name)) {
            setError("Please enter a valid name (at least 2 characters)");
            setIsLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }

        const passwordValidation = validatePasswordStrength(password);
        if (!passwordValidation.isValid) {
            setError("Password does not meet strength requirements");
            setIsLoading(false);
            return;
        }

        if (!checkPasswordMatch(password, confirmPassword)) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

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
                setNotification({
                    type: 'success',
                    message: 'Account created successfully! Redirecting...',
                    isVisible: true,
                });
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                setError(data.message || "Registration failed");
                setNotification({
                    type: 'error',
                    message: data.message || "Registration failed",
                    isVisible: true,
                });
            }
        } catch (err) {
            setError("An unexpected error occurred");
            setNotification({
                type: 'error',
                message: "An unexpected error occurred. Please try again.",
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
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-3">Account Created!</h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">Welcome to the green revolution.</p>
                    <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Redirecting to login...</span>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex bg-white dark:bg-[#050505] overflow-hidden text-neutral-900 dark:text-white font-sans selection:bg-emerald-500/30 selection:text-emerald-500 transition-colors duration-500">
            
            {/* Notification */}
            <AuthNotification
                type={notification.type}
                message={notification.message}
                isVisible={notification.isVisible}
                onClose={() => setNotification({ ...notification, isVisible: false })}
            />

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
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 backdrop-blur-md border border-emerald-500/20 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 mb-6">
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
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-[#0a0a0a] relative transition-colors duration-500 overflow-y-auto">
                <div className="w-full max-w-[440px] space-y-6 my-8">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                    >
                        <div className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 mb-2">
                            <Leaf size={20} />
                        </div>
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight transition-colors duration-300 flex items-center gap-2">
                            Create Account
                            <Sparkles className="w-6 h-6 text-emerald-500" />
                        </h2>
                        <p className="text-neutral-500 dark:text-neutral-400 transition-colors duration-300">Start your sustainable journey today.</p>
                    </motion.div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors duration-300">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border ${
                                        nameValid === false
                                            ? 'border-red-500 focus:ring-red-500/50'
                                            : nameValid === true
                                            ? 'border-emerald-500 focus:ring-emerald-500/50'
                                            : 'border-gray-200 dark:border-neutral-800 focus:ring-emerald-500/50'
                                    } rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:border-emerald-500 transition-all shadow-sm`}
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
                                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border ${
                                        emailValid === false
                                            ? 'border-red-500 focus:ring-red-500/50'
                                            : emailValid === true
                                            ? 'border-emerald-500 focus:ring-emerald-500/50'
                                            : 'border-gray-200 dark:border-neutral-800 focus:ring-emerald-500/50'
                                    } rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:border-emerald-500 transition-all shadow-sm`}
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
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm"
                                    placeholder="Create a strong password"
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
                            
                            {/* Password Strength Indicator */}
                            <PasswordStrengthIndicator password={password} show={password.length > 0} />
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors duration-300">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-[#1a1a1a] border ${
                                        passwordMatch === false
                                            ? 'border-red-500 focus:ring-red-500/50'
                                            : passwordMatch === true
                                            ? 'border-emerald-500 focus:ring-emerald-500/50'
                                            : 'border-gray-200 dark:border-neutral-800 focus:ring-emerald-500/50'
                                    } rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:border-emerald-500 transition-all shadow-sm`}
                                    placeholder="Confirm your password"
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

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-3 bg-red-100 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-200 text-sm text-center font-medium"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
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
