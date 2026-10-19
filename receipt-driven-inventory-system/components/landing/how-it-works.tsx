import { BoxesIcon, ShieldCheckIcon, SparklesIcon, UploadIcon } from "lucide-react";

import { SectionHeading } from "@/components/landing";

const STEPS = [
  {
    step: "01",
    icon: UploadIcon,
    title: "Upload the receipt",
    description:
      "Drop in a supplier PDF. It is stored securely and queued for parsing.",
  },
  {
    step: "02",
    icon: SparklesIcon,
    title: "AI reads every line",
    description:
      "The model extracts the order header and each line item, validated against your schema.",
  },
  {
    step: "03",
    icon: ShieldCheckIcon,
    title: "Review what is flagged",
    description:
      "Anything uncertain is held for a quick human confirmation before it counts.",
  },
  {
    step: "04",
    icon: BoxesIcon,
    title: "Inventory updates itself",
    description:
      "Confirmed items flow into live stock counts, costs, and reporting.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-16 border-b border-border/60 bg-muted/30"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="From a PDF to accurate stock in four steps"
          description="Parsing, validation, and review happen in one flow — so nothing reaches your inventory until it is trustworthy."
        />

        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <li
              key={step.title}
              className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-6"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-foreground">
                  <step.icon className="size-5" />
                </span>
                <span className="font-medium text-muted-foreground tabular-nums">
                  {step.step}
                </span>
              </div>
              <div>
                <h3 className="font-medium">{step.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
