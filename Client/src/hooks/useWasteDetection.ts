import { useState, useCallback } from 'react';
import { detectWaste } from '@/app/actions/detectWaste';
import { useSession } from '@/hooks/useSession';

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
  const { user } = useSession();
  const [status, setStatus] = useState<DetectionStatus>('idle');
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [debugImage, setDebugImage] = useState<string | null>(null);

  const startDetection = useCallback(async (imageFile: File | null, additionalInfo?: { weight?: string; size?: string }) => {
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
      const response = await detectWaste(base64Image, additionalInfo);

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

      const resultData = {
        id: Date.now().toString(),
        item: data.label || 'Unknown Item',
        category: data.recyclable ? 'electronic' : 'other',
        confidence: (data.confidence_score || 0) / 100,
        value: data.estimated_credit || 0,
        message: data.reasoning || data.material || 'Analysis complete.',
      };

      setResult(resultData as any);

      // Save to History
      if (user?._id) {
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'}/history/add`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  userId: user._id,
                  imageUrl: base64Image, // Warning: Large payload
                  itemLabel: resultData.item,
                  category: resultData.category,
                  confidence: resultData.confidence,
                  value: resultData.value,
                  weight: additionalInfo?.weight,
                  size: additionalInfo?.size,
                  message: resultData.message
              })
          }).catch(err => console.error("Failed to save history:", err));
      }

      setStatus('success');
    } catch (error) {
      console.error("Detection Error:", error);
      setStatus('error');
    }
  }, [user]);

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
