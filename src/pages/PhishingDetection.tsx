
import { useState, useRef } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart, XAxis, YAxis, Bar, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Mail, Upload, Search, Shield, AlertTriangle, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Mock data
const weeklyData = [
  { name: "Mon", value: 23 },
  { name: "Tue", value: 35 },
  { name: "Wed", value: 45 },
  { name: "Thu", value: 30 },
  { name: "Fri", value: 55 },
  { name: "Sat", value: 25 },
  { name: "Sun", value: 15 },
];

const attackTypeData = [
  { name: "Credential Harvest", value: 45 },
  { name: "Malware", value: 25 },
  { name: "Data Theft", value: 18 },
  { name: "Wire Fraud", value: 12 },
];

const colors = ["#9b87f5", "#0FA0CE", "#ea384c", "#8B5CF6"];

const recentEmails = [
  {
    id: "1",
    subject: "Urgent: Your account security verification needed",
    sender: "security-team@bankemail-verify.com",
    date: "2023-04-20 10:23 AM",
    risk: "high",
    status: "Quarantined"
  },
  {
    id: "2",
    subject: "Invoice #INV-29841 Payment Required",
    sender: "accounts@company-billing.net",
    date: "2023-04-20 09:45 AM",
    risk: "medium",
    status: "Analyzed"
  },
  {
    id: "3",
    subject: "Important: Tax refund notification",
    sender: "tax-refund@gov-portal.org",
    date: "2023-04-20 08:17 AM",
    risk: "high",
    status: "Quarantined"
  },
  {
    id: "4",
    subject: "Your package delivery status",
    sender: "tracking@delivery-status-info.com",
    date: "2023-04-19 05:30 PM",
    risk: "medium",
    status: "Analyzed"
  },
  {
    id: "5",
    subject: "HR: Important document for signature",
    sender: "hr@company-docs-sign.com",
    date: "2023-04-19 04:22 PM",
    risk: "critical",
    status: "Quarantined"
  }
];

const riskColors = {
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20", 
  critical: "bg-cyber-warning/10 text-cyber-warning border-cyber-warning/20",
};

