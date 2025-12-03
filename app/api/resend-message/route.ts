import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !ADMIN_SECRET) {
  console.error("Missing required env vars for resend-message route");
}

const RESEND_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/resend-message`;

export async function POST(req: NextRequest) {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !ADMIN_SECRET) {
      return NextResponse.json(
        {
          ok: false,
          error: "SERVER_MISCONFIGURED",
          message:
            "SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY or ADMIN_SECRET env vars are missing",
        },
        { status: 500 },
      );
    }

    const body = await req.json();

    // Forward the request to the Supabase Edge Function
    const res = await fetch(RESEND_FUNCTION_URL, {
      method: "POST",
      headers: {
        // ✅ REQUIRED by Supabase edge functions gateway
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        // ✅ Used inside your function to verify admin
        "x-admin-secret": ADMIN_SECRET,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend-message function error:", data);
      return NextResponse.json(
        {
          ok: false,
          error: "RESEND_FUNCTION_FAILED",
          status: res.status,
          details: data,
        },
        { status: res.status },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("API /api/resend-message error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "INTERNAL_ERROR",
        message: String(err),
      },
      { status: 500 },
    );
  }
}
