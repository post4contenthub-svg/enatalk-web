// app/customer/app/usage/page.tsx — Usage dashboard
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Usage = { messages_used: number; broadcasts_used: number; api_calls_used: number; contacts_count: number; };
type Plan = { id: string; name: string; messages_per_month: number; contacts_limit: number; broadcasts_per_month: number; api_calls_per_month: number; birthday_automation: boolean; analytics_enabled: boolean; webhooks_enabled: boolean; };

function UsageBar({ used, limit, color = "#22C55E" }: { used: number; limit: number; color?: string }) {
  const pct = limit === -1 ? 0 : Math.min(100, Math.round((used / limit) * 100));
  const isWarning = pct >= 80;
  const barColor = pct >= 90 ? "#f87171" : isWarning ? "#F5B800" : color;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{used.toLocaleString()} used</span>
        <span style={{ fontSize: 13, color: limit === -1 ? "#22C55E" : "rgba(255,255,255,0.4)" }}>
          {limit === -1 ? "Unlimited" : `${limit.toLocaleString()} limit`}
        </span>
      </div>
      {limit !== -1 && (
        <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 100, transition: "width 0.5s ease" }}/>
        </div>
      )}
      {limit !== -1 && pct >= 80 && (
        <div style={{ fontSize: 11, color: barColor, marginTop: 5, fontWeight: 600 }}>
          {pct >= 90 ? "⚠️ Almost at limit! " : "📊 "}{pct}% used — {limit - used > 0 ? `${(limit - used).toLocaleString()} remaining` : "limit reached"}
        </div>
      )}
    </div>
  );
}

export default function UsagePage() {
  const supabase = createClient();
  const [usage, setUsage] = useState<Usage | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [planId, setPlanId] = useState("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsage(); }, []);

  async function fetchUsage() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const periodStart = new Date(); periodStart.setDate(1);
    const periodStartStr = periodStart.toISOString().split("T")[0];

    const [{ data: u }, { data: sub }] = await Promise.all([
      supabase.from("usage_tracking").select("*").eq("user_id", user.id).eq("period_start", periodStartStr).single(),
      supabase.from("user_subscriptions").select("subscription_status").eq("user_id", user.id).single(),
    ]);

    const currentPlanId = (sub?.subscription_status === "active" || sub?.subscription_status === "trial") ? "starter" : "free";
    setPlanId(currentPlanId);

    const { data: planData } = await supabase.from("plan_definitions").select("*").eq("id", currentPlanId).single();
    setPlan(planData);
    setUsage({ messages_used: u?.messages_used ?? 0, broadcasts_used: u?.broadcasts_used ?? 0, api_calls_used: u?.api_calls_used ?? 0, contacts_count: u?.contacts_count ?? 0 });
    setLoading(false);
  }

  const now = new Date();
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysLeft = Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", color: "#fff", maxWidth: 860, padding: 32 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bricolage+Grotesque:wght@700;800&display=swap" rel="stylesheet"/>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: "-0.5px", marginBottom: 6 }}>Usage & Limits</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>Billing period: {now.toLocaleString("en-IN", { month: "long", year: "numeric" })} · {daysLeft} days remaining</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, background: "rgba(34,197,94,0.12)", color: "#22C55E", padding: "6px 16px", borderRadius: 100, fontWeight: 700, border: "1px solid rgba(34,197,94,0.25)" }}>
            {plan?.name ?? "Free"} Plan
          </span>
          <a href="/#pricing" style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", textDecoration: "none", padding: "6px 14px", background: "rgba(255,255,255,0.05)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)" }}>Upgrade →</a>
        </div>
      </div>

      {loading ? (
        <div style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", padding: 60 }}>Loading usage…</div>
      ) : (
        <>
          {/* Usage cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Messages", icon: "💬", used: usage?.messages_used ?? 0, limit: plan?.messages_per_month ?? 500, desc: "WhatsApp messages sent this month" },
              { label: "Contacts", icon: "👥", used: usage?.contacts_count ?? 0, limit: plan?.contacts_limit ?? 50, desc: "Total contacts in your list" },
              { label: "Broadcasts", icon: "📣", used: usage?.broadcasts_used ?? 0, limit: plan?.broadcasts_per_month ?? 0, desc: "Bulk campaign sends this month" },
              { label: "API Calls", icon: "⚡", used: usage?.api_calls_used ?? 0, limit: plan?.api_calls_per_month ?? 0, desc: "API requests this month" },
            ].map(item => (
              <div key={item.label} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "22px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{item.desc}</div>
                  </div>
                </div>
                {item.limit === 0 ? (
                  <div style={{ padding: "12px", background: "rgba(245,184,0,0.06)", border: "1px solid rgba(245,184,0,0.15)", borderRadius: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 12, color: "#F5B800", fontWeight: 600 }}>Not available on {plan?.name} plan</div>
                    <a href="/#pricing" style={{ fontSize: 12, color: "#22C55E", textDecoration: "none", fontWeight: 600 }}>Upgrade to unlock →</a>
                  </div>
                ) : (
                  <UsageBar used={item.used} limit={item.limit}/>
                )}
              </div>
            ))}
          </div>

          {/* Features */}
          <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "22px 24px", marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 18 }}>Features on your plan</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
              {[
                { label: "Birthday Automation", enabled: plan?.birthday_automation ?? false, icon: "🎂" },
                { label: "Analytics Dashboard", enabled: plan?.analytics_enabled ?? false, icon: "📊" },
                { label: "Webhooks & API", enabled: plan?.webhooks_enabled ?? false, icon: "⚡" },
                { label: "Team Inbox", enabled: plan?.webhooks_enabled ?? false, icon: "👥" },
                { label: "Priority Support", enabled: false, icon: "🎯" },
                { label: "CSV Import", enabled: plan?.id !== "free", icon: "📥" },
              ].map(f => (
                <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: f.enabled ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${f.enabled ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)"}`, borderRadius: 10 }}>
                  <span style={{ fontSize: 16 }}>{f.icon}</span>
                  <span style={{ fontSize: 13, color: f.enabled ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)", fontWeight: f.enabled ? 500 : 400 }}>{f.label}</span>
                  <span style={{ marginLeft: "auto", fontSize: 14 }}>{f.enabled ? "✅" : "🔒"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade CTA if on free */}
          {planId === "free" && (
            <div style={{ background: "linear-gradient(135deg,rgba(34,197,94,0.08),rgba(34,197,94,0.04))", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 16, padding: "24px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 6 }}>Upgrade to Starter — ₹299/mo</div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>Get 3,000 messages, 500 contacts, birthday automation, CSV import and more.</p>
              </div>
              <a href="/#pricing" style={{ padding: "12px 24px", background: "linear-gradient(135deg,#22C55E,#16A34A)", color: "#fff", borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 14px rgba(34,197,94,0.3)", flexShrink: 0 }}>View Plans →</a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
