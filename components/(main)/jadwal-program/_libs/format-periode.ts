import { format } from "date-fns";
import { id } from "date-fns/locale";

export function formatPeriode(startDate: Date, endDate: Date) {
  return `${format(startDate, "dd MMMM yyyy", { locale: id })} - ${format(endDate, "dd MMMM yyyy", { locale: id })}`;
}
