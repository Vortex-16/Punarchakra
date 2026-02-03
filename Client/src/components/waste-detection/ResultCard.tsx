import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, RefreshCw, DollarSign, Box } from 'lucide-react';
import { DetectionResult } from '@/hooks/useWasteDetection';

interface ResultCardProps {
  result: DetectionResult;
  onReset: () => void;
  onVerification?: () => void;
}

export function ResultCard({ result, onReset, onVerification }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="bg-white dark:bg-gray-900 rounded-[2rem] rounded-tr-[5rem] p-8 shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-md mx-auto relative overflow-hidden"
    >
      {/* Confetti Background Effect (Simplified CSS/SVG) */}
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <CheckCircle className="w-32 h-32 text-forest-green" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-forest-green/10 flex items-center justify-center text-forest-green">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Detection Complete</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Confidence: {(result.confidence * 100).toFixed(0)}%</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
              <Box className="w-3 h-3" /> Detected Item
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">{result.item}</p>
            <p className="text-xs text-forest-green mt-1 capitalize">{result.category}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> Est. Value
            </p>
            <p className="font-bold text-2xl text-gray-900 dark:text-white">${result.value.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-1">based on condition</p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-6">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Found interesting details: <span className="italic">"{result.message}"</span>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Scan Another
          </button>
          {onVerification && (
            <button
              onClick={onVerification}
              className="px-4 py-2.5 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-sm font-medium transition-colors flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              Wrong?
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
