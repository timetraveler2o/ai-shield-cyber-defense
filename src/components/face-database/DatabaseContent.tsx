
import { Person } from "./types";
import { PersonCard } from "./PersonCard";
import { PersonForm } from "./PersonForm";

interface DatabaseContentProps {
  people: Person[];
  newPerson: Omit<Person, "id" | "dateAdded">;
  editingId: string | null;
  uploadingImage: boolean;
  uploadProgress: number | null;
  onPersonChange: (field: string, value: string | number) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DatabaseContent({
  people,
  newPerson,
  editingId,
  uploadingImage,
  uploadProgress,
  onPersonChange,
  onImageChange,
  onSubmit,
  onCancel,
  onEdit,
  onDelete,
}: DatabaseContentProps) {
  return (
    <div>
      <PersonForm
        newPerson={newPerson}
        editingId={editingId}
        uploadingImage={uploadingImage}
        uploadProgress={uploadProgress}
        onPersonChange={onPersonChange}
        onImageChange={onImageChange}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {people.map((person) => (
          <PersonCard
            key={person.id}
            person={person}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
