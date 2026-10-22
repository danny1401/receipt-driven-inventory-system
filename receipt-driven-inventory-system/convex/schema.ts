import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the app will continue to work.
// The schema provides more precise TypeScript types.

export default defineSchema({
  invoices: defineTable({
    fileName: v.string(),
    storageId: v.id("_storage"),
    createdAt: v.number(),

    supplierName: v.union(v.string(), v.null()),
    supplierOrgId: v.union(v.string(), v.null()),
    customerName: v.union(v.string(), v.null()), // Restaurant name
    customerId: v.union(v.string(), v.null()), // Restaurant ID

    orderId: v.union(v.string(), v.null()),
    orderDate: v.union(v.string(), v.null()),
    deliveringDate: v.union(v.string(), v.null()),
    sum: v.union(v.number(), v.null()),
  })
    .index("by_orderId", ["orderId"])
    .index("by_orderDate", ["orderDate"])
    .index("by_customerId", ["customerId"])
    .index("by_customerName", ["customerName"])
    .index("by_supplierOrgId", ["supplierOrgId"])
    .index("by_supplierName", ["supplierName"]),

  lineItems: defineTable({
    orderId: v.union(v.string(), v.null()),

    supplierName: v.union(v.string(), v.null()),
    supplierOrgId: v.union(v.string(), v.null()),
    customerName: v.union(v.string(), v.null()), // Restaurant name
    customerId: v.union(v.string(), v.null()), // Restaurant ID

    itemId: v.union(v.string(), v.null()),
    itemName: v.union(v.string(), v.null()),
    category: v.union(v.string(), v.null()),
    quantity: v.union(v.number(), v.null()),
    quantityUnit: v.union(v.string(), v.null()),
    unitPrice: v.union(v.number(), v.null()),
    total: v.union(v.number(), v.null()),
  })
    .index("orderId", ["orderId"])
    .index("by_itemId", ["itemId"])
    .index("by_itemName", ["itemName"])
    .index("by_customerId", ["customerId"])
    .index("by_customerName", ["customerName"])
    .index("by_supplierOrgId", ["supplierOrgId"])
    .index("by_supplierName", ["supplierName"]),

  flaggedInvoices: defineTable({
    fileName: v.string(),
    storageId: v.id("_storage"),
    createdAt: v.number(),
  }),
});
