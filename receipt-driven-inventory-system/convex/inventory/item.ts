import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getCustomerId, getItemId, getSupplierId } from "./helpers";

// Get Line Item
export const getSingleLineItem = query({
  args: { 
    itemId: v.id("lineItems") 
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get("lineItems", args.itemId);
    return item;
  },
});

// Add Item Type and Line Item
export const addItem = mutation({
  args: {
    invoiceId: v.optional(v.id("invoices")),

    sku: v.union(v.string(), v.null()),
    itemName: v.string(),
    category: v.string(),
    
    quantity: v.number(),
    quantityUnit: v.string(),
    unitPrice: v.number(),
    total: v.number(),

    supplierId: v.id("suppliers"),
    customerId: v.id("customers"),
  },
  handler: async (ctx, args) => {
    // Optional safety check: Verify the supplier exists
    const supplier = await ctx.db.get(args.supplierId);
    if (!supplier) {
      throw new Error("Specified supplier does not exist.");
    }
    const customer = await ctx.db.get(args.customerId);
    if (!customer) {
      throw new Error("Specified customer does not exist.");
    }

    // Check if the item already exists in the inventory
    const existingItem = await ctx.db
      .query("items")
      .withIndex("by_itemName", (q) => q.eq("itemName", args.itemName))
      .filter((q) => q.eq(q.field("supplierId"), args.supplierId))
      .unique();

    let itemId;
    if (existingItem) {
      // If it exists, reuse its existing _id
      itemId = existingItem._id;
    } else {
      // If it doesn't exist, create it and get the new _id
      itemId = await ctx.db.insert("items", {
        sku: args.sku,
        itemName: args.itemName,
        category: args.category,
        supplierId: args.supplierId,
      });
    }

    await ctx.db.insert("lineItems", {
      invoiceId: args.invoiceId,
      quantity: args.quantity,
      quantityUnit: args.quantityUnit,
      unitPrice: args.unitPrice,
      total: args.total,

      itemId: itemId,
      customerId: args.customerId,
    });

    return { 
      success: true, 
      message: `${args.itemName} was successfully added to the inventory.` 
    };
  },
});

// Update Item Type & Line Item
export const updateItem = mutation({
  args: { 
    itemId: v.id("lineItems"),
    invoiceId: v.optional(v.id("invoices")),
    customerId: v.id("customers"), 

    sku: v.union(v.string(), v.null()),
    itemName: v.optional(v.string()),
    category: v.optional(v.string()),

    quantity: v.optional(v.number()),
    quantityUnit: v.optional(v.string()),
    unitPrice: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Separate the itemId from the rest of the arguments
    const { itemId, invoiceId, customerId, sku, itemName, category, quantity, quantityUnit, unitPrice } = args;

    // Check if the line item exists first
    const existingLineItem = await ctx.db.get(args.itemId);
    if (!existingLineItem) {
      throw new Error("Line item not found");
    }

    // Calculate total safely using new inputs or falling back to existing DB values
    const finalQuantity = quantity ?? existingLineItem.quantity;
    const finalUnitPrice = unitPrice ?? existingLineItem.unitPrice;
    
    let calculatedTotal = existingLineItem.total;
    if (finalQuantity !== null && finalQuantity !== undefined && finalUnitPrice !== null && finalUnitPrice !== undefined) {
      calculatedTotal = finalQuantity * finalUnitPrice;
    }

    // Build the updates object for the 'lineItems' table
    const lineItemUpdates: Record<string, any> = {};
    if (invoiceId !== undefined) lineItemUpdates.invoiceId = invoiceId;
    if (customerId !== undefined) lineItemUpdates.customerId = customerId;
    if (quantity !== undefined) lineItemUpdates.quantity = quantity;
    if (quantityUnit !== undefined) lineItemUpdates.quantityUnit = quantityUnit;
    if (unitPrice !== undefined) lineItemUpdates.unitPrice = unitPrice;
    lineItemUpdates.total = calculatedTotal; // Always update with the fresh total

    // Patch the lineItems table
    await ctx.db.patch(itemId, lineItemUpdates);

    // If the client sent any catalog fields (sku, itemName, category), 
    // update the parent 'items' table using existingLineItem.itemId
    if (sku !== undefined || itemName !== undefined || category !== undefined) {
      const itemUpdates: Record<string, any> = {};
      if (sku !== undefined) itemUpdates.sku = sku;
      if (itemName !== undefined) itemUpdates.itemName = itemName;
      if (category !== undefined) itemUpdates.category = category;

      await ctx.db.patch(existingLineItem.itemId, itemUpdates);
    }
    return { 
      success: true, 
      message: `Successfully updated the item ${args.itemName} in the inventory.` 
    };
  },
});

// Delete Line Item (Quantity, Unit Price etc.)
export const deleteLineItem = mutation({
  args: {
    itemId: v.id("lineItems"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete("lineItems", args.itemId);

    return { 
      success: true, 
      message: `Successfully deleted invoice: ${args.itemId}` 
    };
  },
});

// Get Item Type
export const getSingleItemType = query({
  args: { 
    itemName: v.string(), 
  },
  handler: async (ctx, args) => {
    const item = await ctx.db
    .query("items")
    .withIndex("by_itemName", (q) =>
      q.eq("itemName", args.itemName),
    )
    .unique()

    return item;
  },
});

// Delete Item Type and all line item quantities
export const deleteItemWithLineItems = mutation({
  args: {
    itemId: v.id("items"),
  },
  handler: async (ctx, args) => {
    // Ensure the item exists first
    const item = await ctx.db.get(args.itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    // Find all line items associated with this item using your index
    const lineItems = await ctx.db
      .query("lineItems")
      .withIndex("by_itemId", (q) => q.eq("itemId", args.itemId))
      .collect();

    // Delete each associated line item
    for (const lineItem of lineItems) {
      await ctx.db.delete(lineItem._id);
    }

    // Now delete the parent item itself
    await ctx.db.delete(args.itemId);

    return { 
      success: true, 
      message: `Deleted item and ${lineItems.length} associated line item(s).` 
    };
  },
});