import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const getMonthlyAttendanceByProject = query({
  args: { 
    projectId: v.id("Project"),
    month: v.string(), // YYYY-MM
  },
  handler: async (ctx, args) => {
   

    return await ctx.db
      .query("monthlyAttendance")
      .withIndex("by_project_month", (q) =>
        q.eq("projectId", args.projectId).eq("month", args.month)
      )
      .collect();
  },
});

export const setMonthlyTotal = mutation({
  args: {
    employeeId: v.id("employees"),
    projectId: v.id("Project"),
    month: v.string(), // YYYY-MM
    totalPresent: v.number(),
  },
  handler: async (ctx, args) => {


  
    const existing = await ctx.db
      .query("monthlyAttendance")
      .withIndex("by_employee_project_month", (q) =>
        q.eq("employeeId", args.employeeId).eq("projectId", args.projectId).eq("month", args.month)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { totalPresent: args.totalPresent });
      
     

      return { success: true, id: existing._id };
    } else {
      const id = await ctx.db.insert("monthlyAttendance", args);
      


      return { success: true, id };
    }
  },
});
