"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, ChevronRight, HelpCircle, Lightbulb, Trophy, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GENERAL_STATS = [
    "E-waste represents 2% of America's trash in landfills, but it equals 70% of overall toxic waste.",
    "20 to 50 million metric tons of e-waste are disposed of worldwide every year.",
    "Only 12.5% of e-waste is currently recycled.",
    "Recycling one million laptops saves the energy equivalent to the electricity used by 3,657 homes in a US year.",
    "Did you know? E-waste is the fastest-growing waste stream globally."
];

const ECO_TIPS = [
    "Battery Tip: Never throw batteries in regular bins! They leak toxic chemicals. Use dedicated collection points.",
    "Security Tip: Always perform a factory reset and remove SIM/SD cards before recycling your old phone.",
    "Hazard Alert: Old CRT monitors contain up to 8 pounds of lead. Professional recycling is mandatory.",
    "Action: Don't hoard! The value of electronics depreciates rapidly. Recycle sooner to recover more value.",
    "Chargers: Don't throw away old cables; they contain copper which is highly recyclable."
];

const QUIZ_QUESTIONS = [
    {
        question: "What should you do before recycling a smartphone?",
        options: ["Wash it with water", "Factory reset & remove SIM", "Freeze it", "Disassemble it yourself"],
        correct: 1 // Index
    },
    {
        question: "Why should batteries NOT go in regular trash?",
        options: ["They are too heavy", "They leak toxic chemicals", "They are valuable", "They don't decompose"],
        correct: 1
    },
    {
        question: "How much lead can an old CRT monitor contain?",
        options: ["None", "1 pound", "Up to 8 pounds", "20 pounds"],
        correct: 2
    }
];

