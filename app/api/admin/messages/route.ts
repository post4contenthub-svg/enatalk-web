// app/api/admin/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenant_id");

    // 🔹 If tenant_id is provided → return messages only for that tenant
    if (tenantId) {
      const { data, error } = await supabase
        .from("messages")
        .select(
          "id, tenant_id, direction, to_number, from_number, body_text, status, created_at"
        )
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false })
        .limit(500);

      if (error) {
        console.error("Failed to load tenant messages:", error);
        return NextResponse.json(
          { error: "Failed to load messages" },
          { status: 500 }
        );
      }

      return NextResponse.json({ messages: data ?? [] });
    }

    // 🔹 No tenant_id → global log with tenant names (used if needed elsewhere)
    const { data: messages, error: mErr } = await supabase
      .from("messages")
      .select(
        "id, tenant_id, direction, to_number, from_number, body_text, status, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(500);

    if (mErr) {
      console.error("Failed to load messages:", mErr);
      return NextResponse.json(
        { error: "Failed to load messages" },
        { status: 500 }
      );
    }

    const safeMessages = messages ?? [];

    const tenantIds = Array.from(
      new Set(
        safeMessages
          .map((m: any) => m.tenant_id)
          .filter((id: string | null) => !!id)
      )
    ) as string[];

    let tenantMap: Record<string, string> = {};

    if (tenantIds.length > 0) {
      const { data: tenants, error: tErr } = await supabase
        .from("tenants")
        .select("id, name")
        .in("id", tenantIds);

      if (tErr) {
        console.error("Failed to load tenants for messages:", tErr);
      } else {
        tenantMap = (tenants ?? []).reduce(
          (acc: Record<string, string>, t: any) => {
            acc[t.id] = t.name ?? t.id;
            return acc;
          },
          {}
        );
      }
    }

    const transformed = safeMessages.map((m: any) => ({
      id: m.id,
      tenant_id: m.tenant_id,
      tenant_name: m.tenant_id ? tenantMap[m.tenant_id] ?? null : null,
      direction: m.direction,
      to_number: m.to_number,
      from_number: m.from_number,
      body_text: m.body_text,
      status: m.status,
      created_at: m.created_at,
    }));

    return NextResponse.json({ messages: transformed });
  } catch (err) {
    console.error("Unexpected error in /api/admin/messages:", err);
    return NextResponse.json(
      { error: "Failed to load messages" },
      { status: 500 }
    );
  }
}
