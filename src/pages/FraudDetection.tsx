
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, AlertCircle, Bell } from "lucide-react";
import { StatisticsChart } from "@/components/StatisticsChart";

const fraudTypeData = [
  { name: "Identity Theft", value: 87, fill: "#9b87f5" },
  { name: "Credit Card", value: 134, fill: "#0FA0CE" },
  { name: "Investment", value: 56, fill: "#ea384c" },
  { name: "Loan", value: 78, fill: "#8B5CF6" },
  { name: "Online Shopping", value: 125, fill: "#f97316" },
  { name: "Insurance", value: 42, fill: "#8E9196" },
];

const recentFrauds = [
  {
    id: "FR-7823",
    type: "Credit Card Fraud",
    severity: "high",
    location: "Delhi",
    date: "2025-04-20",
    status: "investigating",
  },
  {
    id: "FR-7824",
    type: "Identity Theft",
    severity: "critical",
    location: "Mumbai",
    date: "2025-04-20",
    status: "resolved",
  },
  {
    id: "FR-7825",
    type: "Investment Scam",
    severity: "medium",
    location: "Chandigarh",
    date: "2025-04-19",
    status: "investigating",
  },
  {
    id: "FR-7826",
    type: "Online Shopping Fraud",
    severity: "low",
    location: "Bangalore",
    date: "2025-04-19",
    status: "resolved",
  },
  {
    id: "FR-7827",
    type: "Loan Fraud",
    severity: "high",
    location: "Hyderabad",
    date: "2025-04-18",
    status: "investigating",
  },
];

export default function FraudDetection() {
  return (
    <div className="flex h-screen bg-cyber-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-cyber-background">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <Card className="border-cyber-primary/20 bg-cyber-dark">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Fraud Risk Score</CardTitle>
                <CardDescription>Current fraud risk level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-cyber-muted">Risk Level</span>
                    <span className="text-sm font-semibold text-amber-500">Medium</span>
                  </div>
                  <Progress value={62} className="h-2" indicatorClassName="bg-amber-500" />
                  <p className="text-xs text-cyber-muted mt-2">
                    Current risk assessment based on 1,248 data points and ML analysis
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-cyber-primary/20 bg-cyber-dark">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Detection Rate</CardTitle>
                <CardDescription>System performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-cyber-muted">Accuracy</span>
                    <span className="text-sm font-semibold text-green-500">93.7%</span>
                  </div>
                  <Progress value={93.7} className="h-2" indicatorClassName="bg-green-500" />
                  <p className="text-xs text-cyber-muted mt-2">
                    Based on verified frauds vs. false positives in last 30 days
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-cyber-primary/20 bg-cyber-dark">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Active Monitoring</CardTitle>
                <CardDescription>Real-time alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">32 New Alerts</span>
                    <span className="text-xs text-cyber-muted">12 High Priority</span>
                  </div>
                  <Bell className="h-8 w-8 text-cyber-primary" />
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="flex items-center gap-1 text-xs">
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                    <span>Medium: 14</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <AlertCircle className="h-3 w-3 text-red-500" />
                    <span>High: 12</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Resolved: 6</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="overview" className="mb-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatisticsChart 
                  title="Fraud by Type" 
                  data={fraudTypeData} 
                />
                
                <Card className="border-cyber-primary/20 bg-cyber-dark">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Recent Fraud Cases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentFrauds.map((fraud) => (
                        <div key={fraud.id} className="flex items-center justify-between p-2 border-b border-cyber-primary/10">
                          <div>
                            <div className="font-medium">{fraud.type}</div>
                            <div className="text-xs text-cyber-muted">ID: {fraud.id} | {fraud.location}</div>
                          </div>
                          <div className="flex items-center">
                            <span 
                              className={`text-xs px-2 py-1 rounded-full ${
                                fraud.severity === 'critical' ? 'bg-red-500/20 text-red-500' :
                                fraud.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                                fraud.severity === 'medium' ? 'bg-amber-500/20 text-amber-500' :
                                'bg-blue-500/20 text-blue-500'
                              }`}
                            >
                              {fraud.severity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="alerts">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle>Active Fraud Alerts</CardTitle>
                  <CardDescription>Real-time monitoring of potential fraud activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Alert details dashboard would be displayed here...</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analysis">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle>Fraud Pattern Analysis</CardTitle>
                  <CardDescription>AI-powered analysis of fraud patterns and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Analysis dashboard would be displayed here...</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reports">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle>Fraud Reports</CardTitle>
                  <CardDescription>Generate and download reports on fraud cases</CardDescription>
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
