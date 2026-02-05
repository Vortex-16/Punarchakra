"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, ChevronRight, HelpCircle, Lightbulb, Trophy, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FACTS = [
    "E-waste represents 2% of America's trash in landfills, but it equals 70% of overall toxic waste.",
    "20 to 50 million metric tons of e-waste are disposed of worldwide every year.",
    "Only 12.5% of e-waste is currently recycled.",
    "Recycling one million laptops saves the energy equivalent to the electricity used by 3,657 homes in a US year.",
    "Cell phones contain gold, silver, copper, platinum, and palladium. Recycling them recovers these precious metals."
];

const QUIZ_QUESTIONS = [
    {
        question: "What percentage of e-waste is currently recycled globally?",
        options: ["12.5%", "40%", "65%", "80%"],
        correct: 0 // Index
    },
    {
        question: "Which precious metal is commonly found in smartphones?",
        options: ["Uranium", "Gold", "Mercury", "Lead"],
        correct: 1
    },
    {
        question: "How much of toxic landfill waste comes from e-waste?",
        options: ["5%", "20%", "50%", "70%"],
        correct: 3
    }
];

export function FactsQuizCard() {
    const [currentFact, setCurrentFact] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);
    const [hovered, setHovered] = useState(false);

    // Quiz State
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const nextFact = () => {
        setCurrentFact((prev) => (prev + 1) % FACTS.length);
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
            setCurrentFact((prev) => (prev + 1) % FACTS.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [showQuiz, hovered]);

    return (
        <>
            <div
                className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 h-full flex flex-col items-start relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {/* Progress Bar for Fact Cycle */}
                {!showQuiz && !hovered && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 dark:bg-neutral-800">
                        <motion.div
                            className="h-full bg-emerald-500"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                            key={currentFact} // Reset on fact change
                        />
                    </div>
                )}

                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Lightbulb className="w-24 h-24 text-yellow-500" />
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg text-yellow-600 dark:text-yellow-400">
                        <Lightbulb className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Did You Know?</h3>
                </div>

                <div className="flex-1 mb-6 relative z-10">
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed italic">
                        "{FACTS[currentFact]}"
                    </p>
                    <button
                        onClick={nextFact}
                        className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2 hover:underline"
                    >
                        Next Fact →
                    </button>
                </div>

                <button
                    onClick={() => setShowQuiz(true)}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 relative z-10 cursor-pointer"
                >
                    <HelpCircle className="w-5 h-5" />
                    Take E-Waste Quiz
                </button>
            </div>

            {/* Quiz Modal */}
            <AnimatePresence>
                {showQuiz && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
                        >
                            <button
                                onClick={resetQuiz}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {!showResult ? (
                                <div className="p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-sm font-bold text-emerald-500 uppercase tracking-wider">Question {currentQuestion + 1}/{QUIZ_QUESTIONS.length}</span>
                                        <span className="text-xs text-gray-400">Score: {score}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8">
                                        {QUIZ_QUESTIONS[currentQuestion].question}
                                    </h3>

                                    <div className="space-y-3">
                                        {QUIZ_QUESTIONS[currentQuestion].options.map((option, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleAnswer(idx)}
                                                disabled={selectedOption !== null}
                                                className={`w-full p-4 rounded-xl text-left border-2 transition-all font-medium flex justify-between items-center
                                                    ${selectedOption === idx
                                                        ? idx === QUIZ_QUESTIONS[currentQuestion].correct
                                                            ? "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400"
                                                            : "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400"
                                                        : "bg-gray-50 dark:bg-white/5 border-transparent hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 text-gray-700 dark:text-gray-300"
                                                    }
                                                `}
                                            >
                                                {option}
                                                {selectedOption === idx && (
                                                    idx === QUIZ_QUESTIONS[currentQuestion].correct
                                                        ? <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                        : <X className="w-5 h-5 text-red-500" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-10 text-center">
                                    <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Trophy className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quiz Completed!</h2>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                                        You scored <span className="text-emerald-500 font-bold">{score}</span> out of {QUIZ_QUESTIONS.length}
                                    </p>

                                    {score === 3 && (
                                        <motion.div
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-xl mb-6 text-sm"
                                        >
                                            🎉 Perfect Score! You earned <strong>+50 XP</strong>
                                        </motion.div>
                                    )}

                                    <button
                                        onClick={resetQuiz}
                                        className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                                    >
                                        Close
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
