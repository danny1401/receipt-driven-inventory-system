import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { CUSTOMER_LIMIT } from "../inventory/helpers";
import * as User from "../model/user";
import * as Permissions from "./permission";

export async function validateCustomer(
  ctx: QueryCtx,
  customerId: Id<"customers">,
) {
  const customer = await Promise.all([ctx.db.get(customerId)]);

  if (!customer) throw new Error("Specified customer does not exist.");
}

export async function findCustomerByOrgId(
  ctx: QueryCtx,
  customerOrgId: string,
) {
  const customer = await Promise.all([
    ctx.db.query("customers")
      .withIndex("by_customerOrgId", (q) => q.eq("customerOrgId", customerOrgId))
      .unique(),
  ]);

  if (!customer) throw new Error("Specified customer does not exist.");

  return customer;
}

export async function getCustomer(ctx: QueryCtx, customerId: Id<"customers">) {
  const customer = await Promise.all([ctx.db.get(customerId)]);

  if (!customer) throw new Error("Specified customer does not exist.");

  return customer;
}

/**
 * Customer rows are created per upload, so the same restaurant can appear
 * more than once. A workspace is a name, and it owns every matching row.
 */
export async function findCustomerIds(
  ctx: QueryCtx,
  customerName: string,
): Promise<Id<"customers">[]> {
  const customers = await ctx.db
    .query("customers")
    .withIndex("by_customerName", (q) => q.eq("customerName", customerName))
    .take(CUSTOMER_LIMIT);

  return customers.map((c) => c._id);
}

export async function getAllowedCustomerIds(
  ctx: QueryCtx,
): Promise<Id<"customers">[]> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthenticated: You must be logged in.");
  }

  // Better Auth maps the user ID to the 'subject' field in the token identity
  const betterAuthUserId = identity.subject;

  // Find the user in your custom Convex 'users' table
  const [user] = await User.getUserbyAuthId(ctx, betterAuthUserId);
  if (!user) {
    throw new Error("User not found.");
  }

  // Get all customerIds by the user associations with customers
  const permissions = await Permissions.getPermissionsByUserId(ctx, user._id);

  return [
    ...new Set(permissions.map((permission) => permission.customerId)),
  ].sort((a, b) => a.localeCompare(b));
}

// Get the customerId associated with an inbound forwarder email
export async function getCustomerIdByInboundForwarderEmail(
  ctx: QueryCtx,
  email: string,
) {
  const inboundForwarder = await ctx.db
    .query("inboundForwarders")
    .withIndex("by_email", (q) => q.eq("email", email))
    .first();

  if (!inboundForwarder)
    throw new Error("Specified inbound forwarder does not exist.");

  return inboundForwarder.customerId;
}

// List all relevant customers
export async function listCustomers(
  ctx: QueryCtx,
): Promise<Doc<"customers">[]> {
  // Get the customer IDs this user is allowed to see
  const allowedCustomerIds = await getAllowedCustomerIds(ctx);
  if (allowedCustomerIds.length === 0) {
    return []; // Return early if they have access to nothing
  }

  // Fetch all their rows in parallel using ctx.db.get
  const customers = await Promise.all(
    allowedCustomerIds.map(async (id) => {
      // Ensure type compatibility if allowedIds returns string vs v.id
      return await ctx.db.get(id as any);
    }),
  );

  // 3. Return the filtered rows
  return customers.filter((c): c is Doc<"customers"> => c !== null);
}

// Create customer
export async function createCustomer(
  ctx: MutationCtx,
  data: {
    customerName: string;
    customerOrgId: string | null;
    userId?: Id<"users"> | null;
  },
) {
  const customerId = await ctx.db.insert("customers", {
    customerName: data.customerName,
    customerOrgId: data.customerOrgId,
    searchField: data.customerName.toLowerCase(),
  });

  if (data.userId) {
    await Permissions.ensurePermission(ctx, data.userId, customerId);
  }

  return customerId;
}
