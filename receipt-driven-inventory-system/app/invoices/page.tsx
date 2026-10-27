"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { useWorkspace } from "@/components/workspace";
import {
  RestrictedPage,
} from "@/components/custom";
import { InvoicesTable, type Invoice } from "@/components/tables/invoices-table";

import { invoices } from "@/data/invoices";
import { PageContainer, PageHeader } from "@/components/structure";

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
        <PageHeader content="invoices" />

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
