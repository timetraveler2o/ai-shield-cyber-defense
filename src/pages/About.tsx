
import React from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Globe, Mail, Shield, Users, Laptop, Fingerprint, Database, FileText, AlertTriangle } from "lucide-react";

export default function About() {
  return (
    <div className="flex h-screen bg-cyber-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto page-background">
          <div className="page-content">
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Background elements */}
              <div className="floating-element floating-element-1"></div>
              <div className="floating-element floating-element-2"></div>
              <div className="floating-element floating-element-3"></div>
              
              {/* About the Platform */}
              <Card className="glass-card border-cyber-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl font-bold gradient-text">About the Cyber Crime Monitoring Platform</CardTitle>
                  <CardDescription>
                    A comprehensive solution for law enforcement agencies to monitor, detect, and respond to cyber threats
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-base md:text-lg">
                    The Cyber Crime Monitoring Platform is designed to provide law enforcement officers with advanced tools to combat digital crime. 
                    Our platform integrates cutting-edge AI technology with user-friendly interfaces to streamline the detection, 
                    analysis, and response to cyber threats.
                  </p>

                  <div className="responsive-grid">
                    <div className="space-y-2">
                      <h3 className="text-lg md:text-xl font-semibold flex items-center">
                        <Shield className="mr-2 h-5 w-5 text-blue-600" />
                        Core Features
                      </h3>
                      <ul className="list-disc list-inside space-y-1 pl-5">
                        <li>Advanced phishing detection</li>
                        <li>UPI fraud monitoring system</li>
                        <li>Digital evidence management</li>
                        <li>Ransomware simulation & prevention</li>
                        <li>VoIP analysis tools</li>
                        <li>Deepfake detection technology</li>
                        <li>Crime report management</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg md:text-xl font-semibold flex items-center">
                        <Laptop className="mr-2 h-5 w-5 text-blue-600" />
                        Technology Stack
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-blue-100">React</Badge>
                        <Badge variant="outline" className="bg-blue-100">TypeScript</Badge>
                        <Badge variant="outline" className="bg-blue-100">Tailwind CSS</Badge>
                        <Badge variant="outline" className="bg-blue-100">Shadcn UI</Badge>
                        <Badge variant="outline" className="bg-blue-100">Lucide Icons</Badge>
                        <Badge variant="outline" className="bg-blue-100">Recharts</Badge>
                        <Badge variant="outline" className="bg-blue-100">React Router</Badge>
                        <Badge variant="outline" className="bg-blue-100">TanStack Query</Badge>
                        <Badge variant="outline" className="bg-blue-100">Face-api.js</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Platform Architecture */}
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold flex items-center mb-3">
                      <Database className="mr-2 h-5 w-5 text-blue-600" />
                      Platform Architecture
                    </h3>
                    <p>
                      Our platform utilizes a modular architecture that allows for easy scaling and feature addition. 
                      The front-end uses React with TypeScript for type safety, while the UI is built with Tailwind CSS and Shadcn UI components.
                      Data visualization is powered by Recharts, and state management is handled through React Query.
                    </p>
                  </div>

                  {/* Key Capabilities */}
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold flex items-center mb-3">
                      <Fingerprint className="mr-2 h-5 w-5 text-blue-600" />
                      Key Capabilities
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Card className="bg-blue-50 border-none">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Threat Detection</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">AI-powered detection of digital threats including phishing, fraud, and unauthorized access attempts</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-blue-50 border-none">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Forensic Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">Advanced tools for digital evidence collection, preservation, and analysis</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-blue-50 border-none">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Case Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">Comprehensive tracking of cyber crime cases from report to resolution</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-blue-50 border-none">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Citizen Interface</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">User-friendly portal for citizens to report and track cyber crimes</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About the Developer */}
              <Card className="glass-card border-cyber-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl font-bold gradient-text">About the Developer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl md:text-4xl font-bold">
                      RS
                    </div>
                    <div className="space-y-3 text-center md:text-left">
                      <h3 className="text-xl md:text-2xl font-semibold">Rahul Kumar Sharma</h3>
                      <p className="text-gray-600">Full Stack Developer & Cybersecurity Specialist</p>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer">React</Badge>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer">TypeScript</Badge>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer">UI/UX</Badge>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer">Cybersecurity</Badge>
                      </div>
                      <div className="flex items-center gap-4 justify-center md:justify-start flex-wrap">
                        <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                          <Mail className="h-4 w-4" /> Email
                        </a>
                        <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                          <Github className="h-4 w-4" /> GitHub
                        </a>
                        <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                          <Globe className="h-4 w-4" /> Website
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg md:text-xl font-semibold mb-3">About Rahul</h3>
                    <p className="mb-4">
                      Rahul Kumar Sharma is a highly skilled developer with extensive experience in cybersecurity and full-stack development.
                      With a passion for creating secure and user-friendly applications, Rahul developed the Cyber Crime Monitoring Platform
                      to help law enforcement agencies effectively combat digital crime.
                    </p>
                    <p>
                      With expertise in React, TypeScript, and cybersecurity principles, Rahul has designed this platform to be both 
                      powerful and intuitive, allowing officers to focus on protecting the community rather than wrestling with complex software.
                    </p>
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
