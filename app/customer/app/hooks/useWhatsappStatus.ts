"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useWhatsappStatus() {
  const supabase = createClient();
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setConnected(false);
        return;
      }

      const { data } = await supabase
        .from("tenant_whatsapp_accounts")
        .select("id")
        .eq("tenant_id", user.id)
        .maybeSingle();

      setConnected(!!data);
    };

    check();
  }, [supabase]);

  return connected;
}
