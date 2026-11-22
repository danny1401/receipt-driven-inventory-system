"use client";

import {
  useId,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useMutation, useQuery } from "convex/react";
import { LoaderCircleIcon, PencilIcon, PlusIcon } from "lucide-react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ALL } from "../util/functions";
import { useWorkspace } from "@/components/workspace";

type FormValues = {
  itemName: string;
  sku: string;
  category: string;
  customerId: Id<"customers"> | "";
  supplierId: Id<"suppliers"> | "";
  quantity: string;
  quantityUnit: string;
  unitPrice: string;
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

const EMPTY_FORM: FormValues = {
  itemName: "",
  sku: "",
  category: "",
  customerId: "",
  supplierId: "",
  quantity: "",
  quantityUnit: "",
  unitPrice: "",
};

/** The line-item fields the dialog needs when editing an existing row. */
export type EditableItem = {
  id: Id<"lineItems">;
  itemId: Id<"items">;
  itemName: string;
  sku: string;
  category: string;
  customerId?: Id<"customers">;
  supplierId?: Id<"suppliers"> | null;
  supplierName: string;
  customerName: string;
  quantity: number | null;
  quantityUnit: string | null;
  unitPrice: number | null;
};

/** Turn a table row into form values, treating the table's dash as empty. */
function formFromItem(item: EditableItem): FormValues {
  const text = (value: string) => (value === "—" ? "" : value);

  return {
    itemName: text(item.itemName),
    sku: item.sku,
    category: text(item.category),
    customerId: item.customerId ?? "",
    supplierId: item.supplierId ?? "",
    quantity: item.quantity === null ? "" : String(item.quantity),
    quantityUnit: item.quantityUnit ?? "",
    unitPrice: item.unitPrice === null ? "" : String(item.unitPrice),
  };
}

/** Pull the readable part out of Convex's wrapped server error. */
function describeError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const serverError = message.split("Server Error").pop()?.trim();

  return (
    serverError?.replace(/^Uncaught Error:\s*/i, "") ||
    "Couldn't save the item. Please try again."
  );
}

interface AddItemDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Pass a line item to switch the dialog into edit mode. */
  item?: EditableItem | null;
}

/**
 * Add or edit one line item. Mount the form only while the dialog is open so
 * each opening starts from the current row (or a blank add form).
 */
