import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the app will continue to work.
// The schema provides more precise TypeScript types.

export default defineSchema({
  receipts: defineTable({
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
    sum: v.number(),
  })
  .index("by_orderId", ["orderId"])
  .index("by_orderDate", ["orderDate"])
  .index("by_customerId", ["customerId"])
  .index("by_customerName", ["customerName"])
  .index("by_supplierOrgId", ["supplierOrgId"])
  .index("by_supplierName", ["supplierName"]),

  orderItems: defineTable({
    orderId: v.string(),
    itemNumber: v.string(),
    itemName: v.string(),
    quantity: v.number(),
    quantityUnit: v.string(),
    unitPrice: v.number(),
    total: v.number(),
  })
  .index("orderId", ["orderId"])
  .index("by_itemNumber", ["itemNumber"])
  .index("by_itemName", ["itemName"]),
});
