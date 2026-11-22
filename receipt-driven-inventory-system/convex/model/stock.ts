import { MutationCtx, QueryCtx } from "../_generated/server";
import { type PaginationOptions } from "convex/server";
import { Doc, Id } from "../_generated/dataModel";
import { LATEST_LIMIT, MAX_PAGE_SIZE } from "../inventory/helpers";
import * as Customer from "../model/customer";
import { monthBoundsUtc } from "../lib/date";

/** The newest line items overall, or the newest for one customer name. */
export async function readLatestLineItems(
  ctx: QueryCtx,
  customerId: Id<"customers">,
  orderDate: number,
) {
  // Validate customerId
  await Customer.validateCustomer(ctx, customerId);

  // Get month range
  const { start, end } = monthBoundsUtc(orderDate);

  // Get monthly line items
  const batches = await Promise.all(
    await ctx.db
      .query("lineItems")
      .withIndex("by_customerId_and_orderDate", (q) =>
        q
          .eq("customerId", customerId)
          .gte("orderDate", start)
          .lt("orderDate", end),
      )
      .order("desc")
      .take(LATEST_LIMIT),
  );

  return batches
    .flat()
    .sort((a, b) => b._creationTime - a._creationTime)
    .slice(0, LATEST_LIMIT);
}

/* All line items, or only those belonging to one customer name. */
export async function readLineItems(
  ctx: QueryCtx,
  data: {
    searchTerm: string | undefined;
    customerId: Id<"customers">;
    start: number;
    end: number;
    paginationOpts: PaginationOptions;
  },
): Promise<Doc<"lineItems">[]> {
  const boundedOpts: PaginationOptions = {
    ...data.paginationOpts,
    numItems: Math.min(data.paginationOpts.numItems, MAX_PAGE_SIZE),
    maximumRowsRead: data.paginationOpts.maximumRowsRead
      ? Math.min(data.paginationOpts.maximumRowsRead, MAX_PAGE_SIZE * 2)
      : MAX_PAGE_SIZE * 2,
  };

  const trimmedSearch = data.searchTerm?.trim();
  if (trimmedSearch) {
    const searchResult = await ctx.db
      .query("lineItems")
      .withSearchIndex("search_line_items", (q) =>
        q.search("searchField", trimmedSearch),
      )
      .paginate(boundedOpts);

    return searchResult.page;
  }

  // Fallback indexed query for a single customer within the target UTC month
  return await getMonthlyStockEntriesByCustomerId(ctx, {
    customerId: data.customerId,
    start: data.start,
    end: data.end,
    paginationOpts: boundedOpts,
  });
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

export async function findStockEntriesByItemIdAndCustomerId(
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

export async function getMonthlyStockEntriesByCustomerId(
  ctx: QueryCtx,
  data: {
    customerId: Id<"customers">;
    start: number;
    end: number;
    paginationOpts?: PaginationOptions;
  },
): Promise<Doc<"lineItems">[]> {
  // Get monthly line items
  const baseQuery = ctx.db
    .query("lineItems")
    .withIndex("by_customerId_and_orderDate", (q) =>
      q
        .eq("customerId", data.customerId)
        .gte("orderDate", data.start)
        .lt("orderDate", data.end),
    );

  if (data.paginationOpts) {
    const result = await baseQuery.paginate(data.paginationOpts);
    return result.page;
  }

  return await baseQuery.collect();
}

// Create Stock Entry
export async function createStockEntry(
  ctx: MutationCtx,
  data: {
    invoiceId?: Id<"invoices">;
    itemId: Id<"items">;
    customerId: Id<"customers">;
    orderDate: number | null;
    itemName: string;
    quantity: number | null;
    quantityUnit: string | null;
    unitPrice: number | null;
    total: number | null;
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
    orderDate: data.orderDate || null,
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
