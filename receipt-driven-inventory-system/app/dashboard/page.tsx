"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { cn } from "cn";
import {
  DashboardSkeleton,
  PageContainer,
  PageHeader,
  RestrictedPage,
  SectionHeader,
  StatCard,
  useWorkspace,
} from "@/components/custom";
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
    return <RestrictedPage content="The dashboard" />;
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader content="dashboard" />

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
