import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Not logged in → go to auth
  if (!session) {
    redirect("https://enatalk.com/enatalk-auth/?mode=login");
  }

  const role = session.user.user_metadata?.role;

  // Logged in but not admin → send to customer app
  if (role !== "admin") {
    redirect("https://app.enatalk.com/customer/app");
  }

  // Admin is allowed
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-xl font-semibold">Admin Panel</h1>
    </div>
  );
}
