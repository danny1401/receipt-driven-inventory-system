import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

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
      internal.invoice.invoiceProcessor.processInvoice,
      {
        storageId: args.storageId,
        fileName: args.fileName,
        createdAt: Date.now(),
      },
    );
  },
});

// OPTIONAL: If you need to get a URL to view/download the file later:
// const imageUrl = await ctx.storage.getUrl(args.storageId);