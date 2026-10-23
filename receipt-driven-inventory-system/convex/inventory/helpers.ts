import { Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";

export async function getSupplierId(
  ctx: MutationCtx,
  data: { supplierName: string; supplierOrgId: string },
): Promise<Id<"suppliers">> {
  // 1. Look up the supplier
  let supplierId = await ctx.db
    .query("suppliers")
    .withIndex("by_supplierOrgId", (q) =>
      q.eq("supplierOrgId", data.supplierOrgId),
    )
    .unique()
    .then((doc) => doc?._id);

  // 2. If not found, insert them
  if (!supplierId) {
    supplierId = await ctx.db.insert("suppliers", {
      supplierName: data.supplierName,
      supplierOrgId: data.supplierOrgId,
    });
  }

  return supplierId;
}

export async function getCustomerId(
  ctx: MutationCtx,
  data: { customerName: string; customerOrgId: string },
): Promise<Id<"customers">> {
  // 1. Look up the customer
  let customerId = await ctx.db
    .query("customers")
    .withIndex("by_customerOrgId", (q) =>
      q.eq("customerOrgId", data.customerOrgId),
    )
    .unique()
    .then((doc) => doc?._id);

  // 2. If not found, insert them
  if (!customerId) {
    customerId = await ctx.db.insert("customers", {
      customerName: data.customerName,
      customerOrgId: data.customerOrgId,
    });
  }

  return customerId;
}

export async function getItemId(
  ctx: MutationCtx,
  data: { 
    sku: string;
    itemName: string,
    category: string,
    supplierId: Id<"suppliers">,
  },
): Promise<Id<"items">> {
  // 1. Look up the customer
  let itemId = await ctx.db
    .query("items")
    .withIndex("by_itemName", (q) =>
      q.eq("itemName", data.itemName),
    )
    .unique()
    .then((doc) => doc?._id);

  // 2. If not found, insert them
  if (!itemId) {
    itemId = await ctx.db.insert("items", {
      sku: data.sku,
      itemName: data.itemName,
      category: data.category,
      supplierId: data.supplierId,
    });
  }

  return itemId;
}