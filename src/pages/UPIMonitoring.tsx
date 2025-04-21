
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Database, AlertTriangle, CheckCircle, TrendingUp, Search } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { StatisticsChart } from "@/components/StatisticsChart";

const upiTrendData = [
  { name: "Jan", value: 87, fill: "#9b87f5" },
  { name: "Feb", value: 94, fill: "#0FA0CE" },
  { name: "Mar", value: 118, fill: "#ea384c" },
  { name: "Apr", value: 143, fill: "#8B5CF6" },
  { name: "May", value: 129, fill: "#f97316" },
  { name: "Jun", value: 156, fill: "#8E9196" },
];

const recentAlerts = [
  {
    id: "UPI-2587",
    type: "Multiple Rapid Transactions",
    amount: "₹47,800",
    severity: "high",
    status: "investigating",
    time: "10:23 AM",
    date: "Today"
  },
  {
    id: "UPI-2586",
    type: "Unusual Recipient",
    amount: "₹24,650",
    severity: "medium",
    status: "investigating",
    time: "09:17 AM",
    date: "Today"
  },
  {
    id: "UPI-2585",
    type: "New Device Login",
    amount: "₹36,200",
    severity: "high",
    status: "resolved",
    time: "06:48 AM",
    date: "Today"
  },
  {
    id: "UPI-2584",
    type: "Abnormal Transaction Pattern",
    amount: "₹12,750",
    severity: "medium",
    status: "resolved",
    time: "11:52 PM",
    date: "Yesterday"
  },
  {
    id: "UPI-2583",
    type: "Late Night Activity",
    amount: "₹18,930",
    severity: "low",
    status: "resolved",
    time: "02:41 AM",
    date: "Yesterday"
  },
];

export default function UPIMonitoring() {
  return (
    <div className="flex h-screen bg-cyber-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-cyber-background">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <Card className="border-cyber-primary/20 bg-cyber-dark">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">UPI Transaction Monitor</CardTitle>
                <CardDescription>Real-time fraud detection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">₹12.4L</span>
                    <span className="text-xs text-cyber-muted">Fraud attempts prevented today</span>
                  </div>
                  <Database className="h-10 w-10 text-cyber-primary" />
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Detection Efficiency</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-1" indicatorClassName="bg-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-cyber-primary/20 bg-cyber-dark">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Fraud Alerts</CardTitle>
                <CardDescription>Suspicious UPI transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">27</span>
                    <span className="text-xs text-cyber-muted">Active fraud alerts</span>
                  </div>
                  <AlertTriangle className="h-10 w-10 text-amber-500" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-xs">12 High Priority</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="text-xs">15 Medium Priority</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View All Alerts
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-cyber-primary/20 bg-cyber-dark">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Fraud Recovery</CardTitle>
                <CardDescription>Victim assistance status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">₹36.7L</span>
                    <span className="text-xs text-cyber-muted">Recovered this month</span>
                  </div>
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Recovery Rate</span>
                    <span>68%</span>
                  </div>
                  <Progress value={68} className="h-1" indicatorClassName="bg-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="dashboard" className="mb-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="transactions">Transaction Monitor</TabsTrigger>
              <TabsTrigger value="patterns">Fraud Patterns</TabsTrigger>
              <TabsTrigger value="victims">Victim Support</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-cyber-primary/20 bg-cyber-dark">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">UPI Fraud Trends</CardTitle>
                    <CardDescription>Monthly detected fraud attempts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <StatisticsChart 
                      title="Monthly Fraud Trends" 
                      data={upiTrendData} 
                    />
                  </CardContent>
                </Card>
                
                <Card className="border-cyber-primary/20 bg-cyber-dark">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Recent Alerts</CardTitle>
                    <CardDescription>Latest suspicious transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentAlerts.map((alert) => (
                        <div key={alert.id} className="flex items-center justify-between p-2 border-b border-cyber-primary/10">
                          <div>
                            <div className="font-medium">{alert.type}</div>
                            <div className="text-xs text-cyber-muted">{alert.id} | {alert.time}, {alert.date}</div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-medium">{alert.amount}</span>
                            <span 
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                alert.severity === 'high' ? 'bg-red-500/20 text-red-500' :
                                alert.severity === 'medium' ? 'bg-amber-500/20 text-amber-500' :
                                'bg-blue-500/20 text-blue-500'
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
                    <CardTitle className="text-lg font-semibold">Transaction Search</CardTitle>
                    <CardDescription>Search for specific UPI transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyber-muted h-4 w-4" />
                        <input 
                          type="text" 
                          placeholder="Search by UPI ID, phone number, or transaction ID"
                          className="w-full pl-10 p-2 bg-cyber-background border border-cyber-primary/20 rounded"
                        />
                      </div>
                      <Button>Search</Button>
                    </div>
                    <div className="flex flex-col items-center justify-center h-32 border border-dashed border-cyber-primary/20 rounded">
                      <TrendingUp className="h-8 w-8 text-cyber-muted mb-2" />
                      <p className="text-sm text-cyber-muted">Enter search criteria to find transactions</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="transactions">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle>Live Transaction Monitor</CardTitle>
                  <CardDescription>Real-time UPI transaction monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Transaction monitoring dashboard would be displayed here...</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="patterns">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle>Fraud Pattern Analysis</CardTitle>
                  <CardDescription>AI-detected UPI fraud patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Fraud patterns dashboard would be displayed here...</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="victims">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle>Victim Support System</CardTitle>
                  <CardDescription>Assistance for UPI fraud victims</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Victim support dashboard would be displayed here...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
