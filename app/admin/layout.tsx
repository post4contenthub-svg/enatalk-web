// app/admin/layout.tsx
import React from "react";

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
      {/* Top bar with breadcrumb + logout */}
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

      {/* Full-width content area – pages control their own layout */}
      <main className="w-full px-6 py-6">{children}</main>
    </div>
  );
}
