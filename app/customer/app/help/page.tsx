"use client";
import { useState } from "react";
import Link from "next/link";

const HELP_SECTIONS = [
  {
    category: "Getting Started",
    title: "How do I get started?",
    content: ["Create or import your contacts", "Connect a new WhatsApp number", "Select a message template", "Start campaigns or automations"],
  },
  {
    category: "WhatsApp Connection",
    title: "Connecting WhatsApp",
    content: ["EnaTalk uses WhatsApp's official Cloud API", "You do not need WhatsApp or WhatsApp Business app", "Use a new or unused mobile number", "OTP verification will be required", "Campaigns and templates unlock after connection"],
  },
  {
    category: "FAQ",
    title: "Do I need WhatsApp Business App?",
    content: ["No. EnaTalk works without any WhatsApp app."],
  },
  {
    category: "FAQ",
    title: "Can I use my personal WhatsApp number?",
    content: ["Only if the number is not already used on WhatsApp", "We recommend using a new number"],
  },
  {
    category: "FAQ",
    title: "Is this official WhatsApp?",
    content: ["Yes. EnaTalk uses Meta's official WhatsApp Cloud API."],
  },
  {
    category: "FAQ",
    title: "Who pays WhatsApp message charges?",
    content: ["WhatsApp conversation charges (~₹0.58/marketing message) are billed by Meta directly.", "Your EnaTalk plan fee covers only the platform."],
  },
  {
    category: "FAQ",
    title: "Can I change my WhatsApp number later?",
    content: ["Yes. You can disconnect and connect a new number anytime."],
  },
  {
    category: "FAQ",
    title: "How many messages can I send?",
    content: ["Free plan: 500 messages/month", "Starter (₹299): 3,000 messages/month", "Growth (₹799): 10,000 messages/month", "Pro (₹1,499): Unlimited messages"],
  },
];

export default function HelpPage() {
  const [query, setQuery] = useState("");

  const filteredSections = HELP_SECTIONS.filter(s => {
    const q = query.toLowerCase();
    return s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.content.some(l => l.toLowerCase().includes(q));
  });

  const G = "#22C55E";
  const MUTED = "rgba(255,255,255,0.5)";
  const CARD = "rgba(255,255,255,0.03)";
  const BORDER = "rgba(255,255,255,0.08)";

  const videos = [
    { title: "How to connect WhatsApp", icon: "📱" },
    { title: "How to import contacts", icon: "👥" },
    { title: "How to create a campaign", icon: "🚀" },
    { title: "How automations work", icon: "🎂" },
  ];

  return (
    <div style={{ maxWidth: 860, fontFamily: "'DM Sans',sans-serif", color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bricolage+Grotesque:wght@700;800&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;} a{text-decoration:none;color:inherit;}`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: "-0.5px", color: "#fff", marginBottom: 6 }}>
            Help & Support
          </h1>
          <p style={{ fontSize: 14, color: MUTED }}>Everything you need to get started with EnaTalk</p>
        </div>
        <input
          type="text"
          placeholder="Search help articles…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ width: 220, padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 10, color: "#fff", fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none" }}
        />
      </div>

      {/* Support options */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
        {/* WhatsApp support */}
        <a href="https://wa.me/919062211526?text=Hi%20EnaTalk%20Support" target="_blank" style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 16, padding: "18px 20px", textDecoration: "none" }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(34,197,94,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>💬</div>
          <div>
            <div style={{ fontWeight: 700, color: "#fff", fontSize: 14, marginBottom: 4 }}>Chat on WhatsApp</div>
            <div style={{ fontSize: 12, color: MUTED }}>Get a reply within 2 hours</div>
          </div>
        </a>

        {/* Support ticket */}
        <Link href="/customer/app/support" style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(59,139,235,0.06)", border: "1px solid rgba(59,139,235,0.2)", borderRadius: 16, padding: "18px 20px", textDecoration: "none" }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(59,139,235,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🎫</div>
          <div>
            <div style={{ fontWeight: 700, color: "#fff", fontSize: 14, marginBottom: 4 }}>Raise a Support Ticket</div>
            <div style={{ fontSize: 12, color: MUTED }}>Track your issue with our team</div>
          </div>
        </Link>

        {/* Email support */}
        <a href="mailto:support@enatalk.com" style={{ display: "flex", alignItems: "center", gap: 14, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "18px 20px", textDecoration: "none" }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>✉️</div>
          <div>
            <div style={{ fontWeight: 700, color: "#fff", fontSize: 14, marginBottom: 4 }}>Email Support</div>
            <div style={{ fontSize: 12, color: MUTED }}>support@enatalk.com</div>
          </div>
        </a>

        {/* Blog/guides */}
        <a href="https://enatalk.com/blog" target="_blank" style={{ display: "flex", alignItems: "center", gap: 14, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "18px 20px", textDecoration: "none" }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📝</div>
          <div>
            <div style={{ fontWeight: 700, color: "#fff", fontSize: 14, marginBottom: 4 }}>Read our Blog</div>
            <div style={{ fontSize: 12, color: MUTED }}>WhatsApp marketing guides & tips</div>
          </div>
        </a>
      </div>

      {/* Video tutorials */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 14 }}>📹 Video Tutorials</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
          {videos.map(v => (
            <div key={v.title} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ height: 110, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.02)", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 32 }}>{v.icon}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontWeight: 500 }}>▶ Video coming soon</span>
              </div>
              <div style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{v.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 14 }}>❓ Frequently Asked Questions</h2>

        {filteredSections.length === 0 && (
          <div style={{ padding: "24px", textAlign: "center", color: MUTED, fontSize: 14, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14 }}>
            No results found for "{query}" — try a different keyword.
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filteredSections.map((s, i) => (
            <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 20px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: G, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{s.category}</div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{s.title}</h3>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                {s.content.map((line, j) => (
                  <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                    <span style={{ color: G, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>·</span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance note */}
      <div style={{ marginTop: 28, background: "rgba(245,184,0,0.05)", border: "1px solid rgba(245,184,0,0.15)", borderRadius: 12, padding: "14px 18px" }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
          ⚠️ EnaTalk uses WhatsApp's official Cloud API. Sending unsolicited or spam messages may result in account restrictions by Meta. Always get customer consent before sending messages.
        </p>
      </div>
    </div>
  );
}
