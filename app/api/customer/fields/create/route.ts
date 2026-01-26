import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { tenantId, label, key, show_in_table, type } = await req.json();
    // we ignore "required" because that column doesn't exist in DB

    if (!tenantId || !label || !key) {
      return NextResponse.json(
        { error: "tenantId, label and key are required" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("contact_field_definitions")
      .insert({
        tenant_id: tenantId,
        label,
        key,
        show_in_table: !!show_in_table,
        type: type || "text",
        sort_order: 100, // ✅ small safe integer; adjust later if needed
      });

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
