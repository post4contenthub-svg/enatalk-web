import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function replaceVariables(text: string, contact: any) {
  return text.replace(/{{(.*?)}}/g, (_, key) => {
    key = key.trim();

    // Built-in fields
    if (key === "name") return contact.name || "";
    if (key === "phone") return contact.phone || "";

    // Custom fields
    if (contact.custom_fields && contact.custom_fields[key] !== undefined) {
      return String(contact.custom_fields[key]);
    }

    return ""; // unknown variable
  });
}

export async function POST(req: Request) {
  try {
    const { phone, body, tenantId } = await req.json();

    if (!phone || !body || !tenantId) {
      return NextResponse.json(
        { error: "Missing phone, body, or tenantId" },
        { status: 400 }
      );
    }

    // -------------------------------------------------------------
    // 1️⃣ Fetch contact so we can replace variables like {{name}}
    // -------------------------------------------------------------
    const { data: contact, error: contactError } = await supabaseAdmin
      .from("contacts")
      .select("id, name, phone, custom_fields")
      .eq("tenant_id", tenantId)
      .eq("phone", phone)
      .maybeSingle();

    if (contactError) {
      console.error("Contact lookup error:", contactError);
    }

    // If contact exists → replace variables
    let finalBody = body;
    if (contact) {
      finalBody = replaceVariables(body, contact);
    }

    // -------------------------------------------------------------
    // 2️⃣ Call your Supabase Edge Function
    // -------------------------------------------------------------
    const fnUrl =
      "https://sfvkkioerqguspxhpjjj.functions.supabase.co/resend-message";

    const edgeRes = await fetch(fnUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        "x-admin-secret": process.env.ADMIN_SECRET || "",
      },
      body: JSON.stringify({
        to: phone,
        type: "text",
        text: { body: finalBody },
        tenant_id: tenantId,
      }),
    });

    const text = await edgeRes.text();

    if (!edgeRes.ok) {
      return NextResponse.json(
        { error: text || `Failed with HTTP ${edgeRes.status}` },
        { status: 500 }
      );
    }

    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch {
      // ignore non-json
    }

    // -------------------------------------------------------------
    // 3️⃣ Return success
    // -------------------------------------------------------------
    return NextResponse.json({
      success: true,
      sent_body: finalBody, // helpful for debugging
      result: json ?? text,
    });
  } catch (err: any) {
    console.error("send message error", err);
    return NextResponse.json(
      { error: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
