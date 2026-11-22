import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { query, type QueryCtx } from "../_generated/server";
import {
  INVENTORY_LIMIT,
  LATEST_LIMIT,
  resolveCustomerIds,
  roundToTwo,
} from "./helpers";
import { monthBoundsUtc, toYearMonth } from "../lib/date";
import * as Stock from "../model/stock";
import * as Customer from "../model/customer";
import * as Invoice from "../model/invoice";

//-------------------------------------------------
// PAGE HEADER
//-------------------------------------------------

/** Distinct customer names, used as workspaces across the app. */
export const listWorkspaces = query({
  args: {},
  handler: async (ctx) => {
    // List relevant customers
    const customers = await Customer.listCustomers(ctx);

    return [
      ...new Set(customers.map((customer) => customer.customerName)),
    ].sort((a, b) => a.localeCompare(b));
  },
});

// Query list of relevant months
export const getActivePeriods = query({
  args: {},
  handler: async (ctx) => {
    // Get customer ids
    const customerIds = Customer.getAllowedCustomerIds(ctx);

    const [invoicesArrays, lineItemsArrays] = await Promise.all([
      Promise.all(
        (await customerIds).map((customerId) =>
          ctx.db
            .query("invoices")
            .withIndex("by_customerId_and_orderDate", (q) =>
              q.eq("customerId", customerId),
            )
            .collect(),
        ),
      ),
      Promise.all(
        (await customerIds).map((customerId) =>
          ctx.db
            .query("lineItems")
            .withIndex("by_customerId_and_orderDate", (q) =>
              q.eq("customerId", customerId),
            )
            .collect(),
        ),
      ),
    ]);

    const invoices = invoicesArrays.flat();
    const lineItems = lineItemsArrays.flat();

    const seen = new Map<string, { year: number; month: number }>();

    const add = (ms: number) => {
      const { year, month } = toYearMonth(ms);
      const key = `${year}-${String(month).padStart(2, "0")}`;
      if (!seen.has(key)) seen.set(key, { year, month });
    };

    for (const row of invoices) {
      if (row.orderDate !== null) add(row.orderDate);
    }
    for (const row of lineItems) {
      if (row.orderDate !== null) add(row.orderDate);
    }

    // If no active periods, get current month
    if (seen.size === 0) {
      return [toYearMonth(Date.now())];
    }

    return Array.from(seen.values()).sort(
      (a, b) => b.year - a.year || b.month - a.month,
    );
  },
});

/** Functions located ".\convex\inventory\invoices.ts"
 * Upload invoice
 * Import into existing inventory
 * Import and replace existing inventory
 */

// Export
// Based on Customer and Month
// Choose filetype .xlsx, .img, .csv
// Add together totals and stocks
// Add associated items
// Compare to manual input'
// Create spreadsheet design

/** Functions located ".\convex\inventory\items.ts"
 * Add Item and Stock Entry
 */

//-------------------------------------------------
// DASHBOARD
//-------------------------------------------------

/**
 * Customer IDs for one workspace name. A workspace is a name, so several
 * `customers` rows can match; the result stays limited to rows the signed-in
 * user may read.
 */
async function workspaceCustomerIds(
  ctx: QueryCtx,
  customerName: string | undefined,
) {
  const allowedCustomerIds = await Customer.getAllowedCustomerIds(ctx);
  return resolveCustomerIds(ctx, customerName, allowedCustomerIds);
}

// Total invoices
export const totalInvoices = query({
  args: {
    customerName: v.string(),
    orderDate: v.number(),
  },
  handler: async (ctx, args) => {
    const customerIds = await workspaceCustomerIds(ctx, args.customerName);
    const { start, end } = monthBoundsUtc(args.orderDate);

    const invoices = await Promise.all(
      customerIds.map((customerId) =>
        ctx.db
          .query("invoices")
          .withIndex("by_customerId_and_orderDate", (q) =>
            q
              .eq("customerId", customerId)
              .gte("orderDate", start)
              .lt("orderDate", end),
          )
          .collect(),
      ),
    );

    return invoices.reduce((sum, rows) => sum + rows.length, 0);
  },
});

