"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, X, Download, Navigation, Smartphone } from "lucide-react";
import Link from "next/link";
import { Bin } from "@/lib/bin-data";

interface BinQRCodeProps {
    bin: Bin;
}

export default function BinQRCode({ bin }: BinQRCodeProps) {
    const [showQR, setShowQR] = useState(false);

    // Create bin data URL for QR code
    const binDataUrl = `${window.location.origin}/smart-bin?binId=${bin.id}`;

    const downloadQR = () => {
        const svg = document.getElementById(`qr-${bin.id}`);
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");

            const downloadLink = document.createElement("a");
            downloadLink.download = `bin-${bin.id}-qr.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    const handleNavigate = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${bin.location.lat},${bin.location.lng}`;
        window.open(url, "_blank");
    };

    if (!showQR) {
        return (
            <button
                onClick={() => setShowQR(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
            >
                <QrCode className="w-4 h-4" />
                QR Code
            </button>
        );
    }

    return (
        <>
            {/* Modal Overlay */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] flex items-center justify-center p-4"
                onClick={() => setShowQR(false)}
            >
                <div
                    className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Bin QR Code</h3>
                        <button
                            onClick={() => setShowQR(false)}
                            className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>

                    {/* Bin Info */}
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{bin.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{bin.location.address}</p>
                    </div>

                    {/* QR Code */}
                    <div className="flex justify-center p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 mb-4">
                        <QRCodeSVG
                            id={`qr-${bin.id}`}
                            value={binDataUrl}
                            size={200}
                            level="H"
                            includeMargin
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={handleNavigate}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Navigation className="w-4 h-4" />
                            Navigate Here
                        </button>
                        <Link
                            href={`/smart-bin?binId=${bin.id}`}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-forest-green text-white rounded-lg font-semibold hover:bg-forest-green/90 transition-colors"
                        >
                            <Smartphone className="w-4 h-4" />
                            Check In to Bin
                        </Link>
                        <div className="flex gap-2">
                            <button
                                onClick={downloadQR}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </button>
                            <button
                                onClick={() => setShowQR(false)}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>

                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                        Scan to check in or view bin details
                    </p>
                </div>
            </div>
        </>
    );
}
