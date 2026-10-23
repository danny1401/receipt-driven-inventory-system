import { query } from "../_generated/server";

// List all items in inventory
export const listInventory = query({
  args: {},
  handler: async (ctx) => {
    // Fetch all rows from the lineItems table
    const lineItems = await ctx.db.query("lineItems").collect();

    // For each line item, fetch its corresponding item details
    const items = await Promise.all(
      lineItems.map(async (lineItem) => {
        const item = await ctx.db.get(lineItem.itemId);

        return {
          ...lineItem,
          item: item ?? null,
        };
      })
    );

    return items;
  },
});

// Query latest items
export const listLatestItems = query({
  handler: async (ctx) => {
    const items = await ctx.db.query("lineItems").order("desc").take(10);
    return items;
  },
});

// Import into existing inventory

// Import and replace existing inventory

