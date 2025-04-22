
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import { Person } from "./types";

interface PersonCardProps {
  person: Person;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PersonCard({ person, onEdit, onDelete }: PersonCardProps) {
  return (
    <Card className="border-cyber-primary/20 bg-cyber-background">
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
          Age: {person.age} | Last Seen: {person.lastSeen}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Registered: {person.dateAdded}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(person.id)}
        >
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(person.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Remove
        </Button>
      </CardFooter>
    </Card>
  );
}
