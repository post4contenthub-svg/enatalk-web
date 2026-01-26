import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: campaignId } = await context.params;

  if (!campaignId) {
    return NextResponse.json(
      { error: "MISSING_CAMPAIGN_ID" },
      { status: 400 }
    );
  }

  const status = new URL(req.url).searchParams.get("status");

  let query = supabaseAdmin
    .from("campaign_messages")
    .select(
      `
        status,
        error,
        sent_at,
        contacts (
          phone
        )
      `
    )
    .eq("campaign_id", campaignId)
    .order("sent_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    recipients: (data || []).map((r: any) => ({
      phone: r.contacts?.[0]?.phone ?? null,
      status: r.status,
      error: r.error,
      sent_at: r.sent_at,
    })),
  });
}