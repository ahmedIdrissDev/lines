import { query } from "../_generated/server";

export const get =query({
  handler: async (ctx) => {
    console.log("Write and test your query function here!");
    return await ctx.db.query("users").collect();
  },
})