export default function PhishingDetection() {
  const [analyzing, setAnalyzing] = useState(false);
  const [emailText, setEmailText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<null | {
    risk: "low" | "medium" | "high" | "critical";
    confidence: number;
    threats: string[];
    summary: string;
  }>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, parse EXML file
    // For demo, we'll simulate loading and then set a mock result
    setAnalyzing(true);
    toast({
      title: "File uploaded",
      description: `Analyzing ${file.name}...`,
    });

    // Simulate AI analysis delay
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisResult({
        risk: "high",
        confidence: 94.7,
        threats: ["Suspicious sender domain", "Urgency language", "Suspicious links"],
        summary: "This email shows multiple signs of a phishing attempt targeting credentials."
      });
      toast({
        title: "Analysis complete",
        description: "High risk phishing attempt detected",
        variant: "destructive"
      });
    }, 2000);
  };

  const handleTextAnalysis = () => {
    if (!emailText.trim()) {
      toast({
        title: "Error",
        description: "Please enter email content to analyze",
        variant: "destructive"
      });
      return;
    }

    setAnalyzing(true);
    toast({
      title: "Processing",
      description: "Analyzing email content...",
    });

    // Simulate AI analysis delay
    setTimeout(() => {
      setAnalyzing(false);
      
      // Determine risk level based on common phishing terms in the text
      const phishingTerms = ['urgent', 'verify', 'account', 'password', 'login', 'bank', 'update', 'immediately'];
      const termCount = phishingTerms.filter(term => emailText.toLowerCase().includes(term)).length;
      
      let risk: "low" | "medium" | "high" | "critical" = "low";
      if (termCount >= 4) risk = "critical";
      else if (termCount >= 3) risk = "high";
      else if (termCount >= 2) risk = "medium";
      
      setAnalysisResult({
        risk,
        confidence: 75 + (termCount * 5),
        threats: termCount > 0 ? ["Suspicious language patterns", "Potential social engineering"] : ["No obvious threats detected"],
        summary: termCount > 2 
          ? "This email contains multiple red flags consistent with phishing attempts." 
          : "This email appears to be relatively low risk but exercise caution."
      });
      
      toast({
        title: "Analysis complete",
        description: `${risk.charAt(0).toUpperCase() + risk.slice(1)} risk assessment completed`,
        variant: risk === "low" ? "default" : "destructive"
      });
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-cyber-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-cyber-background">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">Phishing Email Detection</h1>
              <p className="text-cyber-muted">Real-time email analysis and threat protection</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button className="flex items-center gap-2" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4" />
                <span>Upload EXML</span>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept=".eml,.exml,.txt" 
                  onChange={handleFileUpload}
                />
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>Advanced Search</span>
              </Button>
            </div>
          </div>

          {analysisResult && (
            <Card className={`mb-6 border-2 ${
              analysisResult.risk === 'low' ? 'border-blue-500/50 bg-blue-950/10' :
              analysisResult.risk === 'medium' ? 'border-yellow-500/50 bg-yellow-950/10' :
              analysisResult.risk === 'high' ? 'border-orange-500/50 bg-orange-950/10' :
              'border-cyber-warning/50 bg-red-950/10'
            }`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className={`h-5 w-5 ${
                    analysisResult.risk === 'low' ? 'text-blue-500' :
                    analysisResult.risk === 'medium' ? 'text-yellow-500' :
                    analysisResult.risk === 'high' ? 'text-orange-500' :
                    'text-cyber-warning'
                  }`} />
                  Email Analysis Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="font-medium text-sm">Risk Assessment</div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${riskColors[analysisResult.risk]}`}>
                        {analysisResult.risk.toUpperCase()}
                      </span>
                      <span className="text-sm text-cyber-muted">
                        {analysisResult.confidence.toFixed(1)}% confidence
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="font-medium text-sm">Detected Threats</div>
                    <ul className="text-sm text-cyber-muted space-y-1">
                      {analysisResult.threats.map((threat, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-cyber-primary"></div>
                          {threat}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="font-medium text-sm">Summary</div>
                    <p className="text-sm text-cyber-muted">{analysisResult.summary}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mb-6 border-cyber-primary/20 bg-cyber-dark">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Email Content Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Textarea 
                    placeholder="Paste email content here for analysis..." 
                    className="h-32"
                    value={emailText}
                    onChange={(e) => setEmailText(e.target.value)}
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <Button 
                    className="w-full" 
                    onClick={handleTextAnalysis}
                    disabled={analyzing}
                  >
                    {analyzing ? "Analyzing..." : "Analyze Email Content"}
                  </Button>
                  <div className="mt-2 text-xs text-center text-cyber-muted">
                    Our AI will scan for phishing indicators and social engineering tactics
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-cyber-primary/20 bg-cyber-dark">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Mail className="h-5 w-5 text-cyber-primary" />
                  Detection Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold">248</span>
                    <span className="text-sm text-cyber-muted">Total Analyzed</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-cyber-warning">42</span>
                    <span className="text-sm text-cyber-muted">Threats Detected</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-green-500">97.8%</span>
                    <span className="text-sm text-cyber-muted">Detection Rate</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-blue-500">0.3%</span>
                    <span className="text-sm text-cyber-muted">False Positive</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-cyber-primary/20 bg-cyber-dark md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-cyber-primary" />
                  Phishing Attempts (Last 7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a3044" />
                      <XAxis dataKey="name" stroke="#8E9196" fontSize={12} />
                      <YAxis stroke="#8E9196" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1A1F2C",
                          borderColor: "#8B5CF6",
                          borderRadius: "4px",
                          fontSize: "12px",
                        }}
                        cursor={{ fill: "rgba(139, 92, 246, 0.1)" }}
                      />
                      <Bar dataKey="value" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-cyber-primary/20 bg-cyber-dark">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Attack Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attackTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {attackTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1A1F2C",
                          borderColor: "#8B5CF6",
                          borderRadius: "4px",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-cyber-primary/20 bg-cyber-dark md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-cyber-primary" />
                  Detection Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="analysis">
                  <TabsList className="mb-4 bg-cyber-primary/10 border border-cyber-primary/20">
                    <TabsTrigger value="analysis">Analysis Methods</TabsTrigger>
                    <TabsTrigger value="indicators">Key Indicators</TabsTrigger>
                  </TabsList>
                  <TabsContent value="analysis" className="space-y-3">
                    <div className="p-3 bg-cyber-primary/5 rounded-md border border-cyber-primary/10">
                      <h3 className="font-medium mb-1">ML-Based Header Analysis</h3>
                      <p className="text-sm text-cyber-muted">
                        Using machine learning to analyze email headers for anomalies, sender verification, and routing inconsistencies
                      </p>
                    </div>
                    <div className="p-3 bg-cyber-primary/5 rounded-md border border-cyber-primary/10">
                      <h3 className="font-medium mb-1">NLP Content Inspection</h3>
                      <p className="text-sm text-cyber-muted">
                        Natural language processing to detect social engineering attempts, urgent language patterns, and psychological manipulation
                      </p>
                    </div>
                    <div className="p-3 bg-cyber-primary/5 rounded-md border border-cyber-primary/10">
                      <h3 className="font-medium mb-1">URL & Attachment Scanning</h3>
                      <p className="text-sm text-cyber-muted">
                        Deep inspection of embedded URLs and file attachments for malicious content, obfuscation techniques, and known threat signatures
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="indicators" className="space-y-3">
                    <div className="p-3 bg-cyber-primary/5 rounded-md border border-cyber-primary/10">
                      <h3 className="font-medium mb-1">Domain Mismatch</h3>
                      <p className="text-sm text-cyber-muted">
                        Sender domain doesn't match claimed organization or contains slight misspellings
                      </p>
                    </div>
                    <div className="p-3 bg-cyber-primary/5 rounded-md border border-cyber-primary/10">
                      <h3 className="font-medium mb-1">Urgency Language</h3>
                      <p className="text-sm text-cyber-muted">
                        Message creates artificial time pressure or threatens negative consequences
                      </p>
                    </div>
                    <div className="p-3 bg-cyber-primary/5 rounded-md border border-cyber-primary/10">
                      <h3 className="font-medium mb-1">Credential Requests</h3>
                      <p className="text-sm text-cyber-muted">
                        Email asks for passwords, account verification, or financial information
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <Card className="border-cyber-primary/20 bg-cyber-dark">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Recent Suspicious Emails</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyber-primary/20">
                      <th className="text-left font-medium text-cyber-muted p-3">Subject</th>
                      <th className="text-left font-medium text-cyber-muted p-3">Sender</th>
                      <th className="text-left font-medium text-cyber-muted p-3">Date</th>
                      <th className="text-left font-medium text-cyber-muted p-3">Risk Level</th>
                      <th className="text-left font-medium text-cyber-muted p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEmails.map((email) => (
                      <tr key={email.id} className="border-b border-cyber-primary/10 hover:bg-cyber-primary/5">
                        <td className="p-3">{email.subject}</td>
                        <td className="p-3 text-cyber-muted">{email.sender}</td>
                        <td className="p-3 text-cyber-muted">{email.date}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${riskColors[email.risk as keyof typeof riskColors]}`}>
                            {email.risk}
                          </span>
                        </td>
                        <td className="p-3 text-cyber-muted">{email.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
