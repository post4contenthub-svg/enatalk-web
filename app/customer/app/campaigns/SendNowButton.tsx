"use client";

import { useState } from "react";

const TENANT_ID = "5ddd6091-ba29-4b65-8684-f9da79f28af7";

export function SendNowButton({ campaignId }: { campaignId: string }) {
  const [loading, setLoading] = useState(false);

  async function sendNow() {
    if (!confirm("Send this campaign now?")) return;

    try {
      setLoading(true);

      const res = await fetch(
        `/api/customer/campaigns/${campaignId}/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tenantId: TENANT_ID,
          }),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "Failed to send campaign");
        return;
      }

      alert(
        `Campaign processed.\nSent: ${json.sent}\nFailed: ${json.failed}`
      );

      // refresh page to show updated counts/status
      window.location.reload();
    } catch (err: any) {
      alert(err?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={sendNow}
      disabled={loading}
      className="rounded border px-2 py-1 text-xs disabled:opacity-50"
    >
      {loading ? "Sending..." : "Send now"}
    </button>
  );
}