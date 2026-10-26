import { Doc } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

/** Cap the rows hydrated per query; the tables paginate on the client. */
export const INVENTORY_LIMIT = 500;
export const LATEST_LIMIT = 6;
/** Cap the customer records scanned for one workspace name. */
export const CUSTOMER_LIMIT = 100;

/**
 * Customer rows are created per upload, so the same restaurant can appear
 * more than once. A workspace is a name, and it owns every matching row.
 */
export async function findCustomerIds(ctx: QueryCtx, customerName: string) {
  const customers = await ctx.db
    .query("customers")
    .withIndex("by_customerName", (q) => q.eq("customerName", customerName))
    .take(CUSTOMER_LIMIT);

  return customers.map((customer) => customer._id);
}

/** All line items, or only those belonging to one customer name. */
export async function readLineItems(ctx: QueryCtx, customerName?: string) {
  if (customerName === undefined) {
    return await ctx.db.query("lineItems").take(INVENTORY_LIMIT);
  }

  const rows: Doc<"lineItems">[] = [];

  for (const customerId of await findCustomerIds(ctx, customerName)) {
    if (rows.length >= INVENTORY_LIMIT) break;

    const batch = await ctx.db
      .query("lineItems")
      .withIndex("by_customerId", (q) => q.eq("customerId", customerId))
      .take(INVENTORY_LIMIT - rows.length);

    rows.push(...batch);
  }

  return rows;
}

/** The newest line items overall, or the newest for one customer name. */
export async function readLatestLineItems(ctx: QueryCtx, customerName?: string) {
  if (customerName === undefined) {
    return await ctx.db.query("lineItems").order("desc").take(LATEST_LIMIT);
  }

  const batches = await Promise.all(
    (await findCustomerIds(ctx, customerName)).map((customerId) =>
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

/** Join the item, supplier, and customer names the tables display. */
export async function hydrateLineItem(ctx: QueryCtx, lineItem: Doc<"lineItems">) {
  const [item, customer] = await Promise.all([
    ctx.db.get("items", lineItem.itemId),
    ctx.db.get("customers", lineItem.customerId),
  ]);
  const supplier = item
    ? await ctx.db.get("suppliers", item.supplierId)
    : null;

  return {
    ...lineItem,
    item: item ?? null,
    supplierName: supplier?.supplierName ?? null,
    customerName: customer?.customerName ?? null,
  };
}

/** Round aggregated totals to two decimals before sending them to the client. */
export function roundToTwo(value: number) {
  return Math.round(value * 100) / 100;
}

/** How many rows to read when building the form's suggestions. */
const OPTION_LIMIT = 100;

function sortedUnique(names: string[]) {
  return [...new Set(names)].sort((a, b) => a.localeCompare(b));
}

/**
 * Names already in the database, offered as suggestions when an item is added
 * by hand. Bounded so the query stays cheap as the inventory grows.
 */
export const getItemFormOptions = query({
  args: {},
  handler: async (ctx) => {
    const [suppliers, customers, items] = await Promise.all([
      ctx.db.query("suppliers").take(OPTION_LIMIT),
      ctx.db.query("customers").take(OPTION_LIMIT),
      ctx.db.query("items").take(OPTION_LIMIT),
    ]);

    return {
      suppliers: sortedUnique(
        suppliers.map((supplier) => supplier.supplierName),
      ),
      customers: sortedUnique(
        customers.map((customer) => customer.customerName),
      ),
      categories: sortedUnique(items.map((item) => item.category)),
    };
  },
});

/**
 * Resolve a supplier name to its id, creating the supplier the first time the
 * name is used. Manual entry asks for a name rather than an id, so this bridges
 * the form to `addItem`, which expects an existing `suppliers` row.
 */
export const ensureSupplier = mutation({
  args: { supplierName: v.string() },
  handler: async (ctx, args) => {
    const supplierName = args.supplierName.trim();
    if (!supplierName) {
      throw new Error("Supplier name is required.");
    }

    const existing = await ctx.db
      .query("suppliers")
      .withIndex("by_supplierName", (q) => q.eq("supplierName", supplierName))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("suppliers", {
      supplierName,
      supplierOrgId: null,
      searchField: supplierName.toLowerCase()
    });
  },
});

/**
 * Resolve a customer name to its id, creating the customer the first time the
 * name is used. Mirrors `ensureSupplier` for the `customers` table.
 */
export const ensureCustomer = mutation({
  args: { customerName: v.string() },
  handler: async (ctx, args) => {
    const customerName = args.customerName.trim();
    if (!customerName) {
      throw new Error("Customer name is required.");
    }

    const existing = await ctx.db
      .query("customers")
      .withIndex("by_customerName", (q) => q.eq("customerName", customerName))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("customers", {
      customerName,
      customerOrgId: null,
      searchField: customerName.toLowerCase()
    });
  },
});


/*
export async function getSupplierId(
  ctx: MutationCtx,
  data: { supplierName: string; supplierOrgId: string },
): Promise<Id<"suppliers">> {
  // 1. Look up the supplier
  let supplierId = await ctx.db
    .query("suppliers")
    .withIndex("by_supplierOrgId", (q) =>
      q.eq("supplierOrgId", data.supplierOrgId),
    )
    .unique()
    .then((doc) => doc?._id);

  // 2. If not found, insert them
  if (!supplierId) {
    supplierId = await ctx.db.insert("suppliers", {
      supplierName: data.supplierName,
      supplierOrgId: data.supplierOrgId,
    });
  }

  return supplierId;
}

export async function getCustomerId(
  ctx: MutationCtx,
  data: { customerName: string; customerOrgId: string },
): Promise<Id<"customers">> {
  // 1. Look up the customer
  let customerId = await ctx.db
    .query("customers")
    .withIndex("by_customerOrgId", (q) =>
      q.eq("customerOrgId", data.customerOrgId),
    )
    .unique()
    .then((doc) => doc?._id);

  // 2. If not found, insert them
  if (!customerId) {
    customerId = await ctx.db.insert("customers", {
      customerName: data.customerName,
      customerOrgId: data.customerOrgId,
    });
  }

  return customerId;
}

export async function getItemId(
  ctx: MutationCtx,
  data: { 
    sku: string;
    itemName: string,
    category: string,
    supplierId: Id<"suppliers">,
  },
): Promise<Id<"items">> {
  // 1. Look up the customer
  let itemId = await ctx.db
    .query("items")
    .withIndex("by_itemName", (q) =>
      q.eq("itemName", data.itemName),
    )
    .unique()
    .then((doc) => doc?._id);

  // 2. If not found, insert them
  if (!itemId) {
    itemId = await ctx.db.insert("items", {
      sku: data.sku,
      itemName: data.itemName,
      category: data.category,
      supplierId: data.supplierId,
    });
  }

  return itemId;
}

*/