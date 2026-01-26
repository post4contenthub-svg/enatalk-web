import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const tenantId = url.searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json(
        { error: "tenantId is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("contact_field_definitions")
      .select("id, key, label, show_in_table, sort_order, type")
      .eq("tenant_id", tenantId)
      .order("sort_order", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // DB has no "required" column – add a default false in the response
    const fieldsWithRequired = (data ?? []).map((f: any) => ({
      ...f,
      required: false,
    }));

    return NextResponse.json({ fields: fieldsWithRequired });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
