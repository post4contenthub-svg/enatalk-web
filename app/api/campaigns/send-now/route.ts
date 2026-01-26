import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const DISPATCH_URL =
  "https://sfvkkioerqguspxhpjjj.functions.supabase.co/campaign-dispatch";

const ADMIN_SECRET = process.env.ADMIN_SECRET!;
const ANON_KEY = process.env.SUPABASE_ANON_KEY!;

export async function POST(req: Request) {
  try {
    const { campaignId } = await req.json();
    if (!campaignId) {
      return NextResponse.json(
        { ok: false, error: "MISSING_CAMPAIGN_ID" },
        { status: 400 }
      );
    }

    // 1️⃣ Mark campaign as scheduled NOW
    const now = new Date().toISOString();

    const { error: updErr } = await supabaseAdmin
      .from("campaigns")
      .update({
        status: "scheduled",
        scheduled_for: now,
      })
      .eq("id", campaignId);

    if (updErr) {
      console.error(updErr);
      return NextResponse.json(
        { ok: false, error: "UPDATE_FAILED" },
        { status: 500 }
      );
    }

    // 2️⃣ Trigger dispatcher immediately
    const res = await fetch(DISPATCH_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ANON_KEY}`,
        "x-admin-secret": ADMIN_SECRET,
      },
    });

    const json = await res.json().catch(() => ({}));

    return NextResponse.json({ ok: true, dispatcher: json });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "INTERNAL_ERROR", detail: String(e) },
      { status: 500 }
    );
  }
}
