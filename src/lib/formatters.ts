const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "America/Argentina/Buenos_Aires",
});

const shortDateFormatter = new Intl.DateTimeFormat("es-AR", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  timeZone: "America/Argentina/Buenos_Aires",
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function formatDate(value: string | Date) {
  const date =
    typeof value === "string" ? new Date(`${value}T12:00:00-03:00`) : value;

  return dateFormatter.format(date);
}

export function formatShortDate(value: string | Date) {
  const date =
    typeof value === "string" ? new Date(`${value}T12:00:00-03:00`) : value

  return shortDateFormatter.format(date).replace(/\.$/, "")
}

export function formatTime(value: string) {
  return `${value.slice(0, 5)} h`;
}
