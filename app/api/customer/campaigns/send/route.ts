import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const FN_URL =
  "https://sfvkkioerqguspxhpjjj.functions.supabase.co/resend-message";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  console.log("🔥 SEND ROUTE HIT:", params.id);

  try {
    const { tenantId } = await req.json();
    const campaignId = params.id;

    if (!tenantId || !campaignId) {
      return NextResponse.json(
        { error: "tenantId and campaignId are required" },
        { status: 400 }
      );
    }

    /* --------------------------------------------------
     1️⃣ Load campaign + template
    -------------------------------------------------- */
    const { data: campaign } = await supabaseAdmin
      .from("campaigns")
      .select("id, template_id")
      .eq("id", campaignId)
      .eq("tenant_id", tenantId)
      .single();

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    const { data: template } = await supabaseAdmin
      .from("templates")
      .select("body_text")
      .eq("id", campaign.template_id)
      .eq("tenant_id", tenantId)
      .single();

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    /* --------------------------------------------------
     2️⃣ SNAPSHOT recipients INTO campaign_recipients
        (ONLY ONCE)
    -------------------------------------------------- */
    const { data: existing } = await supabaseAdmin
      .from("campaign_recipients")
      .select("id")
      .eq("campaign_id", campaignId)
      .limit(1);

    if (!existing || existing.length === 0) {
      
      if (!contacts || contacts.length === 0) {
        return NextResponse.json(
          { error: "No recipients for this campaign" },
          { status: 400 }
        );
      }

      await supabaseAdmin.from("campaign_recipients").insert(
        contacts.map((c) => ({
          campaign_id: campaignId,
          contact_id: c.id,
          phone: c.phone,
          status: "pending",
        }))
      );
    }

    /* --------------------------------------------------
     3️⃣ Load pending recipients (SOURCE OF TRUTH)
    -------------------------------------------------- */
    const { data: recipients } = await supabaseAdmin
      .from("campaign_recipients")
      .select("id, phone")
      .eq("campaign_id", campaignId)
      .eq("status", "pending");

    if (!recipients || recipients.length === 0) {
      return NextResponse.json({
        success: true,
        sent: 0,
        failed: 0,
      });
    }

    /* --------------------------------------------------
     4️⃣ Send loop
    -------------------------------------------------- */
    let sent = 0;
    let failed = 0;

    await supabaseAdmin
      .from("campaigns")
      .update({ status: "sending" })
      .eq("id", campaignId);

    for (const r of recipients) {
      try {
        const res = await fetch(FN_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            "x-admin-secret": process.env.ADMIN_SECRET || "",
          },
          body: JSON.stringify({
            tenant_id: tenantId,
            to: r.phone,
            type: "text",
            text: { body: template.body_text },
          }),
        });

        const ok = res.ok;

        await supabaseAdmin.from("messages").insert({
          tenant_id: tenantId,
          campaign_id: campaignId,
          direction: "outbound",
          to_number: r.phone,
          status: ok ? "sent" : "failed",
          body_text: template.body_text,
        });

        await supabaseAdmin
          .from("campaign_recipients")
          .update({
            status: ok ? "sent" : "failed",
            sent_at: new Date().toISOString(),
          })
          .eq("id", r.id);

        ok ? sent++ : failed++;
      } catch (err: any) {
        failed++;
        await supabaseAdmin
          .from("campaign_recipients")
          .update({
            status: "failed",
            error_message: err?.message || "Send failed",
          })
          .eq("id", r.id);
      }
    }

    /* --------------------------------------------------
     5️⃣ Complete campaign
    -------------------------------------------------- */
    await supabaseAdmin
      .from("campaigns")
      .update({
        status: "completed",
        total_recipients: recipients.length,
        sent_count: sent,
      })
      .eq("id", campaignId);

    return NextResponse.json({
      success: true,
      recipients: recipients.length,
      sent,
      failed,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
