import { Buffer } from "buffer";
globalThis.Buffer = Buffer;

import { env } from "../_generated/server";
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const extractionPrompt = `Extract the invoice details from this document and fill in every field in the following structure for a JSON object. For the "category" field, analyze the item name and classify it into EXACTLY ONE of the following subcategories:
  - "Meat & Poultry"
  - "Fish & Seafood"
  - "Fruits & Vegetables"
  - "Dairy & Eggs"
  - "Grains, Flour & Starches"
  - "Pantry & Condiments"
  - "Sweet & Baking Supplies"
  - "Beverages - Non-Alcoholic"
  - "Beverages - Alcoholic"
  - "Non-Food / Other"

  Return ONLY a valid JSON object with this exact structure:
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
          "sku": "string or null (Product number e.g. 4011)",
          "itemName": "string or null (Product description)",
          "category": "string (Category)",
          "quantity": "number or null (Extract numeric quantity, e.g. 1.0 or 6.0)",
          "quantityUnit": "string or null (Unit type, e.g., PK, FS, KG, ST)",
          "unitPrice": "number or null (Price per unit as float)",
          "total": "number or null (Total cost of line item as float)"
        }
      ],
      "sum": "number or null (Total sum of the order as float)"
    }
  
  If any field cannot be found or filled properly, use null for its value.`;

const primaryModel = "gemini-3.5-flash-lite";
const fallbackModel = "gemini-3.7-flash";

async function extractInvoice(
  base64Data: string,
  currentModel: string,
): Promise<GenerateContentResponse> {
  console.log(`[extractInvoice] Started with model: ${currentModel}`);

  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("[extractInvoice] GEMINI_API_KEY is not configured.");
    throw new Error(
      "GEMINI_API_KEY is not configured in Convex environment variables.",
    );
  }

  // Explicitly passing the string satisfies the browser-check safeguard
  const ai = new GoogleGenAI({ apiKey });

  console.log(`[extractInvoice] Sending request to model: ${currentModel}`);

  try {
    const response = await ai.models.generateContent({
      model: currentModel,
      contents: [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: base64Data,
          },
        },
        {
          text: extractionPrompt,
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
                  sku: { type: Type.STRING },
                  itemName: { type: Type.STRING },
                  category: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  quantityUnit: { type: Type.STRING },
                  unitPrice: { type: Type.NUMBER },
                  total: { type: Type.NUMBER },
                },
                required: [
                  "sku",
                  "itemName",
                  "category",
                  "quantity",
                  "quantityUnit",
                  "unitPrice",
                  "total",
                ],
              },
            },
            sum: { type: Type.NUMBER },
          },
          required: ["orderId", "supplierName", "order"],
        },
      },
    });

    console.log(`[extractInvoice] Received response from model: ${currentModel}`);
    return response;
  } catch (error) {
    console.error(`[extractInvoice] Request failed for model: ${currentModel}`, error);
    throw error;
  }
}

export async function extractInvoiceWithRetry(
  base64Data: string,
  maxRetries = 3
): Promise<GenerateContentResponse> {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      attempt++;
      // Use the primary model on the first try; switch to the fallback model on subsequent retries
      const currentModel = attempt === 1 ? primaryModel : fallbackModel;
      
      console.log(`Attempt ${attempt}: Extracting invoice using model: ${currentModel}`);
      return await extractInvoice(base64Data, currentModel);
      
    } catch (error: any) {
      // Check if it's a 503 status or a high-demand message
      const isOverloaded = error?.status === 503 || error?.message?.includes("high demand");
      
      if (isOverloaded && attempt < maxRetries) {
        // Exponential backoff with jitter
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        console.warn(`Model overloaded (503). Switching to fallback model on attempt ${attempt + 1}/${maxRetries} in ${Math.round(delay)}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }

  // Safety fallback so TypeScript knows this function never returns undefined
  throw new Error("Failed to extract invoice after maximum retries.");
}