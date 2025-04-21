
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Upload, 
  Video, 
  Image as ImageIcon, 
  Camera, 
  Check, 
  X, 
  AlertTriangle, 
  UserCheck,
  Database,
  BarChart4
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function DeepfakeDetection() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [deepfakeScore, setDeepfakeScore] = useState(0);
  const [detectionProgress, setDetectionProgress] = useState(0);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
      setAnalysisComplete(false);
      setDeepfakeScore(0);
    }
  };
  
  const handleUrlInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setFile(null);
    setAnalysisComplete(false);
    setDeepfakeScore(0);
  };
  
  const analyzeContent = () => {
    if (!file && !imageUrl) {
      toast.error("Please upload an image/video or enter a URL");
      return;
    }
    
    setIsAnalyzing(true);
    setDetectionProgress(0);
    
    // Simulate analysis with progress updates
    const interval = setInterval(() => {
      setDetectionProgress(prev => {
        const newValue = prev + Math.random() * 15;
        if (newValue >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setAnalysisComplete(true);
          
          // Generate a random score between 0.1 and 0.9 for demo
          const score = Math.random() * 100;
          setDeepfakeScore(parseFloat(score.toFixed(2)));
          
          if (score > 70) {
            toast.error("High probability of deepfake detected!", {
              description: "This content exhibits strong indicators of manipulation"
            });
          } else if (score > 40) {
            toast.warning("Medium probability of deepfake detected", {
              description: "Some indicators of manipulation were detected"
            });
          } else {
            toast.success("Content appears to be authentic", {
              description: "No significant indicators of manipulation detected"
            });
          }
          
          return 100;
        }
        return newValue;
      });
    }, 300);
  };
  
  const resetAnalysis = () => {
    setFile(null);
    setImageUrl('');
    setAnalysisComplete(false);
    setDeepfakeScore(0);
    setDetectionProgress(0);
  };

  return (
    <div className="flex h-screen bg-cyber-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-cyber-background">
          <div className="mb-6">
            <Card className="border-cyber-primary/20 bg-cyber-dark">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                      <Camera className="h-5 w-5 text-cyber-primary" />
                      Deepfake Detection Tool
                    </CardTitle>
                    <CardDescription>Analyze images and videos for signs of AI manipulation</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="tool" className="w-full">
                  <TabsList className="grid w-full md:w-auto grid-cols-3 gap-2">
                    <TabsTrigger value="tool">Detection Tool</TabsTrigger>
                    <TabsTrigger value="database">
                      <Link to="/face-database" className="w-full h-full flex items-center justify-center">
                        Face Database
                      </Link>
                    </TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="tool" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Card className="border-cyber-primary/20 bg-cyber-dark mb-4">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Upload Content</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="border-2 border-dashed border-cyber-primary/20 rounded-lg p-6 text-center">
                                <Upload className="h-10 w-10 text-cyber-primary/50 mx-auto mb-2" />
                                <p className="text-sm text-cyber-muted mb-2">Drag and drop files here or click to browse</p>
                                <Input
                                  type="file"
                                  accept="image/*,video/*"
                                  onChange={handleFileChange}
                                  className="hidden"
                                  id="file-upload"
                                  disabled={isAnalyzing}
                                />
                                <Button asChild variant="outline" disabled={isAnalyzing}>
                                  <label htmlFor="file-upload" className="cursor-pointer">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Browse Files
                                  </label>
                                </Button>
                              </div>
                              
                              <div>
                                <Label htmlFor="url-input">Or enter URL</Label>
                                <div className="flex space-x-2 mt-1">
                                  <Input
                                    id="url-input"
                                    placeholder="https://example.com/image.jpg"
                                    onChange={handleUrlInput}
                                    value={imageUrl}
                                    disabled={isAnalyzing}
                                    className="flex-1"
                                  />
                                </div>
                              </div>
                              
                              <div className="flex space-x-2">
                                <Button 
                                  onClick={analyzeContent} 
                                  disabled={isAnalyzing || (!file && !imageUrl)}
                                  className="w-full"
                                >
                                  {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={resetAnalysis}
                                  disabled={isAnalyzing}
                                  className="flex-shrink-0"
                                >
                                  Reset
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        {(isAnalyzing || analysisComplete) && (
                          <Card className="border-cyber-primary/20 bg-cyber-dark">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">Analysis Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {isAnalyzing ? (
                                <div className="space-y-4">
                                  <p className="text-sm text-cyber-muted">Analyzing content for signs of manipulation...</p>
                                  <Progress value={detectionProgress} className="h-2" />
                                  <div className="text-sm text-cyber-muted flex justify-between">
                                    <span>Face detection</span>
                                    <span>Neural analysis</span>
                                    <span>Final score</span>
                                  </div>
                                </div>
                              ) : analysisComplete && (
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      {deepfakeScore > 70 ? (
                                        <div className="flex items-center">
                                          <X className="h-5 w-5 text-red-500 mr-2" />
                                          <span className="font-semibold">Likely Deepfake</span>
                                        </div>
                                      ) : deepfakeScore > 40 ? (
                                        <div className="flex items-center">
                                          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                                          <span className="font-semibold">Possible Deepfake</span>
                                        </div>
                                      ) : (
                                        <div className="flex items-center">
                                          <Check className="h-5 w-5 text-green-500 mr-2" />
                                          <span className="font-semibold">Likely Authentic</span>
                                        </div>
                                      )}
                                    </div>
                                    <span className={`text-xl font-bold ${
                                      deepfakeScore > 70 ? 'text-red-500' : 
                                      deepfakeScore > 40 ? 'text-amber-500' : 
                                      'text-green-500'
                                    }`}>
                                      {deepfakeScore}%
                                    </span>
                                  </div>
                                  
                                  <div className="bg-cyber-background/30 p-4 rounded-md">
                                    <h4 className="font-medium mb-2">Detection Results</h4>
                                    <div className="space-y-3">
                                      <div>
                                        <div className="flex justify-between text-sm mb-1">
                                          <span>Face inconsistencies</span>
                                          <span>{Math.round(deepfakeScore * 0.8)}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-cyber-background rounded-full overflow-hidden">
                                          <div className="h-full bg-cyber-primary" style={{ width: `${deepfakeScore * 0.8}%` }}></div>
                                        </div>
                                      </div>
                                      <div>
                                        <div className="flex justify-between text-sm mb-1">
                                          <span>Background artifacts</span>
                                          <span>{Math.round(deepfakeScore * 0.6)}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-cyber-background rounded-full overflow-hidden">
                                          <div className="h-full bg-cyber-primary" style={{ width: `${deepfakeScore * 0.6}%` }}></div>
                                        </div>
                                      </div>
                                      <div>
                                        <div className="flex justify-between text-sm mb-1">
                                          <span>Neural pattern detection</span>
                                          <span>{Math.round(deepfakeScore * 1.1)}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-cyber-background rounded-full overflow-hidden">
                                          <div className="h-full bg-cyber-primary" style={{ width: `${Math.min(100, deepfakeScore * 1.1)}%` }}></div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-between">
                                    <Button variant="outline" onClick={resetAnalysis}>
                                      New Analysis
                                    </Button>
                                    {deepfakeScore > 40 && (
                                      <Button asChild>
                                        <Link to="/face-database">
                                          <UserCheck className="h-4 w-4 mr-2" />
                                          Add to Database
                                        </Link>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )}
                      </div>
                      
                      <div>
                        {imageUrl ? (
                          <Card className="border-cyber-primary/20 bg-cyber-dark h-full">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">Preview</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center p-2">
                              <div className="rounded overflow-hidden max-h-[500px] bg-black flex items-center justify-center">
                                {file?.type.startsWith('video/') ? (
                                  <video 
                                    src={imageUrl} 
                                    controls 
                                    className="max-w-full max-h-full object-contain"
                                  />
                                ) : (
                                  <img 
                                    src={imageUrl} 
                                    alt="Content preview" 
                                    className="max-w-full max-h-[500px] object-contain"
                                  />
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card className="border-cyber-primary/20 bg-cyber-dark h-full">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">Content Preview</CardTitle>
                            </CardHeader>
                            <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
                              <div className="bg-cyber-background/30 p-6 rounded-lg w-full max-w-md">
                                <div className="flex justify-center mb-4">
                                  <div className="rounded-full bg-cyber-primary/10 p-4">
                                    {file?.type.startsWith('video/') ? (
                                      <Video className="h-12 w-12 text-cyber-primary" />
                                    ) : (
                                      <ImageIcon className="h-12 w-12 text-cyber-primary" />
                                    )}
                                  </div>
                                </div>
                                <p className="text-cyber-muted">No content selected for analysis</p>
                                <p className="text-sm text-cyber-muted mt-2">Upload a file or enter a URL to begin deepfake detection</p>
                              </div>
                              <div className="mt-8 max-w-lg">
                                <h3 className="text-lg font-medium mb-2">How it works</h3>
                                <p className="text-sm text-cyber-muted mb-4">
                                  Our deepfake detection technology uses advanced neural networks to analyze content for signs of manipulation. The system checks for inconsistencies in facial features, lighting, and background artifacts that may indicate AI-generated or manipulated content.
                                </p>
                                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                  <div className="bg-cyber-background/30 p-3 rounded">
                                    <div className="flex justify-center mb-2">
                                      <ImageIcon className="h-5 w-5 text-cyber-primary" />
                                    </div>
                                    <p>Upload content</p>
                                  </div>
                                  <div className="bg-cyber-background/30 p-3 rounded">
                                    <div className="flex justify-center mb-2">
                                      <Camera className="h-5 w-5 text-cyber-primary" />
                                    </div>
                                    <p>AI analysis</p>
                                  </div>
                                  <div className="bg-cyber-background/30 p-3 rounded">
                                    <div className="flex justify-center mb-2">
                                      <Check className="h-5 w-5 text-cyber-primary" />
                                    </div>
                                    <p>View results</p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="database" className="mt-6">
                    <Card className="border-cyber-primary/20 bg-cyber-dark">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Database className="h-5 w-5 text-cyber-primary" />
                          Face Database
                        </CardTitle>
                        <CardDescription>
                          Access our database of known deepfake creators and suspicious individuals
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="py-6">
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                          <Database className="h-16 w-16 text-cyber-primary/50 mb-4" />
                          <h3 className="text-xl font-medium mb-2">View Face Database</h3>
                          <p className="text-sm text-cyber-muted max-w-md mb-6">
                            Our face database contains records of individuals identified in deepfake content
                            and those suspected of creating manipulated media.
                          </p>
                          <Button asChild size="lg">
                            <Link to="/face-database">
                              <UserCheck className="h-4 w-4 mr-2" />
                              Go to Face Database
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="analytics" className="mt-6">
                    <Card className="border-cyber-primary/20 bg-cyber-dark">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart4 className="h-5 w-5 text-cyber-primary" />
                          Deepfake Analytics
                        </CardTitle>
                        <CardDescription>
                          Statistics and trends in deepfake detection
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <Card className="bg-cyber-background/30 p-4">
                            <h3 className="font-medium mb-1">Total Scans</h3>
                            <p className="text-3xl font-bold">432</p>
                            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
                          </Card>
                          <Card className="bg-cyber-background/30 p-4">
                            <h3 className="font-medium mb-1">Deepfakes Detected</h3>
                            <p className="text-3xl font-bold">87</p>
                            <p className="text-xs text-muted-foreground mt-1">High confidence detections</p>
                          </Card>
                          <Card className="bg-cyber-background/30 p-4">
                            <h3 className="font-medium mb-1">Detection Rate</h3>
                            <p className="text-3xl font-bold">20.1%</p>
                            <p className="text-xs text-muted-foreground mt-1">Of all analyzed content</p>
                          </Card>
                        </div>

                        <h3 className="font-medium mb-4">Detection Trends</h3>
                        <div className="bg-cyber-background/30 p-4 rounded-lg mb-6">
                          <div className="h-[200px] flex items-end justify-between gap-2">
                            {[35, 42, 58, 45, 61, 85, 73, 92, 81, 75, 68, 56].map((value, i) => (
                              <div 
                                key={i} 
                                className="bg-cyber-primary w-full rounded-t" 
                                style={{ height: `${value}%` }}
                                title={`Month ${i+1}: ${value}%`}
                              ></div>
                            ))}
                          </div>
                          <div className="flex justify-between mt-2 text-xs text-cyber-muted">
                            <span>Jan</span>
                            <span>Feb</span>
                            <span>Mar</span>
                            <span>Apr</span>
                            <span>May</span>
                            <span>Jun</span>
                            <span>Jul</span>
                            <span>Aug</span>
                            <span>Sep</span>
                            <span>Oct</span>
                            <span>Nov</span>
                            <span>Dec</span>
                          </div>
                        </div>

                        <h3 className="font-medium mb-4">Deepfake Categories</h3>
                        <div className="space-y-3">
                          <div className="w-full">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Political figures</span>
                              <span className="text-sm">42%</span>
                            </div>
                            <div className="h-2 w-full bg-cyber-background rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-cyber-primary" 
                                style={{ width: '42%' }}
                              ></div>
                            </div>
                          </div>
                          <div className="w-full">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Celebrities</span>
                              <span className="text-sm">27%</span>
                            </div>
                            <div className="h-2 w-full bg-cyber-background rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-cyber-primary" 
                                style={{ width: '27%' }}
                              ></div>
                            </div>
                          </div>
                          <div className="w-full">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Public officials</span>
                              <span className="text-sm">18%</span>
                            </div>
                            <div className="h-2 w-full bg-cyber-background rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-cyber-primary" 
                                style={{ width: '18%' }}
                              ></div>
                            </div>
                          </div>
                          <div className="w-full">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Unknown individuals</span>
                              <span className="text-sm">13%</span>
                            </div>
                            <div className="h-2 w-full bg-cyber-background rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-cyber-primary" 
                                style={{ width: '13%' }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
