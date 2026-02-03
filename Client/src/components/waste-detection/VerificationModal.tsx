import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: string) => void;
}

const COMMON_ITEMS = [
  'Smartphone', 'Laptop', 'Tablet', 'Smart Watch',
  'Keyboard', 'Mouse', 'Monitor', 'Printer',
  'Headphones', 'Speaker', 'Camera', 'Console'
];

export function VerificationModal({ isOpen, onClose, onSelect }: VerificationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]"
        >
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Verify Item</h3>
            <button onClick={onClose} className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
             <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                 <input 
                    type="text" 
                    placeholder="Search for item..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-forest-green"
                    autoFocus
                 />
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
             <div className="grid grid-cols-2 gap-2">
                 {COMMON_ITEMS.map((item) => (
                     <button
                        key={item}
                        onClick={() => {
                            onSelect(item);
                            onClose();
                        }}
                        className="p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-100 dark:border-gray-800"
                     >
                         {item}
                     </button>
                 ))}
             </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
