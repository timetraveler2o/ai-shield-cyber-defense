import { useState, useRef, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PhoneCall, Upload, BarChart, Clock, Volume2, ShieldAlert, Mic, MessageSquare, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { StatisticsChart } from "@/components/StatisticsChart";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const callTypeData = [
  { name: "Lottery Scam", value: 127, fill: "#9b87f5" },
  { name: "Bank Fraud", value: 96, fill: "#0FA0CE" },
  { name: "KYC Update", value: 143, fill: "#ea384c" },
  { name: "Govt Impersonation", value: 84, fill: "#8B5CF6" },
  { name: "Tax Fraud", value: 62, fill: "#f97316" },
  { name: "Tech Support", value: 109, fill: "#8E9196" },
];

const fraudPatterns = [
  { pattern: "OTP", description: "One-time password requests", severity: "critical" },
  { pattern: "account blocked", description: "False account suspension claims", severity: "high" },
  { pattern: "click this link", description: "Phishing URL redirection", severity: "high" },
  { pattern: "verify your identity", description: "Identity theft attempts", severity: "medium" },
  { pattern: "urgent action required", description: "False urgency creation", severity: "medium" },
  { pattern: "tax refund", description: "Tax fraud attempts", severity: "high" },
  { pattern: "credit card details", description: "Payment information theft", severity: "critical" },
  { pattern: "won a prize", description: "Lottery and prize scams", severity: "medium" },
];

export default function VoIPAnalysis() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([
    { role: "system", content: "Welcome to Cyber Crime AI Assistant. How can I help you today?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordedAudio(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        toast.info("Recording completed", {
          description: "Your call recording is ready for analysis."
        });
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.info("Recording started", {
        description: "Speak clearly for best analysis results."
      });
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("Microphone access error", {
        description: "Please check your microphone permissions and try again."
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const analyzeAudio = () => {
    if (!recordedAudio && !audioURL) {
      toast.error("No audio to analyze", {
        description: "Please record or upload an audio file first."
      });
      return;
    }

    setIsAnalyzing(true);
    
    setTimeout(() => {
      const fakeTranscription = "Hello, this is your bank calling. We've noticed suspicious activity on your account. To verify your identity and protect your account, we need you to share your OTP code that we just sent to your phone. This is urgent as your account might be blocked.";
      setTranscription(fakeTranscription);
      
      setTimeout(() => {
        const detectedPatterns = fraudPatterns.filter(pattern => 
          fakeTranscription.toLowerCase().includes(pattern.pattern.toLowerCase())
        );
        
        const fraudScore = detectedPatterns.reduce((score, pattern) => {
          if (pattern.severity === "critical") return score + 30;
          if (pattern.severity === "high") return score + 20;
          if (pattern.severity === "medium") return score + 10;
          return score + 5;
        }, 0);
        
        const finalScore = Math.min(fraudScore, 100);
        
        const emotionAnalysis = {
          urgency: 85,
          pressure: 78,
          deception: 92,
          aggression: 42
        };
        
        const analysisResult = {
          fraudProbability: finalScore,
          fraudCategory: finalScore > 70 ? "Bank Impersonation Scam" : "Suspicious Call",
          detectedPatterns,
          emotionAnalysis,
          recommendation: finalScore > 70 
            ? "High probability of fraud. Block this number and report to authorities." 
            : "Suspicious call. Review further before taking action."
        };
        
        setAnalysisResults(analysisResult);
        setIsAnalyzing(false);
        
        toast.success("Analysis complete", {
          description: `Fraud probability: ${finalScore}%`
        });
      }, 1500);
    }, 2000);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMessage = { role: "user", content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    
    setTimeout(() => {
      let aiResponse = "";
      
      if (chatInput.toLowerCase().includes("otp") || chatInput.toLowerCase().includes("password")) {
        aiResponse = "This appears to be a common fraud pattern. Scammers often ask for OTP or passwords to gain unauthorized access to accounts. Advise the victim not to share any codes and report the incident immediately.";
      } else if (chatInput.toLowerCase().includes("bank") || chatInput.toLowerCase().includes("account")) {
        aiResponse = "This message contains patterns consistent with banking fraud. Scammers impersonate bank officials to trick victims into revealing sensitive information or making transfers. Recommend reporting to both the bank and cyber crime portal.";
      } else if (chatInput.toLowerCase().includes("analyze") || chatInput.toLowerCase().includes("detect")) {
        aiResponse = "To analyze suspicious calls, upload the recording or use the real-time call analysis feature. Our AI will detect known fraud patterns, emotional manipulation techniques, and provide a risk assessment.";
      } else {
        aiResponse = "I've analyzed your query. For more specific fraud detection, please provide details about the suspicious call, message, or online interaction. You can also upload recordings or screenshots for analysis.";
      }
      
      setChatMessages(prev => [...prev, { role: "system", content: aiResponse }]);
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioURL(url);
      setRecordedAudio(file);
      toast.success("File uploaded successfully", {
        description: file.name
      });
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
                  <label htmlFor="audio-upload">
                    <Button variant="outline" size="sm" className="mt-4" asChild>
                      <span>Upload Recording</span>
                    </Button>
                    <input 
                      id="audio-upload" 
                      type="file" 
                      accept="audio/*" 
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
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
            <TabsList className="grid w-full grid-cols-5 lg:w-auto">
              <TabsTrigger value="analyzer">Call Analyzer</TabsTrigger>
              <TabsTrigger value="patterns">Scam Patterns</TabsTrigger>
              <TabsTrigger value="blacklist">Number Blacklist</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
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
                          {audioURL ? "Audio file ready for analysis" : "Drop audio files here or click to upload"}
                        </p>
                        <div className="flex gap-2 mt-4">
                          <label htmlFor="voice-upload">
                            <Button variant="default" size="sm" asChild>
                              <span>Upload File</span>
                            </Button>
                            <input 
                              id="voice-upload" 
                              type="file" 
                              accept="audio/*" 
                              className="hidden"
                              onChange={handleFileUpload}
                            />
                          </label>
                          {isRecording ? (
                            <Button variant="destructive" size="sm" onClick={stopRecording}>
                              Stop Recording
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" onClick={startRecording}>
                              <Mic className="h-4 w-4 mr-1" /> Record Call
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {audioURL && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Preview Recording:</p>
                          <audio src={audioURL} controls className="w-full" />
                        </div>
                      )}
                      
                      <div>
                        <label className="text-sm text-cyber-muted">Analysis Type</label>
                        <select className="w-full mt-1 bg-cyber-background border border-cyber-primary/20 rounded p-2 text-sm">
                          <option>Scam Pattern Detection</option>
                          <option>Voice Deepfake Analysis</option>
                          <option>Threat Assessment</option>
                          <option>Speaker Identification</option>
                          <option>Emotional Analysis</option>
                          <option>Language Pattern Analysis</option>
                        </select>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={analyzeAudio}
                        disabled={isAnalyzing || (!recordedAudio && !audioURL)}
                      >
                        {isAnalyzing ? "Analyzing..." : "Analyze Call"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-cyber-primary/20 bg-cyber-dark">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Analysis Results</CardTitle>
                    <CardDescription>
                      {transcription ? "AI-powered fraud detection" : "No call analyzed yet"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 overflow-y-auto">
                    {isAnalyzing ? (
                      <div className="h-full flex flex-col items-center justify-center">
                        <div className="animate-pulse flex flex-col items-center">
                          <BarChart className="h-16 w-16 text-cyber-primary mx-auto mb-4" />
                          <p className="text-cyber-muted">Analyzing call patterns and content...</p>
                          <Progress value={45} className="h-1 w-48 mt-4" />
                        </div>
                      </div>
                    ) : transcription ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Transcription:</h3>
                          <div className="bg-cyber-background/30 p-3 rounded text-sm">
                            {transcription}
                          </div>
                        </div>
                        
                        {analysisResults && (
                          <>
                            <div className="pt-2">
                              <h3 className="text-sm font-medium mb-2">Fraud Assessment:</h3>
                              <div className="flex items-center space-x-2 mb-2">
                                <div 
                                  className={`text-lg font-bold ${
                                    analysisResults.fraudProbability > 70 
                                      ? "text-red-500" 
                                      : analysisResults.fraudProbability > 40 
                                        ? "text-amber-500" 
                                        : "text-green-500"
                                  }`}
                                >
                                  {analysisResults.fraudProbability}%
                                </div>
                                <div className="text-sm font-medium">Fraud Probability</div>
                                <Badge variant={
                                  analysisResults.fraudProbability > 70 
                                    ? "destructive" 
                                    : analysisResults.fraudProbability > 40 
                                      ? "default" 
                                      : "outline"
                                }>
                                  {analysisResults.fraudCategory}
                                </Badge>
                              </div>
                              
                              <div className="mt-4">
                                <h3 className="text-sm font-medium mb-2">Detected Patterns:</h3>
                                <div className="space-y-2">
                                  {analysisResults.detectedPatterns.map((pattern: any, index: number) => (
                                    <div key={index} className="flex items-start gap-2">
                                      <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                                        pattern.severity === "critical" ? "text-red-500" :
                                        pattern.severity === "high" ? "text-amber-500" : "text-yellow-500"
                                      }`} />
                                      <div>
                                        <p className="text-sm font-medium">"{pattern.pattern}"</p>
                                        <p className="text-xs text-cyber-muted">{pattern.description}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="mt-4">
                                <h3 className="text-sm font-medium mb-2">Emotional Analysis:</h3>
                                <div className="grid grid-cols-2 gap-2">
                                  {Object.entries(analysisResults.emotionAnalysis).map(([key, value]: [string, any]) => (
                                    <div key={key} className="bg-cyber-background/30 p-2 rounded">
                                      <div className="flex justify-between text-xs mb-1">
                                        <span className="capitalize">{key}</span>
                                        <span>{value}%</span>
                                      </div>
                                      <Progress 
                                        value={value} 
                                        className="h-1" 
                                        indicatorClassName={
                                          value > 70 ? "bg-red-500" : 
                                          value > 40 ? "bg-amber-500" : "bg-blue-500"
                                        } 
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="mt-4 p-3 rounded bg-cyber-background/30 border-l-4 border-red-500">
                                <h3 className="text-sm font-medium mb-1">Recommendation:</h3>
                                <p className="text-sm">{analysisResults.recommendation}</p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center">
                        <BarChart className="h-16 w-16 text-cyber-primary mx-auto mb-4" />
                        <p className="text-cyber-muted">Upload a call recording to see analysis results</p>
                        <p className="text-xs text-cyber-muted mt-2">
                          Our AI detects known scam patterns, voice artifacts, and suspicious language
                        </p>
                      </div>
                    )}
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
            <TabsContent value="assistant" className="mt-4">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-cyber-primary" />
                    Cyber Crime AI Assistant
                  </CardTitle>
                  <CardDescription>AI-powered investigation assistant</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col h-[400px]">
                    <div 
                      ref={chatContainerRef}
                      className="flex-1 overflow-y-auto mb-4 p-2 bg-cyber-background/30 rounded"
                    >
                      {chatMessages.map((message, index) => (
                        <div 
                          key={index} 
                          className={`mb-3 ${
                            message.role === "user" 
                              ? "ml-12" 
                              : "mr-12"
                          }`}
                        >
                          <div className={`p-3 rounded-lg ${
                            message.role === "user"
                              ? "bg-cyber-primary/20 ml-auto"
                              : "bg-cyber-background"
                          }`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p className="text-xs text-cyber-muted mt-1">
                            {message.role === "user" ? "You" : "AI Assistant"}
                          </p>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleChatSubmit} className="flex gap-2">
                      <Textarea
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask about fraud detection, investigation techniques, or upload evidence for analysis..."
                        className="flex-1 min-h-[60px]"
                      />
                      <Button type="submit">Send</Button>
                    </form>
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
