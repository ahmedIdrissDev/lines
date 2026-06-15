import { mutation, query, QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

export interface User {
  clerkId: string;
  email?: string;
  name?: string;
  permissions: string[];
  projects: string[];
}

/**
 * CENTRALIZED AUTH CHECK
 */
export function hasPermission(user: User, permission: string): boolean {
  // Admin has absolute power
  if (user.permissions.includes("user:access:admin")) {
    return true;
  }

  // user:access:all is limited to certain modules (e.g., projects, employees)
  // but NOT system settings or roles
  if (user.permissions.includes("user:access:all")) {
    const restrictedPermissions = ["user:access:admin", "manage_roles", "system_settings"];
    if (!restrictedPermissions.includes(permission)) {
      return true;
    }
  }

  return user.permissions.includes(permission);
}

/**
 * CONVEX SECURITY PATTERN (MANDATORY)
 * Returns { user } on success, or { error } on failure.
 */
export async function requireUser(ctx: QueryCtx | MutationCtx): Promise<{ user?: User; error?: string }> {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    return { error: "Unauthorized: No identity found" };
  }

  // Use permissions and projects from Clerk session claims (JWT template)
  const permissions = (identity as any).permissions ?? [];
  const projects = (identity as any).projects ?? [];

  return { 
    user: {
      clerkId: identity.subject,
      email: identity.email,
      name: identity.name,
      permissions: permissions,
      projects: projects,
    }
  };
}

/**
 * AUDIT LOGGING HELPER
 */
export async function createAuditLog(
  ctx: MutationCtx,
  args: {
    clerkId?: string;
    action: string;
    targetId?: string;
    metadata?: any;
  }
) {
  await ctx.db.insert("auditLogs", {
    clerkId: args.clerkId,
    action: args.action,
    targetId: args.targetId,
    timestamp: Date.now(),
    metadata: args.metadata,
  });
}
