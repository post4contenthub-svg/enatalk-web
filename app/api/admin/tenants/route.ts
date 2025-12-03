// app/api/admin/tenants/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function GET() {
  try {
    // 1️⃣ Load tenants
    const { data: tenants, error: tErr } = await supabase
      .from("tenants")
      .select(
        "id, name, plan_code, billing_status, trial_end_at, is_paused"
      )
      .order("created_at", { ascending: false });

    if (tErr) {
      console.error("Tenant load failed:", tErr);
      return NextResponse.json(
        { error: "Failed to load tenants" },
        { status: 500 }
      );
    }

    if (!tenants || tenants.length === 0) {
      return NextResponse.json({ tenants: [] });
    }

    const tenantIds = tenants.map((t) => t.id);

    // 2️⃣ Load all messages for these tenants
    const { data: messages, error: mErr } = await supabase
      .from("messages")
      .select("tenant_id, direction, created_at")
      .in("tenant_id", tenantIds);

    if (mErr) {
      console.error("Message load failed:", mErr);
      return NextResponse.json(
        { error: "Failed to load message stats" },
        { status: 500 }
      );
    }

    // 3️⃣ Aggregate in JS (safe + fast for admin scale)
    const statsMap: Record<
      string,
      { outbound: number; inbound: number; last_message_at: string | null }
    > = {};

    for (const msg of messages ?? []) {
      if (!statsMap[msg.tenant_id]) {
        statsMap[msg.tenant_id] = {
          outbound: 0,
          inbound: 0,
          last_message_at: null,
        };
      }

      if (msg.direction === "outbound") {
        statsMap[msg.tenant_id].outbound++;
      } else if (msg.direction === "inbound") {
        statsMap[msg.tenant_id].inbound++;
      }

      if (
        !statsMap[msg.tenant_id].last_message_at ||
        msg.created_at >
          statsMap[msg.tenant_id].last_message_at!
      ) {
        statsMap[msg.tenant_id].last_message_at = msg.created_at;
      }
    }

    // 4️⃣ Merge back into tenants
    const enrichedTenants = tenants.map((t) => ({
      ...t,
      outbound_count: statsMap[t.id]?.outbound ?? 0,
      inbound_count: statsMap[t.id]?.inbound ?? 0,
      last_message_at: statsMap[t.id]?.last_message_at ?? null,
    }));

    return NextResponse.json({ tenants: enrichedTenants });
  } catch (err) {
    console.error("Admin tenants API crash:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
