import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, User, MessageSquare, Clock, FileText, BadgeCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge as BadgeIcon } from "lucide-react";

export default function Profile() {
  return (
    <div className="flex h-screen bg-cyber-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-cyber-background">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader className="text-center">
                  <div className="w-24 h-24 rounded-full bg-cyber-primary/20 mx-auto flex items-center justify-center mb-4">
                    <User className="h-12 w-12 text-cyber-primary" />
                  </div>
                  <CardTitle>Officer Raj Kumar</CardTitle>
                  <CardDescription className="flex items-center justify-center gap-1">
                    <BadgeCheck className="h-4 w-4 text-cyber-primary" />
                    Cyber Crime Specialist
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-cyber-muted">Badge ID</span>
                      <span className="font-medium">CP2345</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-cyber-muted">Department</span>
                      <span className="font-medium">Digital Forensics</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-cyber-muted">Location</span>
                      <span className="font-medium">Chandigarh HQ</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-cyber-muted">Joined</span>
                      <span className="font-medium">August 2023</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-cyber-primary/10">
                    <h3 className="text-sm font-medium mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-cyber-muted">Email</span>
                        <span className="text-sm">raj.kumar@cybercell.gov.in</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-cyber-muted">Phone</span>
                        <span className="text-sm">+91 987X XXX345</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-cyber-primary/10">
                    <h3 className="text-sm font-medium mb-3">Expertise</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Digital Forensics</span>
                          <span>92%</span>
                        </div>
                        <Progress value={92} className="h-1" indicatorClassName="bg-green-500" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Cyber Intelligence</span>
                          <span>85%</span>
                        </div>
                        <Progress value={85} className="h-1" indicatorClassName="bg-blue-500" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Financial Crime Analysis</span>
                          <span>78%</span>
                        </div>
                        <Progress value={78} className="h-1" indicatorClassName="bg-amber-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="md:col-span-2 space-y-6">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-cyber-primary" />
                    Case Overview
                  </CardTitle>
                  <CardDescription>Summary of cases handled and resolved</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-cyber-background/30 p-4 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-cyber-muted">Total Cases</span>
                        <span className="text-lg font-bold">87</span>
                      </div>
                      <Progress value={100} className="h-1" />
                    </div>
                    <div className="bg-cyber-background/30 p-4 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-cyber-muted">Resolved</span>
                        <span className="text-lg font-bold">72</span>
                      </div>
                      <Progress value={72/87*100} className="h-1" indicatorClassName="bg-green-500" />
                    </div>
                    <div className="bg-cyber-background/30 p-4 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-cyber-muted">In Progress</span>
                        <span className="text-lg font-bold">15</span>
                      </div>
                      <Progress value={15/87*100} className="h-1" indicatorClassName="bg-amber-500" />
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-medium mb-3">Recent Cases</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-cyber-background/30 rounded">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-cyber-primary" />
                        <div>
                          <p className="font-medium">UPI Fraud Investigation</p>
                          <p className="text-xs text-cyber-muted">Started April 16, 2025</p>
                        </div>
                      </div>
                      <span className="text-xs bg-amber-500/20 text-amber-500 px-2 py-1 rounded-full">In Progress</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-cyber-background/30 rounded">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-cyber-primary" />
                        <div>
                          <p className="font-medium">Bank Phishing Campaign</p>
                          <p className="text-xs text-cyber-muted">Started March 30, 2025</p>
                        </div>
                      </div>
                      <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">Resolved</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-cyber-background/30 rounded">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-cyber-primary" />
                        <div>
                          <p className="font-medium">Ransomware Attack Response</p>
                          <p className="text-xs text-cyber-muted">Started April 8, 2025</p>
                        </div>
                      </div>
                      <span className="text-xs bg-amber-500/20 text-amber-500 px-2 py-1 rounded-full">In Progress</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-cyber-primary" />
                    Activity History
                  </CardTitle>
                  <CardDescription>Recent system activities and logins</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-cyber-primary/20 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-cyber-primary" />
                      </div>
                      <div>
                        <p className="text-sm">Logged in from Chandigarh HQ</p>
                        <p className="text-xs text-cyber-muted">Today, 08:45 AM</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-cyber-primary/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-4 w-4 text-cyber-primary" />
                      </div>
                      <div>
                        <p className="text-sm">Generated UPI Fraud Analysis Report</p>
                        <p className="text-xs text-cyber-muted">Today, 10:22 AM</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-cyber-primary/20 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="h-4 w-4 text-cyber-primary" />
                      </div>
                      <div>
                        <p className="text-sm">Added comments to Case #CP-2587</p>
                        <p className="text-xs text-cyber-muted">Today, 11:30 AM</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-cyber-primary/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-4 w-4 text-cyber-primary" />
                      </div>
                      <div>
                        <p className="text-sm">Analyzed suspicious SIM swap pattern</p>
                        <p className="text-xs text-cyber-muted">Today, 02:15 PM</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-cyber-primary/20 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-4 w-4 text-cyber-primary" />
                      </div>
                      <div>
                        <p className="text-sm">Updated Deepfake Detection parameters</p>
                        <p className="text-xs text-cyber-muted">Today, 03:42 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BadgeIcon className="h-5 w-5 text-cyber-primary" />
                    Certifications & Training
                  </CardTitle>
                  <CardDescription>Professional qualifications and completed courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-2 border-cyber-primary pl-4 py-1">
                      <h4 className="font-medium">Certified Cyber Forensics Professional (CCFP)</h4>
                      <p className="text-sm text-cyber-muted">International Association of Computer Investigative Specialists</p>
                      <p className="text-xs text-cyber-muted mt-1">Completed June 2023</p>
                    </div>
                    <div className="border-l-2 border-cyber-primary pl-4 py-1">
                      <h4 className="font-medium">Advanced Digital Forensics Training</h4>
                      <p className="text-sm text-cyber-muted">National Cybercrime Training Center, New Delhi</p>
                      <p className="text-xs text-cyber-muted mt-1">Completed November 2023</p>
                    </div>
                    <div className="border-l-2 border-cyber-primary pl-4 py-1">
                      <h4 className="font-medium">Financial Crime Investigation Specialist</h4>
                      <p className="text-sm text-cyber-muted">Association of Certified Financial Crime Specialists</p>
                      <p className="text-xs text-cyber-muted mt-1">Completed February 2024</p>
                    </div>
                    <div className="border-l-2 border-cyber-primary pl-4 py-1">
                      <h4 className="font-medium">AI for Cyber Threat Intelligence</h4>
                      <p className="text-sm text-cyber-muted">Bureau of Police Research and Development</p>
                      <p className="text-xs text-cyber-muted mt-1">Completed March 2025</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
