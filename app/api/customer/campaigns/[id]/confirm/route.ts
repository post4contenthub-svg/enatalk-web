import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: campaignId } = await context.params;

  if (!campaignId) {
    return new Response(
      JSON.stringify({ error: "MISSING_CAMPAIGN_ID" }),
      { status: 400 }
    );
  }

  console.log("✅ CONFIRM CAMPAIGN ID =", campaignId);

  if (!campaignId) {
    return NextResponse.json(
      { error: "Campaign ID missing" },
      { status: 400 }
    );
  }

  // 1️⃣ Check campaign exists
  const { data: campaign, error: findError } = await supabaseAdmin
    .from("campaigns")
    .select("id, status")
    .eq("id", campaignId)
    .maybeSingle();

  if (findError || !campaign) {
    return NextResponse.json(
      { error: "Campaign not found" },
      { status: 404 }
    );
  }

  if (campaign.status !== "draft") {
    return NextResponse.json(
      { error: "Campaign already confirmed" },
      { status: 400 }
    );
  }

  // 2️⃣ Confirm campaign
  const { error: updateError } = await supabaseAdmin
    .from("campaigns")
    .update({ status: "confirmed" })
    .eq("id", campaignId);

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
