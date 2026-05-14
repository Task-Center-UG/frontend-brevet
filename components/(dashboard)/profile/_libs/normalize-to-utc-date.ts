export function normalizeToUTCDateOnly(
  date: Date | string | undefined | null
): Date | undefined {
  if (!date) return undefined;

  const raw = typeof date === "string" ? new Date(date) : date;

  return new Date(Date.UTC(raw.getFullYear(), raw.getMonth(), raw.getDate()));
}
