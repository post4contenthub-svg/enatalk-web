"use client";

import { useEffect, useState } from "react";
import CustomerAppShell from "./CustomerAppShell";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        Loading…
      </div>
    );
  }

  if (status === "unauthenticated") {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <p className="mb-4">You are not logged in.</p>
        <a
          href="https://enatalk.com/enatalk-auth?mode=login"
          className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}


  return (
    <CustomerAppShell workspace={workspace}>
      {children}
    </CustomerAppShell>
  );
}
