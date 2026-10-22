import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

export const flagInvoice = internalMutation({
  // Validators for arguments.
  args: {
    fileName: v.string(),
    storageId: v.id("_storage"),
    createdAt: v.number(),
  },

  // Mutation implementation.
  handler: async (ctx, args) => {
    await ctx.db.insert("flaggedInvoices", {
      fileName: args.fileName,
      storageId: args.storageId,
      createdAt: args.createdAt,
    });
  },
});