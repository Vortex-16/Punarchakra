"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    Battery,
    Zap,
    Smartphone,
    Cable,
    AlertTriangle,
    Wine,
    Thermometer,
    Wind,
    Radio,
    LayoutDashboard,
    Clock,
    Languages,
    Search,
    Activity,
    Droplets,
    ShieldCheck,
    QrCode,
    SmartphoneIcon as Scan,
    Lock,
    AlertCircle
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "../../../components/ui/use-toast";

const ITEMS = [
    {
        id: 1, type: "Lithium Battery", icon: Battery, points: 75, impact: "2.4kg CO2", status: "valid",
        breakdown: [{ name: "LITHIUM", pct: 15, color: "bg-purple-500" }, { name: "COBALT", pct: 20, color: "bg-blue-500" }, { name: "NICKEL", pct: 30, color: "bg-gray-400" }]
    },
    {
        id: 2, type: "Smartphone", icon: Smartphone, points: 150, impact: "15.0kg Offset", status: "valid",
        breakdown: [{ name: "GOLD", pct: 5, color: "bg-yellow-400" }, { name: "COPPER", pct: 15, color: "bg-orange-500" }, { name: "GLASS", pct: 40, color: "bg-cyan-300" }]
    },
    {
        id: 3, type: "Laptop (Pro)", icon: LayoutDashboard, points: 250, impact: "42.5kg Offset", status: "valid",
        breakdown: [{ name: "ALUMINUM", pct: 45, color: "bg-slate-300" }, { name: "RARE EARTH", pct: 8, color: "bg-violet-500" }, { name: "PLASTIC", pct: 30, color: "bg-zinc-600" }]
    },
    {
        id: 4, type: "Tablet Mini", icon: Smartphone, points: 120, impact: "18.2kg Offset", status: "valid",
        breakdown: [{ name: "GLASS", pct: 35, color: "bg-cyan-200" }, { name: "LITHIUM", pct: 25, color: "bg-purple-400" }, { name: "COPPER", pct: 10, color: "bg-orange-400" }]
    },
    {
        id: 5, type: "Copper Cable", icon: Cable, points: 25, impact: "0.8kg Offset", status: "valid",
        breakdown: [{ name: "COPPER", pct: 95, color: "bg-orange-500" }, { name: "PVC", pct: 5, color: "bg-gray-600" }]
    },
    { id: 6, type: "Glass Bottle", icon: Wine, points: 0, impact: "0kg", status: "invalid" },
    { id: 7, type: "Leaking Battery", icon: AlertTriangle, points: 0, impact: "HAZARD", status: "hazard" },
    { id: 8, type: "Unknown Object", icon: Search, points: 0, impact: "SCAN ERROR", status: "unclear" }
];

