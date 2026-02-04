"use client";

import { motion } from "framer-motion";
import { Gift, Award, Trophy, Leaf, Zap, ShoppingBag, Star, TrendingUp, Trees, History } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { useEffect, useState } from "react";
import api, { redeemReward } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

// Mock Data for Rewards (Still static as they are products)
const rewards = [
    { id: 1, title: "$10 Amazon Voucher", cost: 1000, icon: ShoppingBag, color: "bg-orange-100 text-orange-600" },
    { id: 2, title: "1 Month Spotify Premium", cost: 1500, icon: Zap, color: "bg-green-100 text-green-600" },
    { id: 3, title: "Eco-Friendly Water Bottle", cost: 2000, icon: Leaf, color: "bg-blue-100 text-blue-600" },
    { id: 4, title: "Tree Planting Donation", cost: 500, icon: Trees, color: "bg-emerald-100 text-emerald-600" },
];

const badges = [
    { id: 1, name: "First Recycler", description: "Recycled your first item", icon: Star, earned: true },
    { id: 2, name: "Battery Saver", description: "Recycled 50 batteries", icon: Zap, earned: true },
    { id: 3, name: "Gold Member", description: "Earned 5000 points", icon: Award, earned: false },
    { id: 4, name: "Top 10", description: "Reached top 10 in leaderboard", icon: Trophy, earned: false },
];

const leaderboard = [
    { rank: 1, name: "Alex Johnson", points: 5200, avatar: "AJ" },
    { rank: 2, name: "Sarah Smith", points: 4850, avatar: "SS" },
    { rank: 3, name: "You", points: 2450, avatar: "ME" }, // Will update this one
    { rank: 4, name: "Mike Brown", points: 2100, avatar: "MB" },
];

