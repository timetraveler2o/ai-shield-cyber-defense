
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Video, Upload, BarChart, AlertTriangle, Users, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { StatisticsChart } from "@/components/StatisticsChart";

const deepfakeTypeData = [
  { name: "Face Swap", value: 145, fill: "#9b87f5" },
  { name: "Voice Clone", value: 87, fill: "#0FA0CE" },
  { name: "Full Synthetic", value: 53, fill: "#ea384c" },
  { name: "Lip Sync", value: 78, fill: "#8B5CF6" },
  { name: "Expression Swap", value: 63, fill: "#f97316" },
];

export default function DeepfakeDetection() {
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
                <CardTitle className="text-lg font-semibold">Media Analysis</CardTitle>
                <CardDescription>Upload media for analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-cyber-background/30 border border-dashed border-cyber-primary/20 rounded-md p-6 flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-cyber-primary mb-2" />
                  <p className="text-sm text-center text-cyber-muted">
                    Drag and drop files here or click to browse
                  </p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Upload File
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-cyber-primary/20 bg-cyber-dark">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Impersonation Alerts</CardTitle>
                <CardDescription>High-profile impersonation risk</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-red-500">12</span>
                    <span className="text-xs text-cyber-muted">Active high-risk alerts</span>
                  </div>
                  <Users className="h-10 w-10 text-red-500" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-xs">Government official impersonation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="text-xs">Celebrity vouching for scam</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="detection" className="mb-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto">
              <TabsTrigger value="detection">Detection Tool</TabsTrigger>
              <TabsTrigger value="dashboard">Analytics</TabsTrigger>
              <TabsTrigger value="cases">Active Cases</TabsTrigger>
              <TabsTrigger value="database">Deepfake Database</TabsTrigger>
            </TabsList>
            <TabsContent value="detection" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-cyber-primary/20 bg-cyber-dark">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Media Analyzer</CardTitle>
                    <CardDescription>Upload or provide URL to analyze</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-cyber-background/30 border border-dashed border-cyber-primary/20 rounded-md p-6 flex flex-col items-center justify-center">
                        <Video className="h-12 w-12 text-cyber-primary mb-2" />
                        <p className="text-sm text-center text-cyber-muted">
                          Drop media files here or click to upload
                        </p>
                        <div className="flex gap-2 mt-4">
                          <Button variant="default" size="sm">
                            Upload File
                          </Button>
                          <Button variant="outline" size="sm">
                            Paste URL
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-cyber-muted">Detection Sensitivity</label>
                        <div className="mt-1">
                          <input type="range" className="w-full" min="0" max="100" defaultValue="70" />
                          <div className="flex justify-between text-xs text-cyber-muted">
                            <span>Low</span>
                            <span>Medium</span>
                            <span>High</span>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full">Analyze Media</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-cyber-primary/20 bg-cyber-dark">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Analysis Results</CardTitle>
                    <CardDescription>No media analyzed yet</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center">
                    <div className="text-center p-6">
                      <BarChart className="h-16 w-16 text-cyber-primary mx-auto mb-4" />
                      <p className="text-cyber-muted">Upload media to see detection results</p>
                      <p className="text-xs text-cyber-muted mt-2">
                        Our AI analyzes facial inconsistencies, audio artifacts, and metadata
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="dashboard">
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
            <TabsContent value="cases">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle>Active Deepfake Cases</CardTitle>
                  <CardDescription>Currently under investigation</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Active cases dashboard would be displayed here...</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="database">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle>Deepfake Database</CardTitle>
                  <CardDescription>Catalog of known deepfakes for reference</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Deepfake database would be displayed here...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
