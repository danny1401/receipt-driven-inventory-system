import {
  FilterSelect,
  FilterSheet,
  SearchInput,
  Sort,
} from "@/components/custom";

type InventoryToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
  isNarrowed: boolean;
  filteredCount: number;
  totalCount: number;
  activeFilterCount: number;
  onClearFilters: () => void;
  filters: { category: string; supplier: string };
  filterOptions: { category: string[]; supplier: string[] };
  onFilterChange: (key: "category" | "supplier", value: string) => void;
  sort: string;
  onSortChange: (next: any) => void;
  sortOptions: any[];
  children?: React.ReactNode;
};

export function InventoryToolbar({
  search,
  onSearchChange,
  isLoading,
  isNarrowed,
  filteredCount,
  totalCount,
  activeFilterCount,
  onClearFilters,
  filters,
  filterOptions,
  onFilterChange,
  sort,
  onSortChange,
  sortOptions,
}: InventoryToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
      <SearchInput value={search} onValueChange={onSearchChange} />
      <span className="mr-auto text-xs text-muted-foreground">
        {isLoading
          ? "Loading items…"
          : isNarrowed
            ? `${filteredCount} items`
            : `${totalCount} items`}
      </span>

      <div className="flex flex-wrap items-center gap-2">
        <FilterSheet
          activeCount={activeFilterCount}
          onClear={onClearFilters}
          description="Filter the inventory by category or supplier, and choose a sort order."
        >
          <Sort
            value={sort}
            onValueChange={onSortChange}
            options={sortOptions}
            className="w-full justify-start"
          />

          <FilterSelect
            label="Category"
            value={filters.category}
            options={filterOptions.category}
            onChange={(value) => onFilterChange("category", value)}
            fullWidth
            contentClassName="w-(--anchor-width)"
          />

          <FilterSelect
            label="Supplier"
            value={filters.supplier}
            options={filterOptions.supplier}
            onChange={(value) => onFilterChange("supplier", value)}
            fullWidth
            contentClassName="w-(--anchor-width)"
          />
        </FilterSheet>
      </div>
    </div>
  );
}
