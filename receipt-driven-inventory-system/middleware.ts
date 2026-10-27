// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define routes that do not require authentication
  const isPublicRoute = pathname === "/log-in" || pathname === "/sign-up" || pathname === "/";

  // 2. Check for Better Auth's session cookie (handles both dev and prod secure names)
  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  // 3. If NOT logged in and trying to view a protected page -> bounce to /login
  if (!sessionCookie && !isPublicRoute) {
    return NextResponse.redirect(new URL("/log-in", request.url));
  }

  // 4. If ALREADY logged in and trying to visit /login or /signup -> bounce to /dashboard
  if (sessionCookie && (pathname === "/log-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// 5. Specify which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};