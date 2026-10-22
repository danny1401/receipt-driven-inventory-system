"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { usePreloadedAuthQuery } from "@convex-dev/better-auth/nextjs/client";
import type { Preloaded } from "convex/react";
import type { api } from "@/convex/_generated/api";

import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { MenuIcon, ReceiptTextIcon, XIcon } from "lucide-react";

import { UserAvatar } from "./user-avatar";

const navigationAddresses = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/inventory", label: "Inventory" },
  { href: "/invoices", label: "Invoices" },
];

export const Header = ({
  preloadedUserQuery,
}: {
  preloadedUserQuery: Preloaded<typeof api.auth.getCurrentUser>;
}) => {
  const user = usePreloadedAuthQuery(preloadedUserQuery);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {user ? (
          <Link
            href="/dashboard"
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
        ) : (
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
        )}

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              // Map through main links to avoid repetitive code
              navigationAddresses.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      buttonVariants({
                        variant: isActive ? "default" : "ghost",
                        size: "lg",
                      }),
                      "px-4",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })
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

          {user ? (
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              aria-label="Profile"
              title="Profile"
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-full transition-shadow focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                pathname === "/profile"
                  ? "ring-2 ring-foreground/60"
                  : "ring-1 ring-foreground/10 hover:ring-foreground/30",
              )}
            >
              <UserAvatar
                name={user.name}
                email={user.email}
                imageUrl={user.pictureUrl}
              />
            </Link>
          ) : null}

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
      </div>

      {menuOpen && (
        <div className="border-t border-border/60 md:hidden">
          <nav className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6">
            <div className="mt-2 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className={buttonVariants({
                      variant: "outline",
                      size: "lg",
                    })}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/inventory"
                    onClick={() => setMenuOpen(false)}
                    className={buttonVariants({
                      variant: "outline",
                      size: "lg",
                    })}
                  >
                    Inventory
                  </Link>
                  <Link
                    href="/invoices"
                    onClick={() => setMenuOpen(false)}
                    className={buttonVariants({
                      variant: "outline",
                      size: "lg",
                    })}
                  >
                    Invoices
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className={buttonVariants({
                      variant: "outline",
                      size: "lg",
                    })}
                  >
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    onClick={() => setMenuOpen(false)}
                    className={buttonVariants({
                      variant: "outline",
                      size: "lg",
                    })}
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
