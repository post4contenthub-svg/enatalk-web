// app/admin/layout.tsx — Server Component
import React from "react";
import AdminShell from "./AdminShell";

export const metadata = {
  title: "EnaTalk Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
