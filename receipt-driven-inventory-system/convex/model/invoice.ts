import { Doc, Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { INVENTORY_LIMIT } from "../inventory/helpers";

/** Invoices for the given customers, newest first, capped at `limit`. */
export async function readInvoicesForCustomers(
  ctx: QueryCtx,
  customerIds: Id<"customers">[],
  limit = INVENTORY_LIMIT,
): Promise<Doc<"invoices">[]> {
  if (customerIds.length === 0) return [];

  if (customerIds.length === 1) {
    return await ctx.db
      .query("invoices")
      .withIndex("by_customerId", (q) => q.eq("customerId", customerIds[0]))
      .order("desc")
      .take(limit);
  }

  const batches = await Promise.all(
    customerIds.map((customerId) =>
      ctx.db
        .query("invoices")
        .withIndex("by_customerId", (q) => q.eq("customerId", customerId))
        .order("desc")
        .take(limit),
    ),
  );

  return batches
    .flat()
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);
}

/** Full-text search limited to the given customers. */
export async function searchInvoicesForCustomers(
  ctx: QueryCtx,
  customerIds: Id<"customers">[],
  searchTerm: string,
  limit: number,
): Promise<Doc<"invoices">[]> {
  if (customerIds.length === 0) return [];

  const batches = await Promise.all(
    customerIds.map((customerId) =>
      ctx.db
        .query("invoices")
        .withSearchIndex("search_invoices", (q) =>
          q.search("searchField", searchTerm).eq("customerId", customerId),
        )
        .take(limit),
    ),
  );

  if (batches.length === 1) return batches[0];

  // Interleave the per-customer rankings so the merged list keeps the
  // relevance order as closely as possible without a global search.
  const merged: Doc<"invoices">[] = [];
  const longest = Math.max(...batches.map((batch) => batch.length));

  for (let rank = 0; rank < longest && merged.length < limit; rank++) {
    for (const batch of batches) {
      const invoice = batch[rank];
      if (invoice) merged.push(invoice);
      if (merged.length >= limit) break;
    }
  }

  return merged;
}

// Dedicated hydration helper for invoices
export async function hydrateInvoice(ctx: any, invoice: Doc<"invoices">) {
  const [customer, supplier] = await Promise.all([
    invoice.customerId ? ctx.db.get("customers", invoice.customerId) : null,
    invoice.supplierId ? ctx.db.get("suppliers", invoice.supplierId) : null,
  ]);

  return {
    ...invoice,
    customer: customer ?? null,
    customerName: customer?.customerName ?? null,
    supplier: supplier ?? null,
    supplierName: supplier?.supplierName ?? null,
  };
}