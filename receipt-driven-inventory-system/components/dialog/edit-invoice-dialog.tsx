import { InvoiceListItem } from "@/data/invoices";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { InvoiceEditValues } from "../tables/invoice-list";
import { Button } from "../ui/button";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { FormEvent, useState } from "react";

function EditInvoiceForm({
  invoice,
  onSave,
}: {
  invoice: InvoiceListItem | null;
  onSave: (values: InvoiceEditValues) => void;
}) {
  const [orderId, setOrderId] = useState(invoice?.orderId ?? "");
  const [supplierName, setSupplierName] = useState(invoice?.supplierName ?? "");
  const [orderDate, setOrderDate] = useState(invoice?.orderDate ?? "");

  const canSave =
    orderId.trim() !== "" &&
    supplierName.trim() !== "" &&
    orderDate.trim() !== "";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSave) return;

    onSave({
      orderId: orderId.trim(),
      supplierName: supplierName.trim(),
      orderDate: orderDate.trim(),
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit invoice</DialogTitle>
        <DialogDescription>
          Update the invoice reference and supplier details. The parsed item
          lines are left untouched.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor="invoice-order-id">Order ID</FieldLabel>
            <Input
              id="invoice-order-id"
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              placeholder="2026/181224"
              autoComplete="off"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="invoice-supplier">Supplier</FieldLabel>
            <Input
              id="invoice-supplier"
              value={supplierName}
              onChange={(event) => setSupplierName(event.target.value)}
              placeholder="BAMA Storkjøkken Oslo"
              autoComplete="off"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="invoice-order-date">Order date</FieldLabel>
            <Input
              id="invoice-order-date"
              value={orderDate}
              onChange={(event) => setOrderDate(event.target.value)}
              placeholder="08.10.2026"
              autoComplete="off"
              required
            />
          </Field>
        </FieldGroup>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Cancel
          </DialogClose>
          <Button type="submit" disabled={!canSave}>
            Save changes
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

export function EditInvoiceDialog({
  invoice,
  open,
  onOpenChange,
  onSave,
}: {
  invoice: InvoiceListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: InvoiceEditValues) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <EditInvoiceForm
          key={invoice?.orderId ?? "empty"}
          invoice={invoice}
          onSave={(values) => {
            onSave(values);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}