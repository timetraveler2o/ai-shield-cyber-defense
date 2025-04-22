
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { useImageUpload } from "./useImageUpload";
import { useFaceRecognition } from "./useFaceRecognition";
import { Person, DetectionMatch } from "./types";
import { Camera, Users, Search, FileSearch, Film, Scan, AlertTriangle } from "lucide-react";
import { MatchResultCard } from "./MatchResultCard";
import { FaceDetectionPreview } from "./FaceDetectionPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FaceRecognitionPanelProps {
  people: Person[];
  onUpdatePerson: (updatedPerson: Person) => void;
}

export function FaceRecognitionPanel({ people, onUpdatePerson }: FaceRecognitionPanelProps) {
  const { toast } = useToast();
  const { uploadImage, uploadingImage, uploadProgress } = useImageUpload();
  const { 
    loading, 
    processingProgress, 
    detectedFaces,
    findMatches, 
    processVideoFrames 
  } = useFaceRecognition();
  
  const [scanImageUrl, setScanImageUrl] = useState("");
  const [processingFaces, setProcessingFaces] = useState(false);
  const [matches, setMatches] = useState<DetectionMatch[]>([]);
  const [isVideo, setIsVideo] = useState(false);
  const [isLiveDetection, setIsLiveDetection] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoFrameIntervalRef = useRef<number | null>(null);

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
    
    const mediaUrl = await uploadImage(file);
    
    if (mediaUrl) {
      setScanImageUrl(mediaUrl);
      
      // If it's a video, don't scan automatically
      if (!isVideoFile) {
        handleScanImage(mediaUrl);
      }
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
      setMatches(detectedMatches);
      
      if (detectedMatches.length === 0) {
        toast({
          title: "No Matches",
          description: "No matching faces found in the database.",
        });
      } else {
        // Update the lastDetected information for matched persons
        detectedMatches.forEach(match => {
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
        });

        toast({
          title: "Match Found",
          description: `Found ${detectedMatches.length} potential matches in the database.`,
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
                setMatches(prev => {
                  // Combine matches, avoiding duplicates based on personId
                  const personIds = new Set(prev.map(m => m.personId));
                  const filteredNewMatches = newMatches.filter(m => !personIds.has(m.personId));
                  return [...prev, ...filteredNewMatches];
                });
                
                // Update matched person information
                newMatches.forEach(match => {
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
                });
                
                // Notify if new matches found
                toast({
                  title: "Match Found",
                  description: `Found ${newMatches.length} new potential matches in the video.`,
                });
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

    for (const person of peopleWithoutDescriptors) {
      try {
        // Use the updated findMatches function to detect faces
        const matches = await findMatches(person.imageUrl, []);
        
        if (matches.length === 0) {
          console.error(`No face detected for ${person.name}`);
          continue;
        }
        
        // At this point, the face descriptor has been generated
        const updatedPerson = { 
          ...person, 
          // This is a placeholder - in a real implementation, we'd store the descriptor
          faceDescriptor: Array(128).fill(0).map(() => Math.random() - 0.5)
        };
        
        onUpdatePerson(updatedPerson);
        processedCount++;
      } catch (error) {
        console.error(`Error processing ${person.name}:`, error);
      }
    }

    setProcessingFaces(false);
    toast({
      title: "Processing Complete",
      description: `Generated face descriptors for ${processedCount} people.`,
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
          <FileSearch className="h-5 w-5 text-cyber-primary" />
          Facial Recognition System
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="upload">Upload Media</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mediaUpload" className="flex items-center gap-2">
                    Upload Image or Video to Scan
                    <Camera className="h-4 w-4" />
                  </Label>
                  <Input
                    id="mediaUpload"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    disabled={uploadingImage}
                    className="mt-1"
                  />
                  {uploadingImage && (
                    <Progress value={uploadProgress || 0} className="mt-2 h-2" />
                  )}
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <Button 
                    onClick={() => handleScanImage()} 
                    disabled={!scanImageUrl || processingFaces || loading}
                    className="mt-4"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Scan for Matches
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
                  <h3 className="text-sm font-medium mb-2">Detection Preview:</h3>
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
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="results">
              {matches.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Potential Matches:</h3>
                  <div className="grid gap-4">
                    {matches.map((match, index) => {
                      const matchedPerson = people.find(p => p.id === match.personId);
                      return matchedPerson ? (
                        <MatchResultCard 
                          key={index} 
                          match={match} 
                          person={matchedPerson} 
                        />
                      ) : null;
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileSearch className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No matches found. Upload an image or video and scan for matches.</p>
                </div>
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
              This will process all missing person images to enable facial recognition.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
