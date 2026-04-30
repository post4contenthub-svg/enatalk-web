"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);

  async function handleGoogleSignup() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "https://app.enatalk.com/auth/callback",
          queryParams: { prompt: "select_account" },
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Google signup error:", error);
      alert("Failed to start Google signup.");
    } finally {
      setLoading(false);
    }
  }

  async function handleInitialSignup() {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { business_type: businessType },
        emailRedirectTo: "https://app.enatalk.com/auth/callback",
      },
    });
    if (error) {
      alert(error.message);
    } else {
      setShowOtp(true);
      alert("Verification code sent to your email!");
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 14);
      await supabase.from("user_subscriptions").insert({
        user_id: data.user?.id,
        subscription_status: "trial",
        trial_end: trialEnd.toISOString(),
        credits: 500,
      });
      await supabase.from("user_profiles").insert({
        user_id: data.user?.id,
        business_type: businessType,
      });
    }
    setLoading(false);
  }

  async function handleVerifyOtp() {
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "signup",
    });
    if (error) {
      alert(error.message);
    } else {
      router.push("/customer/app");
    }
    setLoading(false);
  }

  const inp: React.CSSProperties = {
    width: "100%", padding: "13px 16px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 12, color: "#fff", fontSize: 14,
    fontFamily: "'DM Sans',sans-serif", outline: "none",
  };

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#040B1C", color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bricolage+Grotesque:wght@700;800&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;} input::placeholder{color:rgba(255,255,255,0.28);} select option{background:#0F1E3E;color:#fff;} input:focus,select:focus{outline:none!important;border-color:rgba(34,197,94,0.5)!important;}`}</style>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "radial-gradient(ellipse 80% 60% at 70% 0%,rgba(34,197,94,0.10) 0%,transparent 60%),#040B1C" }}/>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440, padding: "24px 20px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <a href="https://enatalk.com">
            <img src="/enatalk-logo.webp" alt="EnaTalk" style={{ height: 52, width: "auto", objectFit: "contain", filter: "drop-shadow(0 0 10px rgba(245,184,0,0.4))" }}/>
          </a>
        </div>

        {/* Card */}
        <div style={{ background: "linear-gradient(160deg,rgba(15,25,55,0.96),rgba(10,20,40,0.98))", backdropFilter: "blur(32px)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 24, padding: "32px 28px", boxShadow: "0 40px 100px rgba(0,0,0,0.6)" }}>

          <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: "-0.5px", textAlign: "center", marginBottom: 24 }}>
            {showOtp ? "Verify your email" : "Sign up for EnaTalk"}
          </h1>

          {!showOtp && (
            <>
              {/* Google */}
              <button onClick={handleGoogleSignup} disabled={loading} style={{ width: "100%", padding: "13px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)", color: "#fff", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 18 }}>
                <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/><path fill="#FBBC05" d="M3.964 10.706c-.18-.54-.282-1.117-.282-1.706s.102-1.166.282-1.706V4.962H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.038l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z"/></svg>
                {loading ? "Connecting…" : "Continue with Google"}
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }}/>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>or</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }}/>
              </div>
            </>
          )}

          {/* Email form */}
          {!showOtp && !showEmailForm && (
            <button onClick={() => setShowEmailForm(true)} style={{ width: "100%", padding: "13px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.8)", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
              Sign Up with Email
            </button>
          )}

          {!showOtp && showEmailForm && (
            <form onSubmit={e => { e.preventDefault(); handleInitialSignup(); }} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} style={inp}/>
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} style={inp}/>
              <select value={businessType} onChange={e => setBusinessType(e.target.value)} required disabled={loading} style={{ ...inp, color: businessType ? "#fff" : "rgba(255,255,255,0.3)" }}>
                <option value="" disabled>Select your business type</option>
                {[["salon","Salon / Spa / Beauty"],["cafe","Café / Restaurant"],["jewellery_shop","Jewellery Shop"],["tour_travels","Tours & Travels"],["homestay","Hotel / Homestay"],["nursery","Nursery / Plants"],["tailor","Tailor / Boutique"],["motorcycle_service","Motorcycle Service"],["insurance","Insurance"],["other","Other"]].map(([v,l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
              <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#22C55E,#16A34A)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 6px 20px rgba(34,197,94,0.4)", marginTop: 4 }}>
                {loading ? "Sending Code…" : "🚀 Create Free Account"}
              </button>
            </form>
          )}

          {/* OTP */}
          {showOtp && (
            <form onSubmit={e => { e.preventDefault(); handleVerifyOtp(); }} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, textAlign: "center" }}>
                We sent a code to <strong style={{ color: "#fff" }}>{email}</strong>
              </p>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
                disabled={loading}
                style={{
                  width: "100%", padding: "13px 16px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 12, color: "#fff",
                  fontFamily: "'DM Sans',sans-serif", outline: "none",
                  textAlign: "center", letterSpacing: 4, fontSize: 20,
                }}
              />
              <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#22C55E,#16A34A)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 6px 20px rgba(34,197,94,0.4)" }}>
                {loading ? "Verifying…" : "✅ Verify & Start Free"}
              </button>
            </form>
          )}

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            Already have an account?{" "}
            <a href="/auth/login" style={{ color: "#22C55E", fontWeight: 600, textDecoration: "none" }}>Log In</a>
          </p>
          <p style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
            <a href="https://enatalk.com" style={{ color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>← Back to enatalk.com</a>
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
          No credit card · 14-day free trial · Cancel anytime
        </p>
      </div>
    </div>
  );
}
