import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const {
      contactId,
      tenantId,
      phone,
      name,
      tags,
      custom_fields,
      template_id, // ✅ NEW
    } = await req.json();

    if (!contactId || !tenantId) {
      return NextResponse.json(
        { error: "contactId and tenantId are required" },
        { status: 400 }
      );
    }

    // Build update object dynamically
    const update: Record<string, any> = {};

    if (phone !== undefined) update.phone = phone;
    if (name !== undefined) update.name = name;
    if (tags !== undefined) update.tags = tags;
    if (custom_fields !== undefined) update.custom_fields = custom_fields;
    if (template_id !== undefined) update.template_id = template_id; // ✅ NEW

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: "Nothing to update" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("contacts")
      .update(update)
      .eq("id", contactId)
      .eq("tenant_id", tenantId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
