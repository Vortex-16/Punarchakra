import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, RefreshCw, DollarSign, Box, Star, Info } from 'lucide-react';
import { DetectionResult } from '@/hooks/useWasteDetection';

interface ResultCardProps {
  result: DetectionResult;
  onReset: () => void;
  onVerification?: () => void;
}

export function ResultCard({ result, onReset, onVerification }: ResultCardProps) {
  // Determine color theme based on category or value
  const isHighValue = result.value > 50;
  const isEwaste = result.category === 'electronic' || result.category === 'battery';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700 w-full relative overflow-hidden"
    >
      {/* Dynamic Background Gradient */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none ${isEwaste ? 'bg-emerald-500' : 'bg-blue-500'}`} />

      <div className="relative z-10">

        {/* Header Section */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${isEwaste ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'} flex items-center justify-center`}>
              {result.confidence < 0.6 ? <AlertCircle className="w-7 h-7 text-amber-500" /> : <CheckCircle className="w-7 h-7" />}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {result.confidence < 0.6 ? "Low Confidence" : "Analysis Complete"}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">AI Confidence:</span>
                <div className={`px-2 py-0.5 rounded-md text-xs font-bold ${result.confidence < 0.6 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"}`}>
                  {(result.confidence * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Total Credit</p>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
              <span className="text-lg text-emerald-600/60">$</span>
              {result.value.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="p-5 bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-2">
              <Box className="w-3.5 h-3.5" /> Identified Item
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{result.item}</p>
            <p className="text-xs text-emerald-500 font-bold mt-1 uppercase tracking-wide bg-emerald-50 dark:bg-emerald-900/20 w-fit px-2 py-1 rounded md:mt-2">
              {result.category}
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-2">
              <Star className="w-3.5 h-3.5" /> Sustainability Impact
            </p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">High</span>
              <span className="text-sm text-gray-500 mb-1">Priority</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 mt-3 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[85%] rounded-full" />
            </div>
          </div>
        </div>

        {/* AI Insight / Transparency */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-5 rounded-2xl mb-8 border border-blue-100 dark:border-blue-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Info className="w-24 h-24 text-blue-500" />
          </div>
          <p className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Why this result?
          </p>
          <div className="relative z-10 space-y-2">
            <p className="text-sm text-blue-700/80 dark:text-blue-200/80 leading-relaxed italic border-l-2 border-blue-400 pl-3">
              "{result.message}"
            </p>
            <div className="flex gap-2 text-[10px] uppercase font-bold tracking-wider text-blue-600/50 dark:text-blue-400/50 mt-2">
              <span>• Visual Analysis</span>
              <span>• Material Matching</span>
              {result.value > 0 && <span>• Market Value</span>}
            </div>
          </div>
        </div>

        {/* Handling Instructions (Education/Guidance) */}
        {result.instruction && (
          <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-2xl mb-8 border border-emerald-100 dark:border-emerald-900/20">
            <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Handling Guide
            </p>
            <p className="text-sm text-emerald-700/80 dark:text-emerald-200/80 font-medium">
              {result.instruction}
            </p>
          </div>
        )}

        {/* Celebration Effect for High Value */}
        {isHighValue && result.confidence > 0.8 && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
            {/* Simple CSS Confetti placeholder - ideally use a library but avoiding deps */}
            <div className="absolute top-[-20px] left-[20%] w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-100"></div>
            <div className="absolute top-[-20px] left-[50%] w-3 h-3 bg-red-400 rounded-md animate-bounce delay-300"></div>
            <div className="absolute top-[-20px] left-[80%] w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-500"></div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onReset}
            className="flex-1 px-6 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Scan Another Item
          </button>
          {onVerification && (
            <button
              onClick={onVerification}
              className={`px-6 py-4 rounded-xl font-bold transition-colors flex items-center gap-2 justify-center ${result.confidence < 0.6
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-200 dark:hover:bg-amber-900/60"
                : "bg-transparent border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                }`}
            >
              <AlertCircle className="w-4 h-4" />
              {result.confidence < 0.6 ? "Verify Manually" : "Report Issue"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Icon helper
function Sparkles({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  )
}
