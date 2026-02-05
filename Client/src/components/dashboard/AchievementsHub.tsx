"use client";

import { useRef, useState } from "react";
import { Download, Loader2, Award, Lock, CheckCircle2, CircuitBoard } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useSession } from "@/hooks/useSession";
import { QRCodeCanvas } from "qrcode.react";

const MILESTONES = [
    { id: 'starter', title: 'Eco Starter', points: 10, co2: '1kg', description: 'For taking the first step towards a greener future.', color: 'text-emerald-500' },
    { id: 'bronze', title: 'Carbon Crusher', points: 250, co2: '25kg', description: 'For significantly reducing carbon footprint.', color: 'text-orange-500' },
    { id: 'silver', title: 'Waste Warrior', points: 500, co2: '50kg', description: 'Half a ton of impact! A true guardian of nature.', color: 'text-gray-400' },
    { id: 'gold', title: 'Planet Savior', points: 1000, co2: '100kg', description: 'Legendary status. Your impact is monumental.', color: 'text-yellow-500' }
];

export function AchievementsHub() {
    const { user } = useSession();
    const [loading, setLoading] = useState<string | null>(null);
    const certificateRef = useRef<HTMLDivElement>(null);
    const [selectedCert, setSelectedCert] = useState<typeof MILESTONES[0] | null>(null);

    const isUnlocked = (milestonePoints: number) => (user?.points || 0) >= milestonePoints;

    const generatePDF = async (milestone: typeof MILESTONES[0]) => {
        setSelectedCert(milestone);
        setLoading(milestone.id);

        setTimeout(async () => {
            if (!certificateRef.current) return;

            try {
                // Ensure fonts are loaded/rendering
                await document.fonts.ready;

                const canvas = await html2canvas(certificateRef.current, {
                    scale: 2, // High resolution
                    backgroundColor: "#ffffff",
                    useCORS: true,
                    logging: false,
                    onclone: (clonedDoc) => {
                        // Fix for some font rendering issues in clone
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
        }, 500); // 500ms delay to ensure QR code renders
    };

    return (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 h-full flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                    <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">Achievements & Certificates</h3>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                {MILESTONES.map((milestone) => {
                    const unlocked = isUnlocked(milestone.points);

                    return (
                        <div
                            key={milestone.id}
                            className={`p-4 rounded-xl border transition-all ${unlocked
                                ? "bg-white dark:bg-neutral-800 border-gray-100 dark:border-gray-700 shadow-sm"
                                : "bg-gray-50 dark:bg-neutral-900/50 border-gray-100 dark:border-gray-800 opacity-70"
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${unlocked ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" : "bg-gray-200 dark:bg-gray-800 text-gray-400"}`}>
                                        {unlocked ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h4 className={`font-bold ${unlocked ? "text-gray-900 dark:text-white" : "text-gray-500"}`}>
                                            {milestone.title}
                                        </h4>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                            {milestone.points} Points / Saves {milestone.co2} CO₂
                                        </p>
                                    </div>
                                </div>
                                {unlocked && (
                                    <button
                                        onClick={() => generatePDF(milestone)}
                                        disabled={loading === milestone.id}
                                        className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors flex items-center gap-1 cursor-pointer"
                                    >
                                        {loading === milestone.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                                        PDF
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 pl-12">
                                {milestone.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* --- HIDDEN DYNAMIC CERTIFICATE TEMPLATE (V5: Modern Tech) --- */}
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
