import { v } from "convex/values";
import { query } from "../_generated/server";

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      console.log("getMe: No identity found");
      return null;
    }

    // Use permissions and projects from Clerk session claims
    // These must be configured in Clerk Dashboard -> JWT Templates -> "convex"
    const permissions = (identity as any).permissions ?? [];
    const projectIds = (identity as any).projects ?? [];

    const projects = await Promise.all(
      projectIds.map(async (id: string) => {
        try {
          // Verify project still exists in Convex
          const p = await ctx.db.get(id as any);
          return p ? { ...p, assignmentId: id } : null;
        } catch {
          return null;
        }
      })
    );

    return {
      clerkId: identity.subject,
      email: identity.email,
      name: identity.name,
      permissions: permissions,
      projects: projects.filter((p): p is NonNullable<typeof p> => p !== null),
    };
  },
});
