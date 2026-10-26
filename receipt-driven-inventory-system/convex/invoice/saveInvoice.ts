import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

export const saveInvoice = internalMutation({
  // Validators for arguments.
  args: {
    fileName: v.string(),
    storageId: v.id("_storage"),
    createdAt: v.number(),

    supplierName: v.string(),
    supplierOrgId: v.string(),
    customerName: v.string(),
    customerOrgId: v.union(v.string(), v.null()),

    orderId: v.union(v.string(), v.null()),
    orderDate: v.union(v.string(), v.null()),
    deliveringDate: v.union(v.string(), v.null()),

    order: v.array(
      v.object({
        sku: v.union(v.string(), v.null()),
        itemName: v.string(),
        category: v.string(),
        quantity: v.union(v.number(), v.null()),
        quantityUnit: v.union(v.string(), v.null()),
        unitPrice: v.union(v.number(), v.null()),
        total: v.union(v.number(), v.null()),
      }),
    ),
    sum: v.union(v.number(), v.null()),
    searchField: v.string(),
  },

  // Mutation implementation.
  handler: async (ctx, args) => {
    // 1. Check if Invoice already exists FIRST (avoids creating unused suppliers/customers)
    const existingInvoice = await ctx.db
      .query("invoices")
      .withIndex("by_fileName", (q) => q.eq("fileName", args.fileName))
      .unique();

    if (existingInvoice) {
      throw new Error(
        `Invoice with file name "${args.fileName}" already exists.`,
      );
    }

    // 2. Handle Supplier (Find or Create)
    const existingSupplier = await ctx.db
      .query("suppliers")
      .withIndex("by_supplierOrgId", (q) =>
        q.eq("supplierOrgId", args.supplierOrgId),
      )
      .unique();

    const supplierId = existingSupplier
      ? existingSupplier._id
      : await ctx.db.insert("suppliers", {
          supplierOrgId: args.supplierOrgId,
          supplierName: args.supplierName,
          searchField: args.supplierName.toLowerCase(),
        });

    // 3. Handle Customer (Find or Create)
    const existingCustomer = await ctx.db
      .query("customers")
      .withIndex("by_customerOrgId", (q) =>
        q.eq("customerOrgId", args.customerOrgId),
      )
      .unique();

    const customerId = existingCustomer
      ? existingCustomer._id
      : await ctx.db.insert("customers", {
          customerOrgId: args.customerOrgId,
          customerName: args.customerName,
          searchField: args.customerName.toLowerCase(), // <-- Add this to satisfy the schema
        });

    // 4. Insert Invoice
    const invoiceId = await ctx.db.insert("invoices", {
      fileName: args.fileName,
      storageId: args.storageId,
      createdAt: args.createdAt,
      orderId: args.orderId,
      orderDate: args.orderDate,
      deliveringDate: args.deliveringDate,
      supplierId,
      customerId,
      sum: args.sum,
      searchField: args.customerName.toLowerCase(),
    });

    // 5. Insert Items and Line Items using the correct variable names (`supplierId`, `invoiceId`, `customerId`)
    for (const item of args.order) {
      const newItemId = await ctx.db.insert("items", {
        sku: item.sku,
        itemName: item.itemName,
        category: item.category,
        supplierId: supplierId,
        searchField: item.itemName.toLowerCase(),
      });

      await ctx.db.insert("lineItems", {
        itemId: newItemId,
        invoiceId: invoiceId,
        customerId: customerId,
        quantity: item.quantity,
        quantityUnit: item.quantityUnit,
        unitPrice: item.unitPrice,
        total: item.total,
        searchField: item.itemName.toLowerCase(),
      });
    }

    return { success: true, invoiceId };
  },
});
