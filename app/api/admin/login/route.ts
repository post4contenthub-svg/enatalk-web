import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: "" }));

  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret) {
    return NextResponse.json(
      { message: "Server misconfigured: ADMIN_SECRET is missing" },
      { status: 500 }
    );
  }

  if (password !== adminSecret) {
    return NextResponse.json(
      { message: "Invalid password" },
      { status: 401 }
    );
  }

  // Set a simple auth cookie
  const res = NextResponse.json({ ok: true });

  res.cookies.set("enatalk_admin_auth", "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  return res;
}
