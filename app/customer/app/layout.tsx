import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export default async function CustomerAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ MUST await cookies() in Next.js 16
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // no-op (Next handles response cookies automatically)
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🔐 HARD SERVER AUTH GUARD
  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}
