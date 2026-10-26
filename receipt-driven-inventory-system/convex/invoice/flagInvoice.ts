import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

export const flagInvoice = internalMutation({
  args: {
    fileName: v.string(),
    storageId: v.id("_storage"),
    createdAt: v.number(),
    searchField: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingFile = await ctx.db
      .query("flaggedInvoices")
      .withIndex("by_fileName", (q) => q.eq("fileName", args.fileName))
      .unique();

    if (existingFile) {
      throw new Error("File already exists.");
    } else {
      // If it doesn't exist, create it and get the new _id
      await ctx.db.insert("flaggedInvoices", {
        fileName: args.fileName,
        storageId: args.storageId,
        createdAt: args.createdAt,
        searchField: args.fileName.toLowerCase(),
      });

      return {
        success: true,
        message: `Successfully flagged invoice for file: ${args.fileName}`,
      };
    }
  },
});