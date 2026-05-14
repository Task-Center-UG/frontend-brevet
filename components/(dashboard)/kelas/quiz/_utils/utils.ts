export const fromIsoUtcToLocalDate = (iso?: Date) =>
  iso
    ? new Date(
        new Date(iso).getTime() + new Date(iso).getTimezoneOffset() * 60000
      )
    : undefined;

export const toIsoUtc = (d?: Date) =>
  d
    ? new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .replace(/\.\d{3}Z$/, "Z")
    : undefined;
