import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { PersonFormDialog } from "./PersonFormDialog";
import { daysUntilNextBirthday, formatDaysToGo } from "@/lib/birthdayUtils";
import { usePerson } from "./usePerson";

export function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const personId = Number(id);
  const navigate = useNavigate();

  const { data: person, isLoading, isError } = usePerson(personId);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (isLoading) {
    return <Skeleton className="h-64 rounded-lg" />;
  }

  if (isError || !person) {
    return <p className="text-sm text-destructive">Person not found.</p>;
  }

  const days = daysUntilNextBirthday(person.birthDate);
  const initials = person.fullName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/contacts")}
        className="w-fit"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Contacts
      </Button>

      <div className="rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 p-6 flex items-center gap-4 text-white">
        <Avatar className="h-20 w-20 border-4 border-white">
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{person.fullName}</h1>
          <p className="text-white/90">{formatDaysToGo(days)}</p>
        </div>

        <Button variant="secondary" onClick={() => setDialogOpen(true)}>
          <Pencil className="h-4 w-4 mr-1" />
          Düzenle
        </Button>
      </div>

      <div className="rounded-lg border bg-background p-6 flex flex-col gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Kategori</p>
          {person.category ? (
            <Badge variant="secondary">{person.category.name}</Badge>
          ) : (
            <p className="text-sm">—</p>
          )}
        </div>

        {person.note && (
          <div>
            <p className="text-sm text-muted-foreground">Notlar</p>
            <p className="whitespace-pre-wrap">{person.note}</p>
          </div>
        )}
      </div>

      <PersonFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        personToEdit={person}
      />
    </div>
  );
}
