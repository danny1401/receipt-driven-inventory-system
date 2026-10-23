import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

export const saveInvoice = internalMutation({
  // Validators for arguments.
  args: {
    fileName: v.string(),
    storageId: v.id("_storage"),
    createdAt: v.number(),
    
    supplierName: v.string(),
    supplierOrgId: v.union(v.string(), v.null()),
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
      })
    ),
    sum: v.union(v.number(), v.null()),
  },

  // Mutation implementation.
  handler: async (ctx, args) => {
    console.log("📥 saveInvoice mutation called with args:", JSON.stringify(args, null, 2));
    const newSupplierId = await ctx.db.insert("suppliers", {
      supplierOrgId: args.supplierOrgId,
      supplierName: args.supplierName,
    });
    const newCustomerId = await ctx.db.insert("customers", {
      customerOrgId: args.customerOrgId,
      customerName: args.customerName,
    });
    const newInvoiceId = await ctx.db.insert("invoices", {
      fileName: args.fileName,
      storageId: args.storageId,
      createdAt: args.createdAt,
      
      orderId: args.orderId,
      orderDate: args.orderDate,
      deliveringDate: args.deliveringDate,

      supplierId: newSupplierId,
      customerId: newCustomerId,

      sum: args.sum,
    });
    
    for (const item of args.order) {
      const newItemId = await ctx.db.insert("items", { 
        sku: item.sku,
        itemName: item.itemName,
        category: item.category,
        supplierId: newSupplierId,
      });

      await ctx.db.insert("lineItems", {
        itemId: newItemId,
        invoiceId: newInvoiceId,
        customerId: newCustomerId,
        quantity: item.quantity,
        quantityUnit: item.quantityUnit,
        unitPrice: item.unitPrice,
        total: item.total,
      });
    }
  },
});