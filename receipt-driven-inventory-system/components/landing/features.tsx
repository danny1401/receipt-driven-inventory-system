import {
  BoxesIcon,
  Building2Icon,
  ClipboardListIcon,
  ScanLineIcon,
  SearchIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { SectionHeading } from "@/components/landing/section-heading";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FEATURES = [
  {
    icon: ScanLineIcon,
    title: "AI receipt parsing",
    description:
      "Upload a PDF and the model pulls out the supplier, order header, and every product line in seconds — no templates to maintain.",
  },
  {
    icon: ClipboardListIcon,
    title: "Line-level accuracy",
    description:
      "Item names, quantities, units, unit prices, and totals are captured exactly as they appear on the receipt.",
  },
  {
    icon: Building2Icon,
    title: "Supplier & customer matching",
    description:
      "Every receipt is tied to the right supplier organization and restaurant automatically, across your whole network.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Anomaly review queue",
    description:
      "Low-confidence reads and mismatches are flagged so a person confirms them before anything changes.",
  },
  {
    icon: BoxesIcon,
    title: "Live inventory ledger",
    description:
      "Parsed order items roll straight into on-hand counts and cost totals the moment they are confirmed.",
  },
  {
    icon: SearchIcon,
    title: "Search everything",
    description:
      "Find any item, order, or supplier in milliseconds — records are indexed and queryable in real time.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-16 border-b border-border/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to run inventory from receipts"
          description="Receipts are the source of truth. We turn them into structured, searchable data — and flag the moments that need a human."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="h-full">
              <CardHeader>
                <span className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted text-foreground ring-1 ring-border/60">
                  <feature.icon className="size-5" />
                </span>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
