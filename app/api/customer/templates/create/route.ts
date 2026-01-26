import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { tenantId, name, category, language, body_text } = await req.json();

    if (!tenantId || !name || !body_text) {
      return NextResponse.json(
        { error: "tenantId, name and body_text are required" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("templates").insert({
      tenant_id: tenantId,
      name,
      category: category || "marketing",
      language: language || "en",
      body_text,
      is_active: true,
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
