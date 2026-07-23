import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

function normalizeAttendanceRadius(radius?: number) {
  if (typeof radius !== "number") {
    return undefined;
  }

  return Math.min(1000, Math.max(0, radius));
}

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
  args: { ids: v.array(v.id("Project")) },
  handler: async (ctx, args) => {
    const projects = await Promise.all(
      args.ids.map(async (id) => {
        try {
          return await ctx.db.get(id);
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
    description: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    type: v.optional(v.string()),
    site: v.optional(v.string()),
    status: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    xCoordinate: v.optional(v.number()),
    yCoordinate: v.optional(v.number()),
    attendanceRadiusMeters: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const name = args.name.trim();

    if (!name) {
      throw new Error("Project name is required");
    }

    const projectId = await ctx.db.insert("Project", {
      ...args,
      name,
      attendanceRadiusMeters: normalizeAttendanceRadius(args.attendanceRadiusMeters),
    });

   
    return { success: true, id: projectId };
  },
});

export const updateProject = mutation({
  args: {
    id: v.id("Project"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    type: v.optional(v.string()),
    site: v.optional(v.string()),
    status: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    xCoordinate: v.optional(v.number()),
    yCoordinate: v.optional(v.number()),
    attendanceRadiusMeters: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const patch = {
      ...rest,
      name: rest.name?.trim(),
      attendanceRadiusMeters: normalizeAttendanceRadius(rest.attendanceRadiusMeters),
    };

    if (patch.name !== undefined && !patch.name) {
      throw new Error("Project name is required");
    }

    await ctx.db.patch(id, patch);

  
    
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

   
    return { success: true };
  },
});
