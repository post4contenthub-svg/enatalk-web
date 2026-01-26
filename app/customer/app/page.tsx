import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { CustomerTrialBanner } from "./components/CustomerTrialBanner";
<div className="space-y-4">
  <CustomerTrialBanner />

  {/* rest of your UI */}
</div>

const PLAN_LIMITS: Record<string, number | null> = {
  free: 500,
  basic: 2000,
  starter: 5000,
  growth: 20000,
  pro: 50000,
  enterprise: null, // unlimited
};

function formatDate(d: string | null): string {
  if (!d) return "-";
  const date = new Date(d);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function OverviewPage() {
  // TODO: later derive tenant_id from logged-in user.
  const TENANT_ID = "5ddd6091-ba29-4b65-8684-f9da79f28af7";

  // 1) Load tenant info
  const { data: tenant, error: tenantError } = await supabaseAdmin
    .from("tenants")
    .select(
      "id, name, plan_code, billing_status, is_paused, trial_start_at, trial_end_at",
    )
    .eq("id", TENANT_ID)
    .single();

  if (tenantError || !tenant) {
    console.error("Tenant load error on overview:", tenantError);
  }

  // 2) Determine plan + limit
  const isTrialing = tenant?.billing_status === "trialing";
  const rawPlanCode = (tenant?.plan_code as string | null) ?? null;
  const planCode = rawPlanCode ?? (isTrialing ? "free" : "free");
  const maxMessages =
    planCode in PLAN_LIMITS ? PLAN_LIMITS[planCode] : PLAN_LIMITS["free"];

  // 3) Count messages usage (same logic as resend-message, lifetime outbound for now)
  let usedMessages = 0;
  let usageError: unknown = null;

  {
    const { count, error } = await supabaseAdmin
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", TENANT_ID)
      .eq("direction", "outbound");

    if (error) {
      console.error("Usage count error on overview:", error);
      usageError = error;
    } else {
      usedMessages = count ?? 0;
    }
  }

  // 4) Recent messages
  const { data: recentMessages, error: recentError } = await supabaseAdmin
    .from("messages")
    .select("id, to_number, body_text, status, created_at")
    .eq("tenant_id", TENANT_ID)
    .eq("direction", "outbound")
    .order("created_at", { ascending: false })
    .limit(5);

  if (recentError) {
    console.error("Recent messages error:", recentError);
  }

  const usagePercent =
    maxMessages && maxMessages > 0
      ? Math.min(100, (usedMessages / maxMessages) * 100)
      : 0;

  const trialEndsOn = formatDate((tenant?.trial_end_at as string) ?? null);
  const trialStatusLabel = tenant?.billing_status ?? "unknown";
  const isPaused = !!tenant?.is_paused;

  return (
    <div className="space-y-6">
      {/* Top row: Trial + Usage */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Trial status card */}
        <div className="col-span-1 rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Trial / plan status</h2>
            <span
              className={[
                "rounded-full px-2 py-0.5 text-xs font-medium",
                isPaused
                  ? "bg-rose-50 text-rose-700"
                  : isTrialing
                  ? "bg-amber-50 text-amber-700"
                  : "bg-emerald-50 text-emerald-700",
              ].join(" ")}
            >
              {isPaused ? "Paused" : trialStatusLabel}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Workspace:{" "}
            <span className="font-medium text-slate-800">
              {tenant?.name ?? "Unknown workspace"}
            </span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Plan:{" "}
            <span className="font-medium text-slate-700">
              {planCode ?? "free"}
            </span>
            {maxMessages &&
              ` • Limit: ${maxMessages.toLocaleString("en-IN")} msgs`}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Trial ends on:{" "}
            <span className="font-medium text-slate-700">{trialEndsOn}</span>
          </p>
          {isPaused && (
            <div className="mt-3 rounded-lg bg-rose-50 p-2 text-[11px] text-rose-700">
              This workspace is paused. Sending is blocked until it is
              reactivated.
            </div>
          )}
        </div>

        {/* Usage card */}
        <div className="col-span-1 rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold">Message usage</h2>
          {usageError ? (
            <p className="text-xs text-rose-600">
              Could not load usage. Please refresh or contact support.
            </p>
          ) : (
            <>
              <p className="text-xs text-slate-500">
                {maxMessages
                  ? `${usedMessages} of ${maxMessages.toLocaleString(
                      "en-IN",
                    )} outbound messages used.`
                  : `${usedMessages} outbound messages sent.`}
              </p>
              <div className="mt-3 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-slate-500">
                <span>0</span>
                <span>{usedMessages}</span>
                <span>{maxMessages ?? "∞"}</span>
              </div>
            </>
          )}
        </div>

        {/* Account health */}
        <div className="col-span-1 rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold">Account health</h2>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>
                WhatsApp connection: <b>Configured (via EnaTalk backend)</b>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span
                className={
                  isPaused
                    ? "h-2 w-2 rounded-full bg-rose-500"
                    : "h-2 w-2 rounded-full bg-emerald-500"
                }
              />
              <span>
                Sending status:{" "}
                <b>{isPaused ? "Blocked (paused)" : "Allowed"}</b>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-100" />
              <span>
                Plan code: <b>{planCode}</b>
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom row: Recent activity */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Recent messages */}
        <div className="col-span-2 rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent messages</h2>
            <span className="text-[11px] text-slate-500">
              Showing last {recentMessages?.length ?? 0} messages
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border bg-slate-50">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2">To</th>
                  <th className="px-3 py-2">Body</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {(recentMessages ?? []).map((msg) => (
                  <tr key={msg.id}>
                    <td className="px-3 py-2 text-xs text-slate-700">
                      {msg.to_number}
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-600 max-w-xs truncate">
                      {msg.body_text}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      <span
                        className={[
                          "rounded-full px-2 py-0.5 text-[10px] font-medium",
                          msg.status === "sent"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700",
                        ].join(" ")}
                      >
                        {msg.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-500">
                      {formatDate(msg.created_at as string)}
                    </td>
                  </tr>
                ))}
                {!recentMessages?.length && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-6 text-center text-xs text-slate-400"
                    >
                      No outbound messages yet. Send a test message from your
                      app to see activity here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick actions */}
        <div className="col-span-1 rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold">Get started</h2>
          <div className="space-y-3 text-xs">
            <button className="w-full rounded-lg bg-emerald-500 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-600">
              Create your first campaign
            </button>
            <button className="w-full rounded-lg border px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
              Browse ready-made templates
            </button>
            <button className="w-full rounded-lg border px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
              Import contacts from CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
