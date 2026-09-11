export function daysUntilNextBirthday(birthDateIso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const birthDate = new Date(birthDateIso);
  const nextBirthday = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate(),
  );

  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }

  const diffMs = nextBirthday.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function formatDaysToGo(days: number): string {
  if (days === 0) return "Today!";
  if (days === 1) return "Tomorrow";
  return `${days} days left`;
}
