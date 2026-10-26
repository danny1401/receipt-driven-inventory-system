"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  ALL,
  DeleteDialog,
  FilterSelect,
  FilterSheet,
  SearchInput,
  Sort,
  TablePagination,
  uniqueValues,
  useTablePagination,
  useWorkspace,
  type SortOption,
} from "@/components/custom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InventoryToolbar, InventoryRowActions } from "@/components/tables";

/** One line item, flattened with the names the table displays. */
export type InventoryRow = {
  id: Id<"lineItems">;
  supplierName: string;
  itemName: string;
  category: string;
  quantity: number | null;
  quantityUnit: string | null;
  unitPrice: number | null;
  totalAmount: number | null;
  invoiceNumber: string | null;
  createdAt: number;
};

const HEADER_CELL =
  "h-11 text-xs font-medium tracking-wide text-muted-foreground uppercase";

const PAGE_SIZE = 10;
const COLUMN_COUNT = 6;
const DASH = "—";

type SortKey =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "date-desc"
  | "date-asc";

const SORT_OPTIONS: SortOption<SortKey>[] = [
  { value: "name-asc", label: "Name (A to Z)" },
  { value: "name-desc", label: "Name (Z to A)" },
  { value: "price-asc", label: "Price (Low to High)", dividerBefore: true },
  { value: "price-desc", label: "Price (High to Low)" },
  { value: "date-desc", label: "Date (New to Old)", dividerBefore: true },
  { value: "date-asc", label: "Date (Old to New)" },
];

const SORTERS: Record<SortKey, (a: InventoryRow, b: InventoryRow) => number> = {
  "name-asc": (a, b) => a.itemName.localeCompare(b.itemName),
  "name-desc": (a, b) => b.itemName.localeCompare(a.itemName),
  "price-asc": (a, b) => (a.unitPrice ?? 0) - (b.unitPrice ?? 0),
  "price-desc": (a, b) => (b.unitPrice ?? 0) - (a.unitPrice ?? 0),
  "date-asc": (a, b) => a.createdAt - b.createdAt,
  "date-desc": (a, b) => b.createdAt - a.createdAt,
};

type FilterKey = "category" | "supplier";

type Filters = Record<FilterKey, string>;

const EMPTY_FILTERS: Filters = {
  category: ALL,
  supplier: ALL,
};

function formatQuantity(row: InventoryRow) {
  if (row.quantity === null) return DASH;
  return row.quantityUnit
    ? `${row.quantity} ${row.quantityUnit}`
    : `${row.quantity}`;
}

function formatMoney(value: number | null) {
  return value === null ? DASH : `${value.toFixed(2)} kr`;
}

