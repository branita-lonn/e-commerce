// middleware.ts
// Role-based route protection

import NextAuth from "next-auth";
import { auth } from "@/auth"; // Note: auth middleware is often imported directly or set up differently, we'll use auth config

// We export auth as middleware, but we need custom logic
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isAuthRoute = nextUrl.pathname.startsWith("/auth");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isAccountRoute = nextUrl.pathname.startsWith("/account");

  // Allow API auth routes
  if (isApiAuthRoute) return;

  // Handle Auth routes (login/register)
  if (isAuthRoute) {
    if (isLoggedIn) {
      if (role === "STORE_OWNER") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return Response.redirect(new URL("/", nextUrl));
    }
    return;
  }

  // Handle Dashboard routes
  if (isDashboardRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/auth/login", nextUrl));
    }
    if (role === "CUSTOMER") {
      return Response.redirect(new URL("/", nextUrl));
    }
    return;
  }

  // Handle Account routes
  if (isAccountRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/auth/login", nextUrl));
    }
    // Both CUSTOMER and STORE_OWNER can access their account settings
    return;
  }

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
