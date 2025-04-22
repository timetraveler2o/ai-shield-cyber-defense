import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, UserPlus, Search, BarChart4, Upload } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { StorageError } from "@supabase/storage-js";

interface Person {
  id: string;
  name: string;
  age: number;
  crime: string;
  dateAdded: string;
  imageUrl: string;
}

export default function FaceDatabase() {
  const { toast: useToastHook } = useToast();
  const [people, setPeople] = useState<Person[]>([
    {
      id: "1",
      name: "John Smith",
      age: 34,
      crime: "Fraud, Identity Theft",
      dateAdded: "15/11/2023",
      imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: "2",
      name: "Aakash Patel",
      age: 29,
      crime: "Cyber Stalking",
      dateAdded: "3/12/2023",
      imageUrl: "https://randomuser.me/api/portraits/men/68.jpg",
    },
    {
      id: "3",
      name: "Sameer Khan",
      age: 41,
      crime: "Financial Scam",
      dateAdded: "21/1/2024",
      imageUrl: "https://randomuser.me/api/portraits/men/91.jpg",
    },
  ]);

  const [newPerson, setNewPerson] = useState<Omit<Person, "id" | "dateAdded">>({
    name: "",
    age: 0,
    crime: "",
    imageUrl: "",
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true);
      setUploadProgress(0);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev !== null && prev < 90) return prev + 10;
          return prev;
        });
      }, 300);

      const { data, error } = await supabase.storage
        .from("face-database-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      clearInterval(progressInterval);

      if (error) {
        console.error("Supabase image upload error:", error);
        setUploadingImage(false);
        setUploadProgress(null);

        if (error.message?.includes("bucket not found") || 
            error.error?.statusCode === 404) {
          useToastHook({
            title: "Image upload error",
            description: "Storage bucket 'face-database-images' was not found. Please contact admin.",
            variant: "destructive",
          });
        } else if (error.message?.toLowerCase().includes("row level security policy")) {
          useToastHook({
            title: "Storage Permission Denied",
            description: "You do not have permission to upload images. Please ensure your permissions and storage policies are set up.",
            variant: "destructive",
          });
        } else {
          useToastHook({
            title: "Upload Error",
            description: error.message,
            variant: "destructive",
          });
        }
        return null;
      }

      setUploadProgress(100);

      const { data: publicUrlData } = supabase.storage
        .from("face-database-images")
        .getPublicUrl(filePath);

      setUploadingImage(false);
      setUploadProgress(null);

      if (publicUrlData?.publicUrl) {
        return publicUrlData.publicUrl;
      } else {
        useToastHook({
          title: "Error",
          description: "Could not get public URL for image",
          variant: "destructive",
        });
        return null;
      }
    } catch (err) {
      console.error("Unexpected upload error:", err);
      useToastHook({
        title: "Unexpected Error",
        description: "Error uploading image",
        variant: "destructive",
      });
      setUploadingImage(false);
      setUploadProgress(null);
      return null;
    }
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const url = await uploadImage(file);
    if (url) {
      setNewPerson((prev) => ({ ...prev, imageUrl: url }));
      useToastHook({
        title: "Image uploaded",
        description: "Image uploaded successfully.",
      });
    }
  };

  const handleAddPerson = () => {
    if (!newPerson.name || !newPerson.crime) {
      useToastHook({
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
      crime: "",
      imageUrl: "",
    });

    useToastHook({
      title: "Person added",
      description: `${person.name} has been added to the database`,
    });
  };

  const handleEditPerson = (id: string) => {
    const personToEdit = people.find((p) => p.id === id);
    if (!personToEdit) {
      useToastHook({
        title: "Edit Error",
        description: "Could not find the person to edit in the database.",
        variant: "destructive",
      });
      setEditingId(null);
      return;
    }

    setEditingId(id);
    setNewPerson({
      name: personToEdit.name,
      age: personToEdit.age,
      crime: personToEdit.crime,
      imageUrl: personToEdit.imageUrl,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdatePerson = () => {
    if (!editingId) {
      useToastHook({
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
            crime: newPerson.crime,
            imageUrl: newPerson.imageUrl,
          }
        : person
    );

    setPeople(updatedPeople);
    setEditingId(null);
    setNewPerson({
      name: "",
      age: 0,
      crime: "",
      imageUrl: "",
    });

    useToastHook({
      title: "Person updated",
      description: "The record has been updated successfully",
    });
  };

  const confirmDelete = (id: string) => {
    setPersonToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeletePerson = () => {
    if (!personToDelete) return;

    setPeople(people.filter((person) => person.id !== personToDelete));
    setDeleteDialogOpen(false);
    setPersonToDelete(null);

    useToastHook({
      title: "Person deleted",
      description: "The record has been deleted from the database",
    });
  };

  const filteredPeople = searchQuery
    ? people.filter(
        (person) =>
          person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          person.crime.toLowerCase().includes(searchQuery.toLowerCase())
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
              <TabsList className="grid w-full md:w-auto grid-cols-2 gap-2">
                <TabsTrigger value="database">Face Database</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="database">
                <Card className="border-cyber-primary/20 bg-cyber-dark">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-xl font-semibold">
                          Face Database
                        </CardTitle>
                        <CardDescription>
                          {people.length} individuals tracked
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            className="pl-10 w-64"
                            placeholder="Search by name or crime"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Card className="border-cyber-primary/20 bg-cyber-dark mb-6">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md">
                          {editingId ? "Edit Person" : "Add New Face"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              value={newPerson.name}
                              onChange={(e) =>
                                setNewPerson({ ...newPerson, name: e.target.value })
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="age">Age</Label>
                            <Input
                              id="age"
                              type="number"
                              value={newPerson.age}
                              onChange={(e) =>
                                setNewPerson({
                                  ...newPerson,
                                  age: parseInt(e.target.value) || 0,
                                })
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="crime">Crime</Label>
                            <Input
                              id="crime"
                              value={newPerson.crime}
                              onChange={(e) =>
                                setNewPerson({ ...newPerson, crime: e.target.value })
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="imageUpload" className="flex items-center gap-2">
                              Image Upload
                              <Upload className="h-4 w-4" />
                            </Label>
                            <input
                              id="imageUpload"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              disabled={uploadingImage}
                              className="mt-1 block w-full text-sm text-white file:mr-4 file:rounded-md file:border-0 file:bg-cyber-primary file:py-2 file:px-4 file:text-sm file:font-semibold file:text-white file:hover:bg-cyber-primary/90"
                            />
                            {uploadingImage && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Uploading: {uploadProgress ?? 0}%
                              </p>
                            )}
                            {newPerson.imageUrl && !uploadingImage && (
                              <img
                                src={newPerson.imageUrl}
                                alt="Uploaded Preview"
                                className="mt-2 h-24 w-24 rounded object-cover border border-cyber-primary"
                              />
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        {editingId ? (
                          <div className="flex gap-2">
                            <Button onClick={handleUpdatePerson}>Save Changes</Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setEditingId(null);
                                setNewPerson({
                                  name: "",
                                  age: 0,
                                  crime: "",
                                  imageUrl: "",
                                });
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button onClick={handleAddPerson}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add Person
                          </Button>
                        )}
                      </CardFooter>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {filteredPeople.map((person) => (
                        <Card
                          key={person.id}
                          className="border-cyber-primary/20 bg-cyber-background"
                        >
                          <div className="aspect-square w-full overflow-hidden">
                            <img
                              src={person.imageUrl || "https://via.placeholder.com/300"}
                              alt={person.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardHeader className="pb-2">
                            <CardTitle>{person.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Age: {person.age} | Crime: {person.crime}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Added: {person.dateAdded}
                            </p>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditPerson(person.id)}
                            >
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => confirmDelete(person.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card className="border-cyber-primary/20 bg-cyber-dark">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart4 className="h-5 w-5 text-cyber-primary" />
                      Face Database Analytics
                    </CardTitle>
                    <CardDescription>
                      Statistics and data analysis of tracked individuals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card className="bg-cyber-background/30 p-4">
                        <h3 className="font-medium mb-1">Total Records</h3>
                        <p className="text-3xl font-bold">{people.length}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Faces in database
                        </p>
                      </Card>
                      <Card className="bg-cyber-background/30 p-4">
                        <h3 className="font-medium mb-1">Crime Categories</h3>
                        <p className="text-3xl font-bold">
                          {new Set(people.map((p) => p.crime.split(", ")[0])).size}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Unique primary crimes
                        </p>
                      </Card>
                      <Card className="bg-cyber-background/30 p-4">
                        <h3 className="font-medium mb-1">Average Age</h3>
                        <p className="text-3xl font-bold">
                          {people.length > 0
                            ? Math.round(
                                people.reduce((sum, p) => sum + p.age, 0) / people.length
                              )
                            : 0}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Of tracked individuals
                        </p>
                      </Card>
                    </div>

                    <h3 className="font-medium mb-4">Crime Distribution</h3>
                    <div className="space-y-3">
                      {Array.from(new Set(people.map((p) => p.crime.split(", ")[0]))).map(
                        (crime) => {
                          const count = people.filter((p) => p.crime.includes(crime)).length;
                          const percentage = (count / people.length) * 100;
                          return (
                            <div key={crime} className="w-full">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">{crime}</span>
                                <span className="text-sm">
                                  {count} ({percentage.toFixed(0)}%)
                                </span>
                              </div>
                              <div className="h-2 w-full bg-cyber-background rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-cyber-primary"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePerson}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