// Total items this month
export const totalItems = query({
  args: {
    customerName: v.string(),
    orderDate: v.number(),
  },
  handler: async (ctx, args) => {
    const customerIds = await workspaceCustomerIds(ctx, args.customerName);
    const { start, end } = monthBoundsUtc(args.orderDate);

    const lineItems = await Promise.all(
      customerIds.map((customerId) =>
        ctx.db
          .query("lineItems")
          .withIndex("by_customerId_and_orderDate", (q) =>
            q
              .eq("customerId", customerId)
              .gte("orderDate", start)
              .lt("orderDate", end),
          )
          .collect(),
      ),
    );

    return lineItems.reduce((sum, rows) => sum + rows.length, 0);
  },
});

// Total costs this month
export const totalCosts = query({
  args: {
    customerName: v.string(),
    orderDate: v.number(),
  },
  handler: async (ctx, args) => {
    const customerIds = await workspaceCustomerIds(ctx, args.customerName);
    const { start, end } = monthBoundsUtc(args.orderDate);

    const lineItems = await Promise.all(
      customerIds.map((customerId) =>
        ctx.db
          .query("lineItems")
          .withIndex("by_customerId_and_orderDate", (q) =>
            q
              .eq("customerId", customerId)
              .gte("orderDate", start)
              .lt("orderDate", end),
          )
          .collect(),
      ),
    );

    const totalCost = lineItems
      .flat()
      .reduce((sum, item) => sum + (item.total ?? 0), 0);

    return roundToTwo(totalCost);
  },
});

// Total of all flagged invoices this month
export const totalFlaggedInvoices = query({
  args: {
    customerName: v.string(),
    orderDate: v.number(),
  },
  handler: async (ctx, args) => {
    const customerIds = await workspaceCustomerIds(ctx, args.customerName);
    const { start, end } = monthBoundsUtc(args.orderDate);

    const flaggedInvoices = await Promise.all(
      customerIds.map((customerId) =>
        ctx.db
          .query("flaggedInvoices")
          .withIndex("by_customerId_and_creationDate", (q) =>
            q
              .eq("customerId", customerId)
              .gte("createdAt", start)
              .lt("createdAt", end),
          )
          .collect(),
      ),
    );

    return flaggedInvoices.reduce((sum, rows) => sum + rows.length, 0);
  },
});

