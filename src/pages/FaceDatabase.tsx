
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Person } from "@/components/face-database/types";
import { DatabaseContent } from "@/components/face-database/DatabaseContent";
import { DeleteConfirmationDialog } from "@/components/face-database/DeleteConfirmationDialog";
import { FaceRecognitionPanel } from "@/components/face-database/FaceRecognitionPanel";
import { AnalyticsPanel } from "@/components/face-database/AnalyticsPanel";
import { useImageUpload } from "@/components/face-database/useImageUpload";
import { SearchBar } from "@/components/face-database/SearchBar";

export default function FaceDatabase() {
  const { toast } = useToast();
  const { uploadImage, uploadingImage, uploadProgress } = useImageUpload();
  const [people, setPeople] = useState<Person[]>([
    {
      id: "1",
      name: "John Smith",
      age: 34,
      lastSeen: "New Delhi, Connaught Place",
      dateAdded: "15/11/2023",
      imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      status: "missing"
    },
    {
      id: "2",
      name: "Aakash Patel",
      age: 29,
      lastSeen: "Mumbai, Bandra West",
      dateAdded: "3/12/2023",
      imageUrl: "https://randomuser.me/api/portraits/men/68.jpg",
      status: "investigating",
      lastDetectedAt: "22/04/2025",
      lastDetectedLocation: "Mumbai, Juhu Beach"
    }
  ]);

  const [newPerson, setNewPerson] = useState<Omit<Person, "id" | "dateAdded">>({
    name: "",
    age: 0,
    lastSeen: "",
    imageUrl: "",
    status: "missing"
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<string | null>(null);

  // Implement similar methods as before for person management
  const handlePersonChange = (field: string, value: string | number) => {
    setNewPerson((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const url = await uploadImage(file);
    if (url) {
      setNewPerson((prev) => ({ ...prev, imageUrl: url }));
    }
  };

  const handleAddPerson = () => {
    if (!newPerson.name || !newPerson.lastSeen) {
      toast({
        title: "Invalid input",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${
      currentDate.getMonth() + 1
    }/${currentDate.getFullYear()}`;

    const person: Person = {
      id: Date.now().toString(),
      dateAdded: formattedDate,
      ...newPerson,
    };

    setPeople([...people, person]);
    setNewPerson({
      name: "",
      age: 0,
      lastSeen: "",
      imageUrl: "",
      status: "missing"
    });

    toast({
      title: "Person added",
      description: `${person.name} has been added to the missing persons database`,
    });
  };

  const handleUpdatePerson = () => {
    if (!editingId) {
      toast({
        title: "Edit Error",
        description: "No record selected for editing.",
        variant: "destructive",
      });
      return;
    }

    const updatedPeople = people.map((person) =>
      person.id === editingId
        ? {
            ...person,
            name: newPerson.name,
            age: newPerson.age,
            lastSeen: newPerson.lastSeen,
            imageUrl: newPerson.imageUrl,
            status: newPerson.status
          }
        : person
    );

    setPeople(updatedPeople);
    setEditingId(null);
    setNewPerson({
      name: "",
      age: 0,
      lastSeen: "",
      imageUrl: "",
      status: "missing"
    });

    toast({
      title: "Person updated",
      description: "The record has been updated successfully",
    });
  };

  const handleDeletePerson = () => {
    if (!personToDelete) return;

    setPeople(people.filter((person) => person.id !== personToDelete));
    setDeleteDialogOpen(false);
    setPersonToDelete(null);

    toast({
      title: "Person removed",
      description: "The record has been removed from the database",
    });
  };

  const filteredPeople = searchQuery
    ? people.filter(
        (person) =>
          person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          person.lastSeen.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : people;

  return (
    <div className="flex h-screen bg-cyber-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-cyber-background">
          <div className="mb-6">
            <Tabs defaultValue="database" className="w-full">
              <TabsList className="grid w-full md:w-auto grid-cols-3 gap-2">
                <TabsTrigger value="database">Missing Persons</TabsTrigger>
                <TabsTrigger value="recognition">Facial Recognition</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="database">
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    Facial Recognition System for Missing Persons
                  </h2>
                  <SearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                </div>

                <DatabaseContent
                  people={filteredPeople}
                  newPerson={newPerson}
                  editingId={editingId}
                  uploadingImage={uploadingImage}
                  uploadProgress={uploadProgress}
                  onPersonChange={handlePersonChange}
                  onImageChange={handleImageChange}
                  onSubmit={editingId ? handleUpdatePerson : handleAddPerson}
                  onCancel={() => {
                    setEditingId(null);
                    setNewPerson({
                      name: "",
                      age: 0,
                      lastSeen: "",
                      imageUrl: "",
                      status: "missing"
                    });
                  }}
                  onEdit={(id) => {
                    const personToEdit = people.find((p) => p.id === id);
                    if (personToEdit) {
                      setEditingId(id);
                      setNewPerson({
                        name: personToEdit.name,
                        age: personToEdit.age,
                        lastSeen: personToEdit.lastSeen,
                        imageUrl: personToEdit.imageUrl,
                        status: personToEdit.status || "missing"
                      });
                    }
                  }}
                  onDelete={(id) => {
                    setPersonToDelete(id);
                    setDeleteDialogOpen(true);
                  }}
                />
              </TabsContent>

              <TabsContent value="recognition">
                {/* Reuse existing FaceRecognitionPanel component */}
                <FaceRecognitionPanel 
                  people={people}
                  onUpdatePerson={(updatedPerson) => {
                    setPeople(currentPeople => 
                      currentPeople.map(person => 
                        person.id === updatedPerson.id ? updatedPerson : person
                      )
                    );
                  }}
                />
              </TabsContent>

              <TabsContent value="analytics">
                <AnalyticsPanel people={people} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirmDelete={handleDeletePerson}
      />
    </div>
  );
}
