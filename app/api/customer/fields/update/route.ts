import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { id, show_in_table } = await req.json();
    // "required" will be ignored for now (no column in DB)

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const update: any = {};
    if (typeof show_in_table === "boolean") {
      update.show_in_table = show_in_table;
    }

    if (Object.keys(update).length === 0) {
      // nothing to update, just succeed
      return NextResponse.json({ success: true });
    }

    const { error } = await supabaseAdmin
      .from("contact_field_definitions")
      .update(update)
      .eq("id", id);

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
