import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminToken = request.cookies.get("admin_token")?.value;
  const tenantToken = request.cookies.get("tenant_token")?.value;

  // 1. Admin Routes Protection
  if (pathname.startsWith("/admin")) {
    const isAdminAuthRoute =
      pathname === "/admin/login" ||
      pathname === "/admin/forgot-password" ||
      pathname.startsWith("/admin/reset-password");

    if (!adminToken && !isAdminAuthRoute) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (adminToken && pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // 2. Tenant Routes Protection
  if (pathname.startsWith("/tenant")) {
    if (!tenantToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If authenticated tenant tries to visit /login, redirect to /tenant/dashboard
  if (pathname === "/login" && tenantToken) {
    return NextResponse.redirect(new URL("/tenant/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/tenant/:path*", "/login"],
};
