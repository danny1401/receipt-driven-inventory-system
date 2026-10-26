/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as inventory_helpers from "../inventory/helpers.js";
import type * as inventory_inventory from "../inventory/inventory.js";
import type * as inventory_invoices from "../inventory/invoices.js";
import type * as inventory_item from "../inventory/item.js";
import type * as invoice_extractInvoice from "../invoice/extractInvoice.js";
import type * as invoice_flagInvoice from "../invoice/flagInvoice.js";
import type * as invoice_processInvoice from "../invoice/processInvoice.js";
import type * as invoice_saveInvoice from "../invoice/saveInvoice.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  http: typeof http;
  "inventory/helpers": typeof inventory_helpers;
  "inventory/inventory": typeof inventory_inventory;
  "inventory/invoices": typeof inventory_invoices;
  "inventory/item": typeof inventory_item;
  "invoice/extractInvoice": typeof invoice_extractInvoice;
  "invoice/flagInvoice": typeof invoice_flagInvoice;
  "invoice/processInvoice": typeof invoice_processInvoice;
  "invoice/saveInvoice": typeof invoice_saveInvoice;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  betterAuth: import("../betterAuth/_generated/component.js").ComponentApi<"betterAuth">;
};
