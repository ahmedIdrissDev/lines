import { v } from "convex/values";
import { action } from "../_generated/server";

export const getUserDetails = action({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
    if (!CLERK_SECRET_KEY) {
      return { error: "CLERK_SECRET_KEY not set" };
    }

    try {
      const response = await fetch(`https://api.clerk.com/v1/users/${args.clerkId}`, {
        headers: {
          Authorization: `Bearer ${CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return { error: "User not found in Clerk" };
      }

      const user = await response.json();
      return {
        clerkId: user.id,
        name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || user.username || "Unknown",
        email: user.email_addresses[0]?.email_address,
        permissions: user.public_metadata?.permissions ?? [],
        projects: user.public_metadata?.projects ?? [],
        success: true
      };
    } catch (error) {
      return { error: "Failed to fetch Clerk user" };
    }
  },
});

export const updateMetadata = action({
  args: {
    clerkId: v.string(),
    permissions: v.optional(v.array(v.string())),
    projects: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
    if (!CLERK_SECRET_KEY) {
      return { error: "CLERK_SECRET_KEY not set" };
    }

    try {
      const metadata: any = {};
      if (args.permissions !== undefined) metadata.permissions = args.permissions;
      if (args.projects !== undefined) metadata.projects = args.projects;

      const response = await fetch(`https://api.clerk.com/v1/users/${args.clerkId}/metadata`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_metadata: metadata,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { error: `Clerk API error: ${errorText}` };
      }

      return { success: true };
    } catch (error) {
      return { error: "Failed to update Clerk metadata" };
    }
  },
});

export const listUsers = action({
  args: {},
  handler: async (ctx) => {
    const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
    if (!CLERK_SECRET_KEY) {
      console.error("CLERK_SECRET_KEY is not set in Convex environment variables.");
      return [];
    }

    try {
      const response = await fetch("https://api.clerk.com/v1/users?limit=500", {
        headers: {
          Authorization: `Bearer ${CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Clerk API error:", errorText);
        return [];
      }

      const users = await response.json();
      return users.map((user: any) => ({
        clerkId: user.id,
        name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || user.username || "Unknown",
        email: user.email_addresses[0]?.email_address,
        imageUrl: user.image_url,
        permissions: user.public_metadata?.permissions ?? [],
        projects: user.public_metadata?.projects ?? [],
      }));
    } catch (error) {
      console.error("Failed to fetch Clerk users:", error);
      return [];
    }
  },
});
