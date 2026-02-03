import { useState, useCallback } from 'react';

export type DetectionStatus = 'idle' | 'scanning' | 'analyzing' | 'success' | 'error';

export interface DetectionResult {
  id: string;
  item: string;
  category: 'electronic' | 'battery' | 'plastic' | 'other';
  confidence: number;
  value: number; // Estimated value in currency
  message: string;
}

export function useWasteDetection() {
  const [status, setStatus] = useState<DetectionStatus>('idle');
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [debugImage, setDebugImage] = useState<string | null>(null);

  const startDetection = useCallback(async (imageFile: File | null) => {
    if (!imageFile) return;

    setStatus('scanning');
    setResult(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      const base64Image = await base64Promise;
      
      // Artificial delay for "Scanning" animation (optional, but good for UX)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatus('analyzing');

      const response = await fetch('/api/analyze-waste', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown server error' }));
        console.error("Server Response Error:", response.status, errorData);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      setResult({
        id: Date.now().toString(),
        item: data.item || 'Unknown Item',
        category: data.category || 'other',
        confidence: data.confidence || 0.5,
        value: data.value || 0,
        message: data.message || 'Could not determine details.',
      });
      
      setStatus('success');
    } catch (error) {
      console.error("Detection Error:", error);
      setStatus('error');
      // For demo resilience, fall back to mock result if API fails (optional)
      // or just show error state
    }
  }, []);

  const resetDetection = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setDebugImage(null);
  }, []);

  return {
    status,
    result,
    startDetection,
    resetDetection,
    debugImage, 
    setDebugImage
  };
}
