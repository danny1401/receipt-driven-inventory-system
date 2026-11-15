import { useState } from "react";
import { SectionHeader } from "../custom";
import { DeleteDialog } from "../dialog";
import { Badge } from "../ui/badge";
import { EditInvoiceDialog } from "../dialog/edit-invoice-dialog";

import { InvoiceListItem, InvoiceStatus } from "@/data/invoices";
import { InvoiceRow } from "./invoice-row";

export type InvoiceEditValues = Pick<InvoiceListItem, "orderId" | "supplierName" | "orderDate">;

export function InvoiceList({
  invoices: initialInvoices,
}: {
  invoices: InvoiceListItem[];
}) {
  const [invoiceList, setInvoiceList] = useState(initialInvoices);
  const [editTarget, setEditTarget] = useState<InvoiceListItem | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<InvoiceListItem | null>(
    null,
  );
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleSave = (values: InvoiceEditValues) => {
    if (!editTarget) return;

    setInvoiceList((current) =>
      current.map((invoice) =>
        invoice.orderId === editTarget.orderId
          ? { ...invoice, ...values }
          : invoice,
      ),
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    setInvoiceList((current) =>
      current.filter((invoice) => invoice.orderId !== deleteTarget.orderId),
    );
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
        <SectionHeader
          title="Invoices"
          description="Parsed receipts, their source, and the items added to inventory."
          action={
            <Badge variant="secondary">
              {invoiceList.length}{" "}
              {invoiceList.length === 1 ? "invoice" : "invoices"}
            </Badge>
          }
        />

        {invoiceList.length > 0 ? (
          <div className="flex flex-col divide-y divide-border/60">
            {invoiceList.map((invoice) => (
              <InvoiceRow
                key={invoice.orderId}
                invoice={invoice}
                onEditRequest={() => {
                  setEditTarget(invoice);
                  setEditOpen(true);
                }}
                onDeleteRequest={() => {
                  setDeleteTarget(invoice);
                  setDeleteOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="px-5 py-12 text-center text-sm text-muted-foreground">
            No invoices to show.
          </div>
        )}
      </div>

      <EditInvoiceDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        invoice={editTarget}
        onSave={handleSave}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete invoice?"
        description={
          deleteTarget
            ? `“${deleteTarget.orderId}” from ${deleteTarget.supplierName} will be removed from this list.`
            : ""
        }
        onConfirm={handleDelete}
      />
    </>
  );
}
