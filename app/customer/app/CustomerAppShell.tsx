"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-[var(--app-border)] px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--app-accent-blue)] text-sm font-bold text-white">
          E
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[var(--app-text)]">
            EnaTalk
          </span>
          <span className="text-xs text-[var(--app-text-muted)]">
            Customer Portal
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center rounded-lg px-3 py-2 text-sm transition",
                active
                  ? "bg-white/10 text-[var(--app-accent-yellow)] font-medium"
                  : "text-[var(--app-text-muted)] hover:bg-white/5",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--app-border)] p-3 text-xs text-[var(--app-text-muted)]">
        <div className="flex items-center justify-between">
          <span>Trial: 7 days left</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-white/10">
          <div className="h-1.5 w-1/3 rounded-full bg-[var(--app-accent-blue)]" />
        </div>
        <div className="mt-1 flex justify-between text-[10px]">
          <span>230 / 1000 msgs</span>
          <span>23%</span>
        </div>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--app-border)] bg-[var(--app-card)] px-6">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-[var(--app-accent-yellow)]">
          Demo Workspace
        </span>
        <span className="text-xs text-[var(--app-text-muted)]">
          WhatsApp marketing made simple
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[var(--app-accent-yellow)]">
          <span className="h-2 w-2 rounded-full bg-[var(--app-accent-blue)]" />
          Trial – 7 days left
        </div>

        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-[var(--app-text)]">
          CU
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
}) 
 {
  return (
    <div className="flex min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}