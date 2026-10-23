import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";

// Generate a short-lived upload URL
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Upload Invoice
export const uploadInvoice = mutation({
  args: {
    fileName: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // Schedule the PDF extraction action to run immediately in the background
    await ctx.scheduler.runAfter(
      0,
      internal.invoice.processInvoice.processInvoice,
      {
        storageId: args.storageId,
        fileName: args.fileName,
        createdAt: Date.now(),
      },
    );
  },
});

// List all processed invoices
export const listInvoices = query({
  args: {},
  handler: async (ctx) => {
    const invoices = await ctx.db.query("invoices").collect();
    return invoices;
  },
});

// Get invoice
export const getInvoice = query({
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

    const attachmentUrl = await ctx.storage.getUrl(processedInvoice.storageId);
    if (!attachmentUrl) {
      throw new Error(`File "${args.fileName}" was not found in the file storage.`);
    }

    const invoice = {...processedInvoice, attachmentUrl};

    return invoice;
  },
});

// Add invoice
export const addInvoice = mutation({
  args: { 
    fileName: v.string(),
    storageId: v.id("_storage"),

    orderId: v.union(v.string(), v.null()),
    orderDate: v.union(v.string(), v.null()),
    deliveringDate: v.union(v.string(), v.null()),

    supplierId: v.id("suppliers"),
    customerId: v.id("customers"),

    sum: v.optional(v.union(v.number(), v.null())),
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
      orderId: args.orderId,
      orderDate: args.orderDate,
      deliveringDate: args.deliveringDate,
      supplierId: args.supplierId,
      customerId: args.customerId,
      sum: args.sum,
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

    // Patch the invoice document
    await ctx.db.patch(invoiceId, updates);

    return {
      success: true,
      message: `Successfully updated invoice record.`,
    };
  },
})

// Delete invoice
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
    
    // Delete the file from Convex File Storage
    await ctx.storage.delete(processedInvoice.storageId);

    // Delete the row from your database table
    await ctx.db.delete(processedInvoice._id);

    return { 
      success: true, 
      message: `Successfully deleted invoice: ${args.fileName}` 
    };
  },
});

// List all flagged invoices
export const listFlaggedInvoices = query({
  args: {},
  handler: async (ctx) => {
    const invoices = await ctx.db.query("flaggedInvoices").collect();
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
      throw new Error(`File "${args.fileName}" was not found in the file storage.`);
    }

    const invoice = {...flaggedInvoice, attachmentUrl};

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
      message: `Successfully deleted invoice: ${args.fileName}` 
    };
  },
});

// List all suppliers
export const listSuppliers = query({
  args: {},
  handler: async (ctx) => {
    const suppliers = await ctx.db.query("suppliers").collect();
    return suppliers;
  },
});

// List all customers
export const listCustomers = query({
  args: {},
  handler: async (ctx) => {
    const customers = await ctx.db.query("customers").collect();
    return customers;
  },
});