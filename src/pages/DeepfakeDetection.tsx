
import { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { Header } from '@/components/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FaceDetectionPreview } from '@/components/face-database/FaceDetectionPreview';
import { DeepfakeReport } from '@/components/face-database/DeepfakeReport';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Person, DeepfakeAnalysisResult } from '@/components/face-database/types';
import { getDeepfakeResults, saveDeepfakeResult } from '@/utils/localStorageUtils';
import { useImageUpload } from '@/components/face-database/useImageUpload';
import { useNvidiaDeepfakeDetection } from '@/components/face-database/useNvidiaDeepfakeDetection';

export default function DeepfakeDetection() {
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [analysisResults, setAnalysisResults] = useState<DeepfakeAnalysisResult[]>([]);
  const [demoPersons] = useState<Person[]>([
    {
      id: uuidv4(),
      name: "Demo Person",
      age: 32,
      lastSeen: new Date().toISOString(),
      dateAdded: new Date().toISOString(),
      imageUrl: "/placeholder.svg",
      status: "investigating" as const // Cast to the specific literal type
    }
  ]);
  
  // Add sample data if empty
  useEffect(() => {
    const storedResults = getDeepfakeResults();
    if (storedResults.length === 0) {
      // No sample data, show empty state
      setAnalysisResults([]);
    } else {
      setAnalysisResults(storedResults);
    }
  }, []);

  // Custom hooks for image upload and deepfake detection
  const { 
    uploadState, 
    uploadedImage, 
    uploadImage, 
    resetUpload 
  } = useImageUpload();

  const {
    detectDeepfake,
    isProcessing,
    deepfakeResult,
  } = useNvidiaDeepfakeDetection();

  // Handle image upload and analysis
  const handleAnalyzeImage = async () => {
    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }

    try {
      await detectDeepfake(uploadedImage);
      
      if (deepfakeResult) {
        // Save to local storage
        saveDeepfakeResult(deepfakeResult);
        
        // Update state
        setAnalysisResults(prev => [...prev, deepfakeResult]);
        
        // Navigate to results tab
        setActiveTab('results');
        toast.success("Image successfully analyzed");
      }
    } catch (error) {
      toast.error("Failed to analyze image");
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen bg-cyber-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-cyber-background">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-white">Deepfake Detection System</h1>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="upload">Upload Image</TabsTrigger>
                <TabsTrigger value="results">Analysis Results</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-cyber-dark border-cyber-primary/20">
                    <CardHeader>
                      <CardTitle>Upload Image</CardTitle>
                      <CardDescription>
                        Upload an image to analyze for potential deepfake manipulation
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <FaceDetectionPreview 
                          persons={demoPersons}
                          uploadState={uploadState}
                          uploadedImage={uploadedImage}
                          onUpload={uploadImage}
                          onReset={resetUpload}
                        />
                        
                        <Button 
                          onClick={handleAnalyzeImage}
                          disabled={!uploadedImage || isProcessing}
                          className="w-full"
                        >
                          {isProcessing ? "Processing..." : "Analyze for Deepfake"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-cyber-dark border-cyber-primary/20">
                    <CardHeader>
                      <CardTitle>How it works</CardTitle>
                      <CardDescription>
                        Understanding our deepfake detection system
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-cyber-muted">
                        Our advanced deepfake detection system uses AI to analyze images for signs of manipulation or artificially generated content.
                      </p>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">The system detects:</h3>
                        <ul className="list-disc pl-5 text-cyber-muted">
                          <li>Face inconsistencies</li>
                          <li>Unusual lighting patterns</li>
                          <li>Artifacts from AI generation</li>
                          <li>Blending inconsistencies</li>
                          <li>Unnatural textures</li>
                        </ul>
                      </div>
                      
                      <div className="bg-cyber-background/30 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Analysis Results:</h4>
                        <p className="text-cyber-muted text-sm">
                          After analysis, the system provides a confidence score indicating the likelihood of the image being manipulated, along with visual heatmaps highlighting suspicious areas.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="results">
                <div className="space-y-6">
                  {analysisResults.length === 0 ? (
                    <Card className="bg-cyber-dark border-cyber-primary/20">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-cyber-muted mb-4">No analysis results yet.</p>
                        <Button onClick={() => setActiveTab('upload')}>
                          Upload an image to analyze
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {analysisResults.map((result, index) => (
                          <DeepfakeReport 
                            key={result.analysisId || index}
                            result={result}
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
