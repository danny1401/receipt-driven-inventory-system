import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

import { authComponent, createAuth } from "./betterAuth/auth";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

// Inbound Email Route
http.route({
  path: "/inbound-email",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const payload = await request.json();
      const { fileName, fileData } = payload;

      if (!fileData) {
        return new Response(JSON.stringify({ error: "No file data provided" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Convert Base64 file data to a Blob and store it in Convex File Storage
      const binaryString = atob(fileData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "application/pdf" });
      const storageId = await ctx.storage.store(blob);
      
      // Schedule the PDF extraction action to run immediately in the background
      await ctx.scheduler.runAfter(0, internal.email.pdfProcessor.processPdf, {
        storageId,
        fileName: fileName || "attachment.pdf",
      });

      return new Response(
        JSON.stringify({ success: true, message: "PDF received and queued for processing" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error: any) {
      console.error("Error handling inbound webhook:", error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }),
});

export default http;