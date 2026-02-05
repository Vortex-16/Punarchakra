import { useState, useCallback } from 'react';
import { detectWaste } from '@/app/actions/detectWaste';

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

      // Use Server Action directly
      const response = await detectWaste(base64Image);

      if (response.error) {
        throw new Error(response.error);
      }

      const data = response.data;

      // Map server response to DetectionResult
      // The server returns: { label, material, recyclable, confidence_score, sustainability_score, estimated_credit, reasoning }
      // We need to map it to: { id, item, category, confidence, value, message }

      const categoryMap: Record<string, 'electronic' | 'battery' | 'plastic' | 'other'> = {
        'true': 'electronic', // If recyclable is true, we assume it's electronic/e-waste based on the prompt
        'false': 'other'
      };

      setResult({
        id: Date.now().toString(),
        item: data.label || 'Unknown Item',
        category: data.recyclable ? 'electronic' : 'other', // Simplified mapping based on prompt logic
        confidence: (data.confidence_score || 0) / 100, // prompt returns 0-100
        value: data.estimated_credit || 0,
        message: data.reasoning || data.material || 'Analysis complete.',
      });

      setStatus('success');
    } catch (error) {
      console.error("Detection Error:", error);
      setStatus('error');
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
