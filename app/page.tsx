// app/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  // 1. Await cookies() — this is the key fix for Next.js 15+
  const cookieStore = await cookies();

  // 2. Create Supabase client with proper cookie handlers
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
          } catch (error) {
            // The 'setAll' method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  // 3. Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ✅ If logged in → redirect to customer dashboard
  if (user) {
    redirect("/customer/app");
  }

  // ❌ Not logged in → redirect to login
  redirect("/login");
}