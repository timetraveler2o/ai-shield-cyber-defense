
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { MessageSquare, AlertTriangle, TrendingUp, Users } from "lucide-react";
import { StatisticsChart } from "@/components/StatisticsChart";

const contentTypeData = [
  { name: "Hate Speech", value: 167, fill: "#9b87f5" },
  { name: "Fake Accounts", value: 239, fill: "#0FA0CE" },
  { name: "Scam Posts", value: 129, fill: "#ea384c" },
  { name: "Threats", value: 86, fill: "#8B5CF6" },
  { name: "Cyberbullying", value: 112, fill: "#f97316" },
  { name: "Misinformation", value: 154, fill: "#8E9196" },
];

const platformData = [
  { name: "Facebook", value: 276, fill: "#9b87f5" },
  { name: "Twitter", value: 185, fill: "#0FA0CE" },
  { name: "Instagram", value: 203, fill: "#ea384c" },
  { name: "YouTube", value: 94, fill: "#8B5CF6" },
  { name: "WhatsApp", value: 127, fill: "#f97316" },
  { name: "Telegram", value: 58, fill: "#8E9196" },
];

export default function SocialMonitoring() {
  return (
    <div className="flex h-screen bg-cyber-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-cyber-background">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <Card className="border-cyber-primary/20 bg-cyber-dark">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Monitored Content</CardTitle>
                <CardDescription>AI-analyzed social media content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">16,842</span>
                    <span className="text-xs text-cyber-muted">Posts analyzed today</span>
                  </div>
                  <MessageSquare className="h-10 w-10 text-cyber-primary" />
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Processing Queue</span>
                    <span>87% Complete</span>
                  </div>
                  <Progress value={87} className="h-1" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-cyber-primary/20 bg-cyber-dark">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Trending Issues</CardTitle>
                <CardDescription>Real-time escalations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">7</span>
                    <span className="text-xs text-cyber-muted">Critical escalations</span>
                  </div>
                  <TrendingUp className="h-10 w-10 text-cyber-primary" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-xs">Trending hashtag #ScamAlert</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="text-xs">Viral misinformation post</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-cyber-primary/20 bg-cyber-dark">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Fake Account Detection</CardTitle>
                <CardDescription>AI-identified suspicious accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">142</span>
                    <span className="text-xs text-cyber-muted">Suspicious accounts flagged</span>
                  </div>
                  <Users className="h-10 w-10 text-cyber-primary" />
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Detection Confidence</span>
                    <span>92.3%</span>
                  </div>
                  <Progress value={92.3} className="h-1" indicatorClassName="bg-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="overview" className="mb-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="threats">Threat Analysis</TabsTrigger>
              <TabsTrigger value="trending">Trending Topics</TabsTrigger>
              <TabsTrigger value="accounts">Suspicious Accounts</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatisticsChart 
                  title="Content by Type" 
                  data={contentTypeData} 
                />
                
                <StatisticsChart 
                  title="Platform Distribution" 
                  data={platformData} 
                />
              </div>
            </TabsContent>
            <TabsContent value="threats">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle>Threat Analysis</CardTitle>
                  <CardDescription>Detailed analysis of social media threats</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Threat analysis dashboard would be displayed here...</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="trending">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle>Trending Topics</CardTitle>
                  <CardDescription>Real-time monitoring of trending topics and hashtags</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Trending topics dashboard would be displayed here...</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="accounts">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle>Suspicious Accounts</CardTitle>
                  <CardDescription>AI-detected suspicious social media accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Suspicious accounts dashboard would be displayed here...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
