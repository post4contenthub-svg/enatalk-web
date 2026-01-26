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

// Common helper to call the Supabase Edge Function "resend-message"
async function callResendFunction(payload: {
  tenant_id: string;
  connection_id: string | null;
  to: string;
  type: "text";
  text: { body: string };
}) {
  const { data, error } = await supabase.functions.invoke(
    "resend-message",
    {
      body: payload,
      headers: {
        "x-admin-secret": ADMIN_SECRET,
      },
    },
  );

  if (error) {
    console.error("Edge function error:", error);
    return {
      ok: false,
      status: 502,
      body: {
        ok: false,
        error: "RESEND_FUNCTION_FAILED",
        message:
          (error as any)?.message ||
          (error as any)?.name ||
          JSON.stringify(error),
      },
    };
  }

  if (!data?.ok) {
    console.error("Edge function returned failure:", data);
    return {
      ok: false,
      status: 400,
      body: {
        ok: false,
        error: data?.error || "RESEND_FAILED",
        message:
          data?.message ||
          "WhatsApp provider or billing rules rejected this message.",
        details: data,
      },
    };
  }

  // success
  return {
    ok: true,
    status: 200,
    body: {
      ok: true,
      result: data,
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json().catch(() => null as any);

    if (!raw || typeof raw !== "object") {
      return NextResponse.json(
        {
          ok: false,
          error: "INVALID_PAYLOAD",
          message: "Request body must be JSON.",
        },
        { status: 400 },
      );
    }

    // MODE 1: RESEND by messageId (used by Messages page)
    if (raw.messageId) {
      const messageId = raw.messageId;

      // Load message from DB
      const { data: message, error: mErr } = await supabase
        .from("messages")
        .select("id, tenant_id, connection_id, to_number, body_text")
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

      const result = await callResendFunction({
        tenant_id: message.tenant_id,
        connection_id: message.connection_id,
        to: message.to_number,
        type: "text",
        text: { body: message.body_text },
      });

      return NextResponse.json(result.body, { status: result.status });
    }

    // MODE 2: DIRECT SEND (used by Test WhatsApp page)
    if (raw.tenant_id && raw.to && raw.text?.body) {
      const payload = {
        tenant_id: raw.tenant_id as string,
        connection_id: (raw.connection_id ?? null) as string | null,
        to: raw.to as string,
        type: "text" as const,
        text: { body: raw.text.body as string },
      };

      const result = await callResendFunction(payload);
      return NextResponse.json(result.body, { status: result.status });
    }

    // If neither shape matched, it's invalid
    return NextResponse.json(
      {
        ok: false,
        error: "INVALID_PAYLOAD",
        message:
          "Either provide messageId for resend OR {tenant_id, to, text.body} for send.",
      },
      { status: 400 },
    );
  } catch (err) {
    console.error("Unexpected error in /api/resend-message:", err);
    return NextResponse.json(
      { ok: false, error: "INTERNAL_ERROR", details: String(err) },
      { status: 500 },
    );
  }
}
