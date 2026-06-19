import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  

  
  subcontractors: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    projectId: v.optional(v.id("Project")),
  }).index("by_project", ["projectId"]),

  Project: defineTable({
    name: v.string(),
    type: v.optional(v.string()), // e.g., "tgcc", "sous-traitants"
    site: v.optional(v.string()),
    status: v.optional(v.string()), // e.g., "active", "completed", "pending"
    startDate: v.optional(v.string()), // YYYY-MM-DD
    endDate: v.optional(v.string()), // YYYY-MM-DD
  }),

  
  
  subcontractorDailyAttendance: defineTable({
    subcontractorId: v.id("subcontractors"),
    date: v.string(), // Format: YYYY-MM-DD
    count: v.number(),
  })
    .index("by_subcontractor_date", ["subcontractorId", "date"])
    .index("by_subcontractor_month", ["subcontractorId"]), // We can filter by date range in the handler

  buses: defineTable({
    matricule: v.string(),
    busType: v.union(v.literal("Bus"), v.literal("Minibus")),
    siteId: v.id("Project"),
    status: v.union(v.literal("Active"), v.literal("Maintenance"), v.literal("Out of Service")),
    capacity: v.optional(v.number()),
    notes: v.optional(v.string()),
    isArchived: v.optional(v.boolean()),
    km: v.optional(v.number()),
    destination: v.optional(v.string()),
  }).index("by_site", ["siteId"])
    .index("by_matricule", ["matricule"]),

  busTracking: defineTable({
    busId: v.id("buses"),
    date: v.string(), // YYYY-MM-DD
    isWorking: v.boolean(),
    siteId: v.id("Project"),
    comment: v.optional(v.string()),
    recordedBy: v.string(), // clerkId
  }).index("by_bus_date", ["busId", "date"])
    .index("by_site_date", ["siteId", "date"])
    .index("by_date", ["date"]),

  supplementaires: defineTable({
    matricule: v.string(),
    siteId: v.id("Project"),
    date: v.string(),
    time: v.string(),
  }).index("by_site", ["siteId"])
    .index("by_date", ["date"]),
});
