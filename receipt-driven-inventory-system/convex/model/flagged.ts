import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";

// Sum of all flagged invoices within a customer base
export async function getFlaggedInvoiceCount(
  ctx: QueryCtx,
  data: {
    customerId: Id<"customers">;
  },
) {
  const flags = await ctx.db
    .query("flaggedInvoices")
    .withIndex("by_customer", (q) => q.eq("customerId", data.customerId))
    .collect();

  return flags.length;
}

// Get flagged invoice
export async function getFlaggedInvoice(
  ctx: QueryCtx,
  fileName: string,
) {
  const existingFile = await ctx.db
      .query("flaggedInvoices")
      .withIndex("by_fileName", (q) => q.eq("fileName", fileName))
      .unique();

  return existingFile;
}

// Create Flagged Invoice
export async function createFlaggedInvoice(
  ctx: MutationCtx,
  data: {
    fileName: string;
    storageId: Id<"_storage">;
    createdAt: number;
    updatedAt: number;
    customerId: Id<"customers"> | undefined;
    userId: Id<"users"> | undefined;
  },
) {
  await ctx.db.insert("flaggedInvoices", {
    fileName: data.fileName,
    storageId: data.storageId,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    status: "Flagged for review",
    customerId: data.customerId || undefined,
    userId: data.userId || undefined,
    searchField: data.fileName.toLowerCase(),
  });
}
