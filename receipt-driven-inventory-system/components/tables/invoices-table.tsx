"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import {
  ChevronDownIcon,
  ExternalLinkIcon,
  FileTextIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { cn } from "cn";

import { useWorkspace } from "@/components/workspace";
import {
  FilterSelect,
  SearchInput,
  Sort,
  uniqueValues,
  type SortOption,
} from "@/components/custom";

import { DatePicker, DeleteDialog, FilterSheet } from "@/components/dialog";
import { TablePagination, useTablePagination } from "@/components/tables";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ALL } from "../util/functions";

export type Invoice = {
  orderId: string;
  supplierName: string;
  customerName: string;
  orderDate: string;
  orderItems: {
    itemNumber: number;
    itemName: string;
    quantity: number;
    quantityUnit: string;
    unitPrice: string;
    totalAmount: string;
  }[];
  fileName: string;
  /** Public/storage URL of the uploaded receipt. */
  fileUrl?: string;
};

type DeleteTarget = {
  orderId: string;
  itemNumber: number;
  itemName: string;
};

type InvoicesTableProps = {
  invoices: Invoice[];
  setInvoices: Dispatch<SetStateAction<Invoice[]>>;
};

const ROW_GRID =
  "grid grid-cols-[6rem_minmax(0,1.25fr)_minmax(0,1fr)_5.5rem_6.5rem_2rem] items-center gap-3";

const ITEM_GRID =
  "grid grid-cols-[2.5rem_minmax(0,1fr)_4.5rem_5.5rem_6.5rem_2rem] items-center gap-3";

const HEADER_CELL =
  "text-xs font-medium tracking-wide text-muted-foreground uppercase";

const PAGE_SIZE = 10;

type SortKey = "name-asc" | "name-desc" | "date-desc" | "date-asc";

const SORT_OPTIONS: SortOption<SortKey>[] = [
  { value: "name-asc", label: "Name (A to Z)" },
  { value: "name-desc", label: "Name (Z to A)" },
  { value: "date-desc", label: "Date (New to Old)", dividerBefore: true },
  { value: "date-asc", label: "Date (Old to New)" },
];

/** “08.10.2026” → 20261008, so dates compare as plain numbers. */
function dateValue(date: string) {
  const [day, month, year] = date.split(".");
  return Number(`${year}${month}${day}`);
}

/** A picked calendar day → 20261008, matching `dateValue`. */
function dateKey(date: Date) {
  return (
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  );
}

const SORTERS: Record<SortKey, (a: Invoice, b: Invoice) => number> = {
  "name-asc": (a, b) => a.supplierName.localeCompare(b.supplierName),
  "name-desc": (a, b) => b.supplierName.localeCompare(a.supplierName),
  "date-desc": (a, b) => dateValue(b.orderDate) - dateValue(a.orderDate),
  "date-asc": (a, b) => dateValue(a.orderDate) - dateValue(b.orderDate),
};

type FilterKey = "supplier";

type Filters = Record<FilterKey, string>;

const EMPTY_FILTERS: Filters = {
  supplier: ALL,
};

function orderTotal(invoice: Invoice) {
  return invoice.orderItems
    .reduce((sum, item) => sum + Number(item.totalAmount), 0)
    .toFixed(2);
}

