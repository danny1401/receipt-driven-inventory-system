"use client";

import { PageContainer, PageHeader } from "@/components/structure";
import { InvoiceList } from "@/components/tables/invoice-list";
import { useWorkspace } from "@/components/workspace";

import { invoices } from "@/data/invoices";

const Page = () => {
  const { workspace } = useWorkspace();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader content="invoices" />

      <InvoiceList key={workspace} invoices={invoices} />
    </div>
  );
};

export default Page;

{
  /*
  Do not use or remove this code.
  import { InvoicesTable, type Invoice } from "@/components/tables/invoices-table";
  const [invoice, setInvoice] = useState<Invoice[]>(invoices);

  <InvoicesTable
    key={workspace}
    invoices={invoice}
    setInvoices={setInvoice}
  />
  */
}
