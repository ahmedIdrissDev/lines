import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type BadgeMetadataRequest = {
  employee?: {
    name?: unknown;
    matricule?: unknown;
  };
  name?: unknown;
  matricule?: unknown;
};

function normalizeMatricule(matricule: string): string {
  return matricule.trim().replace(/\s+/g, "").toUpperCase();
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
    }

    const body = (await request.json()) as BadgeMetadataRequest;
    const name = String(body.employee?.name ?? body.name ?? "").trim();
    const matricule = normalizeMatricule(
      String(body.employee?.matricule ?? body.matricule ?? ""),
    );

    if (!name || !matricule) {
      return NextResponse.json({ error: "INVALID_EMPLOYEE_PROFILE" }, { status: 400 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        employeeProfile: {
          name,
          matricule,
          setupCompleted: true,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "METADATA_UPDATE_FAILED" }, { status: 500 });
  }
}
