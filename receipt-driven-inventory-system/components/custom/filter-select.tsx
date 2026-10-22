"use client";

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
};

export function FilterSelect({
  label,
  value,
  options,
  onChange,
  allLabel = "All",
}: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as string)}>
      <SelectTrigger
        render={
          <Button variant="outline" className="max-w-48">
            <span className="min-w-0 truncate">
              {value === ALL ? label : `${label}: ${value}`}
            </span>
          </Button>
        }
      />
      <SelectContent align="end" className="w-52">
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
  );
}
