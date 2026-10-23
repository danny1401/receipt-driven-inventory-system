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

    orderId: v.union(v.string(), v.null()),
    orderDate: v.union(v.string(), v.null()),
    deliveringDate: v.union(v.string(), v.null()),
    
    supplierId: v.id("suppliers"),
    customerId: v.id("customers"),   // Restaurant ID

    sum: v.optional(v.union(v.number(), v.null())),
  })
    .index("by_fileName", ["fileName"])
    .index("by_orderId", ["orderId"])
    .index("by_orderDate", ["orderDate"])
    .index("by_customerId", ["customerId"])
    .index("by_supplierId", ["supplierId"]),

  flaggedInvoices: defineTable({
    fileName: v.string(),
    storageId: v.id("_storage"),
    createdAt: v.number(),
  })
    .index("by_fileName", ["fileName"]),

  suppliers: defineTable({
    supplierOrgId: v.union(v.string(), v.null()),
    supplierName: v.string(),
  })
    .index("by_supplierOrgId", ["supplierOrgId"])
    .index("by_supplierName", ["supplierName"]),
  
  customers: defineTable({
    customerOrgId: v.union(v.string(), v.null()),  // Restaurant ID
    customerName: v.string(),                      // Restaurant Name
  })
    .index("by_customerOrgId", ["customerOrgId"])
    .index("by_customerName", ["customerName"]),
  
  items: defineTable({
    sku: v.union(v.string(), v.null()),
    itemName: v.string(),
    category: v.string(),
    supplierId: v.id("suppliers"),
  })
    .index("by_itemName", ["itemName"])
    .index("by_category", ["category"])
    .index("by_supplierId", ["supplierId"]),

  lineItems: defineTable({
    quantity: v.union(v.number(), v.null()),
    quantityUnit: v.union(v.string(), v.null()),
    unitPrice: v.union(v.number(), v.null()),
    total: v.union(v.number(), v.null()),
    
    itemId: v.id("items"),
    invoiceId: v.optional(v.id("invoices")),
    customerId: v.id("customers"), 
  })
    .index("by_itemId", ["itemId"])
    .index("by_invoiceId", ["invoiceId"])
    .index("by_customerId", ["customerId"]),
});
