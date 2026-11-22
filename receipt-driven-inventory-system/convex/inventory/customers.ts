import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import * as Customer from "../model/customer";
import * as Permission from "../model/permission";

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

// Ensure customer exists in Convex, creating them (and the creator's
// permission) if they don't.
export const ensureCustomer = mutation({
  args: {
    customerName: v.string(),
    customerOrgId: v.optional(v.union(v.string(), v.null())),
    searchField: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const customerName = args.customerName.trim();
    if (!customerName) {
      throw new Error("Customer name is required.");
    }

    const userId = await Permission.getCurrentUserId(ctx);

    // Reuse the first row already stored for this restaurant name.
    const [existingId] = await Customer.findCustomerIds(ctx, customerName);
    if (existingId) {
      if (userId) {
        await Permission.ensurePermission(ctx, userId, existingId);
      }
      return await Customer.getCustomer(ctx, existingId);
    }

    const customerId = await Customer.createCustomer(ctx, {
      customerName,
      customerOrgId: args.customerOrgId ?? null,
      userId,
    });

    return await Customer.getCustomer(ctx, customerId);
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
