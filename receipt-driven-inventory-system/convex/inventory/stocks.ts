import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { STOCK_ENTRY_LIMIT, totalByQuantityAndUnitPrice } from "./helpers";
import * as Item from "../model/item";
import * as Customer from "../model/customer";
import * as Stock from "../model/stock";

// Get stock entry
export const getStockEntry = query({
  args: {
    lineItemId: v.id("lineItems"),
  },
  handler: async (ctx, args) => {
    const item = await Stock.findStockEntry;
    return item;
  },
});

/** Every stock addition for one item in one customer workspace. */
export const listStockEntries = query({
  args: {
    itemId: v.id("items"),
    customerId: v.id("customers"),
  },
  handler: async (ctx, args) => {
    const entries = await Stock.findStockEntriesByItemIdAndCustomerID(ctx, {
      itemId: args.itemId,
      customerId: args.customerId,
      limit: STOCK_ENTRY_LIMIT,
    });

    const invoiceIds = [
      ...new Set(
        entries.flatMap((entry) => (entry.invoiceId ? [entry.invoiceId] : [])),
      ),
    ];
    const invoices = await Promise.all(
      invoiceIds.map((invoiceId) => ctx.db.get("invoices", invoiceId)),
    );
    const invoiceNumberById = new Map(
      invoices
        .filter((invoice) => invoice !== null)
        .map((invoice) => [invoice._id, invoice.orderId]),
    );

    return entries.map((entry) => ({
      id: entry._id,
      quantity: entry.quantity,
      quantityUnit: entry.quantityUnit,
      unitPrice: entry.unitPrice,
      total: entry.total,
      createdAt: entry._creationTime,
      updatedAt: entry.updatedAt,
      invoiceNumber: entry.invoiceId
        ? (invoiceNumberById.get(entry.invoiceId) ?? null)
        : null,
    }));
  },
});

/** Add one manual stock entry to an existing item. */
export const addStockEntry = mutation({
  args: {
    itemId: v.id("items"),
    customerId: v.id("customers"),
    orderDate: v.number(),
    quantity: v.number(),
    quantityUnit: v.string(),
    unitPrice: v.number(),
  },
  handler: async (ctx, args) => {
    // 1. Validate
    const item = await Item.findItembyItemId(ctx, args.itemId);
    await Customer.validateCustomer(ctx, args.customerId);

    const quantityUnit = args.quantityUnit.trim();
    if (!quantityUnit) throw new Error("A unit is required.");

    // Total = Quantity * UnitPrice
    const total = totalByQuantityAndUnitPrice(args.quantity, args.unitPrice);

    // Insert the line item
    await Stock.createStockEntry(ctx, {
      ...args,
      total,
      itemName: item.itemName,
    });

    return { success: true, total };
  },
});

/** Change the quantity or unit price of one stock entry. */
export const updateStockEntry = mutation({
  args: {
    lineItemId: v.id("lineItems"),
    quantity: v.number(),
    quantityUnit: v.string(),
    unitPrice: v.number(),
  },
  handler: async (ctx, args) => {
    // Validate
    await Stock.findStockEntry(ctx, args);

    const quantityUnit = args.quantityUnit.trim();
    if (!quantityUnit) throw new Error("A unit is required.");

    // Total = Quantity * UnitPrice
    const total = totalByQuantityAndUnitPrice(args.quantity, args.unitPrice);

    await Stock.updateStockEntry(ctx, {
      ...args,
      quantityUnit,
      total,
    });

    return { success: true, total };
  },
});

// Delete Stock Entry
export const deleteStockEntry = mutation({
  args: {
    lineItemId: v.id("lineItems"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete("lineItems", args.lineItemId);

    return {
      success: true,
      message: `Successfully deleted invoice: ${args.lineItemId}`,
    };
  },
});

// Delete all stock entries
export const deleteStockEntries = mutation({
  args: {
    itemId: v.id("items"),
  },
  handler: async (ctx, args) => {
    // Find all line items associated with this item using your index
    const stockEntries = await Stock.findStockEntriesByItemId(ctx, {
      itemId: args.itemId,
    });

    // Delete each associated line item
    for (const stock of stockEntries) {
      await ctx.db.delete(stock._id);
    }

    return {
      success: true,
      message: `Successfully deleted invoice: ${args.itemId}`,
    };
  },
});