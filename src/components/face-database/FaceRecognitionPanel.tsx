import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useImageUpload } from "./useImageUpload";
import { useFaceRecognition } from "./useFaceRecognition";
import { useNvidiaDeepfakeDetection } from "./useNvidiaDeepfakeDetection";
import { Person, DetectionMatch, DeepfakeAnalysisResult } from "./types";
import { 
  Camera, 
  Users, 
  Search, 
  FileSearch, 
  Film, 
  Scan, 
  AlertTriangle, 
  RefreshCw, 
  User, 
  Info,
  Shield,
  Image
} from "lucide-react";
import { MatchResultCard } from "./MatchResultCard";
import { FaceDetectionPreview } from "./FaceDetectionPreview";
import { DeepfakeReport } from "./DeepfakeReport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  saveDeepfakeResult,
  saveDetectionMatch
} from "@/utils/localStorageUtils";

interface FaceRecognitionPanelProps {
  people: Person[];
  onUpdatePerson: (updatedPerson: Person) => void;
}

export function FaceRecognitionPanel({ people, onUpdatePerson }: FaceRecognitionPanelProps) {
  const { toast } = useToast();
  const { uploadState, uploadedImage, uploadImage, resetUpload } = useImageUpload();
  const { 
    loading, 
    processingProgress, 
    detectedFaces,
    findMatches,
    processVideoFrames,
    lastError,
    retryModelLoading,
    generateFaceDescriptor
  } = useFaceRecognition();
  const {
    analyzeImage,
    analyzing,
    analysisProgress
  } = useNvidiaDeepfakeDetection();
  
  const [scanImageUrl, setScanImageUrl] = useState("");
  const [processingFaces, setProcessingFaces] = useState(false);
  const [matches, setMatches] = useState<DetectionMatch[]>([]);
  const [isVideo, setIsVideo] = useState(false);
  const [isLiveDetection, setIsLiveDetection] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [deepfakeResult, setDeepfakeResult] = useState<DeepfakeAnalysisResult | null>(null);
  const [isDeepfakeReportOpen, setIsDeepfakeReportOpen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoFrameIntervalRef = useRef<number | null>(null);

  // Initialize face recognition when component mounts
  useEffect(() => {
    const initFaceApi = async () => {
      try {
        await retryModelLoading();
      } catch (error) {
        console.error("Failed to initialize face recognition:", error);
      }
    };
    
    initFaceApi();
  }, []);

  // Reset matches when changing tabs
  useEffect(() => {
    if (activeTab === "upload") {
      // Stop any active video detection
      if (isLiveDetection) {
        toggleLiveDetection();
      }
    }
  }, [activeTab]);

  const handleVideoLoaded = (videoElement: HTMLVideoElement) => {
    videoRef.current = videoElement;
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileType = file.type;
    const isVideoFile = fileType.startsWith('video/');
    
    setIsVideo(isVideoFile);
    setMatches([]);
    setDeepfakeResult(null);
    
    try {
      const mediaUrl = await uploadImage(file);
      
      if (mediaUrl) {
        setScanImageUrl(mediaUrl);
        
        // If it's a video, don't scan automatically
        if (!isVideoFile) {
          handleScanImage(mediaUrl);
        }
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload media. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleScanImage = async (imageUrlToScan?: string) => {
    const urlToScan = imageUrlToScan || scanImageUrl;
    
    if (!urlToScan) {
      toast({
        title: "No Media",
        description: "Please upload an image or video to scan for faces.",
        variant: "destructive",
      });
      return;
    }

    try {
      setProcessingFaces(true);
      const detectedMatches = await findMatches(urlToScan, people);
      
      if (detectedMatches.length === 0) {
        toast({
          title: "No Matches",
          description: "No faces found in the image.",
        });
      } else {
        // Save matches to local storage
        detectedMatches.forEach(match => {
          saveDetectionMatch(match);
        });
        
        setMatches(detectedMatches);
        
        // Update the lastDetected information for matched persons
        detectedMatches.forEach(match => {
          if (match.personId !== 'unknown') {
            const person = people.find(p => p.id === match.personId);
            if (person) {
              const updatedPerson = {
                ...person,
                lastDetectedAt: match.timestamp,
                lastDetectedLocation: match.location,
                status: person.status === 'missing' ? 'investigating' : person.status
              };
              onUpdatePerson(updatedPerson);
            }
          }
        });

        // Switch to results tab automatically when matches are found
        setActiveTab("results");
        
        toast({
          title: "Detection Complete",
          description: `Found ${detectedMatches.length} faces in the image.`,
        });
      }
    } catch (error) {
      console.error("Face scanning error:", error);
      toast({
        title: "Scanning Error",
        description: "An error occurred while scanning the image.",
        variant: "destructive",
      });
    } finally {
      setProcessingFaces(false);
    }
  };

  const handleDeepfakeDetection = async () => {
    if (!scanImageUrl) {
      toast({
        title: "No Media",
        description: "Please upload an image to analyze for deepfakes.",
        variant: "destructive",
      });
      return;
    }
    
    if (isVideo) {
      toast({
        title: "Video Not Supported",
        description: "Deepfake detection currently only supports image files.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const result = await analyzeImage(scanImageUrl);
      
      if (result) {
        result.imageUrl = scanImageUrl;
        setDeepfakeResult(result);
        setIsDeepfakeReportOpen(true);
        
        // Save the result to local storage
        saveDeepfakeResult(result);
        
        // Automatically switch to the deepfake tab
        setActiveTab("deepfake");
        
        toast({
          title: "Analysis Complete",
          description: result.isDeepfake 
            ? "The image appears to be manipulated or synthetically generated."
            : "The image appears to be authentic.",
          variant: result.isDeepfake ? "destructive" : "default",
        });
      }
    } catch (error) {
      console.error("Deepfake analysis error:", error);
      toast({
        title: "Analysis Error",
        description: "An error occurred during deepfake analysis.",
        variant: "destructive",
      });
    }
  };

  const toggleLiveDetection = () => {
    if (isLiveDetection) {
      // Stop live detection
      if (videoFrameIntervalRef.current !== null) {
        window.clearInterval(videoFrameIntervalRef.current);
        videoFrameIntervalRef.current = null;
      }
      setIsLiveDetection(false);
    } else {
      // Start live detection
      if (videoRef.current && isVideo) {
        videoRef.current.play();
        
        // Process video frames at regular intervals
        videoFrameIntervalRef.current = window.setInterval(() => {
          if (videoRef.current && !processingFaces) {
            setProcessingFaces(true);
            processVideoFrames(videoRef.current, people, (newMatches) => {
              if (newMatches.length > 0) {
                // Save matches to local storage
                newMatches.forEach(match => {
                  saveDetectionMatch(match);
                });
                
                setMatches(prev => {
                  // Combine matches, avoiding duplicates based on personId
                  const personIds = new Set(prev.map(m => m.personId));
                  const filteredNewMatches = newMatches.filter(m => !personIds.has(m.personId) || m.personId === 'unknown');
                  return [...prev, ...filteredNewMatches];
                });
                
                // Update matched person information
                newMatches.forEach(match => {
                  if (match.personId !== 'unknown') {
                    const person = people.find(p => p.id === match.personId);
                    if (person) {
                      const updatedPerson = {
                        ...person,
                        lastDetectedAt: match.timestamp,
                        lastDetectedLocation: match.location,
                        status: person.status === 'missing' ? 'investigating' : person.status
                      };
                      onUpdatePerson(updatedPerson);
                    }
                  }
                });
                
                // Notify if new matches found
                toast({
                  title: "Detection Update",
                  description: `Found ${newMatches.length} new faces in the video.`,
                });
                
                // Switch to results tab automatically
                setActiveTab("results");
              }
              setProcessingFaces(false);
            });
          }
        }, 1000); // Process every 1 second
        
        setIsLiveDetection(true);
      } else {
        toast({
          title: "No Video",
          description: "Please upload a video file to use live detection.",
          variant: "destructive",
        });
      }
    }
  };

  const generateMissingDescriptors = async () => {
    const peopleWithoutDescriptors = people.filter(
      person => !person.faceDescriptor && person.imageUrl
    );

    if (peopleWithoutDescriptors.length === 0) {
      toast({
        title: "Processing Complete",
        description: "All people in the database already have face descriptors.",
      });
      return;
    }

    setProcessingFaces(true);
    let processedCount = 0;
    let errorCount = 0;

    for (const person of peopleWithoutDescriptors) {
      try {
        console.log(`Generating face descriptor for ${person.name} with image: ${person.imageUrl}`);
        
        // Use the generateFaceDescriptor function instead
        const descriptor = await generateFaceDescriptor(person.imageUrl);
        
        if (!descriptor) {
          console.error(`No face detected for ${person.name}`);
          toast({
            title: "Face Detection Failed",
            description: `Could not detect a face in ${person.name}'s image.`,
            variant: "destructive",
          });
          errorCount++;
          continue;
        }
        
        console.log(`Generated descriptor for ${person.name}: ${descriptor.length} values`);
        
        // Update the person with the generated descriptor
        const updatedPerson = { 
          ...person, 
          faceDescriptor: descriptor
        };
        
        onUpdatePerson(updatedPerson);
        processedCount++;
        
        toast({
          title: "Face Processed",
          description: `Generated face descriptor for ${person.name}.`,
        });
      } catch (error) {
        console.error(`Error processing ${person.name}:`, error);
        toast({
          title: "Processing Error",
          description: `Failed to generate face descriptor for ${person.name}.`,
          variant: "destructive",
        });
        errorCount++;
      }
    }

    setProcessingFaces(false);
    toast({
      title: "Processing Complete",
      description: `Generated face descriptors for ${processedCount} people. Failed for ${errorCount} people.`,
    });
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (videoFrameIntervalRef.current !== null) {
        window.clearInterval(videoFrameIntervalRef.current);
      }
    };
  }, []);

  return (
    <Card className="border-cyber-primary/20 bg-cyber-dark">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5 text-cyber-primary" />
          Deepfake Detection System
        </CardTitle>
      </CardHeader>
      <CardContent>
        {lastError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Model Loading Error</AlertTitle>
            <AlertDescription>
              Failed to load facial recognition models. Please try again.
              <Button 
                variant="outline" 
                size="sm" 
                onClick={retryModelLoading} 
                className="ml-2 mt-2"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Loading Models
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-6">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="upload">Upload Media</TabsTrigger>
              <TabsTrigger value="results">Face Results</TabsTrigger>
              {isDeepfakeReportOpen && (
                <TabsTrigger value="deepfake">Deepfake Analysis</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mediaUpload" className="flex items-center gap-2">
                    Upload Image or Video to Analyze
                    <Camera className="h-4 w-4" />
                  </Label>
                  <Input
                    id="mediaUpload"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    disabled={uploadState === "uploading" || loading}
                    className="mt-1"
                  />
                  {uploadState === "uploading" && (
                    <Progress value={uploadState === "uploading" ? 100 : 0} className="mt-2 h-2" />
                  )}
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <Button 
                    onClick={handleDeepfakeDetection} 
                    disabled={!scanImageUrl || analyzing || isVideo}
                    className="mt-4 bg-cyber-primary hover:bg-cyber-primary/80"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Detect Deepfake
                  </Button>
                  
                  <Button 
                    onClick={() => handleScanImage()} 
                    disabled={!scanImageUrl || processingFaces || loading}
                    variant="outline"
                    className="mt-4 border-cyber-primary/30"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Scan for Faces
                  </Button>
                  
                  {isVideo && (
                    <Button
                      onClick={toggleLiveDetection}
                      disabled={!scanImageUrl || processingFaces || loading}
                      variant={isLiveDetection ? "destructive" : "secondary"}
                      className="mt-4"
                    >
                      {isLiveDetection ? (
                        <>
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Stop Live Detection
                        </>
                      ) : (
                        <>
                          <Film className="mr-2 h-4 w-4" />
                          Start Live Detection
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {scanImageUrl && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Preview:</h3>
                  <FaceDetectionPreview 
                    mediaUrl={scanImageUrl} 
                    detectedFaces={detectedFaces} 
                    isVideo={isVideo}
                    onVideoLoaded={handleVideoLoaded}
                  />
                  
                  {(loading || processingFaces) && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <Scan className="h-4 w-4 mr-2 animate-pulse text-cyber-primary" />
                        <p className="text-sm">Processing media...</p>
                      </div>
                      <Progress value={processingProgress || 0} className="h-2" />
                    </div>
                  )}
                  
                  {analyzing && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 animate-pulse text-cyber-primary" />
                        <p className="text-sm">Analyzing for deepfakes...</p>
                      </div>
                      <Progress value={analysisProgress || 0} className="h-2" />
                    </div>
                  )}
                </div>
              )}
              
              <div className="bg-cyber-primary/10 p-3 rounded-md mt-4">
                <div className="flex items-start space-x-2">
                  <Info className="h-5 w-5 text-cyber-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Detection Capabilities</h4>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                      <li>• Advanced neural network analysis of image authenticity</li>
                      <li>• Detection of AI-generated and manipulated images</li>
                      <li>• Face recognition and demographic analysis</li>
                      <li>• Deepfake detection with confidence scoring</li>
                      <li>• Digital forensic report generation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="results">
              {matches.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Face Detection Results:</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setMatches([])}
                    >
                      Clear Results
                    </Button>
                  </div>
                  <div className="grid gap-4">
                    {matches.map((match, index) => {
                      const matchedPerson = people.find(p => p.id === match.personId);
                      return (
                        <MatchResultCard 
                          key={index} 
                          match={match} 
                          person={matchedPerson} 
                        />
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileSearch className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No faces detected yet. Upload an image or video and scan for faces.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="deepfake">
              {deepfakeResult && scanImageUrl && (
                <DeepfakeReport
                  result={deepfakeResult}
                  imageSrc={scanImageUrl}
                  onClose={() => setIsDeepfakeReportOpen(false)}
                />
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-4 border-t border-cyber-primary/10">
            <Button 
              onClick={generateMissingDescriptors} 
              disabled={processingFaces}
              variant="outline"
            >
              <Users className="mr-2 h-4 w-4" />
              Generate Face Descriptors for Database
            </Button>
            {processingFaces && (
              <Progress value={processingProgress || 0} className="mt-2 h-2" />
            )}
            <p className="text-xs text-muted-foreground mt-2">
              This will process all missing person images to enable face recognition for reference database.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
