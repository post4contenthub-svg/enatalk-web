// app/customer/app/page.tsx — Smart freemium dashboard
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import UpgradePrompt from "@/components/UpgradePrompt";

type Plan = "free" | "starter" | "growth" | "pro";
type Usage = { messages: number; contacts: number; broadcasts: number; };

const planLimits: Record<Plan, { messages: number; contacts: number; broadcasts: number }> = {
  free:    { messages: 500,    contacts: 50,    broadcasts: 0 },
  starter: { messages: 3000,   contacts: 500,   broadcasts: 5 },
  growth:  { messages: 10000,  contacts: 5000,  broadcasts: -1 },
  pro:     { messages: -1,     contacts: -1,    broadcasts: -1 },
};

const planColors: Record<Plan, string> = {
  free: "#F5B800", starter: "#22C55E", growth: "#3B8BEB", pro: "#A78BFA",
};

function UsageBar({ used, limit, color }: { used: number; limit: number; color: string }) {
  if (limit === -1) return <div style={{ fontSize: 12, color: "#22C55E", fontWeight: 600 }}>Unlimited ✓</div>;
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const barColor = pct >= 90 ? "#f87171" : pct >= 70 ? "#F5B800" : color;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
        <span style={{ color: "rgba(255,255,255,0.55)" }}>{used.toLocaleString()} / {limit.toLocaleString()}</span>
        <span style={{ color: barColor, fontWeight: 700 }}>{pct}%</span>
      </div>
      <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 100, transition: "width 0.6s ease" }}/>
      </div>
    </div>
  );
}

