import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(
  req: Request,
  context: { params: { id?: string } }
) {
  try {
    const id = context.params?.id;

    console.log("API received template ID:", id);

    if (!id) {
      return NextResponse.json(
        { error: "Template ID missing" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const body_text = body.body_text;

    if (!body_text) {
      return NextResponse.json(
        { error: "Body text missing" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("templates")
      .update({ body_text })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}