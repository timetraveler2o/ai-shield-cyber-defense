
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Check, Upload, AlertCircle, Search, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { FileUpload } from "@/components/FileUpload";

interface ReportData {
  id: string;
  type: string;
  date: string;
  status: "open" | "investigating" | "closed";
  description: string;
}

export default function CrimeReport() {
  const { toast: uiToast } = useToast();
  const [reports, setReports] = useState<ReportData[]>([
    {
      id: "CR-2025-001",
      type: "Online Fraud",
      date: "12/03/2025",
      status: "investigating",
      description: "Payment made for online purchase but product never delivered"
    },
    {
      id: "CR-2025-002",
      type: "Identity Theft",
      date: "02/04/2025",
      status: "open",
      description: "Unauthorized loan application using stolen identity documents"
    },
    {
      id: "CR-2025-003",
      type: "Phishing Attempt",
      date: "10/04/2025",
      status: "closed",
      description: "Received email claiming to be from bank requesting account details"
    }
  ]);

  const [newReport, setNewReport] = useState({
    type: "",
    description: "",
    contactName: "",
    contactEmail: "",
    contactPhone: ""
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [trackingId, setTrackingId] = useState("");
  const [searchResult, setSearchResult] = useState<ReportData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles(files);
  };

  const handleSubmitReport = () => {
    // Validate form
    if (!newReport.type || !newReport.description || !newReport.contactName || !newReport.contactEmail) {
      uiToast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API submission
    setTimeout(() => {
      const date = new Date();
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      
      const reportId = `CR-2025-${String(reports.length + 1).padStart(3, '0')}`;
      
      const reportData: ReportData = {
        id: reportId,
        type: newReport.type,
        date: formattedDate,
        status: "open",
        description: newReport.description
      };
      
      setReports([...reports, reportData]);
      
      // Reset form
      setNewReport({
        type: "",
        description: "",
        contactName: "",
        contactEmail: "",
        contactPhone: ""
      });
      
      setUploadedFiles([]);
      setIsSubmitting(false);
      
      // Show toast notification
      toast.success("Report submitted successfully", {
        description: `Your tracking ID is ${reportId}. Save this for future reference.`
      });
      
      // Automatically set the tracking ID for immediate search
      setTrackingId(reportId);
      setSearchResult(reportData);
    }, 1500);
  };

  const handleTrackReport = () => {
    if (!trackingId) {
      uiToast({
        title: "Missing tracking ID",
        description: "Please enter a tracking ID to search",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const report = reports.find(r => r.id === trackingId);
      setSearchResult(report || null);
      
      if (!report) {
        toast.error("Report not found", {
          description: "No report found with the provided tracking ID"
        });
      } else {
        toast.success("Report found", {
          description: `Showing details for report ${trackingId}`
        });
      }
      
      setIsSearching(false);
    }, 1000);
  };

  const handleClearSearch = () => {
    setTrackingId("");
    setSearchResult(null);
  };

  return (
    <div className="flex h-screen bg-cyber-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-cyber-background">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Submit Report Form */}
            <Card className="border-cyber-primary/20 bg-cyber-dark">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-cyber-primary" />
                  Report Cybercrime
                </CardTitle>
                <CardDescription>
                  Fill out this form to report a cybercrime incident
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="crimeType">Type of Cybercrime</Label>
                    <select 
                      id="crimeType"
                      className="w-full bg-cyber-background border border-cyber-primary/20 rounded p-2 mt-1"
                      value={newReport.type}
                      onChange={(e) => setNewReport({...newReport, type: e.target.value})}
                    >
                      <option value="">Select type of cybercrime</option>
                      <option value="Phishing Attempt">Phishing Attempt</option>
                      <option value="Online Fraud">Online Fraud</option>
                      <option value="Identity Theft">Identity Theft</option>
                      <option value="Data Breach">Data Breach</option>
                      <option value="Ransomware Attack">Ransomware Attack</option>
                      <option value="Online Harassment">Online Harassment</option>
                      <option value="Unauthorized Access">Unauthorized Access</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Incident Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Please provide a detailed description of the incident"
                      rows={5}
                      className="mt-1"
                      value={newReport.description}
                      onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactName">Your Full Name</Label>
                      <Input
                        id="contactName"
                        className="mt-1"
                        value={newReport.contactName}
                        onChange={(e) => setNewReport({...newReport, contactName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail">Email Address</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        className="mt-1"
                        value={newReport.contactEmail}
                        onChange={(e) => setNewReport({...newReport, contactEmail: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="contactPhone">Phone Number (Optional)</Label>
                    <Input
                      id="contactPhone"
                      className="mt-1"
                      value={newReport.contactPhone}
                      onChange={(e) => setNewReport({...newReport, contactPhone: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label>Evidence Files</Label>
                    <div className="mt-1">
                      <FileUpload 
                        onFileUpload={handleFileUpload}
                        acceptedFormats=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                        maxSizeMB={10}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleSubmitReport}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Track Report & Recent Reports */}
            <div className="space-y-6">
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="mr-2 h-5 w-5 text-cyber-primary" />
                    Track Your Report
                  </CardTitle>
                  <CardDescription>
                    Check the status of your previously submitted report
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          placeholder="Enter your tracking ID (e.g., CR-2025-001)"
                          value={trackingId}
                          onChange={(e) => setTrackingId(e.target.value)}
                          className="pr-8"
                        />
                        {trackingId && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full w-8"
                            onClick={handleClearSearch}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Clear</span>
                          </Button>
                        )}
                      </div>
                      <Button 
                        onClick={handleTrackReport}
                        disabled={isSearching}
                      >
                        {isSearching ? 'Searching...' : 'Track'}
                      </Button>
                    </div>
                    
                    {searchResult && (
                      <div className="border border-cyber-primary/20 rounded-md p-4 bg-cyber-background/30">
                        <h3 className="text-lg font-semibold mb-2 flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-cyber-primary" />
                          Report {searchResult.id}
                        </h3>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-cyber-muted">Type:</span>
                            <span>{searchResult.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-cyber-muted">Submitted:</span>
                            <span>{searchResult.date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-cyber-muted">Status:</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              searchResult.status === 'open' ? 'bg-blue-900/30 text-blue-400' :
                              searchResult.status === 'investigating' ? 'bg-amber-900/30 text-amber-400' :
                              'bg-green-900/30 text-green-400'
                            }`}>
                              {searchResult.status.charAt(0).toUpperCase() + searchResult.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="pt-2 mt-2 border-t border-cyber-primary/10">
                            <p className="text-sm">{searchResult.description}</p>
                          </div>
                          
                          <div className="pt-2 mt-2 border-t border-cyber-primary/10">
                            <div className="flex justify-between items-center">
                              <span className="text-cyber-muted">Case Officer:</span>
                              <span>Inspector {["Kumar", "Singh", "Sharma", "Patel"][Math.floor(Math.random() * 4)]}</span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-cyber-muted">Expected Resolution:</span>
                              <span>{
                                searchResult.status === 'closed' ? 'Resolved' :
                                searchResult.status === 'investigating' ? '5-7 days' : '10-14 days'
                              }</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-cyber-primary/20 bg-cyber-dark">
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                  <CardDescription>
                    Status of recently submitted reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.slice().reverse().slice(0, 5).map((report) => (
                        <TableRow key={report.id} className="cursor-pointer hover:bg-cyber-primary/10" onClick={() => {
                          setTrackingId(report.id);
                          setSearchResult(report);
                        }}>
                          <TableCell className="font-medium">{report.id}</TableCell>
                          <TableCell>{report.type}</TableCell>
                          <TableCell>{report.date}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              report.status === 'open' ? 'bg-blue-900/30 text-blue-400' :
                              report.status === 'investigating' ? 'bg-amber-900/30 text-amber-400' :
                              'bg-green-900/30 text-green-400'
                            }`}>
                              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
