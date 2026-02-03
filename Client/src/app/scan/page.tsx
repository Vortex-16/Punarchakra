"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { CameraInput } from '@/components/waste-detection/CameraInput';
import { AnalysisOverlay } from '@/components/waste-detection/AnalysisOverlay';
import { ResultCard } from '@/components/waste-detection/ResultCard';
import { VerificationModal } from '@/components/waste-detection/VerificationModal';
import { useWasteDetection } from '@/hooks/useWasteDetection';

export default function WasteDetectionPage() {
  const { status, result, startDetection, resetDetection } = useWasteDetection();
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);

  const handleCapture = (file: File) => {
    startDetection(file);
  };

  const handleManualVerification = (item: string) => {
    // In a real app, we would update the result with the verified item
    // For now, we'll just log it or maybe update a local state if we had one for the result
    // But since 'result' comes from the hook, we might need a way to override it in the hook
    // For this demo, let's just close the modal and maybe show a toast or alert
    console.log("Verified as:", item);
    setIsVerificationOpen(false);
    alert(`Thank you! We've updated the detection to: ${item}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors p-4 md:p-8">
      {/* Header */}
      {/* Header removed */}
      <div className="pt-8" />

      <main className="max-w-xl mx-auto relative min-h-[600px] flex flex-col items-center justify-center">

        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="camera-input"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  What are you recycling?
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Our AI will analyze your item to determine its value and proper disposal method.
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
              className="absolute inset-0 z-20"
            >
              <AnalysisOverlay status={status} />
            </motion.div>
          )}

          {(status === 'success' && result) && (
            <motion.div
              key="result"
              className="w-full z-10"
            >
              <ResultCard
                result={result}
                onReset={resetDetection}
                onVerification={() => setIsVerificationOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <VerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        onSelect={handleManualVerification}
      />
    </div>
  );
}
