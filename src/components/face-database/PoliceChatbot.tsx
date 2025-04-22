
import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Image, Send, User, Video } from "lucide-react";
import { ChatMessage, VoiceState } from "./types";
import { useToast } from "@/components/ui/use-toast";
import { useImageUpload } from "./useImageUpload";
import { v4 as uuidv4 } from "uuid";
import { ScrollArea } from "@/components/ui/scroll-area";

export const PoliceChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      role: "assistant",
      content: "Hello, I'm your police cybercrime assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isRecording: false,
    isProcessing: false,
  });
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { uploadImage } = useImageUpload();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: generateResponse(inputMessage),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1500);
  };

  // Simple response generator (would be replaced by actual AI integration)
  const generateResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("missing person") || lowerMessage.includes("find someone")) {
      return "To report a missing person, please provide their name, age, last known location, and a recent photo. I can help you create an entry in our face recognition database.";
    } else if (lowerMessage.includes("cybercrime") || lowerMessage.includes("hacking")) {
      return "For cybercrime reporting, please share details about the incident including timestamps, any messages received, and evidence of the attack. Our cybercrime unit will investigate promptly.";
    } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! I'm your police cybercrime assistant. How can I help you today?";
    } else {
      return "I understand your concern. As a police assistant, I'll try to help with your query. Could you provide more details so I can assist you better?";
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setVoiceState({
          isRecording: false,
          isProcessing: true,
          audioBlob,
        });
        
        // In a real implementation, you would send this to your backend for speech-to-text
        // For now, we'll simulate with a timeout
        setTimeout(() => {
          const transcribedText = "This is a simulated voice transcription. In a real implementation, this would be the text from your speech-to-text service.";
          setInputMessage(transcribedText);
          setVoiceState({
            isRecording: false,
            isProcessing: false,
          });
          
          // Add the voice message with audio attachment
          const userMessage: ChatMessage = {
            id: uuidv4(),
            role: "user",
            content: transcribedText,
            timestamp: new Date().toISOString(),
            attachments: [{
              type: 'audio',
              url: URL.createObjectURL(audioBlob),
            }]
          };
          
          setMessages((prev) => [...prev, userMessage]);
          
          // Simulate AI response with voice
          setTimeout(() => {
            const assistantMessage: ChatMessage = {
              id: uuidv4(),
              role: "assistant",
              content: "I've received your voice message. Is there anything specific about cybercrime or missing persons you'd like to know?",
              timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
          }, 1000);
        }, 2000);
      };

      mediaRecorderRef.current.start();
      setVoiceState({
        isRecording: true,
        isProcessing: false,
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && voiceState.isRecording) {
      mediaRecorderRef.current.stop();
      // Stop all audio tracks in the stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        const userMessage: ChatMessage = {
          id: uuidv4(),
          role: "user",
          content: "I've uploaded an image that might be helpful.",
          timestamp: new Date().toISOString(),
          attachments: [{
            type: 'image',
            url: imageUrl,
          }]
        };
        
        setMessages((prev) => [...prev, userMessage]);
        
        // Simulate AI response to image
        setTimeout(() => {
          const assistantMessage: ChatMessage = {
            id: uuidv4(),
            role: "assistant",
            content: "I've received your image. Our system will analyze it for any relevant information. Is there anything specific you'd like to know about this image?",
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }, 1500);
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // For now, we'll handle videos similar to images
      // In a real implementation, you'd have a separate video upload function
      const videoUrl = await uploadImage(file);
      if (videoUrl) {
        const userMessage: ChatMessage = {
          id: uuidv4(),
          role: "user",
          content: "I've uploaded a video that might contain evidence.",
          timestamp: new Date().toISOString(),
          attachments: [{
            type: 'video',
            url: videoUrl,
          }]
        };
        
        setMessages((prev) => [...prev, userMessage]);
        
        // Simulate AI response to video
        setTimeout(() => {
          const assistantMessage: ChatMessage = {
            id: uuidv4(),
            role: "assistant",
            content: "I've received your video. Our forensic team will review it as soon as possible. Would you like to provide any additional context for this video?",
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }, 1500);
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="flex flex-col h-[600px] border-cyber-primary/30 bg-cyber-dark/30 backdrop-blur">
      <div className="p-4 border-b border-cyber-primary/20 flex items-center space-x-2">
        <Avatar>
          <AvatarImage src="/assets/police-avatar.png" alt="Police Assistant" />
          <AvatarFallback className="bg-cyber-primary text-white">PA</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">Police Cybercrime Assistant</h3>
          <p className="text-xs text-cyber-muted">Online • Ready to assist</p>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.role === 'user' ? 'bg-cyber-primary/20' : 'bg-gray-800'} rounded-lg p-3`}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-6 w-6 rounded-full bg-cyber-primary/20 flex items-center justify-center">
                    {message.role === 'user' ? <User className="h-3 w-3" /> : <Avatar className="h-6 w-6"><AvatarFallback>PA</AvatarFallback></Avatar>}
                  </div>
                  <span className="text-xs font-medium">
                    {message.role === 'user' ? 'You' : 'Police Assistant'}
                  </span>
                  <span className="text-xs text-cyber-muted ml-auto">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
                
                {message.attachments?.map((attachment, index) => (
                  <div key={index} className="mt-2">
                    {attachment.type === 'image' && (
                      <img src={attachment.url} alt="Attached image" className="max-w-full rounded-md" />
                    )}
                    {attachment.type === 'video' && (
                      <video controls className="max-w-full rounded-md">
                        <source src={attachment.url} />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {attachment.type === 'audio' && (
                      <audio controls className="max-w-full">
                        <source src={attachment.url} />
                        Your browser does not support the audio tag.
                      </audio>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-cyber-primary/20">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isUploading}
          >
            <Image className="h-5 w-5 text-cyber-muted" />
            <span className="sr-only">Attach image</span>
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => videoInputRef.current?.click()} 
            disabled={isUploading}
          >
            <Video className="h-5 w-5 text-cyber-muted" />
            <span className="sr-only">Attach video</span>
          </Button>
          <input 
            type="file" 
            ref={videoInputRef} 
            onChange={handleVideoUpload} 
            accept="video/*" 
            className="hidden" 
          />
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={voiceState.isRecording ? stopVoiceRecording : startVoiceRecording}
            disabled={voiceState.isProcessing}
            className={voiceState.isRecording ? "bg-cyber-primary/20" : ""}
          >
            {voiceState.isRecording ? (
              <MicOff className="h-5 w-5 text-cyber-warning" />
            ) : (
              <Mic className="h-5 w-5 text-cyber-muted" />
            )}
            <span className="sr-only">
              {voiceState.isRecording ? "Stop recording" : "Start recording"}
            </span>
          </Button>
          
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-cyber-background/40 border-cyber-primary/20"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          
          <Button 
            variant="default" 
            size="icon" 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() && !voiceState.audioBlob}
            className="bg-cyber-primary hover:bg-cyber-primary/80"
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
        
        {(voiceState.isProcessing || isUploading) && (
          <p className="text-xs text-cyber-muted mt-2">
            {voiceState.isProcessing && "Processing audio..."}
            {isUploading && "Uploading media..."}
          </p>
        )}
      </div>
    </Card>
  );
};
