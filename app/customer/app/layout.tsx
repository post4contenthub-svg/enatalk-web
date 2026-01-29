"use client";

import React, { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Not logged in → redirect
      if (!session) {
       window.location.href = "https://enatalk.com/enatalk-auth?mode=login";
        return;
      }

      // Load workspace
      const { data: workspace } = await supabase
        .from("workspaces")
        .select("*")
        .eq("owner_id", session.user.id)
        .single();

      setWorkspace(workspace);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <CustomerAppShell workspace={workspace}>
      {children}
    </CustomerAppShell>
  );
}