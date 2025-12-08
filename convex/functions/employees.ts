import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export  const employees = query({
  args:{
    ProjectId:v.optional(v.id("Project")) 
  } ,
  handler: async (ctx , args) => {
    return await ctx.db.query("employees").withIndex('project_id', eq=> eq.eq('Project',args.ProjectId )).collect() ;
  },
})

