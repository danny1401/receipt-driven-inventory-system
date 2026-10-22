import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

export const saveInvoice = internalMutation({
  // Validators for arguments.
  args: {
    fileName: v.string(),
    storageId: v.id("_storage"),
    createdAt: v.number(),
    
    supplierName: v.union(v.string(), v.null()),
    supplierOrgId: v.union(v.string(), v.null()),
    customerName: v.union(v.string(), v.null()),   
    customerId: v.union(v.string(), v.null()),     

    orderId: v.union(v.string(), v.null()),
    orderDate: v.union(v.string(), v.null()),
    deliveringDate: v.union(v.string(), v.null()),
    
    order: v.array(
      v.object({
        itemId: v.union(v.string(), v.null()),
        itemName: v.union(v.string(), v.null()),
        category: v.union(v.string(), v.null()),
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
    await ctx.db.insert("invoices", {
      fileName: args.fileName,
      storageId: args.storageId,
      createdAt: args.createdAt,
      
      supplierName: args.supplierName,
      supplierOrgId: args.supplierOrgId,
      customerName: args.customerName,   // Restaurant name
      customerId: args.customerId,     // Restaurant ID

      orderId: args.orderId,
      orderDate: args.orderDate,
      deliveringDate: args.deliveringDate,

      sum: args.sum,
    });
    for (const item of args.order) {
      await ctx.db.insert("lineItems", {
        orderId: args.orderId,
        
        supplierName: args.supplierName,
        supplierOrgId: args.supplierOrgId,
        customerName: args.customerName,   // Restaurant name
        customerId: args.customerId,     // Restaurant ID

        itemId: item.itemId,
        itemName: item.itemName,
        category: item.category,
        quantity: item.quantity,
        quantityUnit: item.quantityUnit,
        unitPrice: item.unitPrice, // Make sure your schema matches field naming (unitPrice vs unit_price)
        total: item.total,
      });
    }
  },
});