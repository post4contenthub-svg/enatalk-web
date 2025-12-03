// app/api/resend-message/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ADMIN_SECRET = process.env.ADMIN_SECRET!;

// Service-role client (server only)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// Build Edge Function URL from SUPABASE_URL
function getResendFunctionUrl() {
  const url = new URL(SUPABASE_URL);
  const host = url.host.replace(".supabase.co", ".functions.supabase.co");
  return `https://${host}/resend-message`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const messageId = body.messageId as number | string | undefined;

    if (!messageId) {
      return NextResponse.json(
        { ok: false, error: "INVALID_PAYLOAD", message: "messageId is required" },
        { status: 400 },
      );
    }

    // 1) Load the message we want to resend
    const { data: message, error: mErr } = await supabase
      .from("messages")
      .select(
        "id, tenant_id, connection_id, to_number, body_text"
      )
      .eq("id", messageId)
      .single();

    if (mErr || !message) {
      console.error("Message not found for resend:", mErr);
      return NextResponse.json(
        { ok: false, error: "MESSAGE_NOT_FOUND" },
        { status: 404 },
      );
    }

    if (!message.tenant_id || !message.to_number || !message.body_text) {
      return NextResponse.json(
        {
          ok: false,
          error: "MESSAGE_INCOMPLETE",
          message:
            "Stored message is missing tenant_id, to_number or body_text.",
        },
        { status: 400 },
      );
    }

    // 2) Call Supabase Edge Function "resend-message"
    const fnUrl = getResendFunctionUrl();

    const fnRes = await fetch(fnUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": ADMIN_SECRET,
      },
      body: JSON.stringify({
        tenant_id: message.tenant_id,
        connection_id: message.connection_id,
        to: message.to_number,
        type: "text",
        text: { body: message.body_text },
      }),
    });

    let fnJson: any = null;
    try {
      fnJson = await fnRes.json();
    } catch {
      // ignore JSON parse error – keep raw
    }

    if (!fnRes.ok || !fnJson?.ok) {
      console.error("Edge resend-message failed:", fnRes.status, fnJson);
      return NextResponse.json(
        {
          ok: false,
          error: fnJson?.error || "RESEND_FUNCTION_FAILED",
          details: fnJson,
          statusCode: fnRes.status,
        },
        { status: fnRes.status || 502 },
      );
    }

    // 3) Success
    return NextResponse.json(
      {
        ok: true,
        result: fnJson,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Unexpected error in /api/resend-message:", err);
    return NextResponse.json(
      { ok: false, error: "INTERNAL_ERROR", details: String(err) },
      { status: 500 },
    );
  }
}
