"use client";

import { cn } from "cn";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";

/** Sentinel for “no filter” in every filter menu. */
export const ALL = "all";

/** Distinct values of one column, alphabetised, for a filter menu. */
export function uniqueValues<T>(rows: T[], pick: (row: T) => string) {
  return [...new Set(rows.map(pick))].sort((a, b) => a.localeCompare(b));
}

type FilterSelectProps = {
  /** Field name shown on the trigger and as the menu heading. */
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  /** Label for the reset entry at the top of the menu. */
  allLabel?: string;
  /** Stretches the trigger to fill its container, e.g. inside a filter sheet. */
  fullWidth?: boolean;
  /** Extra classes for the dropdown panel. */
  contentClassName?: string;
};

export function FilterSelect({
  label,
  value,
  options,
  onChange,
  allLabel = "All",
  fullWidth = false,
  contentClassName,
}: FilterSelectProps) {
  const triggerLabel = value === ALL ? label : `${label}: ${value}`;

  return (
    <div className={cn("space-y-1.5", fullWidth && "w-full")}>
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <Select value={value} onValueChange={(next) => onChange(next as string)}>
        <SelectTrigger
          className={fullWidth ? "w-full" : undefined}
          render={
            <Button
              variant="outline"
              aria-label={triggerLabel}
              className={fullWidth ? "w-full max-w-none" : "max-w-48"}
            >
              <span className="min-w-0 truncate">{triggerLabel}</span>
            </Button>
          }
        />
        <SelectContent align="end" className={cn("w-52", contentClassName)}>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            <SelectItem value={ALL}>{allLabel}</SelectItem>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
