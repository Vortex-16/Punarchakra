"use client";

import { useState } from "react";
import { Trophy, Users, Timer, ArrowRight, Target, Sparkles, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const CHALLENGES = [
    {
        id: 1,
        title: "Zero Waste Week",
        description: "Recycle 5 items this week to win a badge!",
        participants: 1240,
        daysLeft: 3,
        target: 5,
        current: 2, // Demo user progress
        color: "from-emerald-500 to-green-600",
        icon: Target
    },
    {
        id: 2,
        title: "Neighborhood Cleanup",
        description: "Community drive to collect 1000kg of e-waste.",
        participants: 856,
        daysLeft: 12,
        target: 1000,
        current: 650, // Community progress
        type: "community", // distinct from personal
        color: "from-blue-500 to-indigo-600",
        icon: Users
    }
];

export function CommunityChallenges() {
    return (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-white/10 h-[400px] flex flex-col relative group">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-white dark:from-orange-900/20 dark:via-red-900/10 dark:to-black transition-colors duration-500" />

            {/* Header */}
            <div className="relative z-10 p-6 pb-2">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2.5 rounded-xl text-orange-600 dark:text-orange-300 shadow-sm backdrop-blur-sm border border-white/20">
                        <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">Community Challenges</h3>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                            Compete & Contribute
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex-1 p-6 pt-2 space-y-4 overflow-y-auto custom-scrollbar">
                {CHALLENGES.map((challenge, i) => {
                    const progress = (challenge.current / challenge.target) * 100;

                    return (
                        <motion.div
                            key={challenge.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group/card relative overflow-hidden rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-orange-500/30 transition-colors"
                        >
                            <div className="p-4 relative z-10">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-3">
                                        <div className={`p-2 rounded-lg bg-gradient-to-br ${challenge.color} text-white shadow-lg`}>
                                            <challenge.icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{challenge.title}</h4>
                                            <div className="flex items-center gap-3 text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                                                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {challenge.participants} Joined</span>
                                                <span className="flex items-center gap-1"><Timer className="w-3 h-3" /> {challenge.daysLeft}d left</span>
                                            </div>
                                        </div>
                                    </div>
                                    {challenge.type !== 'community' && (
                                        <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                                            Active
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                                    {challenge.description}
                                </p>

                                {/* Progress Bar */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                        <span>Progress</span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className={`h-full bg-gradient-to-r ${challenge.color}`}
                                        />
                                    </div>
                                    <div className="text-right text-[10px] text-gray-400">
                                        {challenge.current} / {challenge.target} {challenge.type === 'community' ? 'kg' : 'items'}
                                    </div>
                                </div>

                                <button className="mt-3 w-full py-2 text-xs font-bold uppercase tracking-wider bg-white dark:bg-black/20 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg transition-colors flex items-center justify-center gap-2 group-hover/card:bg-orange-500 group-hover/card:text-white group-hover/card:border-orange-500">
                                    View Details <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </motion.div>
                    )
                })}

                {/* Local Leaderboard Snippet */}
                <div className="pt-2">
                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Top Neighbors
                    </h4>
                    <div className="flex items-center justify-between gap-2">
                        {[1, 2, 3].map((rank) => (
                            <div key={rank} className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${rank === 1 ? 'border-yellow-400 bg-yellow-400/10 text-yellow-600' :
                                    rank === 2 ? 'border-gray-300 bg-gray-300/10 text-gray-500' :
                                        'border-orange-300 bg-orange-300/10 text-orange-600'
                                    }`}>
                                    #{rank}
                                </div>
                                <span className="text-[10px] text-gray-500 mt-1">User{rank}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
