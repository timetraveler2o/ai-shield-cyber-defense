
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Person, DetectionMatch } from './types';
import * as faceapi from 'face-api.js';

// Flag to track if models are loaded
let modelsLoaded = false;

export function useFaceRecognition() {
  const [loading, setLoading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<number | null>(null);
  const { toast } = useToast();

  // Initialize face-api models
  const initializeFaceApi = async () => {
    if (modelsLoaded) return;
    
    try {
      setLoading(true);
      setProcessingProgress(10);
      
      // Load models from public directory
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      setProcessingProgress(40);
      
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      setProcessingProgress(70);
      
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      setProcessingProgress(100);
      
      modelsLoaded = true;
      console.log('Face-API models loaded successfully');
    } catch (error) {
      console.error('Error loading Face-API models:', error);
      toast({
        title: "Model Loading Error",
        description: "Failed to load facial recognition models. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setProcessingProgress(null);
    }
  };

  // Generate face descriptors from an image
  const generateFaceDescriptor = async (imageUrl: string): Promise<number[] | null> => {
    try {
      await initializeFaceApi();
      
      // Create an image element
      const img = await loadImage(imageUrl);
      
      // Detect faces
      const detections = await faceapi.detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();
      
      if (!detections) {
        toast({
          title: "Face Detection Failed",
          description: "No face could be detected in the image.",
          variant: "destructive",
        });
        return null;
      }
      
      // Return face descriptor as array
      return Array.from(detections.descriptor);
    } catch (error) {
      console.error('Error generating face descriptor:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process facial features.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Compare a face against the database
  const findMatches = async (imageUrl: string, people: Person[], threshold = 0.6): Promise<DetectionMatch[]> => {
    try {
      await initializeFaceApi();
      setLoading(true);

      // Load image and detect face
      const img = await loadImage(imageUrl);
      const detection = await faceapi.detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        toast({
          title: "Detection Failed",
          description: "No face detected in the uploaded image.",
          variant: "destructive",
        });
        return [];
      }

      // Create matches array
      const matches: DetectionMatch[] = [];

      // Filter people with face descriptors
      const peopleWithDescriptors = people.filter(p => p.faceDescriptor && p.faceDescriptor.length > 0);

      if (peopleWithDescriptors.length === 0) {
        toast({
          title: "No Reference Data",
          description: "No face descriptors available in the database for comparison.",
        });
        return [];
      }

      // Create labeled face descriptors
      const labeledDescriptors = peopleWithDescriptors.map(person => {
        return new faceapi.LabeledFaceDescriptors(
          person.id,
          [new Float32Array(person.faceDescriptor as number[])]
        );
      });

      // Create face matcher
      const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, threshold);

      // Find best match
      const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
      
      if (bestMatch.label !== 'unknown') {
        const currentDate = new Date();
        const timestamp = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
        
        matches.push({
          personId: bestMatch.label,
          matchConfidence: 1 - bestMatch.distance, // Convert distance to confidence
          timestamp: timestamp,
          location: 'Current surveillance feed',
          imageUrl: imageUrl
        });
      }

      return matches;
    } catch (error) {
      console.error('Face matching error:', error);
      toast({
        title: "Matching Error",
        description: "An error occurred during face matching.",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Helper function to load an image
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = src;
    });
  };

  return {
    loading,
    processingProgress,
    generateFaceDescriptor,
    findMatches,
    initializeFaceApi
  };
}
