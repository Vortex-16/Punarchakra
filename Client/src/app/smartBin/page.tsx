"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, RefreshCw, AlertTriangle, CheckCircle, Loader2, X, Zap, Box, Recycle, QrCode, Globe, Battery, Wifi, Truck } from "lucide-react";
import { detectWaste } from "@/app/actions/detectWaste";
import { useSession as useNextAuthSession } from "next-auth/react";
import { depositWasteItem } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { SchedulePickup } from "@/components/smart-bin/SchedulePickup";

// Quick helper to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

type Language = 'en' | 'hi' | 'es';

const TRANSLATIONS = {
    en: {
        title: "ECO-VAULT",
        insertWaste: "Insert Waste",
        dragOrCamera: "Drag file or Start Camera",
        openCamera: "Open Camera",
        uploadFile: "Upload File",
        processing: "Processing...",
        runningModel: "Running Vision Model (Llama 4)",
        detectionFailed: "Detection Failed",
        tryAgain: "Try Again",
        estValue: "Est. Value",
        impact: "Impact",
        score: "Score",
        credits: "Credits",
        nextItem: "Processed • Next Item",
        depositOpen: "Deposit Slot Open",
        systemReady: "System Ready",
        maintenance: "Maintenance Required",
        binFull: "Bin Full",
        scanQr: "Scan QR to Login",
        welcome: "Welcome, User!",
        login: "Login",
        fillLevel: "Fill Level"
    },
    hi: {
        title: "इको-वॉल्ट",
        insertWaste: "कचरा डालें",
        dragOrCamera: "फाइल खींचें या कैमरा शुरू करें",
        openCamera: "कैमरा खोलें",
        uploadFile: "फाइल अपलोड करें",
        processing: "प्रोसेसिंग...",
        runningModel: "विज़न मॉडल चल रहा है (Llama 4)",
        detectionFailed: "पहचान विफल",
        tryAgain: "पुनः प्रयास करें",
        estValue: "अनुमानित मूल्य",
        impact: "प्रभाव",
        score: "स्कोर",
        credits: "क्रेडिट",
        nextItem: "प्रसंस्कृत • अगली वस्तु",
        depositOpen: "जमा स्लॉट खुला है",
        systemReady: "सिस्टम तैयार",
        maintenance: "रखरखाव आवश्यक",
        binFull: "डस्टबिन भरा है",
        scanQr: "लॉगिन के लिए QR स्कैन करें",
        welcome: "स्वागत है!",
        login: "लॉगिन",
        fillLevel: "भराव स्तर"
    },
    es: {
        title: "ECO-BÓVEDA",
        insertWaste: "Insertar Residuos",
        dragOrCamera: "Arrastrar archivo o Iniciar Cámara",
        openCamera: "Abrir Cámara",
        uploadFile: "Subir Archivo",
        processing: "Procesando...",
        runningModel: "Ejecutando Modelo de Visión (Llama 4)",
        detectionFailed: "Detección Fallida",
        tryAgain: "Intentar de Nuevo",
        estValue: "Valor Est.",
        impact: "Impacto",
        score: "Puntuación",
        credits: "Créditos",
        nextItem: "Procesado • Siguiente",
        depositOpen: "Ranura Abierta",
        systemReady: "Sistema Listo",
        maintenance: "Mantenimiento Requerido",
        binFull: "Papelera Llena",
        scanQr: "Escanear QR para Entrar",
        welcome: "¡Bienvenido!",
        login: "Entrar",
        fillLevel: "Nivel de Llenado"
    }
};

