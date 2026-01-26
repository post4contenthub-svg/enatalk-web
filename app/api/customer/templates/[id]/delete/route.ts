import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: templateId } = await context.params;

  if (!templateId) {
    return NextResponse.json(
      { error: "MISSING_TEMPLATE_ID" },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("templates")
    .delete()
    .eq("id", templateId);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}