import React from "react";

export default function AcceptableUsePage() {
  return (
    <PageShell title="Acceptable Use" updated="27 April 2026">

      <Section title="1. Purpose">
        <P>This Acceptable Use Policy defines what is and is not permitted when using EnaTalk. This policy exists to protect our users, their customers, the integrity of the WhatsApp network, and to ensure full compliance with Meta's WhatsApp Business and Commerce Policies.</P>
        <P>Violation of this policy may result in immediate suspension or permanent termination of your account without refund.</P>
      </Section>

      <Section title="2. Mandatory Opt-In Requirement">
        <P>This is the single most important rule on EnaTalk:</P>
        <HighlightBox>
          You must have explicit, verifiable opt-in consent from every contact before sending them any WhatsApp message through EnaTalk. Sending messages without opt-in consent is the leading cause of WhatsApp account restrictions and is strictly prohibited.
        </HighlightBox>
        <P>Acceptable opt-in methods include:</P>
        <BulletList items={["A checkbox on your website or booking form (pre-checked boxes are NOT valid)","A verbal agreement recorded with date and context","A customer explicitly messaging your WhatsApp number first","A signed physical or digital form","A keyword opt-in (customer texts a keyword to your number)"]}/>
        <P>You must be able to demonstrate proof of consent if requested by EnaTalk or Meta.</P>
      </Section>

      <Section title="3. Permitted Uses">
        <BulletList items={["Sending promotional campaigns to opted-in contacts","Automated birthday, anniversary, and festival wishes","Order confirmations, shipping updates, and delivery notifications","Appointment reminders and booking confirmations","Customer support and query resolution","Payment confirmations and billing receipts","Lead nurturing for opted-in prospects"]}/>
      </Section>

      <Section title="4. Prohibited Uses">
        <SubHead>4.1 Messaging Violations</SubHead>
        <BulletList items={["Sending messages to contacts who have not opted in","Ignoring opt-out requests (unsubscribes must be honoured within 24 hours)","Sending the same message repeatedly to the same contact","Using purchased, scraped, or rented contact lists","Cold messaging / unsolicited outreach"]}/>
        <SubHead>4.2 Content Violations</SubHead>
        <BulletList items={["False, misleading, or deceptive content","Phishing attempts or fraudulent links","Malware, viruses, or harmful attachments","Content that infringes copyrights, trademarks, or other IP rights","Hate speech or discriminatory content","Threats, harassment, or intimidation","Sexual, explicit, or adult content"]}/>
        <SubHead>4.3 Prohibited Product Promotion</SubHead>
        <BulletList items={["Alcohol, tobacco, e-cigarettes","Illegal drugs or drug paraphernalia","Weapons, firearms, ammunition, explosives","Gambling or betting services","Adult entertainment services","Counterfeit or replica goods","Pyramid schemes or MLM","Unapproved pharmaceutical products","Any product illegal in India or the recipient's country"]}/>
        <SubHead>4.4 Platform Abuse</SubHead>
        <BulletList items={["Attempting to reverse-engineer or decompile the EnaTalk platform","Using automated scripts to access the platform outside the official API","Sharing account credentials with unauthorised users","Circumventing rate limits, usage caps, or platform restrictions","Reselling access to EnaTalk without written permission"]}/>
      </Section>

      <Section title="5. Opt-Out Handling">
        <P>You are required to:</P>
        <BulletList items={["Provide a clear opt-out mechanism in every marketing message (e.g. Reply STOP to unsubscribe)","Process opt-out requests within 24 hours","Never re-add contacts who have unsubscribed to future campaigns","Maintain an updated suppression list of opted-out contacts"]}/>
        <P>EnaTalk provides built-in opt-out management tools. You are responsible for using them correctly.</P>
      </Section>

      <Section title="6. Message Quality">
        <BulletList items={["Do not send more than 2–3 marketing messages per week to the same contact","Ensure all messages provide genuine value to the recipient","A high block or spam report rate will trigger an account review","WhatsApp monitors quality scores — low scores can restrict your number"]}/>
      </Section>

      <Section title="7. Consequences of Violation">
        <BulletList items={["Immediate suspension of your EnaTalk account","Permanent termination without refund","Reporting to Meta/WhatsApp which may result in your number being banned","Legal action if violations cause damage to EnaTalk or third parties"]}/>
      </Section>

      <Section title="8. Reporting Violations">
        <P>If you believe another user is violating this policy, or if you received an unwanted message from an EnaTalk-powered sender, report it to:</P>
        <ContactBlock email="support@enatalk.com" address="Enatalk, Ramkrishna Upanibesh Jadavpur, Kolkata, West Bengal 700092, India"/>
      </Section>

      <Section title="9. Contact">
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
