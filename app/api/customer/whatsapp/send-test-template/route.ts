// app/api/customer/whatsapp/send-test-template/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendWhatsAppTemplate } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    const { contact_id } = await req.json();

    const { data: contact, error } = await supabaseAdmin
      .from("contacts")
      .select("phone, name")
      .eq("id", contact_id)
      .single();

    if (error || !contact) {
      return NextResponse.json(
        { error: "CONTACT_NOT_FOUND" },
        { status: 404 }
      );
    }

    const result = await sendWhatsAppTemplate({
      to: contact.phone,
      templateName: "test_open_chat", // ⚠️ MUST EXIST & BE APPROVED
      language: "en",
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: contact.name || "Customer" },
          ],
        },
      ],
    });

    if (!result.success) {
      console.error("Template send failed:", result.raw);
      return NextResponse.json(
        { error: "TEMPLATE_SEND_FAILED", raw: result.raw },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Send test template error:", err);
    return NextResponse.json(
      { error: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}