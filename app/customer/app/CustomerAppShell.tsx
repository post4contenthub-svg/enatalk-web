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
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm font-bold text-white">
          E
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">EnaTalk</span>
          <span className="text-xs text-muted-foreground">Customer Portal</span>
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
              className={[
                "flex items-center rounded-lg px-3 py-2 text-sm transition",
                active
                  ? "bg-emerald-50 text-emerald-700 font-medium"
                  : "text-slate-600 hover:bg-slate-50",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3 text-xs text-slate-500">
        <div className="flex items-center justify-between">
          <span>Trial: 7 days left</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-slate-200">
          <div className="h-1.5 w-1/3 rounded-full bg-emerald-500" />
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
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex flex-col">
        <span className="text-sm font-semibold">Demo Workspace</span>
        <span className="text-xs text-muted-foreground">
          WhatsApp marketing made simple
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Trial – 7 days left
        </div>

        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold">
          CU
        </button>
      </div>
    </header>
  );
}

export default function CustomerAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
