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
          redirectTo: `${window.location.origin}/auth/callback`,
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
        data: { business_type: businessType },  // Store business type in user metadata
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
      router.push("/dashboard");
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
      <div className="w-full max-w-md p-8 rounded-xl bg-slate-800 border border-slate-700 shadow-xl">
        <h1 className="text-2xl font-semibold text-center mb-6">Sign Up for EnaTalk</h1>

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors mb-4"
        >
          {loading ? "Connecting..." : "Sign Up with Google"}
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-800 text-slate-400">Or</span>
          </div>
        </div>

        {!showOtp && !showEmailForm ? (
          <button
            onClick={() => setShowEmailForm(true)}
            className="w-full bg-slate-700 text-white py-3 rounded-lg font-medium hover:bg-slate-600 transition-colors"
          >
            Sign Up with Email
          </button>
        ) : !showOtp ? (
          <form onSubmit={(e) => { e.preventDefault(); handleInitialSignup(); }}>
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 p-3 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-3 p-3 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <select
              className="w-full mb-4 p-3 rounded-lg bg-slate-900 border border-slate-600 text-white focus:border-emerald-500 focus:outline-none"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              disabled={loading}
              required
            >
              <option value="">Select Business Type</option>
              <option value="insurance">Insurance</option>
              <option value="cafe">Cafe</option>
              <option value="nursery">Nursery</option>
              <option value="tour_travels">Tour & Travels</option>
              <option value="homestay">Homestay</option>
              <option value="jewellery_shop">Jewellery Shop</option>
              <option value="salon">Salon</option>
              <option value="motorcycle_service">Motorcycle Service</option>
              <option value="tailor">Tailor</option>
              <option value="other">Other</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-60 transition-colors"
            >
              {loading ? "Sending Code..." : "Sign Up & Send Verification Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }}>
            <input
              type="text"
              placeholder="Enter Verification Code"
              className="w-full mb-4 p-3 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-60 transition-colors"
            >
              {loading ? "Verifying..." : "Verify & Start Trial"}
            </button>
          </form>
        )}

        <p className="text-center mt-4 text-slate-400 text-sm">
          Already have an account? <a href="/auth/login" className="text-emerald-500 hover:underline">Log In</a>
        </p>
      </div>
    </div>
  );
}