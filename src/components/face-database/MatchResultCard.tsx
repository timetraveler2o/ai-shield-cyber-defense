
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Person, DetectionMatch } from "./types";
import { useState } from "react";
import { FaceDetectionPreview } from "./FaceDetectionPreview";

interface MatchResultCardProps {
  match: DetectionMatch;
  person: Person;
}

export function MatchResultCard({ match, person }: MatchResultCardProps) {
  const confidencePercent = Math.round(match.matchConfidence * 100);
  const [showDetection, setShowDetection] = useState(false);
  
  // Format confidence as color
  const getConfidenceColor = () => {
    if (confidencePercent > 80) return "bg-green-500";
    if (confidencePercent > 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Card className="border-cyber-primary/20 bg-cyber-background/40 overflow-hidden">
      <div className="flex flex-col">
        <div className="flex flex-col sm:flex-row">
          <div className="flex-shrink-0 sm:w-1/3">
            <div className="aspect-square sm:h-full overflow-hidden">
              <img
                src={person.imageUrl}
                alt={person.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <CardContent className="flex-1 p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{person.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Age: {person.age} | Last Seen: {person.lastSeen}
                </p>
              </div>
              <Badge className={`${getConfidenceColor()} ml-2`}>
                {confidencePercent}% Match
              </Badge>
            </div>
            
            <div className="mt-3 grid gap-2">
              <div>
                <p className="text-xs font-medium">Match Details:</p>
                <p className="text-sm">
                  Detected on {match.timestamp} at {match.location}
                </p>
              </div>
              
              {person.status && (
                <div>
                  <p className="text-xs font-medium">Status:</p>
                  <Badge variant="outline" className="mt-1">
                    {person.status.charAt(0).toUpperCase() + person.status.slice(1)}
                  </Badge>
                </div>
              )}
              
              <button
                onClick={() => setShowDetection(!showDetection)}
                className="text-xs text-cyber-primary hover:underline mt-2"
              >
                {showDetection ? "Hide detection details" : "Show detection details"}
              </button>
            </div>
          </CardContent>
        </div>
        
        {showDetection && match.faceBox && (
          <div className="p-4 border-t border-cyber-primary/10">
            <h4 className="text-sm font-medium mb-2">Detection Preview:</h4>
            <FaceDetectionPreview 
              mediaUrl={match.imageUrl} 
              detectedFaces={[match.faceBox]} 
            />
          </div>
        )}
      </div>
    </Card>
  );
}
