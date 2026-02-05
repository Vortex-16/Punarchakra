"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { CameraInput } from '@/components/waste-detection/CameraInput';
import { AnalysisOverlay } from '@/components/waste-detection/AnalysisOverlay';
import { ResultCard } from '@/components/waste-detection/ResultCard';
import { VerificationModal } from '@/components/waste-detection/VerificationModal';
import { useWasteDetection } from '@/hooks/useWasteDetection';
import { ModeToggle } from "@/components/mode-toggle";

export default function WasteDetectionPage() {
  const { status, result, startDetection, resetDetection } = useWasteDetection();
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);

  const handleCapture = (file: File, additionalInfo?: { weight?: string; size?: string }) => {
    startDetection(file, additionalInfo);
  };

  const handleManualVerification = (item: string) => {
    console.log("Verified as:", item);
    setIsVerificationOpen(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors relative overflow-hidden flex flex-col">

      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />



      {/* Header */}
      <header className="p-6 flex items-center justify-end relative z-10 gap-3">
        <ModeToggle />
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-800">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">AI Powered Scanner</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 max-w-4xl mx-auto w-full">

        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="camera-input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              className="w-full flex flex-col items-center"
            >
              <div className="text-center mb-10 max-w-lg">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                  Scan. Detect. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Recycle.</span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Point your camera at any e-waste to instantly identify its value and environmental impact.
                </p>
              </div>
              <CameraInput onCapture={handleCapture} isScanning={status !== 'idle'} />
            </motion.div>
          )}

          {(status === 'scanning' || status === 'analyzing') && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex items-center justify-center"
            >
              <AnalysisOverlay status={status} />
            </motion.div>
          )}

          {(status === 'success' && result) && (
            <motion.div
              key="result"
              className="w-full max-w-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <ResultCard
                result={result}
                onReset={resetDetection}
                onVerification={() => setIsVerificationOpen(true)}
              />
            </motion.div>
          )}

          {status === 'error' && (
             <motion.div
               key="error"
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-red-50 dark:bg-red-900/20 p-8 rounded-3xl text-center max-w-md border border-red-100 dark:border-red-900/50"
             >
               <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                  <Sparkles className="w-8 h-8 rotate-45" /> 
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Detection Failed</h3>
               <p className="text-gray-500 dark:text-gray-400 mb-6">
                 We couldn't identify the item. Please ensure the image is clear and centered.
               </p>
               <button
                 onClick={resetDetection}
                 className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 transition-all flex items-center gap-2 mx-auto"
               >
                 Try Again
               </button>
             </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Footer / Status */}
      <div className="p-6 text-center z-10">
        <p className="text-xs text-gray-400 dark:text-gray-600">Powered by Punarchakra AI Vision Model v2.4</p>
      </div>

      <VerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        onSelect={handleManualVerification}
      />
    </div>
  );
}