export default function SmartBinMachine() {
    const { data: session, update: updateSession } = useNextAuthSession(); // Access user session with update
    const { toast } = useToast();
    const [status, setStatus] = useState<"locked" | "idle" | "camera" | "analyzing" | "result" | "error">("locked");
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);
    const [dragActive, setDragActive] = useState(false);
    const [hasDeposited, setHasDeposited] = useState(false);

    // New State Features
    const [language, setLanguage] = useState<Language>('en');
    const [fillLevel, setFillLevel] = useState(45); // Start at 45%
    const [isMaintenance, setIsMaintenance] = useState(false);
    const [showSchedule, setShowSchedule] = useState(false);

    const t = TRANSLATIONS[language];

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initial setup - Fetch real bin status
    useEffect(() => {
        // Fetch specific bin or default bin status
        const fetchBinStatus = async () => {
            try {
                // For demo, we might not have a bin ID, so we'll fetch stats or a default bin
                // Ideally, this machine knows its ID. Let's assume a default bin for now or fetch stats
                // We'll fetch bin stats to get an average or a specific bin if we had one.
                // Instead, let's use the 'active' bin logic from backend by depositing 0 points or just getting bins
                // A better way: GET /api/bins?status=active

                // For now, let's start at 0 or a fixed value if we can't fetch, 
                // but real implementation should fetch.
                // Let's simulation a "connect" to backend.

                // Simple: Set to 0 initially, or fetch if we add a getBin API.
                // Let's keep it simple: Start at 45 (visual) but if we had an ID we'd fetch.
                // BUT user said "randomly changing". 
                // REMOVE THE RANDOM SETTIMEOUT/INTERVAL IF ANY.
                // The previous code had: setFillLevel(Math.floor(Math.random() * 60) + 20);
                // We will remove that.

                // If we want to show REAL fill level, we need to GET it.
                // Let's just default to a static value for now since we don't have a 'getMyBin' endpoint for the kiosk
                // unless we want to query the list.

                setFillLevel(40); // Default starting level

            } catch (err) {
                console.error("Failed to fetch bin status");
            }
        };
        fetchBinStatus();
    }, []);

    // Helper to simulate login
    const handleLogin = () => {
        setStatus("idle");
    };

    // --- Camera Logic ---
    const startCamera = async () => {
        try {
            setStatus("camera");
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera error:", err);
            alert("Could not access camera. Please use upload.");
            setStatus("idle");
        }
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext("2d")?.drawImage(video, 0, 0);
            const image = canvas.toDataURL("image/jpeg");

            // Stop stream
            const stream = video.srcObject as MediaStream;
            stream?.getTracks().forEach(track => track.stop());

            setImageSrc(image);
            analyzeImage(image);
        }
    };

    const stopCamera = () => {
        const stream = videoRef.current?.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        setStatus("idle");
    };

    // --- File Upload Logic ---
    const handleFile = async (file: File) => {
        if (!file.type.startsWith("image/")) return;
        const base64 = await fileToBase64(file);
        setImageSrc(base64);
        analyzeImage(base64);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    // --- AI Integration ---
    const analyzeImage = async (base64: string) => {
        setStatus("analyzing");
        setHasDeposited(false); // Reset deposit state
        try {
            const response = await detectWaste(base64);

            if (response.success && response.data.recyclable) {
                const aiData = response.data;
                // Don't deposit yet. Just show result and ask for confirmation.
                setResult(aiData);
                setStatus("result");

            } else if (response.success && !response.data.recyclable) {
                setResult(response.data);
                setStatus("result");
                toast({
                    title: "Item Rejected",
                    description: "Only E-Waste is accepted. General waste detected.",
                    variant: "destructive"
                });
            } else {
                console.error(response.error);
                setStatus("error");
            }
        } catch (e) {
            setStatus("error");
        }
    };

    const handleConfirmDeposit = async () => {
        const accessToken = (session as any)?.accessToken;
        if (!result || !accessToken) return;

        try {
            // Show loading or optimistic update?
            const depositRes = await depositWasteItem(
                accessToken,
                result.label,
                result.estimated_credit,
                result.sustainability_score
            );

            setHasDeposited(true);

            // Update fill level from BACKEND response
            if (depositRes.binFillLevel) {
                setFillLevel(depositRes.binFillLevel);
            }

            // Refresh the NextAuth session with updated user data
            if (depositRes.user) {
                // Call updateSession with the new user data to refresh points and history
                await updateSession({
                    user: depositRes.user
                });
            }

            toast({
                title: "Deposit Successful! 🎉",
                description: `${result.estimated_credit} credits added to ${session?.user?.email}`,
                variant: "default"
            });

        } catch (err) {
            console.error("Deposit failed", err);
            toast({
                title: "Deposit Failed",
                description: "Could not connect to server.",
                variant: "destructive"
            });
        }
    };

    // Machine State Logic
    const isBinFull = fillLevel >= 95;
    const currentMachineState = isMaintenance ? "maintenance" : isBinFull ? "full" : "operational";

    return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 font-mono select-none">
            {/* --- INDUSTRIAL MACHINE CONTAINER --- */}
            <div className="relative w-full max-w-lg bg-[#FFD700] rounded-[2.5rem] border-[8px] border-black shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col transition-transform duration-500">

                {/* 1. Header Plate */}
                <div className="bg-black p-4 flex justify-between items-center border-b-4 border-black/20">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#FFD700] rounded-md flex items-center justify-center border-2 border-[#FFD700]">
                            <Recycle className="w-8 h-8 text-black" />
                        </div>
                        <div>
                            <h1 className="text-[#FFD700] font-black text-xl tracking-tighter leading-none">{t.title}</h1>
                            <span className="text-neutral-500 text-xs tracking-[0.2em] font-bold">SERIES X-9000</span>
                        </div>
                    </div>

                    {/* Hardware Stats */}
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex gap-3 text-neutral-400">
                            <div className="flex items-center gap-1">
                                <Wifi className="w-3 h-3 text-green-500" />
                                <span className="text-[10px] font-bold">5G</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Battery className="w-3 h-3 text-green-500" />
                                <span className="text-[10px] font-bold">98%</span>
                            </div>
                        </div>
                        {/* Fill Level Bar */}
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-neutral-500 font-bold uppercase">{t.fillLevel}</span>
                            <div className="w-24 h-3 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${fillLevel}%` }}
                                    className={`h-full ${isBinFull ? 'bg-red-500' : 'bg-green-500'}`}
                                />
                            </div>
                            <span className={`text-[10px] font-bold ${isBinFull ? 'text-red-500' : 'text-green-500'}`}>{fillLevel}%</span>
                        </div>
                    </div>
                </div>

                {/* 2. Main Interface Screen (Inset) */}
                <div className="flex-1 bg-neutral-800 p-6 relative min-h-[500px] flex flex-col">
                    <div className="absolute inset-0 border-[12px] border-black/10 pointer-events-none rounded-[1.5rem]" />

                    {/* Screen Content */}
                    <div className="flex-1 bg-black rounded-xl overflow-hidden relative flex flex-col border-4 border-neutral-700 shadow-inner">

                        {/* Language Toggle (Floating) */}
                        <div className="absolute top-4 right-4 z-50 flex gap-2">
                            <button
                                onClick={() => setShowSchedule(true)}
                                className="w-8 h-8 rounded-full bg-neutral-800 text-[#FFD700] border border-[#FFD700] flex items-center justify-center hover:bg-[#FFD700] hover:text-black transition-colors group"
                                title="Schedule Pickup"
                            >
                                <Truck className="w-4 h-4" />
                            </button>
                            {(['en', 'hi', 'es'] as Language[]).map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => setLanguage(lang)}
                                    className={`w-8 h-8 rounded-full text-xs font-bold border ${language === lang ? 'bg-[#FFD700] text-black border-[#FFD700]' : 'bg-black/50 text-white border-white/20'}`}
                                >
                                    {lang.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">

                            {/* LOCKED / QR SCAN STATE */}
                            {status === "locked" && (
                                <motion.div
                                    key="locked"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6"
                                >
                                    <div className="relative w-48 h-48 bg-white p-2 rounded-xl">
                                        <div className="w-full h-full bg-black flex items-center justify-center rounded-lg overflow-hidden">
                                            {/* Simulated QR Code Pattern */}
                                            <QrCode className="w-40 h-40 text-white" />
                                        </div>
                                        <div className="absolute inset-0 bg-blue-500/20 animate-pulse" />
                                        <motion.div
                                            animate={{ top: ["0%", "100%"] }}
                                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                            className="absolute left-0 w-full h-1 bg-blue-500 shadow-[0_0_20px_blue]"
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white uppercase mb-2">{t.scanQr}</h2>
                                        <button
                                            onClick={handleLogin}
                                            className="px-8 py-3 bg-[#FFD700] text-black font-bold rounded-full hover:bg-yellow-300 transition-colors cursor-pointer"
                                        >
                                            {t.login}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* IDLE STATE */}
                            {status === "idle" && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex-1 flex flex-col items-center justify-center p-6 text-center"
                                    onDragEnter={() => setDragActive(true)}
                                    onDragLeave={() => setDragActive(false)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleDrop}
                                >
                                    {/* Maintenance / Full Overlay */}
                                    {currentMachineState !== "operational" ? (
                                        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center text-red-500">
                                            <AlertTriangle className="w-20 h-20 mb-4 animate-bounce" />
                                            <h2 className="text-3xl font-black uppercase text-center">{isBinFull ? t.binFull : t.maintenance}</h2>
                                            <p className="text-neutral-500 mt-2">Please contact support.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className={`absolute inset-0 border-4 border-dashed transition-colors ${dragActive ? "border-[#FFD700] bg-[#FFD700]/10" : "border-neutral-700"}`} />

                                            <div className="z-10 space-y-8 w-full">
                                                <div className="space-y-2">
                                                    <h2 className="text-2xl font-bold text-white uppercase">{t.insertWaste}</h2>
                                                    <p className="text-neutral-400 text-sm">{t.dragOrCamera}</p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 w-full">
                                                    <button
                                                        onClick={startCamera}
                                                        className="flex flex-col items-center justify-center gap-3 p-6 bg-neutral-900 border border-neutral-700 rounded-xl hover:border-[#FFD700] hover:text-[#FFD700] text-gray-400 transition-all group"
                                                    >
                                                        <Camera className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                                        <span className="text-xs font-bold uppercase">{t.openCamera}</span>
                                                    </button>
                                                    <button
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="flex flex-col items-center justify-center gap-3 p-6 bg-neutral-900 border border-neutral-700 rounded-xl hover:border-[#FFD700] hover:text-[#FFD700] text-gray-400 transition-all group"
                                                    >
                                                        <Upload className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                                        <span className="text-xs font-bold uppercase">{t.uploadFile}</span>
                                                    </button>
                                                </div>
                                            </div>

                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                                            />
                                        </>
                                    )}
                                </motion.div>
                            )}

                            {/* CAMERA STATE */}
                            {status === "camera" && (
                                <motion.div
                                    key="camera"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black flex flex-col"
                                >
                                    <video ref={videoRef} autoPlay playsInline className="flex-1 object-cover w-full h-full opacity-80" />
                                    <canvas ref={canvasRef} className="hidden" />

                                    {/* Camera Overlay */}
                                    <div className="absolute inset-0 flex flex-col justify-between p-6 z-20">
                                        <div className="flex justify-end">
                                            <button onClick={stopCamera} className="p-2 bg-black/50 rounded-full text-white"><X /></button>
                                        </div>
                                        <div className="flex justify-center">
                                            <button
                                                onClick={captureImage}
                                                className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all"
                                            >
                                                <div className="w-12 h-12 bg-[#FFD700] rounded-full" />
                                            </button>
                                        </div>
                                    </div>
                                    {/* Scanning Grid overlay */}
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                                </motion.div>
                            )}

                            {/* ANALYZING STATE */}
                            {status === "analyzing" && (
                                <motion.div
                                    key="analyzing"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden"
                                >
                                    {imageSrc && <img src={imageSrc} alt="Analyzing" className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm" />}
                                    <div className="z-10 flex flex-col items-center">
                                        <div className="relative w-24 h-24 mb-6">
                                            <div className="absolute inset-0 border-t-4 border-[#FFD700] rounded-full animate-spin" />
                                            <div className="absolute inset-2 border-r-4 border-white/20 rounded-full animate-spin direction-reverse" />
                                            <Loader2 className="absolute inset-0 m-auto w-10 h-10 text-[#FFD700] animate-pulse" />
                                        </div>
                                        <h2 className="text-xl font-bold text-white uppercase tracking-widest animate-pulse">{t.processing}</h2>
                                        <p className="text-neutral-500 text-xs mt-2 font-mono">{t.runningModel}</p>
                                    </div>
                                    {/* Scan Line */}
                                    <motion.div
                                        animate={{ top: ["0%", "100%"] }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                        className="absolute left-0 right-0 h-1 bg-[#FFD700] shadow-[0_0_20px_#FFD700]"
                                    />
                                </motion.div>
                            )}

                            {/* RESULT STATE */}
                            {status === "result" && result && (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                    className="flex-1 flex flex-col p-6 bg-neutral-900/90 backdrop-blur-md"
                                >
                                    <div className="flex-1 flex flex-col items-center text-center space-y-4">
                                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-2 ${result.recyclable ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                            {result.recyclable ? <CheckCircle className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
                                        </div>

                                        <div>
                                            <h2 className="text-3xl font-black text-white uppercase leading-none mb-1">{result.label}</h2>
                                            <p className="text-neutral-400 text-sm">{result.material}</p>
                                        </div>

                                        {/* Confidence Score Badge */}
                                        <div className="flex items-center gap-2 px-3 py-1 bg-neutral-800 rounded-full border border-neutral-700">
                                            <div className="text-[10px] uppercase text-neutral-400 font-bold">AI Confidence</div>
                                            <div className={`text-xs font-bold ${result.confidence_score > 80 ? 'text-green-500' : result.confidence_score > 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                                                {result.confidence_score}%
                                            </div>
                                        </div>

                                        <div className="w-full bg-black/40 rounded-xl p-4 border border-white/10 text-left space-y-2">

                                            {result.recyclable ? (
                                                <>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500 text-xs uppercase">{t.estValue}</span>
                                                        <span className="text-[#FFD700] font-bold">+{result.estimated_credit} {t.credits}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500 text-xs uppercase">{t.impact}</span>
                                                        <span className="text-green-500 font-bold">{result.sustainability_score}/10 {t.score}</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex justify-between text-red-400">
                                                    <span className="text-xs uppercase font-bold">Status</span>
                                                    <span className="font-bold">REJECTED</span>
                                                </div>
                                            )}

                                            <div className="pt-2 border-t border-white/5">
                                                <p className="text-gray-400 text-xs italic">
                                                    <span className="text-neutral-500 font-bold not-italic mr-1">Analysis:</span>
                                                    "{result.reasoning}"
                                                </p>
                                            </div>
                                        </div>

                                        {/* Confirmation Message */}
                                        {result.recyclable && !hasDeposited && (
                                            <div className="text-xs text-center text-neutral-400 mt-2">
                                                <p className="mb-1">Deposit this item to claim rewards?</p>
                                                <p className="text-neutral-500">Credited to: <span className="text-white font-mono">{session?.user?.email || "..."}</span></p>
                                            </div>
                                        )}
                                        {hasDeposited && (
                                            <div className="text-green-500 font-bold text-sm animate-pulse">
                                                Item Deposited Successfully!
                                            </div>
                                        )}
                                    </div>

                                    {!hasDeposited ? (
                                        <button
                                            onClick={result.recyclable ? handleConfirmDeposit : () => setStatus("idle")}
                                            className={`mt-6 w-full py-4 font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer ${result.recyclable ? "bg-green-500 text-black hover:bg-green-400" : "bg-neutral-700 text-white hover:bg-neutral-600"}`}
                                        >
                                            {result.recyclable ? "Confirm Deposit" : "Cancel"}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setStatus("idle")}
                                            className="mt-6 w-full py-4 bg-[#FFD700] text-black font-black uppercase tracking-wider rounded-xl hover:bg-yellow-300 transition-colors cursor-pointer"
                                        >
                                            {t.nextItem}
                                        </button>
                                    )}
                                </motion.div>
                            )}

                            {/* ERROR STATE */}
                            {status === "error" && (
                                <motion.div
                                    key="error"
                                    className="flex-1 flex flex-col items-center justify-center p-6 text-center"
                                >
                                    <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                                    <h3 className="text-xl font-bold text-white">{t.detectionFailed}</h3>
                                    <p className="text-gray-500 mb-6">Could not identify the item clearly.</p>
                                    <button onClick={() => setStatus("idle")} className="px-6 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10">{t.tryAgain}</button>
                                </motion.div>
                            )}

                        </AnimatePresence>

                        {/* Scheduling Overlay */}
                        <AnimatePresence>
                            {showSchedule && <SchedulePickup onClose={() => setShowSchedule(false)} />}
                        </AnimatePresence>
                    </div>

                    {/* Physical Gate Simulation (Bottom of screen) */}
                    <div className="mt-6 h-16 bg-black rounded-lg border-t-2 border-neutral-700 relative overflow-hidden flex items-center justify-center">
                        <motion.div
                            animate={{ height: status === 'result' ? 0 : '100%' }}
                            className="absolute top-0 w-full bg-[#1a1a1a] z-10 border-b border-neutral-600 flex items-center justify-center"
                        >
                            <div className="w-12 h-1 bg-neutral-700 rounded-full" />
                        </motion.div>
                        <span className="text-xs font-bold text-[#FFD700] uppercase tracking-widest animate-pulse">{t.depositOpen}</span>
                    </div>

                </div>

                {/* 3. Footer Plate */}
                <div className="bg-[#FFD700] p-4 flex justify-between items-center text-black/60 font-bold text-[10px] uppercase">
                    <span>Punarchakra Heavy Industries</span>
                    <div className="flex gap-2">
                        <span>{t.systemReady}</span>
                    </div>
                </div>
            </div>

            {/* Animation for scan line - handled by framer-motion above */}
        </div>
    );
}
