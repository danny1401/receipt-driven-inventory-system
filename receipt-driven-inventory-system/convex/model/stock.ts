import { MutationCtx, QueryCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";
import {
  INVENTORY_LIMIT,
  LATEST_LIMIT,
} from "../inventory/helpers";
import * as Customer from "../model/customer";

/** The newest line items overall, or the newest for one customer name. */
export async function readLatestLineItems(
  ctx: QueryCtx,
  customerName?: string,
) {
  if (customerName === undefined) {
    return await ctx.db.query("lineItems").order("desc").take(LATEST_LIMIT);
  }

  const batches = await Promise.all(
    (await Customer.findCustomerIds(ctx, customerName)).map((customerId) =>
      ctx.db
        .query("lineItems")
        .withIndex("by_customerId", (q) => q.eq("customerId", customerId))
        .order("desc")
        .take(LATEST_LIMIT),
    ),
  );

  return batches
    .flat()
    .sort((a, b) => b._creationTime - a._creationTime)
    .slice(0, LATEST_LIMIT);
}

/* All line items, or only those belonging to one customer name. */
export async function readLineItems(ctx: QueryCtx, customerName?: string) {
  if (customerName === undefined) {
    return await ctx.db.query("lineItems").take(INVENTORY_LIMIT);
  }

  const rows: Doc<"lineItems">[] = [];

  for (const customerId of await Customer.findCustomerIds(ctx, customerName)) {
    if (rows.length >= INVENTORY_LIMIT) break;

    const batch = await ctx.db
      .query("lineItems")
      .withIndex("by_customerId", (q) => q.eq("customerId", customerId))
      .take(INVENTORY_LIMIT - rows.length);

    rows.push(...batch);
  }

  return rows;
}

/* Join the item, supplier, and customer names the tables display. */
export async function hydrateLineItem(
  ctx: QueryCtx,
  lineItem: Doc<"lineItems">,
) {
  const [item, customerData] = await Promise.all([
    ctx.db.get("items", lineItem.itemId),
    lineItem.customerId ? ctx.db.get("customers", lineItem.customerId) : null,
  ]);
  const supplier = item ? await ctx.db.get("suppliers", item.supplierId) : null;

  return {
    ...lineItem,
    item: item ?? null,
    supplierName: supplier?.supplierName ?? null,
    ...customerData,
  };
}

// Get stock entry
export async function findStockEntry(
  ctx: QueryCtx,
  data: {
    lineItemId: Id<"lineItems">;
  },
) {
  const stock = await ctx.db.get("lineItems", data.lineItemId);

  if (!stock) throw new Error("Stock entry not found.");

  return stock;
}

export async function findStockEntriesByItemId(
  ctx: QueryCtx,
  data: {
    itemId: Id<"items">;
  },
) {
  const stocks = await ctx.db
    .query("lineItems")
    .withIndex("by_itemId_and_customerId", (q) => q.eq("itemId", data.itemId))
    .collect(); // Returns an array of all matching line items

  if (stocks.length === 0)
    throw new Error("No stock entries found for this item.");

  return stocks;
}

export async function findStockEntriesByItemIdAndCustomerID(
  ctx: QueryCtx,
  data: {
    itemId: Id<"items">;
    customerId: Id<"customers">;
    limit: number;
  },
) {
  const stocks = await ctx.db
    .query("lineItems")
    .withIndex("by_itemId_and_customerId", (q) =>
      q.eq("itemId", data.itemId).eq("customerId", data.customerId),
    )
    .order("desc")
    .take(data.limit);

  if (stocks.length === 0)
    throw new Error("No stock entries found for this item.");

  return stocks;
}

// Create Stock Entry
export async function createStockEntry(
  ctx: MutationCtx,
  data: {
    invoiceId?: Id<"invoices">;
    itemId: Id<"items">;
    customerId: Id<"customers">;
    orderDate: number;
    itemName: string;
    quantity: number;
    quantityUnit: string;
    unitPrice: number;
    total: number;
  },
) {
  await ctx.db.insert("lineItems", {
    invoiceId: data.invoiceId,
    quantity: data.quantity,
    quantityUnit: data.quantityUnit,
    unitPrice: data.unitPrice,
    total: data.total,
    itemId: data.itemId,
    customerId: data.customerId,
    orderDate: data.orderDate,
    updatedAt: Date.now(),
    searchField: data.itemName.toLowerCase(),
  });
}

// Update stock entry
export async function updateStockEntry(
  ctx: MutationCtx,
  data: {
    lineItemId: Id<"lineItems">;
    quantity: number;
    quantityUnit: string;
    unitPrice: number;
    total: number;
  },
) {
  await ctx.db.patch("lineItems", data.lineItemId, {
    quantity: data.quantity,
    quantityUnit: data.quantityUnit,
    unitPrice: data.unitPrice,
    total: data.total,
    updatedAt: Date.now(),
  });
}
