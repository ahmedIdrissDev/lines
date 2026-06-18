import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { createAuditLog } from "./security";

// --- Bus Management ---

export const getBuses = query({
  args: {
    siteId: v.optional(v.id("Project")),
    busType: v.optional(v.union(v.literal("Bus"), v.literal("Minibus"))),
    status: v.optional(v.union(v.literal("Active"), v.literal("Maintenance"), v.literal("Out of Service"))),
    search: v.optional(v.string()),
    date: v.string(), // YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    let busesQuery;
    if (args.siteId !== undefined) {
      const siteId = args.siteId;
      busesQuery = ctx.db.query("buses").withIndex("by_site", (q) => q.eq("siteId", siteId));
    } else {
      busesQuery = ctx.db.query("buses");
    }

    busesQuery = busesQuery.filter((q) => q.neq(q.field("isArchived"), true));

    if (args.busType) {
      busesQuery = busesQuery.filter((q) => q.eq(q.field("busType"), args.busType));
    }
    if (args.status) {
      busesQuery = busesQuery.filter((q) => q.eq(q.field("status"), args.status));
    }
    
    let buses = await busesQuery.collect();

    if (args.search) {
      const searchLower = args.search.toLowerCase();
      buses = buses.filter((b) => b.matricule.toLowerCase().includes(searchLower));
    }

    return await Promise.all(buses.map(async (bus) => {
      const site = await ctx.db.get(bus.siteId);
      
      // Get tracking status for the specified date
      const tracking = await ctx.db
        .query("busTracking")
        .withIndex("by_bus_date", (q) => q.eq("busId", bus._id).eq("date", args.date))
        .first();

      return {
        ...bus,
        siteName: site?.name || "Unknown",
        workingToday: tracking?.isWorking ?? false,
      };
    }));
  },
});

export const createBus = mutation({
  args: {
    matricule: v.string(),
    busType: v.union(v.literal("Bus"), v.literal("Minibus")),
    siteId: v.id("Project"),
    status: v.union(v.literal("Active"), v.literal("Maintenance"), v.literal("Out of Service")),
    capacity: v.optional(v.number()),
    notes: v.optional(v.string()),
    km: v.optional(v.number()),
    destination: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    // Check for unique matricule (active ones)
    const existing = await ctx.db
      .query("buses")
      .withIndex("by_matricule", (q) => q.eq("matricule", args.matricule))
      .filter((q) => q.neq(q.field("isArchived"), true))
      .first();

    if (existing) {
      return { error: "A bus with this matricule already exists." };
    }

    const busId = await ctx.db.insert("buses", {
      ...args,
      isArchived: false,
    });

    await createAuditLog(ctx, {
      clerkId: identity?.subject,
      action: "create_bus",
      targetId: busId,
      metadata: args,
    });

    return { success: true, id: busId };
  },
});

export const updateBus = mutation({
  args: {
    id: v.id("buses"),
    matricule: v.optional(v.string()),
    busType: v.optional(v.union(v.literal("Bus"), v.literal("Minibus"))),
    siteId: v.optional(v.id("Project")),
    status: v.optional(v.union(v.literal("Active"), v.literal("Maintenance"), v.literal("Out of Service"))),
    capacity: v.optional(v.number()),
    notes: v.optional(v.string()),
    km: v.optional(v.number()),
    destination: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const { id, ...updates } = args;

    if (updates.matricule !== undefined) {
      const matricule = updates.matricule;
      const existing = await ctx.db
        .query("buses")
        .withIndex("by_matricule", (q) => q.eq("matricule", matricule))
        .filter((q) => q.neq(q.field("isArchived"), true))
        .filter((q) => q.neq(q.field("_id"), id))
        .first();

      if (existing) {
        return { error: "A bus with this matricule already exists." };
      }
    }

    await ctx.db.patch(id, updates);

    await createAuditLog(ctx, {
      clerkId: identity?.subject,
      action: "update_bus",
      targetId: id,
      metadata: updates,
    });

    return { success: true };
  },
});

