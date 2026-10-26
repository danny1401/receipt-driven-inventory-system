import { api } from "@/convex/_generated/api";
import { cn } from "cn";
import { useQuery } from "convex/react";
import { useMemo } from "react";
import { useWorkspace } from "../custom";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { ALL, formatQuantity, formatDate } from "../util/functions";

export function LatestItemsTable() {
  const { workspace } = useWorkspace();
  const latestItemArgs = useMemo<{ customerName?: string }>(
    () => (workspace === ALL ? {} : { customerName: workspace }),
    [workspace],
  );
  const latestItems = useQuery(
    api.inventory.inventory.listLatestItems,
    latestItemArgs,
  );

  return (
    <Table className="[&_td]:px-5 [&_td]:py-3 [&_th]:px-5">
      <TableHeader className="bg-muted/40">
        <TableRow className="hover:bg-transparent">
          <TableHead className="header-cell">Item</TableHead>
          <TableHead className="header-cell">Supplier</TableHead>
          <TableHead className="header-cell">Received</TableHead>
          <TableHead className={cn("header-cell", "text-right")}>
            Quantity
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {latestItems === undefined &&
          Array.from({ length: 6 }, (_, index) => (
            <TableRow key={index} className="hover:bg-transparent">
              <TableCell>
                <Skeleton className="h-4 w-40" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-14" />
              </TableCell>
            </TableRow>
          ))}

        {latestItems?.length === 0 && (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={4}>
              <p className="py-8 text-center text-sm text-muted-foreground">
                {workspace === ALL
                  ? "No items yet. Upload a receipt to get started."
                  : `No items in ${workspace} yet.`}
              </p>
            </TableCell>
          </TableRow>
        )}

        {latestItems?.map((line) => (
          <TableRow key={line._id}>
            <TableCell className="font-medium">
              {line.item?.itemName ?? "Unknown item"}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {line.supplierName ?? "—"}
            </TableCell>
            <TableCell className="text-muted-foreground tabular-nums">
              {formatDate(line._creationTime)}
            </TableCell>
            <TableCell className="text-right font-medium tabular-nums">
              {formatQuantity(line.quantity, line.quantityUnit)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
