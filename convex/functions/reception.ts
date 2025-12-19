import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const reception = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const email = await ctx.db.query("emails").collect();
    const myemails = email.filter(({ receptionId }) =>
      receptionId.includes(args.email)
    );
    return myemails;
  },
});


export const createReception = mutation({
  args: {
    receptionId: v.array(v.string()),
    subject: v.string(),
    body: v.string(),
    file: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("emails", args);
  },
});