export default function KioskDemo() {
    const [step, setStep] = useState(1); // 1: QR Identification, 2: Session
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isDepositing, setIsDepositing] = useState(false);
    const [lastItem, setLastItem] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [sessionXp, setSessionXp] = useState(0);
    const [totalXp, setTotalXp] = useState(0);
    const [isIdentifying, setIsIdentifying] = useState(false);
    const [systemState, setSystemState] = useState<'online' | 'full' | 'offline'>('online');
    const [sensors, setSensors] = useState({
        temp: 24.5,
        air: 85,
        h2o: "Dry",
        signal: -12
    });
    const { toast } = useToast();

    // Clock and Sensor Fluctuations
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
            setSensors(prev => ({
                ...prev,
                temp: systemState === 'offline' ? 20.0 : parseFloat((24 + Math.random()).toFixed(1)),
                air: systemState === 'offline' ? 95 : Math.floor(80 + Math.random() * 10),
                signal: systemState === 'offline' ? 0 : -10 - Math.floor(Math.random() * 5)
            }));
        }, 3000);
        return () => clearInterval(timer);
    }, [systemState]);

    // Load initial XP
    useEffect(() => {
        const stored = localStorage.getItem('punarchakra_user_xp');
        if (stored) setTotalXp(parseInt(stored));
    }, []);

    const handleIdentify = () => {
        if (isIdentifying || systemState === 'offline') return;
        setIsIdentifying(true);
        setTimeout(() => {
            setIsIdentifying(false);
            setStep(2);
            toast({ title: "Welcome back, Srinjoyee!", description: "Identity verified. Session unlocked." });
        }, 1500);
    };

    const simulateDeposit = (item: any) => {
        if (isDepositing || systemState !== 'online') return;
        setIsDepositing(true);
        setLastItem(null);

        // Simulated processing time
        setTimeout(() => {
            if (item.status === 'unclear') {
                // Trigger a re-scan flow
                toast({
                    variant: "destructive",
                    title: "AI Confidence Low",
                    description: "Optical sensors obstructed. Recalibrating..."
                });

                setTimeout(() => {
                    setIsDepositing(false);
                    toast({
                        title: "Scan Failed",
                        description: "Item unrecognized. Please reposition and try again."
                    });
                }, 2000);
                return;
            }

            setIsDepositing(false);
            setLastItem(item);
            setHistory(prev => [item, ...prev].slice(0, 6));

            if (item.status === 'valid') {
                setSessionXp(prev => prev + item.points);
                const newTotal = totalXp + item.points;
                setTotalXp(newTotal);
                localStorage.setItem('punarchakra_user_xp', newTotal.toString());

                toast({ title: "Item Accepted", description: `Successfully deposited ${item.type}. +${item.points} XP earned.` });
            } else {
                toast({
                    variant: "destructive",
                    title: item.status === 'hazard' ? "Safety Protocol Engaged" : "Item Rejected",
                    description: item.status === 'hazard' ? "Leak detected. Item sequestered." : "Glass is not accepted at this terminal."
                });
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-4 lg:p-8 overflow-hidden select-none">

            <AnimatePresence mode="wait">
                {/* STEP 1: QR IDENTIFICATION SCREEN */}
                {step === 1 && (
                    <motion.div
                        key="identify"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[100] bg-[#044733] flex items-center justify-center p-4 lg:p-8"
                    >
                        <div className="max-w-xl w-full bg-off-white rounded-[3rem] p-10 lg:p-12 shadow-[0_50px_100px_rgba(0,0,0,0.3)] text-center space-y-8 relative overflow-hidden text-foreground">
                            {/* Decorative line */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500" />

                            <div className="space-y-3">
                                <h2 className="text-3xl font-black tracking-tight uppercase">Identify <span className="text-emerald-600">to Begin</span></h2>
                                <p className="text-muted-foreground/60 font-bold uppercase tracking-widest text-[10px]">Scan QR Code from your Punarchakra App</p>
                            </div>

                            <div className="relative inline-block">
                                <div className="w-48 h-48 bg-light-grey rounded-[2.5rem] border-4 border-light-grey flex items-center justify-center group cursor-pointer overflow-hidden p-6" onClick={handleIdentify}>
                                    <AnimatePresence mode="wait">
                                        {isIdentifying ? (
                                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 border-6 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Syncing...</span>
                                            </motion.div>
                                        ) : (
                                            <motion.div key="static" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
                                                <Scan className="w-16 h-16 text-muted-foreground/30 group-hover:text-emerald-500 transition-colors mx-auto" />
                                                <div className="space-y-1">
                                                    <p className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">Scanner Active</p>
                                                    <div className="w-8 h-0.5 bg-background mx-auto rounded-full" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Scanning line animation */}
                                    <motion.div
                                        animate={{ y: [0, 160, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="absolute left-0 top-0 w-full h-1 bg-emerald-500/30 blur-sm pointer-events-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-left">
                                <div className="p-4 bg-light-grey rounded-2xl border border-light-grey flex items-center gap-3">
                                    <div className="w-10 h-10 bg-off-white rounded-xl flex items-center justify-center shadow-sm">
                                        <Zap className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-muted-foreground/60 uppercase tracking-tighter">Total Rewards</p>
                                        <p className="text-lg font-black">{totalXp} XP</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-light-grey rounded-2xl border border-light-grey flex items-center gap-3">
                                    <div className="w-10 h-10 bg-off-white rounded-xl flex items-center justify-center shadow-sm">
                                        <ShieldCheck className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-muted-foreground/60 uppercase tracking-tighter">System Status</p>
                                        <p className={cn("text-lg font-black uppercase", systemState === 'online' ? "text-emerald-600" : "text-rose-500")}>
                                            {systemState}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleIdentify}
                                    disabled={isIdentifying || systemState === 'offline'}
                                    className="w-full py-5 bg-[#044733] text-white rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-xl hover:bg-[#033626] transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isIdentifying ? "Verifying..." : "SIMULATE SCAN"}
                                </button>

                                {systemState === 'offline' && (
                                    <p className="text-rose-500 font-black uppercase text-[8px] tracking-widest animate-pulse">TERMINAL OFFLINE - MAINTENANCE IN PROGRESS</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* STEP 2: MAIN DASHBOARD SESSION */}
                {step === 2 && (
                    <motion.div
                        key="session"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6 h-full"
                    >
                        {/* 1. LEFT SIDEBAR: SENSOR ARRAY & OVERRIDES */}
                        <div className="col-span-12 lg:col-span-3 space-y-6">
                            {/* Brand Header */}
                            <div className="p-6">
                                <h1 className="flex flex-col gap-0.5 leading-none">
                                    <span className="text-3xl font-black text-foreground tracking-tighter">SmartBin</span>
                                    <span className="text-[10px] font-black text-emerald-500 tracking-[0.4em] uppercase opacity-80">System Interface</span>
                                </h1>
                                <div className="mt-4 flex items-center gap-2">
                                    <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] font-black text-emerald-600 uppercase tracking-widest">Node v4.2</div>
                                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Kiosk Control</span>
                                </div>
                            </div>

                            {/* Sensor Array Card */}
                            <div className="bg-off-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-light-grey flex flex-col gap-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                                        <Activity className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <h2 className="text-lg font-black uppercase tracking-tight">Sensor Array</h2>
                                </div>

                                <div className="space-y-6">
                                    <SensorBar label="Thermistor" value={`${sensors.temp}°C`} pct={(sensors.temp / 40) * 100} color="bg-rose-500" icon={Thermometer} />
                                    <SensorBar label="Air Quality" value={sensors.air > 80 ? "Optimal" : "Fair"} pct={sensors.air} color="bg-blue-500" icon={Wind} />
                                    <SensorBar label="H2O Sensors" value={sensors.h2o} pct={100} color="bg-cyan-400" icon={Droplets} />
                                    <SensorBar label="Signal" value={`${sensors.signal}ms`} pct={Math.abs(sensors.signal) * 5} color="bg-emerald-500" icon={Radio} />
                                </div>
                            </div>

                            {/* System Overrides Card */}
                            <div className="bg-off-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-light-grey space-y-4">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">System Overrides</p>

                                <div className="space-y-3">
                                    <OverrideButton
                                        active={systemState === 'online'}
                                        label="Online / Operational"
                                        color="emerald"
                                        onClick={() => setSystemState('online')}
                                    />
                                    <OverrideButton
                                        active={systemState === 'full'}
                                        label="Full Capacity Simulation"
                                        color="amber"
                                        onClick={() => setSystemState('full')}
                                    />
                                    <OverrideButton
                                        active={systemState === 'offline'}
                                        label="Maintenance Offline"
                                        color="slate"
                                        onClick={() => setSystemState('offline')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. MAIN CONTENT AREA */}
                        <div className="col-span-12 lg:col-span-9 space-y-6 relative">
                            {/* Offline Overlay */}
                            {systemState === 'offline' && (
                                <div className="absolute inset-0 z-50 bg-background/60 backdrop-blur-[2px] rounded-[3.5rem] flex items-center justify-center">
                                    <div className="bg-foreground text-background px-12 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 text-center border-4 border-foreground/10">
                                        <Lock className="w-16 h-16 text-rose-500" />
                                        <div className="space-y-2">
                                            <h3 className="text-3xl font-black uppercase">System Locked</h3>
                                            <p className="opacity-60 text-sm font-bold uppercase tracking-widest">Maintenance mode active</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Header Bar */}
                            <div className="bg-off-white/50 backdrop-blur-md rounded-[2.5rem] px-8 py-5 border border-light-grey flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full border",
                                        systemState === 'online' ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-600" :
                                            systemState === 'full' ? "bg-amber-500/5 border-amber-500/10 text-amber-600" :
                                                "bg-muted-foreground/5 border-muted-foreground/10 text-muted-foreground"
                                    )}>
                                        <div className={cn("w-2 h-2 rounded-full",
                                            systemState === 'online' ? "bg-emerald-500" :
                                                systemState === 'full' ? "bg-amber-500" : "bg-muted-foreground"
                                        )} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{systemState}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-emerald-500" />
                                        <span className="text-sm font-black text-foreground">Session: {sessionXp} XP</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm font-black text-muted-foreground">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Body */}
                            <div className="bg-off-white rounded-[3.5rem] p-12 shadow-[0_40px_100px_rgba(0,0,0,0.06)] border-4 border-off-white min-h-[600px] flex flex-col gap-12 relative overflow-hidden">
                                {systemState === 'full' && (
                                    <div className="absolute top-0 left-0 w-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-[0.4em] py-2 text-center z-10 animate-pulse">
                                        Warning: Container @ 98% Capacity - Compaction Active
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start h-full">
                                    {/* Left: Identification */}
                                    <div className="space-y-12 relative z-10">
                                        <div className="space-y-4">
                                            <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em]">Sensors Live</p>
                                            <h2 className="text-7xl font-black text-foreground leading-tight">MATERIAL<br />ANALYSIS</h2>
                                        </div>

                                        <AnimatePresence mode="wait">
                                            {lastItem ? (
                                                <motion.div key={lastItem.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-light-grey/50 rounded-[3rem] p-10 border border-light-grey space-y-8 relative group overflow-hidden">
                                                    <div className="absolute bottom-0 right-0 text-emerald-500/5 transition-colors pointer-events-none -z-10">
                                                        <lastItem.icon className="w-56 h-56 -mb-16 -mr-16 rotate-12" />
                                                    </div>
                                                    <div className="space-y-1 relative z-10">
                                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Identification</p>
                                                        <p className="text-4xl font-black text-foreground">{lastItem.type}</p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-off-white p-6 rounded-[2rem] shadow-sm border border-light-grey/20">
                                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter mb-2">Impact</p>
                                                            <p className="text-xl font-black text-emerald-600">{lastItem.impact}</p>
                                                        </div>
                                                        <div className="bg-off-white p-6 rounded-[2rem] shadow-sm border border-light-grey/20">
                                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter mb-2">XP Value</p>
                                                            <p className="text-xl font-black text-foreground">{lastItem.points} pts</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <div className="bg-light-grey/50 rounded-[3rem] p-12 border-2 border-dashed border-light-grey flex flex-col items-center justify-center text-center space-y-6">
                                                    <div className="w-20 h-20 bg-off-white rounded-full flex items-center justify-center shadow-inner">
                                                        <Search className="w-8 h-8 text-muted-foreground/30 animate-pulse" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-lg font-black text-muted-foreground/50 uppercase tracking-wider">Waiting for Deposit</p>
                                                        <p className="text-xs text-muted-foreground/40 font-medium">Place an item on the scanner tray to begin</p>
                                                    </div>
                                                </div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Right: Breakdown visualization */}
                                    <div className="h-full flex flex-col justify-center">
                                        <div className="bg-light-grey/30 rounded-[4rem] p-12 border border-light-grey space-y-10 min-h-[450px] relative">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Material Breakdown</h3>
                                                <span className="text-[10px] font-black bg-emerald-500 text-white px-3 py-1 rounded-full uppercase tracking-widest">Live Feed</span>
                                            </div>

                                            <AnimatePresence mode="wait">
                                                {lastItem?.breakdown && !isDepositing ? (
                                                    <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                                                        {lastItem.breakdown.map((b: any) => (
                                                            <div key={b.name} className="space-y-4">
                                                                <div className="flex justify-between text-[11px] font-black tracking-widest">
                                                                    <span className="text-muted-foreground/80">{b.name}</span>
                                                                    <span className="text-foreground">{b.pct}%</span>
                                                                </div>
                                                                <div className="h-3 bg-off-white rounded-full overflow-hidden p-0.5 shadow-inner border border-light-grey/20">
                                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${b.pct}%` }} className={cn("h-full rounded-full transition-all duration-1000", b.color)} />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                ) : (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8 p-12">
                                                        <div className="relative">
                                                            <ShieldCheck className={cn("w-24 h-24 transition-all duration-500", isDepositing ? "text-emerald-500 scale-110" : "text-muted-foreground/20")} />
                                                            {isDepositing && <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl" />}
                                                        </div>
                                                        <p className="text-xs font-black uppercase tracking-[0.6em] text-muted-foreground/30 animate-pulse">
                                                            {isDepositing ? "Analyzing Molecular structure..." : "Optical Sensors Monitoring..."}
                                                        </p>
                                                        {isDepositing && (
                                                            <div className="flex gap-1">
                                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom History/Actions */}
                                <div className="mt-auto flex flex-col md:flex-row gap-6 items-stretch">
                                    <div className="flex-1 bg-light-grey/50 rounded-[2.5rem] p-6 border border-light-grey">
                                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                                            {ITEMS.filter(i => i.status === 'valid').map((item) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => simulateDeposit(item)}
                                                    disabled={isDepositing || systemState !== 'online'}
                                                    className="aspect-square bg-off-white rounded-2xl flex flex-col items-center justify-center gap-2 shadow-sm border border-light-grey/30 hover:border-emerald-500 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 group hover:disabled:border-rose-500 p-2"
                                                >
                                                    <item.icon className="w-6 h-6 text-muted-foreground/30 group-hover:text-emerald-500 group-hover:scale-110 transition-all group-disabled:text-muted-foreground/20" />
                                                    <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-tighter text-center line-clamp-1">{item.type.split(" ")[0]}</span>
                                                </button>
                                            ))}
                                            {/* Unknown/Unclear Test Button */}
                                            <button
                                                onClick={() => simulateDeposit(ITEMS[7])}
                                                disabled={isDepositing || systemState !== 'online'}
                                                className="aspect-square bg-amber-500/5 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-sm border border-amber-500/10 hover:border-amber-500 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 group p-2"
                                            >
                                                <Search className="w-6 h-6 text-amber-500/30 group-hover:text-amber-500 transition-all" />
                                                <span className="text-[8px] font-black text-amber-500/40 uppercase tracking-tighter">Unknown</span>
                                            </button>
                                        </div>
                                        {systemState === 'full' && (
                                            <div className="flex-1 flex items-center gap-4 px-6 py-4 bg-amber-500/10 rounded-3xl border border-amber-500/20">
                                                <AlertCircle className="w-6 h-6 text-amber-500" />
                                                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Bin Capacity Exceeded - Scanning Suspended</span>
                                            </div>
                                        )}
                                        {systemState === 'online' && (
                                            <div className="ml-4 flex-1 space-y-3">
                                                <button onClick={() => simulateDeposit(ITEMS[3])} className="w-full p-4 rounded-2xl bg-light-grey/50 border border-light-grey flex items-center justify-between group">
                                                    <div className="flex items-center gap-3">
                                                        <Wine className="w-4 h-4 text-muted-foreground/40" />
                                                        <span className="text-[10px] font-black text-muted-foreground/50 uppercase">Glass not accepted</span>
                                                    </div>
                                                    <LockIcon className="w-3 h-3 text-muted-foreground/20" />
                                                </button>
                                                <button onClick={() => simulateDeposit(ITEMS[4])} className="w-full p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex items-center justify-between group">
                                                    <div className="flex items-center gap-3">
                                                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                                                        <span className="text-[10px] font-black text-rose-500/70 uppercase">Leak detected</span>
                                                    </div>
                                                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => { setStep(1); setSessionXp(0); setLastItem(null); }}
                                        className="bg-[#044733] text-white px-12 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 hover:bg-[#033626] transition-all shadow-xl shadow-emerald-900/10 group min-w-[180px]"
                                    >
                                        <CheckCircle2 className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Session End</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Back Tooltip */}
            <Link href="/smart-bin" className="fixed bottom-8 right-8 px-6 py-4 bg-foreground text-background rounded-2xl flex items-center gap-3 font-black uppercase text-[10px] shadow-2xl hover:opacity-90 transition-all z-50">
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                Control Room
            </Link>

            <div className="fixed inset-0 pointer-events-none -z-10 opacity-40 dark:opacity-10" style={{ backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        </div>
    );
}

function SensorBar({ label, value, pct, color, icon: Icon }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className={cn("flex items-center gap-1", color.replace('bg-', 'text-'))}><Icon className="w-3 h-3" /> {label}</span>
                <span className="text-foreground/70">{value}</span>
            </div>
            <div className="h-2 bg-background/50 rounded-full overflow-hidden border border-light-grey/30">
                <motion.div animate={{ width: `${pct}%` }} className={cn("h-full rounded-full transition-all duration-700", color)} />
            </div>
        </div>
    );
}

function OverrideButton({ active, label, color, onClick }: any) {
    const colors: any = {
        emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dot-emerald-500",
        amber: "bg-amber-500/10 border-amber-500/20 text-amber-600 dot-amber-500",
        slate: "bg-muted-foreground/10 border-muted-foreground/20 text-muted-foreground dot-muted-foreground"
    };

    return (
        <button
            onClick={onClick}
            className={cn("w-full p-4 rounded-2xl border flex items-center justify-between group transition-all",
                active ? colors[color] : "bg-off-white border-light-grey text-muted-foreground/30 grayscale"
            )}
        >
            <span className="text-[10px] font-black uppercase">{label}</span>
            <div className={cn("w-2 h-2 rounded-full", active ? `${colors[color].split(' dot-')[1]} animate-pulse` : "bg-light-grey")} />
        </button>
    );
}

function LockIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
    );
}
