import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const tenant_id = body.tenant_id as string | undefined;
    const id = body.id as string | undefined;

    const name = (body.name as string | undefined) ?? null;
    const phone = (body.phone as string | undefined)?.trim();
    const custom_fields =
      (body.custom_fields as Record<string, any> | undefined) ?? {};

    if (!tenant_id) {
      return NextResponse.json(
        { ok: false, error: "TENANT_REQUIRED" },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { ok: false, error: "PHONE_REQUIRED" },
        { status: 400 }
      );
    }

    // -------------------------
    // UPDATE
    // -------------------------
    if (id) {
      const { data, error } = await supabaseAdmin
        .from("contacts")
        .update({
          name,
          phone,
          custom_fields,
        })
        .eq("id", id)
        .eq("tenant_id", tenant_id)
        .select("*")
        .single();

      if (error) {
        console.error("Update contact error:", error);
        return NextResponse.json(
          { ok: false, error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ ok: true, contact: data });
    }

    // -------------------------
    // CREATE
    // -------------------------
    const { data, error } = await supabaseAdmin
      .from("contacts")
      .insert({
        tenant_id,
        name,
        phone,
        custom_fields,
        is_opted_out: false,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Insert contact error:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, contact: data },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Contacts API error:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}