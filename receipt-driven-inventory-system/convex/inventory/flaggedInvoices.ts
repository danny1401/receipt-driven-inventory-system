import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import * as Customer from "../model/customer";

// List all flagged invoices
export const listFlaggedInvoices = query({
  args: {},
  handler: async (ctx) => {
    // Get the customer IDs this user is allowed to see
    const allowedCustomerIds = await Customer.getAllowedCustomerIds(ctx);
    if (allowedCustomerIds.length === 0) {
      return []; // Return early if they have access to nothing
    }

    // Fetch and filter invoices based on those customer IDs
    const invoices = await ctx.db
      .query("flaggedInvoices")
      .filter((q) => 
        q.or(...allowedCustomerIds.map((id) => q.eq(q.field("customerId"), id)))
      )
      .collect();

    return invoices;
  },
});

// Get flagged invoice
export const getFlaggedInvoice = query({
  args: {
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the database record using the fileName index
    const flaggedInvoice = await ctx.db
      .query("flaggedInvoices")
      .withIndex("by_fileName", (q) => q.eq("fileName", args.fileName))
      .unique();

    if (!flaggedInvoice) {
      throw new Error(`File "${args.fileName}" was not found in the database.`);
    }

    const attachmentUrl = await ctx.storage.getUrl(flaggedInvoice.storageId);
    if (!attachmentUrl) {
      throw new Error(
        `File "${args.fileName}" was not found in the file storage.`,
      );
    }

    const invoice = { ...flaggedInvoice, attachmentUrl };

    return invoice;
  },
});

// Delete flagged invoice
export const deleteFlaggedInvoice = mutation({
  args: {
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the database record using the fileName index
    const flaggedInvoice = await ctx.db
      .query("flaggedInvoices")
      .withIndex("by_fileName", (q) => q.eq("fileName", args.fileName))
      .unique();

    if (!flaggedInvoice) {
      throw new Error(`File "${args.fileName}" was not found in the database.`);
    }

    // Delete the file from Convex File Storage
    await ctx.storage.delete(flaggedInvoice.storageId);

    // Delete the row from your database table
    await ctx.db.delete(flaggedInvoice._id);

    return {
      success: true,
      message: `Successfully deleted invoice: ${args.fileName}`,
    };
  },
});
