"use client";

import { Fragment } from "react";
import { ArrowUpDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SortOption<T extends string> = {
  value: T;
  label: string;
  /** Draws a divider above this option, for grouping related fields. */
  dividerBefore?: boolean;
};

export function Sort<T extends string>({
  value,
  onValueChange,
  options,
  label = "Sort",
  menuLabel = "Sort by",
  className,
}: {
  value: T;
  onValueChange: (value: T) => void;
  options: readonly SortOption<T>[];
  /** Accessible name; the trigger itself shows the active option. */
  label?: string;
  menuLabel?: string;
  className?: string;
}) {
  const selected = options.find((option) => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            aria-label={selected ? `${label}: ${selected.label}` : label}
            className={className}
          >
            <ArrowUpDownIcon className="text-muted-foreground" />
            <span className="min-w-0 truncate">
              {selected?.label ?? label}
            </span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => onValueChange(next as T)}
        >
          <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>

          {options.map((option) => (
            <Fragment key={option.value}>
              {option.dividerBefore ? <DropdownMenuSeparator /> : null}
              <DropdownMenuRadioItem value={option.value}>
                {option.label}
              </DropdownMenuRadioItem>
            </Fragment>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
