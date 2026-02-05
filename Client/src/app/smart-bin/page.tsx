"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { motion, AnimatePresence } from "framer-motion";
import {
    QrCode,
    CheckCircle2,
    Trash2,
    RefreshCcw,
    ChevronRight,
    SmartphoneIcon as Scan,
    Globe,
    AlertCircle,
    Battery,
    Wifi,
    Zap,
    Leaf,
    Cpu,
    Trophy,
    Download,
    Info,
    Settings as SettingsIcon,
    Activity,
    Droplets,
    CloudRain,
    UserCheck,
    Box,
    Smartphone,
    Cable,
    Search,
    XCircle,
    AlertTriangle,
    Wine,
    Thermometer,
    Wind,
    Radio,
    MapPin,
    ArrowUpRight,
    Navigation,
    Clock,
    Filter
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "../../components/ui/use-toast";
import { ModeToggle } from "@/components/mode-toggle";

// --- TYPES ---
interface SmartBin {
    id: string;
    name: string;
    location: string;
    fill: number;
    status: "operational" | "nearlyFull" | "maintenance" | "critical";
    wasteType: "Dry" | "Wet" | "E-Waste" | "Hazardous" | "Mixed";
    battery: number;
    lastPickup: string;
    aiPriority: "Low" | "Medium" | "High" | "Critical";
    sensors: {
        temp: number;
        humidity: number;
        latency: number;
    };
    prediction: string;
    coords: { lat: number; lng: number };
}

// --- SIMULATED DATA ---
const INITIAL_BINS: SmartBin[] = [
    {
        id: "BIN-001",
        name: "MG Road Central",
        location: "Opposite Metro Station",
        fill: 42,
        status: "operational",
        wasteType: "Dry",
        battery: 98,
        lastPickup: "2h ago",
        aiPriority: "Low",
        sensors: { temp: 24, humidity: 45, latency: 12 },
        prediction: "Fill reached in 3 days",
        coords: { lat: 12.9716, lng: 77.5946 }
    },
    {
        id: "BIN-002",
        name: "Indiranagar 100ft",
        location: "KFC Junction",
        fill: 92,
        status: "nearlyFull",
        wasteType: "E-Waste",
        battery: 85,
        lastPickup: "1d ago",
        aiPriority: "High",
        sensors: { temp: 28, humidity: 55, latency: 15 },
        prediction: "Pickup recommended in 2h",
        coords: { lat: 12.9784, lng: 77.6408 }
    },
    {
        id: "BIN-003",
        name: "Koramangala 4th Block",
        location: "Sony World Signal",
        fill: 15,
        status: "maintenance",
        wasteType: "Mixed",
        battery: 12,
        lastPickup: "4h ago",
        aiPriority: "Medium",
        sensors: { temp: 22, humidity: 40, latency: 180 },
        prediction: "Technician dispatched",
        coords: { lat: 12.9339, lng: 77.6232 }
    },
    {
        id: "BIN-004",
        name: "Whitefield Main",
        location: "Near ITPL Gate",
        fill: 98,
        status: "critical",
        wasteType: "Hazardous",
        battery: 70,
        lastPickup: "2d ago",
        aiPriority: "Critical",
        sensors: { temp: 35, humidity: 65, latency: 25 },
        prediction: "Immediate collection required",
        coords: { lat: 12.9845, lng: 77.7339 }
    },
    {
        id: "1",
        name: "City Centre E-Waste Point",
        location: "MG Road, Bengaluru",
        fill: 45,
        status: "operational",
        wasteType: "E-Waste",
        battery: 88,
        lastPickup: "1h ago",
        aiPriority: "Low",
        sensors: { temp: 23, humidity: 42, latency: 10 },
        prediction: "Stable",
        coords: { lat: 12.9716, lng: 77.5946 }
    }
];

// --- COMPONENTS ---

function StatusBadge({ status }: { status: SmartBin["status"] }) {
    const config = {
        operational: { label: "Operational", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
        nearlyFull: { label: "Near Capacity", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
        maintenance: { label: "Offline / Service", color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
        critical: { label: "Critical Priority", color: "bg-red-600 text-white border-red-700 animate-pulse" },
    };
    const c = config[status];
    return (
        <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border", c.color)}>
            {c.label}
        </span>
    );
}

function PriorityIndicator({ priority }: { priority: SmartBin["aiPriority"] }) {
    const config = {
        Low: "bg-emerald-500",
        Medium: "bg-amber-500",
        High: "bg-orange-500",
        Critical: "bg-red-600"
    };
    return (
        <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", config[priority])} />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">AI Priority: {priority}</span>
        </div>
    );
}

function SmartBinContent() {
    const [bins, setBins] = useState<SmartBin[]>(INITIAL_BINS);
    const [selectedBin, setSelectedBin] = useState<SmartBin | null>(null);
    const [filter, setFilter] = useState("All");
    const [lastDepositAlert, setLastDepositAlert] = useState<any>(null);
    const [liveHistory, setLiveHistory] = useState<Record<string, { time: string, event: string }[]>>({});
    const [userXP, setUserXP] = useState(0);
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const { session, isLoading } = useSession();
    const router = useRouter();

    // --- REDIRECT LOGIC REMOVED: Render User View instead ---
    /* 
    useEffect(() => {
        if (!isLoading && !session?.user) {
             router.push("/login?callbackUrl=/smart-bin");
        }
    }, [session, isLoading, router]);
    */

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-emerald-500 font-bold animate-pulse uppercase tracking-[0.2em]">Loading...</p>
                </div>
            </div>
        );
    }

    // --- USER VIEW FOR NON-ADMINS ---
    if (session?.user?.role !== "admin") {
        return (
            <div className="min-h-screen bg-background p-8 flex flex-col items-center justify-center text-center space-y-8">
                <div className="max-w-2xl space-y-6">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Smartphone className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h1 className="text-4xl font-black text-foreground">Smart Bin Locator</h1>
                    <p className="text-xl text-muted-foreground">
                        Find, Scan, and Earn. Use our specialized Kiosk interface to interact with physical bins.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        <Link href="/smart-bin/kiosk" className="p-6 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all flex flex-col items-center gap-4 shadow-lg active:scale-95 group">
                            <Scan className="w-12 h-12 group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-lg uppercase tracking-wider">Open Kiosk Mode</span>
                        </Link>
                        <Link href="/map" className="p-6 bg-white dark:bg-neutral-800 text-foreground border-2 border-light-grey dark:border-neutral-700 rounded-2xl hover:border-emerald-500 transition-all flex flex-col items-center gap-4 shadow-sm active:scale-95 group">
                            <MapPin className="w-12 h-12 text-emerald-500 group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-lg uppercase tracking-wider">Find Nearest Bin</span>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // --- INITIAL SYNC: LOAD PARAMS & XP ---
    useEffect(() => {
        const binId = searchParams.get('binId');
        if (binId) {
            const found = bins.find(b => b.id === binId);
            if (found) setSelectedBin(found);
        }

        const storedXP = localStorage.getItem('punarchakra_user_xp');
        if (storedXP) setUserXP(parseInt(storedXP));
    }, [searchParams, bins]);

    // --- INTERNAL SYNC: MONITOR KIOSK DEPOSITS ---
    useEffect(() => {
        const checkSync = () => {
            const raw = localStorage.getItem('last_kiosk_deposit');
            const storedXP = localStorage.getItem('punarchakra_user_xp');

            if (storedXP) setUserXP(parseInt(storedXP));

            if (raw) {
                const event = JSON.parse(raw);
                setLastDepositAlert(event);

                setBins(current => current.map(b =>
                    b.id === event.binId ? { ...b, fill: Math.min(b.fill + event.fillIncrease, 100), lastPickup: "Just now" } : b
                ));

                setLiveHistory(prev => ({
                    ...prev,
                    [event.binId]: [
                        {
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            event: `New ${event.item} deposit detected`
                        },
                        ...(prev[event.binId] || [])
                    ].slice(0, 5)
                }));

                localStorage.removeItem('last_kiosk_deposit');

                toast({
                    title: "Live Feed Update",
                    description: `New deposit detected at ${event.binId}: ${event.item}`,
                });
            }
        };

        const interval = setInterval(checkSync, 1000);
        return () => clearInterval(interval);
    }, [toast]);

    const filteredBins = useMemo(() => {
        if (filter === "All") return bins;
        return bins.filter(b => b.status.toLowerCase() === filter.toLowerCase() || b.wasteType === filter);
    }, [bins, filter]);

    const stats = useMemo(() => {
        return {
            total: bins.length,
            critical: bins.filter(b => b.status === 'critical' || b.status === 'nearlyFull').length,
            diversion: "84%",
            uptime: "99.8%"
        };
    }, [bins]);

    const handleAction = (binId: string, action: string) => {
        toast({
            title: `Action Dispatched: ${action}`,
            description: `Sent command to ${binId} successfully.`,
        });
        if (action === "Collect") {
            setBins(prev => prev.map(b => b.id === binId ? { ...b, fill: 0, status: 'operational', lastPickup: "Just now", aiPriority: "Low" } : b));
        }
    };

    return (
        <div className="min-h-screen bg-background p-6 lg:p-8 space-y-8 font-sans transition-colors duration-300">

            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                            <Navigation className="text-white w-5 h-5" />
                        </div>
                        <h1 className="text-3xl font-black text-foreground tracking-tight">Control <span className="text-emerald-600">Center</span></h1>
                    </div>
                    <p className="text-muted-foreground font-medium text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Smart City Waste Monitoring System • Live v4.5
                    </p>
                </div>



                <div className="flex items-center gap-4">
                    <ModeToggle />
                    <div className="hidden sm:flex flex-col items-end mr-2">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Your Account</span>
                        <span className="text-sm font-black text-foreground flex items-center gap-2 mt-0.5">
                            <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                            {userXP} XP
                        </span>
                    </div>
                    <div className="w-12 h-12 bg-light-grey rounded-2xl flex items-center justify-center border-2 border-background shadow-sm">
                        <UserCheck className="w-6 h-6 text-muted-foreground" />
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
                    {[
                        { label: "Active Bins", val: stats.total, icon: MapPin, color: "text-blue-600" },
                        { label: "Critical", val: stats.critical, icon: AlertTriangle, color: "text-rose-600" },
                        { label: "Diversion", val: stats.diversion, icon: Leaf, color: "text-emerald-600" },
                        { label: "System Health", val: stats.uptime, icon: Activity, color: "text-violet-600" }
                    ].map((s) => (
                        <div key={s.label} className="bg-off-white p-4 rounded-2xl border border-light-grey shadow-sm flex flex-col group hover:border-emerald-500/30 transition-colors">
                            <div className="flex items-center gap-2 mb-1">
                                <s.icon className={cn("w-3 h-3", s.color)} />
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">{s.label}</span>
                            </div>
                            <span className="text-xl font-black text-foreground">{s.val}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- FLOATING DEMO NAVIGATION --- */}
            <div className="fixed bottom-8 right-8 z-[110] flex gap-3">
                <Link href="/smart-bin/kiosk" className="px-8 py-5 bg-emerald-600 text-white rounded-[2rem] flex items-center gap-3 font-black uppercase text-sm shadow-[0_15px_30px_rgba(16,185,129,0.3)] hover:bg-emerald-500 transition-all active:scale-95 group">
                    <Scan className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Open Kiosk Demo
                </Link>
            </div>

            {/* --- LIVE SYNC ALERT (Control Room Only) --- */}
            <AnimatePresence>
                {lastDepositAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 fixed top-24 left-1/2 -track-x-1/2 z-[200] border-2 border-emerald-400"
                    >
                        <RefreshCcw className="w-5 h-5 animate-spin" />
                        <span className="text-xs font-black uppercase tracking-widest">
                            Live Update: {lastDepositAlert.item} deposited at {lastDepositAlert.binId}
                        </span>
                        <button onClick={() => setLastDepositAlert(null)} className="ml-2 opacity-60 hover:opacity-100">
                            <XCircle className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- FILTER & MAIN CONTENT --- */}
            <div className="space-y-6">

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                    {["All", "Operational", "NearlyFull", "Critical", "E-Waste"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                                filter === f ? "bg-foreground text-background shadow-lg" : "bg-off-white text-muted-foreground hover:bg-light-grey border border-light-grey"
                            )}
                        >
                            {f === "NearlyFull" ? "Near Capacity" : f}
                        </button>
                    ))}
                </div>

                {/* Bin Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredBins.map((bin) => (
                            <motion.div
                                layout
                                key={bin.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={() => setSelectedBin(bin)}
                                className={cn(
                                    "bg-off-white rounded-[2rem] p-6 border-2 transition-all cursor-pointer group relative overflow-hidden",
                                    selectedBin?.id === bin.id ? "border-emerald-500 shadow-xl shadow-emerald-900/5 ring-4 ring-emerald-500/10" : "border-light-grey hover:border-emerald-500/30 hover:shadow-lg shadow-sm"
                                )}
                            >
                                {/* Priority Corner */}
                                <div className="absolute top-0 right-0 p-4">
                                    <PriorityIndicator priority={bin.aiPriority} />
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{bin.id}</p>
                                        <h3 className="text-xl font-black text-foreground group-hover:text-emerald-500 transition-colors uppercase tracking-tight leading-none">{bin.name}</h3>
                                        <p className="text-xs text-muted-foreground font-medium mt-1 uppercase flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {bin.location}
                                        </p>
                                    </div>

                                    {/* Capacity Visual */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Fill Level</span>
                                            <span className={cn("text-lg font-black", bin.fill > 80 ? "text-rose-600" : "text-foreground")}>{bin.fill}%</span>
                                        </div>
                                        <div className="h-4 bg-background rounded-full overflow-hidden border border-light-grey p-0.5 shadow-inner">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${bin.fill}%` }}
                                                transition={{ type: "spring", stiffness: 60, damping: 12 }}
                                                className={cn(
                                                    "h-full rounded-full shadow-inner",
                                                    bin.fill > 90 ? "bg-red-500" : bin.fill > 70 ? "bg-amber-500" : "bg-emerald-500"
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Meta info */}
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-light-grey">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-muted-foreground uppercase">Material</p>
                                            <div className="flex items-center gap-2">
                                                <Box className="w-3 h-3 text-emerald-500" />
                                                <span className="text-xs font-black text-foreground/80">{bin.wasteType}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-muted-foreground uppercase">Status</p>
                                            <StatusBadge status={bin.status} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* --- DETAIL PANEL (SLIDE OVER) --- */}
            <AnimatePresence>
                {selectedBin && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedBin(null)}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-off-white shadow-2xl z-[101] flex flex-col p-8 overflow-y-auto border-l border-light-grey"
                        >
                            <button onClick={() => setSelectedBin(null)} className="absolute top-6 left-6 p-2 hover:bg-light-grey rounded-full transition-colors group">
                                <XCircle className="w-7 h-7 text-muted-foreground/30 group-hover:text-muted-foreground" />
                            </button>

                            <div className="mt-12 space-y-10">
                                {/* Header */}
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <StatusBadge status={selectedBin.status} />
                                            <PriorityIndicator priority={selectedBin.aiPriority} />
                                        </div>
                                        <h2 className="text-4xl font-black text-foreground uppercase tracking-tight">{selectedBin.name}</h2>
                                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm flex items-center gap-2 mt-2">
                                            <MapPin className="w-4 h-4 text-emerald-500" /> {selectedBin.location}
                                        </p>
                                    </div>
                                </div>

                                {/* AI Intelligence Insight Card */}
                                <div className="bg-foreground text-background rounded-[2.5rem] p-8 relative overflow-hidden shadow-xl">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <Cpu className="w-24 h-24 rotate-12" />
                                    </div>
                                    <div className="relative z-10 space-y-6">
                                        <div>
                                            <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest mb-4 inline-block">AI PREDICTION MODEL</span>
                                            <h4 className="text-3xl font-black leading-tight text-emerald-400">
                                                {selectedBin.fill > 90 ? "CRITICAL: IMMEDIATE PICKUP" :
                                                    selectedBin.fill > 75 ? "CAPACITY ALERT: 2H REMAINING" :
                                                        "STATUS: OPTIMAL EFFICIENCY"}
                                            </h4>
                                            <p className="opacity-40 text-xs mt-3 uppercase font-bold tracking-widest text-background">Confidence Score: 98.4%</p>
                                        </div>
                                        <div className="h-px bg-background/10 w-full" />
                                        <p className="opacity-80 text-sm leading-relaxed font-medium">
                                            {selectedBin.fill > 90
                                                ? "Sensors report overflow threshold reached. AI has auto-prioritized this unit for the next available collection vehicle (Route A-4)."
                                                : `Current usage patterns suggest this unit will remain stable for another ${Math.floor((100 - selectedBin.fill) / 5)} hours. No immediate action required.`}
                                        </p>
                                    </div>
                                </div>

                                {/* Sensor Specs */}
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { label: "Internal Temp", val: `${selectedBin.sensors.temp}°C`, icon: Thermometer, color: "bg-red-500/10 text-red-500" },
                                        { label: "Moisture", val: `${selectedBin.sensors.humidity}%`, icon: Droplets, color: "bg-blue-500/10 text-blue-500" },
                                        { label: "Latency", val: `${selectedBin.sensors.latency}ms`, icon: Radio, color: "bg-light-grey text-muted-foreground" }
                                    ].map((s) => (
                                        <div key={s.label} className="p-5 rounded-3xl border border-light-grey flex flex-col items-center text-center space-y-3">
                                            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", s.color)}>
                                                <s.icon className="w-5 h-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{s.label}</p>
                                                <p className="text-sm font-black text-foreground">{s.val}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* History Timeline */}
                                <div className="space-y-6 pt-4 border-t border-light-grey">
                                    <h5 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                        <Clock className="w-3 h-3" /> Recent Activity Log
                                    </h5>
                                    <div className="space-y-6 relative ml-4 border-l-2 border-light-grey pl-8">
                                        {(liveHistory[selectedBin.id] || []).map((e, idx) => (
                                            <div key={`live-${idx}`} className="relative">
                                                <div className="absolute -left-[37px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background shadow-sm" />
                                                <p className="text-[9px] font-black text-emerald-500 uppercase mb-1">{e.time}</p>
                                                <p className="text-sm font-bold text-foreground leading-tight">{e.event}</p>
                                            </div>
                                        ))}
                                        {[
                                            { time: "08:45 AM", event: "routine system integrity check passed", type: "check" },
                                            { time: "yesterday", event: "maintenance reset by admin", type: "admin" }
                                        ].map((e, idx) => (
                                            <div key={idx} className="relative opacity-40">
                                                <div className="absolute -left-[37px] top-1.5 w-3 h-3 rounded-full bg-light-grey border-2 border-background shadow-sm" />
                                                <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">{e.time}</p>
                                                <p className="text-sm font-bold text-foreground leading-tight uppercase">{e.event}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
                                    <button
                                        onClick={() => {
                                            const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedBin.coords.lat},${selectedBin.coords.lng}`;
                                            window.open(url, "_blank");
                                        }}
                                        className="py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <Navigation className="w-5 h-5" /> Start Navigation
                                    </button>
                                    <button
                                        onClick={() => handleAction(selectedBin.id, "Collect")}
                                        className="py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <Trash2 className="w-5 h-5" /> Dispatch Collection
                                    </button>
                                    <button
                                        onClick={() => handleAction(selectedBin.id, "Restart")}
                                        className="py-6 bg-foreground text-background rounded-[2rem] font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 sm:col-span-2"
                                    >
                                        <RefreshCcw className="w-5 h-5" /> Reset System Sensors
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <div className="fixed inset-0 pointer-events-none -z-10 opacity-40 dark:opacity-5" style={{ backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        </div>
    );
}

export default function SmartCityControlCenter() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
                <div className="text-emerald-500 font-bold animate-pulse uppercase tracking-[0.5em]">Initializing Control Center Data...</div>
            </div>
        }>
            <SmartBinContent />
        </Suspense>
    );
}
