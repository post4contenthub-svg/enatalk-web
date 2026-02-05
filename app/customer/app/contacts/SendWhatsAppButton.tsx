// app/customer/app/contacts/SendWhatsAppButton.tsx
"use client";

import { useState } from "react";

type Props = {
  phone: string;
  tenantId: string;
};

export function SendWhatsAppButton({ phone, tenantId }: Props) {
  const [loading, setLoading] = useState(false);

  const hasPhone = !!phone && phone.trim().length > 0;

  async function handleClick() {
    if (!hasPhone) {
      window.alert("This contact does not have a valid phone number.");
      return;
    }

    const body = window.prompt(
      `Send WhatsApp to ${phone}:\n\nType your message below:`,
      "Hello from Enatalk!"
    );

    if (!body || !body.trim()) {
      // user cancelled or left it empty
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/customer/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, body: body.trim(), tenantId }),
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        // ignore parse error, we'll handle by status
      }

      if (!res.ok) {
        console.error("Send error:", json);
        const msg =
          (json && (json.error || json.message)) ||
          `Failed to send (HTTP ${res.status})`;
        window.alert(`Failed to send: ${msg}`);
        return;
      }

      window.alert("Message sent successfully ✅");
    } catch (err: any) {
      console.error(err);
      window.alert(err?.message || "Unexpected error sending message");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || !hasPhone}
      className="rounded-md border px-2 py-1 text-[10px] font-medium text-slate-800 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
      title={!hasPhone ? "No phone number for this contact" : "Send WhatsApp"}
    >
      {loading ? "Sending..." : "Send WhatsApp"}
    </button>
  );
}