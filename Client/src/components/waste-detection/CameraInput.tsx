import { useRef, useState, useEffect } from 'react';
import { Camera, Upload, X, RefreshCw, ScanLine } from 'lucide-react';
import { motion } from 'framer-motion';

interface CameraInputProps {
  onCapture: (file: File) => void;
  isScanning: boolean;
}

export function CameraInput({ onCapture, isScanning }: CameraInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null);

  // File Handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setSelectedFile(file); // Store file but don't capture yet
      stopCamera(); 
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Webcam Handling
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setActiveStream(stream);
      setIsStreaming(true);
    } catch (err) {
      console.error("Camera access denied or missing:", err);
      // Fallback to native input if webcam fails
      cameraInputRef.current?.click();
    }
  };

  // Effect to attach stream to video element when it becomes available
  useEffect(() => {
    if (isStreaming && activeStream && videoRef.current) {
        videoRef.current.srcObject = activeStream;
    }
  }, [isStreaming, activeStream]);

  const stopCamera = () => {
    if (activeStream) {
      activeStream.getTracks().forEach(track => track.stop());
      setActiveStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        // Convert data URL to File object
        fetch(dataUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            handleFile(file); // Re-use handleFile to set preview
          });
      }
    }
  };

  const clearImage = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    stopCamera();
  };

  const handleConfirm = () => {
    if (selectedFile) {
      onCapture(selectedFile);
    }
  };

  const triggerUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={cameraInputRef}
        onChange={handleFileChange}
      />

      {isStreaming ? (
        <div className="relative rounded-2xl overflow-hidden shadow-lg bg-black aspect-[4/3]">
           <video 
             ref={videoRef} 
             autoPlay 
             playsInline 
             muted 
             className="w-full h-full object-cover"
           />
           <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
             <button
               onClick={stopCamera}
               className="p-3 bg-red-500/80 hover:bg-red-600 text-white rounded-full backdrop-blur-sm transition-colors"
             >
               <X className="w-6 h-6" />
             </button>
             <button
               onClick={capturePhoto}
               className="p-4 bg-white/90 hover:bg-white text-forest-green rounded-full shadow-lg transition-transform hover:scale-105"
             >
               <div className="w-6 h-6 rounded-full border-2 border-current" />
             </button>
           </div>
        </div>
      ) : preview ? (
        <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-square bg-gray-900 group">
          <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-80" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-t from-black/80 via-transparent to-transparent">
             {!isScanning && (
               <div className="w-full flex flex-col gap-3 mt-auto">
                  <button
                    onClick={handleConfirm}
                    className="w-full py-3 bg-forest-green hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-forest-green/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <ScanLine className="w-5 h-5" />
                    Identify Item
                  </button>
                  <button
                    onClick={clearImage}
                    className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium backdrop-blur-md transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retake
                  </button>
               </div>
             )}
          </div>
        </div>
      ) : (
        <motion.div
            layout
            className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors aspect-[4/3] ${
            dragActive
                ? "border-forest-green bg-forest-green/5"
                : "border-gray-300 dark:border-gray-700 hover:border-forest-green dark:hover:border-forest-green hover:bg-gray-50 dark:hover:bg-gray-800/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 mb-4 rounded-full bg-forest-green/10 flex items-center justify-center text-forest-green">
            <Camera className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Scan e-waste
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-[200px]">
            Take a photo or upload an image to identify your item
          </p>
          <div className="flex gap-3">
             <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  startCamera();
                }}
                className="px-4 py-2 bg-forest-green text-white rounded-lg text-sm font-medium shadow-lg shadow-forest-green/20 hover:bg-opacity-90 transition-all flex items-center gap-2"
             >
                <Camera className="w-4 h-4" />
                Open Camera
             </button>
             <button 
                type="button"
                onClick={triggerUpload}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2"
             >
                <Upload className="w-4 h-4" />
                Upload
             </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

