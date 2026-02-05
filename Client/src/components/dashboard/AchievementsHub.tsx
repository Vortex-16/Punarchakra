"use client";

import { useRef, useState } from "react";
import { Download, Loader2, Award, Lock, CheckCircle2, Share2, Trophy, Star } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useSession } from "@/hooks/useSession";
import { QRCodeCanvas } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";

const MILESTONES = [
    { id: 'starter', title: 'Eco Starter', points: 10, co2: '1kg', description: 'For taking the first step towards a greener future.', color: 'from-emerald-400 to-green-500', icon: Star },
    { id: 'bronze', title: 'Carbon Crusher', points: 250, co2: '25kg', description: 'For significantly reducing carbon footprint.', color: 'from-orange-400 to-amber-600', icon: Award },
    { id: 'silver', title: 'Waste Warrior', points: 500, co2: '50kg', description: 'Half a ton of impact! A true guardian of nature.', color: 'from-gray-300 to-slate-500', icon: Trophy },
    { id: 'gold', title: 'Planet Savior', points: 1000, co2: '100kg', description: 'Legendary status. Your impact is monumental.', color: 'from-yellow-300 to-yellow-600', icon: Trophy }
];

export function AchievementsHub() {
    const { user } = useSession();
    const [loading, setLoading] = useState<string | null>(null);
    const certificateRef = useRef<HTMLDivElement>(null);
    const [selectedCert, setSelectedCert] = useState<typeof MILESTONES[0] | null>(null);

    const isUnlocked = (milestonePoints: number) => (user?.points || 0) >= milestonePoints;

    const handleShare = async (milestone: typeof MILESTONES[0]) => {
        const shareData = {
            title: 'Punarchakra Achievement Unlocked!',
            text: `I just unlocked the "${milestone.title}" achievement on Punarchakra! I've saved ${milestone.co2} of CO2. Join me in recycling e-waste!`,
            url: 'https://punarchakra.com'
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback for browsers that don't support Web Share API
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
                window.open(twitterUrl, '_blank');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    const generatePDF = async (milestone: typeof MILESTONES[0]) => {
        setSelectedCert(milestone);
        setLoading(milestone.id);

        setTimeout(async () => {
            if (!certificateRef.current) return;

            try {
                await document.fonts.ready;

                const canvas = await html2canvas(certificateRef.current, {
                    scale: 2,
                    backgroundColor: "#ffffff",
                    useCORS: true,
                    logging: false,
                    onclone: (clonedDoc) => {
                        const element = clonedDoc.querySelector('.certificate-container') as HTMLElement;
                        if (element) {
                            element.style.fontFeatureSettings = '"liga" 0';
                        }
                    }
                });

                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF({
                    orientation: "landscape",
                    unit: "px",
                    format: [canvas.width, canvas.height]
                });

                pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
                pdf.save(`Punarchakra-${milestone.title}.pdf`);
            } catch (error) {
                console.error("Certificate generation failed:", error);
            } finally {
                setLoading(null);
                setSelectedCert(null);
            }
        }, 500);
    };

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 h-full flex flex-col relative group overflow-hidden p-6">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-white dark:from-purple-900/20 dark:via-pink-900/10 dark:to-black transition-colors duration-500" />

            {/* Header */}
            <div className="relative z-10 flex items-center gap-3 mb-6">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-purple-600 dark:text-purple-300 shadow-sm backdrop-blur-sm border border-white/20">
                    <Award className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Achievements</h3>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                        Your Eco Milestones
                    </p>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="relative z-10 flex-1 overflow-y-auto space-y-4 custom-scrollbar max-h-[300px] pr-2">
                <AnimatePresence>
                    {MILESTONES.map((milestone, index) => {
                        const unlocked = isUnlocked(milestone.points);
                        const Icon = milestone.icon as any; // Quick fix for icon type

                        return (
                            <motion.div
                                key={milestone.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative p-0.5 rounded-2xl transition-all duration-300 ${unlocked
                                    ? "bg-gradient-to-r " + milestone.color + " shadow-sm"
                                    : "bg-gray-100 dark:bg-white/5 opacity-70"
                                    }`}
                            >
                                <div className={`h-full w-full p-4 rounded-[14px] flex flex-col gap-3 ${unlocked
                                    ? "bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl"
                                    : "bg-gray-50 dark:bg-neutral-900/50"
                                    }`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ring-2 ring-offset-2 dark:ring-offset-neutral-900 ${unlocked
                                                ? `bg-gradient-to-br ${milestone.color} text-white ring-transparent shadow-md`
                                                : "bg-gray-200 dark:bg-white/5 text-gray-400 ring-transparent"
                                                }`}>
                                                {unlocked ? <Icon className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <h4 className={`font-bold text-sm ${unlocked ? "text-gray-900 dark:text-white" : "text-gray-500"}`}>
                                                    {milestone.title}
                                                </h4>
                                                <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                                                    {milestone.points} pts • {milestone.co2} CO₂
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                        {milestone.description}
                                    </p>

                                    {unlocked && (
                                        <div className="flex items-center gap-2 mt-1 pt-3 border-t border-gray-100 dark:border-white/5">
                                            <button
                                                onClick={() => generatePDF(milestone)}
                                                disabled={loading === milestone.id}
                                                className="flex-1 text-xs bg-gray-50 dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 py-1.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 group/btn"
                                            >
                                                {loading === milestone.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />}
                                                Certificate
                                            </button>
                                            <button
                                                onClick={() => handleShare(milestone)}
                                                className="text-xs bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-1.5 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 group/share"
                                            >
                                                <Share2 className="w-3.5 h-3.5 group-hover/share:rotate-12 transition-transform" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* --- HIDDEN DYNAMIC CERTIFICATE TEMPLATE --- */}
            {selectedCert && (
                <div className="fixed top-[-9999px] left-[-9999px] z-[-100]">
                    <div
                        ref={certificateRef}
                        className="certificate-container relative flex flex-col items-center justify-between"
                        style={{
                            width: "800px",
                            height: "600px",
                            padding: "60px",
                            backgroundColor: "#ffffff",
                            fontFamily: "'Inter', sans-serif",
                            boxSizing: "border-box"
                        }}
                    >
                        {/* DECORATIVE BACKGROUND ELEMENTS (Safe for PDF) */}
                        {/* Top Right Accent */}
                        <div style={{ position: "absolute", top: 0, right: 0, width: "250px", height: "250px", background: "linear-gradient(to bottom left, #ecfdf5 0%, transparent 70%)", zIndex: 0 }}></div>
                        {/* Bottom Left Accent */}
                        <div style={{ position: "absolute", bottom: 0, left: 0, width: "300px", height: "150px", background: "#f0fdf4", zIndex: 0, borderTopRightRadius: "100%" }}></div>

                        {/* Border Frame */}
                        <div style={{ position: "absolute", inset: "20px", border: "2px solid #1f2937", zIndex: 1, pointerEvents: "none" }}></div>
                        {/* Corners */}
                        <div style={{ position: "absolute", top: "20px", left: "20px", width: "40px", height: "40px", borderTop: "8px solid #10b981", borderLeft: "8px solid #10b981", zIndex: 2 }}></div>
                        <div style={{ position: "absolute", bottom: "20px", right: "20px", width: "40px", height: "40px", borderBottom: "8px solid #10b981", borderRight: "8px solid #10b981", zIndex: 2 }}></div>


                        {/* --- CONTENT --- */}
                        <div style={{ position: "relative", zIndex: 10, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

                            {/* Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div style={{ backgroundColor: "#10b981", padding: "8px", borderRadius: "8px" }}>
                                        <Award size={32} color="#ffffff" />
                                    </div>
                                    <div>
                                        <h1 style={{ fontSize: "24px", fontWeight: "900", color: "#111827", textTransform: "uppercase", letterSpacing: "1px", lineHeight: 1 }}>Punarchakra</h1>
                                        <p style={{ fontSize: "10px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "2px" }}>Smart Recognition</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <p style={{ fontSize: "12px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase" }}>Certificate ID</p>
                                    <p style={{ fontSize: "14px", color: "#111827", fontWeight: "700", fontFamily: "monospace" }}>{user?._id?.substring(0, 8).toUpperCase() || "PC-8X92"}</p>
                                </div>
                            </div>

                            {/* Main Title & User */}
                            <div style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#10b981", textTransform: "uppercase", letterSpacing: "4px", marginBottom: "10px" }}>Certificate of Environmental Excellence</h2>
                                <h3 style={{ fontSize: "64px", fontWeight: "900", color: "#111827", lineHeight: "1.1", marginBottom: "20px", textTransform: "uppercase" }}>
                                    {user?.name || "Valued User"}
                                </h3>
                                <div style={{ width: "100px", height: "4px", backgroundColor: "#10b981", marginBottom: "30px" }}></div>
                                <p style={{ fontSize: "18px", color: "#374151", maxWidth: "600px", lineHeight: "1.6" }}>
                                    For demonstrating outstanding commitment to sustainability by achieving the <span style={{ fontWeight: "800", color: "#059669" }}>{selectedCert.title}</span> milestone.
                                </p>
                                <p style={{ fontSize: "16px", color: "#6b7280", marginTop: "10px" }}>
                                    Total Carbon Impact Offset: <span style={{ fontWeight: "bold", color: "#111827" }}>{selectedCert.co2}</span>
                                </p>
                            </div>

                            {/* Footer / Auth */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>

                                {/* Real QR Code */}
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                                    <div style={{ padding: "5px", border: "1px solid #e5e7eb", borderRadius: "5px", background: "white" }}>
                                        <QRCodeCanvas
                                            value={`https://punarchakra.com/verify/${user?._id}?cert=${selectedCert.id}`}
                                            size={80}
                                            fgColor="#111827" // dark gray
                                            bgColor="#ffffff"
                                            level={"H"} // High error correction
                                        />
                                    </div>
                                    <p style={{ fontSize: "9px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px" }}>Scan to Verify</p>
                                </div>

                                {/* Signature */}
                                <div style={{ textAlign: "right" }}>
                                    {/* Using a script font here for signature, simple generic cursive if google fonts fail */}
                                    <div style={{ fontFamily: "cursive", fontSize: "32px", color: "#111827", marginBottom: "5px" }}>Punarchakra Team</div>
                                    <div style={{ height: "1px", width: "200px", backgroundColor: "#111827", marginBottom: "5px", marginLeft: "auto" }}></div>
                                    <p style={{ fontSize: "10px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "2px" }}>Authorized Signature</p>
                                    <p style={{ fontSize: "12px", color: "#111827", fontWeight: "600", marginTop: "5px" }}>
                                        {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
