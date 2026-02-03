import { motion } from 'framer-motion';
import { Scan, Cpu } from 'lucide-react';

interface AnalysisOverlayProps {
  status: 'scanning' | 'analyzing' | 'idle' | 'success' | 'error';
}

export function AnalysisOverlay({ status }: AnalysisOverlayProps) {
  if (status === 'idle' || status === 'success' || status === 'error') return null;

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl overflow-hidden">
      <div className="relative">
        {/* Scanning Line */}
        {status === 'scanning' && (
          <motion.div
            className="absolute -left-1/2 w-[200%] h-1 bg-gradient-to-r from-transparent via-forest-green to-transparent shadow-[0_0_20px_rgba(57,255,20,0.5)]"
            animate={{
              top: ['0%', '100%', '0%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}

        {/* Center Icon */}
        <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-700 shadow-2xl relative z-20">
            {status === 'scanning' ? (
                <Scan className="w-10 h-10 text-forest-green animate-pulse" />
            ) : (
                <Cpu className="w-10 h-10 text-blue-500 animate-pulse" />
            )}
        </div>
        
        {/* Ripple Effect */}
         <motion.div
            className="absolute top-0 left-0 w-20 h-20 rounded-2xl bg-forest-green/20 z-10"
            animate={{
                scale: [1, 1.5, 2],
                opacity: [0.5, 0.2, 0]
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut"
            }}
         />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={status} // Animate on status change
        className="mt-6 text-white font-medium text-lg tracking-wide"
      >
        {status === 'scanning' ? 'Scanning object...' : 'Analyzing composition...'}
      </motion.p>
      
      <p className="mt-2 text-white/50 text-sm">
        {status === 'scanning' ? 'Identifying shape and dimensions' : 'Estimating value and material'}
      </p>
    </div>
  );
}
