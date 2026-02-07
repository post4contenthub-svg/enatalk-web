"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CustomerAppPage() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // ❌ Not logged in
      if (!user) {
        router.replace("/auth/login");
        return;
      }

      // 🔍 Check WhatsApp connection
      const { data: waAccount } = await supabase
        .from("tenant_whatsapp_accounts")
        .select("id")
        .eq("tenant_id", user.id)
        .maybeSingle();

      // ❌ WhatsApp not connected
      if (!waAccount) {
        router.replace("/customer/app/connect-whatsapp");
        return;
      }

      // ✅ All good
      router.replace("/customer/app/contacts");
    };

    run();
  }, [router, supabase]);

  return (
    <div className="p-8 text-white">
      Checking your account…
    </div>
  );
}
