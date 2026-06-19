import { clerkClient, auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Reject direct browser access — only our app includes this header
    if (request.headers.get('X-App-Source') !== 'tgcc-app') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins and managers can list all users
    const permissions = (sessionClaims?.publicMetadata as any)?.permissions || 
                        (sessionClaims?.metadata as any)?.permissions || [];
    if (!permissions.includes("user:access:admin") && !permissions.includes("user:access:all")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const client = await clerkClient();
    const usersResponse = await client.users.getUserList({
      limit: 500,
    });

    const formattedUsers = usersResponse.data.map((user: any) => ({
      id: user.id,
      fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username || "Unknown",
      email: user.emailAddresses[0]?.emailAddress,
      imageUrl: user.imageUrl,
      publicMetadata: {
        permissions: user.publicMetadata?.permissions ?? [],
        projects: user.publicMetadata?.projects ?? [],
      },
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users from Clerk:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    // Reject direct browser access — only our app includes this header
    if (request.headers.get('X-App-Source') !== 'tgcc-app') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can modify user permissions — this is a privileged operation
    const permissions = (sessionClaims?.publicMetadata as any)?.permissions || 
                        (sessionClaims?.metadata as any)?.permissions || [];
    if (!permissions.includes("user:access:admin")) {
      return NextResponse.json({ error: "Forbidden: admin access required" }, { status: 403 });
    }

    const { userId: targetUserId, permissions: newPermissions, projects } = await request.json();

    if (!targetUserId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Prevent admin from removing their own admin access
    if (targetUserId === userId && !newPermissions?.includes("user:access:admin")) {
      return NextResponse.json({ error: "Cannot remove your own admin access" }, { status: 400 });
    }

    const client = await clerkClient();
    
    // Get existing metadata to merge or just overwrite as requested
    // The request implies "set", so we'll overwrite permissions and projects
    await client.users.updateUserMetadata(targetUserId, {
      publicMetadata: {
        permissions: newPermissions ?? [],
        projects: projects ?? [],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user metadata in Clerk:", error);
    return NextResponse.json({ error: "Failed to update user metadata" }, { status: 500 });
  }
}
