import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export  const employees = query({
  handler: async (ctx) => {
    return await ctx.db.query("employees").collect() ;
  },
})

