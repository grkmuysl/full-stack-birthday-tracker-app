import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { usePeople } from "./usePeople";
import { PersonCard } from "./PersonCard";
import { PersonFormDialog } from "./PersonFormDialog";
import { useCategories } from "@/categories/useCategories";

const ALL_TAB = "all";

export function DashboardPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(ALL_TAB);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: categories } = useCategories();

  const { data, isLoading, isError } = usePeople({
    category: activeCategory === ALL_TAB ? undefined : Number(activeCategory),
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Upcoming Birthdays</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Kişi Ekle
        </Button>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList>
          <TabsTrigger value={ALL_TAB}>All</TabsTrigger>
          {categories?.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id.toString()}>
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          An error occurred while fetching people. Please try again later.
        </p>
      )}

      {data && data.content.length === 0 && (
        <p className="text-sm text-muted-foreground">No people found.</p>
      )}

      {data && data.content.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.content.map((person) => (
            <button
              key={person.id}
              onClick={() => navigate(`/contacts/${person.id}`)}
              className="text-left"
            >
              <PersonCard person={person} />
            </button>
          ))}
        </div>
      )}

      <PersonFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        personToEdit={null}
      />
    </div>
  );
}
