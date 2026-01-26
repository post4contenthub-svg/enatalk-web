import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const FN_URL =
  "https://sfvkkioerqguspxhpjjj.functions.supabase.co/resend-message";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  console.log("CAMPAIGN SEND API HIT");
  try {
    // ✅ Next.js 16 params fix
    const { id: campaignId } = await context.params;

    if (!campaignId) {
      return NextResponse.json(
        { error: "MISSING_CAMPAIGN_ID" },
        { status: 400 }
      );
    }

    // ✅ Read body safely
    const body = await req.json();
    const { tenantId } = body;

    if (!tenantId) {
      return NextResponse.json(
        { error: "MISSING_TENANT_ID" },
        { status: 400 }
      );
    }

    // 1️⃣ Load campaign
    const { data: campaign, error: campErr } = await supabaseAdmin
      .from("campaigns")
      .select("id, template_id")
      .eq("id", campaignId)
      .eq("tenant_id", tenantId)
      .single();

    if (campErr || !campaign) {
      return NextResponse.json(
        { error: "CAMPAIGN_NOT_FOUND" },
        { status: 404 }
      );
    }

    // 2️⃣ Load pending recipients
    const { data: recipients, error: recErr } = await supabaseAdmin
      .from("campaign_recipients")
      .select("id, phone")
      .eq("campaign_id", campaignId)
      .eq("status", "pending");

    if (recErr) {
      return NextResponse.json(
        { error: recErr.message },
        { status: 500 }
      );
    }

    if (!recipients || recipients.length === 0) {
      return NextResponse.json({
        success: true,
        sent: 0,
        failed: 0,
        message: "No pending recipients",
      });
    }

    let sent = 0;
    let failed = 0;

    // 3️⃣ Send messages
    for (const r of recipients) {
      try {
        const res = await fetch(FN_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
            "x-admin-secret": process.env.ADMIN_SECRET!,
          },
          body: JSON.stringify({
            tenant_id: tenantId,
            to: r.phone,
            type: "text",
            text: { body: "template text resolved earlier" },
          }),
        });

        const ok = res.ok;

        await supabaseAdmin.from("messages").insert({
          tenant_id: tenantId,
          campaign_id: campaignId,
          to_number: r.phone,
          direction: "outbound",
          status: ok ? "sent" : "error",
        });

        await supabaseAdmin
          .from("campaign_recipients")
          .update({ status: ok ? "sent" : "failed" })
          .eq("id", r.id);

        ok ? sent++ : failed++;
      } catch {
        failed++;
      }
    }

    // 4️⃣ Update campaign stats
    await supabaseAdmin
      .from("campaigns")
      .update({
        status: "completed",
        sent_count: sent,
        last_sent_at: new Date().toISOString(),
      })
      .eq("id", campaignId);

    return NextResponse.json({
      success: true,
      sent,
      failed,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
