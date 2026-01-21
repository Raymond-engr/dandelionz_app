// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth token from cookies or headers
  const token = request.cookies.get("access_token")?.value;
  const userRole = request.cookies.get("user_role")?.value;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-email",
    "/",
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If no token and trying to access protected route
  if (!token && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Role-based route protection
  if (token && userRole) {
    // Admin routes
    if (pathname.startsWith("/admin") && userRole !== "BUSINESS_ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Vendor routes
    if (pathname.startsWith("/vendor") && userRole !== "VENDOR") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Customer routes (account, cart, orders, etc.)
    if (pathname.startsWith("/account") && userRole !== "CUSTOMER") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
