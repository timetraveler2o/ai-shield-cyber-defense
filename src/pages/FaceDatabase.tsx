import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { DatabaseContent } from "@/components/face-database/DatabaseContent";
import { FaceRecognitionPanel } from "@/components/face-database/FaceRecognitionPanel";
import { AnalyticsPanel } from "@/components/face-database/AnalyticsPanel";
import { PoliceChatbot } from "@/components/face-database/PoliceChatbot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { MessageSquare } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Person } from "@/components/face-database/types";
import { v4 as uuidv4 } from "uuid";
import { useImageUpload } from "@/components/face-database/useImageUpload";
import { useToast } from "@/hooks/use-toast";

const FaceDatabase = () => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { uploadState, uploadImage, resetUpload } = useImageUpload();
  
  // Extract values from uploadState for compatibility with existing code
  const uploadingImage = uploadState.isUploading;
  const uploadProgress = uploadState.progress;
  
  // Add state for people data
  const [people, setPeople] = useState<Person[]>([
    {
      id: "1",
      name: "John Doe",
      age: 32,
      lastSeen: "New York, NY",
      dateAdded: "2023-09-15",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250",
      status: "missing"
    },
    {
      id: "2",
      name: "Jane Smith",
      age: 28,
      lastSeen: "Los Angeles, CA",
      dateAdded: "2023-10-02",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250",
      status: "investigating"
    }
  ]);
  
  // Add state for new person form
  const [newPerson, setNewPerson] = useState<Omit<Person, "id" | "dateAdded">>({
    name: "",
    age: 0,
    lastSeen: "",
    imageUrl: "",
    status: "missing"
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Handler functions
  const handlePersonChange = (field: string, value: string | number) => {
    setNewPerson(prev => ({ ...prev, [field]: value }));
  };
  
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    console.log("Image selected:", file.name);
    
    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        // Update the newPerson state with the image URL
        handlePersonChange("imageUrl", imageUrl);
        toast({
          title: "Image uploaded successfully",
          description: "The image has been uploaded and attached to the form.",
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your image. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSubmit = () => {
    if (!newPerson.name) {
      toast({
        title: "Missing information",
        description: "Please enter at least a name for the person.",
        variant: "destructive",
      });
      return;
    }
    
    if (editingId) {
      // Update existing person
      setPeople(prev => 
        prev.map(p => p.id === editingId ? { ...p, ...newPerson } : p)
      );
      setEditingId(null);
      toast({
        title: "Person updated",
        description: `${newPerson.name}'s information has been updated.`,
      });
    } else {
      // Add new person
      const currentDate = new Date().toISOString().split('T')[0];
      setPeople(prev => [...prev, { 
        ...newPerson, 
        id: uuidv4(), 
        dateAdded: currentDate 
      }]);
      toast({
        title: "Person added",
        description: `${newPerson.name} has been added to the database.`,
      });
    }
    
    // Reset form
    setNewPerson({
      name: "",
      age: 0,
      lastSeen: "",
      imageUrl: "",
      status: "missing"
    });
  };
  
  const handleCancel = () => {
    setEditingId(null);
    setNewPerson({
      name: "",
      age: 0,
      lastSeen: "",
      imageUrl: "",
      status: "missing"
    });
  };
  
  const handleEdit = (id: string) => {
    const person = people.find(p => p.id === id);
    if (person) {
      const { id: _, dateAdded: __, ...rest } = person;
      setNewPerson(rest);
      setEditingId(id);
    }
  };
  
  const handleDelete = (id: string) => {
    setPeople(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Person removed",
      description: "The entry has been removed from the database.",
    });
  };
  
  const handleUpdatePerson = (updatedPerson: Person) => {
    setPeople(prev => 
      prev.map(p => p.id === updatedPerson.id ? updatedPerson : p)
    );
  };

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
              <DatabaseContent 
                people={people}
                newPerson={newPerson}
                editingId={editingId}
                uploadingImage={uploadingImage}
                uploadProgress={uploadProgress}
                onPersonChange={handlePersonChange}
                onImageChange={handleImageChange}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>
            
            <TabsContent value="recognition" className="space-y-4">
              <FaceRecognitionPanel 
                people={people}
                onUpdatePerson={handleUpdatePerson}
              />
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4">
              <AnalyticsPanel people={people} />
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
                <DialogTitle className="sr-only">Police Cybercrime Assistant</DialogTitle>
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
