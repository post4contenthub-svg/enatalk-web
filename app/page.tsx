import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies(); // ✅ FIX HERE

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Not logged in → auth UI
  if (!session) {
    redirect("https://enatalk.com/enatalk-auth/?mode=login");
  }

  const role = session.user.user_metadata?.role;

  // Customer trying to access admin
  if (role !== "admin") {
    redirect("https://app.enatalk.com/customer/app");
  }

  // Admin allowed
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-xl font-semibold">Admin Panel</h1>
    </div>
  );
}
