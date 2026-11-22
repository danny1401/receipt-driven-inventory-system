/** A timestamp as a sortable `YYYY-MM` month key (UTC). */
export function monthKeyFromTimestamp(timestamp: number) {
  const date = new Date(timestamp);
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${date.getUTCFullYear()}-${month}`;
}

/** The `[start, end)` timestamps covering one `YYYY-MM` month (UTC). */
export function monthRange(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  return {
    start: Date.UTC(year, monthNumber - 1, 1),
    end: Date.UTC(year, monthNumber, 1),
  };
}

export function monthToRange(yearMonth: string) {
  // yearMonth: "YYYY-MM", e.g., "2026-11"
  const [year, month] = yearMonth.split("-").map(Number);
  const mm = String(month).padStart(2, "0");
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();

  return {
    startStr: `${year}-${mm}-01`,
    endStr: `${year}-${mm}-${String(lastDay).padStart(2, "0")}`,
    startMs: Date.UTC(year, month - 1, 1, 0, 0, 0, 0),
    endMs: Date.UTC(year, month, 0, 23, 59, 59, 999),
  };
}

export function monthBoundsUtc(ms: number) {
  const d = new Date(ms);
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth(); // 0–11
  return {
    start: Date.UTC(year, month, 1),
    end: Date.UTC(year, month + 1, 1),
  };
}

export function toYearMonth(ms: number) {
  const d = new Date(ms);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
}