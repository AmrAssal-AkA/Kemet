import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  return secret ? new TextEncoder().encode(secret) : null;
}

function hasAdminRole(payload) {
  if (payload?.isAdmin === true || payload?.admin === true) return true;

  const roleValue = payload?.role ?? payload?.userRole ?? payload?.type ?? payload?.admin;
  return String(roleValue || "").toLowerCase() === "admin";
}

function redirectToAuth(req) {
  return NextResponse.redirect(new URL("/auth/auth", req.url));
}

function redirectAwayFromAdmin(req) {
  return NextResponse.redirect(new URL("/", req.url));
}

export async function middleware(req) {
  const token = req.cookies.get("x-auth-token")?.value;

  if (!token) {
    return redirectToAuth(req);
  }

  const secret = getJwtSecret();

  if (!secret) {
    console.error("[middleware] JWT_SECRET is required to verify admin access.");
    return redirectToAuth(req);
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    if (!hasAdminRole(payload)) {
      return redirectAwayFromAdmin(req);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("[middleware] JWT verification failed:", error.message);
    return redirectToAuth(req);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
