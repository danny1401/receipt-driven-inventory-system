"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "convex/react";
import {
  ArrowUpDownIcon,
  ChevronDownIcon,
  ClipboardListIcon,
  FileTextIcon,
  MoreHorizontalIcon,
  SearchIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import { cn } from "cn";

import { api } from "@/convex/_generated/api";
import { PageContainer } from "@/components/page-container";
import { DeleteDialog } from "@/components/delete-dialog";
import { UploadReceipt } from "@/components/upload-receipt";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const INVOICES = [
  {
    orderId: "2026/181224",
    supplierName: "BAMA Storkjøkken Oslo",
    customerName: "Osteria De Campo",
    orderDate: "08.10.2026",
    orderItems: [
      {
        itemNumber: 4,
        itemName: "Norwegian Salmon Filet",
        quantity: 1,
        quantityUnit: "kg",
        unitPrice: "48.00",
        totalAmount: "48.00",
      },
      {
        itemNumber: 10,
        itemName: "Norwegian Salmon Filet",
        quantity: 1,
        quantityUnit: "kg",
        unitPrice: "48.00",
        totalAmount: "48.00",
      },
    ],
    fileName: "file.pdf",
  },
  {
    orderId: "2026/181223",
    supplierName: "BAMA Storkjøkken Oslo",
    customerName: "Osteria De Campo",
    orderDate: "08.10.2026",
    orderItems: [
      {
        itemNumber: 0,
        itemName: "Norwegian Salmon Filet",
        quantity: 1,
        quantityUnit: "kg",
        unitPrice: "48.00",
        totalAmount: "48.00",
      },
    ],
    fileName: "file.pdf",
  },
  {
    orderId: "2026/181222",
    supplierName: "BAMA Storkjøkken Oslo",
    customerName: "Osteria De Campo",
    orderDate: "08.10.2026",
    orderItems: [
      {
        itemNumber: 1,
        itemName: "Norwegian Salmon Filet",
        quantity: 1,
        quantityUnit: "kg",
        unitPrice: "48.00",
        totalAmount: "48.00",
      },
    ],
    fileName: "file.pdf",
  },
  {
    orderId: "2026/181221",
    supplierName: "BAMA Storkjøkken Oslo",
    customerName: "Osteria De Campo",
    orderDate: "08.10.2026",
    orderItems: [
      {
        itemNumber: 2,
        itemName: "Norwegian Salmon Filet",
        quantity: 1,
        quantityUnit: "kg",
        unitPrice: "48.00",
        totalAmount: "48.00",
      },
    ],
    fileName: "file.pdf",
  },
  {
    orderId: "2026/181220",
    supplierName: "BAMA Storkjøkken Oslo",
    customerName: "Osteria De Campo",
    orderDate: "08.10.2026",
    orderItems: [
      {
        itemNumber: 3,
        itemName: "Norwegian Salmon Filet",
        quantity: 1,
        quantityUnit: "kg",
        unitPrice: "48.00",
        totalAmount: "48.00",
      },
    ],
    fileName: "file.pdf",
  },
  {
    orderId: "2026/181225",
    supplierName: "BAMA Storkjøkken Oslo",
    customerName: "Osteria De Campo",
    orderDate: "01.10.2026",
    orderItems: [
      {
        itemNumber: 4,
        itemName: "Norwegian Salmon Filet",
        quantity: 1,
        quantityUnit: "kg",
        unitPrice: "48.00",
        totalAmount: "48.00",
      },
    ],
    fileName: "file.pdf",
  },
];

/** Columns shared by the list header and every order row, so they line up. */
const ROW_GRID =
  "grid grid-cols-[8.5rem_minmax(0,1fr)_minmax(0,1fr)_6.5rem_2rem] items-center gap-4";

/** Columns shared by the line-item header and every line-item row. */
const ITEM_GRID =
  "grid grid-cols-[2.5rem_minmax(0,1fr)_5.5rem_6.5rem_7.5rem_2rem] items-center gap-4";

const HEADER_CELL =
  "text-xs font-medium tracking-wide text-muted-foreground uppercase";

type Order = (typeof INVOICES)[number];

/** Identifies a line item within an order, for the delete confirmation. */
type DeleteTarget = {
  orderId: string;
  itemNumber: number;
  itemName: string;
};

function orderTotal(invoice: Order) {
  return invoice.orderItems
    .reduce((sum, item) => sum + Number(item.totalAmount), 0)
    .toFixed(2);
}

const Page = () => {
  const user = useQuery(api.auth.getCurrentUser);
  const [orders, setOrders] = useState<Order[]>(INVOICES);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  if (user === undefined) {
    return (
      <PageContainer>
        <p className="text-sm text-muted-foreground">Loading invoices…</p>
      </PageContainer>
    );
  }

  if (user === null) {
    return (
      <PageContainer>
        <div className="rounded-xl bg-card px-6 py-16 text-center ring-1 ring-foreground/10">
          <p className="font-medium">You need to sign in</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Invoices are only available to signed-in accounts.
          </p>
        </div>
      </PageContainer>
    );
  }

  const lineItemCount = orders.reduce(
    (sum, order) => sum + order.orderItems.length,
    0,
  );

  const grandTotal = orders
    .reduce((sum, order) => sum + Number(orderTotal(order)), 0)
    .toFixed(2);

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
            <p className="text-sm text-muted-foreground">
              Supplier receipts, parsed into structured order lines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/invoices/review"
              className={buttonVariants({ variant: "outline" })}
            >
              <ClipboardListIcon />
              Review queue
            </Link>
            <UploadReceipt label="Upload invoice" />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
          <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders, suppliers…"
                aria-label="Search invoices"
                className="h-9 pl-8"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="mr-auto text-xs text-muted-foreground">
                {orders.length} orders
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="outline">
                      <SlidersHorizontalIcon />
                      Filter
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuItem>Date</DropdownMenuItem>
                  <DropdownMenuItem>Supplier</DropdownMenuItem>
                  <DropdownMenuItem>Restaurant</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="outline">
                      <ArrowUpDownIcon />
                      Sort
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuItem>Name (A to Z)</DropdownMenuItem>
                  <DropdownMenuItem>Name (Z to A)</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Date (New to Old)</DropdownMenuItem>
                  <DropdownMenuItem>Date (Old to New)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[40rem]">
              <div
                className={cn(
                  ROW_GRID,
                  HEADER_CELL,
                  "border-b border-border/60 bg-muted/40 px-4 py-2.5",
                )}
              >
                <span>Invoice</span>
                <span>Supplier</span>
                <span>Restaurant</span>
                <span>Total items</span>
                <span>Order date</span>
                <span aria-hidden />
              </div>

              <div className="divide-y divide-border/60">
                {orders.map((invoice) => (
                  <Collapsible
                    key={invoice.orderId}
                    className="data-open:bg-muted/40"
                  >
                    <CollapsibleTrigger
                      render={
                        <Button
                          variant="ghost"
                          className={cn(
                            ROW_GRID,
                            "group/button h-auto w-full rounded-none border-0 px-4 py-3.5 text-left",
                          )}
                        >
                          <span className="font-medium tabular-nums">
                            {invoice.orderId}
                          </span>
                          <span className="truncate">
                            {invoice.supplierName}
                          </span>
                          <span className="truncate text-muted-foreground">
                            {invoice.customerName}
                          </span>
                          <span className="truncate tabular-nums">
                            {invoice.orderItems.length}
                          </span>
                          <span className="text-muted-foreground tabular-nums">
                            {invoice.orderDate}
                          </span>
                          <ChevronDownIcon className="size-4 justify-self-end text-muted-foreground transition-transform group-data-panel-open/button:rotate-180" />
                        </Button>
                      }
                    />

                    <CollapsibleContent className="border-t border-border/60 bg-muted/30">
                      <div className="flex items-center justify-between gap-4 px-4 pt-3 pb-2">
                        <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                          <FileTextIcon className="size-3.5 shrink-0" />
                          <span className="truncate">{invoice.fileName}</span>
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {invoice.orderItems.length} line{" "}
                          {invoice.orderItems.length === 1 ? "item" : "items"}
                        </span>
                      </div>

                      <div
                        className={cn(
                          ITEM_GRID,
                          "px-4 pb-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase",
                        )}
                      >
                        <span>#</span>
                        <span>Item</span>
                        <span className="text-right">Qty</span>
                        <span className="text-right">Unit price</span>
                        <span className="text-right">Amount</span>
                        <span aria-hidden />
                      </div>

                      <div className="divide-y divide-border/60">
                        {invoice.orderItems.map((item) => (
                          <div
                            key={item.itemNumber}
                            className={cn(ITEM_GRID, "px-4 py-2.5 text-sm")}
                          >
                            <span className="text-xs text-muted-foreground tabular-nums">
                              {item.itemNumber}
                            </span>
                            <span className="truncate font-medium">
                              {item.itemName}
                            </span>
                            <span className="text-right tabular-nums">
                              {item.quantity} {item.quantityUnit}
                            </span>
                            <span className="text-right text-muted-foreground tabular-nums">
                              {item.unitPrice} kr
                            </span>
                            <span className="text-right font-medium tabular-nums">
                              {item.totalAmount} kr
                            </span>
                            <div className="justify-self-end">
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  render={
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="size-8"
                                    >
                                      <MoreHorizontalIcon />
                                      <span className="sr-only">
                                        Open menu
                                      </span>
                                    </Button>
                                  }
                                />
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                  <DropdownMenuItem>
                                    View details
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() =>
                                      setDeleteTarget({
                                        orderId: invoice.orderId,
                                        itemNumber: item.itemNumber,
                                        itemName: item.itemName,
                                      })
                                    }
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-end gap-2 border-t border-border/60 px-4 py-2.5 text-xs text-muted-foreground">
                        Order total
                        <span className="text-sm font-semibold text-foreground tabular-nums">
                          {orderTotal(invoice)} kr
                        </span>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-border/60 bg-muted/40 px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              {orders.length} orders · {lineItemCount} line items
            </span>
            <span className="flex items-center gap-2">
              Total
              <span className="text-sm font-semibold text-foreground tabular-nums">
                {grandTotal} kr
              </span>
            </span>
          </div>
        </div>

        <DeleteDialog
          open={deleteTarget !== null}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
          title="Delete line item?"
          description={
            deleteTarget
              ? `“${deleteTarget.itemName}” will be removed from order ${deleteTarget.orderId}. This can't be undone.`
              : ""
          }
          onConfirm={() => {
            if (!deleteTarget) return;

            setOrders((current) =>
              current
                .map((order) =>
                  order.orderId === deleteTarget.orderId
                    ? {
                        ...order,
                        orderItems: order.orderItems.filter(
                          (item) => item.itemNumber !== deleteTarget.itemNumber,
                        ),
                      }
                    : order,
                )
                .filter((order) => order.orderItems.length > 0),
            );
          }}
        />
      </div>
    </PageContainer>
  );
};

export default Page;
