"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const base = "/customer/app";

const navItems = [
  { href: base, label: "Overview" },
  { href: `${base}/campaigns`, label: "Campaigns" },
  { href: `${base}/templates`, label: "Templates" },
  { href: `${base}/contacts`, label: "Contacts" },
  { href: `${base}/analytics`, label: "Analytics" },
  { href: `${base}/settings`, label: "Settings" },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-[var(--app-border)] bg-[var(--app-card)]">
      <div className="flex h-16 items-center gap-2 border-b border-[var(--app-border)] px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
          E
        </div>
        <div>
          <div className="text-sm font-semibold">EnaTalk</div>
          <div className="text-xs text-slate-400">Customer Portal</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm ${
                active
                  ? "bg-white/10 text-yellow-400"
                  : "text-slate-400 hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function Topbar() {
  async function logout() {
    // ✅ SIMPLE & SAFE LOGOUT
    await supabase.auth.signOut();

    // ✅ Redirect to auth app
    window.location.href = "https://app.enatalk.com/login";
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900 px-6">
      <div>
        <div className="text-sm font-semibold text-yellow-400">
          Demo Workspace
        </div>
        <div className="text-xs text-slate-400">
          WhatsApp marketing made simple
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={logout}
          className="rounded-md bg-red-500/20 px-3 py-1 text-xs text-red-400 hover:bg-red-500/30"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default function CustomerAppShell({
  children,
  workspace,
}: {
  children: React.ReactNode;
  workspace: any;
}) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
