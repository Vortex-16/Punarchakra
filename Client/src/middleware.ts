import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

// Define public routes that don't require authentication
const publicRoutes = ["/", "/login", "/register"];

// Define admin-only routes
const adminRoutes = ["/admin"];

export default async function middleware(request: NextRequest) {
    const session = await auth();
    const { pathname } = request.nextUrl;

    // Strict equality for root, startsWith for others if needed (e.g. /login/forgot-password)
    // For now, we stick to exact paths or specific subpaths if defined.
    const isPublicRoute = publicRoutes.includes(pathname);

    // 1. Unauthenticated User trying to access Protected Route
    if (!session && !isPublicRoute) {
        const loginUrl = new URL("/login", request.url);
        // Add callbackUrl only if it's not the root (to avoid loops or redundancy)
        if (pathname !== "/") {
            loginUrl.searchParams.set("callbackUrl", pathname);
        }
        return NextResponse.redirect(loginUrl);
    }

    // 2. Authenticated User trying to access Public Auth Routes (Login/Register)
    if (session && (pathname === "/login" || pathname === "/register" || pathname === "/")) {
        // Redirect based on role
        if (session?.user?.role === "admin") {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 3. Admin Route Protection
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

    if (isAdminRoute && session?.user?.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
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
         * - public files (images, etc.)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)).*)",
    ],
};
