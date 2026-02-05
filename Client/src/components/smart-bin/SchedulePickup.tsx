"use client";

import { useState } from "react";
import { Calendar, Truck, CheckCircle, Clock, MapPin, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/hooks/useSession";
import { useToast } from "@/components/ui/use-toast";

type PickupType = "large_appliance" | "it_equipment" | "batteries_bulk" | "other";

export function SchedulePickup({ onClose }: { onClose: () => void }) {
    const { user } = useSession();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [type, setType] = useState<PickupType | null>(null);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [address, setAddress] = useState(user?.email ? "123 Eco Street (Default)" : ""); // Mock address

    const handleSchedule = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setStep(3); // Success
            toast({
                title: "Pickup Scheduled! 🚛",
                description: "Our team will arrive at the scheduled time.",
                variant: "default"
            });
        }, 1500);
    };

    return (
        <div className="absolute inset-x-0 bottom-0 top-20 bg-neutral-900/95 backdrop-blur-md z-40 flex flex-col p-6 animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-black text-[#FFD700] uppercase tracking-tighter flex items-center gap-2">
                        <Truck className="w-6 h-6" /> Schedule Pickup
                    </h2>
                    <p className="text-neutral-400 text-xs font-mono">HEAVY ITEM DISPOSAL SERVICE</p>
                </div>
                <button onClick={onClose} className="text-neutral-500 hover:text-white uppercase text-xs font-bold">Close X</button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-neutral-500 uppercase">1. Select Waste Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: "large_appliance", label: "Large Appliances", icon: Package },
                                    { id: "it_equipment", label: "IT Equipment", icon: MapPin }, // Icon placeholder
                                    { id: "batteries_bulk", label: "Bulk Batteries", icon: () => <div className="w-4 h-4 rounded-full bg-green-500" /> },
                                    { id: "other", label: "Other / Mixed", icon: () => <div className="w-4 h-4 rounded-full bg-gray-500" /> }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setType(item.id as PickupType)}
                                        className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${type === item.id
                                            ? "bg-[#FFD700] text-black border-[#FFD700]"
                                            : "bg-black/40 border-neutral-700 text-neutral-400 hover:border-neutral-500"
                                            }`}
                                    >
                                        <span className="text-sm font-bold">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-bold text-neutral-500 uppercase">2. Pickup Details</label>
                            <input
                                type="text"
                                placeholder="Pickup Address"
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                className="w-full bg-black/40 border border-neutral-700 rounded-lg p-3 text-white placeholder:text-neutral-600 focus:border-[#FFD700] outline-none"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="date"
                                    className="bg-black/40 border border-neutral-700 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none"
                                    onChange={e => setDate(e.target.value)}
                                />
                                <select
                                    className="bg-black/40 border border-neutral-700 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none"
                                    onChange={e => setTime(e.target.value)}
                                >
                                    <option value="">Select Time</option>
                                    <option value="09:00">09:00 AM - 12:00 PM</option>
                                    <option value="12:00">12:00 PM - 03:00 PM</option>
                                    <option value="15:00">03:00 PM - 06:00 PM</option>
                                </select>
                            </div>
                        </div>

                        <button
                            disabled={!type || !date || !time}
                            onClick={() => setStep(2)}
                            className="w-full py-4 bg-[#FFD700] text-black font-black uppercase tracking-wider rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next Step
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 text-center pt-8">
                        <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto border-2 border-[#FFD700]">
                            <Truck className="w-10 h-10 text-[#FFD700]" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">Confirm Pickup?</h3>
                            <p className="text-neutral-400">We will collect your items from:</p>
                            <p className="text-[#FFD700] font-mono mt-1">{address}</p>
                            <p className="text-neutral-500 text-sm mt-4">Scheduled for: {date} @ {time}</p>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setStep(1)} className="flex-1 py-3 bg-neutral-800 text-white font-bold rounded-xl hover:bg-neutral-700">Back</button>
                            <button
                                onClick={handleSchedule}
                                disabled={loading}
                                className="flex-1 py-3 bg-[#FFD700] text-black font-bold rounded-xl hover:bg-yellow-300 flex items-center justify-center gap-2"
                            >
                                {loading ? "Booking..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="text-center pt-12 space-y-6">
                        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
                            <p className="text-neutral-400">Your Request ID: #TRK-{Math.floor(Math.random() * 10000)}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-white text-black font-bold uppercase tracking-wider rounded-xl hover:bg-gray-200"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
