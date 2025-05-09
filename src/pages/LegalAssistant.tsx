
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
} from "lucide-react";
import { toast } from "sonner";
import { ChatMessage } from "@/components/face-database/types";
import { v4 as uuidv4 } from "uuid";

export default function LegalAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [laws, setLaws] = useState<any[]>([]);
  const [filteredLaws, setFilteredLaws] = useState<any[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
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
        content: "Hello, I'm your legal assistant specialized in Indian cybercrime laws. I can help you understand IPC, CrPC, IT Act, and other relevant legal frameworks. How can I assist you today?",
        timestamp: new Date().toISOString(),
      },
    ]);

    // Fetch sample laws
    fetchSampleLaws();
  }, []);

  // Sample laws data
  const fetchSampleLaws = () => {
    const sampleLaws = [
      {
        id: "it-act-66",
        title: "IT Act Section 66",
        category: "Cybercrime",
        description: "Computer Related Offences",
        content: "If any person, dishonestly or fraudulently, does any act referred to in section 43, he shall be punishable with imprisonment for a term which may extend to three years or with fine which may extend to five lakh rupees or with both.",
        relatedCases: ["State vs. Avnish Bajaj", "Shreya Singhal vs. Union of India"]
      },
      {
        id: "it-act-66A",
        title: "IT Act Section 66A",
        category: "Cybercrime",
        description: "Sending offensive messages",
        content: "Punishment for sending offensive messages through communication service, etc. This section was struck down by the Supreme Court in 2015 in Shreya Singhal vs. Union of India case.",
        relatedCases: ["Shreya Singhal vs. Union of India"]
      },
      {
        id: "it-act-66B",
        title: "IT Act Section 66B",
        category: "Cybercrime",
        description: "Dishonestly receiving stolen computer resource or communication device",
        content: "Whoever dishonestly receives or retains any stolen computer resource or communication device knowing or having reason to believe the same to be stolen computer resource or communication device, shall be punished with imprisonment of either description for a term which may extend to three years or with fine which may extend to rupees one lakh or with both.",
        relatedCases: []
      },
      {
        id: "it-act-66C",
        title: "IT Act Section 66C",
        category: "Cybercrime",
        description: "Identity theft",
        content: "Whoever, fraudulently or dishonestly make use of the electronic signature, password or any other unique identification feature of any other person, shall be punished with imprisonment of either description for a term which may extend to three years and shall also be liable to fine which may extend to rupees one lakh.",
        relatedCases: ["CBI vs. Arpit Bansal"]
      },
      {
        id: "it-act-66D",
        title: "IT Act Section 66D",
        category: "Cybercrime",
        description: "Cheating by personation using computer resource",
        content: "Whoever, by means of any communication device or computer resource cheats by personating, shall be punished with imprisonment of either description for a term which may extend to three years and shall also be liable to fine which may extend to one lakh rupees.",
        relatedCases: []
      },
      {
        id: "it-act-66E",
        title: "IT Act Section 66E",
        category: "Cybercrime",
        description: "Violation of privacy",
        content: "Whoever, intentionally or knowingly captures, publishes or transmits the image of a private area of any person without his or her consent, under circumstances violating the privacy of that person, shall be punished with imprisonment which may extend to three years or with fine not exceeding two lakh rupees, or with both.",
        relatedCases: []
      },
      {
        id: "ipc-420",
        title: "IPC Section 420",
        category: "Fraud",
        description: "Cheating and dishonestly inducing delivery of property",
        content: "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
        relatedCases: ["Pankaj Kumar vs State", "State vs Mohd. Afzal"]
      },
      {
        id: "ipc-499",
        title: "IPC Section 499",
        category: "Defamation",
        description: "Defamation",
        content: "Whoever, by words either spoken or intended to be read, or by signs or by visible representations, makes or publishes any imputation concerning any person intending to harm, or knowing or having reason to believe that such imputation will harm, the reputation of such person, is said, except in the cases hereinafter expected, to defame that person.",
        relatedCases: ["Subramanian Swamy vs Union of India"]
      },
      {
        id: "crpc-154",
        title: "CrPC Section 154",
        category: "Procedure",
        description: "Information in cognizable cases",
        content: "Every information relating to the commission of a cognizable offence, if given orally to an officer in charge of a police station, shall be reduced to writing by him or under his direction, and be read over to the informant; and every such information, whether given in writing or reduced to writing as aforesaid, shall be signed by the person giving it, and the substance thereof shall be entered in a book to be kept by such officer in such form as the State Government may prescribe in this behalf.",
        relatedCases: ["Lalita Kumari vs Govt. of Uttar Pradesh"]
      },
      {
        id: "bnss-2024",
        title: "Bharatiya Nyaya Sanhita Section 318",
        category: "New Laws",
        description: "Replaces IPC Section 420",
        content: "Whoever cheats shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both. Whoever cheats by personation or by using electronic or digital means shall be punished with imprisonment of either description for a term which may extend to five years, and shall also be liable to fine.",
        relatedCases: []
      },
    ];

    setLaws(sampleLaws);
    setFilteredLaws(sampleLaws);
  };

  // Handle submit message
  const handleSendMessage = (e?: React.FormEvent) => {
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

    // Simulate AI processing
    setTimeout(() => {
      generateResponse(inputMessage, uploadedImage);
      setIsProcessing(false);
    }, 1500);
  };

  // Generate AI response based on user input
  const generateResponse = (message: string, image: string | null) => {
    let response = "";
    
    // Check for specific law queries
    const itActMatch = message.toLowerCase().match(/it act|section 66|information technology act/);
    const ipcMatch = message.toLowerCase().match(/ipc|indian penal code|section 4\d\d/);
    const crpcMatch = message.toLowerCase().match(/crpc|criminal procedure|section 1\d\d/);
    const bnsMatch = message.toLowerCase().match(/bns|bharatiya nyaya|sanhita/);
    
    if (itActMatch) {
      response = "The Information Technology Act, 2000 (IT Act) provides legal framework for electronic governance and e-commerce in India. Key sections include:\n\n" +
        "- Section 66: Computer-related offenses (hacking, data theft)\n" +
        "- Section 66B: Receiving stolen computer resources\n" +
        "- Section 66C: Identity theft\n" +
        "- Section 66D: Cheating by personation using computer\n" +
        "- Section 66E: Privacy violation\n" +
        "- Section 66F: Cyber terrorism\n\n" +
        "The IT Act was amended in 2008 to address more cyber crimes including cyber terrorism and data protection.";
    } else if (ipcMatch) {
      response = "The Indian Penal Code (IPC) has several sections that can apply to cyber crimes:\n\n" +
        "- Section 383: Extortion, applicable to ransomware cases\n" +
        "- Section 420: Cheating, often used in online fraud cases\n" +
        "- Section 463: Forgery, applicable to digital document forgery\n" +
        "- Section 499: Defamation, used in cases of online defamation\n\n" +
        "Note that many traditional IPC sections are now being adapted to handle digital crimes. Some sections will be replaced by the new Bharatiya Nyaya Sanhita (BNS) when it comes into full effect.";
    } else if (crpcMatch) {
      response = "The Code of Criminal Procedure (CrPC) provides the procedure for investigation and trial of cyber crimes:\n\n" +
        "- Section 154: Filing FIR for cognizable offenses\n" +
        "- Section 161-164: Recording statements and confessions\n" +
        "- Section 165: Search and seizure procedures\n" +
        "- Section 173: Submission of police report\n\n" +
        "These procedural sections guide how cyber crimes are investigated, evidence is collected, and cases are prosecuted in court.";
    } else if (bnsMatch) {
      response = "The Bharatiya Nyaya Sanhita (BNS) 2023 is set to replace the Indian Penal Code. Key cyber-related sections include:\n\n" +
        "- Section 318: Cheating (replaces IPC 420) with specific provisions for digital fraud\n" +
        "- Section 356: Extortion (replaces IPC 383) with updated language for digital threats\n" +
        "- Section 309: Criminal breach of trust (replaces IPC 405)\n\n" +
        "The BNS modernizes several provisions to better address technology-enabled crimes and will be working alongside the IT Act.";
    } else if (image) {
      response = "I've analyzed the image you uploaded. If this shows evidence of a cybercrime, please ensure you:\n\n" +
        "1. Preserve the digital evidence (don't delete the original files)\n" +
        "2. Document when and how you obtained this evidence\n" +
        "3. Report to the nearest cyber crime police station or at www.cybercrime.gov.in\n\n" +
        "This appears to potentially relate to IT Act Section 66, which covers computer-related offenses. Would you like me to provide more specific information about the applicable laws?";
    } else if (message.toLowerCase().includes("deepfake")) {
      response = "Deepfakes are addressed under multiple Indian laws:\n\n" +
        "1. IT Act Section 66E (Privacy violation)\n" +
        "2. IT Act Section 67 & 67A (Publishing obscene material)\n" +
        "3. IPC Section 499/500 (Defamation)\n" +
        "4. IPC Section 469 (Forgery to harm reputation)\n\n" +
        "The Ministry of Electronics and IT (MeitY) has also issued advisory guidelines requiring platforms to identify and remove deepfake content. More specific legislation is likely forthcoming as technology evolves.";
    } else {
      response = "Based on your query, I'd recommend looking at the relevant sections of the IT Act 2000 (as amended in 2008) and potentially applicable IPC sections. For specific cyber crimes like phishing, data theft, or online harassment, the IT Act Sections 66-66F would be most relevant.\n\n" +
        "Would you like me to provide more specific information about a particular type of cybercrime or legal provision?";
    }
    
    const aiMessage: ChatMessage = {
      id: uuidv4(),
      role: "assistant",
      content: response,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, aiMessage]);
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
              <Badge className="bg-cyber-primary text-white">Beta v1.0</Badge>
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
                            placeholder="Ask about cybercrime laws, IT Act, IPC, CrPC, BNS..." 
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
                        
                        <Button type="submit">
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
                          setSearchQuery("CrPC");
                          handleSearchLaw(new Event('submit') as any);
                        }}
                      >
                        CrPC
                      </Badge>
                      <Badge 
                        className="cursor-pointer bg-cyber-dark hover:bg-cyber-primary"
                        onClick={() => {
                          setSearchQuery("Bharatiya Nyaya Sanhita");
                          handleSearchLaw(new Event('submit') as any);
                        }}
                      >
                        BNS
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
                            <Card key={law.id} className="bg-cyber-dark/40 border-cyber-primary/20">
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <CardTitle>{law.title}</CardTitle>
                                    <CardDescription>{law.description}</CardDescription>
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
