import { query } from "../_generated/server";

// Get Categories
export const getDistinctCategories = query({
  args: {},
  handler: async () => {
    const categories = {
      categories: [
        "Meat & Poultry",
        "Fish & Seafood",
        "Fruits & Vegetables",
        "Dairy & Eggs",
        "Grains, Flour & Starches",
        "Pantry & Condiments",
        "Sweet & Baking Supplies",
        "Beverages - Non-Alcoholic",
        "Beverages - Alcoholic",
        "Non-Food / Other",
      ],
    };

    return categories;
  },
});