import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { contactId, tenantId } = await req.json();

    if (!contactId || !tenantId) {
      return NextResponse.json(
        { error: "contactId and tenantId are required" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("contacts")
      .delete()
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
