import Link from "next/link";
import { cn } from "cn";
import { ArrowRightIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="border-b border-border/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12 sm:py-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Ready to stop retyping receipts?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-primary-foreground/70">
            Sign in with Google, upload a supplier PDF, and watch it become live
            inventory in seconds.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 bg-background px-6 text-sm text-foreground hover:bg-background/90",
              )}
            >
              Get started free
              <ArrowRightIcon className="size-4" />
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 border-primary-foreground/25 bg-transparent px-6 text-sm text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
              )}
            >
              Open the dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
