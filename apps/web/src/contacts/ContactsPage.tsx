import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { daysUntilNextBirthday, formatDaysToGo } from "@/lib/birthdayUtils";
import { usePeople } from "./usePeople";

export function ContactsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = usePeople();

  const filtered = data?.content.filter((p) =>
    p.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">All Contacts</h1>

      <Input
        placeholder="Search with name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">People could not be loaded.</p>
      )}

      {filtered && filtered.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No matching people found.
        </p>
      )}

      {filtered && filtered.length > 0 && <ContactsList people={filtered} />}
    </div>
  );
}

function ContactsList({
  people,
}: {
  people: NonNullable<ReturnType<typeof usePeople>["data"]>["content"];
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col divide-y rounded-lg border bg-background">
      {people.map((person) => {
        const days = daysUntilNextBirthday(person.birthDate);
        const initials = person.fullName
          .split(" ")
          .map((p) => p[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

        return (
          <button
            key={person.id}
            onClick={() => navigate(`/contacts/${person.id}`)}
            className="flex items-center gap-3 p-4 text-left hover:bg-muted/50"
          >
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{person.fullName}</p>
              <p className="text-sm text-muted-foreground">
                {formatDaysToGo(days)}
              </p>
            </div>
            {person.category && (
              <Badge variant="secondary">{person.category.name}</Badge>
            )}
          </button>
        );
      })}
    </div>
  );
}
