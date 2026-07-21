import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/sous-traitants(.*)",
  "/rapport-general(.*)",
  "/add(.*)" ,
  "/bus(.*)",

]);

const isBadgeRoute = createRouteMatcher(["/badge(.*)"]);

// Route matchers for specific permission levels
const isViewAllowed = createRouteMatcher([
  "/dashboard(.*)",
  "/rapport-general(.*)"
]);

const isManagerAllowed = createRouteMatcher([
  "/dashboard(.*)",
  "/sous-traitants(.*)",
    "/rapport-general(.*)",
    "/bus(.*)",

]);

function getPermissions(metadata: unknown): string[] {
  if (!metadata || typeof metadata !== "object") {
    return [];
  }

  const permissions = (metadata as { permissions?: unknown }).permissions;
  return Array.isArray(permissions)
    ? permissions.filter((permission): permission is string => typeof permission === "string")
    : [];
}

export default clerkMiddleware(async (auth, req) => {
  if (isBadgeRoute(req)) {
    await auth.protect();
    return;
  }

  if (isProtectedRoute(req)) {
    const { sessionClaims, userId } = await auth();

    // 1. Ensure the user is authenticated
    if (!userId) {
      await auth.protect();
      return;
    }

    // 2. Extract permissions from Clerk session claims (publicMetadata)
    // Note: Ensure your Clerk JWT template is configured to include publicMetadata
    const permissions = [
      ...getPermissions(sessionClaims?.publicMetadata),
      ...getPermissions(sessionClaims?.metadata),
    ];

    // 3. Admin (Full Control) - Can access all protected routes
    if (permissions.includes("user:access:admin")) {
      return;
    }

    // 4. Permission-based access control logic
    const hasManagerAccess = permissions.includes("user:access:all");
    const hasViewAccess = permissions.includes("user:access:view");

    let isAllowed = false;
    
    // Check Manager access (sous-traitants & dashboard)
    if (hasManagerAccess && isManagerAllowed(req)) {
      isAllowed = true;
    }
    
    // Check View access (rapport-general & dashboard)
    if (hasViewAccess && isViewAllowed(req)) {
      isAllowed = true;
    }

    // 5. Authorization Enforcement
    if (!isAllowed) {
      return Response.redirect(new URL("/badge", req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
