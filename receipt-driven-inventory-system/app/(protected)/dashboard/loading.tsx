import {
  CardHeaderSkeleton,
  ListRowSkeleton,
  PageHeaderSkeleton,
  StockLegendSkeleton,
} from "@/components/structure/page-skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { cn } from "cn";
import { Table } from "lucide-react";

export default function Loading() {
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
