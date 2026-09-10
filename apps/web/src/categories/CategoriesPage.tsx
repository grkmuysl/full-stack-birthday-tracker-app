import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "./useCategories";
import { CategoryFormDialog } from "./CategoryFormDialog";
import type { CategoryResponse } from "@/api/types";

export function CategoriesPage() {
  const { data, isLoading, isError } = useCategories();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryResponse | null>(
    null,
  );

  const openCreateDialog = () => {
    setCategoryToEdit(null);
    setDialogOpen(true);
  };

  const openEditDialog = (category: CategoryResponse) => {
    setCategoryToEdit(category);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-1" />
          Add Category
        </Button>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          Categories could not be loaded.
        </p>
      )}

      {data && data.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No categories added yet.
        </p>
      )}

      {data && data.length > 0 && (
        <div className="flex flex-col gap-2">
          {data.map((category) => (
            <button
              key={category.id}
              onClick={() => openEditDialog(category)}
              className="flex items-center gap-3 rounded-lg border bg-background p-4 text-left hover:bg-muted/50"
            >
              <span
                className="h-4 w-4 rounded-full border"
                style={{ backgroundColor: category.color }}
              />
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      )}

      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categoryToEdit={categoryToEdit}
      />
    </div>
  );
}
