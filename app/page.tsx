"use client";

import { useState, useEffect } from "react";
import CookieBanner from "@/components/CookieBanner";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const supabase = createClient();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [activePolicy, setActivePolicy] = useState<"privacy" | "terms" | null>(null);
  const [pricingAnnual, setPricingAnnual] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleGoogleAuth() {
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `https://app.enatalk.com/auth/callback`, queryParams: { prompt: "select_account" } },
    });
    if (error) setError(error.message);
    setLoading(false);
  }

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    if (authMode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { business_type: businessType } } });
      if (error) { setError(error.message); setLoading(false); return; }
      const trialEnd = new Date(); trialEnd.setDate(trialEnd.getDate() + 14);
      await supabase.from("user_subscriptions").insert({ user_id: data.user?.id, subscription_status: "trial", trial_end: trialEnd.toISOString(), credits: 500 });
      await supabase.from("user_profiles").insert({ user_id: data.user?.id, business_type: businessType });
      setShowOtp(true);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      router.push("/customer/app");
    }
    setLoading(false);
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: "signup" });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/customer/app");
    setLoading(false);
  }

  const testimonials = [
    { img: "https://images.unsplash.com/photo-1604072366595-e75dc92d6bdc?w=80&h=80&fit=crop&crop=face", name: "Priya Sharma", role: "Salon Owner, Delhi", text: "I send birthday offers to 300 customers every month automatically. My bookings went up 40% in the first 3 months.", rating: 5 },
    { img: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&h=80&fit=crop&crop=face", name: "Ravi Patel", role: "Café Owner, Ahmedabad", text: "I used to spend 2 hours daily messaging customers. Now EnaTalk does it all. I just check the results.", rating: 5 },
    { img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80&h=80&fit=crop&crop=face", name: "Anita Reddy", role: "Jewellery Shop, Hyderabad", text: "Sent Diwali offers to 500 customers in one tap. Got 87 replies within 2 hours. Never saw this response before.", rating: 5 },
  ];

  const useCases = [
    { img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop", tag: "Salons & Spas", title: "Fill empty appointment slots instantly", desc: "Send last-minute offers to your contact list and watch bookings come in within minutes — all through WhatsApp." },
    { img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop", tag: "Cafés & Restaurants", title: "Daily specials that actually get read", desc: "WhatsApp messages have 98% open rate. Your daily menu special reaches every customer — not their spam folder." },
    { img: "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600&h=400&fit=crop", tag: "Retail & Jewellery", title: "Festival offers that drive footfall", desc: "Send personalised Diwali, Eid and Christmas offers with one tap. Customers feel valued — and they come back." },
  ];

  const features = [
    { icon: "⚡", title: "Live in 5 minutes", desc: "Connect your WhatsApp and send your first campaign — guided step by step, nothing to install.", col: "#22C55E" },
    { icon: "🎂", title: "Auto birthday & festivals", desc: "Add a birthday once. EnaTalk sends wishes every year — Diwali, Eid, Christmas, all handled.", col: "#F5B800" },
    { icon: "📋", title: "Ready-made templates", desc: "Dozens of pre-written templates. Pick one, personalise, send — takes under a minute.", col: "#3B8BEB" },
    { icon: "🌐", title: "Hindi & regional languages", desc: "Send messages in Hindi, Bengali, Tamil, Gujarati — in the language your customers speak.", col: "#A78BFA" },
    { icon: "📱", title: "Runs on your phone", desc: "No laptop needed. Manage contacts, campaigns and reports entirely from your smartphone.", col: "#34D399" },
    { icon: "💰", title: "Transparent pricing", desc: "We pass Meta's message cost directly to you — zero markup. What you see is what you pay.", col: "#FB923C" },
  ];

  const steps = [
    { n: "01", icon: "✉️", title: "Sign up free", desc: "Use email or Google. Ready in 30 seconds." },
    { n: "02", icon: "📲", title: "Connect WhatsApp", desc: "One tap via official Meta onboarding — guided on your phone." },
    { n: "03", icon: "👥", title: "Import contacts", desc: "Add manually or upload CSV — from your phone, no computer needed." },
    { n: "04", icon: "🚀", title: "Launch campaign", desc: "Pick template → select contacts → hit Send. Replies come in minutes." },
  ];

  const businesses = [
    "💇 Salons & Spas","☕ Cafés & Restaurants","💍 Jewellery Shops","✈️ Tours & Travel",
    "🏠 Hotels & Homestays","🌿 Nurseries","🧵 Tailors & Boutiques","🔧 Service Workshops",
    "🛒 Retail & Kirana","🏋️ Gyms & Fitness","📚 Coaching & Training","🏢 Enterprises & Chains",
  ];

  const faqs = [
    { q: "Do I need a laptop or computer?", a: "No. EnaTalk is designed to work entirely from your smartphone. Setup, contacts, campaigns and reports — all from your phone." },
    { q: "Do I need any technical knowledge?", a: "None at all. If you can use WhatsApp, you can use EnaTalk. Every step is guided with plain, simple language." },
    { q: "Will this affect my personal WhatsApp?", a: "No. We recommend using a separate business number. Your personal WhatsApp remains completely unaffected." },
    { q: "Is there a free plan?", a: "Yes. Start free — no credit card. Connect your number, add contacts, and send campaigns right away." },
    { q: "Is EnaTalk officially approved by Meta / WhatsApp?", a: "Yes. EnaTalk is powered by the official WhatsApp Business Cloud API by Meta. Your account is fully compliant and safe from any ban." },
    { q: "Can I send messages in Hindi or other regional languages?", a: "Absolutely. Ready-made templates in Hindi, Bengali, Tamil, Gujarati and more regional languages." },
    { q: "Can customers reply to my messages?", a: "Yes — customers can reply and you can respond from the EnaTalk inbox. Inbound automation with auto-replies and booking flows is coming very soon." },
    { q: "Can large businesses or enterprises use EnaTalk?", a: "Yes. EnaTalk works for any business size — from a single shop to multi-location chains. Our infrastructure scales with you." },
  ];

  const complianceItems = [
    { title: "Official WhatsApp Business API", desc: "EnaTalk uses Meta's approved Cloud API — not unofficial or grey-route solutions." },
    { title: "Opt-in only messaging", desc: "We enforce recipient opt-in before any messages are sent, in line with WhatsApp's commerce policy." },
    { title: "Approved message templates", desc: "All outbound templates are submitted to Meta for review before use in campaigns." },
    { title: "Data privacy controls", desc: "User data is stored securely. We do not sell or share contact data with third parties." },
    { title: "Easy opt-out management", desc: "We provide opt-out mechanisms for all recipients and honour unsubscribe requests immediately." },
  ];

  const privacySections = [
    { h: "1. Introduction", b: `EnaTalk ("we", "our", or "us") operates the WhatsApp messaging automation platform accessible at app.enatalk.com. This Privacy Policy describes how we collect, use, and protect your information when you use our service.` },
    { h: "2. Information We Collect", b: "", list: ["Account info: name, email, business name, phone number","WhatsApp contacts you import or receive through conversations","Usage data: message logs, campaign stats, platform activity","Payment info processed securely by third-party providers"] },
    { h: "3. How We Use Your Information", b: "", list: ["To provide and operate the EnaTalk platform","To send transactional notifications and product updates","To improve our services and develop new features","To comply with legal obligations"] },
    { h: "4. Data Sharing", b: "We do not sell or rent your personal data or your customers' contact data to any third party. We may share data with service providers strictly to operate our platform, under confidentiality agreements." },
    { h: "5. WhatsApp & Meta Data", b: "EnaTalk uses the WhatsApp Business Cloud API provided by Meta Platforms, Inc. By using EnaTalk, you agree to comply with WhatsApp's Business Policy and Commerce Policy. You are solely responsible for obtaining valid opt-in consent from your contacts before messaging them through our platform." },
    { h: "6. Data Retention", b: "We retain conversation data for up to 12 months by default. You may request deletion of your account data at any time by contacting support@enatalk.com." },
    { h: "7. Your Rights", b: "You have the right to access, correct, or delete your personal data. To exercise these rights, email support@enatalk.com." },
    { h: "8. Contact", b: "For privacy questions: support@enatalk.com — Ramkrishna Upanibesh Jadavpur, Kolkata, West Bengal 700092, India." },
  ];

  const termsSections = [
    { h: "1. Acceptance", b: "By accessing or using EnaTalk, you agree to be bound by these Terms. If you do not agree, do not use the Service." },
    { h: "2. Service Description", b: "EnaTalk provides a WhatsApp Business messaging automation platform — including campaign broadcasting, contact management, automated flows, and analytics — powered by the official WhatsApp Business Cloud API by Meta." },
    { h: "3. Eligibility & Account", b: "", list: ["You must be 18+ and represent a legitimate business","You are responsible for your account credentials and all activity under your account","One account per business entity unless agreed otherwise in writing"] },
    { h: "4. Acceptable Use", b: "You agree to use EnaTalk only for lawful purposes in compliance with WhatsApp's Business Policy and Commerce Policy. You must not:", list: ["Send unsolicited messages or spam","Message contacts who have not given explicit opt-in consent","Sell prohibited products as defined in WhatsApp Commerce Policy","Impersonate any person or organisation","Attempt to reverse-engineer, scrape, or misuse the platform"] },
    { h: "5. Payments & Billing", b: "Subscription fees are billed monthly or annually per your chosen plan. Message costs (Meta's API fees) are passed through at zero markup. Refunds are not provided for partial billing periods. Cancel anytime from your dashboard." },
    { h: "6. Termination", b: "We reserve the right to suspend or terminate accounts that violate these Terms, WhatsApp policies, or applicable law — without prior notice in severe cases." },
    { h: "7. Limitation of Liability", b: "EnaTalk is not liable for indirect, incidental, or consequential damages including restrictions imposed by Meta/WhatsApp on your business account due to your own policy violations." },
    { h: "8. Governing Law", b: "These Terms are governed by the laws of India. Disputes shall be resolved in the courts of Kolkata, West Bengal." },
    { h: "9. Contact", b: "For legal questions: support@enatalk.com — Ramkrishna Upanibesh Jadavpur, Kolkata, West Bengal 700092, India." },
  ];

  // ── LOGO COMPONENT — same style used in both nav and footer ──
  const logoStyle: React.CSSProperties = {
    height: 100,
    width: "auto",
    objectFit: "contain",
    maxWidth: 160,
    display: "block",
  };

  function Logo({ height = 100 }: { height?: number }) {
    return (
      <img
        src="/enatalk-logo.webp"
        alt="EnaTalk"
        style={{ ...logoStyle, height }}
        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    );
  }

  function AuthBox() {
    const inp: React.CSSProperties = {
      width: "100%", padding: "13px 16px",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.10)",
      borderRadius: 12, color: "#fff", fontSize: 14,
      fontFamily: "'DM Sans', sans-serif", outline: "none",
      transition: "border-color .2s, background .2s",
    };
    const btnG: React.CSSProperties = {
      width: "100%", padding: "14px",
      background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
      color: "#fff", border: "none", borderRadius: 12,
      fontSize: 15, fontWeight: 700, cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif",
      boxShadow: "0 6px 20px rgba(34,197,94,0.4)",
      letterSpacing: "-0.2px",
    };
    return (
      <div style={{ background: "linear-gradient(160deg,rgba(15,25,55,0.96) 0%,rgba(10,20,40,0.98) 100%)", backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 24, padding: "30px 26px", width: "100%", maxWidth: 420, boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,197,94,0.08) inset" }}>
        <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 13, padding: 4, marginBottom: 24 }}>
          {(["signup", "login"] as const).map(m => (
            <button key={m} onClick={() => { setAuthMode(m); setError(""); setShowOtp(false); }} style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, transition: "all .2s", background: authMode === m ? "linear-gradient(135deg,#22C55E,#16A34A)" : "transparent", color: authMode === m ? "#fff" : "rgba(255,255,255,0.45)", boxShadow: authMode === m ? "0 4px 12px rgba(34,197,94,0.35)" : "none" }}>
              {m === "signup" ? "Sign Up Free" : "Log In"}
            </button>
          ))}
        </div>
        {showOtp ? (
          <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>Code sent to <strong style={{ color: "#fff" }}>{email}</strong></p>
            <input type="text" inputMode="numeric" placeholder="Enter 6-digit code" value={otp} onChange={e => setOtp(e.target.value)} required disabled={loading} style={inp} />
            {error && <p style={{ color: "#f87171", fontSize: 13 }}>{error}</p>}
            <button type="submit" disabled={loading} style={btnG}>{loading ? "Verifying…" : "✅ Verify & Start Free"}</button>
          </form>
        ) : (
          <>
            <button onClick={handleGoogleAuth} disabled={loading} style={{ width: "100%", padding: "13px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)", color: "#fff", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 18 }}>
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/><path fill="#FBBC05" d="M3.964 10.706c-.18-.54-.282-1.117-.282-1.706s.102-1.166.282-1.706V4.962H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.038l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z"/></svg>
              {loading ? "Connecting…" : "Continue with Google"}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>or</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            </div>
            <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} style={inp} />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} style={inp} />
              {authMode === "signup" && (
                <select value={businessType} onChange={e => setBusinessType(e.target.value)} required disabled={loading} style={{ ...inp, color: businessType ? "#fff" : "rgba(255,255,255,0.3)" }}>
                  <option value="" disabled>Select your business type</option>
                  {[["salon","Salon / Spa / Beauty"],["cafe","Café / Restaurant"],["jewellery","Jewellery Shop"],["tour_travels","Tours & Travels"],["homestay","Hotel / Homestay"],["nursery","Nursery / Plants"],["tailor","Tailor / Boutique"],["gym","Gym / Fitness"],["coaching","Coaching / Education"],["kirana","Retail / Kirana Store"],["enterprise","Enterprise / Chain Business"],["other","Other"]].map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              )}
              {error && <p style={{ color: "#f87171", fontSize: 13, margin: 0 }}>{error}</p>}
              <button type="submit" disabled={loading} style={{ ...btnG, marginTop: 4 }}>
                {loading ? "Please wait…" : authMode === "signup" ? "🚀 Create Free Account" : "Log In →"}
              </button>
            </form>
            {authMode === "signup" && (
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 14, lineHeight: 1.65 }}>
                No credit card · 14-day free trial · Cancel anytime
              </p>
            )}
          </>
        )}
      </div>
    );
  }

  function PolicyModal() {
    if (!activePolicy) return null;
    const sections = activePolicy === "privacy" ? privacySections : termsSections;
    const title = activePolicy === "privacy" ? "Privacy Policy" : "Terms of Service";
    return (
      <div onClick={() => setActivePolicy(null)} style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(2,8,16,0.92)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", overflowY: "auto" }}>
        <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 720, background: "linear-gradient(160deg,rgba(15,25,55,0.98),rgba(10,20,40,0.99))", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 24, padding: "40px 40px 48px", boxShadow: "0 40px 100px rgba(0,0,0,0.7)", position: "relative" }}>
          <button onClick={() => setActivePolicy(null)} style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 18, fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            {(["privacy", "terms"] as const).map(p => (
              <button key={p} onClick={() => setActivePolicy(p)} style={{ padding: "8px 20px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, background: activePolicy === p ? "linear-gradient(135deg,#22C55E,#16A34A)" : "rgba(255,255,255,0.06)", color: activePolicy === p ? "#fff" : "rgba(255,255,255,0.4)", boxShadow: activePolicy === p ? "0 4px 14px rgba(34,197,94,0.3)" : "none" }}>
                {p === "privacy" ? "Privacy Policy" : "Terms of Service"}
              </button>
            ))}
          </div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: "-0.8px", marginBottom: 6, color: "#fff" }}>{title}</h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 32 }}>Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · Enatalk, Kolkata, West Bengal, India</p>
          {sections.map((sec, i) => (
            <div key={i} style={{ marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 16, fontWeight: 700, color: "#22C55E", marginBottom: 8 }}>{sec.h}</h3>
              {sec.b && <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.85 }}>{sec.b}</p>}
              {sec.list && <ul style={{ paddingLeft: 18, marginTop: 6 }}>{sec.list.map((item, j) => <li key={j} style={{ fontSize: 13, color: "rgba(255,255,255,0.52)", lineHeight: 1.8, marginBottom: 4 }}>{item}</li>)}</ul>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const G = "#22C55E";
  const GOLD = "#F5B800";

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#040B1C", color: "#fff", minHeight: "100vh", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bricolage+Grotesque:wght@700;800&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        a{text-decoration:none;color:inherit;}
        ::selection{background:rgba(34,197,94,0.3);color:#fff;}
        input::placeholder{color:rgba(255,255,255,0.28);}
        select option{background:#0F1E3E;color:#fff;}
        input:focus,select:focus{outline:none!important;border-color:rgba(34,197,94,0.5)!important;background:rgba(255,255,255,0.09)!important;}
        .nt{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;letter-spacing:-1.5px;}
        .w{max-width:1160px;margin:0 auto;padding:0 28px;}
        .sec{padding:100px 0;}
        .hero-g{display:grid;grid-template-columns:1fr 430px;gap:72px;align-items:center;}
        .feat-g{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
        .step-g{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
        .biz-g{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}
        .case-g{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
        .testi-g{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
        .cta-g{display:grid;grid-template-columns:1fr 430px;gap:72px;align-items:center;}
        .comp-g{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start;}
        @media(max-width:960px){
          .hero-g,.cta-g,.comp-g{grid-template-columns:1fr;gap:48px;}
          .feat-g{grid-template-columns:1fr 1fr;}
          .step-g{grid-template-columns:1fr 1fr;}
          .biz-g{grid-template-columns:repeat(3,1fr);}
          .case-g,.testi-g{grid-template-columns:1fr;}
          .hide-mob{display:none!important;}
          .nav-mid{display:none!important;}
          .sec{padding:68px 0;}
        }
        @media(max-width:520px){
          .feat-g{grid-template-columns:1fr;}
          .step-g{grid-template-columns:1fr;}
          .biz-g{grid-template-columns:1fr 1fr;}
          .sec{padding:52px 0;}
        }
        .nav-link{color:rgba(255,255,255,0.58);font-size:14px;font-weight:500;text-decoration:none;transition:color .2s;}
        .nav-link:hover{color:#fff;}
        .pill{display:inline-flex;align-items:center;gap:7px;background:rgba(34,197,94,0.10);color:#22C55E;border:1px solid rgba(34,197,94,0.22);border-radius:100px;padding:5px 16px;font-size:12px;font-weight:600;letter-spacing:.02em;}
        .fc{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.06);border-radius:20px;padding:28px 24px;transition:border-color .3s,transform .3s;}
        .fc:hover{transform:translateY(-4px);border-color:rgba(255,255,255,0.12);}
        .sc{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.06);border-radius:20px;padding:28px 24px;transition:border-color .3s,transform .3s;}
        .sc:hover{transform:translateY(-3px);border-color:rgba(34,197,94,0.2);}
        .bc{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:14px 16px;font-size:13px;font-weight:500;display:flex;align-items:center;gap:8px;transition:all .2s;}
        .bc:hover{background:rgba(34,197,94,0.07);border-color:rgba(34,197,94,0.25);transform:translateY(-2px);}
        .tbl{width:100%;border-collapse:separate;border-spacing:0;font-size:14px;border-radius:20px;overflow:hidden;}
        .tbl td,.tbl th{padding:14px 22px;}
        .faq-i{border-bottom:1px solid rgba(255,255,255,0.06);}
        .faq-q{width:100%;background:none;border:none;color:#fff;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;text-align:left;padding:20px 0;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;letter-spacing:-.1px;}
        .stat-n{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:clamp(30px,4vw,42px);letter-spacing:-2px;background:linear-gradient(135deg,#22C55E,#34D399);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
        .div-glow{height:1px;background:linear-gradient(90deg,transparent 0%,rgba(34,197,94,0.3) 30%,rgba(245,184,0,0.2) 70%,transparent 100%);}
        .tb{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:100px;padding:7px 16px;font-size:13px;color:rgba(255,255,255,0.6);font-weight:500;}
        .case-card{border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.07);transition:transform .3s,border-color .3s;}
        .case-card:hover{transform:translateY(-4px);border-color:rgba(34,197,94,0.25);}
        .testi-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:24px;transition:border-color .3s,transform .3s;}
        .testi-card:hover{transform:translateY(-3px);border-color:rgba(34,197,94,0.2);}
        .comp-item{display:flex;gap:16px;align-items:flex-start;padding:20px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.06);border-radius:16px;transition:border-color .25s,transform .25s;}
        .comp-item:hover{border-color:rgba(34,197,94,0.25);transform:translateX(4px);}
        .policy-link{background:none;border:none;color:rgba(255,255,255,0.35);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;padding:0;transition:color .2s;}
        .legal-dd:hover .legal-dd-menu{display:flex!important;}
        .legal-dd-menu a{text-decoration:none;}
        .policy-link:hover,.foot-a:hover{color:#22C55E!important;}
        .foot-a{font-size:13px;color:rgba(255,255,255,0.38);font-weight:500;text-decoration:none;line-height:2;transition:color .2s;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
        @keyframes floatY{0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);}}
        @keyframes orbA{0%,100%{transform:translate(0,0) scale(1);}40%{transform:translate(40px,-30px) scale(1.1);}70%{transform:translate(-20px,15px) scale(0.95);}}
        @keyframes orbB{0%,100%{transform:translate(0,0) scale(1);}35%{transform:translate(-30px,20px) scale(1.05);}65%{transform:translate(25px,-15px) scale(1.1);}}
        @keyframes glowDot{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(34,197,94,.7);}50%{opacity:.8;box-shadow:0 0 0 8px rgba(34,197,94,0);}}
        .fu{animation:fadeUp .7s cubic-bezier(.16,1,.3,1) both;}
        .fu1{animation-delay:.04s;}.fu2{animation-delay:.14s;}.fu3{animation-delay:.24s;}.fu4{animation-delay:.34s;}.fu5{animation-delay:.44s;}
        .float{animation:floatY 5s ease-in-out infinite;}
        .glow-dot{animation:glowDot 2s ease infinite;}
        .star{color:${GOLD};font-size:14px;}
      `}</style>

      {/* ── BACKGROUND ── */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 60% at 70% 0%,rgba(34,197,94,0.10) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 10% 80%,rgba(245,184,0,0.07) 0%,transparent 55%),radial-gradient(ellipse 50% 40% at 90% 90%,rgba(59,130,246,0.06) 0%,transparent 50%),#040B1C` }} />
        <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(34,197,94,0.08) 0%,transparent 70%)", top: "-200px", right: "-150px", animation: "orbA 14s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(245,184,0,0.07) 0%,transparent 70%)", bottom: "10%", left: "-100px", animation: "orbB 18s ease-in-out infinite" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.07) 1px,transparent 1px)", backgroundSize: "40px 40px", opacity: 0.4 }} />
      </div>

      {/* ── NAV ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 200, background: scrolled ? "rgba(4,11,28,0.96)" : "rgba(4,11,28,0.88)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", transition: "all .35s" }}>
        <div className="w" style={{ height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* ── NAV LOGO — same as footer ── */}
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <img
              src="/enatalk-logo.webp"
              alt="EnaTalk"
              style={{
                height: 100,
                width: "auto",
                objectFit: "contain",
                maxWidth: 160,
                display: "block",
                filter: "drop-shadow(0 0 10px rgba(245,184,0,0.5)) drop-shadow(0 0 20px rgba(27,75,138,0.4)) brightness(1.15)",
              }}
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </a>

          <div className="nav-mid" style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {[["Features", "#features"], ["How it works", "#how-it-works"], ["Pricing", "#pricing"], ["Compliance", "#compliance"], ["FAQ", "#faq"]].map(([l, h]) => (
              <a key={l} href={h} className="nav-link">{l}</a>
            ))}
            <div style={{ position: "relative" }} className="legal-dd">
              <button className="nav-link" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "'DM Sans',sans-serif", padding: 0 }}>
                Legal <span style={{ fontSize: 10, opacity: 0.6 }}>▾</span>
              </button>
              <div className="legal-dd-menu" style={{ position: "absolute", top: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)", background: "rgba(8,16,36,0.98)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 14, padding: "8px", minWidth: 200, boxShadow: "0 20px 60px rgba(0,0,0,0.6)", backdropFilter: "blur(20px)", display: "none", flexDirection: "column", gap: 2, zIndex: 300 }}>
                {[["🔒 Privacy Policy", "/privacy-policy"], ["📋 Terms of Service", "/terms"], ["💳 Refund Policy", "/refund-policy"], ["✅ Acceptable Use", "/acceptable-use"], ["📬 Contact Us", "/contact"]].map(([l, h]) => (
                  <a key={l} href={h} style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", fontWeight: 500, padding: "9px 14px", borderRadius: 9, display: "block", transition: "background .15s" }} onMouseOver={e => (e.currentTarget.style.background = "rgba(34,197,94,0.10)")} onMouseOut={e => (e.currentTarget.style.background = "transparent")}>{l}</a>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => { setAuthMode("login"); document.getElementById("auth-box")?.scrollIntoView({ behavior: "smooth" }); }} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", padding: "9px 20px", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Log in</button>
            <button onClick={() => { setAuthMode("signup"); document.getElementById("auth-box")?.scrollIntoView({ behavior: "smooth" }); }} style={{ background: "linear-gradient(135deg,#22C55E,#16A34A)", border: "none", color: "#fff", padding: "9px 20px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 14px rgba(34,197,94,0.35)" }}>Sign up free</button>
          </div>
        </div>
      </nav>

      {/* ── TRUST STRIP ── */}
      <div style={{ position: "relative", zIndex: 1, background: "rgba(34,197,94,0.07)", borderBottom: "1px solid rgba(34,197,94,0.15)", padding: "10px 28px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 500, letterSpacing: ".02em" }}>
          <span style={{ color: G, fontWeight: 700 }}>✦ Official WhatsApp Business Cloud API by Meta</span>
          &nbsp;·&nbsp; Compliant with WhatsApp Commerce & Business Policies &nbsp;·&nbsp; Data secured &nbsp;·&nbsp; 100% opt-in messaging
        </p>
      </div>

      {/* ── HERO ── */}
      <section style={{ position: "relative", zIndex: 1, minHeight: "calc(100vh - 100px)", display: "flex", alignItems: "center", padding: "48px 0 64px" }}>
        <div className="w" style={{ width: "100%" }}>
          <div className="hero-g">
            <div>
              <div className="fu fu1" style={{ marginBottom: 22 }}>
                <span className="pill"><span className="glow-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: G, display: "inline-block" }} />Official WhatsApp API &nbsp;·&nbsp; 100% Mobile-Friendly</span>
              </div>
              <h1 className="fu fu2 nt" style={{ fontSize: "clamp(36px,4.8vw,60px)", lineHeight: 1.08, marginBottom: 22 }}>
                WhatsApp can grow<br />your business by{" "}
                <span style={{ background: "linear-gradient(135deg,#22C55E 0%,#34D399 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block" }}>3×</span>
                <br />
                <span style={{ background: "linear-gradient(135deg,#F5B800 0%,#FBBF24 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Start free today</span>
              </h1>
              <p className="fu fu3" style={{ fontSize: 17, color: "rgba(255,255,255,0.58)", lineHeight: 1.82, marginBottom: 34, maxWidth: 500, fontWeight: 400 }}>
                Businesses using WhatsApp campaigns see up to <strong style={{ color: "#fff" }}>3× more customer repeat visits</strong> compared to SMS or email. Send campaigns, birthday wishes & festival offers — from your phone, in minutes.
              </p>
              <div className="fu fu4" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 42 }}>
                {["✅ Free plan", "⚡ 5-min setup", "🔒 Official Meta API", "🇮🇳 Made for India"].map(b => <span key={b} className="tb">{b}</span>)}
              </div>
              <div className="fu fu5" style={{ display: "flex", gap: 40, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {[["98%", "Message open rate"], ["3×", "More repeat visits"], ["5 min", "Average setup time"]].map(([n, l]) => (
                  <div key={l}><div className="stat-n">{n}</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 5, fontWeight: 500 }}>{l}</div></div>
                ))}
              </div>

              {/* Hero visual */}
              <div className="hide-mob" style={{ marginTop: 40, position: "relative", maxWidth: 430, height: 340 }}>
                <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 220, height: 300, zIndex: 1 }}>
                  <svg viewBox="0 0 220 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
                    <defs>
                      <linearGradient id="bodyGrad" x1="72" y1="130" x2="148" y2="240" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#1e3a2f" /><stop offset="100%" stopColor="#0f2018" /></linearGradient>
                      <linearGradient id="skinGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#c68642" /><stop offset="100%" stopColor="#a0522d" /></linearGradient>
                      <linearGradient id="legGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#162d22" /><stop offset="100%" stopColor="#0a1a13" /></linearGradient>
                      <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(34,197,94,0.35)" /><stop offset="100%" stopColor="rgba(34,197,94,0.05)" /></linearGradient>
                    </defs>
                    <ellipse cx="110" cy="292" rx="72" ry="10" fill="rgba(34,197,94,0.12)" />
                    <rect x="82" y="232" width="26" height="62" rx="13" fill="url(#legGrad)" /><rect x="112" y="232" width="26" height="62" rx="13" fill="url(#legGrad)" />
                    <rect x="72" y="128" width="76" height="112" rx="22" fill="url(#bodyGrad)" />
                    <path d="M148 155 Q180 148 183 172 Q185 188 176 198" stroke="#1e3a2f" strokeWidth="18" strokeLinecap="round" fill="none" />
                    <path d="M72 148 Q38 138 34 108 Q32 92 44 88" stroke="#c68642" strokeWidth="17" strokeLinecap="round" fill="none" />
                    <circle cx="110" cy="104" r="33" fill="url(#skinGrad)" />
                    <ellipse cx="110" cy="79" rx="33" ry="19" fill="#111827" /><ellipse cx="110" cy="75" rx="29" ry="15" fill="#0d1117" />
                    <ellipse cx="100" cy="107" rx="4" ry="5" fill="#6b3a1f" opacity="0.6" /><ellipse cx="120" cy="107" rx="4" ry="5" fill="#6b3a1f" opacity="0.6" />
                    <path d="M104 119 Q110 125 116 119" stroke="#6b3a1f" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5" />
                    <rect x="22" y="76" width="32" height="54" rx="7" fill="#111827" stroke="rgba(34,197,94,0.55)" strokeWidth="1.5" />
                    <rect x="25" y="80" width="26" height="42" rx="5" fill="#0d1117" /><rect x="25" y="80" width="26" height="42" rx="5" fill="url(#screenGrad)" />
                    <rect x="27" y="83" width="19" height="6" rx="3" fill="rgba(34,197,94,0.95)" />
                    <rect x="27" y="91" width="15" height="5" rx="2.5" fill="rgba(255,255,255,0.14)" />
                    <rect x="32" y="98" width="17" height="5" rx="2.5" fill="rgba(34,197,94,0.75)" />
                    <rect x="27" y="105" width="13" height="5" rx="2.5" fill="rgba(255,255,255,0.12)" />
                    <rect x="27" y="112" width="18" height="5" rx="2.5" fill="rgba(34,197,94,0.6)" />
                    <rect x="35" y="126" width="10" height="2" rx="1" fill="rgba(255,255,255,0.2)" />
                  </svg>
                </div>
                <div style={{ position: "absolute", top: 0, right: 0, width: 252, background: "linear-gradient(160deg,rgba(13,22,48,0.97),rgba(8,16,36,0.98))", border: "1px solid rgba(34,197,94,0.22)", borderRadius: 20, padding: "15px 16px", boxShadow: "0 24px 64px rgba(0,0,0,0.65)", backdropFilter: "blur(24px)", animation: "floatY 5s ease-in-out infinite", zIndex: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11 }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#22C55E,#16A34A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>💬</div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Sharma Salon</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>Campaign · 248 contacts</div></div>
                    <div style={{ fontSize: 10, color: G, fontWeight: 700 }}>✓✓ 231 read</div>
                  </div>
                  <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.14)", borderLeft: `3px solid ${G}`, borderRadius: "4px 13px 13px 13px", padding: "9px 11px", fontSize: 11.5, lineHeight: 1.7, marginBottom: 10 }}>
                    🎂 <strong style={{ color: "#fff" }}>Happy Birthday Priya ji!</strong><br />Get <strong style={{ color: G }}>20% off</strong> at Sharma Salon today! 🎉
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[["248", "Sent"], ["231", "Read"], ["93%", "Open rate"]].map(([n, l]) => (
                      <div key={l} style={{ flex: 1, background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.13)", borderRadius: 9, padding: "6px 3px", textAlign: "center" }}>
                        <div style={{ color: G, fontWeight: 700, fontSize: 13, fontFamily: "'Bricolage Grotesque',sans-serif" }}>{n}</div>
                        <div style={{ color: "rgba(255,255,255,0.36)", fontSize: 9, marginTop: 1 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ position: "absolute", bottom: 55, left: 0, background: "linear-gradient(135deg,rgba(13,22,48,0.96),rgba(8,16,36,0.97))", border: "1px solid rgba(245,184,0,0.22)", borderRadius: 13, padding: "9px 13px", boxShadow: "0 12px 32px rgba(0,0,0,0.5)", backdropFilter: "blur(16px)", animation: "floatY 6.5s ease-in-out infinite", animationDelay: "1.8s", zIndex: 10, display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(245,184,0,0.12)", border: "1px solid rgba(245,184,0,0.28)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>⚡</div>
                  <div><div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>Campaign sent!</div><div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>500 messages · 2 min ago</div></div>
                </div>
              </div>
            </div>
            <div id="auth-box" style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 14 }}>
              <AuthBox />
              <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
                {[{ i: "🔒", t: "Secure & official" }, { i: "⭐", t: "1,000+ businesses" }].map(b => (
                  <span key={b.t} style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: 4, fontWeight: 500 }}>{b.i} {b.t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BUSINESSES ── */}
      <div className="div-glow" />
      <section style={{ position: "relative", zIndex: 1, background: "rgba(255,255,255,0.012)", padding: "52px 0" }}>
        <div className="w">
          <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 24, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase" }}>Works for every type of business</p>
          <div className="biz-g">{businesses.map(b => <div key={b} className="bc">{b}</div>)}</div>
        </div>
      </section>
      <div className="div-glow" />

      {/* ── USE CASES ── */}
      <section className="sec" style={{ position: "relative", zIndex: 1 }}>
        <div className="w">
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span className="pill">Real results</span>
            <h2 className="nt" style={{ fontSize: "clamp(28px,3.8vw,46px)", marginTop: 18, marginBottom: 14 }}>See how businesses <span style={{ background: "linear-gradient(135deg,#22C55E,#34D399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>actually use EnaTalk</span></h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.48)", maxWidth: 460, margin: "0 auto", lineHeight: 1.8 }}>From salons to restaurants to jewellery shops — here's how real businesses grow with WhatsApp.</p>
          </div>
          <div className="case-g">
            {useCases.map((c, i) => (
              <div key={i} className="case-card">
                <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
                  <img src={c.img} alt={c.tag} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .4s" }} onMouseOver={e => (e.currentTarget.style.transform = "scale(1.05)")} onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(4,11,28,0.8) 0%,transparent 50%)" }} />
                  <span style={{ position: "absolute", bottom: 14, left: 16, background: "rgba(34,197,94,0.9)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100 }}>{c.tag}</span>
                </div>
                <div style={{ padding: "22px 22px 26px", background: "rgba(255,255,255,0.025)" }}>
                  <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 10, letterSpacing: "-.3px", lineHeight: 1.3 }}>{c.title}</h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.52)", lineHeight: 1.75 }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ position: "relative", zIndex: 1, background: "rgba(255,255,255,0.012)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "80px 0" }}>
        <div className="w">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span className="pill">What they say</span>
            <h2 className="nt" style={{ fontSize: "clamp(28px,3.8vw,44px)", marginTop: 18, marginBottom: 14 }}>Real business owners. <span style={{ background: `linear-gradient(135deg,${GOLD},#FBBF24)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Real results.</span></h2>
          </div>
          <div className="testi-g">
            {testimonials.map((t, i) => (
              <div key={i} className="testi-card">
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>{Array(t.rating).fill(0).map((_, j) => <span key={j} className="star">★</span>)}</div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.68)", lineHeight: 1.8, marginBottom: 20, fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={t.img} alt={t.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: `2px solid rgba(34,197,94,0.4)` }} />
                  <div><div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.42)", marginTop: 2 }}>{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="sec" style={{ position: "relative", zIndex: 1 }}>
        <div className="w">
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span className="pill">Simple process</span>
            <h2 className="nt" style={{ fontSize: "clamp(28px,3.8vw,46px)", marginTop: 18, marginBottom: 14 }}>From zero to sending in <span style={{ background: "linear-gradient(135deg,#22C55E,#34D399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>4 steps</span></h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.48)", maxWidth: 460, margin: "0 auto", lineHeight: 1.8 }}>No training needed. No IT team required. All from your phone.</p>
          </div>
          <div className="step-g">
            {steps.map((s, i) => (
              <div key={i} className="sc">
                <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "clamp(36px,5vw,52px)", fontWeight: 800, color: "rgba(34,197,94,0.12)", marginBottom: 16, letterSpacing: "-2px", lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 26, marginBottom: 16 }}>{s.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 10 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.48)", lineHeight: 1.75 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="sec" style={{ position: "relative", zIndex: 1, background: "rgba(255,255,255,0.012)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="w">
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span className="pill">Why EnaTalk</span>
            <h2 className="nt" style={{ fontSize: "clamp(28px,3.8vw,46px)", marginTop: 18, marginBottom: 14 }}>Simple to use. <span style={{ background: `linear-gradient(135deg,${GOLD},#FBBF24)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Powerful results.</span></h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.48)", maxWidth: 460, margin: "0 auto", lineHeight: 1.8 }}>A clean, focused platform that gets out of your way and lets you connect with customers.</p>
          </div>
          <div className="feat-g">
            {features.map((f, i) => (
              <div key={i} className="fc">
                <div style={{ width: 52, height: 52, borderRadius: 16, background: `${f.col}18`, border: `1px solid ${f.col}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 20 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 10 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.48)", lineHeight: 1.75 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPLIANCE ── */}
      <section id="compliance" className="sec" style={{ position: "relative", zIndex: 1 }}>
        <div className="w">
          <div className="comp-g">
            <div>
              <span className="pill" style={{ marginBottom: 20, display: "inline-flex" }}>Trust & Compliance</span>
              <h2 className="nt" style={{ fontSize: "clamp(28px,3.8vw,44px)", marginTop: 18, marginBottom: 14 }}>Built to meet <span style={{ background: "linear-gradient(135deg,#22C55E,#34D399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>WhatsApp's Policy</span></h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.48)", lineHeight: 1.8, marginBottom: 36, maxWidth: 440 }}>We take compliance seriously so your account stays protected and your business keeps growing.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {complianceItems.map((c, i) => (
                  <div key={i} className="comp-item">
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "1.5px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: G, fontSize: 16, flexShrink: 0, fontWeight: 700 }}>✓</div>
                    <div><div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#fff" }}>{c.title}</div><div style={{ fontSize: 13, color: "rgba(255,255,255,0.48)", lineHeight: 1.7 }}>{c.desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "28px 28px 24px" }}>
                <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 20, color: "#fff" }}>Supported business types</div>
                {["Retail & E-Commerce", "Healthcare (non-prescription)", "Education & Coaching", "Financial Services", "Real Estate", "SaaS & Technology", "Tours & Travel", "Salons & Wellness"].map((t, i, arr) => (
                  <div key={t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <span style={{ color: "rgba(255,255,255,0.58)" }}>{t}</span>
                    <span style={{ color: G, fontWeight: 700, fontSize: 12 }}>✓ Supported</span>
                  </div>
                ))}
                <div style={{ marginTop: 16, padding: "12px 14px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 12, fontSize: 11, color: "rgba(255,255,255,0.38)", lineHeight: 1.65 }}>
                  EnaTalk does not support businesses selling goods prohibited under WhatsApp's Commerce Policy including alcohol, tobacco, adult content, gambling, or weapons.
                </div>
              </div>
              <div style={{ background: "linear-gradient(135deg,rgba(34,197,94,0.08),rgba(34,197,94,0.04))", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 20, padding: "24px 28px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🔒</div>
                <div><div style={{ fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 4 }}>Powered by Meta's Official API</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>EnaTalk uses WhatsApp Business Cloud API — the same infrastructure trusted by thousands of businesses globally.</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section className="sec" style={{ position: "relative", zIndex: 1, background: "rgba(255,255,255,0.012)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="w">
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span className="pill">EnaTalk vs others</span>
            <h2 className="nt" style={{ fontSize: "clamp(28px,3.8vw,46px)", marginTop: 18, marginBottom: 14 }}>How we compare</h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.48)", maxWidth: 460, margin: "0 auto", lineHeight: 1.8 }}>Other platforms charge more and deliver less.</p>
          </div>
          <div style={{ maxWidth: 700, margin: "0 auto", overflowX: "auto" }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{ textAlign: "left", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.38)", fontWeight: 600, fontSize: 12, letterSpacing: ".05em" }}>Feature</th>
                  <th style={{ textAlign: "center", background: "linear-gradient(135deg,#16A34A,#22C55E)", color: "#fff", fontWeight: 800, fontSize: 15 }}>EnaTalk ✦</th>
                  <th style={{ textAlign: "center", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.38)", fontWeight: 600 }}>Wati / AiSensy</th>
                </tr>
              </thead>
              <tbody>
                {["Works on mobile phone", "Setup in 5 minutes", "Hindi & regional languages", "Auto birthday / festival wishes", "Free plan available", "Zero message price markup", "Works for any business size", "Dedicated compliance section"].map((f, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.05)", background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent", color: "rgba(255,255,255,0.72)" }}>{f}</td>
                    <td style={{ textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", background: i % 2 === 0 ? "rgba(34,197,94,0.04)" : "rgba(34,197,94,0.02)", fontSize: 18 }}>✅</td>
                    <td style={{ textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent", fontSize: 18 }}>❌</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="sec" style={{ position: "relative", zIndex: 1, background: "rgba(255,255,255,0.012)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="w">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span className="pill">Pricing</span>
            <h2 className="nt" style={{ fontSize: "clamp(28px,3.8vw,46px)", marginTop: 18, marginBottom: 14 }}>Simple pricing. <span style={{ background: `linear-gradient(135deg,${G},#34D399)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>No surprises.</span></h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.48)", maxWidth: 500, margin: "0 auto 28px", lineHeight: 1.8 }}>WhatsApp message costs passed through at <strong style={{ color: "#fff" }}>zero markup</strong>. You pay exactly what Meta charges.</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 100, padding: "6px 20px" }}>
              <button onClick={() => setPricingAnnual(false)} style={{ fontSize: 13, fontWeight: 700, padding: "6px 16px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", background: !pricingAnnual ? "#fff" : "transparent", color: !pricingAnnual ? "#040B1C" : "rgba(255,255,255,0.45)", transition: "all .2s" }}>Monthly</button>
              <button onClick={() => setPricingAnnual(true)} style={{ fontSize: 13, fontWeight: 700, padding: "6px 16px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", background: pricingAnnual ? "linear-gradient(135deg,#22C55E,#16A34A)" : "transparent", color: pricingAnnual ? "#fff" : "rgba(255,255,255,0.45)", transition: "all .2s", boxShadow: pricingAnnual ? "0 4px 12px rgba(34,197,94,0.35)" : "none" }}>
                Annual <span style={{ fontSize: 11, background: "rgba(255,255,255,0.15)", padding: "1px 6px", borderRadius: 100, marginLeft: 4 }}>Save 20%</span>
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 16, alignItems: "start", marginBottom: 40 }}>
            {[
              { name: "Free", price: 0, annualPrice: 0, desc: "Try EnaTalk with no commitment", cta: "Start Free", ctaStyle: "ghost", popular: false, usage: [{ label: "Messages / month", val: "500" }, { label: "Contacts", val: "50" }, { label: "WhatsApp numbers", val: "1" }, { label: "Team members", val: "1" }, { label: "Broadcast campaigns", val: "—" }, { label: "API calls / month", val: "—" }], features: [{ t: "Campaign builder (basic)", on: true }, { t: "5 message templates", on: true }, { t: "Manual contact add", on: true }, { t: "EnaTalk branding", on: true }, { t: "Birthday automation", on: false }, { t: "CSV import", on: false }, { t: "Analytics dashboard", on: false }, { t: "Webhooks & API", on: false }, { t: "Priority support", on: false }] },
              { name: "Starter", price: 299, annualPrice: 239, desc: "For solo shop owners & freelancers", cta: "Start 14-day Trial", ctaStyle: "ghost", popular: false, usage: [{ label: "Messages / month", val: "3,000" }, { label: "Contacts", val: "500" }, { label: "WhatsApp numbers", val: "1" }, { label: "Team members", val: "2" }, { label: "Broadcast campaigns", val: "5 / mo" }, { label: "API calls / month", val: "10,000" }], features: [{ t: "Campaign builder", on: true }, { t: "20 message templates", on: true }, { t: "CSV import (500 rows)", on: true }, { t: "Birthday automation", on: true }, { t: "Basic analytics", on: true }, { t: "Hindi & regional languages", on: true }, { t: "Webhooks & API", on: false }, { t: "Team inbox", on: false }, { t: "Priority support", on: false }] },
              { name: "Growth", price: 799, annualPrice: 639, desc: "For growing businesses & small chains", cta: "Start 14-day Trial", ctaStyle: "primary", popular: true, usage: [{ label: "Messages / month", val: "10,000" }, { label: "Contacts", val: "5,000" }, { label: "WhatsApp numbers", val: "2" }, { label: "Team members", val: "5" }, { label: "Broadcast campaigns", val: "Unlimited" }, { label: "API calls / month", val: "1,00,000" }], features: [{ t: "Advanced campaign builder", on: true }, { t: "Unlimited templates", on: true }, { t: "CSV import (unlimited)", on: true }, { t: "Birthday & festival automation", on: true }, { t: "Full analytics + reports", on: true }, { t: "Hindi & regional languages", on: true }, { t: "Webhooks & REST API", on: true }, { t: "Shared team inbox", on: true }, { t: "Email support (24hr)", on: true }] },
              { name: "Pro", price: 1499, annualPrice: 1199, desc: "For multi-location businesses & enterprises", cta: "Start 14-day Trial", ctaStyle: "ghost", popular: false, usage: [{ label: "Messages / month", val: "Unlimited" }, { label: "Contacts", val: "Unlimited" }, { label: "WhatsApp numbers", val: "5" }, { label: "Team members", val: "Unlimited" }, { label: "Broadcast campaigns", val: "Unlimited" }, { label: "API calls / month", val: "Unlimited" }], features: [{ t: "Everything in Growth", on: true }, { t: "Advanced automation flows", on: true }, { t: "Multi-number management", on: true }, { t: "Custom integrations", on: true }, { t: "Analytics export (CSV/PDF)", on: true }, { t: "Role-based team access", on: true }, { t: "Dedicated account manager", on: true }, { t: "WhatsApp priority support", on: true }, { t: "SLA guarantee", on: true }] },
            ].map(plan => {
              const price = pricingAnnual ? plan.annualPrice : plan.price;
              const isPrimary = plan.ctaStyle === "primary";
              return (
                <div key={plan.name} style={{ background: plan.popular ? "linear-gradient(160deg,rgba(34,197,94,0.09),rgba(34,197,94,0.03))" : "rgba(255,255,255,0.025)", border: plan.popular ? "1.5px solid rgba(34,197,94,0.35)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "28px 24px", position: "relative", transform: plan.popular ? "translateY(-8px)" : "none", boxShadow: plan.popular ? "0 24px 60px rgba(34,197,94,0.10)" : "none" }}>
                  {plan.popular && <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#22C55E,#16A34A)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "5px 14px", borderRadius: 100, whiteSpace: "nowrap", letterSpacing: "0.06em", boxShadow: "0 4px 14px rgba(34,197,94,0.4)" }}>✦ MOST POPULAR</div>}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: plan.popular ? "#22C55E" : "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{plan.name}</div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 6 }}>
                      {price === 0 ? <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 42, color: "#fff", letterSpacing: "-2px", lineHeight: 1 }}>Free</span> : <><span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 42, color: "#fff", letterSpacing: "-2px", lineHeight: 1 }}>₹{price.toLocaleString("en-IN")}</span><span style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", marginBottom: 6 }}>/mo</span></>}
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.32)", marginBottom: 8 }}>{price === 0 ? "No credit card required" : pricingAnnual ? "billed annually" : "billed monthly"}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.48)", lineHeight: 1.6 }}>{plan.desc}</div>
                  </div>
                  <a href="https://app.enatalk.com/login" style={{ display: "block", textAlign: "center", padding: "12px", borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: "none", marginBottom: 24, background: isPrimary ? "linear-gradient(135deg,#22C55E,#16A34A)" : "rgba(255,255,255,0.06)", border: isPrimary ? "none" : "1px solid rgba(255,255,255,0.12)", color: "#fff", boxShadow: isPrimary ? "0 6px 20px rgba(34,197,94,0.35)" : "none" }}>{plan.cta}</a>
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Usage limits</div>
                    {plan.usage.map((u, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < plan.usage.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.42)" }}>{u.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: u.val === "—" ? "rgba(255,255,255,0.2)" : plan.popular ? "#22C55E" : "#fff" }}>{u.val}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Features included</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    {plan.features.map((f, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: f.on ? (plan.popular ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.65)") : "rgba(255,255,255,0.2)" }}>
                        <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1, color: f.on ? (plan.popular ? "#22C55E" : "rgba(34,197,94,0.7)") : "rgba(255,255,255,0.15)", fontWeight: 700 }}>{f.on ? "✓" : "✕"}</span>
                        <span style={{ textDecoration: f.on ? "none" : "line-through", lineHeight: 1.5 }}>{f.t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div style={{ background: "rgba(245,184,0,0.05)", border: "1px solid rgba(245,184,0,0.16)", borderRadius: 16, padding: "20px 24px", display: "flex", gap: 16, alignItems: "flex-start", maxWidth: 800, margin: "0 auto 28px" }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: GOLD, marginBottom: 6 }}>WhatsApp message costs — billed separately at zero markup</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginTop: 8 }}>
                {[{ type: "Marketing", rate: "~₹0.58", desc: "Promotions & campaigns" }, { type: "Utility", rate: "~₹0.14", desc: "Order updates, reminders" }, { type: "Authentication", rate: "~₹0.12", desc: "OTPs & verifications" }, { type: "Service", rate: "Free", desc: "Customer replies within 24hr" }].map(m => (
                  <div key={m.type} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 14px" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>{m.type}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "'Bricolage Grotesque',sans-serif" }}>{m.rate}<span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 400 }}> /conversation</span></div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{m.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", padding: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>How we compare</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Wati <span style={{ textDecoration: "line-through" }}>₹2,399/mo</span></span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>AiSensy <span style={{ textDecoration: "line-through" }}>₹999/mo</span></span>
              <span style={{ fontSize: 14, color: "#22C55E", fontWeight: 700 }}>EnaTalk from ₹0 →</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="sec" style={{ position: "relative", zIndex: 1 }}>
        <div className="w">
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span className="pill">FAQ</span>
            <h2 className="nt" style={{ fontSize: "clamp(28px,3.8vw,46px)", marginTop: 18, marginBottom: 14 }}>Common questions</h2>
          </div>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: "4px 28px" }}>
              {faqs.map((faq, i) => (
                <div key={i} className="faq-i">
                  <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{faq.q}</span>
                    <span style={{ minWidth: 30, height: 30, borderRadius: "50%", background: openFaq === i ? "linear-gradient(135deg,#22C55E,#16A34A)" : "rgba(255,255,255,0.07)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, transition: "all .25s", flexShrink: 0, boxShadow: openFaq === i ? "0 4px 12px rgba(34,197,94,0.35)" : "none" }}>
                      {openFaq === i ? "−" : "+"}
                    </span>
                  </button>
                  {openFaq === i && <p style={{ fontSize: 14, color: "rgba(255,255,255,0.52)", lineHeight: 1.8, paddingBottom: 20 }}>{faq.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "100px 0", borderTop: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 100%,rgba(34,197,94,0.09) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div className="w" style={{ position: "relative" }}>
          <div className="cta-g">
            <div>
              <span className="pill" style={{ marginBottom: 20, display: "inline-flex" }}>Get started today</span>
              <h2 className="nt" style={{ fontSize: "clamp(28px,3.8vw,50px)", marginTop: 18, marginBottom: 18, lineHeight: 1.08 }}>Join 1,000+ businesses<br />growing with <span style={{ background: "linear-gradient(135deg,#22C55E,#34D399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>WhatsApp</span></h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.48)", lineHeight: 1.82, marginBottom: 32, maxWidth: 440 }}>Free to start. No credit card. Works on your phone. Whether you run one shop or fifty locations — EnaTalk connects you to your customers in minutes.</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["🎂 Auto birthday & festivals", "📱 100% mobile", "🌐 Hindi & regional", "💰 No hidden fees", "🏢 Any business size"].map(b => (
                  <span key={b} style={{ fontSize: 13, color: G, background: "rgba(34,197,94,0.08)", padding: "8px 18px", borderRadius: 100, border: "1px solid rgba(34,197,94,0.18)", fontWeight: 600 }}>{b}</span>
                ))}
              </div>
            </div>
            <div><AuthBox /></div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#020810", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "36px 28px", position: "relative", zIndex: 1 }}>
        <div className="w" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
          <div>
            {/* ── FOOTER LOGO — exact same as nav ── */}
            <img
              src="/enatalk-logo.webp"
              alt="EnaTalk"
              style={{ height: 100, width: "auto", objectFit: "contain", maxWidth: 160, display: "block", marginBottom: 10, filter: "drop-shadow(0 0 10px rgba(245,184,0,0.5)) drop-shadow(0 0 20px rgba(27,75,138,0.4)) brightness(1.15)" }}
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", lineHeight: 1.7 }}>Official WhatsApp Business API · Made in India 🇮🇳</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 4 }}>Ramkrishna Upanibesh Jadavpur, Kolkata, West Bengal 700092</p>
          </div>
          <div style={{ display: "flex", gap: 0, flexWrap: "wrap", alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 160 }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Legal</p>
              {[["Privacy Policy", "/privacy-policy"], ["Terms of Service", "/terms"], ["Refund Policy", "/refund-policy"], ["Acceptable Use", "/acceptable-use"], ["Contact Us", "/contact"]].map(([l, h]) => (
                <a key={l} href={h} className="foot-a">{l}</a>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 160, marginLeft: 48 }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Contact</p>
              <a href="mailto:support@enatalk.com" className="foot-a">support@enatalk.com</a>
              <a href="/contact" className="foot-a">Contact Page →</a>
            </div>
          </div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", width: "100%", textAlign: "center", paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            © {new Date().getFullYear()} EnaTalk. All rights reserved. · WhatsApp is a trademark of WhatsApp LLC. EnaTalk is not affiliated with Meta Platforms, Inc.
          </p>
        </div>
      </footer>

      <CookieBanner />
      <PolicyModal />
    </div>
  );
}
