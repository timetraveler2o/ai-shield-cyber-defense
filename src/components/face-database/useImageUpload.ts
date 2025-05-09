
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useImageUpload() {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      // Reset any previous errors
      setUploadError(null);
      setUploadingImage(true);
      setUploadProgress(0);

      // Validate file size and type
      const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB to accommodate videos
      const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
      const validTypes = [...validImageTypes, ...validVideoTypes];

      if (file.size > MAX_FILE_SIZE) {
        const errorMsg = "The file size should not exceed 20MB.";
        setUploadError(errorMsg);
        toast({
          title: "File too large",
          description: errorMsg,
          variant: "destructive",
        });
        setUploadingImage(false);
        setUploadProgress(null);
        return null;
      }

      if (!validTypes.includes(file.type)) {
        const errorMsg = "Please upload a JPEG, PNG, WebP image or MP4, WebM video.";
        setUploadError(errorMsg);
        toast({
          title: "Invalid file type",
          description: errorMsg,
          variant: "destructive",
        });
        setUploadingImage(false);
        setUploadProgress(null);
        return null;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev !== null && prev < 90) return prev + 10;
          return prev;
        });
      }, 300);

      console.log(`Starting upload for file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);
      
      // First, try to upload to the face-database-images bucket
      let { data: uploadData, error: uploadError } = await supabase.storage
        .from("face-database-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      // If there was an error with the first bucket, try the public bucket
      if (uploadError) {
        console.log("First upload attempt error:", uploadError.message);
        
        if (uploadError.message.includes("bucket not found")) {
          console.log("Trying fallback to public bucket...");
          const { data: generalUploadData, error: generalUploadError } = await supabase.storage
            .from("public")
            .upload(`face-images/${filePath}`, file, {
              cacheControl: "3600",
              upsert: true,
            });

          clearInterval(progressInterval);
            
          if (generalUploadError) {
            console.error("Storage upload error (public bucket):", generalUploadError);
            const errorMsg = "Failed to upload file. Please check if your Supabase project has storage buckets configured.";
            setUploadError(errorMsg);
            toast({
              title: "Upload Error",
              description: errorMsg,
              variant: "destructive",
            });
            setUploadingImage(false);
            setUploadProgress(null);
            return null;
          }
            
          // Get public URL from the general bucket
          const { data: publicUrlData } = supabase.storage
            .from("public")
            .getPublicUrl(`face-images/${filePath}`);
            
          setUploadProgress(100);
          
          // Add a short delay to show the 100% progress before resetting
          setTimeout(() => {
            setUploadingImage(false);
            setUploadProgress(null);
          }, 500);
          
          if (publicUrlData?.publicUrl) {
            console.log("Upload successful to public bucket:", publicUrlData.publicUrl);
            toast({
              title: "Success",
              description: "File uploaded successfully",
            });
            return publicUrlData.publicUrl;
          } else {
            const errorMsg = "Could not get public URL for uploaded file (public bucket)";
            setUploadError(errorMsg);
            console.error(errorMsg);
            toast({
              title: "Error",
              description: errorMsg,
              variant: "destructive",
            });
            return null;
          }
        } else {
          // Handle other upload errors
          clearInterval(progressInterval);
          console.error("Storage upload error:", uploadError);
          const errorMsg = `Upload failed: ${uploadError.message}`;
          setUploadError(errorMsg);
          toast({
            title: "Upload Error",
            description: errorMsg,
            variant: "destructive",
          });
          setUploadingImage(false);
          setUploadProgress(null);
          return null;
        }
      } else {
        // Original upload worked
        clearInterval(progressInterval);
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("face-database-images")
          .getPublicUrl(filePath);
        
        setUploadProgress(100);
        
        // Add a short delay to show the 100% progress before resetting
        setTimeout(() => {
          setUploadingImage(false);
          setUploadProgress(null);
        }, 500);
        
        if (publicUrlData?.publicUrl) {
          console.log("Upload successful to face-database-images bucket:", publicUrlData.publicUrl);
          toast({
            title: "Success",
            description: "File uploaded successfully",
          });
          return publicUrlData.publicUrl;
        } else {
          const errorMsg = "Could not get public URL for uploaded file";
          setUploadError(errorMsg);
          console.error(errorMsg);
          toast({
            title: "Error",
            description: errorMsg,
            variant: "destructive",
          });
          return null;
        }
      }
      
    } catch (err) {
      console.error("Unexpected upload error:", err);
      const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred while uploading";
      setUploadError(errorMsg);
      setUploadingImage(false);
      setUploadProgress(null);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    uploadImage,
    uploadingImage,
    uploadProgress,
    uploadError
  };
}
