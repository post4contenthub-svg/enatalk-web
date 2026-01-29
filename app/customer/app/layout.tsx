"use client";

import { useEffect, useState } from "react";
import CustomerAppShell from "./CustomerAppShell";
import { createClient } from "@supabase/supabase-js";

export default function CustomerAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [workspace, setWorkspace] = useState<any>(null);
  const [status, setStatus] = useState<
    "checking" | "unauthenticated" | "ready"
  >("checking");

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        setStatus("unauthenticated");
        return;
      }

      const { data: workspace } = await supabase
        .from("workspaces")
        .select("*")
        .eq("owner_id", data.session.user.id)
        .single();

      setWorkspace(workspace);
      setStatus("ready");
    });
  }, []);

  // ⏳ Loading
  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300">
        Loading dashboard…
      </div>
    );
  }

  // 🔐 Redirect ONCE (no blinking)
  if (status === "unauthenticated") {
    window.location.replace("/auth");
    return null;
  }

  // ✅ Logged in
  return (
    <CustomerAppShell workspace={workspace}>
      {children}
    </CustomerAppShell>
  );
}