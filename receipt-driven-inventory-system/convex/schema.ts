import { optional } from "better-auth";
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
    updatedAt: v.number(),
    status: v.string(),

    orderId: v.union(v.string(), v.null()),
    orderDate: v.union(v.string(), v.null()),
    deliveringDate: v.union(v.string(), v.null()),

    supplierId: v.id("suppliers"),
    customerId: v.id("customers"), // Restaurant ID

    sum: v.optional(v.union(v.number(), v.null())),
    searchField: v.string(),
  })
    .searchIndex("search_invoices", {
      searchField: "searchField",
      filterFields: ["customerId"],
    })
    .index("by_fileName", ["fileName"])
    .index("by_status", ["status"])
    .index("by_creation", ["createdAt"])
    .index("by_update", ["updatedAt"])
    .index("by_orderId", ["orderId"])
    .index("by_orderDate", ["orderDate"])
    .index("by_customerId", ["customerId"])
    .index("by_supplierId", ["supplierId"]),

  flaggedInvoices: defineTable({
    fileName: v.string(),
    storageId: v.id("_storage"),
    createdAt: v.number(),
    updatedAt: v.number(),
    status: v.string(),
    userId: v.optional(v.id("users")),
    customerId: v.optional(v.id("customers")),
    searchField: v.string(),
  })
    .searchIndex("search_flags", {
      searchField: "searchField",
    })
    .index("by_fileName", ["fileName"])
    .index("by_update", ["updatedAt"])
    .index("by_customer", ["customerId"]),

  suppliers: defineTable({
    supplierOrgId: v.union(v.string(), v.null()),
    supplierName: v.string(),
    searchField: v.string(),
  })
    .searchIndex("search_suppliers", {
      searchField: "searchField",
    })
    .index("by_supplierOrgId", ["supplierOrgId"])
    .index("by_supplierName", ["supplierName"]),

  customers: defineTable({
    customerOrgId: v.union(v.string(), v.null()), // Restaurant ID
    customerName: v.string(), // Restaurant Name
    searchField: v.string(),
  })
    .searchIndex("search_customers", {
      searchField: "searchField",
    })
    .index("by_customerOrgId", ["customerOrgId"])
    .index("by_customerName", ["customerName"]),
  
  customerSupply: defineTable({
    supplierId: v.id("suppliers"),
    customerId: v.id("customers"),
  })
    .index("by_customerId", ["customerId"]),

  inboundForwarders: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    customerId: v.optional(v.id("customers")),
  })
    .index("by_email", ["email"]),

  users: defineTable({
    authId: v.string(),
    // role: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_authId", ["authId"]),
  
  userPermissions: defineTable({
    userId: v.id("users"),
    customerId: v.id("customers"),
  })
    .index("by_userId", ["userId"])
    .index("by_customerId", ["customerId"]),

  items: defineTable({
    sku: v.union(v.string(), v.null()),
    itemName: v.string(),
    category: v.string(),
    supplierId: v.id("suppliers"),
    searchField: v.string(),
  })
    .searchIndex("search_items", {
      searchField: "searchField",
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

    orderDate: v.number(),
    updatedAt: v.number(),
    searchField: v.string(),
  })
    .searchIndex("search_line_items", {
      searchField: "searchField",
      filterFields: ["customerId"],
    })
    .index("by_itemId_and_customerId", ["itemId", "customerId"])
    .index("by_itemId", ["itemId"])
    .index("by_invoiceId", ["invoiceId"])
    .index("by_customerId", ["customerId"])
    .index("by_update", ["updatedAt"]),
});