// Tracked items and receipt cost grouped by item category.
// Used by the dashboard donut chart, scoped to one workspace.
export const getStockByCategory = query({
  args: {
    customerName: v.string(),
    orderDate: v.number(),
  },
  handler: async (ctx, args) => {
    const customerIds = await workspaceCustomerIds(ctx, args.customerName);

    // Define time range
    const { start, end } = monthBoundsUtc(args.orderDate);

    // Get line items for every customer row behind the workspace name.
    const lineItems = (
      await Promise.all(
        customerIds.map((customerId) =>
          ctx.db
            .query("lineItems")
            .withIndex("by_customerId_and_orderDate", (q) =>
              q
                .eq("customerId", customerId)
                .gte("orderDate", start)
                .lt("orderDate", end),
            )
            .take(INVENTORY_LIMIT),
        ),
      )
    ).flat();

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

// Invoices received by day
export const getMonthlyInvoicesForEachDay = query({
  args: {
    customerId: v.id("customers"),
    orderDate: v.number(),
  },
  handler: async (ctx, args) => {
    // Validate customer
    await Customer.validateCustomer(ctx, args.customerId);

    // Get time range
    const { start, end } = monthBoundsUtc(args.orderDate);

    // 1. Fetch invoices for the month using your existing efficient index
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_customerId_and_orderDate", (q) =>
        q
          .eq("customerId", args.customerId)
          .gte("orderDate", start)
          .lt("orderDate", end),
      )
      .collect();

    // 2. Count invoices per day using a Map (key: "YYYY-MM-DD")
    const countsMap = new Map<string, number>();
    for (const invoice of invoices) {
      if (invoice.orderDate == null) continue;
      const dayKey = new Date(invoice.orderDate).toISOString().split("T")[0];
      countsMap.set(dayKey, (countsMap.get(dayKey) || 0) + 1);
    }

    // 3. Generate an array for every single day of the month
    // (ensures days with 0 invoices are included for charts/lists)
    const result = [];
    const currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate < endDate) {
      const dayKey = currentDate.toISOString().split("T")[0];
      result.push({
        date: dayKey,
        count: countsMap.get(dayKey) || 0,
      });
      // Move to the next day safely in UTC
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    return result;
  },
});

// Query latest items, optionally scoped to one customer.
export const listLatestItems = query({
  args: {
    customerName: v.optional(v.string()),
    orderDate: v.number(),
  },
  handler: async (ctx, args) => {
    const customerIds = await workspaceCustomerIds(ctx, args.customerName);

    const batches = await Promise.all(
      customerIds.map((customerId) =>
        Stock.readLatestLineItems(ctx, customerId, args.orderDate),
      ),
    );

    const lineItems = batches
      .flat()
      .sort((a, b) => b._creationTime - a._creationTime)
      .slice(0, LATEST_LIMIT);

    return await Promise.all(
      lineItems.map((lineItem) => Stock.hydrateLineItem(ctx, lineItem)),
    );
  },
});

// Needs review

//-------------------------------------------------
// INVENTORY
//-------------------------------------------------

// List all items in inventory, optionally scoped to one customer.
export const listInventory = query({
  args: {
    searchTerm: v.optional(v.string()),
    customerName: v.optional(v.string()),
    orderDate: v.number(), // UTC month start
  },
  handler: async (ctx, args) => {
    const customerIds = await workspaceCustomerIds(ctx, args.customerName);

    // Define time range
    const { start, end } = monthBoundsUtc(args.orderDate);

    // Fetch line items for every customer row behind the workspace name
    const lineItems = (
      await Promise.all(
        customerIds.map((customerId) =>
          Stock.readLineItems(ctx, {
            searchTerm: args.searchTerm,
            customerId,
            start,
            end,
            paginationOpts: {
              numItems: INVENTORY_LIMIT,
              cursor: null,
            },
          }),
        ),
      )
    )
      .flatMap((result) => result)
      .sort(
        (a, b) =>
          (b.orderDate ?? 0) - (a.orderDate ?? 0) ||
          b._creationTime - a._creationTime,
      )
      .slice(0, INVENTORY_LIMIT);

    const inventory = await Promise.all(
      lineItems.map(async (lineItem) => {
        const row = await Stock.hydrateLineItem(ctx, lineItem);
        const invoice = lineItem.invoiceId
          ? await ctx.db.get("invoices", lineItem.invoiceId)
          : null;

        return {
          ...row,
          invoiceNumber: invoice?.orderId ?? null,
        };
      }),
    );

    return inventory;
  },
});

//-------------------------------------------------
// INVOICES
//-------------------------------------------------

// List successful invoices
export const listInvoices = query({
  args: {
    searchTerm: v.optional(v.string()),
    customerId: v.id("customers"),
    orderDate: v.number(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    // Validate customer
    await Customer.validateCustomer(ctx, args.customerId);

    // Get time range
    const { start, end } = monthBoundsUtc(args.orderDate);

    // Fetch invoices for the month using your existing efficient index
    const invoices = await Invoice.readInvoices(ctx, {
      searchTerm: args.searchTerm,
      customerId: args.customerId,
      start,
      end,
      paginationOpts: args.paginationOpts,
    });

    const invoiceList = await Promise.all(
      invoices.map(async (invoice) => {
        const row = await Invoice.hydrateInvoice(ctx, invoice);
        return {
          ...row,
          invoiceNumber: invoice?.orderId ?? null,
        };
      }),
    );

    return invoiceList;
  },
});

/** Functions located ".\convex\inventory\flaggedInvoices.ts"
 * List flagged invoices based on customerids and userid
 */

// All Invoices

// Reviews

//-------------------------------------------------
// OTHER
//-------------------------------------------------

// Query invoices and stock by relevant months
export const getDataForMonth = query({
  args: {
    orderDate: v.number(),
  },
  handler: async (ctx, args) => {
    const { start, end } = monthBoundsUtc(args.orderDate);

    const [invoices, lineItems] = await Promise.all([
      ctx.db
        .query("invoices")
        .withIndex("by_orderDate", (q) =>
          q.gte("orderDate", start).lt("orderDate", end),
        )
        .collect(),
      ctx.db
        .query("lineItems")
        .withIndex("by_orderDate", (q) =>
          q.gte("orderDate", start).lt("orderDate", end),
        )
        .collect(),
    ]);

    return { invoices, lineItems };
  },
});
