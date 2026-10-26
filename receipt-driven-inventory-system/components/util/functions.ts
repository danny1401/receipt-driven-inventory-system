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