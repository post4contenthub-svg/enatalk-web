import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Next.js 16 params fix
    const { id: campaignId } = await context.params;

    if (!campaignId) {
      return NextResponse.json(
        { error: "MISSING_CAMPAIGN_ID" },
        { status: 400 }
      );
    }

    // ✅ Read body
    const body = await req.json();
    const { scheduledFor } = body;

    if (!scheduledFor) {
      return NextResponse.json(
        { error: "scheduledFor is required" },
        { status: 400 }
      );
    }

    // ✅ Update campaign
    const { error } = await supabaseAdmin
      .from("campaigns")
      .update({
        status: "scheduled",
        scheduled_for: new Date(scheduledFor).toISOString(),
      })
      .eq("id", campaignId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
