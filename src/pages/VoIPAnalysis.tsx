
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PhoneCall, Upload, BarChart, Clock, Volume2, ShieldAlert } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { StatisticsChart } from "@/components/StatisticsChart";

const callTypeData = [
  { name: "Lottery Scam", value: 127, fill: "#9b87f5" },
  { name: "Bank Fraud", value: 96, fill: "#0FA0CE" },
  { name: "KYC Update", value: 143, fill: "#ea384c" },
  { name: "Govt Impersonation", value: 84, fill: "#8B5CF6" },
  { name: "Tax Fraud", value: 62, fill: "#f97316" },
  { name: "Tech Support", value: 109, fill: "#8E9196" },
];

export default function VoIPAnalysis() {
  return (
    <div className="flex h-screen bg-cyber-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-cyber-background">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <Card className="border-cyber-primary/20 bg-cyber-dark">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">VoIP Scam Analysis</CardTitle>
                <CardDescription>AI-powered call detection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">621</span>
                    <span className="text-xs text-cyber-muted">Scam calls detected this month</span>
                  </div>
                  <PhoneCall className="h-10 w-10 text-cyber-primary" />
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Detection Rate</span>
                    <span>89%</span>
                  </div>
                  <Progress value={89} className="h-1" indicatorClassName="bg-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-cyber-primary/20 bg-cyber-dark">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Call Analysis</CardTitle>
                <CardDescription>Upload call recording for analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-cyber-background/30 border border-dashed border-cyber-primary/20 rounded-md p-6 flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-cyber-primary mb-2" />
                  <p className="text-sm text-center text-cyber-muted">
                    Upload audio files for scam detection
                  </p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Upload Recording
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-cyber-primary/20 bg-cyber-dark">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Active Blacklist</CardTitle>
                <CardDescription>Blocked VoIP numbers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">1,842</span>
                    <span className="text-xs text-cyber-muted">Numbers in blacklist database</span>
                  </div>
                  <ShieldAlert className="h-10 w-10 text-cyber-primary" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-xs">Updated 2 hours ago</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View Blacklist
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="analyzer" className="mb-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto">
              <TabsTrigger value="analyzer">Call Analyzer</TabsTrigger>
              <TabsTrigger value="patterns">Scam Patterns</TabsTrigger>
              <TabsTrigger value="blacklist">Number Blacklist</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="analyzer" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-cyber-primary/20 bg-cyber-dark">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Voice Analysis Tool</CardTitle>
                    <CardDescription>Upload or record call for analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-cyber-background/30 border border-dashed border-cyber-primary/20 rounded-md p-6 flex flex-col items-center justify-center">
                        <Volume2 className="h-12 w-12 text-cyber-primary mb-2" />
                        <p className="text-sm text-center text-cyber-muted">
                          Drop audio files here or click to upload
                        </p>
                        <div className="flex gap-2 mt-4">
                          <Button variant="default" size="sm">
                            Upload File
                          </Button>
                          <Button variant="outline" size="sm">
                            Record Call
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-cyber-muted">Analysis Type</label>
                        <select className="w-full mt-1 bg-cyber-background border border-cyber-primary/20 rounded p-2 text-sm">
                          <option>Scam Pattern Detection</option>
                          <option>Voice Deepfake Analysis</option>
                          <option>Threat Assessment</option>
                          <option>Speaker Identification</option>
                        </select>
                      </div>
                      <Button className="w-full">Analyze Call</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-cyber-primary/20 bg-cyber-dark">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Analysis Results</CardTitle>
                    <CardDescription>No call analyzed yet</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center">
                    <div className="text-center p-6">
                      <BarChart className="h-16 w-16 text-cyber-primary mx-auto mb-4" />
                      <p className="text-cyber-muted">Upload a call recording to see analysis results</p>
                      <p className="text-xs text-cyber-muted mt-2">
                        Our AI detects known scam patterns, voice artifacts, and suspicious language
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="patterns">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatisticsChart 
                  title="Scam Call Types" 
                  data={callTypeData} 
                />
                
                <Card className="border-cyber-primary/20 bg-cyber-dark">
                  <CardHeader>
                    <CardTitle>Time Pattern Analysis</CardTitle>
                    <CardDescription>Scam call frequency by time of day</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[200px] flex items-center justify-center">
                    <div className="text-center">
                      <Clock className="h-12 w-12 text-cyber-primary mx-auto mb-2" />
                      <p className="text-cyber-muted">Time pattern chart would be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-cyber-primary/20 bg-cyber-dark col-span-2">
                  <CardHeader>
                    <CardTitle>Common Scam Scripts</CardTitle>
                    <CardDescription>Frequently detected scam patterns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-cyber-background/30 rounded">
                        <h4 className="font-medium mb-1">Bank Fraud Alert Script</h4>
                        <p className="text-sm text-cyber-muted">
                          "This is [Bank Name] security department. We've detected suspicious activity on your account..."
                        </p>
                      </div>
                      <div className="p-3 bg-cyber-background/30 rounded">
                        <h4 className="font-medium mb-1">KYC Update Scam</h4>
                        <p className="text-sm text-cyber-muted">
                          "Your account will be blocked in 24 hours due to pending KYC verification..."
                        </p>
                      </div>
                      <div className="p-3 bg-cyber-background/30 rounded">
                        <h4 className="font-medium mb-1">Lottery/Prize Fraud</h4>
                        <p className="text-sm text-cyber-muted">
                          "Congratulations! You've won [amount] in our lottery. To claim your prize..."
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="blacklist">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle>VoIP Number Blacklist</CardTitle>
                  <CardDescription>Database of known scam numbers</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Number blacklist dashboard would be displayed here...</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reports">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle>VoIP Scam Reports</CardTitle>
                  <CardDescription>Generate and download reports on VoIP scam patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Reports dashboard would be displayed here...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
