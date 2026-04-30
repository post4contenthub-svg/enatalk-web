// middleware.ts (root level) — API key auth + rate limiting + plan enforcement
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Hash API key ─────────────────────────────────────────────
function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

// ── Extract API key from request ─────────────────────────────
function extractApiKey(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return req.headers.get("x-api-key");
}

// ── Validate API key ─────────────────────────────────────────
async function validateApiKey(key: string) {
  const hash = hashApiKey(key);
  const { data } = await supabaseAdmin
    .from("api_keys")
    .select("id, user_id, is_active, expires_at")
    .eq("key_hash", hash)
    .single();

  if (!data || !data.is_active) return null;
  if (data.expires_at && new Date(data.expires_at) < new Date()) return null;

  // Update last_used_at
  await supabaseAdmin
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id);

  return data;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Public API routes require API key ────────────────────────
  if (pathname.startsWith("/api/v1/")) {
    const apiKey = extractApiKey(req);

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing API key. Pass it as 'Authorization: Bearer YOUR_KEY' or 'x-api-key' header.", docs: "https://enatalk.com/docs/api" },
        { status: 401 }
      );
    }

    const keyData = await validateApiKey(apiKey);
    if (!keyData) {
      return NextResponse.json(
        { error: "Invalid or expired API key.", docs: "https://enatalk.com/docs/api" },
        { status: 401 }
      );
    }

    // Check API access for plan
    const { data: sub } = await supabaseAdmin
      .from("user_subscriptions")
      .select("subscription_status")
      .eq("user_id", keyData.user_id)
      .single();

    const plan = sub?.subscription_status === "active" || sub?.subscription_status === "trial" ? "starter" : "free";

    const { data: limits } = await supabaseAdmin
      .from("plan_definitions")
      .select("api_calls_per_month")
      .eq("id", plan)
      .single();

    if (!limits || limits.api_calls_per_month === 0) {
      return NextResponse.json(
        { error: "API access is not available on the Free plan. Upgrade to Starter or above.", upgrade_url: "https://enatalk.com/#pricing" },
        { status: 403 }
      );
    }

    // Check monthly API call limit
    if (limits.api_calls_per_month > 0) {
      const periodStart = new Date();
      periodStart.setDate(1);
      periodStart.setHours(0, 0, 0, 0);

      const { data: usage } = await supabaseAdmin
        .from("usage_tracking")
        .select("api_calls_used")
        .eq("user_id", keyData.user_id)
        .eq("period_start", periodStart.toISOString().split("T")[0])
        .single();

      const used = usage?.api_calls_used ?? 0;
      if (used >= limits.api_calls_per_month) {
        return NextResponse.json(
          {
            error: `API rate limit exceeded. You've used ${used}/${limits.api_calls_per_month} calls this month.`,
            upgrade_url: "https://enatalk.com/#pricing",
            resets_at: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
          },
          { status: 429 }
        );
      }
    }

    // Inject user info into request headers for API routes
    const headers = new Headers(req.headers);
    headers.set("x-user-id", keyData.user_id);
    headers.set("x-api-key-id", keyData.id);

    // Log the request
    supabaseAdmin.from("api_request_logs").insert({
      user_id: keyData.user_id,
      api_key_id: keyData.id,
      endpoint: pathname,
      method: req.method,
      ip_address: req.headers.get("x-forwarded-for") ?? "unknown",
    }).then(() => {});

    // Increment API usage
    supabaseAdmin.rpc("increment_usage", {
      p_user_id: keyData.user_id,
      p_field: "api_calls_used",
      p_amount: 1,
    }).then(() => {});

    return NextResponse.next({ request: { headers } });
  }

  // ── Security headers for all routes ─────────────────────────
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  matcher: ["/api/v1/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
