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

  if (!campaignId) {
    return NextResponse.json(
      { error: "MISSING_CAMPAIGN_ID" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("campaign_messages")
    .select(`
      id,
      status,
      error,
      created_at,
      contacts (
        id,
        name,
        phone
      )
    `)
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "FAILED_TO_LOAD_MESSAGES" },
      { status: 500 }
    );
  }

  return NextResponse.json({ messages: data ?? [] });
}
