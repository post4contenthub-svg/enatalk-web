import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: campaignId } = await context.params;

  if (!campaignId) {
    return NextResponse.json(
      { error: "MISSING_CAMPAIGN_ID" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("campaigns")
    .select(`
      id,
      tenant_id,
      name,
      status,
      scheduled_for,
      created_at,
      total_recipients,
      sent_count,
      last_sent_at
    `)
    .eq("id", campaignId)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "CAMPAIGN_NOT_FOUND" },
      { status: 404 }
    );
  }

  return NextResponse.json({ campaign: data });
}
