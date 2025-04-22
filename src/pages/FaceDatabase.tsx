
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { DatabaseContent } from "@/components/face-database/DatabaseContent";
import { FaceRecognitionPanel } from "@/components/face-database/FaceRecognitionPanel";
import { AnalyticsPanel } from "@/components/face-database/AnalyticsPanel";
import { PoliceChatbot } from "@/components/face-database/PoliceChatbot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { MessageSquare } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

const FaceDatabase = () => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const isMobile = useMobile();

  return (
    <div className="flex h-screen bg-cyber-background text-white overflow-hidden">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header className="flex-none" />
        <div className="flex-1 overflow-auto p-6">
          <h1 className="text-2xl font-semibold mb-6">Face Recognition Database</h1>
          
          <Tabs defaultValue="database" className="w-full">
            <TabsList className="mb-6 bg-cyber-dark border border-cyber-primary/20">
              <TabsTrigger value="database">Database</TabsTrigger>
              <TabsTrigger value="recognition">Face Recognition</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="database" className="space-y-4">
              <DatabaseContent />
            </TabsContent>
            
            <TabsContent value="recognition" className="space-y-4">
              <FaceRecognitionPanel />
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4">
              <AnalyticsPanel />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Floating chat button for mobile */}
        {isMobile ? (
          <Drawer open={isAssistantOpen} onOpenChange={setIsAssistantOpen}>
            <DrawerTrigger asChild>
              <Button 
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-cyber-primary hover:bg-cyber-primary/80 shadow-lg"
                size="icon"
              >
                <MessageSquare className="h-6 w-6" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[70vh]">
              <div className="p-4">
                <PoliceChatbot />
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          <>
            <Button 
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-cyber-primary hover:bg-cyber-primary/80 shadow-lg"
              size="icon"
              onClick={() => setIsAssistantOpen(true)}
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
            
            <Dialog open={isAssistantOpen} onOpenChange={setIsAssistantOpen}>
              <DialogContent className="max-w-3xl p-0 border-cyber-primary/30 bg-cyber-dark/80 backdrop-blur-sm">
                <PoliceChatbot />
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
};

export default FaceDatabase;
