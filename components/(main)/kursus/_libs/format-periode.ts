export const formatPeriode = (start: string, end: string) => {
  const formatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `${formatter.format(new Date(start))} - ${formatter.format(
    new Date(end)
  )}`;
};
