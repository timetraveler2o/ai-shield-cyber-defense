
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useImageUpload() {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const { toast } = useToast();

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true);
      setUploadProgress(0);

      // Validate file size and type
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "The file size should not exceed 5MB.",
          variant: "destructive",
        });
        return null;
      }

      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPEG, PNG, or WebP image.",
          variant: "destructive",
        });
        return null;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev !== null && prev < 90) return prev + 10;
          return prev;
        });
      }, 300);

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from("face-database-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true
        });

      clearInterval(progressInterval);

      if (error) {
        console.error("Storage upload error:", error);
        setUploadingImage(false);
        setUploadProgress(null);
        
        toast({
          title: "Upload Error",
          description: error.message || "Failed to upload image",
          variant: "destructive",
        });
        return null;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("face-database-images")
        .getPublicUrl(filePath);

      setUploadProgress(100);
      setUploadingImage(false);

      if (publicUrlData?.publicUrl) {
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
        return publicUrlData.publicUrl;
      } else {
        toast({
          title: "Error",
          description: "Could not get public URL for uploaded image",
          variant: "destructive",
        });
        return null;
      }
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
