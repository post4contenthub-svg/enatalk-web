// app/api/v1/usage/route.ts — Public API: Get usage stats
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUsage, getUserPlan, getPlanLimits } from "@/lib/plan-enforcement";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [plan, usage] = await Promise.all([getUserPlan(userId), getCurrentUsage(userId)]);
  const limits = await getPlanLimits(plan);

  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const resetsAt = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return NextResponse.json({
    plan,
    billing_period: {
      start: periodStart.toISOString().split("T")[0],
      end: periodEnd.toISOString().split("T")[0],
      resets_at: resetsAt.toISOString(),
    },
    usage: {
      messages: {
        used: usage.messages_used,
        limit: limits?.messages_per_month ?? 500,
        remaining: limits?.messages_per_month === -1 ? -1 : Math.max(0, (limits?.messages_per_month ?? 500) - usage.messages_used),
        unlimited: limits?.messages_per_month === -1,
      },
      broadcasts: {
        used: usage.broadcasts_used,
        limit: limits?.broadcasts_per_month ?? 0,
        remaining: limits?.broadcasts_per_month === -1 ? -1 : Math.max(0, (limits?.broadcasts_per_month ?? 0) - usage.broadcasts_used),
        unlimited: limits?.broadcasts_per_month === -1,
      },
      api_calls: {
        used: usage.api_calls_used,
        limit: limits?.api_calls_per_month ?? 0,
        remaining: limits?.api_calls_per_month === -1 ? -1 : Math.max(0, (limits?.api_calls_per_month ?? 0) - usage.api_calls_used),
        unlimited: limits?.api_calls_per_month === -1,
      },
      contacts: {
        used: usage.contacts_count,
        limit: limits?.contacts_limit ?? 50,
        unlimited: limits?.contacts_limit === -1,
      },
    },
    features: {
      birthday_automation: limits?.birthday_automation ?? false,
      analytics: limits?.analytics_enabled ?? false,
      webhooks: limits?.webhooks_enabled ?? false,
      team_inbox: limits?.team_inbox_enabled ?? false,
      priority_support: limits?.priority_support ?? false,
    },
  });
}
