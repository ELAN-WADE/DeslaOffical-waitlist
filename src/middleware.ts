// ==============================================================================
// DESLA MIDDLEWARE — Route Protection for Creator, Distributor & Admin Portals
// ==============================================================================
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const pathname = nextUrl.pathname;

  // Protected portal routes
  const isCreatorRoute = pathname.startsWith("/creator");
  const isDistributorRoute = pathname.startsWith("/distributor");
  const isAdminGoogleRoute = pathname.startsWith("/admin-portal");

  if (isCreatorRoute || isDistributorRoute || isAdminGoogleRoute) {
    if (!session) {
      const role = isCreatorRoute
        ? "creator"
        : isDistributorRoute
        ? "distributor"
        : "admin";
      const loginUrl = new URL(`/login/${role}`, nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Admin-only Google route: only allow admin role
    if (isAdminGoogleRoute && (session.user as Record<string,unknown>)?.role !== "admin") {
      return NextResponse.redirect(new URL("/login/admin?error=unauthorized", nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/creator/:path*",
    "/distributor/:path*",
    "/admin-portal/:path*",
  ],
};