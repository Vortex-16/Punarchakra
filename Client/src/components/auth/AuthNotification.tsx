import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info';

interface AuthNotificationProps {
    type: NotificationType;
    message: string;
    isVisible: boolean;
    onClose: () => void;
    autoClose?: boolean;
    duration?: number;
}

export default function AuthNotification({
    type,
    message,
    isVisible,
    onClose,
    autoClose = true,
    duration = 5000,
}: AuthNotificationProps) {
    useEffect(() => {
        if (isVisible && autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, autoClose, duration, onClose]);

    const config = {
        success: {
            icon: CheckCircle2,
            bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
            borderColor: 'border-emerald-200 dark:border-emerald-800',
            textColor: 'text-emerald-800 dark:text-emerald-200',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
        },
        error: {
            icon: XCircle,
            bgColor: 'bg-red-50 dark:bg-red-950/50',
            borderColor: 'border-red-200 dark:border-red-800',
            textColor: 'text-red-800 dark:text-red-200',
            iconColor: 'text-red-600 dark:text-red-400',
        },
        info: {
            icon: AlertCircle,
            bgColor: 'bg-blue-50 dark:bg-blue-950/50',
            borderColor: 'border-blue-200 dark:border-blue-800',
            textColor: 'text-blue-800 dark:text-blue-200',
            iconColor: 'text-blue-600 dark:text-blue-400',
        },
    };

    const currentConfig = config[type];
    const Icon = currentConfig.icon;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] max-w-md w-full px-4"
                >
                    <div
                        className={`
                            ${currentConfig.bgColor} 
                            ${currentConfig.borderColor} 
                            border rounded-xl shadow-lg 
                            backdrop-blur-sm p-4 flex items-start gap-3
                        `}
                    >
                        <Icon className={`flex-shrink-0 w-5 h-5 mt-0.5 ${currentConfig.iconColor}`} />
                        <p className={`flex-1 text-sm font-medium ${currentConfig.textColor}`}>
                            {message}
                        </p>
                        <button
                            onClick={onClose}
                            className={`flex-shrink-0 ${currentConfig.iconColor} hover:opacity-70 transition-opacity`}
                        >
                            <X size={18} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
