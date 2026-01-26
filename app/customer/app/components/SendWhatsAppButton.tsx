"use client";

import { useState } from "react";

type Props = {
  phone: string;
  tenantId: string;
};

export function SendWhatsAppButton({ phone, tenantId }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!phone) {
      alert("This contact does not have a phone number.");
      return;
    }

    const body = window.prompt(
      `Send WhatsApp to ${phone}:\n\nType your message below:`,
      "Hello from Enatalk!"
    );

    if (!body) {
      // user cancelled or empty
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/customer/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          body,
          tenantId,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        console.error("Send error:", json);
        alert(`Failed to send: ${json.error || "Unknown error"}`);
        return;
      }

      alert("Message sent successfully ✅");
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Unexpected error sending message");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      style={{
        padding: "4px 8px",
        borderRadius: 4,
        border: "1px solid #ccc",
        fontSize: 12,
        background: loading ? "#e5e5e5" : "#22c55e",
        color: "#000",
        cursor: loading ? "default" : "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {loading ? "Sending..." : "Send WhatsApp"}
    </button>
  );
}
