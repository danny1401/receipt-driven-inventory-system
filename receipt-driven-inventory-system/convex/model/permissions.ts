import { Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";

export async function getPermissionsByUserId(
  ctx: QueryCtx,
  userId: Id<"users">,
) {
  const permissions = await Promise.all([
    ctx.db.query("userPermissions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect()
  ]);

  if (!permissions) throw new Error("Specified user permissions do not exist.");

  return permissions;
}