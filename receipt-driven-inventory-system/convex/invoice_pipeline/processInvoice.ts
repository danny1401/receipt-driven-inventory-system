import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import { extractInvoiceWithRetry } from "./extractInvoice";

export const processInvoice = internalAction({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    status: v.string(),
    customerId: v.optional(v.id("customers")),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    let parsedData: any = {};

    try {
      // 1. Get the file from Convex File Storage
      const fileBlob = await ctx.storage.get(args.storageId);
      if (!fileBlob) {
        throw new Error("File not found in storage");
      }

      // 2. Convert Blob to an ArrayBuffer, then to a Base64 string for Gemini
      const arrayBuffer = await fileBlob.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString("base64");

      // 3.
      // Extract structured JSON data from the PDF
      // Call Gemini with automatic retry logic for 503 errors
      const response = await extractInvoiceWithRetry(base64Data);

      const textOutput = response.text;
      if (!textOutput) {
        throw new Error("No response received from Gemini API");
      }

      // 4. Parse the JSON output from Gemini
      const cleanedText = textOutput.replace(/```json\n?|\n?```/g, "").trim();
      parsedData = JSON.parse(cleanedText);

      parsedData.order = parsedData.order.map((item: any) => ({
        ...item,
        createdAt: args.createdAt,
        updatedAt: args.updatedAt,
      }));

      console.log(`[processInvoice] Parsing response.`);

      // 5. Check if critical array items are missing or empty
      if (!parsedData.order || parsedData.order.length === 0) {
        throw new Error(
          "[processInvoice] Validation failed: The extracted invoice is missing required 'order' items.",
        );
      }

      await ctx.runMutation(internal.invoice_pipeline.saveInvoice.saveInvoice, {
        fileName: args.fileName,
        storageId: args.storageId,
        createdAt: args.createdAt,
        updatedAt: args.updatedAt,
        status: args.status,
        ...(args.userId ? { userId: args.userId } : {}),

        supplierName: parsedData.supplierName,
        supplierOrgId: parsedData.supplierOrgId,
        customerName: parsedData.customerName,
        customerOrgId: parsedData.customerId,

        orderId: parsedData.orderId,
        orderDate: parsedData.orderDate,
        deliveringDate: parsedData.orderDate,

        order: parsedData.order,
        sum: null,
        searchField: parsedData.orderId.toLowerCase(),
      });

      console.log(
        `[saveInvoice] Internal mutation went successfully.`,
      );
    } catch (error: any) {
      // If any error happens (API down, bad JSON, unreadable PDF), flag it for review
      console.error(
        "Failed to process PDF via AI, flagging for manual review:",
        error.message,
      );

      // Get Email of inbound

      // Find users

      // connect to flagged

      // Save file to your database via internal mutation
      await ctx.runMutation(internal.invoice_pipeline.flagInvoice.flagInvoice, {
        fileName: args.fileName,
        storageId: args.storageId,
        createdAt: args.createdAt,
        updatedAt: args.updatedAt,
        customerId: args.customerId,
        userId: args.userId,
      });
    }
  },
});
