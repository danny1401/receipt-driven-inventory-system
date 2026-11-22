"use client";

import { useId, useState, type FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  CheckIcon,
  LoaderCircleIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

import { DeleteDialog } from "../dialog/delete-dialog";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Field, FieldLabel, FieldTitle } from "../ui/field";
import { Input } from "../ui/input";
import { formatDate } from "../util/functions";
import type { InventoryRow } from "./inventory-table";

type InventoryRowActionsProps = {
  item: InventoryRow;
  onEdit?: (item: InventoryRow) => void;
  onMoveStock?: (item: InventoryRow) => void;
  onDeleteRequest: (item: InventoryRow) => void;
};

type StockEntry = {
  id: Id<"lineItems">;
  quantity: number | null;
  quantityUnit: string | null;
  unitPrice: number | null;
  total: number | null;
  createdAt: number;
  updatedAt: number;
  invoiceNumber: string | null;
};

type StockEntryValues = {
  quantity: number;
  quantityUnit: string;
  unitPrice: number;
};

function formatMoney(value: number | null) {
  return value === null ? "—" : `${value.toFixed(2)} kr`;
}

function formatQuantity(quantity: number | null, unit: string | null) {
  if (quantity === null) return "—";
  return unit ? `${quantity} ${unit}` : `${quantity}`;
}

/** Pull the readable part out of Convex's wrapped server error. */
function describeError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const serverError = message.split("Server Error").pop()?.trim();

  return (
    serverError?.replace(/^Uncaught Error:\s*/i, "") ||
    "Couldn't save the stock entry. Please try again."
  );
}

export function InventoryRowActions({
  item,
  onEdit,
  onMoveStock,
  onDeleteRequest,
}: InventoryRowActionsProps) {
  const [stockOpen, setStockOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Item</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setStockOpen(true)}>
              View stock
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(item)}>
              Edit item
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMoveStock?.(item)}>
              Move stock
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDeleteRequest(item)}
            >
              Delete item
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ViewStockDialog
        open={stockOpen}
        onOpenChange={setStockOpen}
        item={item}
      />
    </>
  );
}

