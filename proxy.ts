import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/sous-traitants(.*)",
  "/rapport-general(.*)",
  "/add(.*)" ,
  "/bus(.*)",

]);

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

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { sessionClaims, userId } = await auth();

    // 1. Ensure the user is authenticated
    if (!userId) {
      await auth.protect();
      return;
    }

    // 2. Extract permissions from Clerk session claims (publicMetadata)
    // Note: Ensure your Clerk JWT template is configured to include publicMetadata
    const permissions = (sessionClaims?.publicMetadata as any)?.permissions || 
                        (sessionClaims?.metadata as any)?.permissions || [];

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
      // If the user has some access level, redirect to their default home (dashboard)
      if (hasManagerAccess || hasViewAccess) {
        // Prevent infinite redirect if they are already on the dashboard
        if (!req.nextUrl.pathname.startsWith("/demande-access")) {
          return Response.redirect(new URL("/demande-access", req.url));
        }
        return;
      }

      // If the user has no recognized permissions, redirect to demand-access
      return Response.redirect(new URL("/demand-acess", req.url));
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
