import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if user has seen splash screen before
  const hasSeenSplash = request.cookies.get("hasSeenSplash")?.value;

  // Always redirect to splash if user hasn't seen it and not already on splash page
  if (!hasSeenSplash && pathname !== "/splash") {
    return NextResponse.redirect(new URL("/splash", request.url));
  }

  // If user has seen splash and trying to access splash page, redirect to pick-role
  if (hasSeenSplash && pathname === "/splash") {
    return NextResponse.redirect(new URL("/pick-role", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (logo, pick-role images)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|logo|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg).*)",
  ],
};
