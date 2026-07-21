import { v } from "convex/values";
import { query } from "../_generated/server";

export const employees = query({
  args: {
    Project: v.optional(v.id("Project")),
  },
  handler: async (ctx, args) => {
    if (args.Project) {
      return await ctx.db
        .query("employees")
        .withIndex("by_project", (q) => q.eq("Project", args.Project))
        .collect();
    }

    return await ctx.db.query("employees").collect();
  },
});
