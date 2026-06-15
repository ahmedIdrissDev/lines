import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { createAuditLog } from "./security";

/**
 * Publicly accessible list of all projects for management purposes.
 */
export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await ctx.db.query("Project").collect();
    } catch (err) {
      console.error("Error fetching projects:", err);
      return { error: err instanceof Error ? err.message : "Unknown database error" };
    }
  },
});

export const getProjectsByIds = query({
  args: { ids: v.array(v.string()) },
  handler: async (ctx, args) => {
    const projects = await Promise.all(
      args.ids.map(async (id) => {
        try {
          return await ctx.db.get(id as any);
        } catch {
          return null;
        }
      })
    );
    return projects.filter((p): p is NonNullable<typeof p> => p !== null);
  },
});

export const getProjectPublic = query({
  args: { id: v.id("Project") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getProject = query({
  args: { id: v.id("Project") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const SetProject = mutation({
  args: {
    name: v.string(),
    type: v.optional(v.string()),
    site: v.optional(v.string()),
    status: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const projectId = await ctx.db.insert("Project", args);

    await createAuditLog(ctx, {
      action: "create_project",
      targetId: projectId,
      metadata: args,
    });

    return { success: true, id: projectId };
  },
});

export const updateProject = mutation({
  args: {
    id: v.id("Project"),
    name: v.optional(v.string()),
    type: v.optional(v.string()),
    site: v.optional(v.string()),
    status: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);

    await createAuditLog(ctx, {
      action: "update_project",
      targetId: id,
      metadata: rest,
    });
    
    return { success: true };
  },
});

export const deleteProject = mutation({
  args: { id: v.id("Project") },
  handler: async (ctx, args) => {
    const associatedSubcontractors = await ctx.db
      .query("subcontractors")
      .withIndex("by_project", (q) => q.eq("projectId", args.id))
      .collect();

    for (const sub of associatedSubcontractors) {
      await ctx.db.patch(sub._id, { projectId: undefined });
    }

    await ctx.db.delete(args.id);

    await createAuditLog(ctx, {
      action: "delete_project",
      targetId: args.id,
    });

    return { success: true };
  },
});
