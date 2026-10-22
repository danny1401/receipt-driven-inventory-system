"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import {
  MoreHorizontalIcon,
  SearchIcon,
} from "lucide-react";

import {
  ALL,
  DeleteDialog,
  FilterSelect,
  Sort,
  TablePagination,
  uniqueValues,
  useTablePagination,
  type SortOption,
} from "@/components/custom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

export type InventoryRow = {
  itemNumber: string;
  supplierName: string;
  customerName: string;
  itemName: string;
  category: string;
  quantity: number;
  quantityUnit: string;
  unitPrice: string;
  totalAmount: string;
};

type InventoryTableProps = {
  commodity: InventoryRow[];
  setCommodity: Dispatch<SetStateAction<InventoryRow[]>>;
};

const HEADER_CELL =
  "h-11 text-xs font-medium tracking-wide text-muted-foreground uppercase";

const PAGE_SIZE = 10;
const COLUMN_COUNT = 8;

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

/**
 * Item numbers are issued in receipt order, so they stand in for the date
 * this table doesn't show yet.
 */
const SORTERS: Record<SortKey, (a: InventoryRow, b: InventoryRow) => number> = {
  "name-asc": (a, b) => a.itemName.localeCompare(b.itemName),
  "name-desc": (a, b) => b.itemName.localeCompare(a.itemName),
  "price-asc": (a, b) => Number(a.unitPrice) - Number(b.unitPrice),
  "price-desc": (a, b) => Number(b.unitPrice) - Number(a.unitPrice),
  "date-asc": (a, b) => a.itemNumber.localeCompare(b.itemNumber),
  "date-desc": (a, b) => b.itemNumber.localeCompare(a.itemNumber),
};

type FilterKey = "category" | "supplier" | "customer";

type Filters = Record<FilterKey, string>;

const EMPTY_FILTERS: Filters = {
  category: ALL,
  supplier: ALL,
  customer: ALL,
};

export function InventoryTable({
  commodity,
  setCommodity,
}: InventoryTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<InventoryRow | null>(null);
  const [sort, setSort] = useState<SortKey>("name-asc");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const filterOptions = {
    category: uniqueValues(commodity, (row) => row.category),
    supplier: uniqueValues(commodity, (row) => row.supplierName),
    customer: uniqueValues(commodity, (row) => row.customerName),
  };

  const filteredCommodity = commodity.filter(
    (row) =>
      (filters.category === ALL || row.category === filters.category) &&
      (filters.supplier === ALL || row.supplierName === filters.supplier) &&
      (filters.customer === ALL || row.customerName === filters.customer),
  );
  const filtersActive = Object.values(filters).some((value) => value !== ALL);

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

  return (
    <>
      <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
        <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:min-w-0 sm:max-w-xs sm:flex-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search invoices, items, suppliers…"
              aria-label="Search inventory"
              className="h-9 pl-8"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-auto text-xs text-muted-foreground">
              {filtersActive
                ? `${filteredCommodity.length} of ${commodity.length} items`
                : `${commodity.length} items`}
            </span>

            <FilterSelect
              label="Category"
              value={filters.category}
              options={filterOptions.category}
              onChange={(value) => changeFilter("category", value)}
            />

            <FilterSelect
              label="Supplier"
              value={filters.supplier}
              options={filterOptions.supplier}
              onChange={(value) => changeFilter("supplier", value)}
            />

            <FilterSelect
              label="Customer"
              value={filters.customer}
              options={filterOptions.customer}
              onChange={(value) => changeFilter("customer", value)}
            />

            <Sort
              value={sort}
              onValueChange={changeSort}
              options={SORT_OPTIONS}
            />
          </div>
        </div>

        <Table className="[&_td]:px-4 [&_td]:py-3 [&_th]:px-4">
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className={`${HEADER_CELL} w-[132px]`}>
                Item ID
              </TableHead>
              <TableHead className={HEADER_CELL}>Item</TableHead>
              <TableHead className={HEADER_CELL}>Category</TableHead>
              <TableHead className={HEADER_CELL}>Supplier</TableHead>
              <TableHead className={`${HEADER_CELL} text-right`}>
                Quantity
              </TableHead>
              <TableHead className={`${HEADER_CELL} text-right`}>
                Unit price
              </TableHead>
              <TableHead className={`${HEADER_CELL} text-right`}>
                Amount
              </TableHead>
              <TableHead className={`${HEADER_CELL} w-[52px]`} />
            </TableRow>
          </TableHeader>

          <TableBody>
            {visibleRows.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={COLUMN_COUNT}>
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No items match these filters.
                  </p>
                </TableCell>
              </TableRow>
            )}

            {visibleRows.map((item) => (
              <TableRow key={item.itemNumber}>
                <TableCell className="font-medium tabular-nums">
                  {item.itemNumber}
                </TableCell>
                <TableCell className="font-medium">{item.itemName}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.supplierName}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {item.quantity} {item.quantityUnit}
                </TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {item.unitPrice} kr
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {item.totalAmount} kr
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon" className="size-8">
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
                        onClick={() => setDeleteTarget(item)}
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
              <TableCell colSpan={COLUMN_COUNT} className="px-4 py-3">
                <TablePagination
                  page={page}
                  pageCount={pageCount}
                  onPageChange={goToPage}
                  summary={
                    <>
                      Showing {firstRow}–{lastRow} of{" "}
                      {filteredCommodity.length} items
                    </>
                  }
                  className="font-normal"
                />
              </TableCell>
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
            ? `“${deleteTarget.itemName}” from invoice ${deleteTarget.itemNumber} will be removed from your inventory. This can't be undone.`
            : ""
        }
        onConfirm={() => {
          if (!deleteTarget) return;
          setCommodity((current) =>
            current.filter(
              (commodity) => commodity.itemNumber !== deleteTarget.itemNumber,
            ),
          );
        }}
      />
    </>
  );
}
