"use client";

import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { useQuery } from "convex/react";
import {
  BoxesIcon,
  ChevronRightIcon,
  DownloadIcon,
  ReceiptTextIcon,
  ShieldAlertIcon,
  WalletIcon,
} from "lucide-react";
import { cn } from "cn";

import { api } from "@/convex/_generated/api";
import { PageContainer } from "@/components/page-container";
import { UploadReceipt } from "@/components/upload-receipt";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

const STOCK_LEVELS = [
  { category: "Produce", units: 420 },
  { category: "Dairy & eggs", units: 310 },
  { category: "Meat & poultry", units: 285 },
  { category: "Dry goods", units: 180 },
  { category: "Beverages", units: 145 },
];

const TOTAL_UNITS = STOCK_LEVELS.reduce((sum, level) => sum + level.units, 0);
const MAX_UNITS = Math.max(...STOCK_LEVELS.map((level) => level.units));

const LATEST_ITEMS = [
  {
    itemName: "Norwegian Salmon Filet",
    category: "Meat & poultry",
    supplierName: "BAMA Storkjøkken Oslo",
    received: "08.10.2026",
    quantity: "72 kg",
  },
  {
    itemName: "Roma Tomatoes",
    category: "Produce",
    supplierName: "BAMA Storkjøkken Oslo",
    received: "08.10.2026",
    quantity: "48 case",
  },
  {
    itemName: "Fresh Mozzarella",
    category: "Dairy & eggs",
    supplierName: "BAMA Storkjøkken Oslo",
    received: "07.10.2026",
    quantity: "36 kg",
  },
  {
    itemName: "Extra Virgin Olive Oil",
    category: "Dry goods",
    supplierName: "BAMA Storkjøkken Oslo",
    received: "07.10.2026",
    quantity: "24 btl",
  },
  {
    itemName: "Chicken Breast",
    category: "Meat & poultry",
    supplierName: "BAMA Storkjøkken Oslo",
    received: "06.10.2026",
    quantity: "40 kg",
  },
  {
    itemName: "Sparkling Water",
    category: "Beverages",
    supplierName: "BAMA Storkjøkken Oslo",
    received: "06.10.2026",
    quantity: "12 case",
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

const HEADER_CELL =
  "h-10 text-xs font-medium tracking-wide text-muted-foreground uppercase";

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: ReactNode;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight tabular-nums">
            {value}
          </p>
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground ring-1 ring-border/60">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 px-5 py-4">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-sm font-medium">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

const Page = () => {
  const user = useQuery(api.auth.getCurrentUser);

  if (user === undefined) {
    return (
      <PageContainer>
        <p className="text-sm text-muted-foreground">Loading overview…</p>
      </PageContainer>
    );
  }

  if (user === null) {
    return (
      <PageContainer>
        <div className="rounded-xl bg-card px-6 py-16 text-center ring-1 ring-foreground/10">
          <p className="font-medium">You need to sign in</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The overview is only available to signed-in accounts.
          </p>
        </div>
      </PageContainer>
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
            <Button variant="outline">
              <DownloadIcon />
              Export
            </Button>
            <UploadReceipt label="Upload receipt" />
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
                title="Stock levels by category"
                description="On-hand units across your tracked items."
                action={
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                    {TOTAL_UNITS} units
                  </span>
                }
              />

              <div className="flex flex-col gap-4 px-5 py-5">
                {STOCK_LEVELS.map((level) => (
                  <div key={level.category} className="flex flex-col gap-1.5">
                    <div className="flex items-baseline justify-between gap-4 text-sm">
                      <span className="font-medium">{level.category}</span>
                      <span className="text-muted-foreground tabular-nums">
                        {level.units}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-[width]"
                        style={{
                          width: `${(level.units / MAX_UNITS) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

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

              <Table className="[&_td]:px-5 [&_td]:py-3 [&_th]:px-5">
                <TableHeader className="bg-muted/40">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className={HEADER_CELL}>Item</TableHead>
                    <TableHead className={HEADER_CELL}>Category</TableHead>
                    <TableHead className={HEADER_CELL}>Supplier</TableHead>
                    <TableHead className={HEADER_CELL}>Received</TableHead>
                    <TableHead className={cn(HEADER_CELL, "text-right")}>
                      Quantity
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {LATEST_ITEMS.map((item) => (
                    <TableRow key={item.itemName}>
                      <TableCell className="font-medium">
                        {item.itemName}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-muted-foreground"
                        >
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.supplierName}
                      </TableCell>
                      <TableCell className="text-muted-foreground tabular-nums">
                        {item.received}
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {item.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
