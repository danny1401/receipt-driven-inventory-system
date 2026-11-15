import { cn } from "cn";

import { Skeleton } from "@/components/ui/skeleton";

/** Title block + action buttons, matching the app page headers. */
export function PageHeaderSkeleton({ actions }: { actions: number }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-5 w-80 max-w-full" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {Array.from({ length: actions }, (_, index) => (
          <Skeleton
            key={index}
            className={cn(
              "h-8 rounded-lg",
              index === actions - 1 ? "w-20" : "w-28",
            )}
          />
        ))}
      </div>
    </div>
  );
}

/** Card heading with a muted divider and an optional action placeholder. */
export function CardHeaderSkeleton({
  action,
}: {
  action?: "link" | "control";
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 px-5 py-4">
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-64 max-w-full" />
      </div>

      {action === "control" ? (
        <Skeleton className="h-7 w-28 shrink-0 rounded-lg" />
      ) : null}
      {action === "link" ? (
        <Skeleton className="mt-0.5 h-3 w-12 shrink-0" />
      ) : null}
    </div>
  );
}

/** Legend rows beside the stock donut. */
export function StockLegendSkeleton() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="size-2.5 shrink-0 rounded-[3px]" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-8 shrink-0" />
          <Skeleton className="h-3 w-10 shrink-0" />
        </div>
      ))}
    </div>
  );
}

/** A compact two-line row used by the dashboard list cards. */
export function ListRowSkeleton({ trailing = false }: { trailing?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-40 max-w-full" />
      </div>

      {trailing ? (
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-3 w-20" />
        </div>
      ) : (
        <Skeleton className="size-4 shrink-0 rounded-sm" />
      )}
    </div>
  );
}