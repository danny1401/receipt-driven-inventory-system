"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerProps = {
  /** Controlled value; omit `onDateChange` to let the picker own its state. */
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  /** Shows a Clear action inside the popover. */
  clearable?: boolean;
  dateFormat?: string;
  className?: string;
};

export function DatePicker({
  date: controlledDate,
  onDateChange,
  placeholder = "Pick a date",
  clearable = false,
  dateFormat = "dd.MM.yyyy",
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [uncontrolledDate, setUncontrolledDate] = React.useState<Date>();

  const isControlled = onDateChange !== undefined;
  const date = isControlled ? controlledDate : uncontrolledDate;
  const setDate = onDateChange ?? setUncontrolledDate;

  const selectDate = (next: Date | undefined) => {
    setDate(next);
    if (next) setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            data-empty={!date}
            className={cn(
              "justify-start text-left font-normal data-[empty=true]:text-muted-foreground",
              className,
            )}
          />
        }
      >
        <CalendarIcon />
        {date ? format(date, dateFormat) : <span>{placeholder}</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto">
        <Calendar
          mode="single"
          selected={date}
          onSelect={selectDate}
          autoFocus
        />
        {clearable && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            disabled={!date}
            onClick={() => {
              setDate(undefined);
              setOpen(false);
            }}
          >
            Clear
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
