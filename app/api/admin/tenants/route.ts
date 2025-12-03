// app/api/admin/tenants/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export async function GET() {
  try {
    // 1) Load tenants (portfolio list)
    const { data: tenants, error: tErr } = await supabase
      .from("tenants")
      .select(
        `
        id,
        name,
        plan_code,
        billing_status,
        trial_end_at,
        is_paused
      `,
      )
      .order("created_at", { ascending: true });

    if (tErr || !tenants) {
      console.error("Failed to load tenants:", tErr);
      return NextResponse.json(
        { error: "Failed to load tenants" },
        { status: 500 },
      );
    }

    const tenantIds = tenants.map((t) => t.id as string);

    // Default map so we can safely attach stats
    const stats: Record<
      string,
      { outbound_count: number; inbound_count: number; last_message_at: string | null }
    > = {};
    for (const id of tenantIds) {
      stats[id] = {
        outbound_count: 0,
        inbound_count: 0,
        last_message_at: null,
      };
    }

    if (tenantIds.length > 0) {
      // 2) Aggregate counts per tenant & direction
      const { data: counts, error: cErr } = await supabase
        .from("messages")
        .select("tenant_id, direction, count:count(*)")
        .in("tenant_id", tenantIds)
        .group("tenant_id, direction");

      if (cErr) {
        console.error("Failed to load message counts:", cErr);
      } else if (counts) {
        for (const row of counts as any[]) {
          const tenantId = row.tenant_id as string;
          const direction = row.direction as string;
          const count = Number(row.count) || 0;
          const entry = stats[tenantId];
          if (!entry) continue;

          if (direction === "outbound") {
            entry.outbound_count = count;
          } else if (direction === "inbound") {
            entry.inbound_count = count;
          }
        }
      }

      // 3) Last message per tenant (max created_at)
      const { data: lastRows, error: lastErr } = await supabase
        .from("messages")
        .select("tenant_id, created_at")
        .in("tenant_id", tenantIds)
        .order("created_at", { ascending: false });

      if (lastErr) {
        console.error("Failed to load last message timestamps:", lastErr);
      } else if (lastRows) {
        for (const row of lastRows as any[]) {
          const tenantId = row.tenant_id as string;
          const createdAt = row.created_at as string;
          const entry = stats[tenantId];
          if (!entry) continue;

          // first time we see this tenant (because sorted desc)
          if (!entry.last_message_at) {
            entry.last_message_at = createdAt;
          }
        }
      }
    }

    // 4) Attach stats to tenants
    const result = tenants.map((t) => ({
      ...t,
      outbound_count: stats[t.id]?.outbound_count ?? 0,
      inbound_count: stats[t.id]?.inbound_count ?? 0,
      last_message_at: stats[t.id]?.last_message_at ?? null,
    }));

    return NextResponse.json({ tenants: result });
  } catch (err) {
    console.error("Unexpected error in /api/admin/tenants:", err);
    return NextResponse.json(
      { error: "Failed to load tenants" },
      { status: 500 },
    );
  }
}
