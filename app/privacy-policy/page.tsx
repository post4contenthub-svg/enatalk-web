import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <PageShell title="Privacy Policy" updated="27 April 2026">

      <Section title="1. Who We Are">
        <P>EnaTalk is a WhatsApp Business messaging automation platform operated by Enatalk, registered at Ramkrishna Upanibesh Jadavpur, Kolkata, West Bengal 700092, India. Our platform is accessible at app.enatalk.com.</P>
        <P>This Privacy Policy explains what personal data we collect, how we use it, who we share it with, and what rights you have.</P>
      </Section>

      <Section title="2. Data We Collect">
        <SubHead>2.1 Account & Business Data</SubHead>
        <BulletList items={["Full name and email address","Business name, type, and address","Phone number registered with WhatsApp Business API","Password (hashed — never stored in plain text)"]}/>
        <SubHead>2.2 Contact & Messaging Data</SubHead>
        <BulletList items={["Customer contact lists you upload or import","Message content and delivery status from campaigns you run","Opt-in / opt-out records for your contacts","Conversation history via WhatsApp Business Cloud API"]}/>
        <SubHead>2.3 Usage & Technical Data</SubHead>
        <BulletList items={["Log data: IP address, browser type, pages visited, timestamps","Campaign performance metrics (sent, delivered, read, replied)","Device and operating system information","Cookies and session tokens for authentication"]}/>
        <SubHead>2.4 Payment Data</SubHead>
        <P>Payment details are processed exclusively by our third-party payment provider (Razorpay / Stripe). We do not store full card numbers or bank details on our servers.</P>
      </Section>

      <Section title="3. How We Use Your Data">
        <BulletList items={["To create and manage your EnaTalk account","To enable WhatsApp campaign creation, scheduling, and delivery","To send you transactional emails (OTP, billing receipts, platform alerts)","To improve platform features and develop new functionality","To generate anonymised, aggregated analytics about platform usage","To comply with applicable Indian laws and Meta/WhatsApp platform requirements","To detect and prevent fraud, abuse, or policy violations"]}/>
      </Section>

      <Section title="4. WhatsApp & Meta Data Handling">
        <P>EnaTalk is built on the WhatsApp Business Cloud API provided by Meta Platforms, Inc. By using EnaTalk, you agree to Meta's WhatsApp Business Terms of Service, WhatsApp Business Policy, and WhatsApp Commerce Policy.</P>
        <P>You are solely responsible for obtaining valid, documented opt-in consent from every contact before sending them messages through our platform. EnaTalk cannot verify the legitimacy of consent on your behalf.</P>
      </Section>

      <Section title="5. Data Sharing & Third Parties">
        <P>We do not sell, rent, or trade your personal data or your customers' contact data to any third party for marketing purposes — ever.</P>
        <P>We may share limited data with cloud infrastructure providers, payment processors, email delivery services, and analytics tools — strictly to operate the platform. All are bound by confidentiality agreements prohibiting any other use.</P>
        <P>We may disclose data when required by Indian law, court order, or government authority.</P>
      </Section>

      <Section title="6. Data Retention">
        <BulletList items={["Account data: retained while active and for 90 days after deletion","Message & campaign data: retained for 12 months by default","Contact lists: deleted within 30 days of account closure on request","Payment records: retained for 7 years as required by Indian GST law","Log data: retained for 90 days for security and debugging"]}/>
      </Section>

      <Section title="7. Cookies">
        <P>We use essential cookies only — to keep you logged in and secure your session. We do not use advertising or tracking cookies. You can disable cookies in your browser, but this may affect platform functionality.</P>
      </Section>

      <Section title="8. Data Security">
        <BulletList items={["All data in transit is encrypted using TLS 1.2 or higher","Passwords are hashed using bcrypt — never stored in plain text","Access to production systems is restricted to authorised personnel only","Regular security reviews and vulnerability assessments are conducted"]}/>
        <P>In the event of a data breach affecting your personal information, we will notify you within 72 hours of discovery.</P>
      </Section>

      <Section title="9. Your Rights">
        <BulletList items={["Access: request a copy of all personal data we hold about you","Correction: request correction of inaccurate or incomplete data","Deletion: request deletion of your account and associated data","Portability: request your data in a structured, machine-readable format","Withdrawal: withdraw consent at any time"]}/>
        <P>To exercise any of these rights, email support@enatalk.com. We will respond within 30 days.</P>
      </Section>

      <Section title="10. Children's Privacy">
        <P>EnaTalk is not intended for use by anyone under 18 years of age. We do not knowingly collect personal data from minors. If you believe a minor has created an account, contact us immediately at support@enatalk.com.</P>
      </Section>

      <Section title="11. Changes to This Policy">
        <P>We may update this Privacy Policy from time to time. When we make material changes, we will notify you by email and update the date at the top of this page. Continued use of EnaTalk after changes constitutes acceptance.</P>
      </Section>

      <Section title="12. Contact Us">
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
