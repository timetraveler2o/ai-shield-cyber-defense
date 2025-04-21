
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileSearch, Play, Pause, RotateCcw, AlertTriangle, Server, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function RansomwareSimulation() {
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
                      <FileSearch className="h-5 w-5 text-cyber-primary" />
                      Ransomware Simulation Training
                    </CardTitle>
                    <CardDescription>Interactive simulation for law enforcement training</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Play className="h-4 w-4" />
                      Start
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Pause className="h-4 w-4" />
                      Pause
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="bg-cyber-background/50 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      Simulation Status
                    </h3>
                    <p className="text-cyber-muted mb-4">
                      Set up the ransomware simulation environment to train officers on identification, 
                      containment and recovery procedures. This simulation is designed for educational 
                      purposes only.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-cyber-dark/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Infection Vector</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <select className="w-full bg-cyber-background border border-cyber-primary/20 rounded p-2 text-sm">
                            <option>Phishing Email</option>
                            <option>Infected USB Drive</option>
                            <option>Exploited Vulnerability</option>
                            <option>Social Engineering</option>
                          </select>
                        </CardContent>
                      </Card>
                      <Card className="bg-cyber-dark/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Encryption Type</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <select className="w-full bg-cyber-background border border-cyber-primary/20 rounded p-2 text-sm">
                            <option>AES-256</option>
                            <option>RSA-2048</option>
                            <option>XOR</option>
                            <option>Hybrid Encryption</option>
                          </select>
                        </CardContent>
                      </Card>
                      <Card className="bg-cyber-dark/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Propagation Speed</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <select className="w-full bg-cyber-background border border-cyber-primary/20 rounded p-2 text-sm">
                            <option>Slow (Educational)</option>
                            <option>Medium</option>
                            <option>Fast (Realistic)</option>
                            <option>Custom</option>
                          </select>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="simulation" className="mb-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto">
              <TabsTrigger value="simulation">Simulation</TabsTrigger>
              <TabsTrigger value="network">Network View</TabsTrigger>
              <TabsTrigger value="targets">Target Systems</TabsTrigger>
              <TabsTrigger value="response">Response Tools</TabsTrigger>
            </TabsList>
            <TabsContent value="simulation" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-cyber-primary/20 bg-cyber-dark col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Network Diagram</CardTitle>
                    <CardDescription>Simulated organization infrastructure</CardDescription>
                  </CardHeader>
                  <CardContent className="h-96 flex items-center justify-center bg-cyber-background/30 rounded">
                    <div className="text-center">
                      <Server className="h-16 w-16 text-cyber-primary mx-auto mb-4" />
                      <p className="text-cyber-muted">Network visualization would appear here</p>
                      <p className="text-xs text-cyber-muted">Click Start to begin the simulation</p>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex flex-col gap-4">
                  <Card className="border-cyber-primary/20 bg-cyber-dark">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold">Infection Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>File Encryption</span>
                            <span>0%</span>
                          </div>
                          <Progress value={0} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Network Spread</span>
                            <span>0%</span>
                          </div>
                          <Progress value={0} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Credential Harvesting</span>
                            <span>0%</span>
                          </div>
                          <Progress value={0} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-cyber-primary/20 bg-cyber-dark">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold">Defense Tools</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Shield className="h-4 w-4 mr-2" />
                          Network Isolation
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Shield className="h-4 w-4 mr-2" />
                          System Backup
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Shield className="h-4 w-4 mr-2" />
                          Endpoint Protection
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="network">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle>Network Topology</CardTitle>
                  <CardDescription>Detailed view of the simulated network</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Network topology visualization would be displayed here...</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="targets">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle>Target Systems</CardTitle>
                  <CardDescription>Systems vulnerable to the simulated ransomware</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Target systems dashboard would be displayed here...</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="response">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle>Response Tools</CardTitle>
                  <CardDescription>Tools available for responding to the ransomware attack</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Response tools dashboard would be displayed here...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
