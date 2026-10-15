import { env, internalAction } from "./../_generated/server";
import { internal } from "./../_generated/api";
import { v } from "convex/values";
import { GoogleGenAI, Type } from "@google/genai";

export const processPdf = internalAction({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    let parsedData: any = {};
    let requiredReview = false;
    
    try {
      const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

      // 1. Get the file from Convex File Storage
      const fileBlob = await ctx.storage.get(args.storageId);
      if (!fileBlob) {
        throw new Error("File not found in storage");
      }

      // 2. Convert Blob to an ArrayBuffer, then to a Base64 string for Gemini
      const arrayBuffer = await fileBlob.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString("base64");
      
      // 3. Extract information from the PDF
      // Call Gemini to extract structured JSON data from the PDF
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash", // Fast, multimodal, and available on the free tier
        contents: [
          {
            inlineData: {
              mimeType: "application/pdf",
              data: base64Data,
            },
          },
          {
            text: `Extract the receipt/order details from this document and return ONLY a valid JSON object with this exact structure. If any field cannot be found or filled properly, use null for its value:
            {
              "orderId": "string or null (e.g., 2026/181224)",
              "orderDate": "string or null (e.g., 08.10.2026)",
              "deliveringDate": "string or null (e.g., 08.10.2026)",
              "supplierName": "string or null (e.g., BAMA Storkjøkken Oslo)",
              "supplierOrgId": "string or null (Org nr, e.g., NO 936966802 MVA)",
              "customerName": "string or null (Customer/Buyer name, e.g., Osteria De Campo)",
              "customerId": "string or null (Kundenr, e.g., 762593)",
              "order": [
                {
                  "itemName": "string or null (Product description)",
                  "itemNumber": "string or null (Product number)",
                  "quantity": "number or null (Extract numeric quantity, e.g. 1.0 or 6.0)",
                  "quantityUnit": "string or null (Unit type, e.g., PK, FS, KG, ST)",
                  "unitPrice": "number or null (Price per unit as float)",
                  "total": "number or null (Line total amount as float)"
                }
              ],
              "sum": "number or null (Total sum of the order as float)"
            }`,
          },
        ],
        config: {
          // Enforce clean JSON output from the model
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              orderId: { type: Type.STRING },
              orderDate: { type: Type.STRING },
              deliveringDate: { type: Type.STRING },
              supplierName: { type: Type.STRING },
              supplierOrgId: { type: Type.STRING },
              customerName: { type: Type.STRING },
              customerId: { type: Type.STRING },
              order: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    itemNumber: { type: Type.STRING },
                    itemName: { type: Type.STRING },
                    quantity: { type: Type.NUMBER },
                    quantityUnit: { type: Type.STRING },
                    unit_price: { type: Type.NUMBER },
                    total: { type: Type.NUMBER },
                  },
                  required: ["itemNumber", "itemName", "quantity", "quantityUnit", "unit_price", "total"],
                },
              },
              sum: { type: Type.NUMBER },
            },
            required: ["orderId", "supplierName", "order"],
          },
        },
      });

      const textOutput = response.text;
      if (!textOutput) {
        throw new Error("No response received from Gemini API");
      }

      // 4. Parse the JSON output from Gemini
      parsedData = JSON.parse(textOutput);

      // 5. Check if critical array items are missing or empty
      if (!parsedData.order || parsedData.order.length === 0) {
        requiredReview = true;
      }

    } catch (error: any) {
      // If any error happens (API down, bad JSON, unreadable PDF), flag it for review
      console.error("Failed to process PDF via AI, flagging for manual review:", error.message);
      requiredReview = true;
    }

    // 6. Save the structured JSON to your database via internal mutation
    await ctx.runMutation(internal.email.receipt.saveReceipt, {
      storageId: args.storageId,
      fileName: args.fileName,
      requiredReview,
      
      supplierName: parsedData.supplierName,
      supplierOrgId: parsedData.supplierOrgId,
      customerName: parsedData.customerName,
      customerId: parsedData.customerId,
      
      orderId: parsedData.orderId,
      orderDate: parsedData.orderDate,
      deliveringDate: parsedData.deliveringDate,
      order: parsedData.order,
      sum: parsedData.sum,
    });
  },
});