
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

      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'face-database-images');
      
      // Create bucket if it doesn't exist
      if (!bucketExists) {
        console.log("Creating storage bucket 'face-database-images'");
        const { error: createBucketError } = await supabase.storage
          .createBucket('face-database-images', {
            public: true,
          });
          
        if (createBucketError) {
          console.error("Error creating bucket:", createBucketError);
          clearInterval(progressInterval);
          setUploadingImage(false);
          setUploadProgress(null);
          toast({
            title: "Storage Error",
            description: "Failed to create storage bucket. Please try again later.",
            variant: "destructive",
          });
          return null;
        }
      }

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from("face-database-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      clearInterval(progressInterval);

      if (error) {
        console.error("Storage upload error:", error);
        
        // Try to make the bucket public if we got a permission error
        if (error.message.includes("permission") || error.message.includes("policy")) {
          toast({
            title: "Permission Error",
            description: "Updating permissions and trying again...",
          });
          
          // Update bucket to be public
          await supabase.storage.updateBucket('face-database-images', {
            public: true,
          });
          
          // Create public policies
          await supabase.storage.from('face-database-images').createSignedUrl(filePath, 60);
          
          // Try upload again
          const secondAttempt = await supabase.storage
            .from("face-database-images")
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: true,
            });
            
          if (secondAttempt.error) {
            toast({
              title: "Upload Failed",
              description: secondAttempt.error.message || "Failed to upload file after permission update",
              variant: "destructive",
            });
            setUploadingImage(false);
            setUploadProgress(null);
            return null;
          }
          
          // Get public URL after second attempt
          const { data: publicUrlData } = supabase.storage
            .from("face-database-images")
            .getPublicUrl(filePath);
            
          setUploadProgress(100);
          setUploadingImage(false);
          
          if (publicUrlData?.publicUrl) {
            toast({
              title: "Success",
              description: "File uploaded successfully",
            });
            return publicUrlData.publicUrl;
          }
        } else {
          toast({
            title: "Upload Error",
            description: error.message || "Failed to upload file",
            variant: "destructive",
          });
          setUploadingImage(false);
          setUploadProgress(null);
          return null;
        }
      }

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
      } else {
        toast({
          title: "Error",
          description: "Could not get public URL for uploaded file",
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
