
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DeepfakeAnalysisResult } from './types';

// NVIDIA API key
const NVIDIA_API_KEY = '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';

export function useNvidiaDeepfakeDetection() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeImage = async (imageUrl: string): Promise<DeepfakeAnalysisResult | null> => {
    try {
      setAnalysisError(null);
      setAnalyzing(true);
      setAnalysisProgress(10);
      
      // Fetch the image as a blob
      console.log("Fetching image from URL:", imageUrl);
      const response = await fetch(imageUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      
      const imageBlob = await response.blob();
      console.log("Image blob fetched, size:", imageBlob.size);
      
      // Convert to base64
      const base64Image = await blobToBase64(imageBlob);
      setAnalysisProgress(30);
      
      // Invoke NVIDIA API
      console.log("Calling deepfake detection...");
      const result = await detectDeepfake(base64Image);
      setAnalysisProgress(100);
      
      // Update the result with the image URL
      result.imageUrl = imageUrl;
      
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Deepfake analysis error:", errorMsg);
      setAnalysisError(errorMsg);
      toast({
        title: 'Analysis Error',
        description: `Failed to analyze image: ${errorMsg}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      // Add slight delay to show 100% progress
      setTimeout(() => {
        setAnalyzing(false);
        setAnalysisProgress(0);
      }, 500);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove data:image/* prefix to get just the base64 part
        const base64 = base64String.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const detectDeepfake = async (base64Image: string): Promise<DeepfakeAnalysisResult> => {
    setAnalysisProgress(50);
    
    // For demo purposes, we'll use a simulated response
    // In a production environment, you would connect to the actual NVIDIA API
    
    try {
      console.log("NVIDIA API would be called here with key:", NVIDIA_API_KEY.substring(0, 10) + "...");
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnalysisProgress(70);
      
      // Simulate random result
      const score = Math.random();
      const isDeepfake = score > 0.5;
      
      setAnalysisProgress(90);
      
      /* 
      // This is how you would make the actual API call:
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Accept': 'application/json',
      };
      
      const payload = {
        'input': [`data:image/png;base64,${base64Image}`]
      };
      
      console.log("Sending request to NVIDIA API...");
      const response = await fetch('https://ai.api.nvidia.com/v1/cv/hive/deepfake-image-detection', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`NVIDIA API error (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      console.log("NVIDIA API response:", data);
      
      return {
        score: data.score,
        isDeepfake: data.score > 0.5,
        confidence: data.confidence,
        analysisTimestamp: new Date().toISOString(),
        imageUrl: '',
        detectedFaceCount: data.detected_face_count || 1,
        analysisId: data.analysis_id || Math.random().toString(36).substring(2, 15),
      };
      */
      
      // Return simulated result for now
      return {
        score: score,
        isDeepfake: isDeepfake,
        confidence: Math.random() * 0.5 + 0.5, // Between 0.5 and 1.0
        analysisTimestamp: new Date().toISOString(),
        imageUrl: '', // This will be set when we call the function
        detectedFaceCount: Math.floor(Math.random() * 3) + 1,
        analysisId: Math.random().toString(36).substring(2, 15),
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("NVIDIA API error:", errorMsg);
      setAnalysisError(errorMsg);
      throw error;
    }
  };

  return {
    analyzeImage,
    analyzing,
    analysisProgress,
    analysisError
  };
}
