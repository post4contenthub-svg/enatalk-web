import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const { user } = await req.json();

  if (!user?.id || !user?.email) {
    return NextResponse.json({ error: "Invalid user" }, { status: 400 });
  }

  const { data: existing } = await supabaseAdmin
    .from("tenants")
    .select("id")
    .eq("owner_user_id", user.id)
    .single();

  if (existing) {
    return NextResponse.json({ tenantId: existing.id });
  }

  const { data: tenant, error } = await supabaseAdmin
    .from("tenants")
    .insert({
      owner_user_id: user.id,
      name: user.email.split("@")[0],
      plan_code: "free",
      billing_status: "trialing",
      trial_start_at: new Date().toISOString(),
      trial_end_at: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ tenantId: tenant.id });
}