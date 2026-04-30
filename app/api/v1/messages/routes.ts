// app/api/v1/messages/route.ts — Public API: Send WhatsApp message
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkCanSendMessage, incrementUsage, getUpgradeMessage } from "@/lib/plan-enforcement";

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { to, message, template_name, template_params } = body;

    if (!to || (!message && !template_name)) {
      return NextResponse.json(
        { error: "Required fields: 'to' (phone number) and either 'message' or 'template_name'" },
        { status: 400 }
      );
    }

    // Check plan limits
    const check = await checkCanSendMessage(userId);
    if (!check.allowed) {
      return NextResponse.json(
        {
          error: getUpgradeMessage(check),
          code: check.reason,
          used: check.used,
          limit: check.limit,
          plan: check.plan,
          upgrade_to: check.upgrade_to,
          upgrade_url: "https://enatalk.com/#pricing",
        },
        { status: 429 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // Get tenant connection
    const { data: tenant } = await supabase
      .from("tenants")
      .select("id, phone_number_id, access_token")
      .eq("user_id", userId)
      .single();

    if (!tenant) {
      return NextResponse.json(
        { error: "No WhatsApp account connected. Connect at app.enatalk.com." },
        { status: 400 }
      );
    }

    // Send via WhatsApp API
    const waPayload = template_name
      ? { messaging_product: "whatsapp", to, type: "template", template: { name: template_name, language: { code: "en" }, components: template_params ?? [] } }
      : { messaging_product: "whatsapp", to, type: "text", text: { body: message } };

    const waRes = await fetch(`https://graph.facebook.com/v18.0/${tenant.phone_number_id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tenant.access_token}` },
      body: JSON.stringify(waPayload),
    });

    const waData = await waRes.json();

    if (!waRes.ok) {
      return NextResponse.json({ error: "WhatsApp API error", details: waData }, { status: 502 });
    }

    // Log message
    await supabase.from("messages").insert({
      tenant_id: tenant.id,
      to,
      type: template_name ? "template" : "text",
      status: "sent",
      template_name: template_name ?? null,
      whatsapp_message_id: waData.messages?.[0]?.id,
    });

    // Increment usage
    await incrementUsage(userId, "messages_used");

    return NextResponse.json({
      success: true,
      message_id: waData.messages?.[0]?.id,
      to,
      remaining_messages: (check.remaining ?? 0) - 1,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 100);
  const offset = parseInt(searchParams.get("offset") ?? "0");

  const supabase = await createSupabaseServerClient();
  const { data, count } = await supabase
    .from("messages")
    .select("id, to, type, status, template_name, created_at", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return NextResponse.json({ data, total: count, limit, offset });
}
