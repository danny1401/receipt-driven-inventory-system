import { internalMutation } from "../_generated/server";
import { v } from "convex/values";
import * as Invoice from "../model/invoice";
import * as Item from "../model/item";
import * as Stock from "../model/stock";
import * as Customer from "../model/customer";
import * as Supplier from "../model/supplier";
import * as Permissions from "../model/permission";

export const saveInvoice = internalMutation({
  // Validators for arguments.
  args: {
    fileName: v.string(),
    storageId: v.id("_storage"),
    createdAt: v.number(),
    updatedAt: v.number(),
    status: v.string(),
    /** Uploader, granted access to the invoice's customer. */
    userId: v.optional(v.id("users")),

    supplierName: v.string(),
    supplierOrgId: v.string(),
    customerName: v.string(),
    customerOrgId: v.string(),

    orderId: v.union(v.string(), v.null()),
    orderDate: v.union(v.number(), v.null()),
    deliveringDate: v.union(v.string(), v.null()),

    order: v.array(
      v.object({
        sku: v.union(v.string(), v.null()),
        itemName: v.string(),
        category: v.string(),
        quantity: v.union(v.number(), v.null()),
        quantityUnit: v.union(v.string(), v.null()),
        unitPrice: v.union(v.number(), v.null()),
        total: v.union(v.number(), v.null()),
        createdAt: v.number(),
        updatedAt: v.number(),
      }),
    ),
    sum: v.union(v.number(), v.null()),
    searchField: v.string(),
  },

  // Mutation implementation.
  handler: async (ctx, args) => {
    // 1. Check if Invoice already exists FIRST (avoids creating unused suppliers/customers)
    const existingInvoice = await Invoice.findInvoiceByFilename(ctx, args.fileName)
    if (existingInvoice) {
      throw new Error(
        `Invoice with file name "${args.fileName}" already exists.`,
      );
    }

    // 2. Handle Supplier (Find or Create)
    const [existingSupplier] = await Supplier.findSupplierByOrgId(ctx, args.supplierOrgId)
    const supplierId = existingSupplier
      ? existingSupplier._id
      : await Supplier.createSupplier (ctx, {
          supplierOrgId: args.supplierOrgId,
          supplierName: args.supplierName,
        });

    // 3. Handle Customer (Find or Create)
    const [existingCustomer] = await Customer.findCustomerByOrgId(ctx, args.customerOrgId)
    const customerId = existingCustomer
      ? existingCustomer._id
      : await Customer.createCustomer(ctx, {
          customerName: args.customerName,
          customerOrgId: args.customerOrgId,
          userId: args.userId,
        });

    // Existing customers are reused, so grant access on every save, not only
    // when a new customer row is created.
    if (args.userId) {
      await Permissions.ensurePermission(ctx, args.userId, customerId);
    }

    // Extra step: 
    const OrderDateUnix = args.orderDate ? new Date(args.orderDate).getTime() : Date.now();

    // 4. Insert Invoice
    await Invoice.createInvoice(ctx, {
      fileName: args.fileName,
      storageId: args.storageId,
      createdAt: args.createdAt,
      updatedAt: args.updatedAt,
      status: args.status,
      orderId: args.orderId,
      orderDate: args.orderDate,
      deliveringDate: args.deliveringDate,
      supplierId,
      customerId,
      sum: args.sum,
    });

    // Check if it went successful
    const createdInvoice = await Invoice.findInvoiceByFilename(ctx, args.fileName);
    if (!createdInvoice) {
      throw new Error(`Failed to retrieve invoice with file name "${args.fileName}".`);
    }
    const invoiceId = createdInvoice._id;

    // 5. Insert Items and Line Items using the correct variable names (`supplierId`, `invoiceId`, `customerId`)
    for (const item of args.order) {
      const newItemId = await Item.getOrCreateItem(ctx, {
        sku: item.sku,
        itemName: item.itemName,
        category: item.category,
        supplierId: supplierId,
      });

      await Stock.createStockEntry(ctx, {
        itemId: newItemId,
        itemName: item.itemName,
        invoiceId: invoiceId,
        customerId: customerId,
        quantity: item.quantity,
        quantityUnit: item.quantityUnit,
        unitPrice: item.unitPrice,
        total: item.total,
        orderDate: OrderDateUnix,
      });
    }

    return { success: true, invoiceId };
  },
});
