import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export  const employees = query({
  handler: async (ctx) => {
    return await ctx.db.query("employees").collect() ;
  },
})

// export const setNewEmployees = mutation(

//   {
//     args :{
//     Matricule: v.number(),
//     firstname: v.optional(v.string()),
//     lastname: v.optional(v.string()),
//     function:v.optional(v.string()),
//     siteManger: v.optional(v.string()),
//     status: v.union(v.literal("active"), v.literal("inactive")),
//     Project:v.optional(v.id("")),
//     createdAt: v.string(),
//     },

//     handler: async (ctx , args  ) => {
//      return await ctx.db.insert("employees" ,args) ;
//    },
//   }
// )