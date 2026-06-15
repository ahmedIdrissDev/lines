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
  

  
});
