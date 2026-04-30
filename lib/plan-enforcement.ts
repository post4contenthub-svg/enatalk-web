// lib/plan-enforcement.ts
// Use this in any API route or server action before allowing user actions

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type PlanId = "free" | "starter" | "growth" | "pro";

export interface PlanLimits {
  id: PlanId;
  name: string;
  messages_per_month: number;
  contacts_limit: number;
  broadcasts_per_month: number;
  team_members_limit: number;
  whatsapp_numbers_limit: number;
  api_calls_per_month: number;
  csv_import_rows: number;
  birthday_automation: boolean;
  analytics_enabled: boolean;
  webhooks_enabled: boolean;
  team_inbox_enabled: boolean;
  priority_support: boolean;
}

export interface UsageData {
  messages_used: number;
  broadcasts_used: number;
  api_calls_used: number;
  contacts_count: number;
  team_members_count: number;
}

export interface CheckResult {
  allowed: boolean;
  reason?: string;
  used?: number;
  limit?: number;
  remaining?: number;
  plan?: PlanId;
  upgrade_to?: PlanId;
}

// ── Get user's current plan ──────────────────────────────────
export async function getUserPlan(userId: string): Promise<PlanId> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("user_subscriptions")
    .select("subscription_status")
    .eq("user_id", userId)
    .single();

  if (!data) return "free";
  if (data.subscription_status === "active" || data.subscription_status === "trial") return "starter";
  return "free";
}

// ── Get plan limits ──────────────────────────────────────────
export async function getPlanLimits(planId: PlanId): Promise<PlanLimits | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("plan_definitions")
    .select("*")
    .eq("id", planId)
    .single();
  return data;
}

// ── Get current usage ────────────────────────────────────────
export async function getCurrentUsage(userId: string): Promise<UsageData> {
  const supabase = await createSupabaseServerClient();
  const periodStart = new Date();
  periodStart.setDate(1);
  const periodStartStr = periodStart.toISOString().split("T")[0];

  const { data } = await supabase
    .from("usage_tracking")
    .select("*")
    .eq("user_id", userId)
    .eq("period_start", periodStartStr)
    .single();

  return {
    messages_used: data?.messages_used ?? 0,
    broadcasts_used: data?.broadcasts_used ?? 0,
    api_calls_used: data?.api_calls_used ?? 0,
    contacts_count: data?.contacts_count ?? 0,
    team_members_count: data?.team_members_count ?? 0,
  };
}

// ── Increment usage ──────────────────────────────────────────
export async function incrementUsage(
  userId: string,
  field: "messages_used" | "broadcasts_used" | "api_calls_used",
  amount = 1
): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.rpc("increment_usage", {
    p_user_id: userId,
    p_field: field,
    p_amount: amount,
  });
}

// ── Check: can send message? ─────────────────────────────────
export async function checkCanSendMessage(userId: string): Promise<CheckResult> {
  const plan = await getUserPlan(userId);
  const [limits, usage] = await Promise.all([getPlanLimits(plan), getCurrentUsage(userId)]);
  if (!limits) return { allowed: false, reason: "plan_not_found" };
  if (limits.messages_per_month === -1) return { allowed: true, plan, remaining: -1 };
  const remaining = limits.messages_per_month - usage.messages_used;
  if (remaining <= 0) {
    return {
      allowed: false,
      reason: "message_limit_reached",
      used: usage.messages_used,
      limit: limits.messages_per_month,
      plan,
      upgrade_to: plan === "free" ? "starter" : plan === "starter" ? "growth" : "pro",
    };
  }
  return { allowed: true, plan, remaining, used: usage.messages_used, limit: limits.messages_per_month };
}

