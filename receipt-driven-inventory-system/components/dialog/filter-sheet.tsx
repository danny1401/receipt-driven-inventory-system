"use client";

import type { ReactNode } from "react";
import { CheckIcon, SlidersHorizontalIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type FilterSheetProps = {
  /** Number of filters currently applied, shown on the trigger. */
  activeCount: number;
  /** Resets every filter owned by the sheet. */
  onClear: () => void;
  /** Applied filters shown as removable chips beside the trigger. */
  activeFilters?: Array<{ key: string; label: string }>;
  /** Clears one chip and resets its control to the "all" option. */
  onRemoveFilter?: (key: string) => void;
  /** Copy shown under the sheet title. */
  description?: string;
  children: ReactNode;
};

/**
 * A slide-over panel for table filters. Filters apply immediately, so the
 * sheet only needs a way to clear everything and a close action.
 */
export function FilterSheet({
  activeCount,
  onClear,
  activeFilters = [],
  onRemoveFilter,
  description = "Narrow the list with the filters below.",
  children,
}: FilterSheetProps) {
  return (
    <Sheet>
      <div className="flex flex-wrap items-center gap-1.5">
        {activeFilters.map((filter) => (
          <Button
            variant="outline"
            key={filter.key}
            type="button"
            onClick={() => onRemoveFilter?.(filter.key)}
            aria-label={`Remove ${filter.label} filter`}
            title={`Remove ${filter.label} filter`}
            className="group text-xs font-medium transition-colors outline-none"
          >
            <span className="max-w-40 truncate group-hover:text-muted-foreground group-hover:line-through">
              {filter.label}
            </span>
            <XIcon className="size-3 shrink-0 text-muted-foreground group-hover:text-foreground" />
          </Button>
        ))}

        <SheetTrigger
          render={
            <Button
              variant="outline"
              aria-label={
                activeCount > 0 ? `Filters, ${activeCount} active` : "Filters"
              }
            >
              <SlidersHorizontalIcon />
              Filters
              {activeCount > 0 && (
                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground tabular-nums">
                  {activeCount}
                </span>
              )}
            </Button>
          }
        />
      </div>

      <SheetContent>
        <SheetHeader className="pr-12">
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4">
          {children}
        </div>

        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClear}
            disabled={activeCount === 0}
          >
            Clear filters
          </Button>
          <SheetClose render={<Button type="button" />}>Done</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
