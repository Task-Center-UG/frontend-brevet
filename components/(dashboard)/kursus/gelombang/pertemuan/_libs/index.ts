const hasTZ = (s: string) => /Z|[+\-]\d{2}:\d{2}$/.test(s);

export function formatToIndoTime(iso?: string | null) {
  if (!iso) return "-";
  const hasTZ = /Z|[+\-]\d{2}:\d{2}$/.test(iso);
  const date = new Date(hasTZ ? iso : `${iso}Z`);
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

export function parseUTCStringToDate(iso?: string | null) {
  if (!iso) return undefined;
  const normalized = hasTZ(iso) ? iso : `${iso}Z`;
  return new Date(normalized);
}
