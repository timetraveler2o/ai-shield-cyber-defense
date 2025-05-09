import { useState, useRef, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Book,
  Search,
  SendHorizonal,
  Mic,
  MicOff,
  FileUp,
  BookOpen,
  FileText,
  MessageSquare,
  Volume2,
  Image as ImageIcon,
  AlertTriangle,
  Code,
  Database,
  Shield,
  ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { ChatMessage, LegalAct, LegalSection, AIResponse } from "@/components/face-database/types";
import { v4 as uuidv4 } from "uuid";

export default function LegalAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [laws, setLaws] = useState<LegalAct[]>([]);
  const [filteredLaws, setFilteredLaws] = useState<LegalAct[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [aiResponse, setAIResponse] = useState<AIResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: uuidv4(),
        role: "assistant",
        content: "Hello, I'm your legal assistant specialized in Indian cybercrime laws. I can help you understand IPC, CrPC, IT Act, BNS, and other relevant legal frameworks. How can I assist you today?",
        timestamp: new Date().toISOString(),
      },
    ]);

    // Fetch sample laws
    fetchSampleLaws();
  }, []);

  // Sample laws data with updates for new Indian acts
  const fetchSampleLaws = () => {
    const sampleLaws = [
      // IT Act sections
      {
        id: "it-act-66",
        title: "IT Act Section 66",
        category: "Cybercrime",
        description: "Computer Related Offences",
        content: "If any person, dishonestly or fraudulently, does any act referred to in section 43, he shall be punishable with imprisonment for a term which may extend to three years or with fine which may extend to five lakh rupees or with both.",
        year: 2000,
        relatedCases: ["State vs. Avnish Bajaj", "Shreya Singhal vs. Union of India"]
      },
      // ... keep existing code (other IT Act sections)
      
      // New BNS sections
      {
        id: "bnss-318",
        title: "Bharatiya Nyaya Sanhita Section 318",
        category: "New Laws",
        description: "Cheating by Digital Means",
        content: "Whoever cheats shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both. Whoever cheats by personation or by using electronic or digital means shall be punished with imprisonment of either description for a term which may extend to five years, and shall also be liable to fine.",
        year: 2023,
        relatedCases: [],
        isNewAct: true
      },
      {
        id: "bnss-356",
        title: "Bharatiya Nyaya Sanhita Section 356",
        category: "New Laws",
        description: "Digital Evidence Manipulation",
        content: "Whoever alters, destroys, or manipulates digital evidence during an investigation with the intention to prevent the discovery of an offence or to protect an offender shall be punished with imprisonment for a term which may extend to five years and shall also be liable to fine.",
        year: 2023,
        relatedCases: [],
        isNewAct: true
      },
      {
        id: "bnss-308",
        title: "Bharatiya Nyaya Sanhita Section 308",
        category: "New Laws",
        description: "Public Mischief through Digital Means",
        content: "Whoever makes, publishes or circulates any statement, rumour or report, using computer resource, digital media, with intent to incite, or which is likely to incite, any class or community of persons to commit any offence against any other class or community, shall be punished with imprisonment which may extend to two years, or with fine, or with both.",
        year: 2023,
        relatedCases: [],
        isNewAct: true
      },
      
      // New Data Protection Act sections
      {
        id: "dpdp-8",
        title: "Digital Personal Data Protection Act Section 8",
        category: "Data Protection",
        description: "Consent for Processing Personal Data",
        content: "A Data Fiduciary shall, before processing any personal data of a Data Principal, give to the Data Principal an itemised notice containing a description of personal data sought to be collected and the purpose of processing of such personal data, in such manner as may be prescribed, in clear and plain language, and obtain the consent of the Data Principal for the same.",
        year: 2023,
        relatedCases: [],
        isNewAct: true
      },
      {
        id: "dpdp-17",
        title: "Digital Personal Data Protection Act Section 17",
        category: "Data Protection",
        description: "Breach of Personal Data",
        content: "In case of a personal data breach, the Data Fiduciary shall notify the Board and each affected Data Principal in such form and manner as may be prescribed. The notification shall include particulars of the breach, the nature of personal data concerned, measures taken for mitigation, and remedial actions taken by the Data Fiduciary.",
        year: 2023,
        relatedCases: [],
        isNewAct: true
      },
      {
        id: "dpdp-34",
        title: "Digital Personal Data Protection Act Section 34",
        category: "Data Protection",
        description: "Penalties for Non-compliance",
        content: "For failure to observe security safeguards resulting in a personal data breach - penalty up to fifty crore rupees. For failure to notify personal data breach - penalty up to two hundred crore rupees. For non-fulfillment of additional obligations in relation to processing of personal data of children - penalty up to two hundred crore rupees.",
        year: 2023,
        relatedCases: [],
        isNewAct: true
      },
      
      // Existing IPC and CrPC items
      {
        id: "ipc-420",
        title: "IPC Section 420",
        category: "Fraud",
        description: "Cheating and dishonestly inducing delivery of property",
        content: "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
        year: 1860,
        relatedCases: ["Pankaj Kumar vs State", "State vs Mohd. Afzal"]
      },
      // ... keep existing code (other IPC and CrPC sections)
    ];

    setLaws(sampleLaws);
    setFilteredLaws(sampleLaws);
  };

  // Handle submit message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputMessage.trim() && !uploadedImage) return;

    // Add user message to chat
    const newMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
      ...(uploadedImage && { attachments: [{ type: "image", url: uploadedImage }] })
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage("");
    setIsProcessing(true);
    setUploadedImage(null);

    // Call the AI processing function
    await processUserQuery(inputMessage, uploadedImage);
    setIsProcessing(false);
  };

  // Process user query with AI
  const processUserQuery = async (message: string, image: string | null) => {
    try {
      setAIResponse({
        content: "",
        status: "loading"
      });
      
      // Simulate AI API call 
      const queryText = message || "Tell me about latest cybercrime laws";
      
      // In a real implementation, this would be an API call to OpenAI or another AI provider
      // For now, we'll simulate the response based on keywords
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API latency
      
      let response: AIResponse;
      
      // Check for specific law queries
      const itActMatch = queryText.toLowerCase().match(/it act|section 66|information technology act/);
      const ipcMatch = queryText.toLowerCase().match(/ipc|indian penal code|section 4\d\d/);
      const crpcMatch = queryText.toLowerCase().match(/crpc|criminal procedure|section 1\d\d/);
      const bnsMatch = queryText.toLowerCase().match(/bns|bharatiya nyaya|sanhita/);
      const dpdpMatch = queryText.toLowerCase().match(/dpdp|data protection|privacy|digital personal/);
      const deepfakeMatch = queryText.toLowerCase().match(/deepfake|fake video|synthetic media|ai generated/);
      
      let content = "";
      let relevantLaws: string[] = [];
      
      if (itActMatch) {
        content = "The Information Technology Act, 2000 (IT Act) provides legal framework for electronic governance and e-commerce in India. Key sections include:\n\n" +
          "- Section 66: Computer-related offenses (hacking, data theft)\n" +
          "- Section 66B: Receiving stolen computer resources\n" +
          "- Section 66C: Identity theft\n" +
          "- Section 66D: Cheating by personation using computer\n" +
          "- Section 66E: Privacy violation\n" +
          "- Section 66F: Cyber terrorism\n\n" +
          "The IT Act was amended in 2008 to address more cyber crimes including cyber terrorism and data protection.";
        relevantLaws = ["it-act-66", "it-act-66C", "it-act-66D"];
      } else if (ipcMatch) {
        content = "The Indian Penal Code (IPC) has several sections that apply to cyber crimes:\n\n" +
          "- Section 383: Extortion, applicable to ransomware cases\n" +
          "- Section 420: Cheating, often used in online fraud cases\n" +
          "- Section 463: Forgery, applicable to digital document forgery\n" +
          "- Section 499: Defamation, used in cases of online defamation\n\n" +
          "Note that many traditional IPC sections are now being replaced by the new Bharatiya Nyaya Sanhita (BNS) when it comes into full effect.";
        relevantLaws = ["ipc-420", "ipc-499"];
      } else if (bnsMatch) {
        content = "The Bharatiya Nyaya Sanhita (BNS) 2023 replaces the Indian Penal Code. Key cyber-related sections include:\n\n" +
          "- Section 318: Cheating (replaces IPC 420) with specific provisions for digital fraud\n" +
          "- Section 356: Digital Evidence Manipulation with penalties for altering digital evidence\n" +
          "- Section 308: Public Mischief through Digital Means addressing misinformation\n\n" +
          "The BNS modernizes several provisions to better address technology-enabled crimes and works alongside the IT Act and Digital Personal Data Protection Act.";
        relevantLaws = ["bnss-318", "bnss-356", "bnss-308"];
      } else if (dpdpMatch) {
        content = "The Digital Personal Data Protection Act, 2023 is India's comprehensive data protection legislation. Key provisions include:\n\n" +
          "- Section 8: Mandates explicit and informed consent for data collection\n" +
          "- Section 17: Requires notification of personal data breaches\n" +
          "- Section 34: Establishes significant penalties for non-compliance (up to ₹250 crore)\n\n" +
          "This act applies to digital personal data processed in India, whether by Indian or international entities. It establishes rights for data principals and obligations for data fiduciaries.";
        relevantLaws = ["dpdp-8", "dpdp-17", "dpdp-34"];
      } else if (deepfakeMatch) {
        content = "Deepfakes are addressed under multiple Indian laws:\n\n" +
          "1. IT Act Section 66E (Privacy violation)\n" +
          "2. IT Act Section 67 & 67A (Publishing obscene material)\n" +
          "3. BNS Section 356 (Digital evidence manipulation)\n" +
          "4. Digital Personal Data Protection Act (for unauthorized use of personal data)\n\n" +
          "The Ministry of Electronics and IT (MeitY) has also issued advisory guidelines requiring platforms to identify and remove deepfake content. The new criminal laws under BNS provide stronger penalties for digital impersonation.";
        relevantLaws = ["it-act-66E", "bnss-356", "dpdp-8"];
      } else if (image) {
        content = "I've analyzed the image you uploaded. If this shows evidence of a cybercrime, please ensure you:\n\n" +
          "1. Preserve the digital evidence (don't delete the original files)\n" +
          "2. Document when and how you obtained this evidence\n" +
          "3. Report to the nearest cyber crime police station or at www.cybercrime.gov.in\n\n" +
          "This could potentially involve IT Act Section 66 (computer-related offenses), BNS Section 356 (digital evidence manipulation), or DPDP Act provisions if personal data is involved. Would you like more specific information?";
        relevantLaws = ["it-act-66", "bnss-356", "dpdp-8"];
      } else {
        content = "Based on your query, I'd recommend looking at the latest cybercrime laws in India, including:\n\n" +
          "1. IT Act 2000 (as amended in 2008) - The primary legislation for electronic transactions and cybercrime\n" +
          "2. Bharatiya Nyaya Sanhita 2023 - Replaces the IPC with updated provisions for digital crimes\n" +
          "3. Digital Personal Data Protection Act 2023 - India's new data protection framework\n\n" +
          "These laws work together to address various aspects of cybercrimes, digital fraud, and data protection. Would you like more specific information about any of these frameworks?";
        relevantLaws = ["it-act-66", "bnss-318", "dpdp-8"];
      }
      
      response = {
        content: content,
        relevantLaws: relevantLaws,
        confidenceScore: 0.85,
        sources: ["IT Act 2000", "BNS 2023", "DPDP Act 2023", "MeitY Guidelines"],
        status: "complete"
      };
      
      setAIResponse(response);
      
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: content,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Highlight relevant laws in the database
      if (response.relevantLaws && response.relevantLaws.length > 0) {
        const highlighted = laws.filter(law => response.relevantLaws?.includes(law.id));
        if (highlighted.length > 0) {
          setFilteredLaws(highlighted);
          
          // Switch to laws tab after a delay
          if (activeTab === "chat") {
            setTimeout(() => {
              toast.info(`Found ${highlighted.length} relevant laws. Check the Law Database tab.`);
            }, 2000);
          }
        }
      }
    } catch (error) {
      console.error("Error processing query:", error);
      
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      setAIResponse({
        content: "Error processing request",
        status: "error"
      });
      
      toast.error("Error processing your legal query");
    }
  };

  // Toggle voice recording
  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      toast.success("Processing voice input...");
      
      // Simulate voice recognition result
      setTimeout(() => {
        const recognizedText = "What does IT Act Section 66 cover?";
        setInputMessage(recognizedText);
        toast.success("Voice recognized: " + recognizedText);
      }, 1500);
    } else {
      // Start recording
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setIsRecording(true);
          toast.info("Listening... Speak clearly");
        })
        .catch(err => {
          toast.error("Microphone access denied or unavailable");
          console.error("Error accessing microphone:", err);
        });
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setUploadedImage(event.target.result);
        toast.success("Image uploaded successfully");
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle law search
  const handleSearchLaw = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setFilteredLaws(laws);
      return;
    }
    
    const filtered = laws.filter(law => 
      law.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      law.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      law.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      law.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredLaws(filtered);
    
    if (filtered.length === 0) {
      toast.info("No matching laws found");
    } else {
      toast.success(`Found ${filtered.length} matching laws`);
    }
  };

  return (
    <div className="flex h-screen bg-cyber-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden p-6 bg-cyber-background">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Book className="h-6 w-6 text-cyber-primary" />
                <h1 className="text-2xl font-bold text-white">Cyber Legal Assistant</h1>
              </div>
              <Badge className="bg-cyber-primary text-white">New Acts Updated</Badge>
            </div>
            
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="flex-1 flex flex-col"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>AI Assistant</span>
                </TabsTrigger>
                <TabsTrigger value="laws" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Law Database</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="flex-1 flex flex-col space-y-4 overflow-hidden">
                <Card className="flex-1 flex flex-col overflow-hidden">
                  <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
                    <ScrollArea className="flex-1 pr-4">
                      <div className="space-y-4 py-2">
                        {messages.map((message) => (
                          <div 
                            key={message.id} 
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[80%] rounded-lg p-4 ${
                                message.role === 'user' 
                                  ? 'bg-cyber-primary/20 text-white' 
                                  : 'bg-cyber-dark text-white'
                              }`}
                            >
                              {message.attachments?.map((attachment, i) => (
                                attachment.type === 'image' && (
                                  <div key={i} className="mb-2">
                                    <img 
                                      src={attachment.url} 
                                      alt="User uploaded" 
                                      className="max-h-[200px] rounded-lg" 
                                    />
                                  </div>
                                )
                              ))}
                              <div className="whitespace-pre-wrap">{message.content}</div>
                              <div className="text-xs mt-2 text-cyber-muted">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                        
                        {isProcessing && (
                          <div className="flex justify-start">
                            <div className="max-w-[80%] rounded-lg p-4 bg-cyber-dark text-white">
                              <div className="flex gap-2 items-center">
                                <div className="h-2 w-2 rounded-full bg-cyber-primary animate-pulse"></div>
                                <div className="h-2 w-2 rounded-full bg-cyber-primary animate-pulse delay-150"></div>
                                <div className="h-2 w-2 rounded-full bg-cyber-primary animate-pulse delay-300"></div>
                                <span className="ml-2 text-sm text-cyber-muted">Processing...</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {aiResponse?.status === "error" && (
                          <Alert variant="destructive" className="mt-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              Error processing your request. Please try again later.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="border-t border-cyber-primary/20 p-4">
                    <form onSubmit={handleSendMessage} className="w-full flex flex-col gap-4">
                      <div className="flex gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon" 
                          className="text-cyber-muted"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <FileUp className="h-4 w-4" />
                          <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleFileUpload}
                          />
                        </Button>
                        
                        <Button 
                          type="button" 
                          variant={isRecording ? "default" : "outline"} 
                          size="icon" 
                          className={isRecording ? "text-white bg-red-500 hover:bg-red-600" : "text-cyber-muted"} 
                          onClick={toggleRecording}
                        >
                          {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>
                        
                        <div className="relative flex-1">
                          <Input 
                            placeholder="Ask about cybercrime laws, IT Act, BNS, DPDP Act..." 
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            className="bg-cyber-dark/40 border-cyber-primary/20 text-white"
                          />
                          {uploadedImage && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                              <span className="text-xs text-cyber-muted">Image uploaded</span>
                              <ImageIcon className="h-3 w-3 text-cyber-primary" />
                            </div>
                          )}
                        </div>
                        
                        <Button type="submit" disabled={isProcessing}>
                          <SendHorizonal className="h-4 w-4 mr-2" />
                          Send
                        </Button>
                      </div>
                      
                      {uploadedImage && (
                        <div className="relative inline-block">
                          <img 
                            src={uploadedImage} 
                            alt="Upload preview" 
                            className="h-20 rounded-md object-cover" 
                          />
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full" 
                            onClick={() => setUploadedImage(null)}
                          >
                            ×
                          </Button>
                        </div>
                      )}
                    </form>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="laws" className="flex-1 flex flex-col space-y-4 overflow-hidden">
                <Card className="flex-1 flex flex-col overflow-hidden">
                  <CardHeader className="pb-2">
                    <form onSubmit={handleSearchLaw} className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyber-muted h-4 w-4" />
                        <Input 
                          placeholder="Search laws by keyword, section, or description..." 
                          className="pl-10 bg-cyber-dark/40 border-cyber-primary/20 text-white"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button type="submit">Search</Button>
                    </form>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge 
                        className="cursor-pointer bg-cyber-dark hover:bg-cyber-primary"
                        onClick={() => {
                          setSearchQuery("IT Act");
                          handleSearchLaw(new Event('submit') as any);
                        }}
                      >
                        IT Act
                      </Badge>
                      <Badge 
                        className="cursor-pointer bg-cyber-dark hover:bg-cyber-primary"
                        onClick={() => {
                          setSearchQuery("IPC");
                          handleSearchLaw(new Event('submit') as any);
                        }}
                      >
                        IPC
                      </Badge>
                      <Badge 
                        className="cursor-pointer bg-cyber-dark hover:bg-cyber-primary"
                        onClick={() => {
                          setSearchQuery("BNS");
                          handleSearchLaw(new Event('submit') as any);
                        }}
                      >
                        BNS
                      </Badge>
                      <Badge 
                        className="cursor-pointer bg-cyber-dark hover:bg-cyber-primary"
                        onClick={() => {
                          setSearchQuery("DPDP");
                          handleSearchLaw(new Event('submit') as any);
                        }}
                      >
                        DPDP Act
                      </Badge>
                      <Badge 
                        className="cursor-pointer bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          setSearchQuery("NEW");
                          const filtered = laws.filter(law => law.isNewAct === true);
                          setFilteredLaws(filtered);
                        }}
                      >
                        New Laws
                      </Badge>
                      <Badge 
                        className="cursor-pointer bg-cyber-dark hover:bg-cyber-primary"
                        onClick={() => {
                          setSearchQuery("");
                          setFilteredLaws(laws);
                        }}
                      >
                        All Laws
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 overflow-hidden p-4">
                    <ScrollArea className="h-full pr-4">
                      {filteredLaws.length === 0 ? (
                        <div className="text-center py-8 text-cyber-muted">
                          No laws found matching your search criteria.
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {filteredLaws.map((law) => (
                            <Card key={law.id} className={`${law.isNewAct ? 'bg-green-900/20 border-green-500/30' : 'bg-cyber-dark/40 border-cyber-primary/20'}`}>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <CardTitle className="flex items-center">
                                      {law.title}
                                      {law.isNewAct && (
                                        <Badge className="ml-2 bg-green-600">New</Badge>
                                      )}
                                    </CardTitle>
                                    <CardDescription>
                                      {law.description} ({law.year})
                                    </CardDescription>
                                  </div>
                                  <Badge>{law.category}</Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-cyber-muted whitespace-pre-wrap">{law.content}</p>
                                
                                {law.relatedCases.length > 0 && (
                                  <>
                                    <Separator className="my-4" />
                                    <div>
                                      <h4 className="text-sm font-semibold mb-2">Related Cases:</h4>
                                      <ul className="list-disc pl-5 text-sm text-cyber-muted">
                                        {law.relatedCases.map((caseRef: string, i: number) => (
                                          <li key={i}>{caseRef}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </>
                                )}
                              </CardContent>
                              <CardFooter className="flex justify-between pt-0">
                                <Button variant="ghost" size="sm" className="text-xs">
                                  <FileText className="h-3 w-3 mr-1" />
                                  Full Document
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-xs"
                                  onClick={() => {
                                    setActiveTab("chat");
                                    setInputMessage(`Tell me more about ${law.title}`);
                                    setTimeout(() => handleSendMessage(), 100);
                                  }}
                                >
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  Ask AI About This
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
