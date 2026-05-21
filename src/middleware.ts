import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, decodeSessionValue } from "@/lib/session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API routes handle their own auth — pass through
  if (pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  const cookieValue = request.cookies.get(COOKIE_NAME)?.value;
  const session = decodeSessionValue(cookieValue);
  const isAuthenticated = session !== null;

  // Already authenticated → redirect away from login
  if (isAuthenticated && pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Not authenticated → redirect to login (except login page itself)
  if (!isAuthenticated && pathname !== "/admin/login") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
