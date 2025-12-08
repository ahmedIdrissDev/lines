import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const Presents = query({
  args: {
    ProjectId:v.optional(v.id("Project")) ,
  },
  handler: async (ctx , args) => {
    return await ctx.db.query("Present").withIndex('project_id' , eq=> eq.eq('Project' ,args.ProjectId))
    .collect();
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
      return await ctx.db.patch(existedDate._id, args);
    }
    await ctx.db.insert("Present", args);
  },
});
