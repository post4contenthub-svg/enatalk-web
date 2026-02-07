"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.message);
    } else if (data.user) {
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 14);
      await supabase.from("user_subscriptions").insert({
        user_id: data.user.id,
        subscription_status: "trial",
        trial_end: trialEnd.toISOString(),
        credits: 500,  // Start with 500 free credits for trial
      });
      await supabase.from("user_profiles").insert({
        user_id: data.user.id,
        business_type,
      });
      window.location.href = "/dashboard";
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
      <h1 className="text-2xl mb-4">Sign Up for EnaTalk</h1>
      <input type="email" placeholder="Email" className="mb-2 p-2 rounded bg-slate-800 border border-slate-600" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" className="mb-2 p-2 rounded bg-slate-800 border border-slate-600" value={password} onChange={(e) => setPassword(e.target.value)} />
      <select className="mb-4 p-2 rounded bg-slate-800 border border-slate-600" value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
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
      <button onClick={handleSignup} disabled={loading} className="bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-700">
        {loading ? "Signing Up..." : "Start 14-Day Free Trial"}
      </button>
    </div>
  );
}