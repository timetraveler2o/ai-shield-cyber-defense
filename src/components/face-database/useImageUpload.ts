
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useImageUpload() {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const { toast } = useToast();

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true);
      setUploadProgress(0);

      // Validate file size and type
      const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB to accommodate videos
      const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
      const validTypes = [...validImageTypes, ...validVideoTypes];

      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "The file size should not exceed 20MB.",
          variant: "destructive",
        });
        setUploadingImage(false);
        setUploadProgress(null);
        return null;
      }

      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPEG, PNG, WebP image or MP4, WebM video.",
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

      // Instead of creating a bucket (which requires admin privileges),
      // let's try to use an existing bucket or create a simpler file upload approach
      
      // First, try to upload to the existing bucket if it exists
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("face-database-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError && uploadError.message.includes("bucket not found")) {
        // The bucket doesn't exist, but we can't create it from the client
        // Let's use a more generic bucket name that might already exist
        const { data: generalUploadData, error: generalUploadError } = await supabase.storage
          .from("public")
          .upload(`face-images/${filePath}`, file, {
            cacheControl: "3600",
            upsert: true,
          });

        clearInterval(progressInterval);
          
        if (generalUploadError) {
          console.error("Storage upload error:", generalUploadError);
          toast({
            title: "Upload Error",
            description: "Failed to upload file. Please check if your Supabase project has storage buckets configured.",
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
          toast({
            title: "Success",
            description: "File uploaded successfully",
          });
          return publicUrlData.publicUrl;
        }
      } else if (uploadError) {
        clearInterval(progressInterval);
        console.error("Storage upload error:", uploadError);
        toast({
          title: "Upload Error",
          description: "Failed to upload file. Please check your Supabase storage configuration.",
          variant: "destructive",
        });
        setUploadingImage(false);
        setUploadProgress(null);
        return null;
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
          toast({
            title: "Success",
            description: "File uploaded successfully",
          });
          return publicUrlData.publicUrl;
        }
      }
      
      clearInterval(progressInterval);
      setUploadingImage(false);
      setUploadProgress(null);
      toast({
        title: "Error",
        description: "Could not get public URL for uploaded file",
        variant: "destructive",
      });
      return null;
      
    } catch (err) {
      console.error("Unexpected upload error:", err);
      setUploadingImage(false);
      setUploadProgress(null);
      toast({
        title: "Error",
        description: "An unexpected error occurred while uploading",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    uploadImage,
    uploadingImage,
    uploadProgress,
  };
}
