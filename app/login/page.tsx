"use client";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      // 🚨 DO NOT set redirectTo
      // Supabase MUST control the callback for PKCE
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="bg-slate-900 p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-white text-xl font-semibold mb-6">
          Sign in to EnaTalk
        </h1>

        <button
          onClick={signInWithGoogle}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
