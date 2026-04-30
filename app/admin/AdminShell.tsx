"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  const navItems = [
    { href: "/admin", icon: "⊞", label: "Dashboard" },
    { href: "/admin/users", icon: "👥", label: "Users" },
    { href: "/admin/revenue", icon: "💰", label: "Revenue" },
    { href: "/admin/tenants", icon: "📲", label: "Tenants" },
    { href: "/admin/messages", icon: "💬", label: "Messages" },
    { href: "/admin/campaigns", icon: "📣", label: "Campaigns" },
    { href: "/admin/test-whatsapp", icon: "🧪", label: "Test WhatsApp" },
    { href: "/admin/settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#040B1C", color: "#fff", display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bricolage+Grotesque:wght@700;800&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        a{text-decoration:none;color:inherit;}
        .nav-item{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;font-size:13px;font-weight:500;color:rgba(255,255,255,0.5);transition:all .2s;width:100%;}
        .nav-item:hover{background:rgba(255,255,255,0.06);color:#fff;}
        .nav-item.active{background:rgba(34,197,94,0.12);color:#22C55E;font-weight:600;}
        .stat-card:hover{border-color:rgba(34,197,94,0.25)!important;transform:translateY(-1px);}
      `}</style>

      {/* Top bar */}
      <header style={{ background: "rgba(4,11,28,0.97)", borderBottom: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/enatalk-logo.webp" alt="EnaTalk" style={{ height: 36, width: "auto", objectFit: "contain", filter: "drop-shadow(0 0 8px rgba(245,184,0,0.4))" }}/>
            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }}/>
            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Admin Panel</span>
            <span style={{ fontSize: 10, background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)", padding: "2px 8px", borderRadius: 100, fontWeight: 700, letterSpacing: "0.05em" }}>INTERNAL</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
              <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 6px #22C55E", animation: "pulse 2s infinite" }}/>
              All systems online
            </div>
            <form action="/api/admin/logout" method="POST">
              <button type="submit" style={{ padding: "7px 18px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .2s" }}>
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, maxWidth: 1400, margin: "0 auto", width: "100%", padding: "24px", gap: 24 }}>
        {/* Sidebar */}
        <aside style={{ width: 220, flexShrink: 0 }}>
          <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "14px 10px", position: "sticky", top: 84 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.22)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "0 10px", marginBottom: 8 }}>Navigation</p>
            <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {navItems.map(item => {
                const isActive = path === item.href || (item.href !== "/admin" && path.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href} className={`nav-item${isActive ? " active" : ""}`}>
                    <span style={{ fontSize: 15, width: 22, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
                    {item.label}
                    {isActive && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#22C55E", flexShrink: 0 }}/>}
                  </Link>
                );
              })}
            </nav>

            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "14px 4px" }}/>

            {/* Quick stats in sidebar */}
            <div style={{ padding: "10px 14px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.12)", borderRadius: 10 }}>
              <p style={{ fontSize: 11, color: "#f87171", fontWeight: 700, marginBottom: 4 }}>⚠️ Admin Zone</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>Restricted access only. Do not share credentials.</p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
      </div>
    </div>
  );
}
