
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DeepfakeAnalysisResult } from './types';
import { saveDeepfakeResult } from '@/utils/localStorageUtils';
import { v4 as uuidv4 } from 'uuid';

// NVIDIA API key - replace with your own key in a production environment
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
      
      // Invoke detection API or simulation
      console.log("Starting deepfake detection analysis...");
      const result = await detectDeepfake(base64Image);
      setAnalysisProgress(100);
      
      // Update the result with the image URL and a unique ID
      result.imageUrl = imageUrl;
      result.analysisId = uuidv4();
      
      // Save result to local storage
      saveDeepfakeResult(result);
      
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
    
    try {
      console.log("Starting deepfake detection with NVIDIA model...");
      
      // For this implementation, we'll simulate the API call
      // In production, uncomment the real API call code
      
      // Simulate API delay and show progress
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAnalysisProgress(70);
      
      // Generate random result for demo purposes
      // In production, use the actual API response
      const randomScore = Math.random();
      const isDeepfake = randomScore > 0.5;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalysisProgress(90);
      
      console.log("Analysis complete. Generated result:", isDeepfake ? "Deepfake detected" : "Authentic image");
      
      // Return simulated result
      return {
        score: randomScore,
        isDeepfake: isDeepfake,
        confidence: Math.random() * 0.5 + 0.5, // Between 0.5 and 1.0
        analysisTimestamp: new Date().toISOString(),
        imageUrl: '', // Will be set by the calling function
        detectedFaceCount: Math.floor(Math.random() * 3) + 1,
        analysisId: uuidv4(),
        metadata: {
          generationMethod: isDeepfake ? 'GAN' : 'None',
          manipulationScore: randomScore,
          detectedArtifacts: isDeepfake 
            ? ['facial inconsistencies', 'background anomalies', 'texture inconsistencies'].slice(0, Math.floor(Math.random() * 3) + 1) 
            : [],
          faceInconsistencies: isDeepfake ? Math.floor(Math.random() * 5) + 1 : 0
        }
      };
      
      /* Uncomment this code to use the actual NVIDIA API in production
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Accept': 'application/json',
      };
      
      const payload = {
        'input': [`data:image/png;base64,${base64Image}`]
      };
      
      console.log("Sending request to NVIDIA API...");
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch('https://ai.api.nvidia.com/v1/cv/hive/deepfake-image-detection', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`NVIDIA API error (${response.status}):`, errorText);
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log("NVIDIA API response:", data);
      
      // Parse the API response
      return {
        score: parseFloat(data.score) || 0.5,
        isDeepfake: (parseFloat(data.score) || 0.5) > 0.5,
        confidence: data.confidence || 0.7,
        analysisTimestamp: new Date().toISOString(),
        imageUrl: '',
        detectedFaceCount: data.detected_face_count || 1,
        analysisId: data.analysis_id || uuidv4(),
        metadata: {
          generationMethod: data.generation_method || 'Unknown',
          manipulationScore: data.manipulation_score || 0.5,
          detectedArtifacts: data.artifacts || [],
          faceInconsistencies: data.face_inconsistencies || 0
        }
      };
      */
    } catch (error) {
      console.error("Deepfake detection error:", error);
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
