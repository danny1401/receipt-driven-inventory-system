import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import * as Item from "../model/item";
import * as Customer from "../model/customer";
import * as Supplier from "../model/supplier";
import * as Stock from "../model/stock";

// Get Item
export const getItem = query({
  args: {
    itemId: v.id("items"),
  },
  handler: async (ctx, args) => {
    const item = await Item.findItembyItemId(ctx, args.itemId);

    return item;
  },
});

// Get total items this month
export const totalItems = query({
  args: {},
  handler: async (ctx) => {
    // Get the customer IDs this user is allowed to see
    const allowedCustomerIds = await Customer.getAllowedCustomerIds(ctx);
    if (allowedCustomerIds.length === 0) {
      return 0; // Return early if they have access to nothing
    }

    // Fetch invoices for each allowed customer in parallel using the index
    const results = await Promise.all(
      allowedCustomerIds.map(async (customerId) => {
        return await ctx.db
          .query("lineItems")
          .withIndex("by_customerId", (q) => 
            q.eq("customerId", customerId as Id<"customers">)
          )
          .collect();
      })
    );

    // Flatten the arrays and get the total count
    const totalCount = results.flat().length;

    return totalCount;
  },
});

// Add Item?

// Add Item and Stock Entry
export const addItemAndStockEntry = mutation({
  args: {
    invoiceId: v.optional(v.id("invoices")),
    
    sku: v.union(v.string(), v.null()),
    itemName: v.string(),
    category: v.string(),

    orderDate: v.number(),
    quantity: v.number(),
    quantityUnit: v.string(),
    unitPrice: v.number(),
    total: v.number(),

    supplierId: v.id("suppliers"),
    customerId: v.id("customers"),

    searchField: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Validate
    await Supplier.validateSupplier(ctx, args.supplierId);
    await Customer.validateCustomer(ctx, args.customerId);

    // 2. Get or create the inventory item
    const itemId = await Item.getOrCreateItem(ctx, {
      sku: args.sku,
      itemName: args.itemName,
      category: args.category,
      supplierId: args.supplierId,
    });

    // 3. Insert stock entry
    await Stock.createStockEntry(ctx, {
      ...args,
      itemId,
    });

    return {
      success: true,
      message: `${args.itemName} was successfully added to the inventory.`,
    };
  },
});

// Update Item
export const updateItem = mutation({
  args: {
    itemId: v.id("items"),
    invoiceId: v.optional(v.id("invoices")),
    customerId: v.id("customers"),
    supplierId: v.id("suppliers"),

    sku: v.union(v.string(), v.null()),
    itemName: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingStock = await Stock.findStockEntriesByItemId(ctx, {
      itemId: args.itemId,
    });
    const existingItem = await Item.findItembyItemId(
      ctx,
      existingStock[0].itemId,
    );

    const itemName = args.itemName?.trim() || existingItem.itemName;
    const category = args.category?.trim() || existingItem.category;
    const searchField = itemName.toLowerCase();

    await Item.updateItem(ctx, {
      itemId: args.itemId,
      sku: args.sku,
      itemName,
      category,
      supplierId: args.supplierId,
    });

    // An item name is shared by every line item that references it, so keep
    // their search values in sync when the name changes.
    for (const stock of existingStock) {
      if (stock.searchField !== searchField) {
        await ctx.db.patch("lineItems", stock._id, { searchField });
      }
    }

    return {
      success: true,
      message: `Successfully updated the item ${itemName} in the inventory.`,
    };
  },
});

// Delete Item Type and all stock entries
export const deleteItemAndStockEntries = mutation({
  args: {
    itemId: v.id("items"),
  },
  handler: async (ctx, args) => {
    // Ensure the item exists first
    await Item.findItembyItemId(ctx, args.itemId);

    // Find all line items associated with this item using your index
    const stockEntries = await Stock.findStockEntriesByItemId(ctx, {
      itemId: args.itemId,
    });

    // Delete each associated line item
    for (const stock of stockEntries) {
      await ctx.db.delete(stock._id);
    }

    // Now delete the parent item itself
    await ctx.db.delete(args.itemId);

    return {
      success: true,
      message: `Deleted item and ${stockEntries.length} associated line item(s).`,
    };
  },
});