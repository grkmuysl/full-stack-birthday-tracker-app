import type { PersonResponse } from "@/api/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { daysUntilNextBirthday, formatDaysToGo } from "@/lib/birthdayUtils";

const categoryColorClass: Record<string, string> = {
  Family: "bg-orange-100 text-orange-700",
  Friend: "bg-teal-100 text-teal-700",
  Work: "bg-purple-100 text-purple-700",
};

export function PersonCard({ person }: { person: PersonResponse }) {
  const days = daysUntilNextBirthday(person.birthDate);
  const initials = person.fullName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-lg border bg-background p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{person.fullName}</p>
          {person.category && (
            <Badge
              variant="secondary"
              className={categoryColorClass[person.category.name] ?? ""}
            >
              {person.category.name}
            </Badge>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{formatDaysToGo(days)}</p>
    </div>
  );
}
