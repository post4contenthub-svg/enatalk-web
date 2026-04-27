import React from "react";

export default function TermsPage() {
  return (
    <PageShell title="Terms of Service" updated="27 April 2026">

      <Section title="1. Acceptance of Terms">
        <P>By registering for, accessing, or using the EnaTalk platform, you agree to be legally bound by these Terms of Service. If you are entering into these Terms on behalf of a business, you represent that you have authority to bind that business. If you do not agree, you must not use the Service.</P>
      </Section>

      <Section title="2. Description of Service">
        <P>EnaTalk is a SaaS platform that enables businesses to send, automate, and manage WhatsApp messaging using the official WhatsApp Business Cloud API by Meta Platforms, Inc. Features include:</P>
        <BulletList items={["Broadcast campaign creation and scheduling","Contact list management and segmentation","Pre-approved WhatsApp message template management","Automated birthday, festival, and event messaging","Campaign analytics and reporting","Webhook and REST API access for integrations"]}/>
      </Section>

      <Section title="3. Eligibility">
        <BulletList items={["You must be at least 18 years of age","You must represent a legitimate, registered business or operate as a sole proprietor","You must have the legal right to operate in your jurisdiction","Your business must not operate in a category prohibited by WhatsApp's Commerce Policy"]}/>
      </Section>

      <Section title="4. Account Registration & Security">
        <BulletList items={["You must provide accurate, complete, and up-to-date information during registration","You are responsible for maintaining the confidentiality of your login credentials","You are responsible for all activity that occurs under your account","You must notify us immediately at support@enatalk.com if you suspect unauthorised access","One account per business entity unless a separate written agreement exists"]}/>
      </Section>

      <Section title="5. WhatsApp Business API Compliance">
        <SubHead>5.1 Your Obligations</SubHead>
        <P>By using EnaTalk, you agree to comply at all times with WhatsApp Business Terms of Service, WhatsApp Business Policy, WhatsApp Commerce Policy, Meta Platform Terms, and all applicable Indian laws including the Information Technology Act, 2000.</P>
        <SubHead>5.2 Opt-In Requirement</SubHead>
        <P>You must obtain explicit, documented opt-in consent from every recipient before sending them any WhatsApp message through EnaTalk. Sending messages to contacts who have not opted in constitutes a material breach of these Terms.</P>
        <SubHead>5.3 Template Compliance</SubHead>
        <P>All message templates used for business-initiated conversations must be submitted to and approved by Meta before use. Approval decisions are made solely by Meta.</P>
        <SubHead>5.4 Account Restrictions</SubHead>
        <P>EnaTalk is not liable for restrictions, suspensions, or bans imposed by Meta/WhatsApp on your WhatsApp Business account due to your own policy violations.</P>
      </Section>

      <Section title="6. Acceptable Use">
        <P>You agree NOT to use EnaTalk to:</P>
        <BulletList items={["Send unsolicited messages, spam, or bulk messages to contacts who have not opted in","Sell, promote, or advertise prohibited goods or services (see Section 7)","Harass, threaten, defame, or abuse any person","Impersonate any person, business, or organisation","Distribute malware, phishing links, or fraudulent content","Violate any applicable law, regulation, or third-party rights","Reverse-engineer, decompile, or attempt to extract the source code of our platform","Resell or sublicense access to the platform without written permission"]}/>
      </Section>

      <Section title="7. Prohibited Business Categories">
        <P>The following are strictly prohibited on EnaTalk, in line with WhatsApp's Commerce Policy:</P>
        <BulletList items={["Alcohol and alcoholic beverages","Tobacco, cigarettes, e-cigarettes, and related products","Illegal drugs, controlled substances, or drug paraphernalia","Weapons, firearms, ammunition, and explosives","Adult content or sexually explicit material","Gambling, betting, or online gaming for money","Counterfeit, fake, or unauthorised replica goods","Multi-level marketing (MLM) or pyramid schemes","Unsafe supplements or unapproved pharmaceutical products","Any product or service illegal in India or the recipient's jurisdiction"]}/>
      </Section>

      <Section title="8. Subscription, Billing & Payments">
        <SubHead>8.1 Plans & Fees</SubHead>
        <P>EnaTalk offers free and paid subscription plans, billed monthly or annually. All prices are in INR inclusive of applicable GST unless stated otherwise.</P>
        <SubHead>8.2 WhatsApp Message Costs</SubHead>
        <P>WhatsApp Business API charges per-message fees set by Meta. These costs are passed through to you at zero markup — you pay exactly what Meta charges.</P>
        <SubHead>8.3 Auto-Renewal</SubHead>
        <P>Paid subscriptions auto-renew at the end of each billing cycle. You may cancel auto-renewal at any time from your account dashboard.</P>
        <SubHead>8.4 Failed Payments</SubHead>
        <P>If a payment fails, we will retry up to 3 times over 7 days. If unsuccessful, your account will be downgraded to the free plan until payment is resolved.</P>
      </Section>

      <Section title="9. Refunds">
        <P>Please refer to our <a href="/refund-policy" style={{color:"#22C55E"}}>Refund Policy</a> for full details. Monthly plans are non-refundable. Annual plans are eligible for a pro-rated refund within 7 days of payment. WhatsApp message costs are non-refundable once sent.</P>
      </Section>

      <Section title="10. Intellectual Property">
        <P>All content, features, and functionality of the EnaTalk platform are owned by EnaTalk and protected by Indian and international intellectual property laws.</P>
        <P>You retain ownership of all content you upload or create using the platform. By using the platform, you grant EnaTalk a limited, non-exclusive licence to process this content solely to provide the Service.</P>
      </Section>

      <Section title="11. Limitation of Liability">
        <P>To the maximum extent permitted by Indian law, EnaTalk's total liability shall not exceed the amount you paid to EnaTalk in the 3 months preceding the claim. EnaTalk is not liable for any indirect, incidental, consequential, or punitive damages, including WhatsApp account restrictions imposed by Meta.</P>
      </Section>

      <Section title="12. Termination">
        <SubHead>12.1 By You</SubHead>
        <P>You may close your account at any time from account settings. Closure takes effect at the end of the current billing period.</P>
        <SubHead>12.2 By EnaTalk</SubHead>
        <P>We may suspend or terminate your account immediately if you violate these Terms, engage in spam or fraudulent activity, or fail to pay outstanding amounts. Upon termination, your data will be retained for 90 days then deleted.</P>
      </Section>

      <Section title="13. Governing Law & Disputes">
        <P>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Kolkata, West Bengal, India. We encourage you to contact support@enatalk.com before initiating any legal proceedings.</P>
      </Section>

      <Section title="14. Changes to These Terms">
        <P>We may update these Terms from time to time. Material changes will be communicated by email at least 14 days before they take effect. Continued use after the effective date constitutes acceptance.</P>
      </Section>

      <Section title="15. Contact">
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
