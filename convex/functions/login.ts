import { v } from "convex/values";
import { query } from "../_generated/server";

export const get = query({
  args: {email:v.string() , password:v.string()},
  handler: async (ctx , args) => {
    const users = await ctx.db.query("users").collect();
    const user = users.find(({email ,password})=> email ===args.email && password=== args.password)
    if(!user){
      return null
    }
    return user
  }
});