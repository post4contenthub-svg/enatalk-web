import React from "react";

export function PageShell({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  const policyLinks: [string, string][] = [
    ["Privacy Policy", "/privacy-policy"],
    ["Terms of Service", "/terms"],
    ["Refund Policy", "/refund-policy"],
    ["Acceptable Use", "/acceptable-use"],
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#040B1C", color: "#fff", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bricolage+Grotesque:wght@700;800&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        a{color:#22C55E;text-decoration:none;}
        a:hover{text-decoration:underline;}
        ::selection{background:rgba(34,197,94,0.3);}
        @media(max-width:640px){
          .policy-nav{flex-wrap:wrap!important;}
          .legal-content{padding:40px 18px 80px!important;}
        }
      `}</style>

      {/* Trust bar */}
      <div style={{ background: "rgba(34,197,94,0.07)", borderBottom: "1px solid rgba(34,197,94,0.15)", padding: "9px 28px", textAlign: "center" }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 500, letterSpacing: "0.02em" }}>
          ✦ Official WhatsApp Business Cloud API by Meta &nbsp;·&nbsp; Compliant with WhatsApp Business & Commerce Policies &nbsp;·&nbsp; Made in India 🇮🇳
        </span>
      </div>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 22, color: "#fff", letterSpacing: "-0.5px", textDecoration: "none" }}>
          Ena<span style={{ color: "#22C55E" }}>Talk</span>
        </a>
        <div style={{ display: "flex", gap: 20 }} className="policy-nav">
          {policyLinks.map(([l, h]) => (
            <a key={l} href={h} style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>{l}</a>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <div className="legal-content" style={{ maxWidth: 800, margin: "0 auto", padding: "56px 28px 100px" }}>
        <a href="/" style={{ fontSize: 13, color: "rgba(255,255,255,0.32)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 40, fontWeight: 500, textDecoration: "none" }}>
          ← Back to EnaTalk
        </a>

        {/* Page header */}
        <div style={{ borderLeft: "3px solid #22C55E", paddingLeft: 20, marginBottom: 44 }}>
          <div style={{ fontSize: 11, color: "#22C55E", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 8 }}>Legal Document</div>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: "clamp(28px,4.5vw,44px)", letterSpacing: "-1.2px", lineHeight: 1.1, color: "#fff", marginBottom: 10 }}>
            {title}
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.32)", lineHeight: 1.6 }}>
            Last updated: <strong style={{ color: "rgba(255,255,255,0.52)" }}>{updated}</strong>
            &nbsp;·&nbsp; Enatalk, Kolkata, West Bengal, India
            &nbsp;·&nbsp; Governing law: India
          </p>
        </div>

        {/* Policy switcher tabs */}
        <div className="policy-nav" style={{ display: "flex", flexWrap: "wrap" as const, gap: 8, marginBottom: 48, padding: "14px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 }}>
          {policyLinks.map(([l, h]) => {
            const active = l === title;
            return (
              <a key={l} href={h} style={{
                fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 100,
                background: active ? "linear-gradient(135deg,#22C55E,#16A34A)" : "rgba(255,255,255,0.04)",
                color: active ? "#fff" : "rgba(255,255,255,0.42)",
                border: active ? "none" : "1px solid rgba(255,255,255,0.08)",
                boxShadow: active ? "0 4px 12px rgba(34,197,94,0.28)" : "none",
                textDecoration: "none",
              }}>{l}</a>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: 0 }}>
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: "#020810", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "28px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" as const }}>
          <div className="policy-nav" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" as const, gap: 20, marginBottom: 14 }}>
            {[...policyLinks, ["Contact", "mailto:hello@enatalk.com"]].map(([l, h]) => (
              <a key={l} href={h} style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{l}</a>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
            © {new Date().getFullYear()} EnaTalk. All rights reserved. WhatsApp is a trademark of WhatsApp LLC. EnaTalk is not affiliated with Meta Platforms, Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ paddingBottom: 32, marginBottom: 32, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 18, color: "#fff", marginBottom: 14, letterSpacing: "-0.2px" }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>{children}</div>
    </div>
  );
}

export function SubHead({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: 14, fontWeight: 700, color: "#22C55E", marginTop: 6, marginBottom: 2 }}>{children}</h3>;
}

export function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 14, color: "rgba(255,255,255,0.56)", lineHeight: 1.85 }}>{children}</p>;
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column" as const, gap: 6 }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: 14, color: "rgba(255,255,255,0.54)", lineHeight: 1.75, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ color: "#22C55E", fontSize: 11, marginTop: 5, flexShrink: 0 }}>▸</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function ContactBlock({ email, address }: { email: string; address: string }) {
  return (
    <div style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.16)", borderRadius: 14, padding: "16px 20px", display: "flex", flexDirection: "column" as const, gap: 8 }}>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>📧 Email: <a href={`mailto:${email}`} style={{ color: "#22C55E", fontWeight: 600 }}>{email}</a></div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>📍 Address: {address}</div>
    </div>
  );
}
