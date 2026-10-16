import { BoxesIcon, CheckIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const VALUE_POINTS = [
  {
    title: "No more manual entry",
    description:
      "Receipts are parsed on arrival, so stock counts update without anyone typing them in.",
  },
  {
    title: "Catch problems early",
    description:
      "Unusual prices, missing items, and unmatched suppliers are flagged before they reach your books.",
  },
  {
    title: "One searchable source of truth",
    description:
      "Every item, order, and supplier is stored with the original PDF one click away.",
  },
];

const INVENTORY_ROWS = [
  { name: "Roma Tomatoes", onHand: "48 case", value: "$57.60" },
  { name: "Fresh Mozzarella", onHand: "30 kg", value: "$255.00" },
  { name: "Extra Virgin Olive Oil", onHand: "18 btl", value: "$252.00" },
  { name: "Basil, fresh", onHand: "9 kg", value: "$63.00" },
];

export function Value() {
  return (
    <section className="border-b border-border/60">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="flex flex-col items-start gap-6">
          <Badge variant="outline">Why it matters</Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Stop retyping invoices into a spreadsheet
          </h2>
          <p className="text-pretty text-muted-foreground">
            Manual data entry is slow and quietly wrong. Every number on a
            receipt becomes a record you can search, trust, and audit.
          </p>
          <ul className="flex flex-col gap-5">
            {VALUE_POINTS.map((point) => (
              <li key={point.title} className="flex gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                  <CheckIcon className="size-3" />
                </span>
                <div>
                  <p className="font-medium">{point.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {point.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Inventory mock */}
        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 bg-muted/50 px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-medium">
                <BoxesIcon className="size-4 text-muted-foreground" />
                On-hand inventory
              </span>
              <Badge variant="secondary">Live</Badge>
            </div>

            <div className="px-4 py-3">
              <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                <span>Item</span>
                <span className="text-right">On hand</span>
                <span className="w-16 text-right">Value</span>
              </div>
              <div className="mt-1 flex flex-col divide-y divide-border/60">
                {INVENTORY_ROWS.map((row) => (
                  <div
                    key={row.name}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 py-2.5 text-sm"
                  >
                    <span className="truncate font-medium">{row.name}</span>
                    <span className="text-right text-muted-foreground tabular-nums">
                      {row.onHand}
                    </span>
                    <span className="w-16 text-right tabular-nums">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border/60 bg-muted/40 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Inventory value</span>
              <span className="font-semibold tabular-nums">$627.60</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
