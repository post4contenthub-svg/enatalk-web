// app/api/customer/trial-status/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// This assumes you know the tenant_id from auth/session or header.
// For now, we read it from a header x-tenant-id (adjust to your real auth).
export async function GET(req: Request) {
  try {
    const tenantId = req.headers.get("x-tenant-id");

    if (!tenantId) {
      return NextResponse.json(
        { ok: false, error: "MISSING_TENANT_ID" },
        { status: 400 },
      );
    }

    const { data: tenant, error } = await supabaseAdmin
      .from("tenants")
      .select(
        "id, name, billing_status, plan_code, is_paused, trial_end_at, trial_expiry_notified_at",
      )
      .eq("id", tenantId)
      .single();

    if (error || !tenant) {
      console.error("trial-status tenant load error:", error);
      return NextResponse.json(
        { ok: false, error: "TENANT_NOT_FOUND" },
        { status: 404 },
      );
    }

    const now = new Date();
    const trialEnd = tenant.trial_end_at
      ? new Date(tenant.trial_end_at as string)
      : null;

    let status: "no_trial" | "trial_active" | "expiring_soon" | "expired" =
      "no_trial";
    let daysLeft: number | null = null;

    if (trialEnd) {
      const diffDays =
        (trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      daysLeft = Math.ceil(diffDays);

      if (trialEnd < now) {
        status = "expired";
      } else if (diffDays <= 3) {
        status = "expiring_soon";
      } else {
        status = "trial_active";
      }
    }

    return NextResponse.json(
      {
        ok: true,
        tenant: {
          id: tenant.id,
          name: tenant.name,
          billing_status: tenant.billing_status,
          plan_code: tenant.plan_code,
          is_paused: tenant.is_paused,
          trial_end_at: tenant.trial_end_at,
          trial_expiry_notified_at: tenant.trial_expiry_notified_at,
        },
        trial: {
          status,
          daysLeft,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("trial-status internal error:", err);
    return NextResponse.json(
      { ok: false, error: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
