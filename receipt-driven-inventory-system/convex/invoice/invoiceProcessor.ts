import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import { extractInvoiceWithRetry } from "./extractInvoice";

export const processInvoice = internalAction({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
    createdAt: v.number(),
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
      parsedData = JSON.parse(textOutput);

      // 5. Check if critical array items are missing or empty
      if (!parsedData.order || parsedData.order.length === 0) {
        // Save the structured JSON to your database via internal mutation
        await ctx.runMutation(internal.invoice.saveInvoice.saveInvoice, {
          fileName: args.fileName,
          storageId: args.storageId,
          createdAt: args.createdAt,
          requiredReview: false,

          supplierName: parsedData.supplierName,
          supplierOrgId: parsedData.supplierOrgId,
          customerName: parsedData.customerName,
          customerId: parsedData.customerId,

          ...parsedData.order,
        });
      }
    } catch (error: any) {
      // If any error happens (API down, bad JSON, unreadable PDF), flag it for review
      console.error(
        "Failed to process PDF via AI, flagging for manual review:",
        error.message,
      );

      // Save file to your database via internal mutation
      await ctx.runMutation(internal.invoice.flagInvoice.flagInvoice, {
        fileName: args.fileName,
        storageId: args.storageId,
        createdAt: args.createdAt,
      });
    }
  },
});
