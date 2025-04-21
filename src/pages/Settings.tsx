
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, User, Headphones, Bell, Shield, Lock, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Create profile form using react-hook-form
  const profileForm = useForm({
    defaultValues: {
      name: "Officer Name",
      badge: "CP2345",
      email: "officer@cybercell.gov.in",
      phone: "+91 98XXX XXXXX",
      department: "Cyber Crime Investigation",
      bio: ""
    }
  });

  // Handle profile form submission
  const onProfileSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId) {
        // Update profile in supabase
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            full_name: data.name,
            badge_id: data.badge,
            email: data.email,
            phone: data.phone,
            department: data.department,
            bio: data.bio
          });

        if (error) throw error;
        
        toast.success("Profile updated successfully", {
          description: "Your profile information has been saved."
        });
      } else {
        // If we're testing without auth
        toast.success("Profile updated successfully", {
          description: "Your profile information has been saved. (Demo mode)"
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile", {
        description: "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-cyber-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-cyber-background">
          <div className="flex items-center gap-2 mb-6">
            <SettingsIcon className="h-6 w-6 text-cyber-primary" />
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
          
          <Tabs defaultValue="profile" className="mb-6">
            <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-5 gap-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="connections">API Connections</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-6">
              <div className="grid grid-cols-1 gap-6">
                <Card className="border-cyber-primary/20 bg-cyber-dark">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-cyber-primary" />
                      User Profile
                    </CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
                  </CardHeader>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={profileForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Rahul Kumar Sharma" className="mt-1" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="badge"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Badge ID</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="CHDHACKER" className="mt-1" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={profileForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="email" placeholder="Rahulkumarsharma@cybercell.gov.in" className="mt-1" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="+91 6280838860" className="mt-1" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={profileForm.control}
                            name="department"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Department</FormLabel>
                                <FormControl>
                                  <select
                                    {...field}
                                    className="w-full mt-1 bg-cyber-background border border-cyber-primary/20 rounded p-2"
                                  >
                                    <option>Cyber Crime Investigation</option>
                                    <option>Digital Forensics</option>
                                    <option>Intelligence</option>
                                    <option>Administration</option>
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="bio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    rows={3}
                                    className="w-full mt-1 bg-cyber-background border border-cyber-primary/20 rounded p-2"
                                    placeholder="Brief description about yourself"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                      </CardFooter>
                    </form>
                  </Form>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="mt-6">
              <div className="grid grid-cols-1 gap-6">
                <Card className="border-cyber-primary/20 bg-cyber-dark">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-cyber-primary" />
                      Security Settings
                    </CardTitle>
                    <CardDescription>Manage your account security</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Change Password</h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input id="current-password" type="password" className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input id="confirm-password" type="password" className="mt-1" />
                          </div>
                          <Button className="w-full">Update Password</Button>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-cyber-primary/10">
                        <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Enable 2FA</p>
                            <p className="text-sm text-cyber-muted">Add an extra layer of security to your account</p>
                          </div>
                          <Switch id="2fa" />
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-cyber-primary/10">
                        <h3 className="text-lg font-medium mb-4">Login History</h3>
                        <div className="space-y-2">
                          <div className="bg-cyber-background/30 p-3 rounded">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">Chandigarh, India</p>
                                <p className="text-xs text-cyber-muted">Today, 10:24 AM</p>
                              </div>
                              <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">Current</span>
                            </div>
                          </div>
                          <div className="bg-cyber-background/30 p-3 rounded">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">Chandigarh, India</p>
                                <p className="text-xs text-cyber-muted">Yesterday, 3:45 PM</p>
                              </div>
                              <span className="text-xs text-cyber-muted">192.168.1.45</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-6">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-cyber-primary" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Manage how you receive alerts and notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Critical Alerts</p>
                            <p className="text-sm text-cyber-muted">High priority security notifications</p>
                          </div>
                          <Switch id="critical-email" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Weekly Reports</p>
                            <p className="text-sm text-cyber-muted">Summary of all activities</p>
                          </div>
                          <Switch id="weekly-email" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">System Updates</p>
                            <p className="text-sm text-cyber-muted">Platform maintenance and updates</p>
                          </div>
                          <Switch id="system-email" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-cyber-primary/10">
                      <h3 className="text-lg font-medium mb-4">SMS Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Critical Alerts</p>
                            <p className="text-sm text-cyber-muted">Urgent security notifications</p>
                          </div>
                          <Switch id="critical-sms" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Login Verification</p>
                            <p className="text-sm text-cyber-muted">SMS code for login verification</p>
                          </div>
                          <Switch id="login-sms" defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-cyber-primary/10">
                      <h3 className="text-lg font-medium mb-4">In-App Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">All Alerts</p>
                            <p className="text-sm text-cyber-muted">Display all security alerts in-app</p>
                          </div>
                          <Switch id="all-alerts" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Task Assignments</p>
                            <p className="text-sm text-cyber-muted">Notify when assigned to a case</p>
                          </div>
                          <Switch id="task-assignments" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="connections" className="mt-6">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-cyber-primary" />
                    API Connections
                  </CardTitle>
                  <CardDescription>Manage external system integrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Connected Systems</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-cyber-background/30 rounded">
                          <div className="flex items-center gap-3">
                            <Shield className="h-8 w-8 text-cyber-primary" />
                            <div>
                              <p className="font-medium">National Crime Database</p>
                              <p className="text-xs text-cyber-muted">Connected since March 15, 2025</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">Active</span>
                            <Button variant="outline" size="sm">Configure</Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-cyber-background/30 rounded">
                          <div className="flex items-center gap-3">
                            <Database className="h-8 w-8 text-cyber-primary" />
                            <div>
                              <p className="font-medium">Banking Fraud API</p>
                              <p className="text-xs text-cyber-muted">Connected since April 2, 2025</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">Active</span>
                            <Button variant="outline" size="sm">Configure</Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-cyber-background/30 rounded">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 flex items-center justify-center bg-cyber-primary/20 rounded text-cyber-primary">
                              T
                            </div>
                            <div>
                              <p className="font-medium">Telecom Signal API</p>
                              <p className="text-xs text-cyber-muted">Connected since April 10, 2025</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-amber-500/20 text-amber-500 px-2 py-1 rounded-full">Needs Attention</span>
                            <Button variant="outline" size="sm">Configure</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-cyber-primary/10">
                      <h3 className="text-lg font-medium mb-4">Add New Connection</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="api-name">Connection Name</Label>
                          <Input id="api-name" className="mt-1" placeholder="Enter API name" />
                        </div>
                        <div>
                          <Label htmlFor="api-key">API Key</Label>
                          <div className="flex gap-2 mt-1">
                            <Input id="api-key" type="password" placeholder="Enter API key" className="flex-1" />
                            <Button variant="outline">Generate</Button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="api-url">Service URL</Label>
                          <Input id="api-url" className="mt-1" placeholder="https://api.example.com" />
                        </div>
                        <Button>Add Connection</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="support" className="mt-6">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-cyber-primary" />
                    Support
                  </CardTitle>
                  <CardDescription>Get help and technical support</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Contact Support</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="support-subject">Subject</Label>
                          <Input id="support-subject" className="mt-1" placeholder="Enter subject" />
                        </div>
                        <div>
                          <Label htmlFor="support-description">Description</Label>
                          <textarea id="support-description" rows={5} className="w-full mt-1 bg-cyber-background border border-cyber-primary/20 rounded p-2" placeholder="Describe your issue in detail"></textarea>
                        </div>
                        <div>
                          <Label htmlFor="support-priority">Priority</Label>
                          <select id="support-priority" className="w-full mt-1 bg-cyber-background border border-cyber-primary/20 rounded p-2">
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Critical</option>
                          </select>
                        </div>
                        <Button>Submit Ticket</Button>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-cyber-primary/10">
                      <h3 className="text-lg font-medium mb-4">Support Resources</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-cyber-background/30 p-4 rounded">
                          <h4 className="font-medium mb-2">Documentation</h4>
                          <p className="text-sm text-cyber-muted mb-3">Access detailed system documentation and user guides</p>
                          <Button variant="outline" size="sm">View Documentation</Button>
                        </div>
                        <div className="bg-cyber-background/30 p-4 rounded">
                          <h4 className="font-medium mb-2">Training Videos</h4>
                          <p className="text-sm text-cyber-muted mb-3">Watch tutorial videos on system features</p>
                          <Button variant="outline" size="sm">View Videos</Button>
                        </div>
                        <div className="bg-cyber-background/30 p-4 rounded">
                          <h4 className="font-medium mb-2">FAQ</h4>
                          <p className="text-sm text-cyber-muted mb-3">Find answers to frequently asked questions</p>
                          <Button variant="outline" size="sm">View FAQs</Button>
                        </div>
                        <div className="bg-cyber-background/30 p-4 rounded">
                          <h4 className="font-medium mb-2">Emergency Support</h4>
                          <p className="text-sm text-cyber-muted mb-3">Call our 24/7 emergency support line</p>
                          <Button variant="outline" size="sm">Contact Emergency</Button>
                        </div>
                      </div>
                    </div>
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
