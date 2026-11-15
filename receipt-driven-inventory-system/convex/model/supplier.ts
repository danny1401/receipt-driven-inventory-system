import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";

export async function validateSupplier(
  ctx: QueryCtx,
  supplierId: Id<"suppliers">,
) {
  const supplier = await Promise.all([
    ctx.db.get(supplierId),
  ]);

  if (!supplier) throw new Error("Specified supplier does not exist.");
}

export async function findSupplierByOrgId(
  ctx: QueryCtx,
  supplierOrgId: string,
) {
  const supplier = await Promise.all([
    ctx.db.query("suppliers")
      .withIndex("by_supplierOrgId", (q) => q.eq("supplierOrgId", supplierOrgId))
      .first(),
  ]);

  if (!supplier) throw new Error("Specified supplier does not exist.");

  return supplier;
}

export async function getSupplier(
  ctx: QueryCtx,
  supplierId: Id<"suppliers">,
) {
  const supplier = await Promise.all([
    ctx.db.get(supplierId),
  ]);

  if (!supplier) throw new Error("Specified supplier does not exist.");

  return supplier;
}

// Create supplier
export async function createSupplier (
  ctx: MutationCtx,
  data: {
    supplierName: string;
    supplierOrgId: string | null;
  }
) {
    return await ctx.db.insert("suppliers", {
      supplierName: data.supplierName,
      supplierOrgId: data.supplierOrgId || null,
      searchField: data.supplierName.toLowerCase(),
    });
};