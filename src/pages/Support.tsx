import React, { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Phone, Mail, HelpCircle, FileText, Check, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScrollToTop } from "@/components/ScrollToTop";

export default function Support() {
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API submission
    setTimeout(() => {
      toast({
        title: "Support request submitted",
        description: "We'll get back to you as soon as possible",
      });
      
      // Reset form
      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-cyber-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <ScrollArea className="flex-1">
          <main className="page-background">
            <div className="page-content">
              {/* Background elements */}
              <div className="floating-element floating-element-1"></div>
              <div className="floating-element floating-element-2"></div>
              <div className="floating-element floating-element-3"></div>
              
              <div className="max-w-5xl mx-auto pb-20">
                <Card className="glass-card border-cyber-primary/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl font-bold gradient-text">Support Center</CardTitle>
                    <CardDescription>
                      Get help with the Cyber Crime Monitoring Platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="contact" className="w-full">
                      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6">
                        <TabsTrigger value="contact" className="flex items-center">
                          <MessageSquare className="mr-2 h-4 w-4" /> Contact Us
                        </TabsTrigger>
                        <TabsTrigger value="faq" className="flex items-center">
                          <HelpCircle className="mr-2 h-4 w-4" /> FAQ
                        </TabsTrigger>
                        <TabsTrigger value="documentation" className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" /> Documentation
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="contact" className="mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="name">Your Name *</Label>
                                  <Input 
                                    id="name" 
                                    name="name" 
                                    value={contactForm.name} 
                                    onChange={handleFormChange} 
                                    required 
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="email">Email Address *</Label>
                                  <Input 
                                    id="email" 
                                    name="email" 
                                    type="email" 
                                    value={contactForm.email} 
                                    onChange={handleFormChange} 
                                    required 
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input 
                                  id="subject" 
                                  name="subject" 
                                  value={contactForm.subject} 
                                  onChange={handleFormChange} 
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="message">Your Message *</Label>
                                <Textarea 
                                  id="message" 
                                  name="message" 
                                  rows={5} 
                                  value={contactForm.message} 
                                  onChange={handleFormChange} 
                                  required 
                                />
                              </div>
                              
                              <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? "Submitting..." : "Send Message"}
                              </Button>
                            </form>
                          </div>
                          
                          <div className="space-y-6">
                            <Card className="bg-blue-50 dark:bg-blue-900/20 border-none">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center">
                                  <Phone className="mr-2 h-4 w-4" /> Phone Support
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm mb-1">Technical Support:</p>
                                <p className="font-medium">+91-11-1234-5678</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Mon-Fri, 9:00 AM - 6:00 PM</p>
                              </CardContent>
                            </Card>
                            
                            <Card className="bg-blue-50 dark:bg-blue-900/20 border-none">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center">
                                  <Mail className="mr-2 h-4 w-4" /> Email Support
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm mb-1">General Inquiries:</p>
                                <p className="font-medium">support@cybercrimeplatform.gov.in</p>
                                <p className="text-sm mb-1 mt-2">Technical Support:</p>
                                <p className="font-medium">tech@cybercrimeplatform.gov.in</p>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="faq" className="mt-6">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="item-1">
                            <AccordionTrigger>How do I report a cybercrime?</AccordionTrigger>
                            <AccordionContent>
                              You can report a cybercrime by navigating to the "Crime Report" section in the sidebar. Fill out the required details in the form, upload any evidence files, and submit your report. You'll receive a tracking ID that you can use to check the status of your report later.
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="item-2">
                            <AccordionTrigger>How can I track my submitted report?</AccordionTrigger>
                            <AccordionContent>
                              To track your report, go to the "Crime Report" section and use the "Track Your Report" feature. Enter the tracking ID that was provided to you after submitting your report, and the system will display the current status of your case.
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="item-3">
                            <AccordionTrigger>What file formats are supported for evidence uploads?</AccordionTrigger>
                            <AccordionContent>
                              Currently, the system supports JPG, PNG, PDF, DOC, and DOCX file formats for evidence uploads. The maximum file size per upload is 10 MB. If you have larger files or different formats, please contact support for assistance.
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="item-4">
                            <AccordionTrigger>How secure is the information I submit?</AccordionTrigger>
                            <AccordionContent>
                              All data submitted to the Cyber Crime Monitoring Platform is encrypted and stored securely. We follow strict security protocols to ensure that your personal information and evidence files are protected. Only authorized personnel can access the information related to your case.
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="item-5">
                            <AccordionTrigger>How long does it take to process a report?</AccordionTrigger>
                            <AccordionContent>
                              Processing times vary depending on the complexity of the case and current workload. Typically, reports are initially reviewed within 24-48 hours. High-priority cases involving active threats may be processed faster. You can always check the status of your report using the tracking feature.
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="item-6">
                            <AccordionTrigger>Can I update my submitted report with new information?</AccordionTrigger>
                            <AccordionContent>
                              Yes, you can update your report by contacting support with your tracking ID and the new information you wish to add. For submitting additional evidence files after the initial report, please use the contact form and reference your tracking ID.
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </TabsContent>
                      
                      <TabsContent value="documentation" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader>
                              <CardTitle>User Guides</CardTitle>
                              <CardDescription>Step-by-step instructions for using the platform</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                <li>
                                  <a href="#" className="text-blue-600 hover:underline flex items-center">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Getting Started Guide
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="text-blue-600 hover:underline flex items-center">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Reporting a Cybercrime
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="text-blue-600 hover:underline flex items-center">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Using the Phishing Detection Tool
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="text-blue-600 hover:underline flex items-center">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Analyzing Fraud Patterns
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="text-blue-600 hover:underline flex items-center">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Understanding Threat Maps
                                  </a>
                                </li>
                              </ul>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader>
                              <CardTitle>Technical Documentation</CardTitle>
                              <CardDescription>Technical details and API references</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                <li>
                                  <a href="#" className="text-blue-600 hover:underline flex items-center">
                                    <FileText className="mr-2 h-4 w-4" />
                                    API Reference
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="text-blue-600 hover:underline flex items-center">
                                    <FileText className="mr-2 h-4 w-4" />
                                    System Architecture
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="text-blue-600 hover:underline flex items-center">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Security Protocols
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="text-blue-600 hover:underline flex items-center">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Data Management Guidelines
                                  </a>
                                </li>
                              </ul>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
          <ScrollToTop />
        </ScrollArea>
      </div>
    </div>
  );
}
