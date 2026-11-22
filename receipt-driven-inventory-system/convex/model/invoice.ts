import { PaginationOptions } from "convex/server";
import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { INVENTORY_LIMIT, MAX_PAGE_SIZE } from "../inventory/helpers";

// FindInvoice
export async function findInvoiceByFilename(ctx: QueryCtx, fileName: string) {
  return await ctx.db
    .query("invoices")
    .withIndex("by_fileName", (q) => q.eq("fileName", fileName))
    .unique();
}

//
export async function readInvoices(
  ctx: QueryCtx,
  data: {
    searchTerm: string | undefined;
    customerId: Id<"customers">;
    start: number;
    end: number;
    paginationOpts: PaginationOptions;
  },
): Promise<Doc<"invoices">[]> {
  const boundedOpts: PaginationOptions = {
    ...data.paginationOpts,
    numItems: Math.min(data.paginationOpts.numItems, MAX_PAGE_SIZE),
    maximumRowsRead: data.paginationOpts.maximumRowsRead
      ? Math.min(data.paginationOpts.maximumRowsRead, MAX_PAGE_SIZE * 2)
      : MAX_PAGE_SIZE * 2,
  };

  const trimmedSearch = data.searchTerm?.trim();
  if (trimmedSearch) {
    const searchResult = await ctx.db
      .query("invoices")
      .withSearchIndex("search_invoices", (q) =>
        q.search("searchField", trimmedSearch),
      )
      .paginate(boundedOpts);

    return searchResult.page;
  }

  // Fallback indexed query for a single customer within the target UTC month
  return await getMonthlyInvoicesByCustomerId(ctx, {
    customerId: data.customerId,
    start: data.start,
    end: data.end,
    paginationOpts: boundedOpts,
  });
}

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

export async function getMonthlyInvoicesByCustomerId(
  ctx: QueryCtx,
  data: {
    customerId: Id<"customers">;
    start: number;
    end: number;
    paginationOpts?: PaginationOptions;
  },
): Promise<Doc<"invoices">[]> {  
  // Get monthly line items
  const baseQuery = ctx.db
    .query("invoices")
    .withIndex("by_customerId_and_orderDate", (q) =>
      q
        .eq("customerId", data.customerId)
        .gte("orderDate", data.start)
        .lt("orderDate", data.end),
    );

  if (data.paginationOpts) {
    const result = await baseQuery.paginate(data.paginationOpts);

    if (result.page.length === 0 && result.isDone) {
      throw new Error("No invoices found.");
    }

    return result.page;
  }

  const result = await baseQuery.collect();

  if (result.length === 0) {
    throw new Error("No invoices found.");
  }

  return result;
}

// Create Invoice
export async function createInvoice(
  ctx: MutationCtx,
  data: {
    fileName: string;
    storageId: Id<"_storage">;
    createdAt: number;
    updatedAt: number;
    status: string;
    orderId: string | null;
    orderDate: number | null;
    deliveringDate: string | null;
    customerId: Id<"customers">;
    supplierId: Id<"suppliers">;
    sum: number | null;
  },
) {
  await ctx.db.insert("invoices", {
    fileName: data.fileName,
    storageId: data.storageId,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    status: data.status,
    orderId: data.orderId,
    orderDate: data.orderDate,
    deliveringDate: data.deliveringDate,
    supplierId: data.supplierId,
    customerId: data.customerId,
    sum: data.sum,
    searchField: data.fileName.toLowerCase(),
  });
}
