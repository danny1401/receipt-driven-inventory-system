import { SearchIcon } from "lucide-react";
import { cn } from "cn";

import { Input } from "../ui/input";

type SearchInputProps = {
  /** Controlled value. Omit to let the input manage its own value. */
  value?: string;
  /** Called whenever the user changes the search text. */
  onValueChange?: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
};

export function SearchInput({
  value,
  onValueChange,
  placeholder = "Search invoices, items, suppliers…",
  ariaLabel = "Search inventory",
  className,
}: SearchInputProps) {
  return (
    <div
      className={cn(
        "relative w-full sm:min-w-0 sm:max-w-xs sm:flex-1",
        className,
      )}
    >
      <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="h-9 pl-8"
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
      />
    </div>
  );
}