export default function RewardsPage() {
    const { user, session } = useSession();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchUserData = async () => {
        if (session?.accessToken) {
            try {
                const data = await api.get('/auth/me', { token: session.accessToken });
                setUserData(data);
            } catch (error) {
                console.error("Failed to fetch user data", error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (session) {
            fetchUserData();
        }
    }, [session]);

    const handleRedeem = async (reward: any) => {
        if (!userData || userData.points < reward.cost) {
            toast({
                title: "Insufficient Points",
                description: "You don't have enough points for this reward.",
                variant: "destructive"
            });
            return;
        }

        try {
            const result = await redeemReward(session?.accessToken!, reward.cost, reward.title);
            setUserData((prev: any) => ({
                ...prev,
                points: result.points,
                history: result.history
            }));
            toast({
                title: "Reward Redeemed!",
                description: `Successfully redeemed ${reward.title}.`
            });
        } catch (error: any) {
            toast({
                title: "Redemption Failed",
                description: error.message || "Could not redeem reward.",
                variant: "destructive"
            });
        }
    };

    // Derived stats
    const points = userData?.points || 0;
    const history = userData?.history || [];
    const level = Math.floor(points / 1000) + 1;
    const nextLevel = level * 1000;
    const itemsRecycled = history.filter((h: any) => !h.itemType.includes('Redeemed')).length;
    // Estimate CO2: 0.5kg per item avg mock
    const co2Saved = (itemsRecycled * 0.5).toFixed(1) + " kg";

    // Update leaderboard "You" entry mock
    const dynamicLeaderboard = leaderboard.map(l => l.name === 'You' ? { ...l, points } : l).sort((a, b) => b.points - a.points);
    // Re-rank
    const rankedLeaderboard = dynamicLeaderboard.map((l, i) => ({ ...l, rank: i + 1 }));

    if (loading && !userData) {
        return <div className="p-8 text-center">Loading rewards data...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rewards & Impact</h1>
                    <p className="text-gray-500 dark:text-gray-400">Track your contribution and redeem earned points.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-forest-green/10 text-forest-green rounded-xl font-bold">
                    <Gift className="w-5 h-5" />
                    <span>{points} Points Available</span>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-forest-green to-emerald-600 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Trophy className="w-6 h-6 text-yellow-300" />
                            </div>
                            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded backdrop-blur-sm">Level {level}</span>
                        </div>
                        <h3 className="text-white/80 text-sm font-medium">Current Status</h3>
                        {/* Dynamic Level Name logic could be added here */}
                        <h2 className="text-2xl font-bold mt-1">Eco Warrior</h2>
                        <div className="mt-4">
                            <div className="flex justify-between text-xs mb-1 opacity-80">
                                <span>Progress</span>
                                <span>{points} / {nextLevel}</span>
                            </div>
                            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white rounded-full"
                                    style={{ width: `${(points / nextLevel) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    {/* Background Pattern */}
                    <Leaf className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 rotate-[-15deg]" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-green-100 dark:border-neutral-800"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-forest-green">
                            <Leaf className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Environmental Impact</h3>
                            <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> Top 5% of users
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-between items-end border-t border-gray-100 dark:border-gray-800 pt-4">
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{co2Saved}</p>
                            <p className="text-xs text-gray-400">CO2 Emissions Saved</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{itemsRecycled}</p>
                            <p className="text-xs text-gray-400">Items Recycled</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-green-100 dark:border-neutral-800"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-forest-green" /> Leaderboard
                        </h3>
                        <button className="text-xs text-forest-green hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {rankedLeaderboard.map((user, i) => (
                            <div key={i} className={`flex items-center justify-between ${user.name === 'You' ? 'bg-forest-green/5 -mx-2 px-2 py-1 rounded-lg border border-forest-green/10' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <span className={`text-sm font-bold w-4 ${i < 3 ? 'text-forest-green' : 'text-gray-400'}`}>#{user.rank}</span>
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                        {user.avatar}
                                    </div>
                                    <span className={`text-sm font-medium ${user.name === 'You' ? 'text-forest-green font-bold' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {user.name}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{user.points}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Main Content Grid - Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                {/* Rewards Store */}
                <div className="lg:col-span-2 space-y-6 flex flex-col">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Gift className="w-5 h-5 text-forest-green" /> Redeem Rewards
                        </h2>
                        <button className="text-xs text-forest-green hover:underline">View All</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                        {rewards.map((reward) => (
                            <div key={reward.id} className="bg-green-50 dark:bg-neutral-900 p-5 rounded-2xl border border-green-100 dark:border-neutral-800 flex flex-col justify-between hover:shadow-md transition-shadow group h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${reward.color}`}>
                                        <reward.icon className="w-6 h-6" />
                                    </div>
                                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300">
                                        {reward.cost} pts
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{reward.title}</h3>
                                    <p className="text-xs text-gray-500 mb-4">Instant digital delivery</p>
                                    <button
                                        onClick={() => handleRedeem(reward)}
                                        disabled={points < reward.cost}
                                        className={`w-full py-2 rounded-xl border font-semibold text-sm transition-colors ${points >= reward.cost ? 'border-forest-green text-forest-green hover:bg-forest-green hover:text-white' : 'border-gray-200 text-gray-400 cursor-not-allowed'}`}
                                    >
                                        {points >= reward.cost ? 'Claim Reward' : 'Insufficient Points'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Achievements */}
                <div className="flex flex-col space-y-6 h-full">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Award className="w-5 h-5 text-forest-green" /> Achievements
                        </h2>
                        <button className="text-xs text-forest-green hover:underline">View All</button>
                    </div>
                    <div className="bg-green-50 dark:bg-neutral-900 p-6 rounded-2xl border border-green-100 dark:border-gray-800 space-y-4 flex-1 h-full">
                        {badges.map((badge) => (
                            <div key={badge.id} className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${badge.earned ? 'bg-forest-green/5' : 'bg-gray-50 dark:bg-gray-800 opacity-60 grayscale'}`}>
                                <div className={`p-3 rounded-full ${badge.earned ? 'bg-forest-green text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    <badge.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{badge.name}</h4>
                                    <p className="text-xs text-gray-500">{badge.description}</p>
                                </div>
                                {badge.earned && <div className="w-2 h-2 rounded-full bg-forest-green"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section - Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                {/* Transaction History */}
                <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 h-full">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                        <button className="text-xs text-forest-green font-semibold">See All</button>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {history.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">No recent activity</div>
                        ) : (
                            history.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-sm py-2 border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-100/50 dark:hover:bg-gray-700/30 px-2 rounded-lg transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{item.itemType}</p>
                                        <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()} • {new Date(item.date).toLocaleTimeString()}</p>
                                    </div>
                                    <span className={`font-bold ${item.pointsEarned > 0 ? 'text-forest-green' : 'text-red-500'}`}>
                                        {item.pointsEarned > 0 ? '+' : ''}{item.pointsEarned} pts
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Eco Tip Card */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-2xl text-white relative overflow-hidden h-full flex flex-col justify-center shadow-lg">
                    <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-2">Did you know?</h3>
                        <p className="text-sm opacity-90 mb-4">Recycling one ton of aluminum saves 14,000 kWh of energy.</p>
                        <button className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg text-xs font-bold transition-colors">
                            Learn More
                        </button>
                    </div>
                    <Zap className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 rotate-12" />
                </div>
            </div>
        </div>
    );
}
