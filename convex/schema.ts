import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    func: v.string(),
    name: v.string(),
    role: v.string(),
    password:v.string(),
    project:v.string(),
  }),
  tasks: defineTable({
  userId: v.string(),
    title: v.string(),
    description: v.string(),
    dirtask: v.string(),
    date_of_start: v.string(),
    date_of_end: v.string(),
    project:v.string()
  }),
});