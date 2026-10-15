import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

export const saveReceipt = internalMutation({
  // Validators for arguments.
  args: {
    fileName: v.string(),
    storageId: v.id("_storage"),
    requiredReview: v.boolean(),
    
    supplierName: v.string(),
    supplierOrgId: v.string(),
    customerName: v.string(),   // Restaurant name
    customerId: v.string(),     // Restaurant ID

    orderId: v.string(),
    orderDate: v.string(),
    deliveringDate: v.string(),
    
    order: v.array(
      v.object({
        itemNumber: v.string(),
        itemName: v.string(),
        quantity: v.number(),
        quantityUnit: v.string(),
        unitPrice: v.number(),
        total: v.number(),
      })
    ),
    sum: v.number(),
  },

  // Mutation implementation.
  handler: async (ctx, args) => {
    await ctx.db.insert("receipts", {
      fileName: args.fileName,
      storageId: args.storageId,
      requiredReview: args.requiredReview,
      
      supplierName: args.supplierName,
      supplierOrgId: args.supplierOrgId,
      customerName: args.customerName,   // Restaurant name
      customerId: args.customerId,     // Restaurant ID

      orderId: args.orderId,
      orderDate: args.orderDate,
      deliveringDate: args.deliveringDate,

      sum: args.sum,
    });
    // Assuming your mutation args include orderId and an array of items
    for (const item of args.order) {
      await ctx.db.insert("orderItems", {
        orderId: args.orderId,
        itemNumber: item.itemNumber,
        itemName: item.itemName,
        quantity: item.quantity,
        quantityUnit: item.quantityUnit,
        unitPrice: item.unitPrice, // Make sure your schema matches field naming (unitPrice vs unit_price)
        total: item.total,
      });
    }
  },
});