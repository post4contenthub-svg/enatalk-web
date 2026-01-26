import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { tenantId, contactId, templateId } = await req.json();

    if (!tenantId || !contactId) {
      return NextResponse.json(
        { error: "tenantId and contactId are required" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("contacts")
      .update({
        preferred_template_id: templateId || null,
      })
      .eq("id", contactId)
      .eq("tenant_id", tenantId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
