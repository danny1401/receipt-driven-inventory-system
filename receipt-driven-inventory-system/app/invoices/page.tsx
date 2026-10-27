"use client";

import { useState } from "react";

import { useWorkspace } from "@/components/workspace";
import { InvoicesTable, type Invoice } from "@/components/tables/invoices-table";

import { invoices } from "@/data/invoices";
import { AuthGuard, PageContainer, PageHeader } from "@/components/structure";

const Page = () => {
  const [invoice, setInvoice] = useState<Invoice[]>(invoices);
  const { workspace } = useWorkspace();

  return (
    <AuthGuard 
      skeleton={
        <PageContainer>
          <p className="text-sm text-muted-foreground">Loading invoices…</p>
        </PageContainer>
      } 
      restrictedContentName="Invoices"
    >
      <div className="flex flex-col gap-6">
        <PageHeader content="invoices" />

        <InvoicesTable
          key={workspace}
          invoices={invoice}
          setInvoices={setInvoice}
        />
      </div>
    </AuthGuard>
  );
};

export default Page;
