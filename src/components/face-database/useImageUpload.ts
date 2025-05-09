
import { useState } from "react";
import { UploadState } from "./types";

export const useImageUpload = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: null,
    error: null,
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Function to upload an image
  const handleImageUpload = async (file: File, onProgress?: (progress: number) => void) => {
    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
    });

    try {
      // Simulate progress updates
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 10;
        if (progress > 90) {
          clearInterval(progressInterval);
        }
        
        setUploadState(prev => ({
          ...prev,
          progress,
        }));
        
        if (onProgress) {
          onProgress(progress);
        }
      }, 300);

      // Read the file as data URL for local preview
      const reader = new FileReader();
      const dataUrlPromise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to read file as data URL'));
          }
        };
        reader.onerror = () => reject(reader.error);
      });
      
      reader.readAsDataURL(file);
      
      // Get the data URL
      const dataUrl = await dataUrlPromise;
      
      // Clear the progress interval
      clearInterval(progressInterval);

      // Set to 100% once completed
      setUploadState({
        isUploading: false,
        progress: 100,
        error: null,
      });
      
      setUploadedImage(dataUrl);
      return dataUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadState({
        isUploading: false,
        progress: null,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      return await handleImageUpload(file);
    } catch (error) {
      console.error("Error in uploadImage:", error);
      return null;
    }
  };

  const resetUpload = () => {
    setUploadState({
      isUploading: false,
      progress: null,
      error: null,
    });
    setUploadedImage(null);
  };

  // Add uploadingImage and uploadProgress properties to the return value for compatibility
  const uploadingImage = uploadState.isUploading;
  const uploadProgress = uploadState.progress;

  return { 
    uploadState, 
    uploadedImage, 
    uploadImage, 
    resetUpload,
    uploadingImage,
    uploadProgress
  };
};
