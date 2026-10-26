import Link from "next/link";
import {
  ArrowRightIcon,
  BoxesIcon,
  CompassIcon,
  LayoutDashboardIcon,
  ReceiptTextIcon,
} from "lucide-react";

import { cn } from "cn";
import { PageContainer } from "@/components/custom";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

const QUICK_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/inventory", label: "Inventory", icon: BoxesIcon },
  { href: "/invoices", label: "Invoices", icon: ReceiptTextIcon },
];

export default function NotFound() {
  return (
    <PageContainer className="flex min-h-[calc(100svh-4rem)] items-center">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center py-8 text-center sm:py-12">
        <div
          aria-hidden
          className="flex items-center gap-2 text-7xl font-semibold tracking-tighter select-none sm:gap-3 sm:text-8xl"
        >
          <span>4</span>
          <span className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm sm:size-20">
            <ReceiptTextIcon className="size-8 sm:size-10" />
          </span>
          <span>4</span>
        </div>
        <span className="sr-only">Error 404</span>

        <Badge variant="outline" className="mt-8 gap-1.5 bg-background">
          <CompassIcon />
          Page not found
        </Badge>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          This page got lost in the stockroom.
        </h1>

        <p className="mt-4 max-w-md text-pretty text-muted-foreground">
          The page you’re looking for may have been moved, renamed, or never
          existed. Check the address, or head back to familiar shelves.
        </p>

        <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ size: "lg" }), "h-10 px-5 text-sm")}
          >
            Back to dashboard
            <ArrowRightIcon className="size-4" />
          </Link>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-10 px-5 text-sm",
            )}
          >
            Go to homepage
          </Link>
        </div>

        <div className="mt-12 w-full border-t border-border/60 pt-6">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Popular pages
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {QUICK_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
