import { v } from "convex/values";
import { internalQuery } from "../_generated/server";
import * as User from "../model/user";
import * as Customer from "../model/customer";
import { Id } from "../_generated/dataModel";

// Get id associated with InboundForwarderEmail
export const getIdByInboundForwarderEmail = internalQuery({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) => {
  const customerId = await Customer.getCustomerIdByInboundForwarderEmail(ctx, email);
  if (customerId) return customerId;

  const userId = await User.getUserIdByInboundForwarderEmail(ctx, email);
  if (userId) return userId;

  throw new Error("Specified inbound forwarder does not exist.");
},
});

// Get inbound forwarder email

// List all inbound forwarder emails for a given customerId

// Add inbound forwarder email

// Update inbound forwarder email

// Delete inbound forwarder email