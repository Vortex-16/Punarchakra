"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Add type definition for Web Speech API
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export function VoiceAssistant() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [feedback, setFeedback] = useState("");
    const router = useRouter();
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.lang = 'en-US';
                recognitionRef.current.interimResults = false;

                recognitionRef.current.onresult = (event: any) => {
                    const command = event.results[0][0].transcript.toLowerCase();
                    setTranscript(command);
                    processCommand(command);
                    setIsListening(false);
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                    setIsListening(false);
                    setFeedback("Didn't catch that");
                    setTimeout(() => setFeedback(""), 2000);
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };
            }
        }
    }, [router]);

    const processCommand = (command: string) => {
        console.log("Processing command:", command);

        if (command.includes("dashboard") || command.includes("home")) {
            setFeedback("Navigating to Dashboard...");
            router.push("/dashboard");
        } else if (command.includes("scan") || command.includes("camera")) {
            setFeedback("Opening Scanner...");
            router.push("/scan");
        } else if (command.includes("map") || command.includes("bin") || command.includes("find")) {
            setFeedback("Finding Bins...");
            router.push("/smart-bin");
        } else if (command.includes("reward") || command.includes("point")) {
            setFeedback("Opening Rewards...");
            router.push("/rewards");
        } else {
            setFeedback("Unknown Command");
        }

        setTimeout(() => {
            setFeedback("");
            setTranscript("");
        }, 2000);
    };

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Voice recognition not supported in this browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setFeedback("Listening...");
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-2">
            <AnimatePresence>
                {(transcript || feedback) && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-neutral-900/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-neutral-900 px-4 py-2 rounded-xl text-sm font-medium shadow-lg border border-white/10 mb-2"
                    >
                        {feedback || transcript}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleListening}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isListening
                        ? "bg-red-500 shadow-red-500/50 animate-pulse ring-4 ring-red-500/30"
                        : "bg-forest-green shadow-forest-green/40 hover:shadow-forest-green/60"
                    }`}
            >
                {isListening ? (
                    <div className="flex gap-1 h-4 items-center justify-center">
                        {[1, 2, 3].map(i => (
                            <motion.div
                                key={i}
                                animate={{ height: [8, 16, 8] }}
                                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                className="w-1 bg-white rounded-full"
                            />
                        ))}
                    </div>
                ) : (
                    <Mic className="w-6 h-6 text-white" />
                )}
            </motion.button>
        </div>
    );
}
