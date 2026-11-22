"use client";

import Link from "next/link";

import { cn } from "cn";
import { SectionHeader, StatCard } from "@/components/custom";
import { InvoiceVolumeCard, StockDonutChart } from "@/components/charts";
import { buttonVariants } from "@/components/ui/button";

import {
  BoxesIcon,
  ChevronRightIcon,
  ReceiptTextIcon,
  ShieldAlertIcon,
  WalletIcon,
} from "lucide-react";
import { LatestItemsTable } from "@/components/tables/dashboard-latest-table";
import { PageHeader } from "@/components/structure";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useWorkspace } from "@/components/workspace";
import { useMonth } from "@/components/month";
import { ALL, monthStartTimestamp } from "@/components/util/functions";
import { useMemo } from "react";

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

const moneyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const countFormatter = new Intl.NumberFormat("en-US");

const Page = () => {
  const { workspace } = useWorkspace();
  const { month } = useMonth();

  const orderDate = useMemo(() => monthStartTimestamp(month), [month]);

  // Stats are always scoped to one workspace, so `all` skips the queries.
  const statsArgs = useMemo(
    () =>
      workspace === ALL
        ? ("skip" as const)
        : { customerName: workspace, orderDate },
    [workspace, orderDate],
  );

  const totalInvoices = useQuery(
    api.inventory.inventory.totalInvoices,
    statsArgs,
  );
  const totalItems = useQuery(api.inventory.inventory.totalItems, statsArgs);
  const totalCosts = useQuery(api.inventory.inventory.totalCosts, statsArgs);
  const totalFlags = useQuery(
    api.inventory.inventory.totalFlaggedInvoices,
    statsArgs,
  );

  const scopeHint =
    workspace === ALL
      ? "Choose a workspace to see this month"
      : `Across ${workspace} this month`;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader content="dashboard" />

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total invoices"
          value={
            totalInvoices === undefined
              ? "—"
              : countFormatter.format(totalInvoices)
          }
          hint={scopeHint}
          icon={ReceiptTextIcon}
        />
        <StatCard
          label="Total items"
          value={
            totalItems === undefined ? "—" : countFormatter.format(totalItems)
          }
          hint="Added to on-hand stock"
          icon={BoxesIcon}
        />
        <StatCard
          label="Total value"
          value={
            totalCosts === undefined
              ? "—"
              : `${moneyFormatter.format(totalCosts)} kr`
          }
          hint="Across this month's receipts"
          icon={WalletIcon}
        />
        <StatCard
          label="Awaiting review"
          value={
            totalFlags === undefined ? "—" : countFormatter.format(totalFlags)
          }
          hint="Flagged invoices need a person"
          icon={ShieldAlertIcon}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
          {/* Stock Donut Chart */}
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

          {/* Invoices Received */}
          <InvoiceVolumeCard />

          {/* Latest Items Table */}
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
                          order.needsReview ? "bg-amber-500" : "bg-emerald-500",
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
  );
};

export default Page;