export function AddItemDialog({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  item = null,
}: AddItemDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = externalOpen ?? internalOpen;
  const setIsOpen = externalOnOpenChange ?? setInternalOpen;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-lg">
        <AddItemForm
          key={isOpen ? (item?.id ?? "new") : "closed"}
          item={item}
          onSaved={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function AddItemForm({
  item,
  onSaved,
}: {
  item: EditableItem | null;
  onSaved: () => void;
}) {
  const { workspace } = useWorkspace();
  const idPrefix = useId();
  const ids = {
    name: `${idPrefix}-name`,
    sku: `${idPrefix}-sku`,
    category: `${idPrefix}-category`,
    categories: `${idPrefix}-categories`,
    supplier: `${idPrefix}-supplier`,
    customer: `${idPrefix}-customer`,
    quantity: `${idPrefix}-quantity`,
    unit: `${idPrefix}-unit`,
    price: `${idPrefix}-price`,
  };

  const [form, setForm] = useState<FormValues>(() =>
    item ? formFromItem(item) : EMPTY_FORM,
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isEditing = item !== null;

  const options = useQuery(api.inventory.helpers.getItemFormOptions);
  const customers = useQuery(api.inventory.customers.getRelevantCustomers);

  // Fall back to the row's customer, then the workspace, then the first one.
  const selectedCustomer =
    customers?.find((customer) => customer._id === form.customerId) ??
    customers?.find(
      (customer) => customer.customerName === item?.customerName,
    ) ??
    (workspace === ALL
      ? undefined
      : customers?.find((customer) => customer.customerName === workspace)) ??
    customers?.[0];
  const customerId = selectedCustomer?._id ?? "";

  const suppliers = useQuery(
    api.inventory.suppliers.getSuppliersByCustomerId,
    customerId ? { customerId } : "skip",
  );
  const addItemAndStockEntry = useMutation(
    api.inventory.items.addItemAndStockEntry,
  );
  const updateItem = useMutation(api.inventory.items.updateItem);

  // Keep the supplier valid for the selected customer, preferring the row's
  // existing supplier when editing.
  const selectedSupplier =
    suppliers?.find((supplier) => supplier._id === form.supplierId) ??
    suppliers?.find(
      (supplier) => supplier.supplierName === item?.supplierName,
    ) ??
    suppliers?.[0];
  const supplierId = selectedSupplier?._id ?? "";

  const quantity = Number(form.quantity);
  const unitPrice = Number(form.unitPrice);
  const hasNumbers =
    form.quantity.trim() !== "" &&
    form.unitPrice.trim() !== "" &&
    Number.isFinite(quantity) &&
    Number.isFinite(unitPrice);
  const total = hasNumbers ? Math.round(quantity * unitPrice * 100) / 100 : 0;

  type TextField = Exclude<keyof FormValues, "customerId" | "supplierId">;

  const update =
    (field: TextField) => (event: ChangeEvent<HTMLInputElement>) => {
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

  const handleCustomerChange = (value: string | null) => {
    const nextCustomerId = (value ?? "") as Id<"customers"> | "";

    setForm((current) => ({
      ...current,
      customerId: nextCustomerId,
      supplierId: "",
    }));
    setErrors((current) => {
      if (!current.customerId && !current.supplierId) return current;
      const next = { ...current };
      delete next.customerId;
      delete next.supplierId;
      return next;
    });
  };

  const handleSupplierChange = (value: string | null) => {
    const nextSupplierId = (value ?? "") as Id<"suppliers"> | "";

    setForm((current) => ({ ...current, supplierId: nextSupplierId }));
    setErrors((current) => {
      if (!current.supplierId) return current;
      const next = { ...current };
      delete next.supplierId;
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
      quantityUnit: form.quantityUnit.trim(),
    };

    const nextErrors: FieldErrors = {};
    if (!values.itemName) nextErrors.itemName = "Enter the item name.";
    if (!values.category) nextErrors.category = "Enter a category.";
    if (!customerId) nextErrors.customerId = "Choose a customer.";
    if (!supplierId) nextErrors.supplierId = "Choose a supplier.";
    if (!values.quantityUnit)
      nextErrors.quantityUnit = "Enter a unit, e.g. kg.";
    if (
      form.quantity.trim() === "" ||
      !Number.isFinite(quantity) ||
      (isEditing ? quantity < 0 : quantity <= 0)
    ) {
      nextErrors.quantity = isEditing
        ? "Enter a quantity of 0 or more."
        : "Enter a quantity above 0.";
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

    if (!customerId || !supplierId) return;

    setPending(true);
    setFormError(null);

    try {
      if (item) {
        await updateItem({
          itemId: item.itemId,
          customerId,
          supplierId,
          sku: values.sku || null,
          itemName: values.itemName,
          category: values.category,
        });
      } else {
        await addItemAndStockEntry({
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
      }

      onSaved();
    } catch (error) {
      setFormError(describeError(error));
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit item" : "Add item"}</DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Update this line item. Changing the item name, category, or supplier also updates the shared item record."
            : "Record a purchase by hand. Choose the customer, then one of their linked suppliers."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <FieldGroup className="gap-4">
          <Field data-invalid={Boolean(errors.itemName)}>
            <FieldLabel htmlFor={ids.name}>Item name</FieldLabel>
            <Input
              id={ids.name}
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
              <FieldLabel htmlFor={ids.sku}>SKU (optional)</FieldLabel>
              <Input
                id={ids.sku}
                value={form.sku}
                onChange={update("sku")}
                placeholder="e.g. 4011"
                autoComplete="off"
              />
            </Field>

            <Field data-invalid={Boolean(errors.category)}>
              <FieldLabel htmlFor={ids.category}>Category</FieldLabel>
              <Input
                id={ids.category}
                list={ids.categories}
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
            <Field data-invalid={Boolean(errors.customerId)}>
              <FieldLabel htmlFor={ids.customer}>Customer</FieldLabel>
              <Select
                value={customerId || null}
                onValueChange={handleCustomerChange}
                items={customers?.map((customer) => ({
                  value: customer._id,
                  label: customer.customerName,
                }))}
              >
                <SelectTrigger
                  id={ids.customer}
                  className="w-full"
                  aria-invalid={Boolean(errors.customerId)}
                >
                  <SelectValue
                    placeholder={
                      customers === undefined
                        ? "Loading customers…"
                        : customers.length === 0
                          ? "No customers available"
                          : "Select a customer"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Customers</SelectLabel>
                    {customers?.map((customer) => (
                      <SelectItem key={customer._id} value={customer._id}>
                        {customer.customerName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.customerId && (
                <FieldError>{errors.customerId}</FieldError>
              )}
            </Field>

            <Field data-invalid={Boolean(errors.supplierId)}>
              <FieldLabel htmlFor={ids.supplier}>Supplier</FieldLabel>
              <Select
                value={supplierId || null}
                onValueChange={handleSupplierChange}
                disabled={
                  !customerId ||
                  suppliers === undefined ||
                  suppliers.length === 0
                }
                items={suppliers?.map((supplier) => ({
                  value: supplier._id,
                  label: supplier.supplierName,
                }))}
              >
                <SelectTrigger
                  id={ids.supplier}
                  className="w-full"
                  aria-invalid={Boolean(errors.supplierId)}
                >
                  <SelectValue
                    placeholder={
                      !customerId
                        ? "Select a customer first"
                        : suppliers === undefined
                          ? "Loading suppliers…"
                          : suppliers.length === 0
                            ? "No suppliers for this customer"
                            : "Select a supplier"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Suppliers</SelectLabel>
                    {suppliers?.map((supplier) => (
                      <SelectItem key={supplier._id} value={supplier._id}>
                        {supplier.supplierName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.supplierId && (
                <FieldError>{errors.supplierId}</FieldError>
              )}
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={Boolean(errors.quantity)}>
              <FieldLabel htmlFor={ids.quantity}>Quantity</FieldLabel>
              <Input
                id={ids.quantity}
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
              <FieldLabel htmlFor={ids.unit}>Unit</FieldLabel>
              <Input
                id={ids.unit}
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
              <FieldLabel htmlFor={ids.price}>Unit price (kr)</FieldLabel>
              <Input
                id={ids.price}
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={form.unitPrice}
                onChange={update("unitPrice")}
                placeholder="48.00"
                aria-invalid={Boolean(errors.unitPrice)}
              />
              {errors.unitPrice && <FieldError>{errors.unitPrice}</FieldError>}
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
            ) : isEditing ? (
              <PencilIcon />
            ) : (
              <PlusIcon />
            )}
            {pending
              ? isEditing
                ? "Saving…"
                : "Adding…"
              : isEditing
                ? "Save changes"
                : "Add item"}
          </Button>
        </DialogFooter>
      </form>

      <datalist id={ids.categories}>
        {options?.categories.map((category) => (
          <option key={category} value={category} />
        ))}
      </datalist>
    </>
  );
}