export function FactsQuizCard() {
    const [category, setCategory] = useState<'stats' | 'tips'>('tips');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);
    const [hovered, setHovered] = useState(false);

    // Quiz State
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const activeList = category === 'stats' ? GENERAL_STATS : ECO_TIPS;

    const nextFact = () => {
        setCurrentIndex((prev) => (prev + 1) % activeList.length);
    };

    const handleAnswer = (optionIndex: number) => {
        setSelectedOption(optionIndex);

        setTimeout(() => {
            if (optionIndex === QUIZ_QUESTIONS[currentQuestion].correct) {
                setScore(s => s + 1);
            }

            if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
                setCurrentQuestion(q => q + 1);
                setSelectedOption(null);
            } else {
                setShowResult(true);
            }
        }, 1000);
    };

    const resetQuiz = () => {
        setShowQuiz(false);
        setCurrentQuestion(0);
        setScore(0);
        setShowResult(false);
        setSelectedOption(null);
    };

    // Auto-cycle facts
    useEffect(() => {
        if (showQuiz || hovered) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % activeList.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [showQuiz, hovered, activeList]); // Added activeList dep

    return (
        <>
            <motion.div
                className="relative h-full overflow-hidden rounded-3xl border border-white/20 shadow-xl group cursor-default"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
                {/* Dynamic Background */}
                <div className={`absolute inset-0 transition-colors duration-700 ${category === 'stats'
                    ? 'bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-white dark:from-blue-900/40 dark:via-indigo-900/20 dark:to-black'
                    : 'bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white dark:from-emerald-900/40 dark:via-teal-900/20 dark:to-black'
                    }`} />

                {/* Animated Particles/Glow */}
                <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] opacity-40 transition-colors duration-700 ${category === 'stats' ? 'bg-blue-400 dark:bg-blue-600' : 'bg-emerald-400 dark:bg-emerald-600'
                    }`} />

                {/* Progress Bar */}
                {!showQuiz && !hovered && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gray-100/10 z-20">
                        <motion.div
                            className={`h-full ${category === 'stats' ? "bg-blue-500" : "bg-emerald-500"}`}
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                            key={`${category}-${currentIndex}`}
                        />
                    </div>
                )}

                <div className="relative z-10 p-6 h-full flex flex-col">

                    {/* Header & Toggle */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl shadow-lg border border-white/20 backdrop-blur-md transition-colors duration-500 ${category === 'stats'
                                ? 'bg-blue-500/20 text-blue-600 dark:text-blue-300'
                                : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300'
                                }`}>
                                {category === 'stats' ? <Lightbulb className="w-5 h-5 fill-current" /> : <CheckCircle2 className="w-5 h-5" />}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Did You Know?</h3>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                    {category === 'stats' ? 'Global Insights' : 'Eco Actions'}
                                </p>
                            </div>
                        </div>

                        {/* Premium Toggle Switch */}
                        <div className="flex p-1 bg-gray-200/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-full border border-white/10 relative">
                            <motion.div
                                className={`absolute inset-y-1 shadow-sm rounded-full bg-white dark:bg-neutral-700`}
                                layoutId="activeTab"
                                initial={false}
                                animate={{
                                    x: category === 'stats' ? 4 : "100%",
                                    width: "calc(50% - 6px)"
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                            <button
                                onClick={() => { setCategory('stats'); setCurrentIndex(0); }}
                                className={`relative z-10 px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer ${category === 'stats' ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                                    }`}
                            >
                                Stats
                            </button>
                            <button
                                onClick={() => { setCategory('tips'); setCurrentIndex(0); }}
                                className={`relative z-10 px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer ${category === 'tips' ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                                    }`}
                            >
                                Tips
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 flex flex-col justify-center mb-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${category}-${currentIndex}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                <p className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-100 leading-snug">
                                    "{activeList[currentIndex]}"
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100/50 dark:border-white/5">
                        <button
                            onClick={nextFact}
                            className={`text-sm font-bold flex items-center gap-1 transition-colors cursor-pointer ${category === 'stats' ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700' : 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700'
                                }`}
                        >
                            Next {category === 'stats' ? 'Insight' : 'Tip'} <ChevronRight className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => setShowQuiz(true)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer ${category === 'stats'
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/25'
                                : 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/25'
                                }`}
                        >
                            <HelpCircle className="w-4 h-4" />
                            Take Quiz
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Quiz Modal Re-styled */}
            <AnimatePresence>
                {showQuiz && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative border border-white/10"
                        >
                            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-emerald-500/20 to-transparent pointer-events-none" />

                            <button
                                onClick={resetQuiz}
                                className="absolute top-4 right-4 p-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 rounded-full transition-colors z-20"
                            >
                                <X className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                            </button>

                            {!showResult ? (
                                <div className="p-8 relative z-10">
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider">
                                            Question {currentQuestion + 1} / {QUIZ_QUESTIONS.length}
                                        </div>
                                        <div className="text-sm font-medium text-gray-500">Score: <span className="text-emerald-500 font-bold">{score}</span></div>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 leading-snug">
                                        {QUIZ_QUESTIONS[currentQuestion].question}
                                    </h3>

                                    <div className="space-y-3">
                                        {QUIZ_QUESTIONS[currentQuestion].options.map((option, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleAnswer(idx)}
                                                disabled={selectedOption !== null}
                                                className={`w-full p-4 rounded-xl text-left border transition-all font-medium flex justify-between items-center group
                                                    ${selectedOption === idx
                                                        ? idx === QUIZ_QUESTIONS[currentQuestion].correct
                                                            ? "bg-green-50 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400"
                                                            : "bg-red-50 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400"
                                                        : "bg-gray-50 dark:bg-white/5 border-transparent hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 text-gray-700 dark:text-gray-200"
                                                    }
                                                `}
                                            >
                                                {option}
                                                {selectedOption === idx && (
                                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                        {idx === QUIZ_QUESTIONS[currentQuestion].correct
                                                            ? <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                            : <X className="w-5 h-5 text-red-500" />
                                                        }
                                                    </motion.div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-10 text-center relative z-10">
                                    <motion.div
                                        initial={{ scale: 0.5, rotate: -20 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring" }}
                                        className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-yellow-500/30"
                                    >
                                        <Trophy className="w-12 h-12 text-white fill-white/20" />
                                    </motion.div>

                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Quiz Complete!</h2>
                                    <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
                                        You scored <span className="text-emerald-500 font-bold text-2xl">{score}</span> / {QUIZ_QUESTIONS.length}
                                    </p>

                                    {score === 3 && (
                                        <motion.div
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 p-4 rounded-xl mb-8 font-medium"
                                        >
                                            � Perfect Score! You're an E-Waste Expert!
                                        </motion.div>
                                    )}

                                    <button
                                        onClick={resetQuiz}
                                        className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:shadow-lg hover:-translate-y-1 transition-all"
                                    >
                                        Close Quiz
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
