import { v } from "convex/values";
import { query } from "../_generated/server";

export  const employees = query({
  handler: async (ctx) => {
    return await ctx.db.query("works").collect() ;
  },
})