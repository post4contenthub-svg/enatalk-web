import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(req: Request) {
  try {
    const { id, body_text } = await req.json();

    console.log("UPDATE template:", id);

    if (!id) {
      return NextResponse.json(
        { error: "Template ID missing" },
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
    console.error("Update error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}