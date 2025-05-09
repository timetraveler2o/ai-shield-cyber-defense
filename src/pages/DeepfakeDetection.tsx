
import { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { Header } from '@/components/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FaceDetectionPreview } from '@/components/face-database/FaceDetectionPreview';
import { DeepfakeReport } from '@/components/face-database/DeepfakeReport';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { DeepfakeAnalysisResult } from '@/components/face-database/types';
import { getDeepfakeResults, saveDeepfakeResult } from '@/utils/localStorageUtils';
import { useImageUpload } from '@/components/face-database/useImageUpload';
import { useNvidiaDeepfakeDetection } from '@/components/face-database/useNvidiaDeepfakeDetection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info, Loader2, Upload, Shield } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';

export default function DeepfakeDetection() {
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [analysisResults, setAnalysisResults] = useState<DeepfakeAnalysisResult[]>([]);
  
  // Custom hooks for image upload and deepfake detection
  const { 
    uploadState, 
    uploadedImage, 
    uploadImage, 
    resetUpload 
  } = useImageUpload();

  const {
    analyzeImage,
    analyzing,
    analysisProgress,
    analysisError
  } = useNvidiaDeepfakeDetection();

  // Load existing results from local storage
  useEffect(() => {
    const storedResults = getDeepfakeResults();
    setAnalysisResults(storedResults);
  }, []);

  // Handle file input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }
    
    try {
      const imageUrl = await uploadImage(file);
      if (!imageUrl) {
        toast.error("Failed to upload image");
      } else {
        // Pre-analyze faces in the image to update the UI
        await preAnalyzeImageFaces(imageUrl);
      }
    } catch (error) {
      toast.error("Error uploading image");
      console.error(error);
    }
  };

  // Pre-analyze image to detect faces
  const preAnalyzeImageFaces = async (imageUrl: string) => {
    // Load the image to get dimensions
    const img = new Image();
    img.src = imageUrl;
    await new Promise(resolve => {
      img.onload = resolve;
    });
    
    // Simple feedback while loading
    toast.info("Image loaded successfully. Ready for analysis.");
  };

  // Handle image analysis
  const handleAnalyzeImage = async () => {
    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }

    try {
      const result = await analyzeImage(uploadedImage);
      
      if (result) {
        // Save to local storage
        saveDeepfakeResult(result);
        
        // Update state
        setAnalysisResults(prev => [result, ...prev]);
        
        // Navigate to results tab
        setActiveTab('results');
        
        // Show success message with more details
        if (result.isDeepfake) {
          toast.error(`Analysis complete: This image appears to be manipulated with ${Math.round(result.score * 100)}% confidence.`);
        } else {
          toast.success(`Analysis complete: This image appears to be authentic with ${Math.round((1 - result.score) * 100)}% confidence.`);
        }
      }
    } catch (error) {
      toast.error("Failed to analyze image");
      console.error(error);
    }
  };
  
  // Clear a specific result
  const handleClearResult = (id: string) => {
    setAnalysisResults(prev => prev.filter(result => result.analysisId !== id));
    
    // Also update in local storage
    const storedResults = getDeepfakeResults();
    const updatedResults = storedResults.filter(result => result.analysisId !== id);
    localStorage.setItem('deepfakeResults', JSON.stringify(updatedResults));
    
    toast.info("Result removed");
  };
  
  // Clear all results
  const handleClearAllResults = () => {
    setAnalysisResults([]);
    localStorage.setItem('deepfakeResults', JSON.stringify([]));
    toast.info("All results cleared");
  };

  return (
    <div className="flex h-screen bg-cyber-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-cyber-background">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 cyber-highlight">Deepfake Detection System</h1>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 grid grid-cols-2 w-full max-w-md mx-auto">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="results" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Results {analysisResults.length > 0 && `(${analysisResults.length})`}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="cyber-card">
                    <CardHeader>
                      <CardTitle>Upload Image</CardTitle>
                      <CardDescription>
                        Upload an image to analyze for potential deepfake manipulation
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid w-full items-center gap-1.5">
                          <Label htmlFor="image-upload">Choose image</Label>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 text-sm text-muted-foreground cursor-pointer w-full"
                          />
                        </div>
                        
                        {uploadState.isUploading && (
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Loader2 className="h-4 w-4 mr-2 animate-spin text-primary" />
                              <p className="text-sm text-muted-foreground">Uploading image...</p>
                            </div>
                            <Progress value={uploadState.progress || 0} className="h-2" />
                          </div>
                        )}
                        
                        {uploadedImage && (
                          <div>
                            <FaceDetectionPreview 
                              mediaUrl={uploadedImage}
                              detectedFaces={[]}
                            />
                            <p className="text-xs text-muted-foreground mt-2 italic">
                              Note: Face detection accuracy depends on image quality and lighting conditions.
                            </p>
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          <Button 
                            onClick={handleAnalyzeImage}
                            disabled={!uploadedImage || analyzing}
                            className="w-full"
                          >
                            {analyzing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <Shield className="mr-2 h-4 w-4" />
                                Analyze for Deepfake
                              </>
                            )}
                          </Button>
                          
                          {uploadedImage && (
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                resetUpload();
                              }}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                        
                        {analyzing && (
                          <div className="space-y-2">
                            <Progress value={analysisProgress} className="h-2 w-full" />
                            <p className="text-xs text-center text-muted-foreground">
                              {Math.round(analysisProgress)}% - {
                                analysisProgress < 30 ? "Loading image data..." :
                                analysisProgress < 60 ? "Analyzing facial features..." :
                                analysisProgress < 90 ? "Running neural network detection..." :
                                "Finalizing results..."
                              }
                            </p>
                          </div>
                        )}
                        
                        {analysisError && (
                          <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              {analysisError}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="cyber-card">
                    <CardHeader>
                      <CardTitle>How it works</CardTitle>
                      <CardDescription>
                        Understanding our deepfake detection system
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-cyber-muted">
                        Our advanced deepfake detection system uses NVIDIA's AI technology to analyze images for signs of manipulation or artificially generated content.
                      </p>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">The system detects:</h3>
                        <ul className="list-disc pl-5 text-cyber-muted">
                          <li>Face inconsistencies and abnormalities</li>
                          <li>Unusual lighting patterns</li>
                          <li>Artifacts from AI generation</li>
                          <li>Blending inconsistencies</li>
                          <li>Unnatural textures</li>
                          <li>Metadata anomalies</li>
                        </ul>
                      </div>
                      
                      <div className="bg-cyber-primary/10 p-4 rounded-lg">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Info className="h-4 w-4 text-primary" />
                          Analysis Results:
                        </h4>
                        <p className="text-cyber-muted text-sm">
                          After analysis, the system provides a comprehensive report including confidence scores, detected faces, and potential manipulation indicators. The analysis uses neural network technology for high-accuracy results.
                        </p>
                      </div>
                      
                      <div className="text-xs text-muted-foreground bg-cyber-secondary/5 p-2 rounded">
                        <p>Powered by NVIDIA's advanced deepfake detection technology.</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="results">
                <div className="space-y-6">
                  {analysisResults.length === 0 ? (
                    <Card className="cyber-card text-center py-12">
                      <CardContent className="flex flex-col items-center justify-center">
                        <Shield className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                        <p className="text-muted-foreground mb-4">No analysis results yet.</p>
                        <Button onClick={() => setActiveTab('upload')}>
                          Upload an image to analyze
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      <div className="flex justify-end mb-4">
                        <Button 
                          variant="outline" 
                          onClick={handleClearAllResults}
                          className="text-sm"
                        >
                          Clear All Results
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {analysisResults.map((result) => (
                          <DeepfakeReport 
                            key={result.analysisId}
                            result={result}
                            imageSrc={result.imageUrl}
                            onClose={() => handleClearResult(result.analysisId || '')}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
