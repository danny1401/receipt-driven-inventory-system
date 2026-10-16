"use client";

import { useState } from "react";
import Link from "next/link";
import { usePreloadedAuthQuery } from "@convex-dev/better-auth/nextjs/client";
import type { Preloaded } from "convex/react";
import type { api } from "@/convex/_generated/api";
import { MenuIcon, ReceiptTextIcon, XIcon } from "lucide-react";
import { cn } from "cn";

import { buttonVariants } from "@/components/ui/button";

export const Header = ({
  preloadedUserQuery,
}: {
  preloadedUserQuery: Preloaded<typeof api.auth.getCurrentUser>;
}) => {
  const user = usePreloadedAuthQuery(preloadedUserQuery);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="flex min-w-0 items-center gap-2.5 font-semibold tracking-tight"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ReceiptTextIcon className="size-5" />
          </span>
          <span className="truncate text-base">
            Receipt-Driven Inventory System
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ size: "lg" }), "px-4")}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/log-in"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "px-4 text-muted-foreground hover:text-foreground",
                )}
              >
                Log in
              </Link>
              <Link
                href="/sign-in"
                className={cn(buttonVariants({ size: "lg" }), "px-4")}
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon-lg" }),
            "md:hidden",
          )}
        >
          {menuOpen ? (
            <XIcon className="size-5" />
          ) : (
            <MenuIcon className="size-5" />
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-border/60 md:hidden">
          <nav className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6">
            <div className="mt-2 flex flex-col gap-2">
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className={buttonVariants({ size: "lg" })}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    onClick={() => setMenuOpen(false)}
                    className={buttonVariants({ variant: "outline", size: "lg" })}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/sign-in"
                    onClick={() => setMenuOpen(false)}
                    className={buttonVariants({ size: "lg" })}
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
