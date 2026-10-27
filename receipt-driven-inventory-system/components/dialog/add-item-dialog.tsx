"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { LoaderCircleIcon, PlusIcon } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { ALL } from "../util/functions";
import { useWorkspace } from "@/components/workspace";

type FormValues = {
  itemName: string;
  sku: string;
  category: string;
  supplierName: string;
  customerName: string;
  quantity: string;
  quantityUnit: string;
  unitPrice: string;
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

const EMPTY_FORM: FormValues = {
  itemName: "",
  sku: "",
  category: "",
  supplierName: "",
  customerName: "",
  quantity: "",
  quantityUnit: "",
  unitPrice: "",
};

/** Pull the readable part out of Convex's wrapped server error. */
function describeError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const serverError = message.split("Server Error").pop()?.trim();

  return (
    serverError?.replace(/^Uncaught Error:\s*/i, "") ||
    "Couldn't add the item. Please try again."
  );
}

interface AddItemDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddItemDialog({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: AddItemDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [form, setForm] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const { workspace } = useWorkspace();

  const isOpen = externalOpen ?? internalOpen;
  const setIsOpen = externalOnOpenChange ?? setInternalOpen;

  const options = useQuery(api.inventory.helpers.getItemFormOptions);
  const ensureSupplier = useMutation(api.inventory.helpers.ensureSupplier);
  const ensureCustomer = useMutation(api.inventory.helpers.ensureCustomer);
  const addItem = useMutation(api.inventory.item.addItem);

  /**
   * Every open starts from a blank form, except that the active workspace
   * prefills the customer so new items land where the user is looking.
   */
  const resetForm = () => {
    setForm({
      ...EMPTY_FORM,
      customerName: workspace === ALL ? "" : workspace,
    });
    setErrors({});
    setFormError(null);
  };

  const quantity = Number(form.quantity);
  const unitPrice = Number(form.unitPrice);
  const hasNumbers =
    form.quantity.trim() !== "" &&
    form.unitPrice.trim() !== "" &&
    Number.isFinite(quantity) &&
    Number.isFinite(unitPrice);
  const total = hasNumbers ? Math.round(quantity * unitPrice * 100) / 100 : 0;

  const update =
    (field: keyof FormValues) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setForm((current) => ({ ...current, [field]: value }));

      // Clear this field's error as soon as the user edits it.
      setErrors((current) => {
        if (!current[field]) return current;
        const next = { ...current };
        delete next[field];
        return next;
      });
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    const values = {
      itemName: form.itemName.trim(),
      sku: form.sku.trim(),
      category: form.category.trim(),
      supplierName: form.supplierName.trim(),
      customerName: form.customerName.trim(),
      quantityUnit: form.quantityUnit.trim(),
    };

    const nextErrors: FieldErrors = {};
    if (!values.itemName) nextErrors.itemName = "Enter the item name.";
    if (!values.category) nextErrors.category = "Enter a category.";
    if (!values.supplierName) nextErrors.supplierName = "Enter a supplier.";
    if (!values.customerName) nextErrors.customerName = "Enter a customer.";
    if (!values.quantityUnit)
      nextErrors.quantityUnit = "Enter a unit, e.g. kg.";
    if (
      form.quantity.trim() === "" ||
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      nextErrors.quantity = "Enter a quantity above 0.";
    }
    if (
      form.unitPrice.trim() === "" ||
      !Number.isFinite(unitPrice) ||
      unitPrice < 0
    ) {
      nextErrors.unitPrice = "Enter a price of 0 or more.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);
    setFormError(null);

    try {
      // `addItem` needs existing supplier/customer rows, so resolve both names
      // (creating them on first use) before writing the line item.
      const [supplierId, customerId] = await Promise.all([
        ensureSupplier({ supplierName: values.supplierName }),
        ensureCustomer({ customerName: values.customerName }),
      ]);

      await addItem({
        sku: values.sku || null,
        itemName: values.itemName,
        category: values.category,
        quantity,
        quantityUnit: values.quantityUnit,
        unitPrice,
        total,
        supplierId,
        customerId,
        searchField: values.itemName.toLowerCase(),
      });

      setIsOpen(false);
    } catch (error) {
      setFormError(describeError(error));
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(next) => {
        setIsOpen(next);
        if (next) resetForm();
      }}
    >
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add item</DialogTitle>
          <DialogDescription>
            Record a purchase by hand. Suppliers and customers that aren&apos;t
            in the list yet are created when you save.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          <FieldGroup className="gap-4">
            <Field data-invalid={Boolean(errors.itemName)}>
              <FieldLabel htmlFor="add-item-name">Item name</FieldLabel>
              <Input
                id="add-item-name"
                value={form.itemName}
                onChange={update("itemName")}
                placeholder="Norwegian salmon filet"
                aria-invalid={Boolean(errors.itemName)}
                autoComplete="off"
              />
              {errors.itemName && <FieldError>{errors.itemName}</FieldError>}
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="add-item-sku">SKU (optional)</FieldLabel>
                <Input
                  id="add-item-sku"
                  value={form.sku}
                  onChange={update("sku")}
                  placeholder="e.g. 4011"
                  autoComplete="off"
                />
              </Field>

              <Field data-invalid={Boolean(errors.category)}>
                <FieldLabel htmlFor="add-item-category">Category</FieldLabel>
                <Input
                  id="add-item-category"
                  list="add-item-categories"
                  value={form.category}
                  onChange={update("category")}
                  placeholder="Fish"
                  aria-invalid={Boolean(errors.category)}
                  autoComplete="off"
                />
                {errors.category && <FieldError>{errors.category}</FieldError>}
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.supplierName)}>
                <FieldLabel htmlFor="add-item-supplier">Supplier</FieldLabel>
                <Input
                  id="add-item-supplier"
                  list="add-item-suppliers"
                  value={form.supplierName}
                  onChange={update("supplierName")}
                  placeholder="BAMA Storkjøkken Oslo"
                  aria-invalid={Boolean(errors.supplierName)}
                  autoComplete="off"
                />
                {errors.supplierName && (
                  <FieldError>{errors.supplierName}</FieldError>
                )}
              </Field>

              <Field data-invalid={Boolean(errors.customerName)}>
                <FieldLabel htmlFor="add-item-customer">Customer</FieldLabel>
                <Input
                  id="add-item-customer"
                  list="add-item-customers"
                  value={form.customerName}
                  onChange={update("customerName")}
                  placeholder="Osteria De Campo"
                  aria-invalid={Boolean(errors.customerName)}
                  autoComplete="off"
                />
                {errors.customerName && (
                  <FieldError>{errors.customerName}</FieldError>
                )}
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.quantity)}>
                <FieldLabel htmlFor="add-item-quantity">Quantity</FieldLabel>
                <Input
                  id="add-item-quantity"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={form.quantity}
                  onChange={update("quantity")}
                  placeholder="1"
                  aria-invalid={Boolean(errors.quantity)}
                />
                {errors.quantity && <FieldError>{errors.quantity}</FieldError>}
              </Field>

              <Field data-invalid={Boolean(errors.quantityUnit)}>
                <FieldLabel htmlFor="add-item-unit">Unit</FieldLabel>
                <Input
                  id="add-item-unit"
                  value={form.quantityUnit}
                  onChange={update("quantityUnit")}
                  placeholder="kg"
                  aria-invalid={Boolean(errors.quantityUnit)}
                  autoComplete="off"
                />
                {errors.quantityUnit && (
                  <FieldError>{errors.quantityUnit}</FieldError>
                )}
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.unitPrice)}>
                <FieldLabel htmlFor="add-item-price">
                  Unit price (kr)
                </FieldLabel>
                <Input
                  id="add-item-price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={form.unitPrice}
                  onChange={update("unitPrice")}
                  placeholder="48.00"
                  aria-invalid={Boolean(errors.unitPrice)}
                />
                {errors.unitPrice && (
                  <FieldError>{errors.unitPrice}</FieldError>
                )}
              </Field>

              <Field>
                <FieldTitle>Total</FieldTitle>
                <div
                  aria-live="polite"
                  className="flex h-8 items-center justify-between rounded-lg border border-input bg-muted/40 px-2.5 text-sm tabular-nums"
                >
                  <span>{total.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">kr</span>
                </div>
              </Field>
            </div>
          </FieldGroup>

          {formError && (
            <p role="alert" className="text-sm text-destructive">
              {formError}
            </p>
          )}

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                <PlusIcon />
              )}
              {pending ? "Adding…" : "Add item"}
            </Button>
          </DialogFooter>
        </form>

        <datalist id="add-item-categories">
          {options?.categories.map((category) => (
            <option key={category} value={category} />
          ))}
        </datalist>
        <datalist id="add-item-suppliers">
          {options?.suppliers.map((supplier) => (
            <option key={supplier} value={supplier} />
          ))}
        </datalist>
        <datalist id="add-item-customers">
          {options?.customers.map((customer) => (
            <option key={customer} value={customer} />
          ))}
        </datalist>
      </DialogContent>
    </Dialog>
  );
}
