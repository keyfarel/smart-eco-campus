import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  });

  const { pathname } = req.nextUrl;

  // Helper untuk redirect ke dashboard yang sesuai berdasarkan role aktif
  const getRoleDashboardRedirect = (userRole: string) => {
    const url = req.nextUrl.clone();
    if (userRole === "SUPER_ADMIN") {
      url.pathname = "/super-admin";
    } else if (userRole === "ADMIN_GEDUNG") {
      url.pathname = "/admin-gedung";
    } else {
      url.pathname = "/api/auth/signout"; // Fallback for invalid/obsolete roles to clear session
    }
    return NextResponse.redirect(url);
  };

  // 1. Redirection Khusus untuk Root Path (/)
  if (pathname === "/") {
    if (token) {
      return getRoleDashboardRedirect(token.role as string);
    } else {
      console.log(`[Proxy] Root Access: Unauthenticated. Proceeding to Landing Page.`);
      return NextResponse.next();
    }
  }

  // Daftar rute pasca-login yang dilindungi oleh proxy
  const protectedRoutes = [
    "/super-admin",
    "/admin-gedung"
  ];

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute) {
    // 1. Jika pengguna belum terautentikasi, alihkan ke Login Portal
    if (!token) {
      console.log(`[Proxy] Access Denied: Unauthenticated. Redirecting from ${pathname} to /login`);
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    const userRole = token.role as string;

    // Proteksi sesi dari role yang sudah dihapus (seperti EXECUTIVE)
    if (userRole !== "SUPER_ADMIN" && userRole !== "ADMIN_GEDUNG") {
      const url = req.nextUrl.clone();
      url.pathname = "/api/auth/signout";
      return NextResponse.redirect(url);
    }

    // 2. Proteksi Halaman Khusus Peran (Strict Role-Based Guards)
    if (pathname.startsWith("/super-admin") && userRole !== "SUPER_ADMIN") {
      return getRoleDashboardRedirect(userRole);
    }

    if (pathname.startsWith("/admin-gedung") && userRole !== "ADMIN_GEDUNG") {
      return getRoleDashboardRedirect(userRole);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/super-admin/:path*",
    "/super-admin",
    "/admin-gedung/:path*",
    "/admin-gedung"
  ],
};
