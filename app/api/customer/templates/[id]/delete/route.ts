import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const templateId = params.id;

  if (!templateId) {
    return NextResponse.json(
      { error: "Missing template id" },
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