// app/admin/layout.tsx
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Enatalk Admin",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top bar */}
      <header className="w-full border-b bg-white">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="text-sm text-zinc-700">
            Enatalk <span className="text-zinc-400">/</span>{" "}
            <span className="font-semibold text-zinc-900">Admin</span>
          </div>

          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      {/* Body: sidebar + main content */}
      <div className="flex gap-6 px-6 py-6">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 rounded-xl bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-zinc-900">Admin</h2>
          <nav className="space-y-1 text-sm">
            <Link
              href="/admin"
              className="block rounded-md px-2 py-1 hover:bg-zinc-50"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/messages"
              className="block rounded-md px-2 py-1 hover:bg-zinc-50"
            >
              Messages
            </Link>
            <Link
              href="/admin/test-whatsapp"
              className="block rounded-md px-2 py-1 hover:bg-zinc-50"
            >
              Test WhatsApp
            </Link>
          </nav>
        </aside>

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
