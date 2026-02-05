"use client";

import React from 'react';
import { Mic, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoice } from '@/contexts/VoiceContext';

export function VoiceAssistant() {
    const { isListening, transcript, feedback, startListening, stopListening } = useVoice();

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    return (
        <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-[100] flex flex-col items-end pointer-events-none">
            {/* Transcript / Feedback Overlay */}
            <AnimatePresence>
                {(transcript || feedback) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-auto mb-4 mr-2 max-w-[280px]"
                    >
                        <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/20 shadow-2xl p-4">
                            {/* Animated Gradient Border Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-xy pointer-events-none" />

                            <p className="relative z-10 text-sm font-medium text-gray-800 dark:text-gray-100 leading-relaxed">
                                {feedback || `"${transcript}"`}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Premium Orb Button */}
            <div className="pointer-events-auto relative">
                {/* Pulse Rings */}
                <AnimatePresence>
                    {isListening && (
                        <>
                            <motion.div
                                initial={{ opacity: 0, scale: 1 }}
                                animate={{ opacity: 0.4, scale: 2 }}
                                exit={{ opacity: 0, scale: 1 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                                className="absolute inset-0 rounded-full bg-blue-500/30 blur-md z-0"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 1 }}
                                animate={{ opacity: 0.2, scale: 1.5 }}
                                exit={{ opacity: 0, scale: 1 }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                className="absolute inset-0 rounded-full bg-purple-500/30 blur-md z-0"
                            />
                        </>
                    )}
                </AnimatePresence>

                {/* Main Orb */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleListening}
                    className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-shadow duration-300"
                >
                    {/* Orb Background with Gradient for idle/active states */}
                    <div
                        className={`absolute inset-0 rounded-full transition-all duration-500 ${isListening
                                ? "bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-pulse-slow"
                                : "bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10"
                            }`}
                    />

                    {/* Inner Glass Reflection */}
                    <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

                    {/* Icon */}
                    <div className="relative z-20">
                        {isListening ? (
                            <div className="flex gap-1 h-6 items-center justify-center">
                                {[1, 2, 3, 4].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [6, 18, 6] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 0.6,
                                            ease: "easeInOut",
                                            delay: i * 0.1
                                        }}
                                        className="w-1 bg-white/90 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                    />
                                ))}
                            </div>
                        ) : (
                            <Mic className="w-7 h-7 text-white/90 drop-shadow-md" strokeWidth={2} />
                        )}
                    </div>
                </motion.button>
            </div>
        </div>
    );
}
