"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { cn } from "cn";
import {
  ALL,
  DashboardSkeleton,
  PageContainer,
  RestrictedPage,
  SectionHeader,
  StatCard,
  UploadInvoice,
  useWorkspace,
  WorkspaceSwitcher,
} from "@/components/custom";
import { InvoiceVolumeCard, StockDonutChart } from "@/components/charts";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  BoxesIcon,
  ChevronRightIcon,
  DownloadIcon,
  ReceiptTextIcon,
  ShieldAlertIcon,
  WalletIcon,
} from "lucide-react";

const STATS = [
  {
    label: "Invoices this month",
    value: "36",
    hint: "Parsed from supplier PDFs",
    icon: ReceiptTextIcon,
  },
  {
    label: "Items this month",
    value: "36",
    hint: "Added to on-hand stock",
    icon: BoxesIcon,
  },
  {
    label: "Total value",
    value: "36.00 kr",
    hint: "Across this month's receipts",
    icon: WalletIcon,
  },
  {
    label: "Awaiting review",
    value: "3",
    hint: "Flagged lines need a person",
    icon: ShieldAlertIcon,
  },
];

const LATEST_ORDERS = [
  {
    orderId: "2026/181224",
    supplierName: "BAMA Storkjøkken Oslo",
    orderDate: "08.10.2026",
    total: "96.00",
    needsReview: true,
  },
  {
    orderId: "2026/181223",
    supplierName: "BAMA Storkjøkken Oslo",
    orderDate: "08.10.2026",
    total: "48.00",
    needsReview: false,
  },
  {
    orderId: "2026/181222",
    supplierName: "BAMA Storkjøkken Oslo",
    orderDate: "08.10.2026",
    total: "48.00",
    needsReview: true,
  },
  {
    orderId: "2026/181221",
    supplierName: "BAMA Storkjøkken Oslo",
    orderDate: "08.10.2026",
    total: "48.00",
    needsReview: false,
  },
  {
    orderId: "2026/181220",
    supplierName: "BAMA Storkjøkken Oslo",
    orderDate: "08.10.2026",
    total: "48.00",
    needsReview: true,
  },
];

const REVIEW_TASKS = [
  { orderId: "2026/181224", reason: "Low confidence read", date: "08.10.2026" },
  { orderId: "2026/181222", reason: "Unit price mismatch", date: "08.10.2026" },
  { orderId: "2026/181220", reason: "New supplier", date: "08.10.2026" },
];

const HEADER_CELL = "h-10 text-xs font-medium tracking-wide text-muted-foreground uppercase";

const DASH = "—";

/** Render a timestamp as dd.MM.yyyy, matching the dates used across the app. */
function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getFullYear()}`;
}

function formatQuantity(quantity: number | null, unit: string | null) {
  if (quantity === null) return DASH;
  return unit ? `${quantity} ${unit}` : `${quantity}`;
}

/**
 * Preview of the newest line items. Kept as its own component so the query
 * only runs for signed-in users, after the auth check above.
 */
function LatestItemsTable() {
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
          <TableHead className={HEADER_CELL}>Item</TableHead>
          <TableHead className={HEADER_CELL}>Supplier</TableHead>
          <TableHead className={HEADER_CELL}>Received</TableHead>
          <TableHead className={cn(HEADER_CELL, "text-right")}>
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
              {line.supplierName ?? DASH}
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

const Page = () => {
  const user = useQuery(api.auth.getCurrentUser);

  if (user === undefined) {
    return (
      <PageContainer>
        <DashboardSkeleton />
      </PageContainer>
    );
  }

  if (user === null) {
    return (
      <RestrictedPage content="The dashboard" />
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
            <p className="text-sm text-muted-foreground">
              A snapshot of this month&rsquo;s receipts, stock, and open
              reviews.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <WorkspaceSwitcher />
            <Button variant="outline">
              <DownloadIcon />
              Export
            </Button>
            <UploadInvoice label="Upload receipt" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
            <div className="rounded-xl bg-card ring-1 ring-foreground/10">
              <SectionHeader
                title="Stock by category"
                description="Tracked items and receipt cost, grouped by category."
                action={
                  <Link
                    href="/inventory"
                    className="shrink-0 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    View inventory
                  </Link>
                }
              />

              <StockDonutChart />
            </div>

            <InvoiceVolumeCard />

            <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
              <SectionHeader
                title="Latest items"
                description="Stock added most recently from parsed receipts."
                action={
                  <Link
                    href="/inventory"
                    className="shrink-0 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    View all
                  </Link>
                }
              />

              <LatestItemsTable />
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-6">
            <div className="rounded-xl bg-card ring-1 ring-foreground/10">
              <SectionHeader
                title="Needs review"
                description="Flagged by the parser, waiting on a person."
                action={
                  <Link
                    href="/invoices/review"
                    className="shrink-0 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    View all
                  </Link>
                }
              />

              <div className="flex flex-col divide-y divide-border/60">
                {REVIEW_TASKS.map((task) => (
                  <Link
                    key={task.orderId}
                    href="/invoices/review"
                    className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-sm font-medium tabular-nums">
                        {task.orderId}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {task.reason} · {task.date}
                      </span>
                    </div>
                    <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                ))}
              </div>

              <div className="border-t border-border/60 px-5 py-3">
                <Link
                  href="/invoices/review"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "w-full",
                  )}
                >
                  Open review queue
                </Link>
              </div>
            </div>

            <div className="rounded-xl bg-card ring-1 ring-foreground/10">
              <SectionHeader
                title="Latest orders"
                description="Receipts parsed most recently."
                action={
                  <Link
                    href="/invoices"
                    className="shrink-0 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    View all
                  </Link>
                }
              />

              <div className="flex flex-col divide-y divide-border/60">
                {LATEST_ORDERS.map((order) => (
                  <Link
                    key={order.orderId}
                    href="/invoices"
                    className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-sm font-medium tabular-nums">
                        {order.orderId}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {order.supplierName} · {order.orderDate}
                      </span>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-0.5">
                      <span className="text-sm font-medium tabular-nums">
                        {order.total} kr
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            order.needsReview
                              ? "bg-amber-500"
                              : "bg-emerald-500",
                          )}
                        />
                        {order.needsReview ? "Needs review" : "Confirmed"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Page;
