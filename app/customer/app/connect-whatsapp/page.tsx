"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

// ─── Extend window for Meta FB SDK ───
declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export default function ConnectWhatsAppPage() {
  const router = useRouter();
  const supabase = createClient();

  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [sdkReady, setSdkReady] = useState(false);

  const G = "#22C55E";
  const GOLD = "#F5B800";
  const BORDER = "rgba(255,255,255,0.08)";
  const MUTED = "rgba(255,255,255,0.5)";

  // ── Load Meta FB SDK on mount ──
  useEffect(() => {
    // If already loaded, init immediately
    if (window.FB) {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_META_APP_ID!,
        cookie: true,
        xfbml: true,
        version: "v22.0",
      });
      setSdkReady(true);
      return;
    }

    // Set up fbAsyncInit before the script loads
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_META_APP_ID!,
        cookie: true,
        xfbml: true,
        version: "v22.0",
      });
      setSdkReady(true);
    };

    // Inject the FB SDK script
    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  // ── Called when Meta Embedded Signup returns ──
  async function handleMetaResponse(code: string) {
    setStatus("saving");

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      // Send code to our API — it exchanges for phone_number_id and waba_id
      const res = await fetch("/api/whatsapp/exchange-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, userId: user.id }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to connect WhatsApp");

      setStatus("done");

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/customer/app");
      }, 2000);

    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  // ── Launch Meta Embedded Signup ──
  function handleConnect() {
    if (!sdkReady) {
      setErrorMsg("Facebook SDK not loaded yet. Please wait a moment and try again.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    window.FB.login(
      (response: any) => {
        if (response.authResponse?.code) {
          // ✅ Got the code — exchange it for WhatsApp credentials
          handleMetaResponse(response.authResponse.code);
        } else {
          // User cancelled or denied
          setStatus("idle");
          setErrorMsg("Connection cancelled. Please try again.");
        }
      },
      {
        config_id: process.env.NEXT_PUBLIC_META_APP_ID,
        response_type: "code",
        override_default_response_type: true,
        extras: {
          setup: {},
          featureType: "",
          sessionInfoVersion: "3",
        },
      }
    );
  }

  // ── DONE state ──
  if (status === "done") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 20, textAlign: "center", fontFamily: "'DM Sans',sans-serif" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(34,197,94,0.15)", border: `2px solid ${G}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>✅</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", fontFamily: "'Bricolage Grotesque',sans-serif" }}>WhatsApp Connected!</h2>
        <p style={{ fontSize: 15, color: MUTED, maxWidth: 320, lineHeight: 1.7 }}>
          Your WhatsApp number is now linked to EnaTalk. You can start sending campaigns immediately.
        </p>
        <p style={{ fontSize: 13, color: MUTED }}>Redirecting to dashboard…</p>
      </div>
    );
  }

  // ── SAVING state ──
  if (status === "saving") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 20, fontFamily: "'DM Sans',sans-serif" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", border: `4px solid ${G}`, borderTopColor: "transparent", animation: "spin .8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>Saving your WhatsApp connection…</p>
        <p style={{ color: MUTED, fontSize: 13 }}>This takes just a few seconds.</p>
      </div>
    );
  }

  // ── LOADING state (popup open) ──
  if (status === "loading") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 20, fontFamily: "'DM Sans',sans-serif" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", border: `4px solid #1877F2`, borderTopColor: "transparent", animation: "spin .8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>Meta popup is open…</p>
        <p style={{ color: MUTED, fontSize: 13, textAlign: "center", maxWidth: 280 }}>
          Complete the steps in the popup window. If it didn't open, check your browser popup blocker.
        </p>
        <button
          onClick={() => setStatus("idle")}
          style={{ fontSize: 13, color: MUTED, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", textDecoration: "underline" }}
        >
          Cancel
        </button>
      </div>
    );
  }

  // ── MAIN UI ──
  const needs = [
    { icon: "📱", title: "Your new SIM number", desc: "The number you'll use as your WhatsApp Business number." },
    { icon: "📘", title: "A Facebook / Meta account", desc: "You'll log in to verify your identity. Free to create if needed." },
    { icon: "🏢", title: "Your business name", desc: "This appears as the sender name in all messages." },
  ];

  const steps = [
    { n: "1", title: "Tap the button below", desc: "A secure Meta popup opens — like 'Login with Google'." },
    { n: "2", title: "Log in to Facebook", desc: "Use your existing Facebook account." },
    { n: "3", title: "Enter your phone number", desc: "Your new SIM card number — this becomes your WhatsApp Business number." },
    { n: "4", title: "Enter the OTP", desc: "Meta sends a code to your phone. Enter it in the popup." },
    { n: "5", title: "Done — dashboard unlocks", desc: "Campaigns and templates are immediately available." },
  ];

  return (
    <div style={{ maxWidth: 540, margin: "0 auto", fontFamily: "'DM Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bricolage+Grotesque:wght@700;800&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        *{box-sizing:border-box;margin:0;padding:0;}
        a{text-decoration:none;color:inherit;}
        .fu{animation:fadeUp .5s ease both;}
        .fu1{animation-delay:.04s;}.fu2{animation-delay:.10s;}.fu3{animation-delay:.16s;}.fu4{animation-delay:.22s;}
        .card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:20px;}
      `}</style>

      {/* Header */}
      <div className="fu fu1" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
          <div style={{ width: 50, height: 50, borderRadius: 16, background: "rgba(34,197,94,0.14)", border: "1px solid rgba(34,197,94,0.28)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
            📱
          </div>
          <div>
            <h1 style={{ fontSize: "clamp(20px,4vw,26px)", fontWeight: 800, color: "#fff", fontFamily: "'Bricolage Grotesque',sans-serif", letterSpacing: "-0.5px" }}>
              Connect WhatsApp
            </h1>
            <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>
              {sdkReady ? "Ready — takes about 2 minutes" : "Loading Meta SDK…"}
            </p>
          </div>
        </div>

        {/* Progress strip */}
        <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
          {["Account ✓", "Connect WA", "Contacts", "Campaign"].map((s, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 100, background: i === 0 ? G : i === 1 ? "rgba(34,197,94,0.35)" : "rgba(255,255,255,0.08)" }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {["Account ✓", "Connect WA", "Contacts", "Campaign"].map((s, i) => (
            <span key={i} style={{ fontSize: 10, color: i <= 1 ? G : MUTED, fontWeight: i === 1 ? 700 : 400 }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Warning */}
      <div className="fu fu1" style={{ background: "rgba(245,184,0,0.07)", border: "1px solid rgba(245,184,0,0.22)", borderRadius: 16, padding: "16px 18px", marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>⚠️</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: GOLD, marginBottom: 5 }}>Use a new or separate SIM</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", lineHeight: 1.65 }}>
              If you connect a number already active on WhatsApp, it will be <strong style={{ color: "#fff" }}>removed from that device</strong> and chat history will be deleted. Use your new SIM card.
            </p>
          </div>
        </div>
      </div>

      {/* What you need */}
      <div className="fu fu2 card" style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 16 }}>What you need</p>
        {needs.map((n, i) => (
          <div key={i} style={{ display: "flex", gap: 12, paddingBottom: i < needs.length - 1 ? 14 : 0, marginBottom: i < needs.length - 1 ? 14 : 0, borderBottom: i < needs.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>{n.icon}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{n.title}</div>
              <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>{n.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="fu fu3 card" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 16 }}>How it works — 5 steps</p>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 12, paddingBottom: i < steps.length - 1 ? 14 : 0, marginBottom: i < steps.length - 1 ? 14 : 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(34,197,94,0.12)", border: "1.5px solid rgba(34,197,94,0.28)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: G, flexShrink: 0 }}>
              {s.n}
            </div>
            <div style={{ paddingTop: 3 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Error message */}
      {errorMsg && (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: "#f87171" }}>❌ {errorMsg}</p>
        </div>
      )}

      {/* CTA */}
      <div className="fu fu4">
        <button
          onClick={handleConnect}
          disabled={!sdkReady || status === "loading" || status === "saving"}
          style={{
            width: "100%", padding: "16px",
            background: sdkReady
              ? `linear-gradient(135deg, ${G} 0%, #16A34A 100%)`
              : "rgba(255,255,255,0.1)",
            color: "#fff", border: "none", borderRadius: 16,
            fontSize: 16, fontWeight: 700, cursor: sdkReady ? "pointer" : "not-allowed",
            fontFamily: "'DM Sans',sans-serif",
            boxShadow: sdkReady ? "0 8px 24px rgba(34,197,94,0.38)" : "none",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            marginBottom: 14, letterSpacing: "-0.2px",
            opacity: sdkReady ? 1 : 0.6,
            transition: "all .2s",
          }}
        >
          <span style={{ fontSize: 22 }}>📲</span>
          {sdkReady ? "Connect with Meta — It's Free" : "Loading…"}
        </button>

        <p style={{ fontSize: 12, color: MUTED, textAlign: "center", lineHeight: 1.7, marginBottom: 18 }}>
          🔒 Secure · Official WhatsApp Business Cloud API by Meta
        </p>

        {/* New SIM tip */}
        <div style={{ background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.18)", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: "#93C5FD", fontWeight: 700, marginBottom: 4 }}>💡 Your SIM is more than 1 month old</p>
          <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65 }}>
            Good news — your SIM is ready to connect. No need to wait.
          </p>
        </div>

        <p style={{ textAlign: "center", fontSize: 13 }}>
          <Link href="/customer/app/help" style={{ color: G, fontWeight: 600 }}>
            Need help? Visit our Help section →
          </Link>
        </p>
      </div>
    </div>
  );
}
