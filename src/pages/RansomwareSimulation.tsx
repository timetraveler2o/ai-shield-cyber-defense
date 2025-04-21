
import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileSearch, Play, Pause, RotateCcw, AlertTriangle, Server, Shield, Network, Database, Laptop, Virus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { ImprovedThreatMap } from "@/components/ImprovedThreatMap";

type SimulationStatus = "idle" | "running" | "paused" | "completed";

export default function RansomwareSimulation() {
  const { toast } = useToast();
  const [status, setStatus] = useState<SimulationStatus>("idle");
  const [infectionVector, setInfectionVector] = useState("Phishing Email");
  const [encryptionType, setEncryptionType] = useState("AES-256");
  const [propagationSpeed, setPropagationSpeed] = useState("Slow (Educational)");
  
  // Simulation progress states
  const [fileEncryptionProgress, setFileEncryptionProgress] = useState(0);
  const [networkSpreadProgress, setNetworkSpreadProgress] = useState(0);
  const [credentialHarvestingProgress, setCredentialHarvestingProgress] = useState(0);
  
  // Simulation interval IDs
  const [simulationIntervals, setSimulationIntervals] = useState<number[]>([]);
  
  // Trigger nodes affected states
  const [affectedNodes, setAffectedNodes] = useState<string[]>([]);
  const availableNodes = ["Workstation-1", "Workstation-2", "FileServer", "Database", "Email", "Intranet"];
  
  // Defense tools state
  const [activeDefenses, setActiveDefenses] = useState<string[]>([]);
  const [defenseEffectiveness, setDefenseEffectiveness] = useState(100);

  // Start the simulation
  const startSimulation = () => {
    if (status === "paused") {
      setStatus("running");
      toast({
        title: "Simulation Resumed",
        description: "The ransomware simulation has been resumed.",
      });
    } else if (status !== "running") {
      setStatus("running");
      resetProgress();
      setAffectedNodes([]);
      setActiveDefenses([]);
      
      // Create speed factor based on propagation speed selection
      let speedFactor = 1;
      switch(propagationSpeed) {
        case "Slow (Educational)": speedFactor = 1; break;
        case "Medium": speedFactor = 2; break;
        case "Fast (Realistic)": speedFactor = 4; break;
        case "Custom": speedFactor = 1.5; break;
      }
      
      // Start progress animations
      const fileEncryptionInterval = window.setInterval(() => {
        setFileEncryptionProgress(prev => {
          const newValue = prev + (0.5 * speedFactor);
          return newValue >= 100 ? 100 : newValue;
        });
      }, 500);
      
      const networkSpreadInterval = window.setInterval(() => {
        setNetworkSpreadProgress(prev => {
          const newValue = prev + (0.3 * speedFactor);
          return newValue >= 100 ? 100 : newValue;
        });
      }, 500);
      
      const credentialHarvestingInterval = window.setInterval(() => {
        setCredentialHarvestingProgress(prev => {
          const newValue = prev + (0.2 * speedFactor);
          return newValue >= 100 ? 100 : newValue;
        });
      }, 500);
      
      // Add affected nodes gradually
      const nodesInterval = window.setInterval(() => {
        setAffectedNodes(prev => {
          if (prev.length >= availableNodes.length) {
            clearInterval(nodesInterval);
            return prev;
          }
          
          // Find a random unaffected node
          const unaffectedNodes = availableNodes.filter(node => !prev.includes(node));
          if (unaffectedNodes.length === 0) return prev;
          
          const randomNode = unaffectedNodes[Math.floor(Math.random() * unaffectedNodes.length)];
          
          // Check if defenses are active
          if (activeDefenses.length > 0) {
            // 50% chance to block infection if defenses are active
            if (Math.random() > 0.5) {
              toast({
                title: "Infection Blocked",
                description: `Active defenses prevented ${randomNode} from being infected.`,
              });
              return prev;
            }
          }
          
          // Display toast for newly affected node
          toast({
            title: "Node Infected",
            description: `${randomNode} has been infected by the ransomware.`,
            variant: "destructive",
          });
          
          return [...prev, randomNode];
        });
      }, 5000 / speedFactor);
      
      // Set all intervals
      setSimulationIntervals([fileEncryptionInterval, networkSpreadInterval, credentialHarvestingInterval, nodesInterval]);
      
      toast({
        title: "Simulation Started",
        description: "The ransomware simulation has been started.",
      });
    }
  };

  // Pause the simulation
  const pauseSimulation = () => {
    if (status === "running") {
      setStatus("paused");
      // Clear all intervals
      simulationIntervals.forEach(intervalId => clearInterval(intervalId));
      setSimulationIntervals([]);
      
      toast({
        title: "Simulation Paused",
        description: "The ransomware simulation has been paused.",
      });
    }
  };

  // Reset the simulation
  const resetSimulation = () => {
    // Clear all intervals
    simulationIntervals.forEach(intervalId => clearInterval(intervalId));
    setSimulationIntervals([]);
    
    setStatus("idle");
    resetProgress();
    setAffectedNodes([]);
    setActiveDefenses([]);
    
    toast({
      title: "Simulation Reset",
      description: "The ransomware simulation has been reset to initial state.",
    });
  };

  // Reset progress values
  const resetProgress = () => {
    setFileEncryptionProgress(0);
    setNetworkSpreadProgress(0);
    setCredentialHarvestingProgress(0);
  };

  // Add or remove active defenses
  const toggleDefense = (defense: string) => {
    setActiveDefenses(prev => {
      if (prev.includes(defense)) {
        // Remove defense
        const newDefenses = prev.filter(d => d !== defense);
        // Update effectiveness
        updateDefenseEffectiveness(newDefenses.length);
        return newDefenses;
      } else {
        // Add defense
        const newDefenses = [...prev, defense];
        // Update effectiveness
        updateDefenseEffectiveness(newDefenses.length);
        
        // If simulation is running, show defense activation toast
        if (status === "running") {
          toast({
            title: "Defense Activated",
            description: `${defense} has been activated to counter the ransomware.`,
          });
          
          // Slow down the infection if defenses are active
          simulationIntervals.forEach(intervalId => clearInterval(intervalId));
          startSimulation();
        }
        
        return newDefenses;
      }
    });
  };

  // Update defense effectiveness based on active defenses count
  const updateDefenseEffectiveness = (defenseCount: number) => {
    // Calculate defense effectiveness (more defenses = higher effectiveness)
    const newEffectiveness = Math.min(100, defenseCount * 25);
    setDefenseEffectiveness(newEffectiveness);
  };

  // Check if simulation is complete
  useEffect(() => {
    if (status === "running" && fileEncryptionProgress === 100 && networkSpreadProgress === 100 && credentialHarvestingProgress === 100) {
      // Simulation completed
      setStatus("completed");
      
      // Clear all intervals
      simulationIntervals.forEach(intervalId => clearInterval(intervalId));
      setSimulationIntervals([]);
      
      toast({
        title: "Simulation Completed",
        description: "The ransomware simulation has completed. Review the results and try different defense strategies.",
      });
    }
  }, [fileEncryptionProgress, networkSpreadProgress, credentialHarvestingProgress, status, simulationIntervals, toast]);

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      simulationIntervals.forEach(intervalId => clearInterval(intervalId));
    };
  }, [simulationIntervals]);

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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={startSimulation}
                      disabled={status === "running" || status === "completed"}
                    >
                      <Play className="h-4 w-4" />
                      {status === "paused" ? "Resume" : "Start"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={pauseSimulation}
                      disabled={status !== "running"}
                    >
                      <Pause className="h-4 w-4" />
                      Pause
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={resetSimulation}
                      disabled={status === "idle"}
                    >
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
                      Simulation Status: {" "}
                      <span className={
                        status === "idle" ? "text-blue-400" : 
                        status === "running" ? "text-green-400" : 
                        status === "paused" ? "text-amber-400" : 
                        "text-red-400"
                      }>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
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
                          <select 
                            className="w-full bg-cyber-background border border-cyber-primary/20 rounded p-2 text-sm"
                            value={infectionVector}
                            onChange={(e) => setInfectionVector(e.target.value)}
                            disabled={status !== "idle"}
                          >
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
                          <select 
                            className="w-full bg-cyber-background border border-cyber-primary/20 rounded p-2 text-sm"
                            value={encryptionType}
                            onChange={(e) => setEncryptionType(e.target.value)}
                            disabled={status !== "idle"}
                          >
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
                          <select 
                            className="w-full bg-cyber-background border border-cyber-primary/20 rounded p-2 text-sm"
                            value={propagationSpeed}
                            onChange={(e) => setPropagationSpeed(e.target.value)}
                            disabled={status !== "idle"}
                          >
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
                  <CardContent className="h-96 bg-cyber-background/30 rounded relative overflow-hidden">
                    {status === "idle" ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Server className="h-16 w-16 text-cyber-primary mx-auto mb-4" />
                          <p className="text-cyber-muted">Network visualization would appear here</p>
                          <p className="text-xs text-cyber-muted">Click Start to begin the simulation</p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full w-full relative">
                        {/* Simple network diagram */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="relative">
                            {/* Central Router/Switch */}
                            <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-gray-700 p-3 rounded-lg shadow-lg">
                              <Network className={`h-10 w-10 ${status === "running" ? "text-green-400 animate-pulse" : "text-gray-400"}`} />
                              <p className="text-xs text-center mt-1">Router</p>
                            </div>
                            
                            {/* File Server */}
                            <div className={`absolute top-[-100px] left-[100px] bg-gray-700 p-3 rounded-lg shadow-lg ${affectedNodes.includes("FileServer") ? "ring-2 ring-red-500" : ""}`}>
                              <Server className={`h-8 w-8 ${affectedNodes.includes("FileServer") ? "text-red-400" : "text-gray-400"}`} />
                              <p className="text-xs text-center mt-1">File Server</p>
                            </div>
                            
                            {/* Database */}
                            <div className={`absolute top-[-50px] left-[150px] bg-gray-700 p-3 rounded-lg shadow-lg ${affectedNodes.includes("Database") ? "ring-2 ring-red-500" : ""}`}>
                              <Database className={`h-8 w-8 ${affectedNodes.includes("Database") ? "text-red-400" : "text-gray-400"}`} />
                              <p className="text-xs text-center mt-1">Database</p>
                            </div>
                            
                            {/* Email Server */}
                            <div className={`absolute top-[50px] left-[150px] bg-gray-700 p-3 rounded-lg shadow-lg ${affectedNodes.includes("Email") ? "ring-2 ring-red-500" : ""}`}>
                              <Server className={`h-8 w-8 ${affectedNodes.includes("Email") ? "text-red-400" : "text-gray-400"}`} />
                              <p className="text-xs text-center mt-1">Email</p>
                            </div>
                            
                            {/* Intranet */}
                            <div className={`absolute top-[100px] left-[100px] bg-gray-700 p-3 rounded-lg shadow-lg ${affectedNodes.includes("Intranet") ? "ring-2 ring-red-500" : ""}`}>
                              <Server className={`h-8 w-8 ${affectedNodes.includes("Intranet") ? "text-red-400" : "text-gray-400"}`} />
                              <p className="text-xs text-center mt-1">Intranet</p>
                            </div>
                            
                            {/* Workstation 1 */}
                            <div className={`absolute top-[-75px] left-[-150px] bg-gray-700 p-3 rounded-lg shadow-lg ${affectedNodes.includes("Workstation-1") ? "ring-2 ring-red-500" : ""}`}>
                              <Laptop className={`h-8 w-8 ${affectedNodes.includes("Workstation-1") ? "text-red-400" : "text-gray-400"}`} />
                              <p className="text-xs text-center mt-1">Workstation 1</p>
                            </div>
                            
                            {/* Workstation 2 */}
                            <div className={`absolute top-[75px] left-[-150px] bg-gray-700 p-3 rounded-lg shadow-lg ${affectedNodes.includes("Workstation-2") ? "ring-2 ring-red-500" : ""}`}>
                              <Laptop className={`h-8 w-8 ${affectedNodes.includes("Workstation-2") ? "text-red-400" : "text-gray-400"}`} />
                              <p className="text-xs text-center mt-1">Workstation 2</p>
                            </div>
                            
                            {/* Connection lines */}
                            <svg className="absolute top-0 left-0 w-full h-full" style={{ width: "400px", height: "300px", transform: "translate(-200px, -150px)" }}>
                              {/* Router to File Server */}
                              <line x1="0" y1="0" x2="100" y2="-100" stroke={affectedNodes.includes("FileServer") ? "#f87171" : "#4b5563"} strokeWidth="2" />
                              
                              {/* Router to Database */}
                              <line x1="0" y1="0" x2="150" y2="-50" stroke={affectedNodes.includes("Database") ? "#f87171" : "#4b5563"} strokeWidth="2" />
                              
                              {/* Router to Email */}
                              <line x1="0" y1="0" x2="150" y2="50" stroke={affectedNodes.includes("Email") ? "#f87171" : "#4b5563"} strokeWidth="2" />
                              
                              {/* Router to Intranet */}
                              <line x1="0" y1="0" x2="100" y2="100" stroke={affectedNodes.includes("Intranet") ? "#f87171" : "#4b5563"} strokeWidth="2" />
                              
                              {/* Router to Workstation 1 */}
                              <line x1="0" y1="0" x2="-150" y2="-75" stroke={affectedNodes.includes("Workstation-1") ? "#f87171" : "#4b5563"} strokeWidth="2" />
                              
                              {/* Router to Workstation 2 */}
                              <line x1="0" y1="0" x2="-150" y2="75" stroke={affectedNodes.includes("Workstation-2") ? "#f87171" : "#4b5563"} strokeWidth="2" />
                              
                              {/* Animated ransomware symbols */}
                              {status === "running" && (
                                <>
                                  {affectedNodes.includes("FileServer") && (
                                    <circle className="animate-pulse" cx="50" cy="-50" r="5" fill="#f87171" />
                                  )}
                                  {affectedNodes.includes("Database") && (
                                    <circle className="animate-pulse" cx="75" cy="-25" r="5" fill="#f87171" />
                                  )}
                                  {affectedNodes.includes("Email") && (
                                    <circle className="animate-pulse" cx="75" cy="25" r="5" fill="#f87171" />
                                  )}
                                  {affectedNodes.includes("Intranet") && (
                                    <circle className="animate-pulse" cx="50" cy="50" r="5" fill="#f87171" />
                                  )}
                                  {affectedNodes.includes("Workstation-1") && (
                                    <circle className="animate-pulse" cx="-75" cy="-37" r="5" fill="#f87171" />
                                  )}
                                  {affectedNodes.includes("Workstation-2") && (
                                    <circle className="animate-pulse" cx="-75" cy="37" r="5" fill="#f87171" />
                                  )}
                                </>
                              )}
                            </svg>
                          </div>
                        </div>
                        
                        {/* Ransomware infection animation overlay */}
                        {status === "running" && (
                          <div className="absolute inset-0 pointer-events-none">
                            {[...Array(5)].map((_, i) => (
                              <div 
                                key={i}
                                className="absolute animate-ping"
                                style={{
                                  top: `${Math.random() * 100}%`,
                                  left: `${Math.random() * 100}%`,
                                  opacity: 0.7,
                                  animationDuration: `${1 + Math.random() * 2}s`,
                                  animationDelay: `${Math.random() * 2}s`
                                }}
                              >
                                <Virus className="h-4 w-4 text-red-500" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
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
                            <span>{fileEncryptionProgress.toFixed(0)}%</span>
                          </div>
                          <Progress value={fileEncryptionProgress} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Network Spread</span>
                            <span>{networkSpreadProgress.toFixed(0)}%</span>
                          </div>
                          <Progress value={networkSpreadProgress} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Credential Harvesting</span>
                            <span>{credentialHarvestingProgress.toFixed(0)}%</span>
                          </div>
                          <Progress value={credentialHarvestingProgress} className="h-2" />
                        </div>
                        
                        <div className="mt-4 bg-cyber-background/50 p-3 rounded-md">
                          <h4 className="text-sm font-semibold mb-2">Affected Systems</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {availableNodes.map(node => (
                              <div 
                                key={node} 
                                className={`text-xs p-1.5 rounded flex items-center gap-1 ${
                                  affectedNodes.includes(node) 
                                    ? "bg-red-900/30 text-red-400"
                                    : "bg-green-900/30 text-green-400"
                                }`}
                              >
                                {affectedNodes.includes(node) ? (
                                  <Virus className="h-3 w-3" />
                                ) : (
                                  <Shield className="h-3 w-3" />
                                )}
                                {node}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-cyber-primary/20 bg-cyber-dark">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold">Defense Tools</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Defense Effectiveness</span>
                          <span>{defenseEffectiveness}%</span>
                        </div>
                        <Progress 
                          value={defenseEffectiveness} 
                          className="h-2" 
                          indicatorClassName={`${
                            defenseEffectiveness < 30 ? "bg-red-500" :
                            defenseEffectiveness < 60 ? "bg-amber-500" :
                            "bg-green-500"
                          }`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Button 
                          variant={activeDefenses.includes("Network Isolation") ? "default" : "outline"} 
                          className="w-full justify-start"
                          onClick={() => toggleDefense("Network Isolation")}
                        >
                          <Shield className={`h-4 w-4 mr-2 ${activeDefenses.includes("Network Isolation") ? "text-white" : "text-cyber-primary"}`} />
                          Network Isolation
                        </Button>
                        <Button 
                          variant={activeDefenses.includes("System Backup") ? "default" : "outline"} 
                          className="w-full justify-start"
                          onClick={() => toggleDefense("System Backup")}
                        >
                          <Shield className={`h-4 w-4 mr-2 ${activeDefenses.includes("System Backup") ? "text-white" : "text-cyber-primary"}`} />
                          System Backup
                        </Button>
                        <Button 
                          variant={activeDefenses.includes("Endpoint Protection") ? "default" : "outline"} 
                          className="w-full justify-start"
                          onClick={() => toggleDefense("Endpoint Protection")}
                        >
                          <Shield className={`h-4 w-4 mr-2 ${activeDefenses.includes("Endpoint Protection") ? "text-white" : "text-cyber-primary"}`} />
                          Endpoint Protection
                        </Button>
                        <Button 
                          variant={activeDefenses.includes("Emergency Response") ? "default" : "outline"} 
                          className="w-full justify-start"
                          onClick={() => toggleDefense("Emergency Response")}
                        >
                          <Shield className={`h-4 w-4 mr-2 ${activeDefenses.includes("Emergency Response") ? "text-white" : "text-cyber-primary"}`} />
                          Emergency Response
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
                  <ImprovedThreatMap />
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {availableNodes.map(node => (
                      <Card key={node} className={`bg-cyber-background/30 ${affectedNodes.includes(node) ? "border-red-500/30" : ""}`}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center justify-between">
                            <span>{node}</span>
                            {affectedNodes.includes(node) && (
                              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                                Infected
                              </span>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-cyber-muted">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Operating System:</span>
                              <span>Windows Server 2022</span>
                            </div>
                            <div className="flex justify-between">
                              <span>IP Address:</span>
                              <span>192.168.1.{10 + availableNodes.indexOf(node)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Vulnerabilities:</span>
                              <span className="text-amber-400">Medium</span>
                            </div>
                          </div>
                          
                          {affectedNodes.includes(node) && (
                            <div className="mt-3 p-2 bg-cyber-dark rounded border border-red-500/30">
                              <p className="text-red-400 font-semibold mb-1">Ransomware Detected</p>
                              <p>Encryption in progress - {Math.min(100, fileEncryptionProgress + Math.random() * 10).toFixed(0)}% complete</p>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button variant="outline" size="sm" className="w-full">
                            {affectedNodes.includes(node) ? "Attempt Recovery" : "View Details"}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="bg-cyber-background/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Network Traffic Analysis</CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs text-cyber-muted">
                        <p>Analyze network traffic patterns to identify lateral movement and data exfiltration attempts by the ransomware.</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">Launch Tool</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-cyber-background/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">File Recovery</CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs text-cyber-muted">
                        <p>Attempt to recover encrypted files from backups or using decryption tools if available.</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">Launch Tool</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-cyber-background/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Malware Analysis</CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs text-cyber-muted">
                        <p>Analyze the ransomware sample in a sandbox environment to understand its behavior and identify indicators of compromise.</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">Launch Tool</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-cyber-background/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Incident Response</CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs text-cyber-muted">
                        <p>Follow structured incident response procedures to contain, eradicate, and recover from the ransomware attack.</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">Launch Tool</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-cyber-background/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">System Isolation</CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs text-cyber-muted">
                        <p>Isolate infected systems from the network to prevent further spread of the ransomware.</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">Launch Tool</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-cyber-background/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Forensic Investigation</CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs text-cyber-muted">
                        <p>Conduct digital forensics to determine the initial infection vector and develop attribution if possible.</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">Launch Tool</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
