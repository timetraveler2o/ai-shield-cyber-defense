
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Person, DetectionMatch, FaceBox } from './types';
import * as faceapi from 'face-api.js';

// Flag to track if models are loaded
let modelsLoaded = false;

export function useFaceRecognition() {
  const [loading, setLoading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<number | null>(null);
  const [detectedFaces, setDetectedFaces] = useState<FaceBox[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize face-api models with proper error handling
  const initializeFaceApi = async () => {
    if (modelsLoaded) return;
    
    try {
      setLoading(true);
      setProcessingProgress(10);
      setLastError(null);
      
      console.log('Loading face-api models...');
      
      // Load models directly from face-api.js CDN
      const modelUrl = 'https://justadudewhohacks.github.io/face-api.js/models';
      
      // Load face detection model
      await faceapi.nets.ssdMobilenetv1.loadFromUri(modelUrl);
      setProcessingProgress(30);
      console.log('SSD Mobilenet model loaded');
      
      // Load face landmark model
      await faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl);
      setProcessingProgress(50);
      console.log('Face landmark model loaded');
      
      // Load face recognition model
      await faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl);
      setProcessingProgress(70);
      console.log('Face recognition model loaded');
      
      // Load face expression model
      await faceapi.nets.faceExpressionNet.loadFromUri(modelUrl);
      setProcessingProgress(85);
      console.log('Face expression model loaded');
      
      // Load age and gender model
      await faceapi.nets.ageGenderNet.loadFromUri(modelUrl);
      setProcessingProgress(100);
      console.log('Age and gender model loaded');
      
      modelsLoaded = true;
      console.log('All Face-API models loaded successfully');
      
      toast({
        title: "Models Loaded",
        description: "Face recognition models loaded successfully.",
      });
    } catch (error) {
      console.error('Error loading Face-API models:', error);
      setLastError(`Model loading failed: ${error instanceof Error ? error.message : String(error)}`);
      toast({
        title: "Model Loading Error",
        description: "Failed to load facial recognition models. Please try again.",
        variant: "destructive",
      });
      modelsLoaded = false;
    } finally {
      setLoading(false);
      setProcessingProgress(null);
    }
  };

  // Reset error state and try loading models again
  const retryModelLoading = async () => {
    modelsLoaded = false;
    return initializeFaceApi();
  };

  // Generate face descriptors from an image
  const generateFaceDescriptor = async (imageUrl: string): Promise<number[] | null> => {
    try {
      await initializeFaceApi();
      
      if (!modelsLoaded) {
        throw new Error("Models not loaded. Please retry.");
      }
      
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

  // Detect all faces in an image with gender and age detection
  const detectAllFaces = async (imageOrVideoElement: HTMLImageElement | HTMLVideoElement): Promise<FaceBox[]> => {
    try {
      await initializeFaceApi();
      
      if (!modelsLoaded) {
        throw new Error("Models not loaded. Please retry.");
      }
      
      const detections = await faceapi.detectAllFaces(imageOrVideoElement)
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();
      
      if (!detections || detections.length === 0) {
        return [];
      }
      
      // Convert to our FaceBox format with age and gender info
      const faceBoxes = detections.map(detection => {
        const box = detection.detection.box;
        return {
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height,
          gender: detection.gender,
          age: Math.round(detection.age),
          expressions: detection.expressions
        };
      });
      
      setDetectedFaces(faceBoxes);
      return faceBoxes;
    } catch (error) {
      console.error('Error detecting faces:', error);
      setLastError(`Face detection error: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  };

  // Compare a face against the database
  const findMatches = async (imageUrl: string, people: Person[], threshold = 0.6): Promise<DetectionMatch[]> => {
    try {
      await initializeFaceApi();
      setLoading(true);
      
      if (!modelsLoaded) {
        throw new Error("Models not loaded. Please retry.");
      }

      // Load image and detect faces
      const img = await loadImage(imageUrl);
      
      // Detect all faces in the image with age and gender
      const detections = await faceapi.detectAllFaces(img)
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withAgeAndGender()
        .withFaceExpressions();

      if (!detections || detections.length === 0) {
        toast({
          title: "Detection Failed",
          description: "No faces detected in the uploaded image.",
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

      // Store face boxes for visualization
      const faceBoxes: FaceBox[] = [];

      // Process each detected face
      for (const detection of detections) {
        // Find best match
        const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
        
        const box = detection.detection.box;
        const faceBox: FaceBox = {
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height,
          gender: detection.gender,
          age: Math.round(detection.age),
          expressions: detection.expressions
        };
        
        faceBoxes.push(faceBox);
        
        const currentDate = new Date();
        const timestamp = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
        
        if (bestMatch.label !== 'unknown') {
          matches.push({
            personId: bestMatch.label,
            matchConfidence: 1 - bestMatch.distance, // Convert distance to confidence
            timestamp: timestamp,
            location: 'Current surveillance feed',
            imageUrl: imageUrl,
            faceBox: faceBox,
            gender: detection.gender,
            age: Math.round(detection.age),
            expressions: detection.expressions
          });
        } else {
          // Also add unknown faces with demographic data
          matches.push({
            personId: 'unknown',
            matchConfidence: 0,
            timestamp: timestamp,
            location: 'Current surveillance feed',
            imageUrl: imageUrl,
            faceBox: faceBox,
            gender: detection.gender,
            age: Math.round(detection.age),
            expressions: detection.expressions
          });
        }
      }
      
      setDetectedFaces(faceBoxes);
      
      return matches;
    } catch (error) {
      console.error('Face matching error:', error);
      setLastError(`Face matching error: ${error instanceof Error ? error.message : String(error)}`);
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

  // Process video frames for face detection with enhanced tracking
  const processVideoFrames = async (
    videoElement: HTMLVideoElement,
    people: Person[],
    onMatchesFound: (matches: DetectionMatch[]) => void
  ) => {
    if (!videoElement.paused && videoElement.readyState >= 2) {
      try {
        if (!modelsLoaded) {
          throw new Error("Models not loaded. Please retry.");
        }
        
        // Create a canvas element to capture the current frame
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;
        
        // Draw the current video frame to the canvas
        ctx.drawImage(videoElement, 0, 0);
        
        // Detect faces with age, gender and expressions in the current frame
        const detections = await faceapi.detectAllFaces(videoElement)
          .withFaceLandmarks()
          .withFaceDescriptors()
          .withAgeAndGender()
          .withFaceExpressions();
        
        if (detections && detections.length > 0) {
          // Get face boxes for visualization with demographic info
          const faceBoxes = detections.map(d => {
            const box = d.detection.box;
            return {
              x: box.x,
              y: box.y,
              width: box.width,
              height: box.height,
              gender: d.gender,
              age: Math.round(d.age),
              expressions: d.expressions
            };
          });
          
          setDetectedFaces(faceBoxes);
          
          // Filter people with face descriptors
          const peopleWithDescriptors = people.filter(p => p.faceDescriptor && p.faceDescriptor.length > 0);
          
          if (peopleWithDescriptors.length > 0) {
            // Create labeled face descriptors
            const labeledDescriptors = peopleWithDescriptors.map(person => {
              return new faceapi.LabeledFaceDescriptors(
                person.id,
                [new Float32Array(person.faceDescriptor as number[])]
              );
            });
            
            // Create face matcher
            const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
            
            // Find matches for each detected face
            const matches: DetectionMatch[] = [];
            const currentDate = new Date();
            const timestamp = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
            
            for (let i = 0; i < detections.length; i++) {
              const bestMatch = faceMatcher.findBestMatch(detections[i].descriptor);
              
              if (bestMatch.label !== 'unknown') {
                matches.push({
                  personId: bestMatch.label,
                  matchConfidence: 1 - bestMatch.distance,
                  timestamp: timestamp,
                  location: 'Video stream',
                  imageUrl: canvas.toDataURL(),
                  faceBox: faceBoxes[i],
                  gender: detections[i].gender,
                  age: Math.round(detections[i].age),
                  expressions: detections[i].expressions
                });
              } else {
                // Also add unknown faces with demographic data
                matches.push({
                  personId: 'unknown',
                  matchConfidence: 0,
                  timestamp: timestamp,
                  location: 'Video stream',
                  imageUrl: canvas.toDataURL(),
                  faceBox: faceBoxes[i],
                  gender: detections[i].gender,
                  age: Math.round(detections[i].age),
                  expressions: detections[i].expressions
                });
              }
            }
            
            if (matches.length > 0) {
              onMatchesFound(matches);
            }
          }
        }
      } catch (error) {
        console.error('Error processing video frame:', error);
        setLastError(`Video processing error: ${error instanceof Error ? error.message : String(error)}`);
      }
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
    detectedFaces,
    lastError,
    generateFaceDescriptor,
    findMatches,
    detectAllFaces,
    processVideoFrames,
    initializeFaceApi,
    retryModelLoading
  };
}
