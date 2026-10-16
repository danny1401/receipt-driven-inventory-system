import Link from "next/link";
import { ReceiptTextIcon } from "lucide-react";

const FOOTER_LINKS = [
  {
    title: "Product",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/#how-it-works", label: "How it works" },
      { href: "/#faq", label: "FAQ" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/sign-in", label: "Sign in" },
      { href: "/sign-in", label: "Create account" },
    ],
  },
];

export function Footer() {
  return (
    <footer>
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 font-semibold tracking-tight">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ReceiptTextIcon className="size-5" />
              </span>
              Receipt-Driven Inventory
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              AI-powered inventory that keeps itself in sync with your supplier
              receipts.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10">
            {FOOTER_LINKS.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-medium">{column.title}</h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} Receipt-Driven Inventory System. All rights
            reserved.
          </p>
          <p>Built with Next.js, Convex &amp; Gemini AI.</p>
        </div>
      </div>
    </footer>
  );
}
