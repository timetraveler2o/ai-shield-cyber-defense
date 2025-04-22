
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { useImageUpload } from "./useImageUpload";
import { useFaceRecognition } from "./useFaceRecognition";
import { Person, DetectionMatch } from "./types";
import { Camera, Users, Search, FileSearch } from "lucide-react";
import { MatchResultCard } from "./MatchResultCard";

interface FaceRecognitionPanelProps {
  people: Person[];
  onUpdatePerson: (updatedPerson: Person) => void;
}

export function FaceRecognitionPanel({ people, onUpdatePerson }: FaceRecognitionPanelProps) {
  const { toast } = useToast();
  const { uploadImage, uploadingImage, uploadProgress } = useImageUpload();
  const { loading, processingProgress, generateFaceDescriptor, findMatches } = useFaceRecognition();
  const [scanImageUrl, setScanImageUrl] = useState("");
  const [processingFaces, setProcessingFaces] = useState(false);
  const [matches, setMatches] = useState<DetectionMatch[]>([]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const imageUrl = await uploadImage(file);
    
    if (imageUrl) {
      setScanImageUrl(imageUrl);
      setMatches([]);
    }
  };

  const handleScanImage = async () => {
    if (!scanImageUrl) {
      toast({
        title: "No Image",
        description: "Please upload an image to scan for faces.",
        variant: "destructive",
      });
      return;
    }

    try {
      setProcessingFaces(true);
      const detectedMatches = await findMatches(scanImageUrl, people);
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
        const descriptor = await generateFaceDescriptor(person.imageUrl);
        if (descriptor) {
          const updatedPerson = { ...person, faceDescriptor: descriptor };
          onUpdatePerson(updatedPerson);
          processedCount++;
        }
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="imageUpload" className="flex items-center gap-2">
                Upload Image to Scan
                <Camera className="h-4 w-4" />
              </Label>
              <Input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="mt-1"
              />
              {uploadingImage && (
                <Progress value={uploadProgress || 0} className="mt-2 h-2" />
              )}
            </div>
            <div className="flex flex-col justify-end">
              <Button 
                onClick={handleScanImage} 
                disabled={!scanImageUrl || processingFaces}
                className="mt-4"
              >
                <Search className="mr-2 h-4 w-4" />
                Scan for Matches
              </Button>
            </div>
          </div>

          {scanImageUrl && (
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div>
                <h3 className="text-sm font-medium mb-2">Uploaded Image:</h3>
                <div className="relative w-48 h-48 overflow-hidden border border-cyber-primary/20 rounded-md">
                  <img 
                    src={scanImageUrl} 
                    alt="Uploaded" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                {loading && (
                  <div className="space-y-2">
                    <p className="text-sm">Processing image...</p>
                    <Progress value={processingProgress || 0} className="h-2" />
                  </div>
                )}
                
                {matches.length > 0 && (
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
                )}
              </div>
            </div>
          )}

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
