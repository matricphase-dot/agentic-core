import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "@/lib/security/jwt";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Admin Guard
const ADMIN_PATHS = [
    "/admin",
    "/admin/(.*)",
    "/api/admin",
    "/api/admin/(.*)",
    "/api/support",
    "/api/support/(.*)"
];
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/verify", "/api/admin/login", "/api/admin/verify"];

const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/public(.*)',
    ...PUBLIC_ADMIN_PATHS,
    ...ADMIN_PATHS
]);

function isMatch(path: string, patterns: string[]) {
    return patterns.some(pattern => {
        if (pattern.endsWith("(.*)")) {
            const base = pattern.replace("(.*)", "");
            return path.startsWith(base);
        }
        return path === pattern || path.startsWith(pattern + "/");
    });
}

export const proxy = clerkMiddleware(async (auth, req) => {
    const { pathname } = req.nextUrl;

    const isAdminRoute = isMatch(pathname, ADMIN_PATHS);
    const isPublicAdminRoute = isMatch(pathname, PUBLIC_ADMIN_PATHS);

    // 1. Admin Security Gate - DISABLED FOR NOW
    const IS_BYPASS_ENABLED = true;

    if (!IS_BYPASS_ENABLED && isAdminRoute && !isPublicAdminRoute) {
        // ... existing login
    }

    if (!isPublicRoute(req)) {
        await auth.protect();
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        '/((?!_next|static|favicon.ico).*)',
        '/(api|trpc)(.*)',
    ],
};


// export const config = {
//     matcher: [
//         '/((?!_next|static|favicon.ico).*)', // Expanded matcher
//         '/(api|trpc)(.*)',
//     ],
// };
