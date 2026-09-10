import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { usePeople } from "./usePeople";
import { PersonCard } from "./PersonCard";

const categories = ["All", "Family", "Friends", "Work"];

export function DashboardPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const { data, isLoading, isError } = usePeople({
    category:
      activeCategory === "All" ? undefined : categories.indexOf(activeCategory),
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Upcoming Birthdays</h1>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList>
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {cat}
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
          An error occurred while fetching contacts. Please try again later.
        </p>
      )}

      {data && data.content.length === 0 && (
        <p className="text-sm text-muted-foreground">No contacts found.</p>
      )}

      {data && data.content.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.content.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      )}
    </div>
  );
}
