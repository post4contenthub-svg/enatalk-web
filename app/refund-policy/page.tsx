import React from "react";

export default function RefundPolicyPage() {
  return (
    <PageShell title="Refund Policy" updated="27 April 2026">

      <Section title="1. Overview">
        <P>EnaTalk aims to be fully transparent about billing and refunds. This policy explains under what circumstances you are eligible for a refund and how to request one.</P>
      </Section>

      <Section title="2. Free Trial">
        <P>All new accounts receive a 14-day free trial with 500 free message credits. No credit card is required during the trial period. You will not be charged anything during your trial.</P>
      </Section>

      <Section title="3. Subscription Fees">
        <SubHead>3.1 Monthly Plans</SubHead>
        <P>Monthly subscription fees are non-refundable once the billing cycle has begun. You may cancel at any time and your access will continue until the end of the paid period.</P>
        <SubHead>3.2 Annual Plans</SubHead>
        <P>If you subscribed to an annual plan and wish to cancel within 7 days of payment, you are eligible for a pro-rated refund for unused months. After 7 days, annual plan fees are non-refundable.</P>
        <SubHead>3.3 Plan Downgrades</SubHead>
        <P>If you downgrade mid-cycle, no partial refund is issued for the current period. The downgrade takes effect at the start of the next billing cycle.</P>
      </Section>

      <Section title="4. WhatsApp Message Credits">
        <P>WhatsApp message charges (passed through from Meta's API pricing) are non-refundable once messages have been sent. This includes marketing, utility, authentication, and service conversation fees.</P>
        <P>Unused prepaid message credits may be refunded upon account closure — contact support@enatalk.com within 30 days of closure.</P>
      </Section>

      <Section title="5. Exceptional Circumstances">
        <P>We may issue full or partial refunds at our discretion in the following exceptional cases:</P>
        <BulletList items={["A significant technical failure on EnaTalk's side preventing platform use for 72+ consecutive hours","Duplicate charges due to a billing system error","Charges made after a confirmed account cancellation"]}/>
        <P>Refund requests in exceptional circumstances must be submitted within 30 days of the charge by emailing support@enatalk.com.</P>
      </Section>

      <Section title="6. How to Request a Refund">
        <BulletList items={["Email support@enatalk.com with subject: Refund Request — [Your Account Email]","Include your account email, amount charged, date of charge, and reason","We will review and respond within 5 business days","Approved refunds are processed within 7–10 business days to the original payment method"]}/>
      </Section>

      <Section title="7. Contact">
        <ContactBlock email="support@enatalk.com" address="Enatalk, Ramkrishna Upanibesh Jadavpur, Kolkata, West Bengal 700092, India"/>
      </Section>

    </PageShell>
  );
}

// ── Self-contained shared components (copy into each legal page) ──────────

const POLICY_LINKS: [string, string][] = [
  ["Privacy Policy", "/privacy-policy"],
  ["Terms of Service", "/terms"],
  ["Refund Policy", "/refund-policy"],
  ["Acceptable Use", "/acceptable-use"],
];

function PageShell({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#040B1C", color: "#fff", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bricolage+Grotesque:wght@700;800&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#040B1C;}
        ::selection{background:rgba(34,197,94,0.3);}
        .leg-a{color:rgba(255,255,255,0.38)!important;font-size:13px;font-weight:500;line-height:2.2;display:block;text-decoration:none;}
        .leg-a:hover{color:#22C55E!important;}
        .pill-a{font-size:12px;font-weight:600;padding:6px 14px;border-radius:100px;text-decoration:none;transition:opacity .15s;}
        .pill-a:hover{opacity:0.8;}
        @media(max-width:640px){.pol-nav{display:none!important;}.footer-cols{flex-direction:column!important;gap:28px!important;}}
      `}</style>

      <div style={{ background: "rgba(34,197,94,0.07)", borderBottom: "1px solid rgba(34,197,94,0.15)", padding: "9px 28px", textAlign: "center" }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>✦ Official WhatsApp Business Cloud API by Meta &nbsp;·&nbsp; Compliant with WhatsApp Business &amp; Commerce Policies &nbsp;·&nbsp; Made in India 🇮🇳</span>
      </div>

      <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 22, color: "#fff", letterSpacing: "-0.5px", textDecoration: "none" }}>
          Ena<span style={{ color: "#22C55E" }}>Talk</span>
        </a>
        <div className="pol-nav" style={{ display: "flex", gap: 8 }}>
          {POLICY_LINKS.map(([l, h]) => (
            <a key={l} href={h} className="pill-a" style={{
              background: l === title ? "linear-gradient(135deg,#22C55E,#16A34A)" : "rgba(255,255,255,0.04)",
              color: l === title ? "#fff" : "rgba(255,255,255,0.42)",
              border: l === title ? "none" : "1px solid rgba(255,255,255,0.08)",
            }}>{l}</a>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "56px 28px 100px" }}>
        <a href="/" style={{ fontSize: 13, color: "rgba(255,255,255,0.32)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 40, fontWeight: 500, textDecoration: "none" }}>← Back to EnaTalk</a>
        <div style={{ borderLeft: "3px solid #22C55E", paddingLeft: 20, marginBottom: 44 }}>
          <div style={{ fontSize: 11, color: "#22C55E", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Legal Document</div>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: "clamp(28px,4.5vw,44px)", letterSpacing: "-1.2px", lineHeight: 1.1, color: "#fff", marginBottom: 10 }}>{title}</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.32)" }}>Last updated: <strong style={{ color: "rgba(255,255,255,0.52)" }}>{updated}</strong> &nbsp;·&nbsp; Enatalk, Kolkata, West Bengal, India &nbsp;·&nbsp; Governing law: India</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>{children}</div>
      </div>

      <footer style={{ background: "#020810", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "32px 28px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div className="footer-cols" style={{ display: "flex", gap: 48, marginBottom: 24 }}>
            <div>
              <a href="/" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", letterSpacing: "-0.5px", display: "block", marginBottom: 6, textDecoration: "none" }}>Ena<span style={{ color: "#22C55E" }}>Talk</span></a>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", lineHeight: 1.7 }}>Official WhatsApp Business API<br/>Made in India 🇮🇳</p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Legal</p>
              {POLICY_LINKS.map(([l, h]) => <a key={l} href={h} className="leg-a">{l}</a>)}
            </div>
            <div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Contact</p>
              {[["support@enatalk.com","mailto:support@enatalk.com"],["support@enatalk.com","mailto:support@enatalk.com"],["support@enatalk.com","mailto:support@enatalk.com"],["support@enatalk.com","mailto:support@enatalk.com"]].map(([l,h])=>(
                <a key={l} href={h} className="leg-a">{l}</a>
              ))}
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ paddingBottom: 32, marginBottom: 32, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 18, color: "#fff", marginBottom: 14 }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </div>
  );
}

function SubHead({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: 14, fontWeight: 700, color: "#22C55E", marginTop: 8, marginBottom: 4 }}>{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 14, color: "rgba(255,255,255,0.56)", lineHeight: 1.85 }}>{children}</p>;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: 14, color: "rgba(255,255,255,0.54)", lineHeight: 1.75, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ color: "#22C55E", fontSize: 11, marginTop: 5, flexShrink: 0 }}>&#9658;</span><span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function HighlightBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.22)", borderLeft: "3px solid #22C55E", borderRadius: 12, padding: "14px 18px", fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.8 }}>
      {children}
    </div>
  );
}

function ContactBlock({ email, address }: { email: string; address: string }) {
  return (
    <div style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.16)", borderRadius: 14, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>📧 Email: <a href={`mailto:${email}`} style={{ color: "#22C55E", fontWeight: 600, textDecoration: "none" }}>{email}</a></div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>📍 Address: {address}</div>
    </div>
  );
}
