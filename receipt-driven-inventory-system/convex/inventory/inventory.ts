import { v } from "convex/values";

import type { Doc } from "../_generated/dataModel";
import { query } from "../_generated/server";
import { CUSTOMER_LIMIT, hydrateLineItem, readLatestLineItems, readLineItems, roundToTwo } from "./helpers";

/** Distinct customer names, used as workspaces across the app. */
export const listWorkspaces = query({
  args: {},
  handler: async (ctx) => {
    const customers = await ctx.db.query("customers").take(CUSTOMER_LIMIT);

    return [...new Set(customers.map((customer) => customer.customerName))].sort(
      (a, b) => a.localeCompare(b),
    );
  },
});

// List all items in inventory, optionally scoped to one customer.
export const listInventory = query({
  args: { 
    searchTerm: v.optional(v.string()),
    customerName: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    let lineItems: Doc<"lineItems">[];

    // If a search term is provided, use Convex Full-Text Search
    if (args.searchTerm && args.searchTerm.trim() !== "") {
      lineItems = await ctx.db
        .query("lineItems")
        .withSearchIndex("search_line_items", (q) =>
          q.search("searchField", args.searchTerm!)
        )
        .take(50); // Adjust limit as needed
    } else {
      // Fallback to your original reading logic when no search term is entered
      lineItems = await readLineItems(ctx, args.customerName);
    }
    
    return await Promise.all(
      lineItems.map(async (lineItem) => {
        const row = await hydrateLineItem(ctx, lineItem);
        const invoice = lineItem.invoiceId
          ? await ctx.db.get("invoices", lineItem.invoiceId)
          : null;

        return { ...row, invoiceNumber: invoice?.orderId ?? null };
      }),
    );
  },
});

// Query latest items, optionally scoped to one customer.
export const listLatestItems = query({
  args: { customerName: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const lineItems = await readLatestLineItems(ctx, args.customerName);

    return await Promise.all(
      lineItems.map((lineItem) => hydrateLineItem(ctx, lineItem)),
    );
  },
});

/**
 * Tracked items and receipt cost grouped by item category. Used by the
 * dashboard donut chart, optionally scoped to one customer.
 */
export const getStockByCategory = query({
  args: { customerName: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const lineItems = await readLineItems(ctx, args.customerName);

    // Resolve each distinct item once instead of reading per line item.
    const itemIds = [...new Set(lineItems.map((lineItem) => lineItem.itemId))];
    const items = await Promise.all(
      itemIds.map((itemId) => ctx.db.get("items", itemId)),
    );
    const categoryByItemId = new Map(
      items
        .filter((item) => item !== null)
        .map((item) => [item._id, item.category.trim() || "Uncategorized"]),
    );

    const totals = new Map<
      string,
      { category: string; itemCount: number; totalCost: number }
    >();

    for (const lineItem of lineItems) {
      const category = categoryByItemId.get(lineItem.itemId) ?? "Uncategorized";
      const current = totals.get(category) ?? {
        category,
        itemCount: 0,
        totalCost: 0,
      };

      // Count each receipt line as one item; stored quantities stay untouched.
      current.itemCount += 1;
      current.totalCost +=
        lineItem.total ??
        (lineItem.quantity !== null && lineItem.unitPrice !== null
          ? lineItem.quantity * lineItem.unitPrice
          : 0);

      totals.set(category, current);
    }

    const categories = [...totals.values()]
      .map((entry) => ({
        ...entry,
        totalCost: roundToTwo(entry.totalCost),
      }))
      .sort(
        (a, b) =>
          b.totalCost - a.totalCost ||
          b.itemCount - a.itemCount ||
          a.category.localeCompare(b.category),
      );

    return {
      categories,
      totalItems: categories.reduce((sum, entry) => sum + entry.itemCount, 0),
      totalCost: roundToTwo(
        categories.reduce((sum, entry) => sum + entry.totalCost, 0),
      ),
    };
  },
});

// Import into existing inventory

// Import and replace existing inventory
