
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertTriangle, Smartphone, Bell, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { StatisticsChart } from "@/components/StatisticsChart";

const simFraudData = [
  { name: "SIM Swapping", value: 73, fill: "#9b87f5" },
  { name: "OTP Bypass", value: 58, fill: "#0FA0CE" },
  { name: "Identity Theft", value: 42, fill: "#ea384c" },
  { name: "Fake KYC", value: 64, fill: "#8B5CF6" },
  { name: "Remote Access", value: 38, fill: "#f97316" },
];

const recentAlerts = [
  {
    id: "SF-1072",
    type: "SIM Swap Attempt",
    phone: "+91 98XX XX1234",
    severity: "critical",
    status: "active",
    time: "11:42 AM",
  },
  {
    id: "SF-1071",
    type: "Multiple OTP Requests",
    phone: "+91 87XX XX5678",
    severity: "high",
    status: "active",
    time: "10:15 AM",
  },
  {
    id: "SF-1070",
    type: "Unusual Location Access",
    phone: "+91 76XX XX4321",
    severity: "medium",
    status: "active",
    time: "09:23 AM",
  },
  {
    id: "SF-1069",
    type: "UPI App Deregistration",
    phone: "+91 95XX XX7890",
    severity: "high",
    status: "resolved",
    time: "08:07 AM",
  },
  {
    id: "SF-1068",
    type: "Banking App Login from New Device",
    phone: "+91 98XX XX5432",
    severity: "medium",
    status: "resolved",
    time: "Yesterday",
  },
];

export default function SIMFraudDetection() {
  return (
    <div className="flex h-screen bg-cyber-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-cyber-background">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <Card className="border-cyber-primary/20 bg-cyber-dark">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">SIM Fraud Detection</CardTitle>
                <CardDescription>Early detection system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">86</span>
                    <span className="text-xs text-cyber-muted">Potential SIM frauds detected today</span>
                  </div>
                  <ShieldCheck className="h-10 w-10 text-cyber-primary" />
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Detection Rate</span>
                    <span>94%</span>
                  </div>
                  <Progress value={94} className="h-1" indicatorClassName="bg-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-cyber-primary/20 bg-cyber-dark">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Active Alerts</CardTitle>
                <CardDescription>Unresolved SIM fraud cases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">23</span>
                    <span className="text-xs text-cyber-muted">Active fraud alerts</span>
                  </div>
                  <Bell className="h-10 w-10 text-amber-500" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-xs">4 Critical Priority</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="text-xs">19 Medium to High Priority</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View All Alerts
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-cyber-primary/20 bg-cyber-dark">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Real-time Monitoring</CardTitle>
                <CardDescription>Telecom data stream</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">4.2M</span>
                    <span className="text-xs text-cyber-muted">Signals processed today</span>
                  </div>
                  <RefreshCw className="h-10 w-10 text-cyber-primary animate-spin" />
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>System Load</span>
                    <span>43%</span>
                  </div>
                  <Progress value={43} className="h-1" indicatorClassName="bg-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="dashboard" className="mb-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
              <TabsTrigger value="analysis">Correlation Analysis</TabsTrigger>
              <TabsTrigger value="patterns">Fraud Patterns</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-cyber-primary/20 bg-cyber-dark">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">SIM Fraud by Type</CardTitle>
                    <CardDescription>Distribution of detected fraud attempts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <StatisticsChart 
                      title="SIM Fraud Types" 
                      data={simFraudData} 
                    />
                  </CardContent>
                </Card>
                
                <Card className="border-cyber-primary/20 bg-cyber-dark">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Recent Alerts</CardTitle>
                    <CardDescription>Latest SIM fraud alerts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentAlerts.map((alert) => (
                        <div key={alert.id} className="flex items-center justify-between p-2 border-b border-cyber-primary/10">
                          <div>
                            <div className="font-medium">{alert.type}</div>
                            <div className="text-xs text-cyber-muted">{alert.id} | {alert.phone}</div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-cyber-muted">{alert.time}</span>
                            <span 
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                alert.severity === 'critical' ? 'bg-red-500/20 text-red-500' :
                                alert.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                                'bg-amber-500/20 text-amber-500'
                              }`}
                            >
                              {alert.severity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-cyber-primary/20 bg-cyber-dark col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">SIM Fraud Protection Status</CardTitle>
                    <CardDescription>System performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-cyber-background/30 p-4 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <Smartphone className="h-5 w-5 text-cyber-primary" />
                          <span className="font-medium">Telco Signal Monitoring</span>
                        </div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Coverage</span>
                          <span>98%</span>
                        </div>
                        <Progress value={98} className="h-1" indicatorClassName="bg-green-500" />
                      </div>
                      
                      <div className="bg-cyber-background/30 p-4 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <RefreshCw className="h-5 w-5 text-cyber-primary" />
                          <span className="font-medium">Banking API Integration</span>
                        </div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Status</span>
                          <span>92%</span>
                        </div>
                        <Progress value={92} className="h-1" indicatorClassName="bg-amber-500" />
                      </div>
                      
                      <div className="bg-cyber-background/30 p-4 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-5 w-5 text-cyber-primary" />
                          <span className="font-medium">Alert Response Time</span>
                        </div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Performance</span>
                          <span>96%</span>
                        </div>
                        <Progress value={96} className="h-1" indicatorClassName="bg-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="alerts">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle>SIM Fraud Alerts</CardTitle>
                  <CardDescription>Detailed view of all active alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>SIM fraud alerts dashboard would be displayed here...</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analysis">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle>Correlation Analysis</CardTitle>
                  <CardDescription>Signal correlation across telecom and banking data</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Correlation analysis dashboard would be displayed here...</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="patterns">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle>Fraud Patterns</CardTitle>
                  <CardDescription>Known SIM fraud patterns and signatures</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Fraud patterns dashboard would be displayed here...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
