import { cn } from "cn";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/** Title block + action buttons, matching the app page headers. */
function PageHeaderSkeleton({ actions }: { actions: number }) {
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
function CardHeaderSkeleton({
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
function StockLegendSkeleton() {
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
function ListRowSkeleton({ trailing = false }: { trailing?: boolean }) {
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

export function DashboardSkeleton() {
  return (
    <div role="status" aria-busy="true" className="flex flex-col gap-6">
      <span className="sr-only">Loading overview…</span>

      <PageHeaderSkeleton actions={2} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="rounded-xl bg-card p-5 ring-1 ring-foreground/10"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-24" />
              </div>
              <Skeleton className="size-9 shrink-0 rounded-lg" />
            </div>
            <Skeleton className="mt-4 h-3 w-36" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
          <div className="rounded-xl bg-card ring-1 ring-foreground/10">
            <CardHeaderSkeleton action="link" />
            <div className="flex flex-col items-center gap-6 px-5 py-5 sm:flex-row">
              <Skeleton className="size-40 shrink-0 rounded-full" />
              <StockLegendSkeleton />
            </div>
          </div>

          <div className="rounded-xl bg-card ring-1 ring-foreground/10">
            <CardHeaderSkeleton action="control" />
            <div className="px-5 py-5">
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-border/60 px-5 py-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
            <CardHeaderSkeleton action="link" />

            <Table className="[&_td]:px-5 [&_td]:py-3 [&_th]:px-5">
              <TableHeader className="bg-muted/40">
                <TableRow className="hover:bg-transparent">
                  <TableHead>
                    <Skeleton className="h-3 w-10" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-3 w-16" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-3 w-16" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="ml-auto h-3 w-16" />
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {Array.from({ length: 6 }, (_, row) => (
                  <TableRow key={row} className="hover:bg-transparent">
                    <TableCell>
                      <Skeleton
                        className={cn("h-4", row % 2 === 0 ? "w-44" : "w-36")}
                      />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="ml-auto h-4 w-14" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <div className="rounded-xl bg-card ring-1 ring-foreground/10">
            <CardHeaderSkeleton action="link" />

            <div className="flex flex-col divide-y divide-border/60">
              {Array.from({ length: 3 }, (_, index) => (
                <ListRowSkeleton key={index} />
              ))}
            </div>

            <div className="border-t border-border/60 px-5 py-3">
              <Skeleton className="h-7 w-full rounded-lg" />
            </div>
          </div>

          <div className="rounded-xl bg-card ring-1 ring-foreground/10">
            <CardHeaderSkeleton action="link" />

            <div className="flex flex-col divide-y divide-border/60">
              {Array.from({ length: 5 }, (_, index) => (
                <ListRowSkeleton key={index} trailing />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InventorySkeleton() {
  return (
    <div role="status" aria-busy="true" className="flex flex-col gap-6">
      <span className="sr-only">Loading inventory…</span>

      <PageHeaderSkeleton actions={3} />

      <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
        <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-9 w-full rounded-lg sm:max-w-xs sm:flex-1" />

          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="mr-auto h-3 w-16" />
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-40 rounded-lg" />
          </div>
        </div>

        <Table className="[&_td]:px-4 [&_td]:py-3 [&_th]:px-4">
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[132px]">
                <Skeleton className="h-3 w-14" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-3 w-10" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-3 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-3 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="ml-auto h-3 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="ml-auto h-3 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="ml-auto h-3 w-14" />
              </TableHead>
              <TableHead className="w-[52px]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 10 }, (_, row) => (
              <TableRow key={row} className="hover:bg-transparent">
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton
                    className={cn(
                      "h-4",
                      row % 3 === 0
                        ? "w-48"
                        : row % 3 === 1
                          ? "w-40"
                          : "w-32",
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto h-4 w-14" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto size-8 rounded-md" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={8} className="px-4 py-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Skeleton className="h-4 w-40" />
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-8 w-20 rounded-lg" />
                    <Skeleton className="size-8 rounded-lg" />
                    <Skeleton className="h-8 w-16 rounded-lg" />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
