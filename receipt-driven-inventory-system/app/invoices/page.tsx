"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "convex/react";
import { ClipboardListIcon } from "lucide-react";

import { api } from "@/convex/_generated/api";
import {
  PageContainer,
  RestrictedPage,
  UploadInvoice,
  useWorkspace,
  WorkspaceSwitcher,
} from "@/components/custom";
import { InvoicesTable, type Invoice } from "@/components/tables/invoices-table";
import { buttonVariants } from "@/components/ui/button";

import { invoices } from "@/data/invoices";

const Page = () => {
  const user = useQuery(api.auth.getCurrentUser);
  const [invoice, setInvoice] = useState<Invoice[]>(invoices);
  const { workspace } = useWorkspace();

  if (user === undefined) {
    return (
      <PageContainer>
        <p className="text-sm text-muted-foreground">Loading invoices…</p>
      </PageContainer>
    );
  }

  if (user === null) {
    return (
      <RestrictedPage content="Invoices" />
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
            <p className="text-sm text-muted-foreground">
              Supplier receipts, parsed into structured order lines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <WorkspaceSwitcher />
            <Link
              href="/invoices/review"
              className={buttonVariants({ variant: "outline" })}
            >
              <ClipboardListIcon />
              Review queue
            </Link>
            <UploadInvoice label="Upload invoice" />
          </div>
        </div>

        <InvoicesTable
          key={workspace}
          invoices={invoice}
          setInvoices={setInvoice}
        />
      </div>
    </PageContainer>
  );
};

export default Page;
