
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Upload } from "lucide-react";
import { Person } from "./types";

interface PersonFormProps {
  newPerson: Omit<Person, "id" | "dateAdded">;
  editingId: string | null;
  uploadingImage: boolean;
  uploadProgress: number | null;
  onPersonChange: (field: string, value: string | number) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function PersonForm({
  newPerson,
  editingId,
  uploadingImage,
  uploadProgress,
  onPersonChange,
  onImageChange,
  onSubmit,
  onCancel,
}: PersonFormProps) {
  return (
    <Card className="border-cyber-primary/20 bg-cyber-dark mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-md">
          {editingId ? "Edit Missing Person" : "Add Missing Person"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={newPerson.name}
              onChange={(e) => onPersonChange("name", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={newPerson.age}
              onChange={(e) => onPersonChange("age", parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="lastSeen">Last Seen Location</Label>
            <Input
              id="lastSeen"
              value={newPerson.lastSeen}
              onChange={(e) => onPersonChange("lastSeen", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={newPerson.status || "missing"} 
              onValueChange={(value) => onPersonChange("status", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="missing">Missing</SelectItem>
                <SelectItem value="investigating">Under Investigation</SelectItem>
                <SelectItem value="found">Found</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="imageUpload" className="flex items-center gap-2">
              Upload Photo
              <Upload className="h-4 w-4" />
            </Label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={onImageChange}
              disabled={uploadingImage}
              className="mt-1 block w-full text-sm text-white file:mr-4 file:rounded-md file:border-0 file:bg-cyber-primary file:py-2 file:px-4 file:text-sm file:font-semibold file:text-white file:hover:bg-cyber-primary/90"
            />
            {uploadingImage && (
              <Progress value={uploadProgress || 0} className="mt-2 h-2" />
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
            <Button onClick={onSubmit}>Save Changes</Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={onSubmit}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Missing Person
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