export default function CustomerDashboard() {
  const supabase = createClient();
  const [plan, setPlan] = useState<Plan>("free");
  const [usage, setUsage] = useState<Usage>({ messages: 0, contacts: 0, broadcasts: 0 });
  const [userName, setUserName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [waConnected, setWaConnected] = useState(false);
  const [upgradeFor, setUpgradeFor] = useState<"messages"|"contacts"|"broadcast"|"api"|"analytics"|"team"|null>(null);
  const [loading, setLoading] = useState(true);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setUserName(user.user_metadata?.full_name?.split(" ")[0] || "there");

    const [{ data: sub }, { data: profile }, { data: wa }] = await Promise.all([
      supabase.from("user_subscriptions").select("*").eq("user_id", user.id).single(),
      supabase.from("user_profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("wa_connections").select("id").eq("tenant_id", user.id).limit(1),
    ]);

    if (sub) {
      setPlan((sub.plan || "free") as Plan);
      if (sub.trial_end) {
        const days = Math.ceil((new Date(sub.trial_end).getTime() - Date.now()) / 86400000);
        if (days > 0 && days <= 14) setDaysLeft(days);
      }
    }
    if (profile) setBusinessName(profile.business_name || "");
    setWaConnected(!!wa?.length);

    // Fetch usage
    const now = new Date();
    const periodStart = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-01`;
    const { data: u } = await supabase.from("usage_tracking").select("*").eq("user_id", user.id).eq("period_start", periodStart).single();
    if (u) setUsage({ messages: u.messages_used || 0, contacts: u.contacts_count || 0, broadcasts: u.broadcasts_used || 0 });

    setLoading(false);
  }

  const limits = planLimits[plan];
  const msgPct = limits.messages === -1 ? 0 : Math.round((usage.messages / limits.messages) * 100);
  const planColor = planColors[plan];

  const quickActions = [
    { icon: "📣", label: "New Campaign", href: "/customer/app/campaigns", locked: plan === "free", lockReason: "broadcast" as const },
    { icon: "👥", label: "Add Contacts", href: "/customer/app/contacts", locked: false, lockReason: null },
    { icon: "🎂", label: "Birthday Auto", href: "/customer/app/automations", locked: plan === "free", lockReason: "analytics" as const },
    { icon: "📊", label: "Analytics", href: "/customer/app/usage", locked: plan === "free", lockReason: "analytics" as const },
    { icon: "⚡", label: "API Keys", href: "/customer/app/api-keys", locked: plan === "free" || plan === "starter", lockReason: "api" as const },
    { icon: "🎫", label: "Support", href: "/customer/app/support", locked: false, lockReason: null },
  ];

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", fontFamily: "'DM Sans',sans-serif", color: "rgba(255,255,255,0.4)" }}>
      Loading your dashboard…
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", color: "#fff", maxWidth: 900, padding: "0 4px" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bricolage+Grotesque:wght@700;800&display=swap" rel="stylesheet"/>

      {/* Upgrade prompt modal */}
      {upgradeFor && <UpgradePrompt trigger={upgradeFor} currentPlan={plan} used={upgradeFor === "messages" ? usage.messages : upgradeFor === "contacts" ? usage.contacts : undefined} limit={upgradeFor === "messages" ? limits.messages : upgradeFor === "contacts" ? limits.contacts : undefined} onClose={() => setUpgradeFor(null)}/>}

      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: "clamp(22px,4vw,30px)", letterSpacing: "-0.8px", marginBottom: 6 }}>
          Hey {userName} 👋
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>
          {businessName ? `${businessName} · ` : ""}
          <span style={{ color: planColor, fontWeight: 700, textTransform: "capitalize" }}>{plan} Plan</span>
          {daysLeft !== null && <span style={{ color: "#F5B800" }}> · {daysLeft} days left in trial</span>}
        </p>
      </div>

      {/* Trial banner */}
      {daysLeft !== null && daysLeft <= 7 && (
        <div onClick={() => setUpgradeFor("messages")} style={{ cursor: "pointer", background: "linear-gradient(135deg,rgba(245,184,0,0.1),rgba(245,184,0,0.05))", border: "1px solid rgba(245,184,0,0.3)", borderRadius: 16, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 28 }}>⏰</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: "#F5B800", marginBottom: 4 }}>Trial ends in {daysLeft} days</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Upgrade to keep sending campaigns without interruption.</div>
          </div>
          <span style={{ fontSize: 13, color: "#F5B800", fontWeight: 700, flexShrink: 0 }}>Upgrade →</span>
        </div>
      )}

      {/* Message limit warning */}
      {msgPct >= 80 && plan !== "pro" && (
        <div onClick={() => setUpgradeFor("messages")} style={{ cursor: "pointer", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 16, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 28 }}>{msgPct >= 100 ? "🚫" : "⚠️"}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: "#f87171", marginBottom: 4 }}>
              {msgPct >= 100 ? "Message limit reached" : `${msgPct}% of messages used`}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
              {msgPct >= 100 ? "Upgrade now to continue sending." : `${limits.messages - usage.messages} messages remaining this month.`}
            </div>
          </div>
          <span style={{ fontSize: 13, color: "#f87171", fontWeight: 700, flexShrink: 0 }}>Upgrade →</span>
        </div>
      )}

      {/* Connect WhatsApp banner */}
      {!waConnected && (
        <Link href="/customer/app/connect-whatsapp" style={{ display: "flex", alignItems: "center", gap: 14, background: "linear-gradient(135deg,rgba(34,197,94,0.10),rgba(34,197,94,0.04))", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 16, padding: "18px 22px", marginBottom: 20, textDecoration: "none" }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📱</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: "#22C55E", marginBottom: 4 }}>Connect your WhatsApp number</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Required to send campaigns. Takes 2 minutes.</div>
          </div>
          <span style={{ fontSize: 20, color: "#22C55E" }}>→</span>
        </Link>
      )}

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Messages Sent", value: usage.messages, icon: "💬", limit: limits.messages, type: "messages" as const },
          { label: "Contacts", value: usage.contacts, icon: "👥", limit: limits.contacts, type: "contacts" as const },
          { label: "Broadcasts", value: usage.broadcasts, icon: "📣", limit: limits.broadcasts, type: "broadcast" as const },
        ].map(stat => (
          <div key={stat.label} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{stat.label}</span>
              <span style={{ fontSize: 18 }}>{stat.icon}</span>
            </div>
            <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-1px", color: "#fff", marginBottom: 10 }}>
              {stat.limit === 0 ? "—" : stat.value.toLocaleString()}
            </div>
            {stat.limit === 0 ? (
              <button onClick={() => setUpgradeFor(stat.type)} style={{ fontSize: 11, color: "#F5B800", background: "rgba(245,184,0,0.1)", border: "1px solid rgba(245,184,0,0.2)", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 700 }}>
                🔒 Upgrade to unlock
              </button>
            ) : (
              <UsageBar used={stat.value} limit={stat.limit} color={planColor}/>
            )}
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px", marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Quick Actions</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {quickActions.map(action => (
            action.locked ? (
              <button key={action.label} onClick={() => action.lockReason && setUpgradeFor(action.lockReason)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "16px 10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", position: "relative" }}>
                <span style={{ fontSize: 24, filter: "grayscale(1)", opacity: 0.4 }}>{action.icon}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>{action.label}</span>
                <span style={{ position: "absolute", top: 8, right: 8, fontSize: 10 }}>🔒</span>
              </button>
            ) : (
              <Link key={action.label} href={action.href} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "16px 10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, textDecoration: "none", transition: "all .2s" }}>
                <span style={{ fontSize: 24 }}>{action.icon}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{action.label}</span>
              </Link>
            )
          ))}
        </div>
      </div>

      {/* Upgrade CTA for free plan */}
      {plan === "free" && (
        <div onClick={() => setUpgradeFor("messages")} style={{ cursor: "pointer", background: "linear-gradient(135deg,rgba(34,197,94,0.08),rgba(34,197,94,0.03))", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 16, padding: "22px 24px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#fff", marginBottom: 6, fontFamily: "'Bricolage Grotesque',sans-serif" }}>
              Upgrade to Starter — ₹299/mo
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
              3,000 messages · 500 contacts · Broadcasts · Birthday automation
            </p>
          </div>
          <div style={{ flexShrink: 0 }}>
            <div style={{ padding: "10px 20px", background: "linear-gradient(135deg,#22C55E,#16A34A)", borderRadius: 10, fontSize: 13, fontWeight: 700, color: "#fff", boxShadow: "0 4px 14px rgba(34,197,94,0.3)" }}>
              Upgrade →
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