export function InvoicesTable({ invoices, setInvoices }: InvoicesTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [sort, setSort] = useState<SortKey>("name-asc");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const { workspace } = useWorkspace();

  const scopedInvoices =
    workspace === ALL
      ? invoices
      : invoices.filter((invoice) => invoice.customerName === workspace);

  const filterOptions = {
    supplier: uniqueValues(scopedInvoices, (invoice) => invoice.supplierName),
  };

  const filteredInvoices = scopedInvoices.filter(
    (invoice) =>
      (filters.supplier === ALL || invoice.supplierName === filters.supplier) &&
      (!date || dateValue(invoice.orderDate) === dateKey(date)),
  );
  const activeFilterCount = (filters.supplier === ALL ? 0 : 1) + (date ? 1 : 0);
  const filtersActive = activeFilterCount > 0;

  const sortedInvoices = [...filteredInvoices].sort(SORTERS[sort]);
  const { page, pageCount, visibleRows, firstRow, lastRow, goToPage } =
    useTablePagination(sortedInvoices, PAGE_SIZE);

  const changeSort = (next: SortKey) => {
    setSort(next);
    goToPage(1);
  };

  const changeFilter = (key: FilterKey, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
    goToPage(1);
  };

  const changeDate = (next: Date | undefined) => {
    setDate(next);
    goToPage(1);
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setDate(undefined);
    goToPage(1);
  };

  const lineItemCount = filteredInvoices.reduce(
    (sum, invoice) => sum + invoice.orderItems.length,
    0,
  );
  const grandTotal = filteredInvoices
    .reduce((sum, invoice) => sum + Number(orderTotal(invoice)), 0)
    .toFixed(2);

  return (
    <>
      <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
        <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput />

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-auto text-xs text-muted-foreground">
              {filtersActive
                ? `${filteredInvoices.length} of ${scopedInvoices.length} invoices`
                : `${scopedInvoices.length} invoices`}
            </span>

            <FilterSheet
              activeCount={activeFilterCount}
              onClear={clearFilters}
              description="Filter the invoices by supplier or date, and choose a sort order."
            >
              <FilterSelect
                label="Supplier"
                value={filters.supplier}
                options={filterOptions.supplier}
                onChange={(value) => changeFilter("supplier", value)}
                fullWidth
                contentClassName="w-(--anchor-width)"
              />

              <DatePicker
                date={date}
                onDateChange={changeDate}
                placeholder="Invoice date"
                clearable
                className="w-full"
              />

              <Sort
                value={sort}
                onValueChange={changeSort}
                options={SORT_OPTIONS}
                className="w-full justify-start"
              />
            </FilterSheet>
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
              <span>Invoice date</span>
              <span aria-hidden />
            </div>

            <div className="divide-y divide-border/60">
              {visibleRows.length === 0 && (
                <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                  {scopedInvoices.length === 0
                    ? workspace === ALL
                      ? "No invoices yet. Upload an invoice to get started."
                      : `No invoices in ${workspace} yet.`
                    : "No invoices match these filters."}
                </div>
              )}

              {visibleRows.map((invoice) => (
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
                        <span className="truncate">{invoice.supplierName}</span>
                        <span className="truncate text-muted-foreground">
                          {invoice.customerName}
                        </span>
                        <span className="truncate tabular-nums">
                          {invoice.orderItems.length}
                        </span>
                        <span className="text-muted-foreground tabular-nums">
                          {invoice.orderDate}
                        </span>
                        <span className="flex h-5 w-8 items-center justify-center justify-self-end">
                          <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-data-panel-open/button:rotate-180" />
                        </span>
                      </Button>
                    }
                  />

                  <CollapsibleContent className="border-t border-border/60 bg-muted/30">
                    <div
                      className={cn(
                        ITEM_GRID,
                        "px-4 pt-2.5 pb-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase",
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
                                    <span className="sr-only">Open menu</span>
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

                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border/60 px-4 py-2.5 text-xs text-muted-foreground">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <a
                          href={
                            invoice.fileUrl ??
                            `/${encodeURIComponent(invoice.fileName)}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-w-0 items-center gap-1.5 underline-offset-4 hover:text-foreground hover:underline"
                        >
                          <FileTextIcon className="size-3.5 shrink-0" />
                          <span className="truncate">{invoice.fileName}</span>
                          <ExternalLinkIcon className="size-3 shrink-0" />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>

                        <span
                          aria-hidden
                          className="h-3 w-px shrink-0 bg-border"
                        />

                        <span className="shrink-0 whitespace-nowrap">
                          {invoice.orderItems.length} line{" "}
                          {invoice.orderItems.length === 1 ? "item" : "items"}
                        </span>
                      </div>

                      <span className="flex shrink-0 items-center gap-2">
                        Invoice total
                        <span className="text-sm font-semibold text-foreground tabular-nums">
                          {orderTotal(invoice)} kr
                        </span>
                      </span>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border/60 bg-muted/40 px-4 py-3">
          <TablePagination
            page={page}
            pageCount={pageCount}
            onPageChange={goToPage}
            summary={
              <>
                Showing {firstRow}–{lastRow} of {filteredInvoices.length}{" "}
                {filteredInvoices.length === 1 ? "invoice" : "invoices"}
                <span aria-hidden className="mx-1.5">
                  ·
                </span>
                {lineItemCount} line {lineItemCount === 1 ? "item" : "items"}
                <span aria-hidden className="mx-1.5">
                  ·
                </span>
                <span className="font-medium text-foreground">
                  {grandTotal} kr
                </span>
              </>
            }
          />
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
            ? `“${deleteTarget.itemName}” will be removed from invoice ${deleteTarget.orderId}. This can't be undone.`
            : ""
        }
        onConfirm={() => {
          if (!deleteTarget) return;

          setInvoices((current) =>
            current
              .map((invoice) =>
                invoice.orderId === deleteTarget.orderId
                  ? {
                      ...invoice,
                      orderItems: invoice.orderItems.filter(
                        (item) => item.itemNumber !== deleteTarget.itemNumber,
                      ),
                    }
                  : invoice,
              )
              .filter((invoice) => invoice.orderItems.length > 0),
          );
        }}
      />
    </>
  );
}
