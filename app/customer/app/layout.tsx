"use client";

import CustomerAppShell from "./CustomerAppShell";

export default function CustomerAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TEMP: dummy workspace until auth is restored
  const workspace = {
    name: "EnaTalk",
  };

  return (
    <CustomerAppShell workspace={workspace}>
      {children}
    </CustomerAppShell>
  );
}
