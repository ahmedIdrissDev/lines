import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const SetProject = mutation({
  args: {
    name: v.string(),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("Project", args);
  },
});
