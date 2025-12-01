import { query } from "../_generated/server";

export  const  Presents= query({
  handler: async (ctx) => {
    return await ctx.db.query("Presnt").collect() ;
  },
})