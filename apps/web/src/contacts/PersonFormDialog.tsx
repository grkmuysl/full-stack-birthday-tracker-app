import { useEffect, useState, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreatePerson,
  useUpdatePerson,
  useDeletePerson,
} from "./useContactMutations";
import type { PersonRequest, PersonResponse } from "@/api/types";
import { useCategories } from "@/categories/useCategories";

interface PersonFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personToEdit?: PersonResponse | null;
}

const emptyForm: PersonRequest = {
  fullName: "",
  birthDate: "",
  birthYearKnown: true,
  categoryId: null,
  note: "",
};

export function PersonFormDialog({
  open,
  onOpenChange,
  personToEdit,
}: PersonFormDialogProps) {
  const { data: categories } = useCategories();
  const createPerson = useCreatePerson();
  const updatePerson = useUpdatePerson();
  const deletePerson = useDeletePerson();

  const [form, setForm] = useState<PersonRequest>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!personToEdit;
  const isSubmitting = createPerson.isPending || updatePerson.isPending;

  // reset form state when the dialog is opened or when personToEdit changes
  useEffect(() => {
    if (personToEdit) {
      setForm({
        fullName: personToEdit.fullName,
        birthDate: personToEdit.birthDate,
        birthYearKnown: personToEdit.birthYearKnown,
        categoryId: personToEdit.category?.id ?? null,
        note: personToEdit.note ?? "",
      });
    } else {
      setForm(emptyForm);
    }
    setError(null);
  }, [personToEdit, open]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isEditMode) {
        await updatePerson.mutateAsync({ id: personToEdit!.id, payload: form });
      } else {
        await createPerson.mutateAsync(form);
      }
      onOpenChange(false);
    } catch {
      setError("An error occurred while saving the person. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!personToEdit) return;
    if (!confirm(`Is ${personToEdit.fullName} deleted?`)) return;
    await deletePerson.mutateAsync(personToEdit.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Person" : "Add New Person"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="birthDate">Birth Date</Label>
            <Input
              id="birthDate"
              type="date"
              value={form.birthDate}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="birthYearKnown"
              checked={form.birthYearKnown}
              onCheckedChange={(checked) =>
                setForm({ ...form, birthYearKnown: checked === true })
              }
            />
            <Label htmlFor="birthYearKnown">I know the birth year</Label>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Category</Label>
            <Select
              value={form.categoryId?.toString() ?? ""}
              onValueChange={(value) =>
                setForm({ ...form, categoryId: Number(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              value={form.note ?? ""}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter className="flex items-center justify-between sm:justify-between">
            {isEditMode ? (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deletePerson.isPending}
              >
                Delete
              </Button>
            ) : (
              <span />
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
