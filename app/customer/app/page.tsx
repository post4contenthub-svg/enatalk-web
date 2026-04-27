"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useWhatsappStatus } from "./hooks/useWhatsappStatus";

export default function CustomerDashboard() {
  const supabase = createClient();
  const router = useRouter();
  const waConnected = useWhatsappStatus();

  const [userName, setUserName] = useState("there");
  const [stats, setStats] = useState({ contacts: 0, campaigns: 0, sent: 0 });
  const [recentCampaigns, setRecentCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const G = "#22C55E";
  const GOLD = "#F5B800";
  const BORDER = "rgba(255,255,255,0.08)";
  const MUTED = "rgba(255,255,255,0.5)";
  const CARD = "rgba(255,255,255,0.03)";

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      // ✅ No redirect — just skip loading user data if not logged in
      if (user) {
        setUserName(
          user.user_metadata?.full_name?.split(" ")[0] ||
          user.email?.split("@")[0] ||
          "there"
        );

        const [
          { count: contactCount },
          { data: campaigns },
        ] = await Promise.all([
          supabase
            .from("contacts")
            .select("*", { count: "exact", head: true })
            .eq("tenant_id", user.id),
          supabase
            .from("campaigns")
            .select("id, name, status, sent_count, total_recipients, created_at")
            .eq("tenant_id", user.id)
            .order("created_at", { ascending: false })
            .limit(4),
        ]);

        const totalSent = (campaigns || []).reduce(
          (s: number, c: any) => s + (c.sent_count || 0), 0
        );

        setStats({
          contacts: contactCount || 0,
          campaigns: campaigns?.length || 0,
          sent: totalSent,
        });
        setRecentCampaigns(campaigns || []);
      }

      setLoading(false);
    };

    load();
  }, []);

  const setupSteps = [
    {
      id: 1, done: true,
      title: "Account created",
      desc: "You're signed in and ready.",
      action: null, cta: null,
    },
    {
      id: 2, done: waConnected === true,
      title: "Connect your WhatsApp",
      desc: waConnected
        ? "WhatsApp is connected ✓"
        : "Link your business number — takes 2 minutes on your phone.",
      action: "/customer/app/connect-whatsapp",
      cta: "Connect now →",
      highlight: true,
    },
    {
      id: 3, done: stats.contacts > 0,
      title: "Add your first contacts",
      desc: stats.contacts > 0
        ? `${stats.contacts} contact${stats.contacts > 1 ? "s" : ""} added ✓`
        : "Add customers manually or upload a CSV file.",
      action: "/customer/app/contacts",
      cta: "Add contacts →",
    },
    {
      id: 4, done: stats.campaigns > 0,
      title: "Send your first campaign",
      desc: stats.campaigns > 0
        ? `${stats.campaigns} campaign${stats.campaigns > 1 ? "s" : ""} created ✓`
        : "Pick a template and send to your contacts.",
      action: "/customer/app/campaigns",
      cta: "Create campaign →",
    },
  ];

  const completedSteps = setupSteps.filter(s => s.done).length;
  const setupDone = completedSteps === setupSteps.length;
  const progressPct = (completedSteps / setupSteps.length) * 100;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const quickActions = [
    { icon: "🚀", label: "New Campaign", sub: "Send to contacts",   path: "/customer/app/campaigns", color: G,        disabled: !waConnected },
    { icon: "📋", label: "Templates",    sub: "Ready messages",     path: "/customer/app/templates", color: "#3B8BEB", disabled: !waConnected },
    { icon: "👥", label: "Contacts",     sub: "Manage your list",   path: "/customer/app/contacts",  color: GOLD,      disabled: false },
    { icon: "⚙️", label: "Settings",    sub: "Your account",       path: "/customer/app/settings",  color: "#A78BFA", disabled: false },
  ];

  if (loading || waConnected === null) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: `3px solid ${G}`, borderTopColor: "transparent", animation: "spin .8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: MUTED, fontSize: 14, fontFamily: "sans-serif" }}>Loading your dashboard…</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bricolage+Grotesque:wght@700;800&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .fu{animation:fadeUp .5s ease both;}
        .fu1{animation-delay:.04s;}.fu2{animation-delay:.10s;}.fu3{animation-delay:.16s;}.fu4{animation-delay:.22s;}.fu5{animation-delay:.28s;}
        .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; }
        .qa { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 16px 14px; cursor: pointer; transition: all .2s; display: flex; flex-direction: column; gap: 6px; }
        .qa:hover:not(.qa-off) { transform: translateY(-3px); background: rgba(255,255,255,0.06); }
        .qa-off { opacity: 0.4; cursor: not-allowed; }
        .stat { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 18px 16px; }
        .step-row { display: flex; align-items: flex-start; gap: 14px; padding: 15px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .step-row:last-child { border-bottom: none; padding-bottom: 4px; }
        .camp-row { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px; cursor: pointer; transition: background .2s; }
        .camp-row:hover { background: rgba(255,255,255,0.04); }
        .qa-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        @media(max-width: 600px) {
          .qa-grid { grid-template-columns: repeat(2, 1fr); }
          .stat-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      {/* ── GREETING ── */}
      <div className="fu fu1" style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(22px,5vw,30px)", fontWeight: 800, color: "#fff", fontFamily: "'Bricolage Grotesque',sans-serif", letterSpacing: "-0.8px", marginBottom: 6 }}>
          {greeting}, {userName} 👋
        </h1>
        <p style={{ fontSize: 14, color: MUTED }}>
          {setupDone
            ? "All set! Your WhatsApp campaigns are ready to go."
            : `${completedSteps} of ${setupSteps.length} setup steps done — let's finish up.`}
        </p>
      </div>

      {/* ── SETUP CHECKLIST ── */}
      {!setupDone && (
        <div className="fu fu2 card" style={{ padding: "22px 20px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>🎯 Get started — {completedSteps}/{setupSteps.length} done</span>
            <span style={{ fontSize: 13, color: G, fontWeight: 700 }}>{Math.round(progressPct)}%</span>
          </div>
          {/* Progress bar */}
          <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 100, marginBottom: 20, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progressPct}%`, background: `linear-gradient(90deg,${G},#34D399)`, borderRadius: 100, transition: "width .6s ease" }} />
          </div>
          {/* Steps */}
          {setupSteps.map(step => (
            <div key={step.id} className="step-row">
              <div style={{
                width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                background: step.done ? "rgba(34,197,94,0.15)" : step.highlight ? "rgba(245,184,0,0.12)" : "rgba(255,255,255,0.05)",
                border: `1.5px solid ${step.done ? "rgba(34,197,94,0.4)" : step.highlight ? "rgba(245,184,0,0.35)" : "rgba(255,255,255,0.1)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 800,
                color: step.done ? G : step.highlight ? GOLD : MUTED,
              }}>
                {step.done ? "✓" : step.id}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: step.done ? "rgba(255,255,255,0.4)" : "#fff", textDecoration: step.done ? "line-through" : "none", marginBottom: 4 }}>
                  {step.title}
                </div>
                <div style={{ fontSize: 13, color: step.done ? "rgba(255,255,255,0.3)" : MUTED, lineHeight: 1.55 }}>
                  {step.desc}
                </div>
                {!step.done && step.action && (
                  <button onClick={() => router.push(step.action!)} style={{
                    marginTop: 10, padding: "8px 16px",
                    background: step.highlight ? `linear-gradient(135deg,${G},#16A34A)` : "rgba(255,255,255,0.07)",
                    color: "#fff", border: "none", borderRadius: 10,
                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                    boxShadow: step.highlight ? "0 4px 14px rgba(34,197,94,0.3)" : "none",
                  }}>
                    {step.cta}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── QUICK ACTIONS ── */}
      <div className="fu fu3" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>Quick actions</p>
        <div className="qa-grid">
          {quickActions.map(qa => (
            <div key={qa.label} className={`qa ${qa.disabled ? "qa-off" : ""}`}
              onClick={() => !qa.disabled && router.push(qa.path)}>
              <div style={{ width: 42, height: 42, borderRadius: 13, background: `${qa.color}18`, border: `1px solid ${qa.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                {qa.icon}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginTop: 6 }}>{qa.label}</div>
              <div style={{ fontSize: 11, color: MUTED }}>{qa.sub}</div>
              {qa.disabled && <div style={{ fontSize: 10, color: GOLD, fontWeight: 600, marginTop: 2 }}>🔒 Connect WhatsApp first</div>}
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      {waConnected && (
        <div className="fu fu4" style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>Your numbers</p>
          <div className="stat-grid">
            {[
              { label: "Total Contacts", value: stats.contacts, icon: "👥", color: "#3B8BEB" },
              { label: "Campaigns",      value: stats.campaigns, icon: "🚀", color: G },
              { label: "Messages Sent",  value: stats.sent,      icon: "📤", color: GOLD },
            ].map(s => (
              <div key={s.label} className="stat">
                <div style={{ fontSize: 22, marginBottom: 10 }}>{s.icon}</div>
                <div style={{ fontSize: "clamp(24px,4vw,32px)", fontWeight: 800, color: s.color, fontFamily: "'Bricolage Grotesque',sans-serif", letterSpacing: "-1px", lineHeight: 1, marginBottom: 6 }}>
                  {s.value.toLocaleString("en-IN")}
                </div>
                <div style={{ fontSize: 12, color: MUTED }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── RECENT CAMPAIGNS ── */}
      {recentCampaigns.length > 0 && (
        <div className="fu fu5" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".08em" }}>Recent campaigns</p>
            <button onClick={() => router.push("/customer/app/campaigns")}
              style={{ fontSize: 13, color: G, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
              View all →
            </button>
          </div>
          <div className="card" style={{ padding: "4px 0" }}>
            {recentCampaigns.map(c => (
              <div key={c.id} className="camp-row" onClick={() => router.push(`/customer/app/campaigns/${c.id}`)}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(34,197,94,0.1)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🚀</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{c.total_recipients ?? 0} recipients · {c.sent_count ?? 0} sent</div>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 100, flexShrink: 0,
                  background: c.status === "completed" ? "rgba(34,197,94,0.15)" : c.status === "draft" ? "rgba(245,184,0,0.15)" : "rgba(255,255,255,0.07)",
                  color: c.status === "completed" ? G : c.status === "draft" ? GOLD : MUTED,
                }}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {!waConnected && (
        <div className="fu fu5" style={{ textAlign: "center", padding: "40px 24px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>📱</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "'Bricolage Grotesque',sans-serif", marginBottom: 10 }}>
            Connect WhatsApp to unlock everything
          </h3>
          <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.75, maxWidth: 340, margin: "0 auto 24px" }}>
            Once connected, you can send campaigns, birthday wishes, and festival offers to all your customers — from your phone.
          </p>
          <button onClick={() => router.push("/customer/app/connect-whatsapp")}
            style={{ background: `linear-gradient(135deg,${G},#16A34A)`, color: "#fff", border: "none", borderRadius: 14, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 6px 20px rgba(34,197,94,0.35)" }}>
            Connect WhatsApp — 2 minutes →
          </button>
        </div>
      )}
    </div>
  );
}
