import { useRef, useState, useEffect } from 'react';
import { Camera, Upload, X, RefreshCw, ScanLine, Image as ImageIcon } from 'lucide-react';
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
    <div className="w-full max-w-xl mx-auto py-4">
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
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black aspect-[4/5] border border-gray-800">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 items-center z-10">
            <button
              onClick={stopCamera}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all pointer-events-auto"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={capturePhoto}
              className="p-1 rounded-full border-4 border-white/30 pointer-events-auto transition-transform active:scale-95"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="w-14 h-14 bg-white border-2 border-gray-300 rounded-full" />
              </div>
            </button>
            <button // Placeholder for balance or toggle camera
              className="p-3 bg-transparent text-transparent rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : preview ? (
        <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] bg-gray-900 group border border-gray-800">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />

          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/40 backdrop-blur-[2px]">
            {!isScanning && (
              <div className="w-full flex flex-col gap-4 mt-auto max-w-sm">
                <button
                  onClick={handleConfirm}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-500/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 backdrop-blur-sm"
                >
                  <ScanLine className="w-6 h-6" />
                  Identify Item
                </button>
                <button
                  onClick={clearImage}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium backdrop-blur-md transition-colors flex items-center justify-center gap-2 border border-white/10"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retake Photo
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <motion.div
          layout
          className={`relative border border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all aspect-[4/3] group overflow-hidden ${dragActive
            ? "border-emerald-500 bg-emerald-500/10 scale-[1.02]"
            : "border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-emerald-500/50 dark:hover:border-emerald-500/50"
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {/* Subtle grid background */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          />

          <div className="w-20 h-20 mb-6 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform duration-300 shadow-sm">
            <ScanLine className="w-10 h-10" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Upload Image
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-[240px] leading-relaxed">
            Drag & drop an image here, or click to select from files
          </p>

          <div className="flex gap-4 w-full max-w-xs relative z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                startCamera();
              }}
              className="flex-1 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              Camera
            </button>
            <button
              type="button"
              onClick={triggerUpload}
              className="flex-1 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              Browse
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

