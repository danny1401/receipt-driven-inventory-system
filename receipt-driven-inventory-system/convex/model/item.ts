import { MutationCtx, QueryCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

export async function findItembyItemId(
  ctx: QueryCtx, 
  itemId: Id<"items">
) {
  const item = await ctx.db.get("items", itemId);
  if (!item) throw new Error("Item not found.");

  return item; 
}

// Get Item by ItemName and SupplierId
export async function findItemByItemNameAndSupplier(
  ctx: QueryCtx,
  itemName: string,
  supplierId: Id<"suppliers">,
) {
  return await ctx.db
    .query("items")
    .withIndex("by_itemName", (q) => q.eq("itemName", itemName))
    .filter((q) => q.eq(q.field("supplierId"), supplierId))
    .unique();
}

// Get or create item type
export async function getOrCreateItem(
  ctx: MutationCtx,
  data: {
    sku: string | null;
    itemName: string;
    category: string;
    supplierId: Id<"suppliers">;
  },
): Promise<Id<"items">> {
  const existingItem = await findItemByItemNameAndSupplier(
    ctx,
    data.itemName,
    data.supplierId,
  );

  if (existingItem) {
    return existingItem._id;
  }

  return await ctx.db.insert("items", {
    sku: data.sku,
    itemName: data.itemName,
    category: data.category,
    supplierId: data.supplierId,
    searchField: data.itemName.toLowerCase(),
  });
}

// Update stock entry
export async function updateItem(
  ctx: MutationCtx,
  data: {
    itemId: Id<"items">;
    itemName: string;
    sku: string | null;
    category: string;
    supplierId: Id<"suppliers">;
  },
) {
  await ctx.db.patch("items", data.itemId, {
    sku: data.sku,
    itemName: data.itemName,
    category: data.category,
    supplierId: data.supplierId,
  });
}
