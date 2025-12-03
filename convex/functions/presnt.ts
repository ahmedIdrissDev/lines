import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export  const  Presents= query({
  handler: async (ctx) => {
    return await ctx.db.query("Present").collect() ;
  },
})
export const SetPresents = mutation({
       args: { date: v.string(),
         employees: v.array(v.number() )
       },
  handler: async (ctx, args) => {
       const Presents = await ctx.db.query('Present').collect()
       const existedDate = Presents.find(({date})=> date===args.date )
       if(existedDate?._id){
         return  await ctx.db.patch(existedDate._id, args);
       }
       await ctx.db.insert("Present",  args);
  },
});