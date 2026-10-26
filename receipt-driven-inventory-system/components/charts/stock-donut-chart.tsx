"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { ALL, useWorkspace } from "@/components/custom";
import { Skeleton } from "@/components/ui/skeleton";

/** Monochrome ramp from the theme, darkest slice first. */
const STOCK_COLORS = [
  "var(--chart-5)",
  "var(--chart-4)",
  "var(--chart-3)",
  "var(--chart-2)",
  "var(--chart-1)",
];

const moneyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const itemFormatter = new Intl.NumberFormat("en-US");

function itemLabel(count: number) {
  return count === 1 ? "item" : "items";
}

function StockDonutSkeleton() {
  return (
    <div
      aria-busy
      className="flex flex-col items-center gap-6 px-5 py-5 sm:flex-row"
    >
      <Skeleton className="size-40 shrink-0 rounded-full" />

      <div className="flex w-full min-w-0 flex-col gap-3">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="size-2.5 shrink-0 rounded-[3px]" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-16 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Donut: each slice is a category's share of the tracked stock value. */
export function StockDonutChart() {
  const { workspace } = useWorkspace();
  const stockArgs = useMemo<{ customerName?: string }>(
    () => (workspace === ALL ? {} : { customerName: workspace }),
    [workspace],
  );
  const stock = useQuery(api.inventory.inventory.getStockByCategory, stockArgs);

  if (stock === undefined) {
    return <StockDonutSkeleton />;
  }

  const { categories, totalItems, totalCost } = stock;

  if (categories.length === 0 || (totalItems === 0 && totalCost === 0)) {
    return (
      <div className="flex flex-col items-center gap-6 px-5 py-10 text-center">
        <div className="flex size-40 items-center justify-center rounded-full border-[6px] border-muted">
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold tracking-tight tabular-nums">
              0
            </span>
            <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              items
            </span>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">No stock to chart yet</p>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            Upload a receipt or add an item to see the category breakdown.
          </p>
        </div>
      </div>
    );
  }

  /** Cost is the primary measure; fall back to item count if no prices exist. */
  const useCost = totalCost > 0;
  const totalMetric = useCost ? totalCost : totalItems;

  const metrics = categories.map((category, index) => {
    const metric = useCost ? category.totalCost : category.itemCount;
    return {
      ...category,
      percent: totalMetric === 0 ? 0 : (metric / totalMetric) * 100,
      color: STOCK_COLORS[index % STOCK_COLORS.length],
    };
  });
  const segments = metrics.map((entry, index) => ({
    ...entry,
    offset: metrics
      .slice(0, index)
      .reduce((sum, previous) => sum + previous.percent, 0),
  }));

  return (
    <>
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

            {segments.map((segment) => {
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
                    {useCost
                      ? `${segment.category}: ${moneyFormatter.format(segment.totalCost)} kr · ${itemFormatter.format(segment.itemCount)} ${itemLabel(segment.itemCount)} (${segment.percent.toFixed(1)}%)`
                      : `${segment.category}: ${itemFormatter.format(segment.itemCount)} ${itemLabel(segment.itemCount)} (${segment.percent.toFixed(1)}%)`}
                  </title>
                </circle>
              );
            })}
          </svg>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <span className="text-lg font-semibold tracking-tight tabular-nums">
              {useCost
                ? `${moneyFormatter.format(totalCost)} kr`
                : itemFormatter.format(totalItems)}
            </span>
            <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              {useCost ? "total value" : "items tracked"}
            </span>
          </div>
        </div>

        <ul className="flex w-full min-w-0 flex-col gap-3">
          {segments.map((segment) => (
            <li key={segment.category} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rounded-[3px]"
                style={{ backgroundColor: segment.color }}
              />

              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm">{segment.category}</span>
                {useCost ? (
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {itemFormatter.format(segment.itemCount)}{" "}
                    {itemLabel(segment.itemCount)}
                  </span>
                ) : null}
              </div>

              <span className="shrink-0 text-sm tabular-nums">
                {useCost
                  ? `${moneyFormatter.format(segment.totalCost)} kr`
                  : `${itemFormatter.format(segment.itemCount)} ${itemLabel(segment.itemCount)}`}
              </span>
              <span className="w-10 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
                {segment.percent.toFixed(1)}%
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border/60 px-5 py-3 text-xs text-muted-foreground">
        <span className="tabular-nums">
          {itemFormatter.format(totalItems)} {itemLabel(totalItems)} tracked
        </span>
        <span className="tabular-nums">
          {categories.length}{" "}
          {categories.length === 1 ? "category" : "categories"}
        </span>
      </div>
    </>
  );
}
