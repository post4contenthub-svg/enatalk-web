import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for /api/admin/tenants",
  );
}

const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    : null;

export async function GET(_req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        {
          error: "Server misconfigured: Supabase env vars missing",
        },
        { status: 500 },
      );
    }

    // 🔐 Very safe query: select all columns, no ORDER BY on missing field
    const { data, error } = await supabase.from("tenants").select("*");

    if (error) {
      console.error("Admin tenants list error:", error);
      return NextResponse.json(
        {
          error: "Failed to load tenants",
          details: error.message,
          code: error.code,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { tenants: data ?? [] },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("Admin tenants list unexpected error:", err);
    return NextResponse.json(
      {
        error: "Internal error",
        details: String(err),
      },
      { status: 500 },
    );
  }
}
