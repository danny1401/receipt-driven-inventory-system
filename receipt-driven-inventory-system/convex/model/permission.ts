import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";

/** Cap the permission rows read for one user. */
const PERMISSION_LIMIT = 256;

export async function getPermissionsByUserId(
  ctx: QueryCtx,
  userId: Id<"users">,
) {
  return await ctx.db
    .query("userPermissions")
    .withIndex("by_userId_and_customerId", (q) => q.eq("userId", userId))
    .take(PERMISSION_LIMIT);
}

/** Find the Convex user row for the signed-in Better Auth identity. */
export async function getCurrentUserId(
  ctx: QueryCtx | MutationCtx,
): Promise<Id<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const user = await ctx.db
    .query("users")
    .withIndex("by_authId", (q) => q.eq("authId", identity.subject))
    .unique();

  return user?._id ?? null;
}

/**
 * Grant a user access to a customer. Safe to call on every write: the
 * compound index makes the duplicate check a single lookup.
 */
export async function ensurePermission(
  ctx: MutationCtx,
  userId: Id<"users">,
  customerId: Id<"customers">,
): Promise<Id<"userPermissions">> {
  const existing = await ctx.db
    .query("userPermissions")
    .withIndex("by_userId_and_customerId", (q) =>
      q.eq("userId", userId).eq("customerId", customerId),
    )
    .unique();

  if (existing) return existing._id;

  return await ctx.db.insert("userPermissions", { userId, customerId });
}
