// app/login/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function LoginPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {}
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // If already logged in → show message + link (NO redirect!)
  if (user) {
    return (
      <div style={{ padding: "60px", textAlign: "center", fontFamily: "sans-serif" }}>
        <h1>You are already signed in!</h1>
        <p>Great — you don't need to login again.</p>
        <br />
        <a 
          href="/customer/app" 
          style={{ 
            background: "#0070f3", 
            color: "white", 
            padding: "12px 24px", 
            borderRadius: "6px", 
            textDecoration: "none",
            fontSize: "18px"
          }}
        >
          Go to Dashboard →
        </a>
      </div>
    );
  }

  // Not logged in → show Google login (and add email form later if you want)
  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "auto", textAlign: "center" }}>
      <h1>Sign in to EnaTalk</h1>
      <br />

      {/* Google Login Link/Button */}
      <a
        href="/api/auth/google"  // ← change this to your real Google sign-in route if different
        style={{
          background: "#4285F4",
          color: "white",
          padding: "12px 30px",
          borderRadius: "4px",
          textDecoration: "none",
          fontSize: "16px",
          display: "inline-block"
        }}
      >
        Continue with Google
      </a>

      <p style={{ marginTop: "40px", color: "#666" }}>
        Or use email + password (coming soon)
      </p>
    </div>
  );
}