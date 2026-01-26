// app/customer/app/layout.tsx
import React from "react";
import CustomerAppShell from "./CustomerAppShell";

export default function CustomerAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CustomerAppShell>{children}</CustomerAppShell>;
}
