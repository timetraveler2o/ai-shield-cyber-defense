
import React, { useState } from "react";
import { Upload, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  acceptedFormats?: string;
  maxSizeMB?: number;
}

export function FileUpload({
  onFileUpload,
  acceptedFormats = ".jpg,.jpeg,.png,.pdf,.doc,.docx",
  maxSizeMB = 10,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File too large: ${file.name}`, {
        description: `Maximum size is ${maxSizeMB}MB`
      });
      return false;
    }

    // Check file type
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    const formats = acceptedFormats.split(',');
    
    if (!formats.some(format => fileExtension.includes(format.toLowerCase()))) {
      toast.error(`Invalid file type: ${file.name}`, {
        description: `Accepted formats: ${acceptedFormats}`
      });
      return false;
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).filter(validateFile);
      handleFiles(newFiles);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).filter(validateFile);
      handleFiles(newFiles);
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const updatedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updatedFiles);
    onFileUpload(updatedFiles);
    
    if (newFiles.length > 0) {
      toast.success(`${newFiles.length} file${newFiles.length !== 1 ? 's' : ''} uploaded successfully`);
    }
  };

  const removeFile = (fileToRemove: File) => {
    const updatedFiles = uploadedFiles.filter(file => file !== fileToRemove);
    setUploadedFiles(updatedFiles);
    onFileUpload(updatedFiles);
    toast.info(`File removed: ${fileToRemove.name}`);
  };

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-md p-4 transition-colors ${
          dragActive ? "border-blue-500 bg-blue-50/30" : "border-gray-300 dark:border-gray-600"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-center flex-col">
          <Upload className="h-8 w-8 text-gray-500 mb-2" />
          <p className="text-sm text-gray-500">
            Drag &amp; drop evidence files here or
          </p>
          <label htmlFor="file-upload" className="mt-2 cursor-pointer">
            <Button variant="outline" size="sm" className="relative" type="button">
              Browse Files
              <input
                id="file-upload"
                type="file"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleChange}
                accept={acceptedFormats}
              />
            </Button>
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Accepted formats: JPG, PNG, PDF, DOC, DOCX (Max. {maxSizeMB} MB)
          </p>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="font-medium text-sm">Uploaded files ({uploadedFiles.length})</p>
          <ul className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <li key={`${file.name}-${index}`} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm truncate max-w-xs">{file.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeFile(file)}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