export function InventoryTable() {
  const [deleteTarget, setDeleteTarget] = useState<InventoryRow | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>("name-asc");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [search, setSearch] = useState("");
  const { workspace } = useWorkspace();

  // Pass both workspace and search term to the Convex query
  const inventoryArgs = useMemo(
    () => ({
      ...(workspace === ALL ? {} : { customerName: workspace }),
      ...(search.trim() ? { searchTerm: search.trim() } : {}),
    }),
    [workspace, search],
  );
  const inventory = useQuery(
    api.inventory.inventory.listInventory,
    inventoryArgs,
  );
  const deleteLineItem = useMutation(api.inventory.item.deleteLineItem);
  const isLoading = inventory === undefined;

  // `listInventory` returns the joined documents; flatten them into table rows.
  const commodity = useMemo(
    () =>
      (inventory ?? []).map<InventoryRow>((line) => ({
        id: line._id,
        supplierName: line.supplierName ?? DASH,
        itemName: line.item?.itemName ?? "Unknown item",
        category: line.item?.category ?? DASH,
        quantity: line.quantity,
        quantityUnit: line.quantityUnit,
        unitPrice: line.unitPrice,
        totalAmount: line.total,
        invoiceNumber: line.invoiceNumber,
        createdAt: line._creationTime,
      })),
    [inventory],
  );

  const filterOptions = {
    category: uniqueValues(commodity, (row) => row.category),
    supplier: uniqueValues(commodity, (row) => row.supplierName),
  };

  const searchActive = search.length > 0;

  // Since the backend query already filters by search term, only apply category/supplier filters here
  const filteredCommodity = commodity.filter(
    (row) =>
      (filters.category === ALL || row.category === filters.category) &&
      (filters.supplier === ALL || row.supplierName === filters.supplier),
  );

  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== ALL,
  ).length;
  const filtersActive = activeFilterCount > 0;
  const isNarrowed = filtersActive || searchActive;

  const sortedCommodity = [...filteredCommodity].sort(SORTERS[sort]);
  const { page, pageCount, visibleRows, firstRow, lastRow, goToPage } =
    useTablePagination(sortedCommodity, PAGE_SIZE);

  const changeSort = (next: SortKey) => {
    setSort(next);
    goToPage(1);
  };

  const changeFilter = (key: FilterKey, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
    goToPage(1);
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    goToPage(1);
  };

  const changeSearch = (value: string) => {
    setSearch(value);
    goToPage(1);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 flex flex-col min-h-0 rounded-xl bg-card ring-1 ring-foreground/10 overflow-hidden">
        <InventoryToolbar
          search={search}
          onSearchChange={changeSearch}
          isLoading={isLoading}
          isNarrowed={isNarrowed}
          filteredCount={filteredCommodity.length}
          totalCount={commodity.length}
          activeFilterCount={activeFilterCount}
          onClearFilters={clearFilters}
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={changeFilter}
          sort={sort}
          onSortChange={changeSort}
          sortOptions={SORT_OPTIONS}
        />

        <div className="flex-1 overflow-auto min-h-0 flex flex-col">
          {!isLoading && visibleRows.length === 0 ? (
            /* When empty, render a flex div that fills the space and centers text automatically */
            <div className="flex-1 flex items-center justify-center p-8">
              <p className="text-center text-sm text-muted-foreground max-w-sm whitespace-break-spaces leading-relaxed">
                {commodity.length === 0
                  ? workspace === ALL
                    ? "No items added. \nAdd an item or upload a receipt to get started."
                    : `No items in ${workspace} yet. \n Add an item or upload a receipt to get started.`
                  : searchActive
                    ? filtersActive
                      ? "No items match your search and filters."
                      : "No items match your search."
                    : "No items match these filters."}
              </p>
            </div>
          ) : (
            /* Otherwise, render the normal table */
            <Table className="w-full [&_td]:px-4 [&_td]:py-3 [&_th]:px-4">
              <TableHeader className="bg-muted/40 sticky top-0 z-10">
                <TableRow className="hover:bg-transparent">
                  <TableHead className={HEADER_CELL}>Item</TableHead>
                  <TableHead className={HEADER_CELL}>Category</TableHead>
                  <TableHead className={HEADER_CELL}>Supplier</TableHead>
                  <TableHead className={`${HEADER_CELL} text-right`}>
                    Quantity
                  </TableHead>
                  <TableHead className={`${HEADER_CELL} text-right`}>
                    Amount
                  </TableHead>
                  <TableHead className={`${HEADER_CELL} w-[52px]`} />
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading &&
                  Array.from({ length: PAGE_SIZE }, (_, index) => (
                    <TableRow key={index} className="hover:bg-transparent">
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="ml-auto h-4 w-14" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="ml-auto h-4 w-12" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="ml-auto size-8 rounded-md" />
                      </TableCell>
                    </TableRow>
                  ))}

                {!isLoading &&
                  visibleRows.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.itemName}
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.supplierName}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatQuantity(item)}
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {formatMoney(item.totalAmount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <InventoryRowActions
                          item={item}
                          onDeleteRequest={(target) => {
                            setDeleteTarget(target);
                            setDeleteOpen(true);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* 5. Pagination Footer pinned cleanly to the bottom of the card */}
        <div className="border-t border-border bg-card shrink-0">
          <Table>
            <TableFooter className="bg-transparent">
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={COLUMN_COUNT} className="px-4 py-3">
                  <TablePagination
                    page={page}
                    pageCount={pageCount}
                    onPageChange={goToPage}
                    summary={
                      isLoading ? (
                        "Loading items…"
                      ) : (
                        <>
                          Showing {firstRow}–{lastRow} of{" "}
                          {filteredCommodity.length} items
                        </>
                      )
                    }
                    className="font-normal"
                  />
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete line item?"
        description={
          deleteTarget
            ? `“${deleteTarget.itemName}” will be removed from your inventory. This can't be undone.`
            : ""
        }
        onConfirm={() => {
          if (!deleteTarget) return;
          void deleteLineItem({ itemId: deleteTarget.id });
        }}
      />
    </div>
  );
}
