import { MutationCtx, QueryCtx } from "../_generated/server";

export async function getUserbyAuthId(ctx: QueryCtx, authId: string) {
  const user = await Promise.all([
    ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", authId))
      .unique(),
  ]);

  if (!user) throw new Error("Specified user does not exist.");

  return user;
}

// Get the customerId associated with an inbound forwarder email
export async function getUserIdByInboundForwarderEmail(
  ctx: QueryCtx,
  email: string,
) {
  const inboundForwarder = await ctx.db
    .query("inboundForwarders")
    .withIndex("by_email", (q) => q.eq("email", email))
    .first();

  if (!inboundForwarder)
    throw new Error("Specified inbound forwarder does not exist.");

  return inboundForwarder.userId;
}

export async function createUser(
  ctx: MutationCtx,
  data: {
    authId: string;
    name: string;
    email: string;
  },
) {
  const { authId, name, email } = data;

  const existing = await getUserbyAuthId(ctx, authId);
  if (existing) {
    throw new Error("User with this auth ID already exists.");
  }

  const user = await ctx.db.insert("users", {
    authId,
    name,
    email,
  });

  return user;
}
