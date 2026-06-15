'use server';

import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateUserMetadata(userId: string, metadata: { permissions?: string[], projects?: string[] }) {
  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: metadata,
    });
    revalidatePath("/add");
    return { success: true };
  } catch (error) {
    console.error("Error updating user metadata:", error);
    return { error: "Failed to update user metadata" };
  }
}
