import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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
    const { userId, permissions, projects } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const client = await clerkClient();
    
    // Get existing metadata to merge or just overwrite as requested
    // The request implies "set", so we'll overwrite permissions and projects
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        permissions: permissions ?? [],
        projects: projects ?? [],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user metadata in Clerk:", error);
    return NextResponse.json({ error: "Failed to update user metadata" }, { status: 500 });
  }
}
