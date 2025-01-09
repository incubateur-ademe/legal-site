export function toFrenchDateHour(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function toFrenchDate(date: Date, full?: boolean): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: full ? "full" : "short",
  }).format(date);
}
