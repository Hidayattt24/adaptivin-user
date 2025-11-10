import { NextRequest, NextResponse } from "next/server";

// Prefix untuk cookies (sama dengan yang di storage.ts)
const COOKIE_PREFIX = "adaptivin_user_";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Baca cookies dengan prefix untuk menghindari collision dengan admin
  const token = request.cookies.get(`${COOKIE_PREFIX}token`)?.value;
  const role = request.cookies.get(`${COOKIE_PREFIX}role`)?.value;
  const hasSeenSplash = request.cookies.get(
    `${COOKIE_PREFIX}hasSeenSplash`
  )?.value;
  const hasSeenOnboarding = request.cookies.get(
    `${COOKIE_PREFIX}hasSeenOnboarding`
  )?.value;

  // 1. Splash screen logic (untuk first time users)
  if (!hasSeenSplash && pathname !== "/splash") {
    return NextResponse.redirect(new URL("/splash", request.url));
  }

  if (hasSeenSplash && pathname === "/splash") {
    return NextResponse.redirect(new URL("/pick-role", request.url));
  }

  // 2. Protected routes - butuh authentication
  const isGuruRoute = pathname.startsWith("/guru");
  const isSiswaRoute = pathname.startsWith("/siswa");
  const isProtectedRoute = isGuruRoute || isSiswaRoute;

  // Jika akses protected route tanpa token, redirect ke login sesuai role
  if (isProtectedRoute && !token) {
    let loginUrl: URL;

    if (isSiswaRoute) {
      loginUrl = new URL("/login/siswa", request.url);
    } else if (isGuruRoute) {
      loginUrl = new URL("/login/guru", request.url);
    } else {
      loginUrl = new URL("/login", request.url);
    }

    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Role-based access control
  if (token && isProtectedRoute) {
    // Guru hanya bisa akses /guru/*
    if (isGuruRoute && role !== "guru") {
      return NextResponse.redirect(new URL("/pick-role", request.url));
    }

    // Siswa hanya bisa akses /siswa/*
    if (isSiswaRoute && role !== "siswa") {
      return NextResponse.redirect(new URL("/pick-role", request.url));
    }

    // Jika siswa belum lihat onboarding, redirect ke onboarding
    // Kecuali jika sudah di halaman onboarding itu sendiri
    if (
      isSiswaRoute &&
      role === "siswa" &&
      !hasSeenOnboarding &&
      pathname !== "/siswa/onboarding"
    ) {
      return NextResponse.redirect(new URL("/siswa/onboarding", request.url));
    }

    // Jika sudah lihat onboarding dan mencoba akses onboarding lagi, redirect ke beranda
    if (pathname === "/siswa/onboarding" && hasSeenOnboarding) {
      return NextResponse.redirect(new URL("/siswa/beranda", request.url));
    }
  }

  // 4. Redirect root ke halaman yang sesuai
  if (pathname === "/") {
    if (token && role === "guru") {
      return NextResponse.redirect(new URL("/guru/dashboard", request.url));
    }
    if (token && role === "siswa") {
      // Jika siswa belum lihat onboarding, ke onboarding dulu
      if (!hasSeenOnboarding) {
        return NextResponse.redirect(new URL("/siswa/onboarding", request.url));
      }
      return NextResponse.redirect(new URL("/siswa/beranda", request.url));
    }
    return NextResponse.redirect(new URL("/splash", request.url));
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
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|logo|lottie|mascot|pick-role|pixel|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.webp|.*\\.gif|.*\\.lottie).*)",
  ],
};
