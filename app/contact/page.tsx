"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    // Wire this to your own email API / Resend / Nodemailer
    await new Promise(r => setTimeout(r, 1200));
    setStatus("sent");
  }

  const POLICY_LINKS: [string, string][] = [
    ["Privacy Policy", "/privacy-policy"],
    ["Terms of Service", "/terms"],
    ["Refund Policy", "/refund-policy"],
    ["Acceptable Use", "/acceptable-use"],
    ["Contact", "/contact"],
  ];

  const contactTopics = [
    { icon: "🛠️", label: "Platform Support", desc: "Help with campaigns, templates, contacts" },
    { icon: "💳", label: "Billing & Refunds", desc: "Invoices, payments, subscription changes" },
    { icon: "🔒", label: "Privacy & Data", desc: "Data requests, account deletion, GDPR" },
    { icon: "⚖️", label: "Legal & Compliance", desc: "Legal notices, WhatsApp policy questions" },
    { icon: "🤝", label: "Partnerships", desc: "Integrations, reseller & API partnerships" },
    { icon: "🚨", label: "Report Abuse", desc: "Report spam or policy violations" },
  ];

  const inp: React.CSSProperties = {
    width: "100%", padding: "13px 16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 12, color: "#fff", fontSize: 14,
    fontFamily: "'DM Sans', sans-serif", outline: "none",
    transition: "border-color .2s, background .2s",
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#040B1C", color: "#fff", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bricolage+Grotesque:wght@700;800&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#040B1C;}
        ::selection{background:rgba(34,197,94,0.3);}
        a{text-decoration:none;}
        .leg-a{color:rgba(255,255,255,0.38)!important;font-size:13px;font-weight:500;line-height:2.2;display:block;}
        .leg-a:hover{color:#22C55E!important;}
        .pill-a{font-size:12px;font-weight:600;padding:6px 14px;border-radius:100px;}
        .pill-a:hover{opacity:0.8;}
        input:focus,select:focus,textarea:focus{outline:none!important;border-color:rgba(34,197,94,0.5)!important;background:rgba(255,255,255,0.07)!important;}
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.25);}
        .contact-card{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:20px;transition:border-color .25s,transform .25s;}
        .contact-card:hover{border-color:rgba(34,197,94,0.25);transform:translateY(-2px);}
        .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .main-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start;}
        @media(max-width:768px){
          .main-grid{grid-template-columns:1fr!important;}
          .grid-2{grid-template-columns:1fr!important;}
          .pol-nav{display:none!important;}
          .footer-cols{flex-direction:column!important;gap:28px!important;}
        }
      `}</style>

      {/* Trust bar */}
      <div style={{ background: "rgba(34,197,94,0.07)", borderBottom: "1px solid rgba(34,197,94,0.15)", padding: "9px 28px", textAlign: "center" }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
          ✦ Official WhatsApp Business Cloud API by Meta &nbsp;·&nbsp; Compliant with WhatsApp Business &amp; Commerce Policies &nbsp;·&nbsp; Made in India 🇮🇳
        </span>
      </div>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 22, color: "#fff", letterSpacing: "-0.5px" }}>
          Ena<span style={{ color: "#22C55E" }}>Talk</span>
        </a>
        <div className="pol-nav" style={{ display: "flex", gap: 8 }}>
          {POLICY_LINKS.map(([l, h]) => (
            <a key={l} href={h} className="pill-a" style={{
              background: l === "Contact" ? "linear-gradient(135deg,#22C55E,#16A34A)" : "rgba(255,255,255,0.04)",
              color: l === "Contact" ? "#fff" : "rgba(255,255,255,0.42)",
              border: l === "Contact" ? "none" : "1px solid rgba(255,255,255,0.08)",
            }}>{l}</a>
          ))}
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "56px 28px 100px" }}>
        <a href="/" style={{ fontSize: 13, color: "rgba(255,255,255,0.32)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 40, fontWeight: 500 }}>← Back to EnaTalk</a>

        {/* Header */}
        <div style={{ borderLeft: "3px solid #22C55E", paddingLeft: 20, marginBottom: 52 }}>
          <div style={{ fontSize: 11, color: "#22C55E", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Get in touch</div>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: "clamp(28px,4.5vw,44px)", letterSpacing: "-1.2px", lineHeight: 1.1, color: "#fff", marginBottom: 10 }}>Contact Us</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
            We typically respond within <strong style={{ color: "#fff" }}>24 hours</strong> on business days (Mon–Sat, 10am–6pm IST).
          </p>
        </div>

        <div className="main-grid">

          {/* LEFT — Email contacts + address */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Business info card */}
            <div style={{ background: "linear-gradient(135deg,rgba(34,197,94,0.08),rgba(34,197,94,0.03))", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 20, padding: "24px 26px" }}>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 16 }}>Enatalk</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>📍</span>
                  <div>
                    <div style={{ fontSize: 11, color: "#22C55E", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Address</div>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>Ramkrishna Upanibesh Jadavpur<br/>Kolkata, West Bengal 700092<br/>India</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>🕐</span>
                  <div>
                    <div style={{ fontSize: 11, color: "#22C55E", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Business Hours</div>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>Monday – Saturday<br/>10:00 AM – 6:00 PM IST</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⚡</span>
                  <div>
                    <div style={{ fontSize: 11, color: "#22C55E", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Response Time</div>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>Within 24 hours on business days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email contacts grid */}
            <div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Contact by topic</p>
              {/* Single email highlight */}
              <div style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, marginBottom: 4 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>📧</span>
                <div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>One email for everything</div>
                  <a href="mailto:support@enatalk.com" style={{ fontSize: 16, color: "#22C55E", fontWeight: 700 }}>support@enatalk.com</a>
                </div>
              </div>
              {/* Topic chips */}
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>We handle all topics</p>
              <div className="grid-2">
                {contactTopics.map((c) => (
                  <div key={c.label} className="contact-card">
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{c.icon}</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{c.label}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{c.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp contact */}
            <div style={{ background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.18)", borderRadius: 16, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>💬</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 4 }}>Chat with us on WhatsApp</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>For quick questions — fastest response</div>
                <a href="https://wa.me/919062211526" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#25D366", fontWeight: 600 }}>+91 90622 11526</a>
              </div>
            </div>

          </div>

          {/* RIGHT — Contact form */}
          <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "32px 28px" }}>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 18, color: "#fff", marginBottom: 6 }}>Send us a message</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>Fill the form and we'll get back to you within 24 hours.</p>

            {status === "sent" ? (
              <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 14, padding: "28px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
                <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 18, color: "#fff", marginBottom: 8 }}>Message sent!</div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>We've received your message and will reply to <strong style={{ color: "#fff" }}>{form.email}</strong> within 24 hours.</p>
                <button onClick={() => { setStatus("idle"); setForm({ name: "", email: "", subject: "", message: "" }); }} style={{ marginTop: 20, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "10px 20px", borderRadius: 10, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600, display: "block", marginBottom: 6 }}>Your Name *</label>
                    <input type="text" placeholder="Ravi Patel" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inp} disabled={status === "sending"}/>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600, display: "block", marginBottom: 6 }}>Email Address *</label>
                    <input type="email" placeholder="ravi@business.com" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inp} disabled={status === "sending"}/>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600, display: "block", marginBottom: 6 }}>Subject *</label>
                  <select required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} style={{ ...inp, color: form.subject ? "#fff" : "rgba(255,255,255,0.25)" }} disabled={status === "sending"}>
                    <option value="" disabled>Select a topic</option>
                    <option value="general">General enquiry</option>
                    <option value="support">Platform / technical support</option>
                    <option value="billing">Billing or refund</option>
                    <option value="privacy">Privacy or data request</option>
                    <option value="legal">Legal notice</option>
                    <option value="partnership">Partnership or integration</option>
                    <option value="abuse">Report abuse or spam</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600, display: "block", marginBottom: 6 }}>Message *</label>
                  <textarea placeholder="Describe your question or issue in detail..." required rows={6} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} style={{ ...inp, resize: "vertical", minHeight: 130, lineHeight: 1.7 }} disabled={status === "sending"}/>
                </div>
                <button type="submit" disabled={status === "sending"} style={{ width: "100%", padding: "14px", background: status === "sending" ? "rgba(34,197,94,0.5)" : "linear-gradient(135deg,#22C55E,#16A34A)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: status === "sending" ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 6px 20px rgba(34,197,94,0.35)", transition: "opacity .2s" }}>
                  {status === "sending" ? "Sending…" : "Send Message →"}
                </button>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center", lineHeight: 1.6 }}>
                  By submitting this form you agree to our <a href="/privacy-policy" style={{ color: "rgba(255,255,255,0.4)" }}>Privacy Policy</a>. We will only use your details to respond to your enquiry.
                </p>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: "#020810", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "32px 28px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div className="footer-cols" style={{ display: "flex", gap: 48, marginBottom: 24 }}>
            <div>
              <a href="/" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", letterSpacing: "-0.5px", display: "block", marginBottom: 6 }}>Ena<span style={{ color: "#22C55E" }}>Talk</span></a>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", lineHeight: 1.7 }}>Official WhatsApp Business API<br/>Made in India 🇮🇳</p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Legal</p>
              {POLICY_LINKS.filter(([l]) => l !== "Contact").map(([l, h]) => (
                <a key={l} href={h} className="leg-a">{l}</a>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Contact</p>
              <a href="mailto:support@enatalk.com" className="leg-a">support@enatalk.com</a>
              <a href="/contact" className="leg-a">Contact Page</a>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 18, textAlign: "center" }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.18)" }}>© {new Date().getFullYear()} EnaTalk. All rights reserved. WhatsApp is a trademark of WhatsApp LLC. EnaTalk is not affiliated with Meta Platforms, Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
