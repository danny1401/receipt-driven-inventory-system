import { v } from "convex/values";
import { internalQuery, mutation } from "../_generated/server";
import * as User from "../model/user";

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