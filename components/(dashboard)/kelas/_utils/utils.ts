export const formatWIB = (input: Date | string | undefined) => {
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