function ViewStockDialog({
  open,
  onOpenChange,
  item,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryRow;
}) {
  const entries = useQuery(
    api.inventory.stocks.listStockEntries,
    open ? { itemId: item.itemId, customerId: item.customerId } : "skip",
  );
  const addStockEntry = useMutation(api.inventory.stocks.addStockEntry);
  const updateStockEntry = useMutation(api.inventory.stocks.updateStockEntry);
  const deleteStockEntry = useMutation(api.inventory.stocks.deleteStockEntry);

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<Id<"lineItems"> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StockEntry | null>(null);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setAdding(false);
      setEditingId(null);
      setDeleteTarget(null);
    }

    onOpenChange(next);
  };

  const entryList = entries ?? [];
  const totalValue = entryList.reduce(
    (sum, entry) => sum + (entry.total ?? 0),
    0,
  );
  const totalQuantity = entryList.reduce(
    (sum, entry) => sum + (entry.quantity ?? 0),
    0,
  );
  const units = new Set(
    entryList
      .map((entry) => entry.quantityUnit)
      .filter((unit): unit is string => Boolean(unit)),
  );
  const quantityLabel =
    entries === undefined
      ? "…"
      : entryList.length === 0
        ? "—"
        : units.size === 1
          ? `${totalQuantity} ${[...units][0]}`
          : `${totalQuantity} (mixed)`;

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Stock for {item.itemName}</DialogTitle>
            <DialogDescription>
              {item.sku ? `SKU ${item.sku} · ` : ""}
              {item.category} · {item.supplierName}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:grid-cols-3">
            <StockStat
              label="Stock entries"
              value={entries === undefined ? "…" : String(entryList.length)}
            />
            <StockStat label="Total quantity" value={quantityLabel} />
            <StockStat
              label="Total value"
              value={
                entries === undefined
                  ? "…"
                  : entryList.length === 0
                    ? "—"
                    : formatMoney(totalValue)
              }
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-medium">Added quantities</h3>
              <p className="text-xs text-muted-foreground">
                Each entry is one receipt line or manual addition.
              </p>
            </div>
            <Button
              size="sm"
              disabled={adding}
              onClick={() => {
                setAdding(true);
                setEditingId(null);
              }}
            >
              <PlusIcon />
              Add quantity
            </Button>
          </div>

          {adding && (
            <StockEntryForm
              key="new"
              defaultUnit={item.quantityUnit ?? ""}
              submitLabel="Add"
              onCancel={() => setAdding(false)}
              onSubmit={async (values) => {
                await addStockEntry({
                  itemId: item.itemId,
                  customerId: item.customerId,
                  ...values,
                });
                setAdding(false);
              }}
            />
          )}

          {entries === undefined ? (
            <div className="rounded-lg border px-3 py-6 text-center text-sm text-muted-foreground">
              Loading stock entries…
            </div>
          ) : entryList.length === 0 ? (
            <div className="rounded-lg border px-3 py-6 text-center text-sm text-muted-foreground">
              No stock entries yet. Add a quantity to get started.
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <div className="hidden grid-cols-[minmax(0,1.2fr)_6rem_6.5rem_6.5rem_5rem] gap-3 border-b bg-muted/40 px-3 py-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase sm:grid">
                <span>Added</span>
                <span>Quantity</span>
                <span className="text-right">Unit price</span>
                <span className="text-right">Total</span>
                <span aria-hidden />
              </div>

              <div className="divide-y divide-border/60">
                {entryList.map((entry) => (
                  <StockEntryRow
                    key={entry.id}
                    entry={entry}
                    editing={editingId === entry.id}
                    defaultUnit={item.quantityUnit ?? ""}
                    onEdit={() => {
                      setEditingId(entry.id);
                      setAdding(false);
                    }}
                    onCancelEdit={() => setEditingId(null)}
                    onDelete={() => setDeleteTarget(entry)}
                    onSave={async (values) => {
                      await updateStockEntry({
                        lineItemId: entry.id,
                        ...values,
                      });
                      setEditingId(null);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(next) => {
          if (!next) setDeleteTarget(null);
        }}
        title="Delete stock entry?"
        description={
          deleteTarget
            ? `${formatQuantity(
                deleteTarget.quantity,
                deleteTarget.quantityUnit,
              )} added on ${formatDate(deleteTarget.createdAt)} will be removed.`
            : ""
        }
        onConfirm={() => {
          if (!deleteTarget) return;

          void deleteStockEntry({ lineItemId: deleteTarget.id });
          setDeleteTarget(null);
        }}
      />
    </>
  );
}

function StockStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/20 px-3 py-2.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium tabular-nums">{value}</p>
    </div>
  );
}

function StockEntryRow({
  entry,
  editing,
  defaultUnit,
  onEdit,
  onCancelEdit,
  onDelete,
  onSave,
}: {
  entry: StockEntry;
  editing: boolean;
  defaultUnit: string;
  onEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  onSave: (values: StockEntryValues) => Promise<void>;
}) {
  if (editing) {
    return (
      <div className="p-3">
        <StockEntryForm
          initial={entry}
          defaultUnit={defaultUnit}
          submitLabel="Save"
          onCancel={onCancelEdit}
          onSubmit={onSave}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-2 px-3 py-3 sm:grid-cols-[minmax(0,1.2fr)_6rem_6.5rem_6.5rem_5rem] sm:items-center sm:gap-3">
      <div className="min-w-0">
        <p className="text-sm">{formatDate(entry.createdAt)}</p>
        <p className="truncate text-xs text-muted-foreground">
          {entry.invoiceNumber
            ? `Invoice ${entry.invoiceNumber}`
            : "Manual addition"}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 sm:block">
        <span className="text-xs text-muted-foreground sm:hidden">
          Quantity
        </span>
        <span className="text-sm tabular-nums">
          {formatQuantity(entry.quantity, entry.quantityUnit)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
        <span className="text-xs text-muted-foreground sm:hidden">
          Unit price
        </span>
        <span className="text-sm tabular-nums">
          {formatMoney(entry.unitPrice)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
        <span className="text-xs text-muted-foreground sm:hidden">Total</span>
        <span className="text-sm font-medium tabular-nums">
          {formatMoney(entry.total)}
        </span>
      </div>

      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="icon-sm" onClick={onEdit}>
          <PencilIcon />
          <span className="sr-only">Edit stock entry</span>
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive"
          onClick={onDelete}
        >
          <Trash2Icon />
          <span className="sr-only">Delete stock entry</span>
        </Button>
      </div>
    </div>
  );
}

function StockEntryForm({
  initial,
  defaultUnit,
  submitLabel,
  onCancel,
  onSubmit,
}: {
  initial?: Pick<StockEntry, "quantity" | "quantityUnit" | "unitPrice">;
  defaultUnit: string;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (values: StockEntryValues) => Promise<void>;
}) {
  const idPrefix = useId();
  const [quantity, setQuantity] = useState(
    initial?.quantity === null || initial?.quantity === undefined
      ? ""
      : String(initial.quantity),
  );
  const [unit, setUnit] = useState(initial?.quantityUnit ?? defaultUnit);
  const [unitPrice, setUnitPrice] = useState(
    initial?.unitPrice === null || initial?.unitPrice === undefined
      ? ""
      : String(initial.unitPrice),
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quantityValue = Number(quantity);
  const unitPriceValue = Number(unitPrice);
  const hasNumbers =
    quantity.trim() !== "" &&
    Number.isFinite(quantityValue) &&
    quantityValue > 0 &&
    unitPrice.trim() !== "" &&
    Number.isFinite(unitPriceValue) &&
    unitPriceValue >= 0;
  const canSubmit = hasNumbers && unit.trim() !== "";
  const total = hasNumbers
    ? Math.round(quantityValue * unitPriceValue * 100) / 100
    : 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || pending) return;

    setPending(true);
    setError(null);

    try {
      await onSubmit({
        quantity: quantityValue,
        quantityUnit: unit.trim(),
        unitPrice: unitPriceValue,
      });
    } catch (submitError) {
      setError(describeError(submitError));
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-muted/20 p-3">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_5.5rem_minmax(0,1fr)_6.5rem_auto] sm:items-end">
        <Field>
          <FieldLabel htmlFor={`${idPrefix}-quantity`}>Quantity</FieldLabel>
          <Input
            id={`${idPrefix}-quantity`}
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            placeholder="1"
            autoComplete="off"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={`${idPrefix}-unit`}>Unit</FieldLabel>
          <Input
            id={`${idPrefix}-unit`}
            value={unit}
            onChange={(event) => setUnit(event.target.value)}
            placeholder="kg"
            autoComplete="off"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={`${idPrefix}-unit-price`}>
            Unit price (kr)
          </FieldLabel>
          <Input
            id={`${idPrefix}-unit-price`}
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={unitPrice}
            onChange={(event) => setUnitPrice(event.target.value)}
            placeholder="48.00"
            autoComplete="off"
          />
        </Field>

        <Field>
          <FieldTitle>Total</FieldTitle>
          <div className="flex h-8 items-center justify-between rounded-lg border border-input bg-background px-2.5 text-sm tabular-nums">
            <span>{total.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground">kr</span>
          </div>
        </Field>

        <div className="flex gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={!canSubmit || pending}>
            {pending ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              <CheckIcon />
            )}
            {pending ? "Saving…" : submitLabel}
          </Button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}
