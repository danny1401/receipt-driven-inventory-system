"use client";

import {
  CalendarIcon,
  CheckIcon,
  ChevronsUpDownIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ALL, formatMonthLabel } from "./util/functions";
import { useMonth } from "./month";

/**
 * Month switcher styled like the workspace picker. The selection is shared
 * across pages and scopes invoice queries to a single month.
 */
export function MonthSwitcher() {
  const { month, months, setMonth } = useMonth();
  const currentLabel =
    month === ALL ? "All months" : formatMonthLabel(month);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            className="max-w-56 justify-start"
            aria-label={`Switch month (current: ${currentLabel})`}
          >
            <CalendarIcon className="text-muted-foreground" />
            <span className="min-w-0 truncate" title={currentLabel}>
              {currentLabel}
            </span>
            <ChevronsUpDownIcon className="text-muted-foreground" />
          </Button>
        }
      />

      <DropdownMenuContent align="start" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Months</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setMonth(ALL)}>
            <span className="flex-1 truncate">All months</span>
            {month === ALL && <CheckIcon />}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {months === undefined && (
            <DropdownMenuItem disabled>
              <span className="text-muted-foreground">Loading months…</span>
            </DropdownMenuItem>
          )}

          {months?.length === 0 && (
            <DropdownMenuItem disabled>
              <span className="text-muted-foreground">No invoices yet</span>
            </DropdownMenuItem>
          )}

          {months?.map((value) => {
            const label = formatMonthLabel(value);

            return (
              <DropdownMenuItem
                key={value}
                onClick={() => setMonth(value)}
              >
                <span className="flex-1 truncate" title={label}>
                  {label}
                </span>
                {month === value && <CheckIcon />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