// ── Check: can add contact? ──────────────────────────────────
export async function checkCanAddContact(userId: string): Promise<CheckResult> {
  const supabase = await createSupabaseServerClient();
  const plan = await getUserPlan(userId);
  const limits = await getPlanLimits(plan);
  if (!limits) return { allowed: false, reason: "plan_not_found" };
  if (limits.contacts_limit === -1) return { allowed: true, plan };

  const { count } = await supabase
    .from("contacts")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", userId);

  const current = count ?? 0;
  if (current >= limits.contacts_limit) {
    return {
      allowed: false,
      reason: "contact_limit_reached",
      used: current,
      limit: limits.contacts_limit,
      plan,
      upgrade_to: plan === "free" ? "starter" : "growth",
    };
  }
  return { allowed: true, plan, remaining: limits.contacts_limit - current, used: current, limit: limits.contacts_limit };
}

// ── Check: can use broadcast? ────────────────────────────────
export async function checkCanBroadcast(userId: string): Promise<CheckResult> {
  const plan = await getUserPlan(userId);
  const [limits, usage] = await Promise.all([getPlanLimits(plan), getCurrentUsage(userId)]);
  if (!limits) return { allowed: false, reason: "plan_not_found" };
  if (limits.broadcasts_per_month === 0) {
    return { allowed: false, reason: "feature_not_available", plan, upgrade_to: "starter" };
  }
  if (limits.broadcasts_per_month === -1) return { allowed: true, plan };
  const remaining = limits.broadcasts_per_month - usage.broadcasts_used;
  if (remaining <= 0) {
    return {
      allowed: false,
      reason: "broadcast_limit_reached",
      used: usage.broadcasts_used,
      limit: limits.broadcasts_per_month,
      plan,
      upgrade_to: "growth",
    };
  }
  return { allowed: true, plan, remaining, used: usage.broadcasts_used, limit: limits.broadcasts_per_month };
}

// ── Check: can use API? ──────────────────────────────────────
export async function checkCanUseApi(userId: string): Promise<CheckResult> {
  const plan = await getUserPlan(userId);
  const [limits, usage] = await Promise.all([getPlanLimits(plan), getCurrentUsage(userId)]);
  if (!limits) return { allowed: false, reason: "plan_not_found" };
  if (limits.api_calls_per_month === 0) {
    return { allowed: false, reason: "api_not_available", plan, upgrade_to: "starter" };
  }
  if (limits.api_calls_per_month === -1) return { allowed: true, plan };
  const remaining = limits.api_calls_per_month - usage.api_calls_used;
  if (remaining <= 0) {
    return {
      allowed: false,
      reason: "api_limit_reached",
      used: usage.api_calls_used,
      limit: limits.api_calls_per_month,
      plan,
      upgrade_to: "growth",
    };
  }
  return { allowed: true, plan, remaining, used: usage.api_calls_used, limit: limits.api_calls_per_month };
}

// ── Check: feature flag ──────────────────────────────────────
export async function checkFeatureAccess(
  userId: string,
  feature: keyof Pick<PlanLimits, "birthday_automation" | "analytics_enabled" | "webhooks_enabled" | "team_inbox_enabled" | "priority_support">
): Promise<CheckResult> {
  const plan = await getUserPlan(userId);
  const limits = await getPlanLimits(plan);
  if (!limits) return { allowed: false, reason: "plan_not_found" };
  if (!limits[feature]) {
    return { allowed: false, reason: "feature_not_in_plan", plan, upgrade_to: "starter" };
  }
  return { allowed: true, plan };
}

// ── Friendly error messages ──────────────────────────────────
export function getUpgradeMessage(result: CheckResult): string {
  const messages: Record<string, string> = {
    message_limit_reached: `You've used all ${result.limit} messages this month on your ${result.plan} plan. Upgrade to send more.`,
    contact_limit_reached: `You've reached your ${result.limit} contact limit. Upgrade to add more contacts.`,
    broadcast_limit_reached: `You've used all ${result.limit} broadcasts this month. Upgrade for unlimited broadcasts.`,
    api_limit_reached: `You've used all ${result.limit?.toLocaleString()} API calls this month. Upgrade for more.`,
    feature_not_available: `This feature is not available on your current plan. Please upgrade.`,
    api_not_available: `API access is not available on the Free plan. Upgrade to Starter or above.`,
    feature_not_in_plan: `This feature requires a higher plan.`,
  };
  return messages[result.reason ?? ""] ?? "Please upgrade your plan to continue.";
}
