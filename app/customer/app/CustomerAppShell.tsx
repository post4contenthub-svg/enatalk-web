"use client";

import { ReactNode, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useWhatsappStatus } from "./hooks/useWhatsappStatus";

export default function CustomerAppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const waConnected = useWhatsappStatus();

  const [userName, setUserName] = useState("Account");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  const NAV = "#0B1E3D";
  const G = "#22C55E";
  const GOLD = "#F5B800";
  const BORDER = "rgba(255,255,255,0.08)";
  const MUTED = "rgba(255,255,255,0.5)";

  // ── Load user info (NO redirect) ──
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const u = session.user;
        setUserName(
          u.user_metadata?.full_name ||
          u.email?.split("@")[0] ||
          "Account"
        );
        if (u.user_metadata?.picture) setAvatarUrl(u.user_metadata.picture);
      }
      // ✅ Always allow the page to load — no redirect
      setLoading(false);
    };
    init();
  }, []);

  // ── Auto logout after 15 min idle ──
  useEffect(() => {
    const TIMEOUT = 15 * 60 * 1000;
    const reset = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(async () => {
        await supabase.auth.signOut();
        router.push("/login");
      }, TIMEOUT);
    };
    const events = ["mousemove", "keydown", "touchstart", "scroll"];
    events.forEach(e => window.addEventListener(e, reset));
    reset();
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      events.forEach(e => window.removeEventListener(e, reset));
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navItems = [
    { href: "/customer/app",           label: "Dashboard", icon: "🏠" },
    { href: "/customer/app/contacts",  label: "Contacts",  icon: "👥" },
    { href: "/customer/app/campaigns", label: "Campaigns", icon: "🚀", needsWA: true },
    { href: "/customer/app/templates", label: "Templates", icon: "📋", needsWA: true },
    { href: "/customer/app/settings",  label: "Settings",  icon: "⚙️" },
    { href: "/customer/app/help",      label: "Help",      icon: "❓" },
  ];

  const isActive = (href: string) =>
    href === "/customer/app"
      ? pathname === "/customer/app"
      : pathname.startsWith(href);

  const currentLabel =
    navItems.find(n => isActive(n.href))?.label ?? "Dashboard";

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#060D1F", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", border: `3px solid ${G}`, borderTopColor: "transparent", animation: "spin .8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: MUTED, fontSize: 13, fontFamily: "sans-serif" }}>Loading EnaTalk…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#060D1F", display: "flex", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bricolage+Grotesque:wght@700;800&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }

        .ni {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 11px;
          font-size: 14px; font-weight: 500;
          color: rgba(255,255,255,0.55);
          transition: all .18s; cursor: pointer;
        }
        .ni:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .ni.active { background: rgba(34,197,94,0.12); color: #22C55E; font-weight: 700; }
        .ni.locked { opacity: 0.35; pointer-events: none; }

        .wa-banner {
          margin: 10px 10px 4px;
          background: rgba(245,184,0,0.08);
          border: 1px solid rgba(245,184,0,0.22);
          border-radius: 13px; padding: 12px 13px;
          display: flex; align-items: center; gap: 10px;
          cursor: pointer; transition: background .2s;
        }
        .wa-banner:hover { background: rgba(245,184,0,0.14); }

        /* Mobile bottom nav */
        .mob-bar {
          display: none;
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
          background: ${NAV};
          border-top: 1px solid ${BORDER};
          padding: 6px 0 max(env(safe-area-inset-bottom), 6px);
        }
        .mob-tab {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; gap: 3px; padding: 6px 2px;
          font-size: 10px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          color: rgba(255,255,255,0.4);
          background: none; border: none; cursor: pointer;
          transition: color .15s;
        }
        .mob-tab.active { color: ${G}; }
        .mob-tab.locked { color: rgba(255,255,255,0.18); }

        @media(max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mob-bar { display: flex !important; }
          .main-area { padding-bottom: 72px !important; }
          .mob-menu-btn { display: block !important; }
          .wa-status-label { display: none !important; }
        }
        @media(min-width: 769px) {
          .mob-menu-btn { display: none !important; }
        }
      `}</style>

      {/* ══ DESKTOP SIDEBAR ══ */}
      <aside className="desktop-sidebar" style={{
        width: 232,
        background: NAV,
        borderRight: `1px solid ${BORDER}`,
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        flexShrink: 0,
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ padding: "18px 18px 14px", borderBottom: `1px solid ${BORDER}` }}>
          <img
            src="/enatalk-logo.webp"
            alt="EnaTalk"
            style={{ height: 30, objectFit: "contain" }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>

        {/* WA not connected banner */}
        {waConnected === false && (
          <div className="wa-banner" onClick={() => router.push("/customer/app/connect-whatsapp")}>
            <span style={{ fontSize: 18 }}>📱</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: GOLD }}>Connect WhatsApp</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>Required to send campaigns</div>
            </div>
            <span style={{ color: GOLD }}>→</span>
          </div>
        )}

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "8px 10px", overflowY: "auto" }}>
          {navItems.map(item => {
            const locked = !!item.needsWA && waConnected === false;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={locked ? "/customer/app/connect-whatsapp" : item.href}
                className={`ni ${active ? "active" : ""} ${locked ? "locked" : ""}`}
              >
                <span style={{ fontSize: 17 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {locked && <span style={{ fontSize: 11, color: GOLD }}>🔒</span>}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div style={{ padding: "12px 14px", borderTop: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            {avatarUrl ? (
              <img src={avatarUrl} style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
            ) : (
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(34,197,94,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: G, flexShrink: 0 }}>
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</div>
              <div style={{ fontSize: 11, color: MUTED }}>Free Plan</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{ width: "100%", padding: "8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.18)", color: "#f87171", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
          >
            Log out
          </button>
        </div>
      </aside>

      {/* ══ MAIN CONTENT ══ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Top header */}
        <header style={{
          height: 56,
          background: NAV,
          borderBottom: `1px solid ${BORDER}`,
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
          gap: 12,
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}>
          <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: "#fff" }}>
            {currentLabel}
          </span>

          {/* WA status pill */}
          <button
            onClick={() => !waConnected && router.push("/customer/app/connect-whatsapp")}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: waConnected ? "rgba(34,197,94,0.10)" : "rgba(245,184,0,0.10)",
              border: `1px solid ${waConnected ? "rgba(34,197,94,0.22)" : "rgba(245,184,0,0.22)"}`,
              borderRadius: 100, padding: "5px 12px",
              fontSize: 12, fontWeight: 600,
              color: waConnected ? G : GOLD,
              cursor: waConnected ? "default" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: waConnected ? G : GOLD, display: "inline-block" }} />
            <span className="wa-status-label">
              {waConnected ? "WA Connected" : "Connect WhatsApp"}
            </span>
          </button>

          {/* Avatar */}
          <div onClick={() => router.push("/customer/app/settings")} style={{ cursor: "pointer", flexShrink: 0 }}>
            {avatarUrl ? (
              <img src={avatarUrl} style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(34,197,94,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: G }}>
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="main-area" style={{ flex: 1, padding: "24px 20px", overflowY: "auto" }}>
          {children}
        </main>
      </div>

      {/* ══ MOBILE BOTTOM TAB BAR ══ */}
      <nav className="mob-bar">
        {navItems.slice(0, 5).map(item => {
          const locked = !!item.needsWA && waConnected === false;
          const active = isActive(item.href);
          return (
            <button
              key={item.href}
              className={`mob-tab ${active ? "active" : ""} ${locked ? "locked" : ""}`}
              onClick={() => router.push(locked ? "/customer/app/connect-whatsapp" : item.href)}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
