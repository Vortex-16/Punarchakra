import { motion } from 'framer-motion';
import { Scan, Cpu, Loader2, Sparkles } from 'lucide-react';

interface AnalysisOverlayProps {
  status: 'scanning' | 'analyzing' | 'idle' | 'success' | 'error';
}

export function AnalysisOverlay({ status }: AnalysisOverlayProps) {
  if (status === 'idle' || status === 'success' || status === 'error') return null;

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md rounded-3xl overflow-hidden">
      <div className="relative">
        {/* Scanning Grid Effect */}
        {status === 'scanning' && (
          <div className="absolute inset-[-100px] z-0 opacity-20">
            <motion.div
              className="w-full h-[5px] bg-emerald-500 shadow-[0_0_50px_rgba(16,185,129,1)]"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <div className="w-full h-full bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>
        )}

        {/* Central visual */}
        <div className="relative z-10 w-32 h-32 flex items-center justify-center">
          {/* Pulsing rings */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-emerald-500/30"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-emerald-500/30"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />

          <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-700 shadow-2xl relative z-20 overflow-hidden">
            {/* Inner glow */}
            <div className="absolute inset-0 bg-emerald-500/10 blur-lg" />

            {status === 'scanning' ? (
              <Scan className="w-10 h-10 text-emerald-500 animate-pulse relative z-10" />
            ) : (
              <Sparkles className="w-10 h-10 text-blue-400 relative z-10 animate-spin-slow" />
            )}
          </div>
        </div>
      </div>

      <motion.div
        key={status}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 text-center relative z-20 max-w-xs"
      >
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-400 mb-2 flex items-center justify-center gap-2">
          {status === 'scanning' ? 'Scanning Object...' : 'Processing AI Model'}
          {status === 'analyzing' && <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />}
        </h3>
        <div className="text-white/70 text-sm font-mono space-y-1">
          {status === 'scanning' ? (
             <>
                <p className="animate-pulse">Locating boundaries...</p>
                <p className="opacity-50">Measuring volume...</p>
             </>
          ) : (
             <>
                <p className="text-emerald-400">Analysis complete.</p>
                <p className="animate-pulse">Matching database...</p>
                <p className="opacity-50">Estimating carbon footprint...</p>
             </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
