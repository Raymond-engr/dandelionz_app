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
    "/faqs",
    "/terms",
    "/contact",
    "/product",
    "/category",
    "/checkout/success",
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  ) || pathname === "/" || pathname === "/account";

  // If no token and trying to access protected route
  if (!token && !isPublicRoute) {
    const url = request.nextUrl.clone();
    // Carry the query string, not just the path. Pages reached with params in the URL -
    // a Paystack return with ?reference=, an order link with an id - were losing them
    // here, so signing back in landed on a page that no longer knew what it was for.
    const target = `${pathname}${request.nextUrl.search}`;
    url.pathname = "/login";
    // Clear the cloned query first, otherwise the original params sit alongside the
    // encoded redirect value and appear twice.
    url.search = "";
    url.searchParams.set("redirect", target);
    return NextResponse.redirect(url);
  }

  // Role-based route protection
  if (token && userRole) {
    // Prevent Admins and Vendors from seeing the customer landing page
    if (pathname === "/") {
      if (userRole === "BUSINESS_ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      if (userRole === "VENDOR") {
        return NextResponse.redirect(new URL("/vendor", request.url));
      }
    }

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
