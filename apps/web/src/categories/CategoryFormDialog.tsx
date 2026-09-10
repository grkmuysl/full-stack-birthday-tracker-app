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
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "./useCategoryMutations";
import type { CategoryResponse } from "@/api/types";
import type { CategoryRequest } from "./categoriesApi";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryToEdit?: CategoryResponse | null;
}

const emptyForm: CategoryRequest = { name: "", color: "#F4B183" };

export function CategoryFormDialog({
  open,
  onOpenChange,
  categoryToEdit,
}: CategoryFormDialogProps) {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [form, setForm] = useState<CategoryRequest>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!categoryToEdit;
  const isSubmitting = createCategory.isPending || updateCategory.isPending;

  useEffect(() => {
    if (categoryToEdit) {
      setForm({ name: categoryToEdit.name, color: categoryToEdit.color });
    } else {
      setForm(emptyForm);
    }
    setError(null);
  }, [categoryToEdit, open]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isEditMode) {
        await updateCategory.mutateAsync({
          id: categoryToEdit!.id,
          payload: form,
        });
      } else {
        await createCategory.mutateAsync(form);
      }
      onOpenChange(false);
    } catch {
      setError("An error occurred while saving the category.");
    }
  };

  const handleDelete = async () => {
    if (!categoryToEdit) return;
    if (!confirm(`Delete "${categoryToEdit.name}" category?`)) return;
    try {
      await deleteCategory.mutateAsync(categoryToEdit.id);
      onOpenChange(false);
    } catch {
      setError("An error occurred while deleting the category.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Update Category" : "Create Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g., Family, Friends, Work"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex items-center gap-3">
              <input
                id="color"
                type="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="h-9 w-14 rounded border cursor-pointer"
              />
              <span className="text-sm text-muted-foreground">
                {form.color}
              </span>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter className="flex items-center justify-between sm:justify-between">
            {isEditMode ? (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteCategory.isPending}
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
