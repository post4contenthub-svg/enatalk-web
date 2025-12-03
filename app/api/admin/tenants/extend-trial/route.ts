import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for /api/admin/tenants/extend-trial",
  );
}

const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    : null;

export async function POST(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Server misconfigured: Supabase env vars missing" },
        { status: 500 },
      );
    }

    const { tenantId, days } = await req.json();

    if (!tenantId || !days) {
      return NextResponse.json(
        { error: "tenantId and days are required" },
        { status: 400 },
      );
    }

    const parsedDays = Number(days);
    if (!Number.isFinite(parsedDays) || parsedDays <= 0) {
      return NextResponse.json(
        { error: "days must be a positive number" },
        { status: 400 },
      );
    }

    // Get current trial_end_at
    const { data, error: fetchError } = await supabase
      .from("tenants")
      .select("trial_end_at")
      .eq("id", tenantId)
      .single();

    if (fetchError || !data) {
      console.error("Extend trial fetch error:", fetchError);
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 },
      );
    }

    const current =
      data.trial_end_at !== null && data.trial_end_at !== undefined
        ? new Date(data.trial_end_at as string)
        : new Date(); // if null, start from now

    const newEnd = new Date(current);
    newEnd.setDate(newEnd.getDate() + parsedDays);

    const { error: updateError } = await supabase
      .from("tenants")
      .update({ trial_end_at: newEnd.toISOString() })
      .eq("id", tenantId);

    if (updateError) {
      console.error("Extend trial update error:", updateError);
      return NextResponse.json(
        { error: "Failed to extend trial" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { ok: true, trial_end_at: newEnd.toISOString() },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("Extend trial unexpected error:", err);
    return NextResponse.json(
      { error: "Internal error", details: String(err) },
      { status: 500 },
    );
  }
}