export const archiveBus = mutation({
  args: { id: v.id("buses") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    await ctx.db.patch(args.id, { isArchived: true });

    await createAuditLog(ctx, {
      clerkId: identity?.subject,
      action: "archive_bus",
      targetId: args.id,
    });

    return { success: true };
  },
});

// --- Daily Tracking ---

export const recordDailyTracking = mutation({
  args: {
    busId: v.id("buses"),
    date: v.string(), // YYYY-MM-DD
    isWorking: v.boolean(),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const clerkId = identity?.subject || "anonymous";

    const bus = await ctx.db.get(args.busId);
    if (!bus) return { error: "Bus not found" };

    const existing = await ctx.db
      .query("busTracking")
      .withIndex("by_bus_date", (q) => q.eq("busId", args.busId).eq("date", args.date))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        isWorking: args.isWorking,
        comment: args.comment,
        recordedBy: clerkId,
      });
    } else {
      await ctx.db.insert("busTracking", {
        busId: args.busId,
        date: args.date,
        isWorking: args.isWorking,
        siteId: bus.siteId,
        comment: args.comment,
        recordedBy: clerkId,
      });
    }

    await createAuditLog(ctx, {
      clerkId: clerkId,
      action: "record_bus_tracking",
      targetId: args.busId,
      metadata: { date: args.date, isWorking: args.isWorking },
    });

    return { success: true };
  },
});

export const getBusKPIs = query({
  args: {
    date: v.string(), // YYYY-MM-DD
    siteId: v.optional(v.id("Project")),
  },
  handler: async (ctx, args) => {
    let busesQuery;
    if (args.siteId !== undefined) {
      const siteId = args.siteId;
      busesQuery = ctx.db.query("buses").withIndex("by_site", (q) => q.eq("siteId", siteId));
    } else {
      busesQuery = ctx.db.query("buses");
    }
    busesQuery = busesQuery.filter((q) => q.neq(q.field("isArchived"), true));
    const allBuses = await busesQuery.collect();

    const totalBuses = allBuses.length;
    const activeBuses = allBuses.filter((b) => b.status === "Active").length;
    const maintenanceBuses = allBuses.filter((b) => b.status === "Maintenance").length;

    let trackingQuery = ctx.db.query("busTracking").withIndex("by_date", (q) => q.eq("date", args.date));
    if (args.siteId !== undefined) {
      const siteId = args.siteId;
      trackingQuery = ctx.db.query("busTracking").withIndex("by_site_date", (q) => q.eq("siteId", siteId).eq("date", args.date));
    }
    const trackingData = await trackingQuery.collect();

    // Only count tracking for buses that are NOT archived
    const activeBusIds = new Set(allBuses.map((b) => b._id.toString()));
    const workingToday = trackingData.filter((t) => t.isWorking && activeBusIds.has(t.busId.toString())).length;
    
    // Buses not working are those that are Active but either have isWorking: false OR no tracking entry for today
    const workingTodayIds = new Set(trackingData.filter(t => t.isWorking).map(t => t.busId.toString()));
    const notWorkingToday = allBuses.filter(b => b.status === "Active" && !workingTodayIds.has(b._id.toString())).length;

    return {
      totalBuses,
      activeBuses,
      workingToday,
      notWorkingToday,
      maintenanceBuses,
    };
  },
});

export const getProjectBusesAttendance = query({
  args: { 
    projectId: v.id("Project"),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    const buses = await ctx.db
      .query("buses")
      .withIndex("by_site", (q) => q.eq("siteId", args.projectId))
      .filter((q) => q.neq(q.field("isArchived"), true))
      .collect();

    const results = await Promise.all(
      buses.map(async (bus) => {
        const attendance = await ctx.db
          .query("busTracking")
          .withIndex("by_bus_date", (q) =>
            q.eq("busId", bus._id).gte("date", args.startDate).lte("date", args.endDate)
          )
          .collect();
        return {
          busId: bus._id,
          matricule: bus.matricule,
          busType: bus.busType,
          destination: bus.destination,
          km: bus.km,
          status: bus.status,
          siteName: project?.site || project?.name || "Unknown",
          attendance: attendance.map(a => ({
            date: a.date,
            isWorking: a.isWorking
          }))
        };
      })
    );

    return results;
  },
});
