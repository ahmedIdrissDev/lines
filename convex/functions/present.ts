import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { createAuditLog } from "./security";

export const Presents = query({
   args:{
    Project: v.optional(v.id("Project")), 
   } ,
  handler: async (ctx , args) => {
    if (!args.Project) return [];
    const employees = await ctx.db.query("Present").withIndex('project_id' , (q)=> q.eq('Project',args.Project)).collect() ;
     return employees
  },
});

export const SetPresents = mutation({
  args: {
    date: v.string(),
    employees: v.array(v.number()),
    Project: v.id("Project"),
  },
  handler: async (ctx, args) => {
    const Presents = await ctx.db.query("Present").collect();
    const existedDate = Presents.find(({ date }) => date === args.date);
    
    if (existedDate?._id) {
      await ctx.db.patch(existedDate._id, args);
      
      await createAuditLog(ctx, {
        action: "update_presence",
        targetId: existedDate._id,
        metadata: args,
      });

      return { success: true, id: existedDate._id };
    }

    const id = await ctx.db.insert("Present", args);

    await createAuditLog(ctx, {
      action: "create_presence",
      targetId: id,
      metadata: args,
    });

    return { success: true, id };
  },
});
