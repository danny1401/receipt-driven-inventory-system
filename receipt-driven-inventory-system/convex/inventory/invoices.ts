import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { resolveCustomerIds } from "./helpers";
import * as Invoice from "../model/invoice";
import * as Customer from "../model/customer";
import * as Permission from "../model/permission";

// Generate a short-lived upload URL
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Upload Invoice
export const uploadInvoice = mutation({
  args: {
    fileName: v.string(),
    storageId: v.id("_storage"),
    customerId: v.optional(v.id("customers")),
  },
  handler: async (ctx, args) => {
    // Derive the uploader server-side; it is granted access to the customer
    // once the invoice is saved.
    const userId = await Permission.getCurrentUserId(ctx);

    // Schedule the PDF extraction action to run immediately in the background
    await ctx.scheduler.runAfter(
      0,
      internal.invoice_pipeline.processInvoice.processInvoice,
      {
        storageId: args.storageId,
        fileName: args.fileName,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: "Manually added",
        customerId: args.customerId,
        ...(userId ? { userId } : {}),
      },
    );
  },
});

// Get invoice
export const getInvoice = query({
  args: {
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the database record using the fileName index
    const processedInvoice = await Invoice.findInvoiceByFilename(
      ctx,
      args.fileName,
    );
    if (!processedInvoice) {
      throw new Error(`File "${args.fileName}" was not found in the database.`);
    }

    const attachmentUrl = await ctx.storage.getUrl(processedInvoice.storageId);
    if (!attachmentUrl) {
      throw new Error(
        `File "${args.fileName}" was not found in the file storage.`,
      );
    }

    const invoice = { ...processedInvoice, attachmentUrl };

    return invoice;
  },
});

// List all processed and flagged invoices
export const listAllInvoices = query({
  args: {
    searchTerm: v.optional(v.string()),
    customerName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Only ever read invoices belonging to customers this user can access.
    const allowedCustomerIds = await Customer.getAllowedCustomerIds(ctx);
    if (allowedCustomerIds.length === 0) {
      return [];
    }

    // Restrict to the requested workspace, when one is supplied.
    const targetCustomerIds = await resolveCustomerIds(
      ctx,
      args.customerName,
      allowedCustomerIds,
    );
    if (targetCustomerIds.length === 0) {
      return [];
    }

    const LIMIT = 50;
    const searchTerm = args.searchTerm?.trim();
    const invoices = searchTerm
      ? await Invoice.searchInvoicesForCustomers(
          ctx,
          targetCustomerIds,
          searchTerm,
          LIMIT,
        )
      : await Invoice.readInvoicesForCustomers(ctx, targetCustomerIds, LIMIT);

    // Hydrate invoices and check flagged status in parallel
    const combinedList = await Promise.all(
      invoices.map(async (invoice) => {
        const [hydrated, flagged] = await Promise.all([
          Invoice.hydrateInvoice(ctx, invoice),
          ctx.db
            .query("flaggedInvoices")
            .withIndex("by_fileName", (q) => q.eq("fileName", invoice.fileName))
            .first(),
        ]);

        return {
          ...hydrated,
          isFlagged: !!flagged,
          flaggedInfo: flagged ?? null,
        };
      }),
    );

    return combinedList;
  },
});

// Add invoice
export const addInvoice = mutation({
  args: {
    fileName: v.string(),
    storageId: v.id("_storage"),

    orderId: v.union(v.string(), v.null()),
    orderDate: v.union(v.number(), v.null()),
    deliveringDate: v.union(v.string(), v.null()),

    supplierId: v.id("suppliers"),
    customerId: v.id("customers"),

    sum: v.optional(v.union(v.number(), v.null())),
    searchField: v.string(),
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

    // 3. Insert the new invoice into the database
    const invoiceId = await ctx.db.insert("invoices", {
      fileName: args.fileName,
      storageId: args.storageId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: "Manually added",
      orderId: args.orderId,
      orderDate: args.orderDate,
      deliveringDate: args.deliveringDate,
      supplierId: args.supplierId,
      customerId: args.customerId,
      sum: args.sum,
      searchField: args.fileName.toLowerCase(),
    });

    // Return success along with the new ID
    return {
      success: true,
      invoiceId,
      message: `Successfully created invoice for file: ${args.fileName}`,
    };
  },
});

// Update invoice
export const updateInvoice = mutation({
  args: {
    invoiceId: v.id("invoices"),

    orderId: v.optional(v.union(v.string(), v.null())),
    orderDate: v.optional(v.union(v.string(), v.null())),
    deliveringDate: v.optional(v.union(v.string(), v.null())),

    supplierId: v.optional(v.id("suppliers")),
    customerId: v.optional(v.id("customers")),

    sum: v.optional(v.union(v.number(), v.null())),
    fileName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { invoiceId, ...fieldsToUpdate } = args;

    // Check if the invoice exists first
    const existingInvoice = await ctx.db.get(invoiceId);
    if (!existingInvoice) {
      throw new Error("Invoice not found");
    }

    // Build a clean update object containing only fields provided by the client
    const updates: Record<string, any> = {};
    for (const [key, value] of Object.entries(fieldsToUpdate)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }

    // Always include the status and timestamp on updates
    updates.status = "Edited";
    updates.updatedAt = Date.now();

    // Patch the invoice document
    await ctx.db.patch(invoiceId, updates);

    return {
      success: true,
      message: `Successfully updated invoice record.`,
    };
  },
});

// Delete invoice and all item types (if not in aother invoices) and line items
export const deleteInvoice = mutation({
  args: {
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the database record using the fileName index
    const processedInvoice = await ctx.db
      .query("invoices")
      .withIndex("by_fileName", (q) => q.eq("fileName", args.fileName))
      .unique();

    if (!processedInvoice) {
      throw new Error(`File "${args.fileName}" was not found in the database.`);
    }

    // Fetch all line items belonging to this invoice
    const lineItems = await ctx.db
      .query("lineItems")
      .withIndex("by_invoiceId", (q) => q.eq("invoiceId", processedInvoice._id))
      .collect();

    // Extract unique item IDs referenced in this invoice
    const itemIds = [...new Set(lineItems.map((li) => li.itemId))];

    // 3. Delete all line items for this invoice
    for (const lineItem of lineItems) {
      await ctx.db.delete(lineItem._id);
    }

    // Check each item: delete it only if it's NOT used in any other invoice
    for (const itemId of itemIds) {
      const relatedLineItems = await ctx.db
        .query("lineItems")
        .withIndex("by_itemId_and_customerId", (q) => q.eq("itemId", itemId))
        .collect();

      // Check if any other line item points to this item from a DIFFERENT invoice
      const usedInOtherInvoices = relatedLineItems.some(
        (li) =>
          li.invoiceId !== processedInvoice._id && li.invoiceId !== undefined,
      );

      // If no other invoice uses this item, safe to delete from the items table
      if (!usedInOtherInvoices) {
        await ctx.db.delete(itemId);
      }
    }

    // Delete the file from Convex File Storage
    await ctx.storage.delete(processedInvoice.storageId);

    // Delete the row from your database table
    await ctx.db.delete(processedInvoice._id);

    return {
      success: true,
      message: `Successfully deleted invoice: ${args.fileName}`,
    };
  },
});
