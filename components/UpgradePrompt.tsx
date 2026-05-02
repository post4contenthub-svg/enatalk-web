// components/UpgradePrompt.tsx — Reusable upgrade modal
"use client";
import { useState } from "react";

type Props = {
  trigger: "messages" | "contacts" | "broadcast" | "api" | "analytics" | "team";
  currentPlan?: string;
  used?: number;
  limit?: number;
  onClose?: () => void;
};

const triggerConfig = {
  messages: {
    icon: "💬",
    title: "You've reached your message limit",
    desc: "Upgrade to keep sending campaigns to your customers.",
    feature: "messages",
  },
  contacts: {
    icon: "👥",
    title: "Contact limit reached",
    desc: "Upgrade to add more contacts and grow your customer list.",
    feature: "contacts",
  },
  broadcast: {
    icon: "📣",
    title: "Broadcasts need Starter plan",
    desc: "Send campaigns to all your contacts at once. Upgrade to unlock.",
    feature: "broadcast campaigns",
  },
  api: {
    icon: "⚡",
    title: "API access needs Growth plan",
    desc: "Integrate EnaTalk with your own systems via REST API.",
    feature: "API access",
  },
  analytics: {
    icon: "📊",
    title: "Analytics needs Starter plan",
    desc: "See open rates, delivery stats and campaign performance.",
    feature: "analytics",
  },
  team: {
    icon: "👥",
    title: "Add more team members",
    desc: "Upgrade to collaborate with your team on EnaTalk.",
    feature: "team members",
  },
};

const plans = [
  {
    id: "starter", name: "Starter", price: 299, annualPrice: 239,
    color: "#22C55E",
    highlights: ["3,000 messages/month", "500 contacts", "5 broadcasts/month", "Birthday automation", "Basic analytics"],
    cta: "Upgrade to Starter",
  },
  {
    id: "growth", name: "Growth", price: 799, annualPrice: 639,
    color: "#3B8BEB",
    popular: true,
    highlights: ["10,000 messages/month", "5,000 contacts", "Unlimited broadcasts", "REST API access", "Full analytics + reports"],
    cta: "Upgrade to Growth",
  },
  {
    id: "pro", name: "Pro", price: 1499, annualPrice: 1199,
    color: "#A78BFA",
    highlights: ["Unlimited messages", "Unlimited contacts", "5 WA numbers", "Dedicated account manager", "Priority support"],
    cta: "Upgrade to Pro",
  },
];

export default function UpgradePrompt({ trigger, currentPlan = "free", used, limit, onClose }: Props) {
  const [annual, setAnnual] = useState(false);
  const config = triggerConfig[trigger];

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(2,8,16,0.88)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'DM Sans',sans-serif" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 740, background: "linear-gradient(160deg,rgba(15,25,55,0.98),rgba(10,20,40,0.99))", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 24, padding: "36px", boxShadow: "0 40px 100px rgba(0,0,0,0.7)", position: "relative" }}>

        {/* Close */}
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif" }}>×</button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>{config.icon}</div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: "-0.5px", color: "#fff", marginBottom: 8 }}>{config.title}</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{config.desc}</p>

          {/* Usage bar */}
          {used !== undefined && limit && (
            <div style={{ marginTop: 16, maxWidth: 320, margin: "16px auto 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>
                <span>{used.toLocaleString()} used</span>
                <span>{limit.toLocaleString()} limit</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 100, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(100, (used/limit)*100)}%`, background: "linear-gradient(135deg,#f87171,#ef4444)", borderRadius: 100 }}/>
              </div>
            </div>
          )}
        </div>

        {/* Toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 100, padding: "5px 16px" }}>
            <button onClick={() => setAnnual(false)} style={{ fontSize: 13, fontWeight: 700, padding: "5px 14px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", background: !annual ? "#fff" : "transparent", color: !annual ? "#040B1C" : "rgba(255,255,255,0.45)" }}>Monthly</button>
            <button onClick={() => setAnnual(true)} style={{ fontSize: 13, fontWeight: 700, padding: "5px 14px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", background: annual ? "linear-gradient(135deg,#22C55E,#16A34A)" : "transparent", color: annual ? "#fff" : "rgba(255,255,255,0.45)" }}>
              Annual <span style={{ fontSize: 11, background: "rgba(255,255,255,0.15)", padding: "1px 6px", borderRadius: 100, marginLeft: 4 }}>Save 20%</span>
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
          {plans.map(plan => (
            <div key={plan.id} style={{ background: plan.popular ? "linear-gradient(160deg,rgba(59,139,235,0.1),rgba(59,139,235,0.04))" : "rgba(255,255,255,0.025)", border: `1px solid ${plan.popular ? "rgba(59,139,235,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 16, padding: "20px 16px", position: "relative", transform: plan.popular ? "translateY(-4px)" : "none" }}>
              {plan.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#3B8BEB,#1D4ED8)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "4px 12px", borderRadius: 100, whiteSpace: "nowrap", letterSpacing: "0.06em" }}>✦ POPULAR</div>}

              <div style={{ fontSize: 11, fontWeight: 700, color: plan.color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{plan.name}</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 2, marginBottom: 4 }}>
                <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 30, color: "#fff", letterSpacing: "-1px", lineHeight: 1 }}>₹{(annual ? plan.annualPrice : plan.price).toLocaleString("en-IN")}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>/mo</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>{annual ? "billed annually" : "billed monthly"}</div>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", display: "flex", flexDirection: "column", gap: 6 }}>
                {plan.highlights.map((h, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                    <span style={{ color: plan.color, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                    {h}
                  </li>
                ))}
              </ul>

              <button style={{ width: "100%", padding: "10px", background: plan.popular ? `linear-gradient(135deg,${plan.color},#1D4ED8)` : `rgba(${plan.color === "#22C55E" ? "34,197,94" : "167,139,250"},0.12)`, border: plan.popular ? "none" : `1px solid ${plan.color}44`, color: plan.popular ? "#fff" : plan.color, borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: plan.popular ? `0 4px 14px ${plan.color}40` : "none" }}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Meta message cost note */}
        <div style={{ background: "rgba(245,184,0,0.05)", border: "1px solid rgba(245,184,0,0.15)", borderRadius: 12, padding: "12px 16px", display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
            <strong style={{ color: "#F5B800" }}>WhatsApp message costs</strong> (~₹0.58/marketing conversation) are billed separately by Meta at zero markup. Your plan fee covers the platform only.
          </p>
        </div>

      </div>
    </div>
  );
}
