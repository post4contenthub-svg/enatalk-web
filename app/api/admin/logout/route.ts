// app/api/admin/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// IMPORTANT: this MUST match the cookie name you set in your admin login route.
// In the login API we used "enatalk_admin", so we clear the same one here.
const ADMIN_COOKIE_NAME = "enatalk_admin";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;

  // Redirect back to the admin login page after logout
  const res = NextResponse.redirect(new URL("/admin/login", origin));

  // Clear the admin auth cookie
  res.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });

  return res;
}
