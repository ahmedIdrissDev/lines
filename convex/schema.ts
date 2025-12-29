import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    func: v.string(),
    name: v.string(),
    role: v.string(),
    password: v.string(),
    image: v.optional(v.string()),
    project: v.array(v.id("Project")),
  }).index("project_id", ["project"]),

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

  Present: defineTable({
    date: v.string(),
    employees: v.array(v.number()),
    Project: v.optional(v.id("Project")),
  }).index("project_id", ["Project"]),

  Project: defineTable({
    name: v.string(),
    type: v.optional(v.string()),
  }),
  emails: defineTable({
    userId: v.id("users"),
    receptionId: v.array(v.string()),
    subject: v.string(),
    body: v.string(),
    file: v.optional(v.array(v.string())),
    type:v.optional(v.boolean())
  }),

  seens: defineTable({
    messageId: v.id("emails"),
    userId: v.id("users"),
  })
    .index("message_id", ["messageId"])
    .index("user_id", ["userId"]),
  reply: defineTable({
    messageId: v.id("emails"),
    body: v.string(),
    antherId: v.id("users"),
  })
    .index("message_id", ["messageId"])
    .index("user_id", ["antherId"]),
});
