import { v } from "convex/values";
import { internalQuery, mutation, query } from "../_generated/server";
import * as Customer from "../model/customer";

// Get



// Get one customer by id
export const getCustomerById = query({
  args: {
    customerId: v.id("customers"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get("customers", args.customerId);
  },
});

// Get all relevant customers
export const getRelevantCustomers = query({
  args: {},
  handler: async (ctx) => {
    return await Customer.listCustomers(ctx);
  },
});

// Ensure customer exists in Convex, creating them if they don't
export const ensureCustomer = mutation({
  args: {
    customerId: v.id("customers"),
    customerOrgId: v.optional(v.string()),
    customerName: v.string(),
    searchField: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const customerName = args.customerName.trim();
    if (!customerName) {
      throw new Error("Customer name is required.");
    }

    const existing = await Customer.getCustomer(ctx, args.customerId);
    if (existing) {
      return existing;
    }

    return await Customer.createCustomer(ctx, {
      customerName: customerName,
      customerOrgId: "",
      searchField: customerName.toLowerCase(),
    });
  },
});

// Add customer

// Update customer

// Delete customer = Delete Everything that belongs to that customer, including invoices, line items, and inbound forwarders.
// This is a destructive operation and should be used with caution.

// Get customerId by BetterAuthId
export const getCustomerIdsByBetterAuthId = query({
  args: {},
  handler: async (ctx, {}) => {
    return await Customer.getAllowedCustomerIds(ctx);
  },
});
