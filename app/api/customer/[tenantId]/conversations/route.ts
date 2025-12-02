// app/api/customer/[tenantId]/conversations/route.ts
import { NextResponse } from "next/server";

const isUuid = (s: unknown) =>
  typeof s === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

export async function GET(req: Request, { params }: { params: any }) {
  try {
    // Next.js can provide `params` as a Promise in some versions/environments
    const p = await params;
    const tenantParam = p?.tenantId;
    if (!tenantParam) {
      return NextResponse.json({ error: "Missing tenantId parameter" }, { status: 400 });
    }

    const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: "Server misconfigured: SUPABASE_URL or SUPABASE_ANON_KEY missing" }, { status: 500 });
    }

    // Determine tenantId (UUID). If tenantParam is a slug, look up id in tenants table.
    let tenantId = tenantParam;
    if (!isUuid(tenantParam)) {
      // lookup tenant by slug
      const lookupUrl = `${SUPABASE_URL}/rest/v1/tenants?slug=eq.${encodeURIComponent(tenantParam)}&select=id`;
      const lookup = await fetch(lookupUrl, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });
      if (!lookup.ok) {
        const txt = await lookup.text().catch(() => "");
        return NextResponse.json({ error: "Tenant lookup failed", detail: txt }, { status: lookup.status });
      }
      const rows = await lookup.json();
      if (!Array.isArray(rows) || rows.length === 0) {
        return NextResponse.json({ error: "Invalid tenant slug" }, { status: 400 });
      }
      tenantId = rows[0].id;
    }

    // Fetch conversations (adjust view/table name if different in your DB)
    // I used "customer_conversations_view" — change if your view/table name differs
    const convUrl = `${SUPABASE_URL}/rest/v1/customer_conversations_view?tenant_id=eq.${encodeURIComponent(tenantId)}&select=*`;
    const convResp = await fetch(convUrl, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    const text = await convResp.text().catch(() => "");
    const contentType = convResp.headers.get("content-type") ?? "application/json";
    return new NextResponse(text, {
      status: convResp.status,
      headers: { "content-type": contentType },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
