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
  const [status, setStatus] = useState<"checking" | "unauthenticated" | "ready">(
    "checking"
  );

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session) {
          setStatus("unauthenticated");
          return;
        }

        const { data: workspace } = await supabase
          .from("workspaces")
          .select("*")
          .eq("owner_id", session.user.id)
          .single();

        setWorkspace(workspace);
        setStatus("ready");
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300">
        Loading…
      </div>
    );
  }

  if (status === "unauthenticated") {
window.location.replace("https://enatalk.com/enatalk-auth?mode=login");    return null;
  }

  return (
    <CustomerAppShell workspace={workspace}>
      {children}
    </CustomerAppShell>
  );
}