import { PageHeaderSkeleton } from "@/components/structure/page-skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { cn } from "cn";
import { Table } from "lucide-react";

export default function Loading() {
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
              <TableHead className="w-33">
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
              <TableHead className="w-13" />
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
                      row % 3 === 0 ? "w-48" : row % 3 === 1 ? "w-40" : "w-32",
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
