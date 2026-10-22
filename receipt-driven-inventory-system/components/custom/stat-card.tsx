
import type { ComponentType, ReactNode } from "react";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: ReactNode;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight tabular-nums">
            {value}
          </p>
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground ring-1 ring-border/60">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}