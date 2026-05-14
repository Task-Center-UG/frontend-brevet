import { NextRequest, NextResponse } from "next/server";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

export const routePermissions = {
  authRoutes: ["/auth/sign-in", "/auth/sign-up"],
  baseRoutes: ["/dashboard"],
  adminRoutes: [
    "/dashboard/pengajar",
    "/dashboard/peserta",
    "/dashboard/admin",
    "/dashboard/berita",
    "/dashboard/kursus",
    "/dashboard/transaksi",
    "/dashboard/umpan-balik",
  ],
  teacherRoutes: ["/dashboard/kelas"],
  studentRoutes: ["/dashboard/pembayaran", "/dashboard/program-saya"],
  commonAdminAndTeacherRoutes: ["/dashboard/ini-buat-admin-sama-guru"],
};

type UserRole = "admin" | "guru" | "siswa";

export const rolePermissions: Record<
  UserRole,
  { routes: string[]; deny: boolean }[]
> = {
  siswa: [
    { routes: routePermissions.commonAdminAndTeacherRoutes, deny: true },
    { routes: routePermissions.adminRoutes, deny: true },
    { routes: routePermissions.teacherRoutes, deny: true },
  ],
  guru: [
    { routes: routePermissions.adminRoutes, deny: true },
    { routes: routePermissions.studentRoutes, deny: true },
  ],
  admin: [
    { routes: routePermissions.studentRoutes, deny: true },
    { routes: routePermissions.teacherRoutes, deny: true },
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  const token = await getCookie("access_token", { req: request });

  // If token exists and trying to access authRoutes, redirect based on role
  if (token && routePermissions.authRoutes.includes(pathname)) {
    try {
      const user: any = jwtDecode(token);
      const userRole = user.role as UserRole;

      if (userRole === "siswa") {
        url.pathname = "/dashboard";
      } else if (userRole === "guru") {
        url.pathname = "/dashboard";
      } else if (userRole === "admin") {
        url.pathname = "/dashboard";
      }

      return NextResponse.redirect(url);
    } catch (error) {
      console.error("Error decoding token:", error);
      url.pathname = "/auth/sign-in";
      return NextResponse.redirect(url);
    }
  }

  // If no token and trying to access protected routes (dashboard), redirect to signup
  if (
    !token &&
    (routePermissions.baseRoutes.includes(pathname) ||
      pathname.startsWith("/dashboard"))
  ) {
    url.pathname = "/auth/sign-up";
    return NextResponse.redirect(url);
  }

  // If token exists, decode and verify user role
  if (token && typeof token === "string" && token.split(".").length === 3) {
    try {
      const user: any = jwtDecode(token);
      const userRole = user.role as UserRole;

      url.pathname = "/access-denied";

      for (const permission of rolePermissions[userRole]) {
        if (permission.routes.some((route) => pathname.startsWith(route))) {
          return NextResponse.redirect(url);
        }
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      url.pathname = "/auth/sign-in";
      return NextResponse.redirect(url);
    }
  }
}
