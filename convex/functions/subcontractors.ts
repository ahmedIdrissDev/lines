import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { createAuditLog } from "./security";

export const getSubcontractors = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("subcontractors").collect();
  },
});

export const getSubcontractorPublic = query({
  args: { id: v.id("subcontractors") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getDailyAttendancePublic = query({
  args: { 
    subcontractorId: v.id("subcontractors"),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subcontractorDailyAttendance")
      .withIndex("by_subcontractor_date", (q) =>
        q.eq("subcontractorId", args.subcontractorId).gte("date", args.startDate).lte("date", args.endDate)
      )
      .collect();
  },
});

export const getSubcontractor = query({
  args: { id: v.id("subcontractors") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createSubcontractor = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    projectId: v.optional(v.id("Project")),
  },
  handler: async (ctx, args) => {
    const subId = await ctx.db.insert("subcontractors", args);

    await createAuditLog(ctx, {
      action: "create_subcontractor",
      targetId: subId,
      metadata: args,
    });

    return { success: true, id: subId };
  },
});

export const updateSubcontractor = mutation({
  args: {
    id: v.id("subcontractors"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    projectId: v.optional(v.id("Project")),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);

    await createAuditLog(ctx, {
      action: "update_subcontractor",
      targetId: id,
      metadata: rest,
    });

    return { success: true };
  },
});

export const getSubcontractorsByProject = query({
  args: { projectId: v.id("Project") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subcontractors")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});

export const deleteSubcontractor = mutation({
  args: { id: v.id("subcontractors") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);

    await createAuditLog(ctx, {
      action: "delete_subcontractor",
      targetId: args.id,
    });

    return { success: true };
  },
});

export const getDailyAttendance = query({
  args: { 
    subcontractorId: v.id("subcontractors"),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subcontractorDailyAttendance")
      .withIndex("by_subcontractor_date", (q) =>
        q.eq("subcontractorId", args.subcontractorId).gte("date", args.startDate).lte("date", args.endDate)
      )
      .collect();
  },
});

export const getProjectSubcontractorsAttendance = query({
  args: { 
    projectId: v.id("Project"),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const subcontractors = await ctx.db
      .query("subcontractors")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    const subcontractorIds = subcontractors.map((s) => s._id);

    // Fetch attendance for all these subcontractors
    // Since we can't easily do an "IN" query across many IDs with indexes in a single go for range, 
    // we'll fetch them and filter or do it per sub if count is small.
    // For now, let's fetch all attendance in the date range and filter in memory if needed, 
    // or just fetch per subcontractor.
    
    const results = await Promise.all(
      subcontractors.map(async (sub) => {
        const attendance = await ctx.db
          .query("subcontractorDailyAttendance")
          .withIndex("by_subcontractor_date", (q) =>
            q.eq("subcontractorId", sub._id).gte("date", args.startDate).lte("date", args.endDate)
          )
          .collect();
        return {
          subcontractorId: sub._id,
          name: sub.name,
          attendance
        };
      })
    );

    return results;
  },
});

export const setDailyCount = mutation({
  args: {
    subcontractorId: v.id("subcontractors"),
    date: v.string(),
    count: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subcontractorDailyAttendance")
      .withIndex("by_subcontractor_date", (q) =>
        q.eq("subcontractorId", args.subcontractorId).eq("date", args.date)
      )
      .first();

    if (existing) {
      if (args.count === 0) {
        await ctx.db.delete(existing._id);
        
        await createAuditLog(ctx, {
          action: "delete_subcontractor_attendance",
          targetId: existing._id,
          metadata: { date: args.date },
        });

        return { success: true, deleted: true };
      } else {
        await ctx.db.patch(existing._id, { count: args.count });

        await createAuditLog(ctx, {
          action: "update_subcontractor_attendance",
          targetId: existing._id,
          metadata: args,
        });

        return { success: true, id: existing._id };
      }
    } else if (args.count > 0) {
      const id = await ctx.db.insert("subcontractorDailyAttendance", args);

      await createAuditLog(ctx, {
        action: "create_subcontractor_attendance",
        targetId: id,
        metadata: args,
      });

      return { success: true, id };
    }
    return { success: true };
  },
});
