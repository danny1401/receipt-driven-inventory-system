import { Doc, Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { query } from "../_generated/server";
import * as Customer from "../model/customer";

/** Cap the rows hydrated per query; the tables paginate on the client. */
export const INVENTORY_LIMIT = 500;
export const LATEST_LIMIT = 6;
/** Cap the customer records scanned for one workspace name. */
export const CUSTOMER_LIMIT = 10;
/** Cap the stock history shown in the View stock dialog. */
export const STOCK_ENTRY_LIMIT = 200;

/** How many rows to read when building the form's suggestions. */
const OPTION_LIMIT = 100;

export const MAX_PAGE_SIZE = 25;

/**
 * Customer IDs matching an optional workspace name, limited to the customers
 * the signed-in user is allowed to read.
 */
export async function resolveCustomerIds(
  ctx: QueryCtx,
  customerName: string | undefined,
  allowedCustomerIds: Id<"customers">[],
): Promise<Id<"customers">[]> {
  const name = customerName?.trim();
  if (!name) return allowedCustomerIds;

  const matchingCustomerIds = await Customer.findCustomerIds(ctx, name);
  return matchingCustomerIds.filter((customerId) =>
    allowedCustomerIds.includes(customerId),
  );
}

/**
 * Names already in the database, offered as suggestions when an item is added
 * by hand. Bounded so the query stays cheap as the inventory grows.
 */
export const getItemFormOptions = query({
  args: {},
  handler: async (ctx) => {
    const [suppliers, customers, items] = await Promise.all([
      ctx.db.query("suppliers").take(OPTION_LIMIT),
      ctx.db.query("customers").take(OPTION_LIMIT),
      ctx.db.query("items").take(OPTION_LIMIT),
    ]);

    return {
      suppliers: sortedUnique(
        suppliers.map((supplier) => supplier.supplierName),
      ),
      customers: sortedUnique(
        customers.map((customer) => customer.customerName),
      ),
      categories: sortedUnique(items.map((item) => item.category)),
    };
  },
});

export function totalByQuantityAndUnitPrice(
  quantity: number,
  unitPrice: number,
) {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0.");
  }
  if (unitPrice < 0) {
    throw new Error("Unit price cannot be negative.");
  }

  const total = Math.round(quantity * unitPrice * 100) / 100;

  return total;
}

function sortedUnique(names: string[]) {
  return [...new Set(names)].sort((a, b) => a.localeCompare(b));
}

/** Round aggregated totals to two decimals before sending them to the client. */
export function roundToTwo(value: number) {
  return Math.round(value * 100) / 100;
}