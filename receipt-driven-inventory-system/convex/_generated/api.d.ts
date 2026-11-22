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
import type * as inventory_categories from "../inventory/categories.js";
import type * as inventory_customers from "../inventory/customers.js";
import type * as inventory_flaggedInvoices from "../inventory/flaggedInvoices.js";
import type * as inventory_helpers from "../inventory/helpers.js";
import type * as inventory_inboundEmails from "../inventory/inboundEmails.js";
import type * as inventory_inventory from "../inventory/inventory.js";
import type * as inventory_invoices from "../inventory/invoices.js";
import type * as inventory_items from "../inventory/items.js";
import type * as inventory_stocks from "../inventory/stocks.js";
import type * as inventory_suppliers from "../inventory/suppliers.js";
import type * as inventory_users from "../inventory/users.js";
import type * as invoice_pipeline_extractInvoice from "../invoice_pipeline/extractInvoice.js";
import type * as invoice_pipeline_flagInvoice from "../invoice_pipeline/flagInvoice.js";
import type * as invoice_pipeline_processInvoice from "../invoice_pipeline/processInvoice.js";
import type * as invoice_pipeline_saveInvoice from "../invoice_pipeline/saveInvoice.js";
import type * as lib_date from "../lib/date.js";
import type * as model_customer from "../model/customer.js";
import type * as model_flagged from "../model/flagged.js";
import type * as model_invoice from "../model/invoice.js";
import type * as model_item from "../model/item.js";
import type * as model_permission from "../model/permission.js";
import type * as model_stock from "../model/stock.js";
import type * as model_supplier from "../model/supplier.js";
import type * as model_user from "../model/user.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  http: typeof http;
  "inventory/categories": typeof inventory_categories;
  "inventory/customers": typeof inventory_customers;
  "inventory/flaggedInvoices": typeof inventory_flaggedInvoices;
  "inventory/helpers": typeof inventory_helpers;
  "inventory/inboundEmails": typeof inventory_inboundEmails;
  "inventory/inventory": typeof inventory_inventory;
  "inventory/invoices": typeof inventory_invoices;
  "inventory/items": typeof inventory_items;
  "inventory/stocks": typeof inventory_stocks;
  "inventory/suppliers": typeof inventory_suppliers;
  "inventory/users": typeof inventory_users;
  "invoice_pipeline/extractInvoice": typeof invoice_pipeline_extractInvoice;
  "invoice_pipeline/flagInvoice": typeof invoice_pipeline_flagInvoice;
  "invoice_pipeline/processInvoice": typeof invoice_pipeline_processInvoice;
  "invoice_pipeline/saveInvoice": typeof invoice_pipeline_saveInvoice;
  "lib/date": typeof lib_date;
  "model/customer": typeof model_customer;
  "model/flagged": typeof model_flagged;
  "model/invoice": typeof model_invoice;
  "model/item": typeof model_item;
  "model/permission": typeof model_permission;
  "model/stock": typeof model_stock;
  "model/supplier": typeof model_supplier;
  "model/user": typeof model_user;
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
