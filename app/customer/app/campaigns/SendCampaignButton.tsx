"use client";

import { useState } from "react";

export function SendCampaignButton({ campaignId }: { campaignId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!confirm("Send this campaign now?")) return;

    try {
      setLoading(true);

      const res = await fetch(
        `/api/customer/campaigns/${campaignId}/send`,
        { method: "POST" }
      );

      const json = await res.json();

      if (!res.ok) {
        alert(json?.error || "Failed to send campaign");
        return;
      }

      alert("Campaign sent successfully ✅");
      window.location.reload();
    } catch (e: any) {
      alert(e.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white disabled:opacity-60"
    >
      {loading ? "Sending…" : "Send now"}
    </button>
  );
}
