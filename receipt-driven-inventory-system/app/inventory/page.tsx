"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import {
  ArrowUpDownIcon,
  DownloadIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  SlidersHorizontalIcon,
} from "lucide-react";

import { api } from "@/convex/_generated/api";
import { PageContainer } from "@/components/page-container";
import { DeleteDialog } from "@/components/delete-dialog";
import { Button } from "@/components/ui/button";
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
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const INVOICES = [
  {
    invoice: "2026/181224",
    supplierName: "BAMA Storkjøkken Oslo",
    customerName: "Osteria De Campo",
    itemName: "Norwegian Salmon Filet",
    quantity: 1,
    quantityUnit: "kg",
    unitPrice: "48.00",
    totalAmount: "48.00",
  },
  {
    invoice: "2026/181225",
    supplierName: "BAMA Storkjøkken Oslo",
    customerName: "Osteria De Campo",
    itemName: "Norwegian Salmon Filet",
    quantity: 1,
    quantityUnit: "kg",
    unitPrice: "48.00",
    totalAmount: "48.00",
  },
  {
    invoice: "2026/181226",
    supplierName: "BAMA Storkjøkken Oslo",
    customerName: "Osteria De Campo",
    itemName: "Norwegian Salmon Filet",
    quantity: 1,
    quantityUnit: "kg",
    unitPrice: "48.00",
    totalAmount: "48.00",
  },
  {
    invoice: "2026/181227",
    supplierName: "BAMA Storkjøkken Oslo",
    customerName: "Osteria De Campo",
    itemName: "Norwegian Salmon Filet",
    quantity: 1,
    quantityUnit: "kg",
    unitPrice: "48.00",
    totalAmount: "48.00",
  },
  {
    invoice: "2026/181228",
    supplierName: "BAMA Storkjøkken Oslo",
    customerName: "Osteria De Campo",
    itemName: "Norwegian Salmon Filet",
    quantity: 1,
    quantityUnit: "kg",
    unitPrice: "48.00",
    totalAmount: "48.00",
  },
  {
    invoice: "2026/181229",
    supplierName: "BAMA Storkjøkken Oslo",
    customerName: "Osteria De Campo",
    itemName: "Norwegian Salmon Filet",
    quantity: 1,
    quantityUnit: "kg",
    unitPrice: "48.00",
    totalAmount: "48.00",
  },
];

type InventoryRow = (typeof INVOICES)[number];

const HEADER_CELL =
  "h-11 text-xs font-medium tracking-wide text-muted-foreground uppercase";

const Page = () => {
  const user = useQuery(api.auth.getCurrentUser);
  const [rows, setRows] = useState<InventoryRow[]>(INVOICES);
  const [deleteTarget, setDeleteTarget] = useState<InventoryRow | null>(null);

  if (user === undefined) {
    return (
      <PageContainer>
        <p className="text-sm text-muted-foreground">Loading inventory…</p>
      </PageContainer>
    );
  }

  if (user === null) {
    return (
      <PageContainer>
        <div className="rounded-xl bg-card px-6 py-16 text-center ring-1 ring-foreground/10">
          <p className="font-medium">You need to sign in</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Inventory is only available to signed-in accounts.
          </p>
        </div>
      </PageContainer>
    );
  }

  const totalAmount = rows
    .reduce((sum, row) => sum + Number(row.totalAmount), 0)
    .toFixed(2);

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">Inventory</h1>
            <p className="text-sm text-muted-foreground">
              Every line item captured from your supplier receipts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline">
              <DownloadIcon />
              Export
            </Button>
            <Button>
              <PlusIcon />
              Add item
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
          <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search invoices, items, suppliers…"
                aria-label="Search inventory"
                className="h-9 pl-8"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="mr-auto text-xs text-muted-foreground">
                {rows.length} items
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
                  <DropdownMenuItem>Category</DropdownMenuItem>
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
                  <DropdownMenuItem>Price (Low to High)</DropdownMenuItem>
                  <DropdownMenuItem>Price (High to Low)</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Date (New to Old)</DropdownMenuItem>
                  <DropdownMenuItem>Date (Old to New)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Table className="[&_td]:px-4 [&_td]:py-3 [&_th]:px-4">
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent">
                <TableHead className={`${HEADER_CELL} w-[132px]`}>
                  Invoice
                </TableHead>
                <TableHead className={HEADER_CELL}>Supplier</TableHead>
                <TableHead className={HEADER_CELL}>Restaurant</TableHead>
                <TableHead className={HEADER_CELL}>Item</TableHead>
                <TableHead className={`${HEADER_CELL} text-right`}>
                  Quantity
                </TableHead>
                <TableHead className={`${HEADER_CELL} text-right`}>
                  Unit price
                </TableHead>
                <TableHead className={`${HEADER_CELL} text-right`}>
                  Amount
                </TableHead>
                <TableHead className={`${HEADER_CELL} w-[52px] text-right`}>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map((invoice) => (
                <TableRow key={invoice.invoice}>
                  <TableCell className="font-medium tabular-nums">
                    {invoice.invoice}
                  </TableCell>
                  <TableCell>{invoice.supplierName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {invoice.customerName}
                  </TableCell>
                  <TableCell className="font-medium">
                    {invoice.itemName}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {invoice.quantity} {invoice.quantityUnit}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {invoice.unitPrice} kr
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {invoice.totalAmount} kr
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <MoreHorizontalIcon />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Move stock</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setDeleteTarget(invoice)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={5}
                  className="text-xs font-normal text-muted-foreground"
                >
                  {rows.length} line items
                </TableCell>
                <TableCell className="text-right text-xs font-normal text-muted-foreground">
                  Total
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {totalAmount} kr
                </TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <DeleteDialog
          open={deleteTarget !== null}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
          title="Delete line item?"
          description={
            deleteTarget
              ? `“${deleteTarget.itemName}” from invoice ${deleteTarget.invoice} will be removed from your inventory. This can't be undone.`
              : ""
          }
          onConfirm={() => {
            if (!deleteTarget) return;
            setRows((current) =>
              current.filter((row) => row.invoice !== deleteTarget.invoice),
            );
          }}
        />
      </div>
    </PageContainer>
  );
};

export default Page;
