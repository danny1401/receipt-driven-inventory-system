import type * as React from "react";
import { Footer } from "@/components/custom";

import { cn } from "cn";

/**
 * Shared horizontal + vertical padding for app pages.
 *
 * The root layout only provides the vertical shell (header / main / footer), so
 * pages that are not full-bleed sections use this to line up with the marketing
 * pages, which each centre their own content at `max-w-6xl`.
 */
export function PageContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <>
      <div
        className={cn(
          "mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8",
          className,
        )}
        {...props}
      />
      <Footer />
    </>
  );
}
