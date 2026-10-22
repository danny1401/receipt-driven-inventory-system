

import { useState } from "react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/custom";
import { InvoiceVolumeChart } from "./invoice-volume-chart";

/**
 * Mock daily invoice counts. Index 0 is the month the card opens on (the
 * current one); index 1 is the month before it.
 */
const MONTH_BUCKETS = [
  [
    2, 3, 0, 0, 2, 1, 2, 5, 1, 0, 0, 2, 1, 1, 2, 1, 0, 0, 2, 1, 2, 1, 1, 0,
    0, 2, 1, 1, 1, 1, 0,
  ],
  [
    2, 2, 1, 1, 0, 0, 2, 1, 4, 1, 2, 0, 0, 1, 2, 1, 2, 1, 0, 0, 2, 1, 1, 2,
    1, 0, 0, 1, 1, 2,
  ],
];

const MONTH_OPTIONS = [
  { label: "Previous", offset: 1 },
  { label: "This month", offset: 0 },
] as const;

export function InvoiceVolumeCard() {
  /** 0 = the current month (the default), 1 = the month before it. */
  const [monthOffset, setMonthOffset] = useState<0 | 1>(0);

  const month = new Date();
  month.setDate(1);
  month.setMonth(month.getMonth() - monthOffset);

  const monthLabel = month.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  const monthShort = month.toLocaleString("en-US", { month: "short" });
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const bucket = MONTH_BUCKETS[monthOffset];
  const counts = Array.from(
    { length: daysInMonth },
    (_, index) => bucket[index] ?? 0,
  );

  return (
    <div className="rounded-xl bg-card ring-1 ring-foreground/10">
      <SectionHeader
        title="Invoices received"
        description={`Supplier receipts parsed per day in ${monthLabel}.`}
        action={
          <div
            role="group"
            aria-label="Month"
            className="flex shrink-0 items-center gap-0.5 rounded-lg bg-muted p-0.5"
          >
            {MONTH_OPTIONS.map((option) => (
              <Button
                key={option.offset}
                variant="ghost"
                size="sm"
                aria-pressed={monthOffset === option.offset}
                onClick={() => setMonthOffset(option.offset)}
                className={cn(
                  "h-7 rounded-md px-2.5 text-xs font-medium",
                  monthOffset === option.offset
                    ? "bg-background text-foreground shadow-xs hover:bg-background"
                    : "text-muted-foreground hover:bg-transparent hover:text-foreground",
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>
        }
      />

      <InvoiceVolumeChart
        counts={counts}
        monthLabel={monthLabel}
        monthShort={monthShort}
      />
    </div>
  );
}