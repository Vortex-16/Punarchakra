"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback(
        (type: ToastType, title: string, message?: string, duration: number = 4000) => {
            const id = Math.random().toString(36).substring(7);
            const newToast: Toast = { id, type, title, message, duration };

            setToasts((prev) => [...prev, newToast]);

            setTimeout(() => {
                setToasts((prev) => prev.filter((toast) => toast.id !== id));
            }, duration);
        },
        []
    );

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const getIcon = (type: ToastType) => {
        switch (type) {
            case "success":
                return <CheckCircle2 className="w-5 h-5" />;
            case "error":
                return <AlertCircle className="w-5 h-5" />;
            case "warning":
                return <AlertTriangle className="w-5 h-5" />;
            case "info":
                return <Info className="w-5 h-5" />;
        }
    };

    const getStyles = (type: ToastType) => {
        switch (type) {
            case "success":
                return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200";
            case "error":
                return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200";
            case "warning":
                return "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200";
            case "info":
                return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200";
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.95 }}
                            className={`flex items-start gap-3 p-4 rounded-xl border-2 shadow-lg backdrop-blur-sm ${getStyles(toast.type)}`}
                        >
                            <div className="flex-shrink-0 mt-0.5">{getIcon(toast.type)}</div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm">{toast.title}</p>
                                {toast.message && (
                                    <p className="text-xs mt-0.5 opacity-90">{toast.message}</p>
                                )}
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
