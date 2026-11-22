import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import * as Supplier from "../model/supplier";
import * as Customer from "../model/customer";

// List all suppliers within a single customer
export const getSuppliersByCustomerId = query({
  args: {
    customerId: v.id("customers"),
  },
  handler: async (ctx, args) => {
    // Validate customer
    await Customer.getCustomer(ctx, args.customerId)

    // Get customer-supplier connections
    const suppliersLinks = await ctx.db
    .query("customerSupply")
    .withIndex("by_customerId", (q) => q.eq("customerId", args.customerId))
    .collect();

    // Use supplierId to get suppliers data
    const suppliers = await Promise.all(
      suppliersLinks.map(({ supplierId }) => ctx.db.get(supplierId))
    );

    return suppliers.filter((supplier): supplier is NonNullable<typeof supplier> => supplier !== null);
  },
});

// List all suppliers
export const listSuppliers = query({
  args: {},
  handler: async (ctx) => {
    // Get the customer IDs this user is allowed to see
    const allowedCustomerIds = await Customer.getAllowedCustomerIds(ctx);
    if (allowedCustomerIds.length === 0) {
      return []; // Return early if they have access to nothing
    }

    // Fetch all their rows in parallel using ctx.db.get
    const suppliers = await Promise.all(
      allowedCustomerIds.map(async (id) => {
        // Ensure type compatibility if allowedIds returns string vs v.id
        return await ctx.db.get(id as any);
      }),
    );

    return suppliers;
  },
});

/**
 * Resolve a supplier name to its id, creating the supplier the first time the
 * name is used. Manual entry asks for a name rather than an id, so this bridges
 * the form to `addItem`, which expects an existing `suppliers` row.
 */
export const ensureSupplier = mutation({
  args: {
    supplierOrgId: v.string(),
    supplierName: v.string(),
  },
  handler: async (ctx, args) => {
    // FindSupplierByName or OrdId
    if (!args.supplierName && !args.supplierOrgId) {
      throw new Error("Supplier is required.");
    }
    

    const supplierName = args.supplierName.trim();
    if (!supplierName) {
      throw new Error("Supplier name is required.");
    }
    // Validate that the supplier exists. If it doesn't, create it.

    if (!args.supplierOrgId) {
      const supplier = args.supplierOrgId.trim();
      if (!supplier) {
        throw new Error("Supplier name is required.");
      }

      const existing = await Supplier.findSupplierByOrgId(
        ctx,
        args.supplierOrgId,
      );
      if (existing) {
        return existing;
      }
    }

    // If it doesn't exist, insert supplier
    return await Supplier.createSupplier(ctx, {
      supplierName: args.supplierName,
      supplierOrgId: args.supplierOrgId || null,
    });
  },
});

// Update supplier and all items associated with that supplier

// Delete supplier. Also delete all items and line items associated with that supplier.
// This is a destructive operation and should be used with caution.
