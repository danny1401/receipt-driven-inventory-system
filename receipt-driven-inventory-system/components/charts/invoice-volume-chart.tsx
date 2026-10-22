import { cn } from "cn";

export function InvoiceVolumeChart({
  counts,
  monthLabel,
  monthShort,
}: {
  counts: number[];
  monthLabel: string;
  monthShort: string;
}) {
  const total = counts.reduce((sum, count) => sum + count, 0);
  const peak = Math.max(...counts);
  const peakDay = counts.indexOf(peak) + 1;
  /** Round up to an even number so the middle tick is a whole number. */
  const axisMax = Math.max(2, Math.ceil(peak / 2) * 2);

  return (
    <>
      <div className="overflow-x-auto px-5 py-5">
        <div className="flex min-w-[30rem] flex-col gap-2">
          <div className="flex gap-3">
            <div className="relative h-40 w-5 shrink-0 text-right text-[10px] leading-none text-muted-foreground tabular-nums">
              <span className="absolute top-0 right-0 -translate-y-1/2">
                {axisMax}
              </span>
              <span className="absolute top-1/2 right-0 -translate-y-1/2">
                {axisMax / 2}
              </span>
              <span className="absolute bottom-0 right-0 translate-y-1/2">
                0
              </span>
            </div>

            <div
              role="img"
              aria-label={`Invoices received per day in ${monthLabel}. ${total} receipts in total, peaking at ${peak} on ${peakDay} ${monthLabel}.`}
              className="relative h-40 min-w-0 flex-1"
            >
              <div aria-hidden className="pointer-events-none absolute inset-0">
                <span className="absolute inset-x-0 top-0 border-t border-border/60" />
                <span className="absolute inset-x-0 top-1/2 border-t border-border/60" />
                <span className="absolute inset-x-0 bottom-0 border-t border-border/60" />
              </div>

              <div className="absolute inset-0 flex items-end gap-px sm:gap-1">
                {counts.map((count, index) => {
                  const day = index + 1;

                  return (
                    <div
                      key={day}
                      title={`${count} ${count === 1 ? "invoice" : "invoices"} on ${day} ${monthLabel}`}
                      className="group flex h-full min-w-0 flex-1 items-end"
                    >
                      <div
                        className={cn(
                          "w-full rounded-t-[3px] transition-colors",
                          count === 0
                            ? "bg-muted-foreground/20"
                            : "bg-primary/70 group-hover:bg-primary",
                        )}
                        style={{
                          height:
                            count === 0
                              ? "2px"
                              : `${(count / axisMax) * 100}%`,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-px pl-8 text-center text-[10px] text-muted-foreground tabular-nums sm:gap-1">
            {counts.map((_, index) => (
              <span key={index} className="min-w-0 flex-1">
                {index + 1}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border/60 px-5 py-3 text-xs text-muted-foreground">
        <span className="tabular-nums">{total} receipts</span>
        <span className="tabular-nums">
          Peak {peak} on {peakDay} {monthShort}
        </span>
      </div>
    </>
  );
}