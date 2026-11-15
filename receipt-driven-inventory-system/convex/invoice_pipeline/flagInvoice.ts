import { internalMutation } from "../_generated/server";
import { v } from "convex/values";
import * as Flagged from "../model/flagged";

export const flagInvoice = internalMutation({
  args: {
    fileName: v.string(),
    storageId: v.id("_storage"),
    createdAt: v.number(),
    updatedAt: v.number(),
    customerId: v.optional(v.id("customers")),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const existingFile = await Flagged.getFlaggedInvoice(ctx, args.fileName);

    if (existingFile) {
      throw new Error("File already exists.");
    } else {
      // If it doesn't exist, create it and get the new _id
      await Flagged.createFlaggedInvoice(ctx, {
        fileName: args.fileName,
        storageId: args.storageId,
        createdAt: args.createdAt,
        updatedAt: args.updatedAt,
        customerId: args.customerId || undefined,
        userId: args.userId || undefined,
      });

      return {
        success: true,
        message: `Successfully flagged invoice for file: ${args.fileName}`,
      };
    }
  },
});
