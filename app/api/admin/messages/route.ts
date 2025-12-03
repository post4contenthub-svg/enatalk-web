// app/api/admin/messages/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function GET() {
  try {
    // Join messages with tenants to get tenant name
    const { data, error } = await supabase
      .from("messages")
      .select(
        "id, tenant_id, direction, to_number, from_number, body_text, status, created_at, tenants(name)"
      )
      .order("created_at", { ascending: false })
      .limit(500); // last 500 messages

    if (error) {
      console.error("Failed to load messages:", error);
      return NextResponse.json(
        { error: "Failed to load messages" },
        { status: 500 }
      );
    }

    // Flatten tenants.name → tenant_name
    const transformed =
      (data ?? []).map((row: any) => ({
        id: row.id,
        tenant_id: row.tenant_id,
        tenant_name: row.tenants?.name ?? null,
        direction: row.direction,
        to_number: row.to_number,
        from_number: row.from_number,
        body_text: row.body_text,
        status: row.status,
        created_at: row.created_at,
      })) ?? [];

    return NextResponse.json({ messages: transformed });
  } catch (err) {
    console.error("Unexpected error in /api/admin/messages:", err);
    return NextResponse.json(
      { error: "Failed to load messages" },
      { status: 500 }
    );
  }
}
