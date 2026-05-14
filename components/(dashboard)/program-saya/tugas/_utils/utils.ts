export const pill = (state: "open" | "notStarted" | "closed") => {
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[13px] font-medium ring-1";
  if (state === "open")
    return `${base} bg-emerald-500/10 text-emerald-700 ring-emerald-600/20 dark:text-emerald-300`;
  if (state === "closed")
    return `${base} bg-red-500/10 text-red-700 ring-red-600/20 dark:text-red-300`;
  return `${base} bg-muted text-foreground/80 ring-border/60`;
};

export const chip =
  "inline-flex min-h-9 items-center gap-2 rounded-md border bg-background px-3 py-1 text-sm text-muted-foreground transition-shadow hover:shadow-sm";

export const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, n));

export const formatWIB = (input?: Date | string) => {
  if (!input) return "-";
  const d = typeof input === "string" ? new Date(input) : input;
  return (
    new Intl.DateTimeFormat("id-ID", {
      timeZone: "UTC",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d) + " WIB"
  );
};
