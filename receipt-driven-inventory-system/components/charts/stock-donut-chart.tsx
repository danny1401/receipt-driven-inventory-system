const STOCK_LEVELS = [
  { category: "Produce", units: 420 },
  { category: "Dairy & eggs", units: 310 },
  { category: "Meat & poultry", units: 285 },
  { category: "Dry goods", units: 180 },
  { category: "Beverages", units: 145 },
];

const TOTAL_UNITS = STOCK_LEVELS.reduce((sum, level) => sum + level.units, 0);

/** Monochrome ramp from the theme, darkest slice first. */
const STOCK_COLORS = [
  "var(--chart-5)",
  "var(--chart-4)",
  "var(--chart-3)",
  "var(--chart-2)",
  "var(--chart-1)",
];

/** Donut slices: share of the total plus the running offset around the ring. */
const STOCK_SEGMENTS = (() => {
  let offset = 0;

  return STOCK_LEVELS.map((level, index) => {
    const percent = (level.units / TOTAL_UNITS) * 100;
    const segment = {
      category: level.category,
      units: level.units,
      percent,
      offset,
      color: STOCK_COLORS[index % STOCK_COLORS.length],
    };
    offset += percent;
    return segment;
  });
})();

/** Donut: each slice is a category's share of the on-hand units. */
export function StockDonutChart() {
  return (
    <div className="flex flex-col items-center gap-6 px-5 py-5 sm:flex-row">
      <div className="relative size-40 shrink-0">
        <svg
          viewBox="0 0 42 42"
          aria-hidden="true"
          className="size-full -rotate-90"
        >
          <circle
            cx="21"
            cy="21"
            r="15.9155"
            fill="none"
            strokeWidth="6"
            className="stroke-muted"
          />

          {STOCK_SEGMENTS.map((segment) => {
            const dash = Math.max(segment.percent - 0.8, 0.4);

            return (
              <circle
                key={segment.category}
                cx="21"
                cy="21"
                r="15.9155"
                fill="none"
                strokeWidth="6"
                stroke={segment.color}
                strokeDasharray={`${dash} ${100 - dash}`}
                strokeDashoffset={-segment.offset}
                className="transition-opacity hover:opacity-80"
              >
                <title>
                  {`${segment.category}: ${segment.units} units (${segment.percent.toFixed(1)}%)`}
                </title>
              </circle>
            );
          })}
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold tracking-tight tabular-nums">
            {TOTAL_UNITS.toLocaleString("en-US")}
          </span>
          <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            units
          </span>
        </div>
      </div>

      <ul className="flex w-full min-w-0 flex-col gap-3">
        {STOCK_SEGMENTS.map((segment) => (
          <li key={segment.category} className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-[3px]"
              style={{ backgroundColor: segment.color }}
            />
            <span className="min-w-0 flex-1 truncate text-sm">
              {segment.category}
            </span>
            <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
              {segment.units}
            </span>
            <span className="w-10 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
              {segment.percent.toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}