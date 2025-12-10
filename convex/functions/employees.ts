import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export  const employees = query({
   args:{
    Project: v.id("Project"), 
   } ,
  handler: async (ctx , args ) => {
   const present= await  ctx.db.query("employees").withIndex('project_id' , (q)=> q.eq('Project', args.Project)).collect() ;
    return present
  },
})

