
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

      // Check if the file is too large (e.g., 5MB limit)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "The file size should not exceed 5MB.",
          variant: "destructive",
        });
        setUploadingImage(false);
        setUploadProgress(null);
        return null;
      }

      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPEG, PNG, or WebP image.",
          variant: "destructive",
        });
        setUploadingImage(false);
        setUploadProgress(null);
        return null;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev !== null && prev < 90) return prev + 10;
          return prev;
        });
      }, 300);

      // Use upsert: true to override any potential RLS issues
      // We're using a publicly accessible bucket configured in SQL
      const { data, error } = await supabase.storage
        .from("face-database-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      clearInterval(progressInterval);

      if (error) {
        console.error("Supabase image upload error:", error);
        setUploadingImage(false);
        setUploadProgress(null);

        // Handle different error cases with specific messages
        if (error.message?.includes("bucket not found")) {
          toast({
            title: "Image upload error",
            description: "Storage bucket 'face-database-images' was not found. Please contact admin.",
            variant: "destructive",
          });
        } else if (error.message?.toLowerCase().includes("row level security policy")) {
          toast({
            title: "Storage Permission Error",
            description: "Permission denied for uploading images. The storage bucket may not be properly configured.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Upload Error",
            description: error.message || "An unknown error occurred during upload",
            variant: "destructive",
          });
        }
        return null;
      }

      setUploadProgress(100);

      // Use getPublicUrl to get the URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from("face-database-images")
        .getPublicUrl(filePath);

      setUploadingImage(false);
      setUploadProgress(null);

      if (publicUrlData?.publicUrl) {
        toast({
          title: "Upload Successful",
          description: "Image was uploaded successfully",
        });
        return publicUrlData.publicUrl;
      } else {
        toast({
          title: "Error",
          description: "Could not get public URL for image",
          variant: "destructive",
        });
        return null;
      }
    } catch (err) {
      console.error("Unexpected upload error:", err);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred while uploading image",
        variant: "destructive",
      });
      setUploadingImage(false);
      setUploadProgress(null);
      return null;
    }
  };

  return {
    uploadImage,
    uploadingImage,
    uploadProgress,
  };
}
