import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Video, Upload, BarChart, AlertTriangle, Users, CheckCircle, User, Database, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { StatisticsChart } from "@/components/StatisticsChart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const deepfakeTypeData = [
  { name: "Face Swap", value: 145, fill: "#9b87f5" },
  { name: "Voice Clone", value: 87, fill: "#0FA0CE" },
  { name: "Full Synthetic", value: 53, fill: "#ea384c" },
  { name: "Lip Sync", value: 78, fill: "#8B5CF6" },
  { name: "Expression Swap", value: 63, fill: "#f97316" },
];

const faceEntrySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  age: z.string().refine((val) => !isNaN(parseInt(val)), { message: "Age must be a number" }),
  crime: z.string().min(2, { message: "Crime details required" }),
  notes: z.string().optional(),
});

const videoAnalysisSchema = z.object({
  caseNumber: z.string().optional(),
  notes: z.string().optional(),
});

type FaceEntryValues = z.infer<typeof faceEntrySchema>;
type VideoAnalysisValues = z.infer<typeof videoAnalysisSchema>;

export default function DeepfakeDetection() {
  const [faceImage, setFaceImage] = useState<File | null>(null);
  const [faceImagePreview, setFaceImagePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFilename, setVideoFilename] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [matchResults, setMatchResults] = useState<Array<{
    confidence: number;
    name: string;
    age: string;
    crime: string;
    timestamp: string;
    faceImageUrl: string;
  }>>([]);
  const [activeTab, setActiveTab] = useState("detection");
  const [faceDbEntries, setFaceDbEntries] = useState<Array<{
    id: string;
    name: string;
    age: string;
    crime: string;
    created_at: string;
    face_url: string;
  }>>([]);
  const [dbLoading, setDbLoading] = useState(false);

  const faceEntryForm = useForm<FaceEntryValues>({
    resolver: zodResolver(faceEntrySchema),
    defaultValues: {
      name: "",
      age: "",
      crime: "",
      notes: "",
    },
  });

  const videoAnalysisForm = useForm<VideoAnalysisValues>({
    resolver: zodResolver(videoAnalysisSchema),
    defaultValues: {
      caseNumber: "",
      notes: "",
    },
  });

  const handleFaceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFaceImage(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setFaceImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setVideoFilename(file.name);
    }
  };

  const onFaceEntrySubmit = async (data: FaceEntryValues) => {
    if (!faceImage) {
      toast({
        title: "Error",
        description: "Please upload a face image",
        variant: "destructive",
      });
      return;
    }

    try {
      const timestamp = new Date().getTime();
      const fileExt = faceImage.name.split('.').pop();
      const fileName = `${timestamp}-${data.name.replace(/\s+/g, '-').toLowerCase()}.${fileExt}`;
      const filePath = `faces/${fileName}`;

      toast({
        title: "Adding to database...",
        description: "Please wait while we process the face data",
      });

      setTimeout(() => {
        const newEntry = {
          id: Math.random().toString(36).substring(2, 15),
          name: data.name,
          age: data.age,
          crime: data.crime,
          created_at: new Date().toISOString(),
          face_url: faceImagePreview as string,
        };

        setFaceDbEntries(prev => [...prev, newEntry]);

        faceEntryForm.reset();
        setFaceImage(null);
        setFaceImagePreview(null);

        toast({
          title: "Success",
          description: "Face successfully added to the database",
          variant: "default",
        });

        setActiveTab("database");
      }, 1500);
    } catch (error) {
      console.error("Error adding face to database:", error);
      toast({
        title: "Error",
        description: "Failed to add face to database",
        variant: "destructive",
      });
    }
  };

  const analyzeVideo = async (data: VideoAnalysisValues) => {
    if (!videoFile) {
      toast({
        title: "Error",
        description: "Please upload a video for analysis",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    setAnalysisProgress(0);
    setMatchResults([]);

    const totalFrames = 100;
    let currentFrame = 0;
    
    toast({
      title: "Analysis Started",
      description: "Processing video frames for face matches",
    });

    const interval = setInterval(() => {
      currentFrame += 5;
      const progress = Math.min((currentFrame / totalFrames) * 100, 100);
      setAnalysisProgress(progress);

      if (faceDbEntries.length > 0 && (currentFrame === 25 || currentFrame === 60 || currentFrame === 85)) {
        const randomEntry = faceDbEntries[Math.floor(Math.random() * faceDbEntries.length)];
        const newMatch = {
          confidence: Math.floor(85 + Math.random() * 15),
          name: randomEntry.name,
          age: randomEntry.age,
          crime: randomEntry.crime,
          timestamp: `00:${Math.floor(Math.random() * 5)}${Math.floor(Math.random() * 9)}:${Math.floor(Math.random() * 5)}${Math.floor(Math.random() * 9)}`,
          faceImageUrl: randomEntry.face_url,
        };
        
        setMatchResults(prev => [...prev, newMatch]);
        
        toast({
          title: "Match Found",
          description: `Found match for ${randomEntry.name} with ${newMatch.confidence}% confidence`,
        });
      }

      if (currentFrame >= totalFrames) {
        clearInterval(interval);
        setAnalyzing(false);
        videoAnalysisForm.reset();
        
        toast({
          title: "Analysis Complete",
          description: `Found ${matchResults.length + 1} matches in the video`,
        });
        
        if (faceDbEntries.length > 0) {
          const lastEntry = faceDbEntries[0];
          const finalMatch = {
            confidence: 99,
            name: lastEntry.name,
            age: lastEntry.age,
            crime: lastEntry.crime,
            timestamp: `00:01:17`,
            faceImageUrl: lastEntry.face_url,
          };
          
          setMatchResults(prev => [...prev, finalMatch]);
        }
      }
    }, 200);

    return () => clearInterval(interval);
  };

  const loadFaceDatabase = () => {
    setDbLoading(true);
    setTimeout(() => {
      if (faceDbEntries.length === 0) {
        setFaceDbEntries([
          {
            id: "1",
            name: "John Smith",
            age: "34",
            crime: "Fraud, Identity Theft",
            created_at: "2023-11-15T08:30:00Z",
            face_url: "https://i.pravatar.cc/150?img=1",
          },
          {
            id: "2",
            name: "Aakash Patel",
            age: "29",
            crime: "Cyber Stalking",
            created_at: "2023-12-03T14:22:10Z",
            face_url: "https://i.pravatar.cc/150?img=2",
          },
          {
            id: "3",
            name: "Sameer Khan",
            age: "41",
            crime: "Financial Scam",
            created_at: "2024-01-21T11:45:30Z",
            face_url: "https://i.pravatar.cc/150?img=3",
          },
        ]);
      }
      setDbLoading(false);
    }, 1000);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "database" && faceDbEntries.length === 0) {
      loadFaceDatabase();
    }
  };

  return (
    <div className="flex h-screen bg-cyber-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-cyber-background">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <Card className="border-cyber-primary/20 bg-cyber-dark">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Deepfake Detection</CardTitle>
                <CardDescription>AI-powered media forensics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">426</span>
                    <span className="text-xs text-cyber-muted">Deepfakes detected this month</span>
                  </div>
                  <Video className="h-10 w-10 text-cyber-primary" />
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Detection Accuracy</span>
                    <span>94.2%</span>
                  </div>
                  <Progress value={94.2} className="h-1" indicatorClassName="bg-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-cyber-primary/20 bg-cyber-dark">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Face Database</CardTitle>
                <CardDescription>Known individuals tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">{faceDbEntries.length}</span>
                    <span className="text-xs text-cyber-muted">Faces in tracking database</span>
                  </div>
                  <Database className="h-10 w-10 text-cyber-primary" />
                </div>
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full" 
                    onClick={() => {
                      setActiveTab("facedatabase"); 
                      loadFaceDatabase();
                    }}
                  >
                    Manage Face Database
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-cyber-primary/20 bg-cyber-dark">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Video Analysis</CardTitle>
                <CardDescription>AI-powered face matching</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">{matchResults.length}</span>
                    <span className="text-xs text-cyber-muted">Matches in current session</span>
                  </div>
                  <Shield className="h-10 w-10 text-cyber-primary" />
                </div>
                <div className="mt-4">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="w-full" 
                    onClick={() => setActiveTab("detection")}
                  >
                    Start Video Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="detection" value={activeTab} onValueChange={handleTabChange} className="mb-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto">
              <TabsTrigger value="detection">Detection Tool</TabsTrigger>
              <TabsTrigger value="facedatabase">Add Face</TabsTrigger>
              <TabsTrigger value="database">Face Database</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="detection" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-cyber-primary/20 bg-cyber-dark">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Video Analyzer</CardTitle>
                    <CardDescription>Upload video to detect faces</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...videoAnalysisForm}>
                      <form onSubmit={videoAnalysisForm.handleSubmit(analyzeVideo)} className="space-y-4">
                        <div className="bg-cyber-background/30 border border-dashed border-cyber-primary/20 rounded-md p-6 flex flex-col items-center justify-center">
                          <Video className="h-12 w-12 text-cyber-primary mb-2" />
                          <p className="text-sm text-center text-cyber-muted">
                            {videoFilename ? videoFilename : "Drop video files here or click to upload"}
                          </p>
                          <div className="flex gap-2 mt-4">
                            <Button 
                              type="button" 
                              variant="default" 
                              size="sm"
                              onClick={() => document.getElementById('video-upload')?.click()}
                            >
                              Select Video
                            </Button>
                            <input
                              id="video-upload"
                              type="file"
                              accept="video/*"
                              onChange={handleVideoUpload}
                              className="hidden"
                            />
                          </div>
                        </div>
                        
                        <FormField
                          control={videoAnalysisForm.control}
                          name="caseNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Case Number (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., CC-2024-0123" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={videoAnalysisForm.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Analysis Notes (Optional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Add any notes relevant to this video analysis"
                                  className="h-20"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={analyzing || !videoFile}
                        >
                          {analyzing ? "Analyzing..." : "Analyze Video"}
                        </Button>
                        
                        {analyzing && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Analysis Progress</span>
                              <span>{Math.round(analysisProgress)}%</span>
                            </div>
                            <Progress value={analysisProgress} className="h-1.5" />
                          </div>
                        )}
                      </form>
                    </Form>
                  </CardContent>
                </Card>
                
                <Card className="border-cyber-primary/20 bg-cyber-dark">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Analysis Results</CardTitle>
                    <CardDescription>
                      {matchResults.length > 0 
                        ? `${matchResults.length} matches found` 
                        : "No results yet"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {matchResults.length > 0 ? (
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {matchResults.map((match, idx) => (
                          <Card key={idx} className="bg-cyber-background/60 border-cyber-primary/10">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-16 h-16 rounded-md overflow-hidden border border-cyber-primary/20">
                                  <img 
                                    src={match.faceImageUrl} 
                                    alt={match.name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-medium">{match.name}</h4>
                                      <p className="text-xs text-cyber-muted">Age: {match.age} | Crime: {match.crime}</p>
                                    </div>
                                    <Badge className={`${match.confidence > 95 ? 'bg-green-600' : 'bg-amber-600'}`}>
                                      {match.confidence}%
                                    </Badge>
                                  </div>
                                  <div className="mt-1 flex justify-between text-xs">
                                    <span className="text-cyber-muted">Timestamp: {match.timestamp}</span>
                                    <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                      View Details
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : analyzing ? (
                      <div className="flex flex-col items-center justify-center h-80">
                        <div className="relative">
                          <Video className="h-16 w-16 text-cyber-primary/40 animate-pulse" />
                          <div className="absolute inset-0 cyber-glow opacity-50 blur-sm rounded-full"></div>
                        </div>
                        <p className="text-center mt-4 text-cyber-muted">
                          Analyzing video frames...<br />
                          Matching against {faceDbEntries.length} known faces
                        </p>
                      </div>
                    ) : (
                      <div className="text-center p-6 h-80 flex flex-col items-center justify-center">
                        <Shield className="h-16 w-16 text-cyber-primary mx-auto mb-4" />
                        <p className="text-cyber-muted">Upload video to see detection results</p>
                        <p className="text-xs text-cyber-muted mt-2">
                          Our AI analyzes video frames for known faces and deepfake artifacts
                        </p>
                      </div>
                    )}
                  </CardContent>
                  {matchResults.length > 0 && (
                    <CardFooter className="px-6 py-3 bg-cyber-background/20 flex justify-between">
                      <span className="text-xs text-cyber-muted">
                        Analysis completed at {new Date().toLocaleTimeString()}
                      </span>
                      <Button variant="outline" size="sm" onClick={() => setMatchResults([])}>
                        Clear Results
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="facedatabase" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-cyber-primary/20 bg-cyber-dark">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Add Face to Database</CardTitle>
                    <CardDescription>Enter details for tracking</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...faceEntryForm}>
                      <form onSubmit={faceEntryForm.handleSubmit(onFaceEntrySubmit)} className="space-y-4">
                        <div className="flex flex-col items-center justify-center mb-4">
                          <div 
                            className="w-32 h-32 rounded-md border-2 border-dashed border-cyber-primary/20 mb-2 flex items-center justify-center overflow-hidden"
                            onClick={() => document.getElementById('face-image-upload')?.click()}
                          >
                            {faceImagePreview ? (
                              <img 
                                src={faceImagePreview} 
                                alt="Face Preview" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="h-12 w-12 text-cyber-primary/50" />
                            )}
                          </div>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => document.getElementById('face-image-upload')?.click()}
                          >
                            Upload Face Image
                          </Button>
                          <input
                            id="face-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFaceImageUpload}
                            className="hidden"
                          />
                          <p className="text-xs text-cyber-muted mt-1">
                            JPG, PNG or WEBP, max 5MB
                          </p>
                        </div>
                        
                        <FormField
                          control={faceEntryForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={faceEntryForm.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Age</FormLabel>
                              <FormControl>
                                <Input placeholder="Age" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={faceEntryForm.control}
                          name="crime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Crime Details</FormLabel>
                              <FormControl>
                                <Input placeholder="Type of crime" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={faceEntryForm.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Additional Notes</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Any additional relevant information"
                                  className="h-20"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={!faceImage}
                        >
                          Add to Database
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
                
                <Card className="border-cyber-primary/20 bg-cyber-dark">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Database Guidelines</CardTitle>
                    <CardDescription>Best practices for face entries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-cyber-background/30 rounded-md p-4">
                        <h4 className="font-medium mb-2 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Image Quality
                        </h4>
                        <p className="text-sm text-cyber-muted">
                          Use clear, frontal face images with good lighting. Avoid blurry images, extreme angles, or heavy filters.
                        </p>
                      </div>
                      
                      <div className="bg-cyber-background/30 rounded-md p-4">
                        <h4 className="font-medium mb-2 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Accurate Information
                        </h4>
                        <p className="text-sm text-cyber-muted">
                          Provide precise details including full legal name, accurate age, and specific crime information for proper identification.
                        </p>
                      </div>
                      
                      <div className="bg-cyber-background/30 rounded-md p-4">
                        <h4 className="font-medium mb-2 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Multiple Angles
                        </h4>
                        <p className="text-sm text-cyber-muted">
                          When possible, add multiple images of the same person from different angles to improve detection accuracy.
                        </p>
                      </div>
                      
                      <div className="bg-cyber-background/30 rounded-md p-4">
                        <h4 className="font-medium mb-2 flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          Legal Compliance
                        </h4>
                        <p className="text-sm text-cyber-muted">
                          Ensure all database entries comply with applicable laws and are added only for legitimate law enforcement purposes.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="database" className="mt-4">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">Face Database</CardTitle>
                    <CardDescription>{faceDbEntries.length} individuals tracked</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("facedatabase")}>
                    Add New Face
                  </Button>
                </CardHeader>
                <CardContent>
                  {dbLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-primary"></div>
                    </div>
                  ) : faceDbEntries.length === 0 ? (
                    <div className="text-center py-12">
                      <Database className="h-12 w-12 text-cyber-primary/40 mx-auto mb-3" />
                      <p className="text-cyber-muted">No faces in database yet</p>
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="mt-3"
                        onClick={() => setActiveTab("facedatabase")}
                      >
                        Add First Face
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                      {faceDbEntries.map((entry) => (
                        <Card key={entry.id} className="bg-cyber-background/60 border-cyber-primary/10">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 rounded-md overflow-hidden border border-cyber-primary/20">
                                <img 
                                  src={entry.face_url} 
                                  alt={entry.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{entry.name}</h4>
                                    <p className="text-xs text-cyber-muted">Age: {entry.age} | Crime: {entry.crime}</p>
                                  </div>
                                  <div className="text-xs text-cyber-muted">
                                    Added: {new Date(entry.created_at).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="mt-2 flex justify-end gap-2">
                                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                    Edit
                                  </Button>
                                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs text-red-500 hover:text-red-400">
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatisticsChart 
                  title="Deepfake by Type" 
                  data={deepfakeTypeData} 
                />
                
                <Card className="border-cyber-primary/20 bg-cyber-dark">
                  <CardHeader>
                    <CardTitle>Detection Metrics</CardTitle>
                    <CardDescription>Performance of the deepfake detection model</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Accuracy</span>
                          <span className="text-sm font-medium">94.2%</span>
                        </div>
                        <Progress value={94.2} className="h-2" indicatorClassName="bg-green-500" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Precision</span>
                          <span className="text-sm font-medium">92.7%</span>
                        </div>
                        <Progress value={92.7} className="h-2" indicatorClassName="bg-blue-500" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Recall</span>
                          <span className="text-sm font-medium">90.3%</span>
                        </div>
                        <Progress value={90.3} className="h-2" indicatorClassName="bg-purple-500" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">F1 Score</span>
                          <span className="text-sm font-medium">91.5%</span>
                        </div>
                        <Progress value={91.5} className="h-2" indicatorClassName="bg-amber-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
