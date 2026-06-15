import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { createAuditLog } from "./security";

export const employees = query({
  args: {
    Project: v.optional(v.id("Project")),
  },
  handler: async (ctx, args) => {
    const projectId = args.Project;
    if (!projectId) return [];
    const emaplyees = await ctx.db
      .query("employees")
      .withIndex("project_id", (q) => q.eq("Project", projectId))
      .collect();
    return Promise.all(
      emaplyees.map(async (data) => {
        const Project = await ctx.db.get(data.Project);
        return {
          ...data,
          Project: Project?.name,
        };
      })
    );
  },
});

export const addNewEmployyes = mutation({
  args: {
    Matricule: v.number(),
    firstname: v.optional(v.string()),
    lastname: v.optional(v.string()),
    function: v.optional(v.string()),
    siteManger: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive")),
    Project: v.id("Project"),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const employees = await ctx.db
        .query("employees")
        .filter((q) => q.eq(q.field("Matricule"), args.Matricule))
        .first();
      if (employees) return { success: false, error: "Employee already exists" };
      const employeeId = await ctx.db.insert("employees", args);
      
      await createAuditLog(ctx, {
        action: "add_employee",
        targetId: employeeId,
        metadata: args,
      });

      return { success: true, id: employeeId };
    } catch (error) {
      console.log(error);
      return { success: false, error: "Unexpected error" };
    }
  },
});
