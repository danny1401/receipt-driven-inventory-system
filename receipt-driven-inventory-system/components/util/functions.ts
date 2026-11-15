/** Sentinel for “no filter” in every filter menu. */
export const ALL = "all";

/** Render a timestamp as dd.MM.yyyy, matching the dates used across the app. */
export function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getFullYear()}`;
}

export function formatQuantity(quantity: number | null, unit: string | null) {
  if (quantity === null) return "—";
  return unit ? `${quantity} ${unit}` : `${quantity}`;
}

/** Format a `YYYY-MM` key as e.g. “November 2026”. */
export function formatMonthLabel(yearMonth: string) {
  const [year, month] = yearMonth.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}