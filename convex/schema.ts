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
  
   works: defineTable({
    Matricule: v.number(),
    firstname: v.optional(v.string()),
    lastname: v.optional(v.string()),
    function:v.optional(v.string()),
    lot: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    Project:v.optional(v.string()),
    createdAt: v.number(),
  }) ,

  Presnt: defineTable({
    date: v.string(),
    employees: v.array(v.number() )
  })
});