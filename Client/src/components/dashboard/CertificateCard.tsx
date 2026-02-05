"use client";

import { useRef, useState } from "react";
import { Download, Loader2, Award, Leaf } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useSession } from "@/hooks/useSession";

export function CertificateCard() {
    const { user } = useSession();
    const [loading, setLoading] = useState(false);
    const certificateRef = useRef<HTMLDivElement>(null);

    const generatePDF = async () => {
        if (!certificateRef.current) return;
        setLoading(true);

        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2, // High resolution
                backgroundColor: "#fff",
                useCORS: true
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "px",
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
            pdf.save("Punarchakra-Eco-Certificate.pdf");
        } catch (error) {
            console.error("Certificate generation failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 h-full flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                    <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">Your Impact Certificate</h3>
            </div>

            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex-1">
                Download your official "Green Warrior" certificate for your contribution to saving the environment.
            </p>

            <button
                onClick={generatePDF}
                disabled={loading}
                className="w-full py-3 border border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                Download PDF
            </button>

            {/* --- HIDDEN CERTIFICATE TEMPLATE --- */}
            {/* This part is rendered off-screen but captured by html2canvas */}
            <div className="fixed top-[-9999px] left-[-9999px]">
                <div
                    ref={certificateRef}
                    className="w-[800px] h-[600px] bg-white relative flex flex-col items-center justify-center text-center p-12 border-[20px] border-double border-emerald-800"
                    style={{ fontFamily: "serif" }}
                >
                    {/* Watermark Logo */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                        <img src="/logo.svg" alt="" className="w-[400px] h-[400px]" />
                    </div>

                    {/* Header */}
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="mb-4">
                            <img src="/logo.svg" alt="Punarchakra" className="w-20 h-20" />
                        </div>
                        <h1 className="text-6xl font-bold text-emerald-900 mb-2 uppercase tracking-widest">Certificate</h1>
                        <h2 className="text-2xl font-light text-emerald-700 mb-12 uppercase tracking-widest">of Environmental Stewardship</h2>

                        <p className="text-xl text-gray-600 mb-4 italic">This certifies that</p>

                        <h3 className="text-5xl font-bold text-gray-900 mb-2 border-b-2 border-emerald-500 pb-2 px-12 inline-block font-sans">
                            {user?.name || "Eco Warrior"}
                        </h3>

                        <p className="text-lg text-gray-600 mt-8 max-w-2xl leading-relaxed">
                            Has successfully contributed to saving the environment by responsibly disposing and recycling electronic waste through <strong>Punarchakra</strong>.
                        </p>

                        <div className="mt-16 w-full flex justify-between items-end px-12">
                            <div className="text-center">
                                <p className="text-lg font-bold text-gray-900 border-t border-gray-400 pt-2 px-8">Punarchakra Team</p>
                                <p className="text-xs text-gray-500 uppercase mt-1">Authorized Signature</p>
                            </div>

                            <div className="border-4 border-emerald-600 p-2 rounded-lg">
                                {/* Simple QR placeholder */}
                                <div className="w-20 h-20 bg-emerald-900 flex items-center justify-center text-white text-xs font-bold text-center">
                                    VALID<br />CERT
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-lg font-bold text-gray-900 border-t border-gray-400 pt-2 px-8">
                                    {new Date().toLocaleDateString()}
                                </p>
                                <p className="text-xs text-gray-500 uppercase mt-1">Date</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
