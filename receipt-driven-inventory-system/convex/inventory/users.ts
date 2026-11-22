import { v } from "convex/values";
import { internalMutation, mutation } from "../_generated/server";
import * as User from "../model/user";
import * as Customer from "../model/customer";
import * as Permission from "../model/permission";

// Get user


// List all users

// Ensure user exists in Convex, creating them if they don't
export const ensureUser = mutation({
handler: async (ctx) => {
    // Get the authenticated user from Convex's auth context
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    // Better Auth user ID
    const authId = identity.subject; 

    // Check if your custom user profile already exists
    const existingProfile = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", authId))
      .unique();

    if (!existingProfile) {
      // Create it automatically on first login!
      await ctx.db.insert("users", {
        authId,
        name: identity.name,
        email: identity.email,
      });
    }
  },
});

// Add User to Convex if not exists
export const addUser = mutation({
  args: { 
    authId: v.string(), 
    name: v.string(), 
    email: v.string() 
  },
  handler: async (ctx, args) => {
    const user = await User.createUser(ctx, {
      authId: args.authId,
      name: args.name,
      email: args.email,
    });

    if (!user) {
      throw new Error("Failed to create user.");
    }

    return user;
  },
});

// Update user

// Delete User

//---------------------------------------
// PERMISSION
//---------------------------------------

// Get permission


// Grant the signed-in user access to a customer. Safe to call repeatedly, so
// it doubles as a manual share/backfill endpoint.
export const AddCustomerPermissions = mutation({
  args: {
    customerId: v.id("customers"),
  },
  handler: async (ctx, args) => {
    const userId = await Permission.getCurrentUserId(ctx);
    if (!userId) {
      throw new Error("Unauthenticated");
    }

    await Customer.getCustomer(ctx, args.customerId);

    return await Permission.ensurePermission(ctx, userId, args.customerId);
  },
});

// One-off admin helper: grant one user access to every existing customer.
// Run with `npx convex run inventory/customers:backfillCustomerPermissions`.
export const backfillCustomerPermissions = internalMutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    let granted = 0;

    for await (const customer of ctx.db.query("customers")) {
      await Permission.ensurePermission(ctx, args.userId, customer._id);
      granted++;
    }

    return granted;
  },
});

// Add permission

// Update permission

// Delete permissions

// 