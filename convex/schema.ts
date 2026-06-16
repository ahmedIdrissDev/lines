import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  auditLogs: defineTable({
    clerkId: v.optional(v.string()),
    action: v.string(),
    targetId: v.optional(v.string()),
    timestamp: v.number(),
    ip: v.optional(v.string()),
    metadata: v.optional(v.any()),
  }).index("by_clerk_id", ["clerkId"])
    .index("by_timestamp", ["timestamp"]),

  Present: defineTable({
    date: v.string(),
    employees: v.array(v.number()),
    Project: v.optional(v.id("Project")),
  }).index("project_id", ["Project"]),

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

  employees: defineTable({
    Matricule: v.number(),
    firstname: v.optional(v.string()),
    lastname: v.optional(v.string()),
    function: v.optional(v.string()),
    siteManger: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive")),
    Project: v.id("Project"),
    createdAt: v.string(),
  }).index("project_id", ["Project"]),

  monthlyAttendance: defineTable({
    employeeId: v.id("employees"),
    projectId: v.id("Project"),
    month: v.string(), // Format: YYYY-MM
    totalPresent: v.number(),
  })
    .index("by_project_month", ["projectId", "month"])
    .index("by_employee_project_month", ["employeeId", "projectId", "month"]),

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
});
