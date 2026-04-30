// app/api/v1/contacts/route.ts — Public API: Manage contacts
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkCanAddContact, getUpgradeMessage } from "@/lib/plan-enforcement";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 500);
  const offset = parseInt(searchParams.get("offset") ?? "0");
  const search = searchParams.get("search");

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("contacts")
    .select("id, name, phone, tags, opted_in, created_at", { count: "exact" })
    .eq("tenant_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);

  const { data, count } = await query;
  return NextResponse.json({ data, total: count, limit, offset });
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const check = await checkCanAddContact(userId);
  if (!check.allowed) {
    return NextResponse.json({ error: getUpgradeMessage(check), code: check.reason, upgrade_url: "https://enatalk.com/#pricing" }, { status: 429 });
  }

  const { name, phone, tags, opted_in } = await req.json();
  if (!phone) return NextResponse.json({ error: "phone is required" }, { status: 400 });

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("contacts")
    .insert({ name, phone, tags, opted_in: opted_in ?? true, tenant_id: userId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true, contact: data }, { status: 201 });
}
