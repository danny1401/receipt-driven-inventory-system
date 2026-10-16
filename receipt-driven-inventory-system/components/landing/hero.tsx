import Link from "next/link";
import { cn } from "cn";
import {
  ArrowRightIcon,
  BoxesIcon,
  CheckIcon,
  FileTextIcon,
  SparklesIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

const HERO_POINTS = [
  "PDF supplier invoices",
  "Line-item extraction",
  "Built-in review queue",
];

const RECEIPT_LINES = [
  { name: "Roma Tomatoes", quantity: "24 case", total: "$28.80" },
  { name: "Fresh Mozzarella", quantity: "12 kg", total: "$102.00" },
  { name: "Extra Virgin Olive Oil", quantity: "6 btl", total: "$84.00" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-muted/30">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:py-28">
        <div className="flex flex-col items-start gap-6">
          <Badge variant="outline" className="gap-1.5 bg-background">
            <SparklesIcon />
            AI-powered receipt parsing
          </Badge>

          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Turn every supplier receipt into live inventory
          </h1>

          <p className="max-w-xl text-lg text-pretty text-muted-foreground">
            Upload a PDF invoice and the AI extracts the supplier, order, and
            every line item — then keeps your stock counts and costs current.
            No spreadsheets, no manual entry.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 px-6 text-sm",
              )}
            >
              Get started free
              <ArrowRightIcon className="size-4" />
            </Link>
            <Link
              href="#how-it-works"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 px-6 text-sm",
              )}
            >
              See how it works
            </Link>
          </div>

          <ul className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-6">
            {HERO_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2">
                <CheckIcon className="size-4 text-foreground" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Parsed receipt mock */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            aria-hidden
            className="absolute -inset-4 -z-10 rounded-[2rem] bg-background ring-1 ring-border/50"
          />

          <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border/60 bg-muted/50 px-4 py-3">
              <span className="size-2.5 rounded-full bg-foreground/15" />
              <span className="size-2.5 rounded-full bg-foreground/15" />
              <span className="size-2.5 rounded-full bg-foreground/15" />
              <span className="ml-2 flex min-w-0 items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <FileTextIcon className="size-3.5 shrink-0" />
                <span className="truncate">INV-2048-northwind.pdf</span>
              </span>
              <Badge variant="secondary" className="ml-auto">
                Parsed
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 px-4 py-4 text-xs">
              <div>
                <p className="text-muted-foreground">Supplier</p>
                <p className="mt-0.5 font-medium">Northwind Produce</p>
              </div>
              <div>
                <p className="text-muted-foreground">Deliver to</p>
                <p className="mt-0.5 font-medium">Bistro 21 · Kitchen</p>
              </div>
            </div>

            <div className="border-t border-border/60 px-4 py-3">
              <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                <span>Item</span>
                <span className="text-right">Qty</span>
                <span className="w-16 text-right">Total</span>
              </div>
              <div className="mt-1 flex flex-col divide-y divide-border/60">
                {RECEIPT_LINES.map((line) => (
                  <div
                    key={line.name}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 py-2 text-sm"
                  >
                    <span className="truncate font-medium">{line.name}</span>
                    <span className="text-right text-muted-foreground tabular-nums">
                      {line.quantity}
                    </span>
                    <span className="w-16 text-right tabular-nums">
                      {line.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border/60 bg-muted/40 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Order total</span>
              <span className="font-semibold tabular-nums">$214.80</span>
            </div>
          </div>

          <div className="absolute -top-3 right-2 hidden items-center gap-2 rounded-lg border border-border/70 bg-background px-3 py-2 text-xs font-medium shadow-sm sm:flex">
            <SparklesIcon className="size-4" />
            12 items extracted
          </div>
          <div className="absolute -bottom-3 -left-2 hidden items-center gap-2 rounded-lg border border-border/70 bg-background px-3 py-2 text-xs font-medium shadow-sm sm:flex">
            <BoxesIcon className="size-4" />
            Inventory updated
          </div>
        </div>
      </div>
    </section>
  );
}
