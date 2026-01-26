export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      tenant_id,
      name,
      template_id,
      scheduled_for,
    } = body;

    // 🔒 Validation
    if (!tenant_id || !name || !template_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1️⃣ Get contacts matching template
    const { data: contacts, error: contactsErr } =
      await supabaseAdmin
        .from("contacts")
        .select("id, phone")
        .eq("tenant_id", tenant_id)
        .eq("preferred_template_id", template_id)
        .eq("is_opted_out", false);

    if (contactsErr) {
      return NextResponse.json(
        { error: "Failed to load contacts", details: contactsErr },
        { status: 500 }
      );
    }

    const totalRecipients = contacts?.length ?? 0;

    // 2️⃣ Create campaign
    const { data: campaign, error: campErr } =
      await supabaseAdmin
        .from("campaigns")
        .insert({
          tenant_id,
          name,
          template_id,
          scheduled_for: scheduled_for || null,
          status: "draft",
          total_recipients: totalRecipients,
          sent_count: 0,
        })
        .select()
        .single();

    if (campErr || !campaign) {
      return NextResponse.json(
        { error: campErr?.message || "Campaign create failed" },
        { status: 500 }
      );
    }

    // 3️⃣ Insert campaign_recipients (THIS WAS MISSING)
    if (contacts && contacts.length > 0) {
      const rows = contacts.map((c) => ({
        campaign_id: campaign.id,
        contact_id: c.id,
        phone: c.phone,
        status: "pending",
      }));

      await supabaseAdmin
        .from("campaign_recipients")
        .insert(rows);
    }

    return NextResponse.json({
      ok: true,
      campaign,
      recipients_added: totalRecipients,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Unknown server error" },
      { status: 500 }
    );
  }
}